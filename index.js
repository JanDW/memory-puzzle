// @ts-check
'use strict';
// import { wrapGrid } from 'animate-css-grid';

const grid = document.querySelector('#grid');
const gridSize = 4;
const numberOfTiles = gridSize ** 2;
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

let secondClick = false;
let shuffledEmojis;
let uniqueBoardEmojis;
let allBoardEmojis;
let firstTile;

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
    gridHTML += `<button type="button" id="tile--${i}" class="btn"><div>${emojis[i]}</div></button>`;
  }
  // Insert in DOM
  grid.insertAdjacentHTML('beforeend', gridHTML);
};

function handleClick(e) {
  let button;

  if (e.target.matches('div')) {
    button = e.target.parentElement;
  } else {
    button = e.target;
  }

  // Already visible? 
  if (button.firstChild.classList.contains('visible')) {
    return;
  }
  // First tile?
  if (!secondClick) {
    button.firstChild.classList.add('visible');
    secondClick = !secondClick;
    firstTile = button;
    return;
  }
  // First tile visible, checking 2nd tile
  if (secondClick) {
    button.firstChild.classList.add('visible');
    secondClick = !secondClick;
    // if emojis are not the same, hide them
    if (firstTile.firstChild.textContent !== button.firstChild.textContent) {
      setTimeout(function () {
        firstTile.firstChild.classList.remove('visible');
        button.firstChild.classList.remove('visible');
      }, 1000);
    }
  }
}

// MAIN

// Shuffle the emoji's
shuffledEmojis = shuffleArray(emojis);
// Select the half of the gridsize emoji's
uniqueBoardEmojis = shuffledEmojis.slice(0, numberOfTiles / 2);
// Now duplicate them and shuffle again
allBoardEmojis = shuffleArray(duplicateArrayElements(uniqueBoardEmojis));

setRootProperty('--grid-size', gridSize);

generateGridInDOM(grid, gridSize, allBoardEmojis);

grid.addEventListener('click', handleClick);
