import chalk from 'chalk';
import moment from 'moment';

export const logFilesFound = (paths) => (console.log(
  chalk.blue(`
    > Found ${paths.length} images and starts extracting previews...
  `)
));

export const logSuccess = (extracted, startTime) => {
  const performed = extracted.filter((bool) => bool);
  const skipped = extracted.filter((bool) => !bool);

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
