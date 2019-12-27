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
<a name="Encode+_encodeString"></a>

<a name="Encode"></a>

## Encode
**Kind**: global class  

* [Encode](#Encode)
    * [new Encode(maxLength)](#new_Encode_new)
    * [.parse(tokens, mode)](#Encode+parse) ⇒ <code>string</code>

<a name="new_Encode_new"></a>

### new Encode(maxLength)

| Param | Default |
| --- | --- |
| maxLength | <code>1000000</code> | 

<a name="Encode+parse"></a>

### encode.parse(tokens, mode) ⇒ <code>string</code>
Encode array tokens to string

**Kind**: instance method of [<code>Encode</code>](#Encode)  
**Returns**: <code>string</code> - encoding string  

| Param | Description |
| --- | --- |
| tokens | array of tokens |
| mode | where 1 - encode to simple string, 2 - encode to delta string. Default: MODE_SIMPLE_STRING |

<a name="Decode"></a>

## Decode
**Kind**: global class  

* [Decode](#Decode)
    * [new Decode(maxLength)](#new_Decode_new)
    * [.parse(string)](#Decode+parse) ⇒ <code>Array.&lt;number&gt;</code>

<a name="new_Decode_new"></a>

### new Decode(maxLength)

| Param | Default |
| --- | --- |
| maxLength | <code>1000000</code> | 

<a name="Decode+parse"></a>

### decode.parse(string) ⇒ <code>Array.&lt;number&gt;</code>
Parse string to array of encoding numbers

**Kind**: instance method of [<code>Decode</code>](#Decode)  

| Param |
| --- |
| string | 

<a name="Decode+parseString"></a>
