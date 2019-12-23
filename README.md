# zip-numbers

Алгоритмы сжатия списков чисел для передачи в текстовом виде. В реализацию входят парсер строк и поле для django-rest-framework.

Поддерживаются 2 способа сжатия: диапазоны с выносом за скобку и дельта-строки.

## Информация

1. Сжимает строку по одному из двух способов сжатия, который можно выбрать:
    1. диапазоны с выносом за скобку
    2. дельта-строки
    
2. Разжимает строку, сжатую по одному из двух алгоритмов.

## Установка

```
$ npm install zip-numbers
```


## Примеры
#### Encode:
```js
const zip = require('zip-numbers');

zip.encode([1,3,6]);
//=> '1(0,2,5)'

zip.encode([1,3,6], 1);
//=> '1(0,2,5)'

zip.encode([1,3,6], 2);
//=> '~.123'
```
#### Decode:
```js
const zip = require('zip-numbers');

zip.decode('1(0,2,5)');
//=> [1, 3, 6]

zip.decode('~.123');
//=> [1, 3, 6]
```

## API
### encode(tokens, [mode])

#### tokens

Type: `Object` `Object[]`

Array of tokens.

#### mode

Type: `number`

Number 1 or 2 for description selecting of method (simple string or delta)

##### return string  `string`


### decode(string)

#### string

Type: `string`

String of compressed tokens.

##### return tokens  `Object` `Object[]`


