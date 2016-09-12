import Promise, { promisify } from 'bluebird';
import glob from 'glob';

import Bar from './utils/progressBar';
import determinePreviews from './utils/determinePreviews';
import { logFilesFound } from './utils/log';

import Rawly from './index';

const globAsync = promisify(glob);
const progressBar = new Bar();

const initProgressBar = paths => progressBar.init(paths.length);
const createRawlys = paths => Promise.resolve(paths.map(path => new Rawly(path)));
const extractPreviews = (rawlys, program) => {
  const p = rawlys.map((rawly) => {
    const previewsToExtract = determinePreviews(rawly.previews, program.previews);
    const forceOverwrite = program.force;
    const promise = rawly.extractPreviews(previewsToExtract, forceOverwrite);
    progressBar.tick();

    return promise;
  });

  return Promise.all(p);
};

export default async function extract(program) {
  const [globPattern] = program.args;
  const paths = await globAsync(globPattern);

  logFilesFound(paths);
  initProgressBar(paths);

  const rawlys = await createRawlys(paths);
  const previews = await extractPreviews(rawlys, program);

  return previews;
}
