// @ts-check
'use strict';

class AudioController {
  constructor() {
    this.bgMusic = new Audio('./sounds/background-music.mp3');
    this.matchSound = new Audio('./sounds/match-sound.mp3');
    this.completeSound = new Audio('./sounds/complete-sound.wav');
    this.bgMusic.loop = true;
    this.bgMusic.volume = 0.5;
    this._isSoundEnabled = true;
    this._isMusicEnabled = false;
  }

  get isSoundEnabled() {
    let localStorageVal = localStorage.isSoundEnabled;
    let castedBool;
    if (localStorageVal) {
      castedBool = localStorageVal === 'true';
    }
    // Set set _isSoundEnabled to the boolean, or to the default in constructor
    // (which will save it to localStorage)
    this.isSoundEnabled = castedBool || this._isSoundEnabled;
    return this._isSoundEnabled;
  }

  set isSoundEnabled(soundBool) {
    this._isSoundEnabled = soundBool;
    localStorage.setItem('isSoundEnabled', soundBool.toString());
  }

  get isMusicEnabled() {
    let localStorageVal = localStorage.isMusicEnabled;
    let castedBool;
    if (localStorageVal) {
      castedBool = localStorageVal === 'true';
    }
    this.isMusicEnabled = castedBool || this._isMusicEnabled;
    return this._isMusicEnabled;
  }

  set isMusicEnabled(musicBool) {
    this._isMusicEnabled = musicBool;
    localStorage.setItem('isMusicEnabled', musicBool.toString());
  }

  startMusic() {
    this.bgMusic.play();
  }

  stopMusic() {
    this.bgMusic.pause();
    this.bgMusic.currentTime = 0;
  }

  match() {
    this.isSoundEnabled && this.matchSound.play();
  }

  complete() {
    this.isSoundEnabled && this.completeSound.play();
  }
}

const audioController = new AudioController();

const grid = document.querySelector('#grid');
const triesOutput = document.querySelector('#tries');

const musicToggle = document.querySelector('#music');
const musicOn = document.querySelector('#music__on');
const musicOff = document.querySelector('#music__off');

const soundToggle = document.querySelector('#sound');
const soundOn = document.querySelector('#sound__on');
const soundOff = document.querySelector('#sound__off');

const matchedPairsOutput = document.querySelector('#matched');
const matchedPairsTotalOutput = document.querySelector('#matchedTotal');

const gridSize = 4;

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
  '🦖',
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
  '🤹🏽‍♀️',
  '🐃',
  '🦘',
  '🐖',
  '🐿️',
  '🐞',
  '🐜',
  '🦕',
  '👅',
  '🎪',
  '🏹',
  '🎨',
  '🛷',
  '🛹',
];

let firstCard, clickDisabled, secondClick;
let tries = 0,
  matchedPairs = 0;

function toggleAudioListener(audioType, toggleControl) {
  toggleControl.addEventListener('click', (e) => {
    let isEnabled;

    if (audioType === 'music') {
      isEnabled = audioController.isMusicEnabled;
      isEnabled === false
        ? audioController.startMusic()
        : audioController.stopMusic();
      audioController.isMusicEnabled = !isEnabled;
    }

    if (audioType === 'sound') {
      isEnabled = audioController.isSoundEnabled;
      audioController.isSoundEnabled = !isEnabled;
    }

    isEnabled = !isEnabled;

    toggleAudioIcon(e.currentTarget, isEnabled);
  });
}

function toggleAudioIcon(currentTarget, isEnabled) {
  if (isEnabled) {
    currentTarget.children[0].removeAttribute('class');
    currentTarget.children[1].setAttribute('class', 'display-none');
  }

  if (!isEnabled) {
    currentTarget.children[0].setAttribute('class', 'display-none');
    currentTarget.children[1].removeAttribute('class');
  }
}

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
  return a.flatMap((i) => [i, i]);
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
  // create card HTML
  for (let i = 0; i < gridSize ** 2; i++) {
    gridHTML += `<button type="button" class="card"><div class="card__front"><span>${emojis[i]}</span></div><div class="card__back"></div></button>`;
  }
  // Insert in DOM
  grid.insertAdjacentHTML('beforeend', gridHTML);
};

function handleClick(e) {
  let eventBubblePath = e.composedPath();
  let button = eventBubblePath.find((el) => el.tagName === 'BUTTON');

  // Two cards visible, block UI
  if (clickDisabled) {
    return;
  }

  // Already visible?
  if (button.classList.contains('visible')) {
    return;
  }
  // First card?
  if (!secondClick) {
    button.classList.add('visible');
    secondClick = true;
    firstCard = button;
    return;
  }
  // First card visible, checking 2nd Card
  if (secondClick) {
    tries++;
    clickDisabled = true;
    button.classList.add('visible');
    secondClick = false;
    // if emojis are not the same, hide them
    if (firstCard.firstChild.innerText !== button.firstChild.innerText) {
      setTimeout(function () {
        firstCard.classList.remove('visible');
        button.classList.remove('visible');
        clickDisabled = false;
      }, 1000);
    } else {
      clickDisabled = false;
      button.classList.add('matched');
      firstCard.classList.add('matched');
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

function generateBoard(domContainer, cardSymbols, gridSize) {
  let shuffledSymbols, uniqueBoardSymbols, allBoardSymbols;
  // Shuffle the symbols
  setRootProperty('--grid-size', gridSize);
  shuffledSymbols = shuffleArray(cardSymbols);
  // Select the half of the gridsize emoji's
  uniqueBoardSymbols = shuffledSymbols.slice(0, gridSize ** 2 / 2);
  // Now duplicate them and shuffle again
  allBoardSymbols = shuffleArray(duplicateArrayElements(uniqueBoardSymbols));
  generateGridInDOM(domContainer, gridSize, allBoardSymbols);
}

// Main
matchedPairsTotalOutput.innerText = gridSize ** 2 / 2;
generateBoard(grid, emojis, gridSize);

// See if music/sound are enabled, and set matching icons in toggle

toggleAudioIcon(musicToggle, audioController.isMusicEnabled);
toggleAudioIcon(soundToggle, audioController.isSoundEnabled);

// @TODO If music is enabled, require interaction, as it won't play otherwise
if (audioController.isMusicEnabled) {
  audioController.startMusic();
}

toggleAudioListener('music', musicToggle);
toggleAudioListener('sound', soundToggle);

grid.addEventListener('click', handleClick);
