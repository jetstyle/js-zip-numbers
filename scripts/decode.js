class Decode {
  constructor(maxLength = 1000000) {
    this.NUM_DELIMITER = ',';
    this.DELTA_LIST_BY_ONE = '.';
    this.DELTA_LIST_BY_TWO = ':';
    this.ZIP_START_DELIMITER = '(';
    this.ZIP_END_DELIMITER = ')';
    this.intBase = 10;
    this.maxLength = maxLength;
    this.countTokens = 0;
  }

  /**
   * Parse string to array of encoding numbers
   *
   * @param string
   * @returns {[]|*[]}
   */
  parse(string) {
    if (!string) {
      return [];
    }
    let items;

    // Parse base for int
    if (string.startsWith('x')) {
      let base;
      [base, string] = string.split(';');
      this.intBase = parseInt(base.slice(1), 10);
    } else {
      this.intBase = 10;
    }

    // Parse empty string as empty list
    if (string.startsWith('~')) {
      items = this.parseDelta(string.slice(1));
    } else {
      items = this.parseString(string);
    }

    return items;
  }

  /**
   * Parse string to tokens
   *
   * @param string
   * @return {[]}
   */
  parseString(string) {
    let buff = ''; const tokens = []; const
      zipBuff = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const ltr of string) {
      if (ltr === this.ZIP_START_DELIMITER) zipBuff.push(1);
      if (ltr === this.ZIP_END_DELIMITER) zipBuff.pop();
      if (zipBuff.length === 0 && ltr === this.NUM_DELIMITER) {
        this._parseToken(buff).forEach((item) => {
          tokens.push(item);
        });
        buff = '';
      } else buff += ltr;
    }

    if (buff) {
      this._parseToken(buff).forEach((item) => {
        tokens.push(item);
      });
    }
    return tokens;
  }

  /**
   * Parse string by delta
   *
   * @param string
   * @return {[]} array with tokens
   */
  parseDelta(string) {
    let tokens = [];
    const chunks = this._deltaChunks(string);

    chunks.forEach((chunk) => {
      tokens = tokens.concat(this._parseDeltaChunks(chunk));
      return tokens;
    });

    let last = 0;
    tokens.forEach((token, i) => {
      tokens[i] = token + last;
      last = tokens[i];
    });

    return tokens;
  }

  /**
   * Parse token from string
   *
   * @param token
   * @return {[]} array with tokens
   */
  _parseToken(token) {
    let tokens = [];
    if (token.indexOf(this.ZIP_START_DELIMITER) > -1) {
      // eslint-disable-next-line prefer-const
      let [base, subString] = token.split(this.ZIP_START_DELIMITER);
      base = parseInt(base, 10);
      const items = this.parseString(subString.slice(0, subString.length - 1));
      items.forEach((item) => tokens.push(item + base));
      return tokens;
    }
    if (token.indexOf('-') > -1) {
      let [start, stop] = token.split('-');
      start = parseInt(start, this.intBase);
      stop = parseInt(stop, this.intBase);

      for (let i = start; i <= stop; i += 1) {
        tokens.push(i);
      }
    } else tokens = [parseInt(token, this.intBase)];
    return tokens;
  }

  /**
   * Parse chunk of delta
   *
   * @param chunk
   * @return {[]} array with tokens
   */
  _parseDeltaChunks(chunk) {
    let listBy;
    let tokens = [];
    if (chunk.startsWith(this.DELTA_LIST_BY_ONE)) listBy = 1;
    if (chunk.startsWith(this.DELTA_LIST_BY_TWO)) listBy = 2;
    if (listBy) chunk = chunk.slice(1);
    const blocks = chunk.split('x');

    if (listBy) {
      if (blocks.length === 1) {
        tokens = this._wrap(chunk, listBy);
      } else {
        let items = [];
        items = blocks.map((block) => (this._wrap(block, listBy)));
        items.forEach((item, i) => {
          if (i > 0) {
            const c = tokens.pop();
            for (let j = 0; j < c; j += 1) tokens.push(item[0]);
            item = item.slice(1);
          }
          tokens.push(...item);
        });
        return tokens;
      }
    } else if (blocks.length === 2) {
      const num = parseInt(blocks[1], this.intBase);
      for (let i = 0; i < blocks[0]; i += 1) {
        tokens.push(num);
      }
    } else tokens = [parseInt(chunk, this.intBase)];

    return tokens;
  }

  /**
   * Yield chunks for delta string
   *
   * @param string for split into chunks
   * @return [] of chunks
   */
  _deltaChunks(string) {
    const chunks = [];
    let buf = '';
    // eslint-disable-next-line no-restricted-syntax
    for (const ltr of string) {
      if (ltr === this.NUM_DELIMITER) {
        (buf !== '') && chunks.push(buf);
        buf = '';
      } else if (ltr === this.DELTA_LIST_BY_ONE || ltr === this.DELTA_LIST_BY_TWO) {
        (buf !== '') && chunks.push(buf);
        buf = ltr;
      } else {
        buf += ltr;
      }
    }
    if (buf !== '') chunks.push(buf);
    return chunks;
  }

  /**
   * Convert string to several strings of length of count symbols
   *
   * @param string
   * @param count symbols
   * @returns {[]} list of several strings
   */
  _wrap(string, count) {
    const list = [];
    for (let i = 0; i < string.length; i += count) {
      list.push(parseInt(string.slice(i, i + count), this.intBase));
    }
    return list;
  }
}

module.exports = Decode;
