// @ts-check
import { MemoryGame } from './MemoryGame.js';

if (document.readyState == 'loading') {
  document.addEventListener('DOMContentLoaded', ready);
} else {
  ready();
}

function ready() {
  /** @type {HTMLButtonElement} */
  const board = document.querySelector('#board');
  /** @type {HTMLButtonElement} */
  const soundToggle = document.querySelector('#sound');
  /** @type {HTMLButtonElement} */
  const musicToggle = document.querySelector('#music');
  const game = new MemoryGame(60, board, 4, soundToggle, musicToggle);
  const overlays = Array.from(document.querySelectorAll('.overlay'));

  board.addEventListener('click', (e) => {
    game.flipCard(e);
  });

  overlays.forEach((overlay) => {
    overlay.addEventListener('click', () => {
      if (!game.busy) {
        overlay.classList.remove('visible');
        game.startGame();
      }
    });
  });
}
