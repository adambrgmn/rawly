import { join } from 'path';
import spawn from 'cross-spawn';
import Promise from 'bluebird';
import exists from './utils/exists';

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

    this.name = Rawly.getFileName(path);
    this.path = Rawly.getDirPath(path);
    this.ext = Rawly.getFileExtension(path);
    this.type = Rawly.getMIMEType(path);
    this.previews = Rawly.getPreviews(path);
    this.previewsExtracted = false;
  }

  /**
   * Get the file name of a certain file
   * @param  {String} path - Absolute path to file
   * @return {String}        String representing file name
   */
  static getFileName(path) {
    checkPath(path);

    const fileName = path
      .split('/')
      .pop()
      .split('.')
      .slice(0, -1)
      .join('.');

    return fileName;
  }

  /**
   * Get path to firectory where file is located
   * @param  {String} path - Absolute path to file
   * @return {String}        String representing absolute path to directory
   */
  static getDirPath(path) {
    checkPath(path);

    const dirPath = path
      .split('/')
      .slice(0, -1)
      .join('/');

    return dirPath;
  }

  /**
   * Get file extension
   * @param  {String} path - Absolute path to file
   * @return {String}        String representing file extension
   */
  static getFileExtension(path) {
    checkPath(path);

    const extension = path
      .split('/')
      .pop()
      .split('.')
      .pop();

    return extension;
  }

  /**
   * Get MIME type of file provided
   * @param  {String} path - Absolute path to file
   * @return {String}        String representing MIME type (eg. "image/x-canon-cr2")
   */
  static getMIMEType(path) {
    checkPath(path);

    const result = spawn.sync('exiv2', ['pr', path])
      .output[1]
      .toString();
    const mimetype = result.match(/MIME type\s*:\s(.*)/);
    return mimetype[1];
  }

  /**
   * Get the files available previews
   * @param  {String}        path - Absolute path to file
   * @return {Array<Object>}        An array of objects
   */
  static getPreviews(path) {
    checkPath(path);

    const result = spawn.sync('exiv2', ['-pp', path])
      .output[1]
      .toString()
      .trim()
      .split('\n');

    try {
      const previews = result.map(string => {
        const [
          ,
          id,
          type,
          dimensions,
          size,
        ] = string.match(/\w*\s(\d*):\s(\w*\/\w*),\s(\d*x\d*)\s\w*,\s(\d*)\s\w*/i);

        return { id: Number(id), type, dimensions, size: Number(size) };
      });

      return previews;
    } catch (err) {
      return undefined;
    }
  }

  /**
   * Extract previews from RAW-file
   * @param  {(Number|Array<Number>)} [id] - Id of one, or several previews to extract
   * @param  {Boolean}         force=false - Force an overwrite of existing previews
   * @return {Promise}                       Returns Promise if files are extracted
   */
  extractPreviews(id, force = false) {
    if (!force && this.previewsExtracted) {
      return Promise.resolve(`Previews for ${this.name}.${this.ext} are already extracted`);
    }

    let args;

    if (Array.isArray(id)) {
      args = id;
    } else if (id) {
      args = [id];
    } else {
      args = this.previews.map(pre => pre.id);
    }

    return new Promise((resolve, reject) => {
      const previews = args.map(arg => `-ep${arg}`);
      const file = join(this.path, `${this.name}.${this.ext}`);
      const exiv2 = spawn('exiv2', [...previews, file]);

      exiv2.stdin.setEncoding('utf-8');

      exiv2.stdout.on('data', () => {
        const message = force ? 'yes\n' : 'no\n';
        exiv2.stdin.write(message);
      });

      exiv2.stderr.on('data', err => {
        const error = err.toString();
        reject(error);
      });

      exiv2.on('close', code => {
        exiv2.stdin.end();
        if (code !== 0) reject(new Error(`Exiv2 exited with code ${code}`));
        const message = `Extracted ${args.length} preview(s) from ${this.name}.${this.ext}`;
        this.previewsExtracted = true;
        resolve(message);
      });
    });
  }
}

export default Rawly;
