import { join } from 'path';
import Promise, { promisify } from 'bluebird';
import fs from 'fs';
import rimraf from 'rimraf';
import test from 'tape';
import Rawly from '../lib';

const cr2Path = join(__dirname, 'test.CR2');
const jpgPath = join(__dirname, 'test.jpg');

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
    name: 'test',
    ext: 'CR2',
    path: __dirname,
    type: 'image/x-canon-cr2',
    previewsExtracted: false,
    previews: [
      { id: 1, type: 'image/jpeg', dimensions: '160x120', size: 11165 },
      { id: 2, type: 'image/tiff', dimensions: '362x234', size: 508248 },
      { id: 3, type: 'image/jpeg', dimensions: '5616x3744', size: 1705174 },
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


test('@class Rawly.extractPreviews', assert => {
  const should = 'Should return a Promise';

  const rawly = new Rawly(cr2Path);
  const actual = typeof rawly.extractPreviews().then;
  const expected = 'function';

  assert.equal(actual, expected, should);
  assert.end();
});


test('@class Rawly.extractPreviews', assert => {
  const rawly = new Rawly(cr2Path);

  const promises = [
    // Should extract all previews if nothing else is stated
    rawly.extractPreviews()
      .then(() => {
        const p = [
          statAsync(join(__dirname, 'test-preview1.jpg')),
          statAsync(join(__dirname, 'test-preview2.tif')),
          statAsync(join(__dirname, 'test-preview3.jpg')),
        ];

        return Promise.all(p);
      })
      .then(array => {
        const should = 'Should extract all previews if nothing else is stated';
        const actual = array.map(stat => stat.isFile());
        const expected = [true, true, true];

        assert.deepEqual(actual, expected, should);
        return rimrafAsync('./**/*-preview*.*');
      }),
    // Should extract only a single preview if a number is provided
    rawly.extractPreviews(1)
      .then(() => statAsync(join(__dirname, 'test-preview1.jpg')))
      .then(stat => {
        const should = 'Should extract only a single preview if a number is provided';
        const actual = stat.isFile();
        const expected = true;

        assert.deepEqual(actual, expected, should);
        return rimrafAsync('./**/*-preview*.*');
      }),
    // Should accept an array of previews to extract
    rawly.extractPreviews([2, 3])
      .then(() => {
        const p = [
          statAsync(join(__dirname, 'test-preview2.tif')),
          statAsync(join(__dirname, 'test-preview3.jpg')),
        ];

        return Promise.all(p);
      })
      .then(arr => {
        const should = 'Should accept an array of previews to extract';
        const actual = arr.map(stat => stat.isFile());
        const expected = [true, true];

        assert.deepEqual(actual, expected, should);
        return rimrafAsync('./**/*-preview*.*');
      }),
  ];

  Promise.all(promises)
    .then(() => assert.end())
    .catch(assert.end);
});
