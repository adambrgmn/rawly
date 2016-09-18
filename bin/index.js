#!/usr/bin/env node

const program = require('commander');
const cli = require('../dist/cli').default;
const { logSuccess, logError } = require('../dist/utils/log');
const pkg = require('../package.json');
const moment = require('moment');

const startTime = moment();

program
  .version(pkg.version)
  .usage('[options] <glob ...>')
  .option('-f, --force', 'Force overwrite of existing previews')
  .option('-s, --size [size]', 'Size of extracted preview (eg. "1200x900")')
  .option('-e, --ending [suffix]', 'String to append to end of file name')
  .parse(process.argv);

cli(program)
  .then((extracted) => logSuccess(extracted, startTime))
  .catch(logError);
