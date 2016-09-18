import chalk from 'chalk';
import moment from 'moment';

export const logFilesFound = (paths) => (console.log(
  chalk.blue(`
    > Found ${paths.length} images and starts extracting previews...
  `)
));

export const logSuccess = (extracted, startTime) => {
  // eslint-disable-next-line valid-typeof
  const check = (against) => ({ previewExtracted }) => typeof previewExtracted === against;
  const performed = extracted.filter(check('string'));
  const skipped = extracted.filter(check('boolean'));

  const diff = moment().diff(startTime, 'seconds', true);

  console.log(chalk.green(`
    > ${performed.length} successfully extracted previews.
    > ${skipped.length} skipped files because they already had a preview.
    > Completed in ${diff} seconds.
  `));
};

export const logError = err => {
  console.log(chalk.red(err.message));
  console.log(chalk.dim(err));
};
