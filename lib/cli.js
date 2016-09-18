import Promise, { promisify } from 'bluebird';
import glob from 'glob';

import progress from './utils/progress';
import { logFilesFound } from './utils/log';

import Rawly from './index';

const globAsync = promisify(glob);

Promise.seriesMap = (arr, mapFn) => {
  const p = arr.map(mapFn);
  return Promise.reduce(p, (values, promise) => (
    promise().then((result) => [...values, result])
  ), []);
};


const createRawlys = paths => Promise.resolve(paths.map(path => new Rawly(path)));
const extractPreview = (rawlys, { size, ending }) => {
  console.log(size);
  console.log(ending);
  return Promise.seriesMap(rawlys, (rawly) => () => rawly.extractPreview(size, ending));
};

export default async function extract(program) {
  const [globPattern] = program.args;
  const paths = await globAsync(globPattern);

  logFilesFound(paths);
  progress.init(paths.length);
  progress.tick(0);

  const rawlys = await createRawlys(paths);
  const previews = await extractPreview(rawlys, program);

  return previews;
}
