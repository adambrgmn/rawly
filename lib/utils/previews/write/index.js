import { writeFile } from 'fs';
import Promise, { promisify } from 'bluebird';
import { join } from 'path';

const writeFileAsync = promisify(writeFile);

export default function write({ path, name }, suffix) {
  const fullPath = join(path, `${name}${suffix}.jpg`);
  return (buffer) => writeFileAsync(fullPath, buffer).then(() => Promise.resolve(true));
}
