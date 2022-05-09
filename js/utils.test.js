import { duplicateArrayElements, setRootProperty } from './utils.js';

test('Duplicates an array', () => {
  const result = duplicateArrayElements([1,2,3]);
  const expectation = [1, 1, 2, 2, 3, 3];
  expect(result).toEqual(expectation);
})

test('Sets root property', () => {
 const root = Array.from(document.getElementsByTagName('html'))[0];
 setRootProperty('--test','tested');

 const result = root.getAttribute('style');
 const expectation = '--test: tested;';

 expect(result).toBe(expectation);
});


