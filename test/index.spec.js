import { join } from 'path';
import { promisify } from 'bluebird';
import fs from 'fs';
import rimraf from 'rimraf';
import sharp from 'sharp';
import test from 'tape';
import Rawly from '../lib';

const cr2Path = join(__dirname, 'raw.CR2');

const statAsync = promisify(fs.stat);
const rimrafAsync = promisify(rimraf);

test('@class Rawly.constructor()', assert => {
  const should = [
    'Should create an instance of Rawly',
    'Should return an object with information about file',
    'Should throw an error if provided path is either non existing or not a string',
  ];

  const actual0 = new Rawly(cr2Path) instanceof Rawly;
  const expected0 = true;
  assert.equal(actual0, expected0, should[0]);


  const actual1 = new Rawly(cr2Path);
  const expected1 = {
    fullPath: cr2Path,
    path: __dirname,
    name: 'raw',
    ext: 'CR2',
    previewExtracted: false,
  };

  assert.deepEqual(actual1, expected1, should[1]);
  assert.throws(() => new Rawly(1), should[2]);

  assert.end();
});


[
  'getFileName',
  'getDirPath',
  'getFileExtension',
].forEach(property => {
  test(`@class Rawly.${property}`, assert => {
    const should = [
      'Should return a string',
      'Should throw if provided argument is not a string',
    ];
    const actual = typeof Rawly[property](cr2Path);
    const expected = 'string';

    assert.equal(actual, expected, should[0]);
    assert.throws(() => Rawly[property](1), should[1]);
    assert.end();
  });
});


test('@class Rawly.extractPreview', (assert) => {
  const createAndExtract = (dim, suff) => new Rawly(cr2Path).extractPreview(dim, suff);
  const statCheck = (fileName) => () => statAsync(join(__dirname, fileName));
  const clear = () => rimrafAsync('./**/raw*.jpg');

  const p = [];

  p.push(createAndExtract()
    .then(statCheck('raw.jpg'))
    .then((stat) => {
      const should = 'Should extract a preview';
      const actual = stat.isFile();
      const expected = true;

      assert.equal(actual, expected, should);
      return Promise.resolve();
    })
  );

  p.push(createAndExtract('1200x900')
    .then(() => sharp(join(__dirname, 'raw.jpg')).metadata())
    .then((meta) => {
      const should = 'Should resize image to maximum given dimensions';
      const actual = meta.width <= 1200 && meta.height <= 900;
      const expected = true;

      assert.equal(actual, expected, should);
      return Promise.resolve();
    })
  );

  p.push(createAndExtract(undefined, '-preview')
    .then(statCheck('raw-preview.jpg'))
    .then((stat) => {
      const should = 'Should append a suffix to preview file if provided';
      const actual = stat.isFile();
      const expected = true;

      assert.equal(actual, expected, should);
      return Promise.resolve();
    })
  );

  clear()
    .then(() => Promise.all(p))
    .then(clear)
    .then(assert.end)
    .catch((err) => {
      assert.end(err);
      return clear();
    });
});
