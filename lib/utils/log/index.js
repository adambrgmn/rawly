import chalk from 'chalk';

export const logFilesFound = paths => (console.log(
  chalk.blue(`
    > Found ${paths.length} images and starts extracting previews...
  `)
));

export const logSuccess = rawlys => {
  // eslint-disable-next-line valid-typeof
  const check = (against) => ({ previewExtracted }) => typeof previewExtracted === against;
  const performed = rawlys.filter(check('string'));
  const skipped = rawlys.filter(check('boolean'));

  console.log(chalk.green(`
    > ${performed.length} successfully extracted previews.
    > ${skipped.length} skipped files because they already had a preview.
  `));
};

export const logError = err => {
  console.log(chalk.red(err.message));
  console.log(chalk.dim(err));
};
