import test from 'tape';
import { join } from 'path';
import exists from '../../lib/utils/exists';

const pathToExistingFile = join(__dirname, 'exists.spec.js');
const pathToNonExistingFile = join(__dirname, 'helloWorld.js');

test('@module utils/exists', assert => {
  const should = [
    'Should synchronously return true if file exists',
    'Should synchronously return an Error-object if file does not exists',
    'Should throw an error if provided argument is not a string',
  ];

  const actual0 = exists(pathToExistingFile);
  const expected0 = true;
  assert.equal(actual0, expected0, should[0]);


  const actual1 = exists(pathToNonExistingFile) instanceof Error;
  const expected1 = true;
  assert.equal(actual1, expected1, should[1]);


  const actual2 = () => exists(1);
  const expected2 = /exists()/;
  assert.throws(actual2, expected2, should[2]);

  assert.end();
});

// test('Util: exists()', assert => {
//   const string = 'Should synchronously return an Error-object if file does not exists';
//   const actual = exists(pathToNonExistingFile) instanceof Error;
//   const expected = true;
//
//   assert.equal(actual, expected, string);
//   assert.end();
// });
//
// test('Util: exists()', assert => {
//   const string = 'Should throw an error if provided argument is not a string';
//
//   assert.throws(() => exists(1), /exists()/, string);
//   assert.end();
// });
