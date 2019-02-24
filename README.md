# alice-renderer

[![Build Status](https://travis-ci.org/vitalets/alice-renderer.svg?branch=master)](https://travis-ci.org/vitalets/alice-renderer)

Библиотека для формирования [ответов](https://tech.yandex.ru/dialogs/alice/doc/protocol-docpage/#response) в навыках Алисы. 
Позволяет в компактной форме записывать текстово-голосовой ответ с добавлением вариативности, аудио-эффектов, кнопок и других кастомизаций.
Использует [tagged template literals](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/template_strings).

## Содержание

<!-- toc -->

- [Установка](#%D1%83%D1%81%D1%82%D0%B0%D0%BD%D0%BE%D0%B2%D0%BA%D0%B0)
- [Использование](#%D0%B8%D1%81%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5)
  * [Базовый пример](#%D0%B1%D0%B0%D0%B7%D0%BE%D0%B2%D1%8B%D0%B9-%D0%BF%D1%80%D0%B8%D0%BC%D0%B5%D1%80)
  * [Пример с модификаторами](#%D0%BF%D1%80%D0%B8%D0%BC%D0%B5%D1%80-%D1%81-%D0%BC%D0%BE%D0%B4%D0%B8%D1%84%D0%B8%D0%BA%D0%B0%D1%82%D0%BE%D1%80%D0%B0%D0%BC%D0%B8)
  * [Пример с параметрами](#%D0%BF%D1%80%D0%B8%D0%BC%D0%B5%D1%80-%D1%81-%D0%BF%D0%B0%D1%80%D0%B0%D0%BC%D0%B5%D1%82%D1%80%D0%B0%D0%BC%D0%B8)
- [API](#api)
  * [reply](#reply)
  * [reply.end](#replyend)
  * [buttons(items, [defaults])](#buttonsitems-defaults)
  * [audio(name)](#audioname)
  * [effect(name)](#effectname)
  * [pause([ms])](#pausems)
  * [br([count])](#brcount)
  * [text(str)](#textstr)
  * [tts(str)](#ttsstr)
- [Рецепты](#%D1%80%D0%B5%D1%86%D0%B5%D0%BF%D1%82%D1%8B)
  * [Вариативность через массивы](#%D0%B2%D0%B0%D1%80%D0%B8%D0%B0%D1%82%D0%B8%D0%B2%D0%BD%D0%BE%D1%81%D1%82%D1%8C-%D1%87%D0%B5%D1%80%D0%B5%D0%B7-%D0%BC%D0%B0%D1%81%D1%81%D0%B8%D0%B2%D1%8B)
  * [Модуль рендеринга ответов](#%D0%BC%D0%BE%D0%B4%D1%83%D0%BB%D1%8C-%D1%80%D0%B5%D0%BD%D0%B4%D0%B5%D1%80%D0%B8%D0%BD%D0%B3%D0%B0-%D0%BE%D1%82%D0%B2%D0%B5%D1%82%D0%BE%D0%B2)
  * [Обработка условий](#%D0%BE%D0%B1%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BA%D0%B0-%D1%83%D1%81%D0%BB%D0%BE%D0%B2%D0%B8%D0%B9)
- [Лицензия](#%D0%BB%D0%B8%D1%86%D0%B5%D0%BD%D0%B7%D0%B8%D1%8F)

<!-- tocstop -->

## Установка
```bash
npm i alice-renderer
```

## Использование
### Базовый пример
В простейшем варианте можно применить тег-функцию [`reply`](#reply) к некоторой строке.
В результате получим объект с полями `text` и `tts`, где записана переданная строка.
При этом для текстового представления из строки вырезаются акценты (`+`):
```js
const {reply} = require('alice-renderer');

const response = reply`Как дел+а?`;

console.log(response);

/*
{
  text: 'Как дела?',
  tts: 'Как дел+а?',
  end_session: false
}
*/
```

### Пример с модификаторами
Функции-модификаторы позволяют обогащать ответ отдельно в текстовом и голосовом каналах.
Например, мождификатор [`audio`](#audioname) добавляет звук - он запишется только в поле `tts`:
```js
const {reply, audio} = require('alice-renderer');

reply`${audio('sounds-game-win-1')} Как дел+а?`;

/*
{
  text: 'Как дела?',
  tts: '<speaker audio="alice-sounds-game-win-1.opus"> Как дел+а?',
  end_session: false
}
*/
```

Модификатор [`buttons`](#buttonsitems-defaults) позволяет добавить кнопки:
```js
const {reply, audio, buttons} = require('alice-renderer');

reply`
  ${audio('sounds-game-win-1')} Как дел+а?
  ${buttons(['Отлично', 'Супер'])}
`;

/*
{
  text: 'Как дела?',
  tts: '<speaker audio="alice-sounds-game-win-1.opus"> Как дел+а?',
  buttons: [
    {title: 'Отлично', hide: true},
    {title: 'Супер', hide: true},
  ],
  end_session: false
}
*/
```

Чтобы сделать ответ более разнообразным можно передавать в `reply` массивы значений:`${[item1, item2, ...]}`.
При рендеренге из массива выберется один случайный элемент:
```js
const {reply, buttons} = require('alice-renderer');

reply`
  ${['Привет', 'Здор+ово']}! Как дел+а?
  ${buttons(['Отлично', 'Супер'])}
`;

/*
{
  text: 'Здорово! Как дела?',
  tts: 'Здор+ово! Как дел+а?',
  buttons: [
    {title: 'Отлично', hide: true},
    {title: 'Супер', hide: true},
  ],
  end_session: false
}
*/
```

### Пример с параметрами
Для проброса параметров удобно использовать [`reply`](#reply) вместе со стрелочной функцией:
```js
const {reply, pause, buttons} = require('alice-renderer');

const welcome = username => reply`
  ${['Здравствуйте', 'Добрый день']}, ${username}! ${pause(500)} Как дел+а?
  ${buttons(['Отлично', 'Супер'])}
`;

const response = welcome('Виталий Пот+апов');

console.log(response);

/*
{
  text: 'Добрый день, Виталий Потапов! Как дела?',
  tts: 'Добрый день, Виталий Пот+апов! - - - - - - - Как дел+а?',
  buttons: [
    {title: 'Отлично', hide: true},
    {title: 'Супер', hide: true},
  ],
  end_session: false
}
*/
```
Переданные параметры также очищаются от акцентов при записи в поле `text`.

## API

### reply
Основная функция библиотеки. 
Используется как тег-функция для [template literal](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/template_strings): 
```js
 reply`строка`;
```
Формирует ответ для Алисы, раскладывая переданную строку на текст, голос и кнопки. 
По умолчанию строка записывается одновременно в оба поля `text` и `tts`.
Применяя модификаторы можно кастомизировать текстовую и голосовую часть:

```js
reply`
  ${audio('sounds-game-win-1')} ${['Привет', 'Здор+ово']}! ${pause(500)} Как дел+а?
  ${buttons(['Отлично', 'Супер'])}
`;

/*
{
  text: 'Здорово! Как дела?',
  tts: '<speaker audio="alice-sounds-game-win-1.opus"> Здор+ово! - - - - - - - Как дел+а?',
  buttons: [
    {title: 'Отлично', hide: true},
    {title: 'Супер', hide: true},
  ],
  end_session: false
}
*/
```

### reply.end
Формирует ответ ровно также, как и [`reply`](#reply), но завершает сессию:

```js
reply.end`До новых встреч!`;

/*
{
  text: 'До новых встреч!',
  tts: 'До новых встреч!',
  end_session: true
}
*/
```

### buttons(items, [defaults])
Добавляет в ответ кнопки.  
**Параметры:**
  * **items** `{Array<String|Object>}` - тайтлы/описания кнопок.
  * **defaults** `{?Object}` - дефолтные свойства создаваемых кнопок.

В простейшем варианте кнопки можно задавать текстом:
```js
reply`Хотите продолжить? ${buttons(['Да', 'Нет'])}`;

/*
{
  text: 'Хотите продолжить?',
  tts: 'Хотите продолжить?',
  buttons: [
    {title: 'Да', hide: true},
    {title: 'Нет', hide: true},
  ],
  end_session: false
}
*/
```

Если нужно изменить тип кнопок, то дополнительно выставляем `defaults`:
```js
reply`
  Хотите продолжить? 
  ${buttons(['Да', 'Нет'], {hide: false})}
`;

/*
{
  text: 'Хотите продолжить?',
  tts: 'Хотите продолжить?',
  buttons: [
    {title: 'Да', hide: false},
    {title: 'Нет', hide: false},
  ],
  end_session: false
}
*/
```

Для полной кастомизации можно задавать кнопки объектами:
```js
reply`
  Хотите продолжить? 
  ${buttons([
    {title: 'Да', payload: 'yes'},
    {title: 'Нет', payload: 'no'},
  ])}
`;

/*
{
  text: 'Хотите продолжить?',
  tts: 'Хотите продолжить?',
  buttons: [
    {title: 'Да', payload: 'yes', hide: true},
    {title: 'Нет', payload: 'no', hide: true},
  ],
  end_session: false
}
*/
```

### audio(name)
Добавляет звук в голосовой канал.  
**Параметры:**
  * **name** `{String}` - название звука из [библиотеки звуков](https://tech.yandex.ru/dialogs/alice/doc/sounds-docpage/).

```js
reply`${audio('sounds-game-win-1')} Ура!`;

/*
{
  text: 'Ура!',
  tts: '<speaker audio="alice-sounds-game-win-1.opus"> Ура!',
  end_session: false
}
*/
```
  
### effect(name)
Добавляет голосовой эффект.  
**Параметры:**
  * **name** `{String}` - название эффекта из [библиотеки эффектов](https://tech.yandex.ru/dialogs/alice/doc/speech-effects-docpage/).

```js
reply`${effect('hamster')} Я говорю как хомяк`;

/*
{
  text: 'Я говорю как хомяк',
  tts: '<speaker effect="hamster"> Я говорю как хомяк',
  end_session: false
}
*/
```

### pause([ms])
Добавляет паузу.  
**Параметры:**
  * **ms** `{?Number=500}` - примерное время в милисекундах.

```js
reply`Дайте подумать... ${pause()} Вы правы!`;

/*
{
  text: 'Дайте подумать. Вы правы!',
  tts: 'Дайте подумать. - - - Вы правы!',
  end_session: false
}
*/
```

### br([count])
Добавляет перенос строки в текстовый канал. Вставка `\n` не подходит,
т.к. исходные переносы строк вырезаются для удобства записи ответов.  
**Параметры:**
  * **count** `{?Number=1}` - кол-во переносов строк.

```js
reply`Следующий вопрос: ${br()} "В каком году отменили крепостное право?"`;

/*
{
  text: 'Следующий вопрос:\n"В каком году отменили крепостное право?"',
  tts: 'Следующий вопрос: "В каком году отменили крепостное право?"',
  end_session: false
}
*/
```

### text(str)
Добавляет строку только в текстовый канал. Удобно использовать совместно с `tts()`:
```js
reply`Вы можете написать нам на емейл${text(' user1234@example.com')}. ${tts('Он на вашем экране.')}`;

/*
{
  text: 'Вы можете написать нам на емейл user1234@example.com',
  tts: 'Вы можете написать нам на емейл. Он на вашем экране.',
  end_session: false
}
*/
```

### tts(str)
Добавляет строку только в голосовой канал. Удобно использовать совместно с `text()`:
```js
reply`Вы можете написать нам на емейл${text(' user1234@example.com')}. ${tts('Он на вашем экране.')}`;

/*
{
  text: 'Вы можете написать нам на емейл user1234@example.com',
  tts: 'Вы можете написать нам на емейл. Он на вашем экране.',
  end_session: false
}
*/
```

## Рецепты

### Вариативность через массивы
Вариативность в ответах удобно добавлять через массивы, которые выносить в отдельные переменные:
```js
const greetingText = [
  'Привет',
  'Здор+ово',
  'Здравствуйте',
  'Добр+о пожаловать',
  'Йох+анга',
];

const greetingSound = [
  audio('sounds-game-win-1'),
  audio('sounds-game-win-2'),
  audio('sounds-game-win-3'),
];

const welcome = () => reply`
  ${greetingSound} ${greetingText}! Я голосовой помощник Алиса.
`;
```

### Модуль рендеринга ответов
Всю работу по формированию финального текстового ответа удобно вынести в отдельный модуль. 
Это позволяет отделить логику навыка от рендеринга и менять эти части независимо:

**replies.js**
```js
exports.welcome = () => reply`
  Привет! Я голосовой помощник Алиса.
`;

exports.showMenu = username => reply`
  ${username}, вы можете сразу начать игру или узнать подробнее о правилах.
  ${buttons(['Начать игру', 'Правила'])}
`;

exports.goodbye = () => reply.end`
  Отлично! Будет скучно - обращайтесь.
`;
```

**logic.js**
```js
const replies = require('./replies');

function handleMenuRequest() {
  ...
  return replies.showMenu(session.username);
}
```

### Обработка условий
Можно вставлять обработку условных операторов прям в формируемую строку. Falsy значения в ответ не попадут:
```js
exports.correctAnswer = score => reply`
  Правильный ответ!
  ${score > 100 && 'Вы набрали больше 100 баллов и получаете приз!'}
`;
```

Также можно использовать вложенный `reply`, если требуется обработка строки в условии:
```js
exports.correctAnswer = score => reply`
  Правильный ответ!
  ${score > 100 && reply`${audio('sounds-game-win-1')}Вы набрали больше 100 баллов и получаете приз!`}
`;
```

## Лицензия
MIT @ [Vitaliy Potapov](https://github.com/vitalets)
