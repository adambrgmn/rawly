#!/usr/bin/env node

const program = require('commander');
const extract = require('./dist/cli').default;
const { logSuccess, logError } = require('./dist/utils/log');
const pkg = require('./package.json');

program
  .version(pkg.version)
  .usage('[options] <glob ...>')
  .option('-f, --force', 'Force overwrite of existing previews')
  .option(
    '-p, --previews [value]',
    'Which preview to extract (eg. "smallest" or "largest")',
    /^(s|sm|small|smallest|m|md|medium|l|lg|large|largest)$/i
  )
  .parse(process.argv);

extract(program)
  .then(logSuccess)
  .catch(logError);
