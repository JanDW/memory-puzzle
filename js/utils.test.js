// @ts-check

import {
  shuffleArray,
  duplicateArrayElements,
  setRootProperty,
} from './utils.js';

// This probably doesn't belong in a unit testing suite
// but this project is for experimenting and learning
// So let's go for it anyway
// https://blog.codinghorror.com/the-danger-of-naivete/

describe('Shuffle elements in an array', () => {
  let permutations = {
    1234: 0,
    1243: 0,
    1324: 0,
    1342: 0,
    1423: 0,
    1432: 0,
    2134: 0,
    2143: 0,
    2314: 0,
    2341: 0,
    2413: 0,
    2431: 0,
    3124: 0,
    3142: 0,
    3214: 0,
    3241: 0,
    3412: 0,
    3421: 0,
    4123: 0,
    4132: 0,
    4213: 0,
    4231: 0,
    4312: 0,
    4321: 0,
  };

  function resetTestArray() {
    return [1, 2, 3, 4];
  }

  test(`Difference between max and min values is within limit`, () => {
    let i = 0;
    let testArray;
    while (i < 600000) {
      testArray = resetTestArray();
      shuffleArray(testArray);
      let result = testArray.join('');
      permutations[result]++;
      i++;
    }
    let values = Object.values(permutations);
    let maxValue = Math.max(...values);
    let minValue = Math.min(...values);
    let expectation = maxValue - minValue;

    // 1000 is a magic number, but it should almost never occur
    // unless the algorithm changes and is biased
    // (note to self: you should probablydo the math before making
    // bold assertions)

    // console.log(`Difference between max and min values: ${expectation}`);

    expect(expectation).toBeLessThan(1000);
  });
});

test('Duplicates an array', () => {
  const result = duplicateArrayElements([1, 2, 3]);
  const expectation = [1, 1, 2, 2, 3, 3];
  expect(result).toEqual(expectation);
});

test('Sets root property', () => {
  const root = Array.from(document.getElementsByTagName('html'))[0];
  setRootProperty('--test', 'tested');

  const result = root.getAttribute('style');
  const expectation = '--test: tested;';

  expect(result).toBe(expectation);
});
