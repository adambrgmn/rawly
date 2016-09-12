import chalk from 'chalk';

export const logFilesFound = paths => (console.log(
  chalk.blue(`
    > Found ${paths.length} images and starts extracting previews...
  `)
));

export const logSuccess = booleans => {
  const performed = booleans.filter(bool => bool);
  const skipped = booleans.filter(bool => !bool);

  console.log(chalk.green(`
    > Successfully extracted previews from ${performed.length} files.
    > ${skipped.length} files were skipped because they already had a preview.
  `));
};

export const logError = err => {
  console.log(chalk.red(err.message));
  console.log(chalk.dim(err));
};
