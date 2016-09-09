/** @module utils/exists */

import { statSync } from 'fs';

/**
 * Check if file on path exists
 * @param  {string}        path - String representing path to file
 * @return {Boolean|Error}        Returns true if file exists, otherwise return the error
 */
export default function exists(path) {
  // Check to see if provided path is string
  if (typeof path !== 'string') {
    throw new TypeError('Utils exists(): Provided path must be string.');
  }

  try {
    statSync(path);
    return true;
  } catch (err) {
    return err;
  }
}
