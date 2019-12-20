class Encode {
  /**
   * @return {string}
   */
  constructor(
    maxLength = 1000000,
  ) {
    this.MODE_SIMPLE_STRING = 1;
    this.MODE_DELTA_STRING = 2;
    this.maxLength = maxLength;
  }

  /**
   * Encode array tokens to string
   *
   * @param tokens array of tokens
   * @param mode where 1 - encode to simple string, 2 - encode to delta string
   * @return {string} encoding string
   */
  parse(tokens, mode = this.MODE_SIMPLE_STRING) {
    if (!tokens || !Array.isArray(tokens)) {
      console.error('tokens argument should be an array of integers');
      return '';
    }
    if (tokens.length > this.maxLength) {
      console.error('array size is higher than allowed');
      return '';
    }
    if (mode === this.MODE_SIMPLE_STRING) {
      return (this.constructor.encodeString(tokens));
    }
    if (mode === this.MODE_DELTA_STRING) {
      return (this.constructor.encodeDelta(tokens));
    }
    console.error('you must select 1 or 2 at second parameter (1 - simple string, 2 - delta string)');
    return '';
  }

  /**
   * Encoding to simple string
   *
   * @param tokens
   * @return {string} compressed string
   */
  static encodeString(tokens) {
    if (tokens.length === 0) return '';
    if (tokens.length < 3) {
      return tokens.join(',');
    }
    const min = tokens[0];
    const sortedTokens = tokens.sort((a, b) => a - b);

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
    compressedString = `${compressedString}(${values.join(',')})`;
    return compressedString;
  }

  /**
   * Encoding to delta-string
   *
   * @param tokens
   * @return {string} compressed string
   */
  static encodeDelta(tokens) {
    if (tokens.length === 0) return '~';
    const sortedTokens = this._deltaCompression(tokens);
    const chunks = this._xBlocks(sortedTokens);
    return this._compressToString(chunks);
  }

  /**
   * Converting array of tokens to sorted array of difference tokens
   *
   * @param tokens
   * @return {[]} sorted array of difference tokens
   * @private
   */
  static _deltaCompression(tokens) {
    tokens.sort();
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
   * @return {[]}
   * @private
   */
  static _xBlocks(tokens) {
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
  static _compressToString(chunks) {
    let del = ',';
    let newDel = null;
    let compressedString = '';

    chunks.forEach((chunk) => {
      if (chunk.indexOf('x') > -1) {
        const [x, val] = chunk.split('x');
        if (x.length === val.length) {
          newDel = (val.length === 1 ? '.' : (val.length === 2 ? ':' : ','));
        } else {
          newDel = ',';
        }
      } else {
        newDel = (chunk.length === 1 ? '.' : (chunk.length === 2 ? ':' : ','));
      }
      if (newDel === ',' || newDel !== del) {
        compressedString += newDel;
      }
      compressedString += chunk;
      del = newDel;
    });
    return `~${compressedString}`;
  }
}

module.exports = Encode;
