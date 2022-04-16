// @ts-check
'use strict';
// import { wrapGrid } from 'animate-css-grid';

const grid = document.querySelector('#grid');
const gridSize = 4;
const numberOfTiles = gridSize ** 2; //?

const emojis = [
  '💩',
  '🥳',
  '👻',
  '🧑‍🎤',
  '🧚‍♀️',
  '🧞‍♀️',
  '🧗‍♀️',
  '🚀',
  '🧨',
  '🧸',
  '🎁',
  '🪆',
  '🎏',
  '🚽',
  '🇧🇪',
  '📺',
  '💎',
  '🔮',
  '🎀',
  '💝',
  '💖',
  '⚽️',
  '🥏',
  '⛸',
  '🔑',
  '🇺🇸',
];

let numberOfClicks = 0; 
let shuffledEmojis;
let uniqueBoardEmojis;
let allBoardEmojis;

let firstTileId;
// let secondTileId;

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
function shuffleArray(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function duplicateArrayElements(a) {
  return a.flatMap((i) => [i, i]); //?
}

const setRootProperty = (property, value) => {
  const root = document.documentElement;
  root.style.setProperty(property, value);
};

// Generate grid 4×4
const generateGridInDOM = (grid, gridSize, emojis) => {
  let gridHTML = '';
  // Remove existing grid
  while (grid.firstChild) {
    grid.removeChild(grid.firstChild);
  }
  // create tiles HTML
  for (let i = 0; i < gridSize ** 2; i++) {
    gridHTML += `<button><div id="tile--${i}">${emojis[i]}</div></button>`;
  }
  // Insert in DOM
  grid.insertAdjacentHTML('beforeend', gridHTML);
};

// Shuffle the emoji's
shuffledEmojis = shuffleArray(emojis);

// Select the half of the gridsize emoji's
// e.g. 6x6 = 36, so select 18 emojis

uniqueBoardEmojis = shuffledEmojis.slice(0, numberOfTiles / 2);

// Duplicate each emoji in the array
allBoardEmojis = shuffleArray(duplicateArrayElements(uniqueBoardEmojis));
// Shuffle the array

setRootProperty('--grid-size', gridSize);

generateGridInDOM(grid, gridSize, allBoardEmojis);




grid.addEventListener('click', (e) => {
  // Only if tile is not already visible
  if (!e.target.classList.contains('visible')) {
    // Are we revealing the first tile to get checked?
    if (numberOfClicks === 0) {
      // @TODO maybe I can store the e.target in variable instead of retrieving ID
      // so I don't have to use .querySelector later?
      firstTileId = e.target.getAttribute('id');
      e.target.classList.add('visible');
      numberOfClicks = 1;
      return;
    }
    // Another tile is visible, waiting to get checked
    if (numberOfClicks === 1) {
      // secondTileId = e.target.getAttribute('id');
      // Reveal the second tile
      e.target.classList.add('visible');
      let firstTile = document.querySelector(`#${firstTileId}`);
        // if emojis are not the same, hide them
        if (firstTile.textContent !== e.target.textContent) {
          setTimeout(function(){
            firstTile.classList.remove('visible');
            e.target.classList.remove('visible');
          }, 1000)
        }
      numberOfClicks = 0;
    }
  }
});
