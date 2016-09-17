import Promise, { promisify } from 'bluebird';
import glob from 'glob';

import progress from './utils/progress';
import { logFilesFound } from './utils/log';

import Rawly from './index';

const globAsync = promisify(glob);

const createRawlys = paths => Promise.resolve(paths.map(path => new Rawly(path)));
const extractPreview = (rawlys, { size, force, ending }) => {
  const p = rawlys.map((rawly) => rawly.extractPreview(size, force, ending));
  return Promise.all(p);
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
