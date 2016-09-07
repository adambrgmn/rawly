/**
 * This package should:
 *  be used something like this:
 *    const file = rawly('path/to/file.CR2');
 *    file // { name: 'file.CR2', path: 'path/to/dir', type: 'Canon RAW', previews: [], methods }
 *    file.isRaw // Bool
 *    file.hasPreviews // Bool
 *    file.previewsAlreadyRendered // Bool
 *    file.previews // [{
 *                       name: 'file-thumb.jpg',
 *                       type: 'image/jpg',
 *                       dimensions: '160x120',
 *                       size: 11165
 *                     }]
 *    file.extractPreview('thumb', 'optBasename', 'opt/dir') // (creates optBasename-thumb.jpg)
 *    file.extractPreview('all', 'optBasename', 'opt/dir')
 */

import exists from './utils/exists';

class Rawly {
  constructor(filePath) {
    const fileExists = exists(filePath);
    if (fileExists instanceof Error) throw fileExists;

    this.name = Rawly.getFileName(filePath);
    this.path = Rawly.getDirPath(filePath);
    this.type = Rawly.getFileType(filePath);
  }

  static getFileName(path) {
    const fileName = path
      .split('/')
      .pop();

    return fileName;
  }

  static getDirPath(path) {
    const dirPath = path
      .split('/')
      .slice(0, -1)
      .join('/');

    return dirPath;
  }

  static getFileType(path) {
    // exiv2 -pp file > /MIME type\s*:\s(.*)/
    return path;
  }
}

export default Rawly;
