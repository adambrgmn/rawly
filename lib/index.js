import spawn from 'cross-spawn';
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
    pathError(path, 'constructor()');
    const fileExists = exists(path);
    if (fileExists instanceof Error) throw fileExists;

    this.name = Rawly.getFileName(path);
    this.path = Rawly.getDirPath(path);
    this.ext = Rawly.getFileExtension(path);
    this.type = Rawly.getMIMEType(path);
  }

  /**
   * Get the file name of a certain file
   * @param  {String} path - Absolute path to file
   * @return {String}        String representing file name
   */
  static getFileName(path) {
    pathError(path, 'getFileName()');

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
    pathError(path, 'getFilePath()');

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
    pathError(path, 'getFileExtension()');

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
    pathError(path, 'getMIMEType()');

    const result = spawn.sync('exiv2', ['pr', path]).output[1].toString();
    const mimetype = result.match(/MIME type\s*:\s(.*)/);
    return mimetype[1];
  }
}

export default Rawly;
