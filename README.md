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

zip.encode([1,3,6], zip.constants.MODE_SIMPLE_STRING);
//=> '1(0,2,5)'

zip.encode([1,3,6], zip.constants.MODE_DELTA_STRING);
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

## Functions

<dl>
<dt><a href="#encode">encode(tokens, [mode])</a> ⇒ <code>string</code></dt>
<dd><p>Encodes an array of tokens into a string.</p>
</dd>
<dt><a href="#decode">decode(string)</a> ⇒ <code>Array.&lt;number&gt;</code></dt>
<dd><p>Decodes a string into an array of tokens.</p>
</dd>
</dl>

<a name="encode"></a>

## encode(tokens, [mode]) ⇒ <code>string</code>
Encodes an array of tokens into a string.
 
**Returns**: <code>string</code> - Encoded string.  

| Param  | Type                              | Default                         | Description                                                         |
| ------ | --------------------------------- | ------------------------------- | ------------------------------------------------------------------- |
| tokens | <code>Array.&lt;number&gt;</code> |                                 | Array of tokens.                                                    |
| [mode] | <code>number</code>               | <code>MODE_SIMPLE_STRING</code> | Mode: MODE_SIMPLE_STRING or MODE_DELTA_STRING. See: `zip.constants` |

<a name="decode"></a>

## decode(string) ⇒ <code>Array.&lt;number&gt;</code>
Decodes a string into an array of tokens.

**Returns**: <code>Array.&lt;number&gt;</code> - Array of tokens.  

| Param  | Type                | Description     |
| ------ | ------------------- | --------------- |
| string | <code>string</code> | Encoded string. |


