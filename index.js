const Encode = require('./scripts/encode');
const Decode = require('./scripts/decode');
const constants = require('./constants');

/**
 * Encodes an array of tokens into a string.
 * @param {number[]} tokens Array of tokens.
 * @param {number} [mode=MODE_SIMPLE_STRING] Mode: MODE_SIMPLE_STRING or MODE_DELTA_STRING.
 * See: `zip.constants`
 * @returns {string} Encoded string.
 */
const encode = (tokens, mode) => new Encode().parse(tokens, mode);

/**
 * Decodes a string into an array of tokens.
 * @param {string} string Encoded string.
 * @returns {number[]} Array of tokens.
 */
const decode = (string) => new Decode().parse(string);

exports.encode = encode;
exports.decode = decode;
exports.constants = constants;
