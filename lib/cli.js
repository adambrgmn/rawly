#!/usr/bin/env node
import Promise, { promisify } from 'bluebird';
import program from 'commander';
import chalk from 'chalk';
import glob from 'glob';
import Bar from './utils/progressBar';
import determinePreviews from './utils/determinePreviews';
import Rawly from './index';
import pkg from '../package.json';

const globAsync = promisify(glob);
const progressBar = new Bar();

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

// const [globPattern] = program.args;

const logFilesFound = paths => (console.log(chalk.blue(`
  > Found ${paths.length} images and starts extracting previews...
`)));
const initProgressBar = paths => progressBar.init(paths.length);
const createRawlys = paths => Promise.resolve(paths.map(path => new Rawly(path)));

const extractPreviews = rawlys => {
  const p = rawlys.map((rawly) => {
    const previewsToExtract = determinePreviews(rawly.previews, program.previews);
    const forceOverwrite = program.force;
    const promise = rawly.extractPreviews(previewsToExtract, forceOverwrite);
    progressBar.tick();

    return promise;
  });

  return Promise.all(p);
};

const logSuccess = booleans => {
  const performed = booleans.filter(bool => bool);
  const skipped = booleans.filter(bool => !bool);

  console.log(chalk.green(`
    > Successfully extracted previews from ${performed.length} files.
    > ${skipped.length} files were skipped because they already had a preview.
  `));
};

const logError = err => {
  console.log(chalk.red(err.message));
  console.log(chalk.dim(err));
};

// globAsync(globPattern)
//   .tap(logFilesFound)
//   .tap(initProgressBar)
//   .then(createRawlys)
//   .then(extractPreviews)
//   .then(logSuccess)
//   .catch(logError);

async function extract(prog) {
  try {
    const globPtrn = prog.args[0];
    const paths = await globAsync(globPtrn);

    logFilesFound(paths);
    initProgressBar(paths);

    const rawlys = await createRawlys(paths);
    const booleans = await extractPreviews(rawlys);

    logSuccess(booleans);
  } catch (err) {
    logError(err);
  }
}

export default extract;
