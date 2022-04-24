// @ts-check

import { AudioController } from './AudioController.js';
import { emojis } from './emojis.js';
import * as _ from './utils.js';

class MemoryGame {
  
  /**
   * Instantiates a new Memory game.
   * @param  {number} gameDuration Maximum time to complete game in seconds.
   * @param  {number} gridSize Dimension size for the card grid.
   * @param  {object} soundToggle DOM element.
   * @param  {object} musicToggle DOM element.
   */

  constructor(gameDuration, gridSize, soundToggle, musicToggle) {
    this.audioController = new AudioController();
    this.grid = document.querySelector('#grid');
    this.cardTotal = gridSize ** 2;
    this.cardPairs =  this.cardTotal / 2;
    this.timeTotal = gameDuration;
    this.timeRemaining = gameDuration;
    this.triesOutput = document.querySelector('#tries');
    this.matchedPairsOutput = document.querySelector('#matched');
    this.matchedPairsTotalOutput = document.querySelector('#matchedTotal');
    this.busy = true;
    this.soundToggle = soundToggle;
    this.musicToggle = musicToggle;
  }
  /**
   * Generate DOM for the cards
   * @param  {object} domContainer
   * @param  {array} emojis
   * @param  {number} gridSize
   */
  
  generateBoard(domContainer, emojis, gridSize) {
    _.setRootProperty('--grid-size', this.gridSize);
    emojisShuffled = _.shuffleArray(emojis);
    emojisNeeded = emojisShuffled.slice(0, cardTotal / 2);
    emojisPaired = _.duplicateArrayElements(uniqueBoardSymbols);
    emojisPairedShuffled = _.shuffleArray(emojisPaired);
    generateGridInDOM(domContainer, gridSize, emojisPairedShuffled);
}

  startGame () {
    this.timeRemaining = this.timeTotal;
    this.audioController.audioListenerToggle('music', this.musicToggle);
    this.audioController.audioListenerToggle('sound', this.soundToggle);
  }

  canFlipCard (card) {
    return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
  }

  startCountdown() {
    return setInterval(() => {
        this.timeRemaining--;
        this.timer.innerText = this.timeRemaining;
        if(this.timeRemaining === 0)
            this.gameOver();
    }, 1000);
  }

let firstCard, clickDisabled, secondClick;
let tries = 0,
  matchedPairs = 0;


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
      audioController.playMatchSoundEffect();
    }
    if (matchedPairs === gridSize ** 2 / 2) {
      audioController.playCompleteSoundEffect();
      startConfetti();
      setTimeout(function () {
        stopConfetti();
      }, 3000);
    }
    matchedPairsOutput.innerText = matchedPairs;
    triesOutput.innerText = tries;
  }
}



// Main
matchedPairsTotalOutput.innerText = this.cardPairs;
generateBoard(grid, emojis, gridSize);


// @TODO If music is enabled, require interaction, as it won't play otherwise
if (audioController.isMusicEnabled) {
  audioController.startMusic();
}


grid.addEventListener('click', handleClick);



if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ready());
} else {
  ready();
};

function ready() {
  let audioEnabled, MusicEnabled;
  const soundToggle = document.querySelector('#sound');
  const musicToggle = document.querySelector('#music');
  const game = new MemoryGame(100, 4, soundToggle, musicToggle);

  // See if music/sound are enabled, and set matching icons in toggle
  
}