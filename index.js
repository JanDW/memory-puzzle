// @ts-check
'use strict';

class AudioController {
  constructor() {
    this.bgMusic = new Audio('./sounds/background-game-melody-loop.mp3');
    this.matchSound = new Audio('./sounds/match-sound.mp3');
    this.completeSound = new Audio('./sounds/complete-sound.wav');
    this.bgMusic.loop = true;
    this.bgMusic.volume = 0.5;
    this.soundEnabled = false;
  }

  startMusic() {
    this.bgMusic.play();
  }

  stopMusic() {
    this.bgMusic.pause();
    this.bgMusic.currentTime = 0;
  }

  match() {
    this.soundEnabled && this.matchSound.play();
  }

  complete() {
    this.soundEnabled && this.completeSound.play();
  }
}

const grid = document.querySelector('#grid');
const triesOutput = document.querySelector('#tries');
const audioControl = document.querySelector('#sound');
const matchedPairsOutput = document.querySelector('#matched');
const matchedPairsTotalOutput = document.querySelector('#matchedTotal');
const gridSize = 4;
const numberOfTiles = gridSize ** 2;
const audioController = new AudioController();
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
  '🍔',
  '😶‍🌫️',
  '🐒',
  '🦍',
  '🦧',
  '💘',
  '💣',
  '👁️',
  '👶🏼',
  '👩🏻‍🦱',
  '👩‍🎤',
  '👩🏼‍🚀',
  '👮🏻',
  '👸🏾',
  '🎅🏼',
  '🧜🏿‍♀️',
  '🐨',
  '🦄',
  '🐣',
  '🐊',
  '🦔',
  '🥐',
  '🍟',
  '🧅',
];

let tries = 0;
let matchedPairs = 0;
let secondClick = false;
let clickDisabled = false;
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

  // Two tiles visible, block UI
  if (clickDisabled) {
    return;
  }

  // Make sure we get the button and not the contained div
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
    tries++;
    clickDisabled = true;
    button.firstChild.classList.add('visible');
    secondClick = !secondClick;
    // if emojis are not the same, hide them
    if (firstTile.firstChild.textContent !== button.firstChild.textContent) {
      setTimeout(function () {
        firstTile.firstChild.classList.remove('visible');
        button.firstChild.classList.remove('visible');
        clickDisabled = false;
      }, 1000);
    } else {
      clickDisabled = false;
      matchedPairs++;
      audioController.match();
    }
    if (matchedPairs === gridSize ** 2 / 2) {
      audioController.complete();
      startConfetti();
      setTimeout(function () {
        stopConfetti();
      }, 3000);
    }
    matchedPairsOutput.innerText = matchedPairs;
    triesOutput.innerText = tries;
  }
}

// MAIN


//@DOING Not responding to click event
audioControl.addEventListener('click', (e) => {
  console.log(this);
  if (e.target.textContent === '🔇') {
    audioController.startMusic();
    e.target.textContent = '🔊';
  } else {
    audioController.stopMusic();
    e.target.textContent = '🔇';
  }
  audioController.soundEnabled = !audioController.soundEnabled;
});

matchedPairsTotalOutput.innerText = gridSize ** 2 / 2;

// Shuffle the emoji's
shuffledEmojis = shuffleArray(emojis);
// Select the half of the gridsize emoji's
uniqueBoardEmojis = shuffledEmojis.slice(0, numberOfTiles / 2);
// Now duplicate them and shuffle again
allBoardEmojis = shuffleArray(shuffleArray(shuffleArray(duplicateArrayElements(uniqueBoardEmojis))));

setRootProperty('--grid-size', gridSize);

generateGridInDOM(grid, gridSize, allBoardEmojis);

grid.addEventListener('click', handleClick);
