import { dirname, basename, extname, parse } from 'path';
import glob from 'glob';
import Promise from 'bluebird';
import exists from './utils/exists';
import extract from './utils/previews/extract';
import resize from './utils/previews/resize';
import write from './utils/previews/write';
import progress from './utils/progress';

/**
 * Checks path object is string
 * @param  {String} path            Path object, hopefully, a string
 * @param  {String} functionCalling name of function calling
 * @return {Void}
 */
function checkPath(path) {
  if (typeof path !== 'string') {
    const err = new TypeError('Provided path must be a string.');
    throw err;
  }
}

/** Class representing a RAW-format photo and it's information */
class Rawly {
  /**
   * Create an instance of Rawly
   * @param {String} path - Absolute path to file
   */
  constructor(path) {
    checkPath(path);
    const fileExists = exists(path);
    if (fileExists instanceof Error) throw fileExists;

    this.path = path;
    this.info = parse(path);
    this.previewExtracted = this.previewAlreadyExtracted();
  }

  /**
   * Check if a preview is aready created
   * @param {String}   path - Absolute path to file
   * @return {Boolean}        If a preview already exists of not
   */
  previewAlreadyExtracted() {
    const { dir, name, ext } = this.info;
    const globExp = `${dir}/${name}!(${ext}|.xmp)`;
    const result = glob.sync(globExp);

    if (result.length > 0) return true;

    return false;
  }

  /**
   * Extract previews from RAW-file
   * @param  {size}    size - Size of extracted preview
   * @param  {String}  suffix=''       - Suffix to append to filename of preview
   * @return {Promise}                   Resolves Promise if files are extracted or not
   */
  extractPreview(size, suffix = '') {
    return new Promise((resolve) => {
      if (this.previewExtracted) {
        progress.tick();
        return resolve(false);
      }

      return extract(this.path)
        .then(resize(size))
        .then(write(this.info, suffix))
        .then((done) => {
          progress.tick();
          this.previewExtracted = done;
          return resolve(done);
        });
    });
  }
}

export default Rawly;
