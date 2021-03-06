const constants = require('../constants/index.js');

class Encode {
  /**
   * @param maxLength
   * @return {string}
   */
  constructor(
    maxLength = 1000000,
  ) {
    this.maxLength = maxLength;
  }

  /**
   * Encode array tokens to string
   *
   * @param tokens array of tokens
   * @param mode where 1 - encode to simple string, 2 - encode to delta string.
   * Default: MODE_SIMPLE_STRING
   * @return {string} encoding string
   */
  parse(tokens, mode = constants.MODE_SIMPLE_STRING) {
    if (!tokens || !Array.isArray(tokens)) {
      throw new TypeError('tokens argument should be an array of integers');
    }
    if (tokens.length > this.maxLength) {
      throw new RangeError('array size is higher than allowed');
    }
    if (mode === constants.MODE_SIMPLE_STRING) {
      return (this._encodeString(tokens));
    }
    if (mode === constants.MODE_DELTA_STRING) {
      return (this._encodeDelta(tokens));
    }
    throw new Error('you must select 1 or 2 at second parameter (1 - simple string, 2 - delta string)');
  }

  /**
   * Encoding to simple string
   *
   * @param tokens
   * @return {string} compressed string
   * @private
   */
  _encodeString(tokens) {
    if (tokens.length === 0) return '';
    if (tokens.length < 3) {
      return tokens.join(constants.NUM_DELIMITER);
    }
    const sortedTokens = tokens.sort((a, b) => a - b);
    const min = tokens[0];

    let compressedString = `${min}`;
    let rangeStart = false;
    let values = [];

    sortedTokens.forEach((id, index) => {
      const newId = id - min;

      if (rangeStart === false && sortedTokens[index + 1] === id + 1) {
        rangeStart = newId;
      } else if (rangeStart === false && sortedTokens[index + 1] !== id + 1) {
        values.push(newId);
      } else if (rangeStart !== false && sortedTokens[index + 1] !== id + 1) {
        values.push([rangeStart, newId]);
        rangeStart = false;
      }
    });

    values = values.map((item) => (typeof item === 'number' ? item : `${item[0]}-${item[1]}`));
    compressedString = `${compressedString}(${values.join(constants.NUM_DELIMITER)})`;
    return compressedString;
  }

  /**
   * Encoding to delta-string
   *
   * @param tokens
   * @return {string} compressed string
   * @private
   */
  _encodeDelta(tokens) {
    if (tokens.length === 0) return constants.DELTA;
    const sortedTokens = this._deltaCompression(tokens);
    const chunks = this._xBlocks(sortedTokens);
    return this._compressToString(chunks);
  }

  /**
   * Converting array of tokens to sorted array of difference tokens
   *
   * @param tokens
   * @return {number[]} sorted array of difference tokens
   * @private
   */
  _deltaCompression(tokens) {
    tokens.sort((a, b) => a - b);
    const diffTokens = [];
    tokens.forEach((token, i) => {
      i !== 0 ? diffTokens.push(token - tokens[i - 1]) : diffTokens.push(token);
    });
    return diffTokens;
  }

  /**
   * Forming x-blocks from difference tokens
   *
   * @param tokens
   * @return {string[]}
   * @private
   */
  _xBlocks(tokens) {
    let buf = [];
    const tokensCopy = [];
    tokens.forEach((token, i) => {
      if (i !== 0 && (token !== tokens[i - 1] || i === tokens.length - 1)) {
        buf.length > 1 ? tokensCopy.push(`${buf.length}x${buf[0]}`) : tokensCopy.push(`${buf[0]}`);
        buf = [token];
      } else buf.push(token);
    });
    if (buf.length !== 0) tokensCopy.push(`${buf}`);
    return tokensCopy;
  }

  /**
   * Compress chunks to delta-strings
   *
   * @param chunks
   * @return {string} compressedString
   * @private
   */
  _compressToString(chunks) {
    let del = constants.NUM_DELIMITER;
    let newDel = null;
    let compressedString = '';

    chunks.forEach((chunk) => {
      if (chunk.indexOf(constants.MULTIPLICATION) > -1) {
        const [x, val] = chunk.split(constants.MULTIPLICATION);
        if (x.length === val.length) {
          newDel = (val.length === 1 ? constants.DELTA_LIST_BY_ONE : (val.length === 2
            ? constants.DELTA_LIST_BY_TWO : constants.NUM_DELIMITER));
        } else {
          newDel = constants.NUM_DELIMITER;
        }
      } else {
        newDel = (chunk.length === 1 ? constants.DELTA_LIST_BY_ONE : (chunk.length === 2
          ? constants.DELTA_LIST_BY_TWO : constants.NUM_DELIMITER));
      }
      if (newDel === constants.NUM_DELIMITER || newDel !== del) {
        compressedString += newDel;
      }
      compressedString += chunk;
      del = newDel;
    });
    return `~${compressedString}`;
  }
}

module.exports = Encode;
