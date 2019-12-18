
    // import {parse} from "./scripts/parser";

    const NUM_DELIMITER = ','
    const DELTA_LIST_BY_ONE = '.'
    const DELTA_LIST_BY_TWO = ':'
    const ZIP_START_DELIMITER = '('
    const ZIP_END_DELIMITER = ')'

    const maxLength = 1000000,
        intBase = 10,
        countTokens = 0;

    /**
     * Parse string to array of encoding numbers
     *
     * @param string
     * @returns {[]|*[]}
     */
    const parse = string => {
        if (!string) {
            return [];
        }

        // Parse base for int
        if (string.startsWith('x')) {
        }
        else {

        }

        let items;

        // Parse empty string as empty list
        if (string.startsWith('~')) {
            items = parseDelta(string.slice(1));
            console.log(items);
        }
        else {
            items = parseString(string);
        }
        return items;
    };


    /**
     * Parse string by delta
     *
     * @param string
     */
    const parseDelta = string => {
        let tokens = [],
            chunks = deltaChunks(string);
        chunks.forEach((chunk) => tokens = tokens.concat(parseDeltaChunks(chunk)));

        let last = 0;
        for (const [i, token] of tokens.entries()) {
            tokens[i]=token+last;
            last=tokens[i];
        }
        return tokens;

    };


    /**
     * Parse chunk of delta
     *
     * @param chunk
     */
    const parseDeltaChunks = chunk => {
        let listBy;
        // Разобраться с wrap и заменить цикл на ИЛИ
        if (chunk.startsWith(DELTA_LIST_BY_ONE)) {
            listBy = 1;
        }
        else if (chunk.startsWith(DELTA_LIST_BY_TWO)) {
            listBy = 2;
        }
        if (listBy) chunk = chunk.slice(1);

        let blocks = chunk.split('x');

        if (listBy) {
            let blocksCopy;
            blocks.map((block) => blocksCopy=wrap(block, listBy));
            if (blocks.length === 1) return blocksCopy;
            let tokens = [];
            for (const [i, block] of blocks.entries()) {
                if (i > 0) {
                    let c = tokens.pop();
                    // tokens.ex
                }
            }
        }
        // Если блоки были найдены
        else if (blocks.length == 2) {
            let num = _getInt(blocks[1]);

        }
        else return _getInt(blocks[0]);

    };

    const wrap = (str, count) => {
        let list = [];
        for (let i = 0; i<str.length; i+=count) {
            list.push(_getInt(str.slice(i, i+count)));
        }
        return list;
    };


    /**
     * Yield chunks for delta string
     *
     * @param str for split into chunks
     * @return list of chunks
     */
    const deltaChunks = str => {
        let list = [],
            buf = '';

        for (let ltr of str) {
            if (ltr === NUM_DELIMITER) {
                if (buf!=='') list.push(buf);
                buf = '';
            }
            else if (ltr === DELTA_LIST_BY_ONE || ltr === DELTA_LIST_BY_TWO) {
                if (buf!=='') list.push(buf);
                buf = ltr;
            }
            else {
                buf += ltr;
            }
        }

        if (buf !== '') list.push(buf);
        return list;
    };


    /**
     * Parse int
     *
     * @param num
     */
    const _getInt = num => (Number(num));


    const parseString = string => {}

    parse('~155');
    parse('~1,2,3');
    parse('~1');
    parse('~.1');
    parse('~.123');
    parse('~.123:1012');
    parse('~.12:10.45');
    parse('~.12:10.45,146,234.14');
    // parse('~3x1');


