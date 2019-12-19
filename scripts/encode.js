/**
 * Encode array tokens to string
 *
 * @param tokens array of tokens
 * @return {string} encoding string
 */
const encode = tokens => {
    if (!tokens || !Array.isArray(tokens)) {
        console.error('tokens argument should be an array of integers');
    }

    if (tokens.length === 0) return '';

    if (tokens.length < 3) {
        return tokens.join(',');
    }

    encodeString(tokens);
    encodeDelta(tokens);
};

/**
 * Encoding to simple string
 *
 * @param tokens
 * @return {string} compressed string
 */
const encodeString = tokens => {
    const min = tokens[0];
    const sortedtokens = tokens.sort((a, b) => a - b);

    let compressedString = `${min}`;
    let rangeStart = false;
    let values = [];

    sortedtokens.forEach((id, index) => {
        const newId = id - min;

        if (rangeStart === false && sortedtokens[index + 1] === id + 1) {
            rangeStart = newId;
        } else if (rangeStart === false && sortedtokens[index + 1] !== id + 1) {
            values.push(newId);
        } else if (rangeStart !== false && sortedtokens[index + 1] !== id + 1) {
            values.push([rangeStart, newId]);
            rangeStart = false;
        }
    });

    values = values.map(item => (typeof item === 'number' ? item : `${item[0]}-${item[1]}`));
    compressedString = `${compressedString}(${values.join(',')})`;

    console.log(compressedString);
    return compressedString;
};

/**
 * Encoding to delta-string
 *
 * @param tokens
 * @return {string} compressed string
 */
const encodeDelta = tokens => {
    const sortedtokens = tokens.sort((a, b) => a - b);

    _xBlocks(_deltaCompression(sortedtokens));
};

/**
 * Forming x-blocks from difference tokens
 *
 * @param tokens
 * @return {[]}
 * @private
 */
const _xBlocks = tokens => {
    let buf = [],
        last,
        tokensCopy = [];
    tokens.forEach((token, i) => {
        if (i !== 0 && (token !== tokens[i - 1] || i === tokens.length - 1)) {
            buf.length > 1 ? tokensCopy.push(`${buf.length}x${buf[0]}`) : tokensCopy.push(`${buf[0]}`);
            buf = [token];
        } else buf.push(token);
    });
    if (buf.length !== 0) tokensCopy.push(`${buf}`);
    return tokensCopy;
};


// Tests DONE
// encode([]);
// encode([1]);
// encode([1, 2]);
// encode([1, 2, 3]);
// encode([1, 2, 3, 4]);
// encode([1, 3, 5, 7]);
// encode([1, 2, 3, 5, 6, 7]);
// encode([1, 2, 3, 5, 6, 7, 9]);
_xBlocks([1, 1, 2]);

