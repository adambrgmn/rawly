import { join } from 'path';
import { promisify } from 'bluebird';
import fs from 'fs';
import rimraf from 'rimraf';
import sharp from 'sharp';
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


test('@class Rawly.extractPreview', assert => {
  const p1 = () => {
    const rawly = new Rawly(cr2Path);
    return rimrafAsync('./**/raw*.jpg')
      .then(() => rawly.extractPreview())
      .then(() => statAsync(join(__dirname, `${rawly.name}.jpg`)))
      .then((stat) => {
        const should = 'Should extract a preview';
        const actual = stat.isFile();
        const expected = true;

        assert.equal(actual, expected, should);
        return rimrafAsync('./**/raw*.jpg');
      });
  };

  const p2 = () => {
    const rawly = new Rawly(cr2Path);
    return rimrafAsync('./**/raw*.jpg')
      .then(() => rawly.extractPreview('1200x900'))
      .then(() => new Promise((resolve) => {
        sharp('./raw.jpg')
          .on('info', resolve);
      }))
      .then((info) => {
        const should = 'Should extract a preview and resize it to given dimensions';
        const actual = [info.width, info.heigth];
        const expected = [1200, 900];

        assert.deepEqual(actual, expected, should);
        return rimrafAsync('./**/raw*.jpg');
      });
  };

  const p3 = () => {
    const rawly = new Rawly(cr2Path);
    return rimrafAsync('./**/raw*.jpg')
      .then(() => rawly.extractPreview(undefined, '-preview'))
      .then(() => statAsync(join(__dirname, `${rawly.name}-preview.jpg`)))
      .then((stat) => {
        const should = 'Append a suffix to file if one is provided as second argument';
        const actual = stat.isFile();
        const expected = true;

        assert.equal(actual, expected, should);
        return rimrafAsync('./**/raw*.jpg');
      });
  };

  return rimrafAsync('./**/raw*.jpg')
    .then(p1())
    .then(p2())
    .then(p3())
    .then(assert.end)
    .catch(assert.end);
});
