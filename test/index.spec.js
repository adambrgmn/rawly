import { join } from 'path';
import test from 'tape';
import Rawly from '../lib';

const rawPath = join(__dirname, 'test1.CR2');

test('@class Rawly.constructor()', assert => {
  const should = [
    'Should create an instance of Rawly',
    'Should return an object with information about file',
    'Should throw an error if provided path is either non existing or not a string',
  ];

  const actual0 = new Rawly(rawPath) instanceof Rawly;
  const expected0 = true;
  assert.equal(actual0, expected0, should[0]);


  const actual1 = new Rawly(rawPath);
  const expected1 = {
    name: 'test',
    ext: 'CR2',
    path: __dirname,
    type: 'image/x-canon-cr2',
    size: 24624466,
    previews: [
      { name: 'Preview 1', type: 'image/jpeg', dimensions: '160x120', size: 11165 },
      { name: 'Preview 2', type: 'image/tiff', dimensions: '362x234', size: 508248 },
      { name: 'Preview 3', type: 'image/jpeg', dimensions: '5616x3744', size: 1705174 },
    ],
  };

  assert.deepEqual(actual1, expected1, should[1]);

  assert.throws(() => new Rawly(1), should[2]);

  assert.end();
});

const properties = Object
  .getOwnPropertyNames(Rawly)
  .filter(property => typeof Rawly[property] === 'function');

properties.forEach(property => {
  test(`@class Rawly.${property}`, assert => {
    const should = [
      'Should return a string',
      'Should throw if provided argument is not a string',
    ];
    const actual = typeof Rawly[property](rawPath);
    const expected = 'string';

    assert.equal(actual, expected, should[0]);
    assert.throws(() => Rawly[property](1), should[1]);
    assert.end();
  });
});
