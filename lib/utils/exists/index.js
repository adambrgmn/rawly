import { statSync } from 'fs';

export default function exists(path) {
  if (typeof path !== 'string') {
    throw new TypeError('Util exists(): Provided path must be string.');
  }

  try {
    statSync(path);
    return true;
  } catch (err) {
    return err;
  }
}
