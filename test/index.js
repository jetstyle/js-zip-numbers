const assert = require('assert');
const Encode = require('../scripts/encode');

const testObj = new Encode();

describe('encoding', () => {
  it('For test making simple string', () => {
    assert.equal(testObj.parse([]), '');
    assert.equal(testObj.parse([1]), '1');
    assert.equal(testObj.parse([1,2]), '1,2');
    assert.equal(testObj.parse([1,2,3]), '1(0-2)');
    assert.equal(testObj.parse([1,2,3,4]), '1(0-3)');
    assert.equal(testObj.parse([1,3,5,7]), '1(0,2,4,6)');
    assert.equal(testObj.parse([1, 2, 3, 5, 6, 7]), '1(0-2,4-6)');
    assert.equal(testObj.parse([1, 2, 3, 5, 6, 7, 9]), '1(0-2,4-6,8)');
  });
  it('For test making delta string', () => {
    assert.equal(testObj.parse([], 2), '~');
    assert.equal(testObj.parse([1, 3, 6], 2), '~.123');
  });
});
