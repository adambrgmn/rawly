/**
 * This package should:
 *  be used something like this:
 *    const file = rawly('path/to/file.CR2');
 *    file // { name: 'file.CR2', path: 'path/to/dir', type: 'Canon RAW', previews: [], methods }
 *    file.hasPreviews // Bool
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

export default {};
