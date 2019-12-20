const Encode = require('./scripts/encode');
const Decode = require('./scripts/decode');

const encode = (tokens, mode) => new Encode().parse(tokens, mode);
const decode = (string) => new Decode().parse(string);

exports.encode = encode;
exports.decode = decode;
