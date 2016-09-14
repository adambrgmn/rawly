import spawn from 'cross-spawn';
import glob from 'glob';
import exists from './utils/exists';
import extract from './utils/previews/extract';
import rename from './utils/previews/rename';
import resize from './utils/previews/resize';
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
    this.type = Rawly.getMIMEType(path);
    this.previews = Rawly.getPreviews(path);
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
   * @param  {size}    size='1200x900' - Size of extracted preview
   * @param  {Boolean} force=false     - Force an overwrite of existing previews
   * @param  {String}  suffix=''       - Suffix to append to filename of preview
   * @return {Promise}                   Resolves Promise if files are extracted or not
   */
  async extractPreview(size = '1200x900', force = false, suffix = '') {
    if (this.previewExtracted) {
      progress.tick();
      return Promise.resolve(this);
    }

    try {
      const extracted = await extract(this, force);
      const renamed = await rename(suffix)(extracted);
      const resized = await resize(size)(renamed);
      progress.tick();

      return resized;
    } catch (err) {
      throw err;
    }
  }
}

export default Rawly;
