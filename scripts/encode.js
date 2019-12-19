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
    const sortedTokens = tokens.sort((a, b) => a - b);
    const chunks = _xBlocks(sortedTokens);
    const compressedString = _compressToString(chunks);
    return compressedString;
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

/**
 * Compress chunks to delta-strings
 *
 * @param chunks
 * @return {string} compressedString
 * @private
 */
const _compressToString = chunks => {
    let del = ',',
        newDel = null,
        compressedString = '';

    chunks.forEach((chunk) => {
        if (chunk.indexOf('x') > -1) {
            let [x, val] = chunk.split('x');
            if (x.length === val.length) {
                newDel = (val.length===1 ? '.' : (val.length===2 ? ':' : ','));
            } else {
                newDel = ',';
            }
        } else {
            newDel = (chunk.length===1 ? '.' : (chunk.length===2 ? ':' : ','));
        }
        if (newDel === ',' || newDel !== del) {
            compressedString += newDel;
        }
        compressedString += chunk;
        del = newDel;
    });
    return `~${compressedString}`;
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


