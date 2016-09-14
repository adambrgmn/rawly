import { join } from 'path';
import { promisify } from 'bluebird';
import fs from 'fs';
import rimraf from 'rimraf';
import test from 'tape';
import Rawly from '../lib';

const cr2Path = join(__dirname, 'raw.CR2');
const jpgPath = join(__dirname, 'jpeg.jpg');

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
    name: 'raw',
    ext: 'CR2',
    path: __dirname,
    fullPath: cr2Path,
    type: 'image/x-canon-cr2',
    previewExtracted: false,
    previews: [
      { id: 1, type: 'image/jpeg', dimensions: '160x120', size: 13568 },
      { id: 2, type: 'image/tiff', dimensions: '362x234', size: 508248 },
      { id: 3, type: 'image/jpeg', dimensions: '5616x3744', size: 1352854 },
    ],
  };

  assert.deepEqual(actual1, expected1, should[1]);
  assert.throws(() => new Rawly(1), should[2]);

  assert.end();
});


[
  'getFileName',
  'getDirPath',
  'getFileExtension',
  'getMIMEType',
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


test('@class Rawly.getPreviews', assert => {
  const should = [
    'Should return an array',
    'Should return an array of objects',
    'Should return undefined if there are no previews',
  ];

  const actual0 = Array.isArray(Rawly.getPreviews(cr2Path));
  const expected0 = true;
  assert.equal(actual0, expected0, should[0]);


  const actual1 = typeof Rawly.getPreviews(cr2Path)[0];
  const expected1 = 'object';
  assert.equal(actual1, expected1, should[1]);


  const actual2 = Rawly.getPreviews(jpgPath);
  const expected2 = undefined;
  assert.equal(actual2, expected2, should[2]);

  assert.end();
});


test('@class Rawly.extractPreview', assert => {
  const rawly = new Rawly(cr2Path);

  rimrafAsync('./**/raw*.jpg')
    .then(() => rawly.extractPreview('1200x900'))
    .then(() => statAsync(join(__dirname, `${rawly.name}.jpg`)))
    .then((stat) => {
      const should = 'Should extract a preview';
      const actual = stat.isFile();
      const expected = true;

      assert.equal(actual, expected, should);
    })
    .then(() => rimrafAsync('./**/raw*.jpg'))
    .then(() => assert.end())
    .catch((err) => {
      assert.end(err);
      return rimrafAsync('./**/raw*.jpg');
    });
});
