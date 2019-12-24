const assert = require('assert');
const Encode = require('../scripts/encode');
const Decode = require('../scripts/decode');

const testEncode = new Encode();
const testDecode = new Decode();

describe('encoding', () => {
  it('For test making simple string', () => {
    assert.equal(testEncode.parse([]), '');
    assert.equal(testEncode.parse([1]), '1');
    assert.equal(testEncode.parse([1, 2]), '1,2');
    assert.equal(testEncode.parse([1, 2, 3]), '1(0-2)');
    assert.equal(testEncode.parse([1, 2, 3, 4]), '1(0-3)');
    assert.equal(testEncode.parse([1, 3, 5, 7]), '1(0,2,4,6)');
    assert.equal(testEncode.parse([1, 2, 3, 5, 6, 7]), '1(0-2,4-6)');
    assert.equal(testEncode.parse([1, 2, 3, 5, 6, 7, 9]), '1(0-2,4-6,8)');
  });
  it('For test making delta string', () => {
    assert.equal(testEncode.parse([], 2), '~');
    assert.equal(testEncode.parse([1, 3, 6], 2), '~.123');
  });
});

describe('decoding', () => {
  it('No-zipped strings', () => {
    assert.deepEqual(testDecode.parse('123'), [123]);
    assert.deepEqual(testDecode.parse('123, 456'), [123, 456]);
  });
  it('Strings with ranges', () => {
    assert.deepEqual(testDecode.parse('1-3'), [1, 2, 3]);
    assert.deepEqual(testDecode.parse('1-3,5-9'), [1, 2, 3, 5, 6, 7, 8, 9]);
  });
  it('Zipped strings', () => {
    assert.deepEqual(testDecode.parse('120(0,3,5,8,9)'), [120, 123, 125, 128, 129]);
    assert.deepEqual(testDecode.parse('12(1,4),140(0,2,5)'), [13, 16, 140, 142, 145]);
  });
  it('Strings with zipped data and ranges', () => {
    assert.deepEqual(testDecode.parse('120(0,3,6),130-132'), [120, 123, 126, 130, 131, 132]);
    assert.deepEqual(testDecode.parse('120(0-6)'), [120, 121, 122, 123, 124, 125, 126]);
  });
  it('Strings with base of numbers', () => {
    assert.deepEqual(testDecode.parse('x16;3,f'), [3, 15]);
    assert.deepEqual(testDecode.parse('x2;11,101'), [3, 5]);
  });
  it('Base delta string', () => {
    assert.deepEqual(testDecode.parse('~'), []);
    assert.deepEqual(testDecode.parse('~1'), [1]);
    assert.deepEqual(testDecode.parse('~155'), [155]);
    assert.deepEqual(testDecode.parse('~1,2,3'), [1, 3, 6]);
  });
  it('Delta string with ranges', () => {
    assert.deepEqual(testDecode.parse('~.1'), [1]);
    assert.deepEqual(testDecode.parse('~.123'), [1, 3, 6]);
    assert.deepEqual(testDecode.parse('~.123:1012'), [1, 3, 6, 16, 28]);
    assert.deepEqual(testDecode.parse('~.12:10.45'), [1, 3, 13, 17, 22]);
    assert.deepEqual(testDecode.parse('~.12:10.45,146,234.14'), [1, 3, 13, 17, 22, 168, 402, 403, 407]);
  });
  it('Delta strings with x-ranges', () => {
    assert.deepEqual(testDecode.parse('~3x1'), [1, 2, 3]);
    assert.deepEqual(testDecode.parse('~.2x12'), [1, 2, 4]);
    assert.deepEqual(testDecode.parse('~.13x3'), [1, 4, 7, 10]);
    assert.deepEqual(testDecode.parse('~12,3x4,'), [12, 16, 20, 24]);
    assert.deepEqual(testDecode.parse('~.54x13:1010x11'), [5, 6, 7, 8, 9, 12, 22, 33, 44, 55, 66, 77, 88, 99,
      110, 121, 132]);
  });
});
