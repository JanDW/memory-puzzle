// @ts-check

import { AudioController } from './AudioController.js';

const audioController = new AudioController();

test('should initialize audio ', () => {
  let body = document.body;
  body.innerText = `
    <button type="button" id="sound">
      <span id="sound__on" class=""></span>
      <span id="sound__off" class="display-none"></span>
    </button>
    <button type="button" id="music">
      <span id="music__on" class="display-none"></span>
    </button>
  `;
  
});
