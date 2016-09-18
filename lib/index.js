import spawn from 'cross-spawn';
import glob from 'glob';
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

    this.fullPath = path;
    this.path = Rawly.getDirPath(path);
    this.name = Rawly.getFileName(path);
    this.ext = Rawly.getFileExtension(path);
    this.previewExtracted = Rawly.previewAlreadyExtracted(path);
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
   * Check if a preview is aready created
   * @param {Sting}    path - Absolute path to file
   * @return {Boolean}        If a preview already exists of not
   */
  static previewAlreadyExtracted(path) {
    checkPath(path);
    const file = {
      name: Rawly.getFileName(path),
      ext: Rawly.getFileExtension(path),
      dir: Rawly.getDirPath(path),
    };

    const globExp = `${file.dir}/${file.name}?(-preview*).!(${file.ext})`;
    const result = glob.sync(globExp);

    if (result.length > 0) return true;

    return false;
  }

  /**
   * Extract previews from RAW-file
   * @param  {size}    size - Size of extracted preview
   * @param  {Boolean} force=false     - Force an overwrite of existing previews
   * @param  {String}  suffix=''       - Suffix to append to filename of preview
   * @return {Promise}                   Resolves Promise if files are extracted or not
   */
  async extractPreview(size, suffix = '') {
    if (this.previewExtracted) {
      progress.tick();
      return false;
    }

    try {
      const extracted = await extract(this.fullPath);
      const resized = await resize(size)(extracted);
      const written = await write(this, suffix)(resized);
      progress.tick();

      this.previewExtracted = true;
      return written;
    } catch (err) {
      throw err;
    }
  }
}

export default Rawly;
