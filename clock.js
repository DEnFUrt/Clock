/* 
Модуль таймера обратного отсчета 
Для выставления таймера в UTC+0 необходимо передавать 
параметр endTime при вызове класса Сlock в коротком формате 'YYYY-MM-DD'
Для учета часового пояса пользователя параметр deadLine
необходимо передавать в формате YYYY-MM-DDTHH:mm:ss.sss
Для корректировки часового пояса используйте полный формат даты
YYYY-MM-DDTHH:mm:ss.sssZ, где Z часовой пояс в формате +-hh:mm от UTC+0.
Так же можно передавать параметр deadLine в виде строки now+h[m, s]delta, где
  now+ - признак атрибута
  h, m, s - соответственно часы, минуты, секунды
  delta - количество часов, минут или секунд на которые надо увеличить текущее 
  время для установки точки отсчета таймера обратного отсчета 
*/

export class Clock {
  _regexTimeOptions = /^(now\b)([+])([h|m|s])([0-9]{1,6})$/;
  _regexTime = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;

  constructor(timerId) {
    this.timer = document.querySelector(`#${timerId}`);
    this.hours = this.timer.querySelector('.hours');
    this.minutes = this.timer.querySelector('.minutes');
    this.seconds = this.timer.querySelector('.seconds');
  }

  _timeStamp(deadLine) {
    let result;
    switch (true) {
      case this._regexTimeOptions.test(deadLine):
        let groups = deadLine.match(this._regexTimeOptions);
        result = Date.now() + this._addTime(groups[3], groups[4]);
        break;

      case this._regexTime.test(deadLine):
        result = Date.parse(deadLine);
        break;

      default:
        result = Date.parse('1970-01-01');
        console.error('Неверный формат даты и времени!')
        break;
    }
    return result;
  }

  _addTime(name, value) {
    let result;
    switch (name) {
      case 'h':
        result = value * 60 *60 * 1000;
        break;

      case 'm':
        result = value * 60 * 1000;
        break;

      case 's':
        result = value * 1000;
        break;

      default:
        result = 0;
        console.error(`Неверный параметр ${value}`);
    }
    return result;
  }

  _currentTime(endTime) {
    const deltaTime = endTime - Date.now(),
      seconds = Math.floor((deltaTime / 1000) % 60),
      minutes = Math.floor((deltaTime / 1000 / 60) % 60),
      hours = Math.floor((deltaTime / (1000 * 60 * 60)));

    return {
      deltaTime,
      hours,
      minutes,
      seconds,
    }
  }

  _render(interimClock) {
    this.hours.textContent = this._addLeadZero(interimClock.hours);
    this.minutes.textContent = this._addLeadZero(interimClock.minutes);
    this.seconds.textContent = this._addLeadZero(interimClock.seconds);
  }

  _addLeadZero(tempTime) {
    let clockLED;

    switch (true) {
      case tempTime < 0:
        clockLED = '00';
        break;
      case tempTime <= 9:
        clockLED = `0${tempTime.toString()}`;
        break;
      default:
        clockLED = tempTime.toString();
    }

    return clockLED;
  }

  start(deadLine, callback) {
    if (this.id) {
      return;
    }

    let endTime = this._timeStamp(deadLine);
    
    this.id = setInterval(() => {
      let interimClock = this._currentTime(endTime);

      if (interimClock.deltaTime <= 0) {
        this.stop(callback);
      }
      this._render(interimClock);
    }, 1000);
  }

  stop(callback) {
    clearInterval(this.id);
    this.id = null;
    if (typeof callback === 'function') {
      callback();
    }
  }
}
