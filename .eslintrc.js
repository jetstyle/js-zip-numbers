module.exports = {
  env: {
    browser: true,
    es6: true,
    mocha: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    "no-param-reassign": [0],
    "no-underscore-dangle": [0],
    "no-unused-expressions": [0],
    "no-nested-ternary": [0],
    "class-methods-use-this": [0]
  },
};
