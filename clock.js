/* 
Модуль таймера обратного отсчета 
Для выставления таймера в UTC+0 необходимо передавать 
параметр endTime при вызове класса Сlock в коротком формате 'YYYY-MM-DD'
Для учета часового пояса пользователя параметр endTime
необходимо передавать в формате YYYY-MM-DDTHH:mm:ss.sss
Для корректировки часового пояса используйте полный формат даты
YYYY-MM-DDTHH:mm:ss.sssZ, где Z часовой пояс в формате +-hh:mm от UTC+0  
*/

export class Clock {
    constructor (timerId, endTime) {
        this.endTime = endTime;
        this.timer = document.querySelector(`#${timerId}`);
        this.hours = this.timer.querySelector('.hours');
        this.minutes = this.timer.querySelector('.minutes');
        this.seconds = this.timer.querySelector('.seconds');
    }

    _getTime () {
        const deltaTime = Date.parse(this.endTime) - Date.now(),
            seconds = Math.floor( (deltaTime / 1000) % 60 ),
            minutes = Math.floor( (deltaTime / 1000 / 60) % 60),
            hours = Math.floor( (deltaTime / (1000 * 60 * 60)) );
    
        return {
            deltaTime,
            hours,
            minutes,
            seconds,
        }
    }

    _addLeadZero (tempTime) {
        let clockLED;
        
        switch(true) {
            case tempTime < 0 :
                clockLED = '00';
                break;
            case tempTime <= 9 :
                clockLED = `0${tempTime.toString()}`;
                break;
            default :
                clockLED = tempTime.toString();
                break; 
        }
    
        return clockLED;
    }

    _render(interimClock) {
        this.hours.textContent = this._addLeadZero(interimClock.hours);
        this.minutes.textContent = this._addLeadZero(interimClock.minutes);
        this.seconds.textContent = this._addLeadZero(interimClock.seconds);
    }

    start() {
        const id = setInterval( () => {
            let interimClock = this._getTime();

            if (interimClock.deltaTime <= 0) {
                clearInterval(id);
            }
            this._render(interimClock);
         });
    }
}
