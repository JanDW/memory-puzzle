/**
 * Fisher-Yates shuffle array in place.
 * @param {Array} a items An array containing the items.
 */

function shuffleArray(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Duplicates elements in array [1,a,true] => [1,1,a,a,true,true]
 * @param  {Array} a
 */

function duplicateArrayElements(a) {
  return a.flatMap((i) => [i, i]);
}

/**
 * set a CSS custom property on :root
 * @param  {string} property
 * @param  {string} value
 * 
 */

const setRootProperty = (property, value) => {
  const root = document.documentElement;
  root.style.setProperty(property, value);
};

export { shuffleArray, duplicateArrayElements, setRootProperty };
