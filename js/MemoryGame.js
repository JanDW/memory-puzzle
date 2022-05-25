// @ts-check

import { AudioController } from './AudioController.js';
import { startConfetti, stopConfetti } from './confetti.js';
import { emojis } from './emojis.js';
import * as _ from './utils.js';

export class MemoryGame {
  /**
   * Instantiates a new Memory game.
   *
   * @param {number} gameDuration Maximum time to complete game in seconds.
   * @param {HTMLElement} board Game board container for the cards.
   * @param {number} boardSize Dimension size for the card board.
   * @param {HTMLButtonElement} soundToggle Button to toggle sound.
   * @param {HTMLButtonElement} musicToggle Button to toggle music.
   */

  constructor(gameDuration, board, boardSize, soundToggle, musicToggle) {
    this.audioController = new AudioController(soundToggle, musicToggle);

    // DOM elements
    /** @type {HTMLElement} */
    this.board = board;
    /** @type {HTMLElement} */
    this.clicksUI = document.querySelector('#clicks');
    /** @type {HTMLElement} */
    this.matchedUI = document.querySelector('#matched');
    /** @type {HTMLElement} */
    this.matchedTotalUI = document.querySelector('#matchedTotal');
    /** @type {HTMLElement} */
    this.timer = document.querySelector('#time-remaining');

    this.boardSize = boardSize;
    this.cardTotal = boardSize ** 2;
    this.cardPairs = this.cardTotal / 2;
    this.gameDuration = gameDuration;
  }

  /** Start here */

  startGame() {
    this.totalClicks = 0;
    this.timer.innerText = this.gameDuration.toString();
    this.timeRemaining = this.gameDuration;
    this.cardToCheck = null;
    this.matchedCards = 0;
    this.busy = true;
    this.#emptyBoardInDom();
    this.audioController.init();
    this.#generateBoard(this.board, emojis, this.boardSize);
    this.cards = Array.from(document.querySelectorAll('.card'));
    this.matchedTotalUI.innerText = this.cardPairs.toString();
    setTimeout(() => {
      this.audioController.startMusic();
      this.countdown = this.#startCountdown();
      this.busy = false;
    }, 500);
  }

  /**
   * Generate DOM for the cards
   *
   * @param {HTMLElement} domContainer
   * @param {array} emojis
   * @param {number} boardSize
   */

  #generateBoard(domContainer, emojis, boardSize) {
    _.setRootProperty('--board-size', boardSize.toString());
    const emojisAllShuffled = _.shuffleArray(emojis);
    const emojisUnique = emojisAllShuffled.slice(0, this.cardTotal / 2);
    const emojisPaired = _.duplicateArrayElements(emojisUnique);
    const emojisPairedShuffled = _.shuffleArray(emojisPaired);
    this.#generateBoardInDOM(domContainer, boardSize ** 2, emojisPairedShuffled);
  }

  /** Remove any cards from the board */

  #emptyBoardInDom() {
    while (this.board.firstChild) {
      this.board.removeChild(this.board.firstChild);
    }
  }

  /**
   * Get the symbol contained in the card
   *
   * @param {HTMLElement} card
   */

  #getCardType(card) {
    return card.firstChild.innerText;
  }

  /**
   * Can this card be flipped?
   *
   * @param {HTMLElement} card
   */

  #canFlipCard(card) {
    return (
      !this.busy &&
      !card.classList.contains('visible') &&
      card !== this.cardToCheck
    );
  }

  /** Start countdown */

  #startCountdown() {
    return setInterval(() => {
      this.timeRemaining--;
      this.timer.innerText = this.timeRemaining.toString();
      if (this.timeRemaining === 0) this.#gameOver();
    }, 1000);
  }

  /** Unable to complete game before countdown timer ran out */

  #gameOver() {
    this.busy = true;
    this.audioController.gameOver();
    clearInterval(this.countdown);
    document.querySelector('#game-over').classList.add('visible');
    setTimeout(() => {
      this.busy = false;
    }, 3000);
  }

  /** Completed game within countdown timer. Congratulations. */

  #success() {
    clearInterval(this.countdown);
    this.audioController.complete();
    startConfetti();
    setTimeout(function () {
      stopConfetti();
    }, 4000);
    setTimeout(function () {
      document.querySelector('#success').classList.add('visible');
    }, 8000);
  }

  /**
   * @param {HTMLElement} board
   * @param {number} cardTotal
   * @param {Array} emojis
   */

  #generateBoardInDOM(board, cardTotal, emojis) {
    let boardHTML = '';
    for (let i = 0; i < cardTotal; i++) {
      boardHTML += `<button type="button" class="card"><div class="card__front"><span>${emojis[i]}</span></div><div class="card__back"></div></button>`;
    }
    board.insertAdjacentHTML('beforeend', boardHTML);
  }

  /**
   * Retrieve the button from the event bubbling up
   *
   * @param {Event} event
   */

  #getClickedCardButton(event) {
    let eventBubblePath = event.composedPath();
    let button = eventBubblePath.find((el) => el.tagName === 'BUTTON');
    return button;
  }

  /**
   * Flip card and see if another card can be matched.
   *
   * @param {MouseEvent} e
   */

  flipCard(e) {
    const card = this.#getClickedCardButton(e);
    if (this.#canFlipCard(card)) {
      this.audioController.flip();
      this.totalClicks++;
      this.clicksUI.innerText = Math.floor(this.totalClicks / 2).toString();
      card.classList.add('visible');

      if (this.cardToCheck) {
        this.#checkForCardMatch(card);
      } else {
        this.cardToCheck = card;
      }
    }
  }

  /**
   * Do we have a match between the visible cards?
   *
   * @param {HTMLElement} card
   */

  #checkForCardMatch(card) {
    if (this.#getCardType(card) === this.#getCardType(this.cardToCheck))
      this.#cardMatch(card, this.cardToCheck);
    else this.#cardMismatch(card, this.cardToCheck);

    this.cardToCheck = null;
  }

  /**
   * We have a match, is the game completed?
   *
   * @param {HTMLElement} card1
   * @param {HTMLElement} card2
   */

  #cardMatch(card1, card2) {
    this.matchedCards++;
    card1.classList.add('matched');
    card2.classList.add('matched');
    this.matchedUI.innerText = this.matchedCards.toString();
    this.audioController.match();
    if (this.matchedCards === this.cardPairs) this.#success();
  }

  /**
   * Cards do not match, hide again.
   *
   * @param {HTMLElement} card1
   * @param {HTMLElement} card2
   */

  #cardMismatch(card1, card2) {
    this.busy = true;
    setTimeout(() => {
      card1.classList.remove('visible');
      card2.classList.remove('visible');
      this.busy = false;
    }, 1000);
  }
}
