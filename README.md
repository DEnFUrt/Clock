# Clock
Сlass countdown timer

Небольшой модуль для таймера обратного отсчета на сайте.
Отсчитывает часы, минуты и секунды.
Учитывает часовой пояс пользователя.
Можно запускать таймер с фиксированным шагом deadLine от текущего времени,
например +5 минут от текущего времени.
Есть возможность передать callback function которая выполнится при остановке таймера 
при достижении deadLine

Буду рад замечаниям и предложениям по доработке модуля.

## Installation

Для установки скопируйте файл в каталог с проектом, например "./static/js/"
Для подключения к проекту можно использовать динамический импорт, например:

```js
    import('../js/clock.js')
        .then(module => {
            const timer = new module.Clock(timerId, deadLine);
            timer.start();
        })
        .catch(err => {
            console.log(err);
        });
```

## Usage

1. Необходимо в верстке разместить блок таймера
```html
    <div class="className" id="timer">
	<span class="hours">00</span>
	<span>:</span>
	<span class="minutes">00</span>
	<span>:</span>
	<span class="seconds">00</span>
    </div>
```

2. Для запуска таймера необходимо обеспечить формирование даты и времени точки отсчета (deadLine).
Для примера:
```js
    const dateEnd = '2020-01-01', //дата в формате YYYY-MM-DD
        timeEnd = '22:30:00', //Время в формате HH:mm:ss
        utcZ = '+03:00', //часовой пояс в формате +-hh:mm от UTC+0 (+03:00 время Московское)
        deadLine = `${dateEnd}T${timeEnd}.000${utcZ}`, //полный формат даты YYYY-MM-DDTHH:mm:ss.sss
        //deadLine = '2020-03-10', //короткий формат даты без учета UTC
        timerId = 'timer'; //id таймера в вёрстке
```
Для запуска таймера с фиксированным шагом передайте в deadLine конструкцию `now+h1` или `now+m20` или `now+s15`
Пример:
```js
    const timer = new Clock(timerId);
    start.addEventListener('click', () => {
  	let deadLine = 'now+m10';
  	timer.start(deadLine, () => {
	    alert('Timer stop');
	});
});
```
3. Для инициализации таймера создайте экземпляр класса и вызовите метод класса start
```js
    const timer = new Clock(timerId);
    timer.start(deadLine, callback);
```
4. Для использования нескольких таймеров создайте несколько экземпляров класса с другими параметрами `timerId`

5. Таймер сам остановится, когда текущее время превысит переданный экземпляру класса deadLine.
Так же таймер можно остановить вызовом метода
```js
stop.addEventListener('click', () => {
  timer.stop();
});
```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## History

v. 1.0.2
Добавил возможность передачи в параметре deadLine конструкции now+h[m,s]delta, где
h - часы, m - минуты, s - секунды.
delta -  количество часов, минут или секунд на которые надо увеличить текущее время для установки точки отсчета таймера обратного отсчета.
Пример использования: `start(now+m5)` при этом запустится таймер с точкой отсчета +5 минут к текущему времени. 

v. 1.0.1
Добавил в метод start(deadLine, callback) параметр callback - callback function которая выполниться при остановке таймера при достижении deadLine.
Так же можно вызвать метод stop(callback) напрямую.

v. 1.0.0
Init version

## License

MIT
