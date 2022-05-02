/** @module AudioController */
export class AudioController {
  /** @classdesc Create an AudioController */

  constructor(soundToggle, musicToggle) {
    this.soundToggle = soundToggle;
    this.musicToggle = musicToggle;
    this.music = new Audio('sounds/background-music.mp3');
    this.soundMatch = new Audio('sounds/match-sound.mp3');
    this.soundComplete = new Audio('sounds/complete-sound.wav');
    this.soundGameOver = new Audio('sounds/game-over.wav');
    this.soundFlip = new Audio('sounds/flip.wav');
    this.music.loop = true;
    this.music.volume = 0.5;
    this._isSoundEnabled = true;
    this._isMusicEnabled = false;
  }

  /**
   * Getter function checks if sound is enabled, Checks localStorage, fallback
   * to this_isSoundEnabled prop default If fallback, set localStorage to default
   *
   * @returns {boolean} This._isSoundEnabled play sound effects?
   */

  get isSoundEnabled() {
    let localStorageVal = localStorage.isSoundEnabled;
    let castedBool;

    if (localStorageVal) {
      castedBool = localStorageVal === 'true';
    }

    typeof castedBool === 'undefined'
      ? // Calling the setter to update localStorage
        (this.isSoundEnabled = this._isSoundEnabled)
      : (this.isSoundEnabled = castedBool);

    return this._isSoundEnabled;
  }

  /**
   * Setter function to enable/disable sound effects. Updates corresponding
   * property in localStorage
   *
   * @param {boolean} soundBool
   */

  set isSoundEnabled(soundBool) {
    this._isSoundEnabled = soundBool;
    localStorage.setItem('isSoundEnabled', soundBool.toString());
  }

  /**
   * Getter function checks if music playback is enabled, Checks localStorage,
   * fallback to this_isMusicEnabled prop default Updates localStorage as needed.
   *
   * @returns {boolean} Is music playback enabled?
   */

  get isMusicEnabled() {
    let localStorageVal = localStorage.isMusicEnabled;
    let castedBool;
    if (localStorageVal) {
      castedBool = localStorageVal === 'true';
    }

    typeof castedBool === 'undefined'
      ? // Calling the setter to update localStorage
        (this.isMusicEnabled = this._isMusicEnabled)
      : (this.isMusicEnabled = castedBool);

    return this._isMusicEnabled;
  }

  /**
   * Setter function to enable/disable music. Updates corresponding property in
   * localStorage
   *
   * @param {boolean} musicBool
   */

  set isMusicEnabled(musicBool) {
    this._isMusicEnabled = musicBool;
    localStorage.setItem('isMusicEnabled', musicBool.toString());
  }

  /**
   * Initializes Audio. Retrieves toggle status, sets UI icons accordingly,
   * attaches click handlers
   */

  initAudio() {
    this.toggleAudioIcon(this.soundToggle, this.isSoundEnabled);
    this.toggleAudioIcon(this.musicToggle, this.isMusicEnabled);
    this.audioListenerToggle('sound', this.soundToggle);
    this.audioListenerToggle('music', this.musicToggle);
  }

  /** Start music playback */

  startMusic() {
    this.isMusicEnabled && this.music.play();
  }

  /** Stop music playback */

  stopMusic() {
    this.music.pause();
    this.music.currentTime = 0;
  }

  /** Play flip sound effect */

  flip() {
    // Won't play multiple times concurrently,
    // so stop in case still playing
    this.soundFlip.pause();
    this.soundFlip.currentTime = 0;
    this.isSoundEnabled && this.soundFlip.play();
  }

  match() {
    // Won't play multiple times concurrently,
    // so stop in case still playing
    this.soundMatch.pause();
    this.soundMatch.currentTime = 0;
    this.isSoundEnabled && this.soundMatch.play();
  }

  /** Play winner, winner, chicken dinner game sound effect */

  complete() {
    this.stopMusic();
    this.isSoundEnabled && this.soundComplete.play();
  }

  /** Play "game over" sound effect */

  gameOver() {
    this.stopMusic();
    this.isSoundEnabled && this.soundGameOver.play();
  }

  /**
   * Event listener handling for audio controls: music and sound
   *
   * @param {string} audioType 'music' or 'sound'
   * @param {object} toggleControl HTMLButtonElement as UI toggle
   */

  audioListenerToggle(audioType, toggleControl) {
    toggleControl.addEventListener('click', (e) => {
      let isEnabled;

      if (audioType === 'music') {
        isEnabled = this.isMusicEnabled;
        isEnabled === false ? this.startMusic() : this.stopMusic();
        this.isMusicEnabled = !isEnabled;
      }

      if (audioType === 'sound') {
        isEnabled = this.isSoundEnabled;
        this.isSoundEnabled = !isEnabled;
      }

      isEnabled = !isEnabled;

      this.toggleAudioIcon(e.currentTarget, isEnabled);
    });
  }

  /**
   * Toggles on/off icons for audio buttons
   *
   * @param {HTMLButtonElement} currentTarget The e.currentTarget value
   * @param {boolean} isEnabled To switch on / off
   */

  toggleAudioIcon(currentTarget, isEnabled) {
    if (isEnabled) {
      currentTarget.children[0].removeAttribute('class');
      currentTarget.children[1].setAttribute('class', 'display-none');
    }
    if (!isEnabled) {
      currentTarget.children[0].setAttribute('class', 'display-none');
      currentTarget.children[1].removeAttribute('class');
    }
  }
}
