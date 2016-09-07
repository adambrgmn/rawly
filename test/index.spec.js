import { join } from 'path';
import test from 'tape';
import Rawly from '../lib';

const rawPath = join(__dirname, 'test.CR2');

test('Rawly: constructor()', assert => {
  const string = 'Should create an instance of Rawly';
  const actual = new Rawly(rawPath) instanceof Rawly;
  const expected = true;

  assert.equal(actual, expected, string);
  assert.end();
});

test('Rawly: constructor()', assert => {
  const string = 'Should return an object with file info';
  const object = new Rawly(rawPath);

  const actual = {};
  const expected = {
    name: 'test.CR2',
    path: __dirname,
    type: 'image/x-canon-cr2',
    previews: true,
  };

  Object.keys(object).forEach(key => {
    if (
      key === 'name' ||
      key === 'path' ||
      key === 'type'
    ) {
      actual[key] = object[key];
    } else {
      actual[key] = object[key] != null;
    }
  });

  assert.deepEqual(actual, expected, string);
  assert.end();
});


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
