import test from 'tape';
import { join } from 'path';
import exists from '../../lib/utils/exists';

const pathToExistingFile = join(__dirname, 'exists.spec.js');
const pathToNonExistingFile = join(__dirname, 'helloWorld.js');

test('Util: exists()', assert => {
  const string = 'Should synchronously return true if file exists';
  const actual = exists(pathToExistingFile);
  const expected = true;

  assert.equal(actual, expected, string);
  assert.end();
});

test('Util: exists()', assert => {
  const string = 'Should synchronously return an Error-object if file does not exists';
  const actual = exists(pathToNonExistingFile) instanceof Error;
  const expected = true;

  assert.equal(actual, expected, string);
  assert.end();
});

test('Util: exists()', assert => {
  const string = 'Should throw an error if provided argument is not a string';

  assert.throws(() => exists(1), /exists()/, string);
  assert.end();
});
