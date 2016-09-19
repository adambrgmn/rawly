import { writeFile } from 'fs';
import Promise, { promisify } from 'bluebird';
import { join } from 'path';

const writeFileAsync = promisify(writeFile);

export default function write({ dir, name }, suffix) {
  const fullPath = join(dir, `${name}${suffix}.jpg`);
  return (buffer) => writeFileAsync(fullPath, buffer).then(() => Promise.resolve(true));
}
