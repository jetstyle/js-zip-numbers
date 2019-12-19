const NUM_DELIMITER = ',';
const DELTA_LIST_BY_ONE = '.';
const DELTA_LIST_BY_TWO = ':';
const ZIP_START_DELIMITER = '(';
const ZIP_END_DELIMITER = ')';

const intBase = 10;

/**
 * Parse string to array of encoding numbers
 *
 * @param string
 * @returns {[]|*[]}
 */
const decode = string => {
    if (!string) {
        return [];
    }
    let items;

    let intBase = 10;

    // Parse base for int
    if (string.startsWith('x')) {
        let base;
        [base, string] = string.split('x');
        intBase = base.slice(1);
    }

    // Parse empty string as empty list
    if (string.startsWith('~')) {
        items = parseDelta(string.slice(1));
        console.log(items);
    }
    else {
        items = parseString(string);
        console.log(items)
    }

    return items;
};

/**
 * Parse string to tokens
 *
 * @param string
 * @return {[]}
 */
const parseString = string => {
    let buff = '', tokens = [], zipBuff = [];

    for (const ltr of string) {
        if (ltr === ZIP_START_DELIMITER) zipBuff.push(1);
        if (ltr === ZIP_END_DELIMITER) zipBuff.pop();
        if (zipBuff.length === 0 && ltr === NUM_DELIMITER) {
            parseToken(buff).forEach((item) => {
                tokens.push(item);
            });
            buff = '';
        }
        else buff += ltr;
    }

    if (buff) {
        parseToken(buff).forEach((item) => {
            tokens.push(item);
        });
    }

    return tokens;
};


/**
 * Parse token from string
 *
 * @param token
 * @return {[]} array with tokens
 */
const parseToken = token => {
    let tokens = [];
    if (token.indexOf(ZIP_START_DELIMITER) > -1) {
        let [base, subString] = token.split(ZIP_START_DELIMITER);
        base = parseInt(base, 10);
        let items = parseString(subString.slice(0, subString.length-1));
        items.forEach((item) => tokens.push(item+base));
        return tokens;
    }
    if (token.indexOf('-') > -1) {
        let [start, stop] = token.split('-');
        start = parseInt(start, intBase);
        stop = parseInt(stop, intBase);

        for (let i = start; i <= stop; i += 1) {
            tokens.push(i);
        }
    }
    else tokens = [parseInt(token, intBase)];
    return tokens;
};

/**
 * Parse string by delta
 *
 * @param string
 * @return {[]} array with tokens
 */
const parseDelta = string => {
    let tokens = [],
        chunks = deltaChunks(string);

    chunks.forEach((chunk) => tokens = tokens.concat(parseDeltaChunks(chunk)));

    let last = 0;
    tokens.forEach((token, i) => {
        tokens[i]=token+last;
        last=tokens[i];
    });

    return tokens;
};


/**
 * Parse chunk of delta
 *
 * @param chunk
 * @return {[]} array with tokens
 */
const parseDeltaChunks = chunk => {
    let listBy, blocks, tokens = [];
    if (chunk.startsWith(DELTA_LIST_BY_ONE)) listBy = 1;
    if (chunk.startsWith(DELTA_LIST_BY_TWO)) listBy = 2;
    if (listBy) chunk = chunk.slice(1);
    blocks = chunk.split('x');

    if (listBy) {
        if (blocks.length === 1) {
            tokens = wrap(chunk, listBy);
        }
        else {
            let items = [];
            items = blocks.map((block, i) => (wrap(block, listBy)));
            items.forEach((item, i) => {
                if (i > 0) {
                    let c = tokens.pop();
                    for (let j = 0; j < c; j++)
                        tokens.push(item[0]);
                    item = item.slice(1);
                }
                tokens.push(...item);
            });
            return tokens;

            // let nums = wrap(blocks[1], listBy);
            // let num = _getInt(nums[0]);
            // let list = [];
            // for (let i = 0; i < blocks[0]; i++) {
            //     items.push(num);
            // }
            // items.push(...nums.slice(1));
            //
            // let tokens = [];
            // blocks.forEach((block) => items = items.concat(wrap(block,listBy)));
            // items.forEach((block, i) => {
            //     if (i > 0) {
            //         let c = items.pop();
            //         for (let j=0; j < c; j++) items.push(block[0]);
            //         block = block.split(1);
            //     }
            //     items.push(...block);
            // });
        }
    }
    else if (blocks.length === 2) {
        let num = parseInt(blocks[1], intBase);
        for (let i = 0; i < blocks[0]; i++) {
            tokens.push(num);
        }
    }
    else tokens = [parseInt(chunk, intBase)];

    return tokens;
};

/**
 * Yield chunks for delta string
 *
 * @param string for split into chunks
 * @return [] of chunks
 */
const deltaChunks = string => {
    let chunks = [],
        buf = '';
    for (let ltr of string) {
        if (ltr === NUM_DELIMITER) {
            (buf!=='') && chunks.push(buf);
            buf = '';
        }
        else if (ltr === DELTA_LIST_BY_ONE || ltr === DELTA_LIST_BY_TWO) {
            (buf!=='') && chunks.push(buf);
            buf = ltr;
        }
        else {
            buf += ltr;
        }
    }
    if (buf !== '') chunks.push(buf);
    return chunks;
};

/**
 * Convert string to several strings of length of count symbols
 *
 * @param string
 * @param count symbols
 * @returns {[]} list of several strings
 */
const wrap = (string, count) => {
    let list = [];
    for (let i = 0; i<string.length; i+=count) {
        list.push(parseInt(string.slice(i, i+count), intBase));
    }
    return list;
};


// Tests
// Done
// decode('123');
// decode('123,456');
// decode('1-3');
// decode('1-3,5-9');
// decode('120(0,3,5,8,9)');
// decode('12(1,4),140(0,2,5)');
// decode('120(0,3,6),130-132');
// decode('120(0-6)');
// decode('~155');
// decode('~1,2,3');
// decode('~1');
// decode('~.1');
// decode('~.123');
// decode('~.123:1012');
// decode('~.12:10.45');
// decode('~.12:10.45,146,234.14');
// decode('~3x1');
// decode('1-10');
// decode('1,2,5,7-13');
// decode('14(0-8,18)');
// decode('~.13x3');
// decode('~.2x12');
// decode('~12,3x4,');
// decode('~.54x13:1010x11');

//  In process
//     Strings with base of numbers
// decode('x16;3,f');
// decode('x2;11,101');




