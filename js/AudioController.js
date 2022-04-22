// @TODO move dealing with localStorage into single reponsability methods
/** @module  AudioController */
// What was I thinking?

export class AudioController {
  /**
   * @classdesc  Create an AudioController
   */

  constructor() {
    this.bgMusic = new Audio('./sounds/background-music.mp3');
    this.matchSound = new Audio('./sounds/match-sound.mp3');
    this.completeSound = new Audio('./sounds/complete-sound.wav');
    this.bgMusic.loop = true;
    this.bgMusic.volume = 0.5;
    this._isSoundEnabled = true;
    this._isMusicEnabled = false;
  }

  /**
   * Getter function checks if sound is enabled,
   * Checks localStorage, fallback to this_isSoundEnabled prop default
   * Updates localStorage as needed.
   * @returns {boolean} this._isSoundenabled – are sound effects audible?
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
   * Setter function to enable/disable soundeffects.
   * Updates corresponding property in localStorage
   * @param  {boolean} soundBool
   */

  set isSoundEnabled(soundBool) {
    this._isSoundEnabled = soundBool;
    localStorage.setItem('isSoundEnabled', soundBool.toString());
  }

  /**
   * Getter function checks if music playback is enabled,
   * Checks localStorage, fallback to this_isMusicEnabled prop default
   * Updates localStorage as needed.
   * @returns {boolean} is music playback enabled?
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
   * Setter function to enable/disable music.
   * Updates corresponding property in localStorage
   * @param  {boolean} musicBool
   */

  set isMusicEnabled(musicBool) {
    this._isMusicEnabled = musicBool;
    localStorage.setItem('isMusicEnabled', musicBool.toString());
  }

  /**
   * Function to invoke music playback
   */

  startMusic() {
    this.bgMusic.play();
  }

  /**
   * Function to stop music playback
   */

  stopMusic() {
    this.bgMusic.pause();
    this.bgMusic.currentTime = 0;
  }

  /**
   * Function to invoke match sound effect
   */

  playMatchSoundEffect() {
    // Won't play multiple times concurrently,
    // so stop in case still playing
    this.matchSound.pause();
    this.matchSound.currentTime = 0;
    this.isSoundEnabled && this.matchSound.play();
  }

  /**
   * Function to invoke completed game soundeffect
   */

  playCompleteSoundEffect() {
    this.isSoundEnabled && this.completeSound.play();
  }
}
