const fs = require('fs');
const { join } = require('path');

const babelrc = fs.readFileSync(join(__dirname, '..', '.babelrc'));
let config;

try {
  config = JSON.parse(babelrc);
} catch (err) {
  throw err;
}

require('babel-register')(config); // eslint-disable-line import/no-extraneous-dependencies
