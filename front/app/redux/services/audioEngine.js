/**
 * AudioEngine - Isolated runtime singleton for HTMLAudioElement
 * Keeps non-serializable browser Audio APIs completely out of Redux state.
 */

import {
  setPlaying,
  setReady,
  setProgress,
  setDuration,
  nextTrack,
} from '../features/musicPlayer/musicPlayerSlice';

class AudioEngine {
  constructor() {
    this.audio = null;
    this.dispatch = null;
    this.getState = null;
    this.isReady = false;
    this.currentTrackId = null;
  }

  init(dispatch, getState) {
    if (typeof window === 'undefined') return;

    this.dispatch = dispatch;
    this.getState = getState;

    if (!this.audio) {
      this.audio = new Audio();
      this.audio.preload = 'metadata';

      this.audio.addEventListener('loadedmetadata', () => {
        this.isReady = true;
        if (this.dispatch && this.audio) {
          this.dispatch(setDuration(this.audio.duration || 0));
          this.dispatch(setReady(true));
        }
      });

      this.audio.addEventListener('canplay', () => {
        this.isReady = true;
        if (this.dispatch) this.dispatch(setReady(true));
      });

      this.audio.addEventListener('waiting', () => {
        this.isReady = false;
        if (this.dispatch) this.dispatch(setReady(false));
      });

      this.audio.addEventListener('loadstart', () => {
        this.isReady = false;
        if (this.dispatch) this.dispatch(setReady(false));
      });

      this.audio.addEventListener('timeupdate', () => {
        if (this.dispatch && this.audio) {
          this.dispatch(setProgress(this.audio.currentTime || 0));
        }
      });

      this.audio.addEventListener('play', () => {
        if (this.dispatch) this.dispatch(setPlaying(true));
      });

      this.audio.addEventListener('pause', () => {
        if (this.dispatch) this.dispatch(setPlaying(false));
      });

      this.audio.addEventListener('ended', () => {
        const state = this.getState ? this.getState().musicPlayer : null;
        if (!state) return;

        if (state.repeatMode === 'one') {
          this.seek(0);
          this.play();
        } else if (state.repeatMode === 'all' || state.currentIndex < state.songs.length - 1) {
          if (this.dispatch) this.dispatch(nextTrack());
        } else {
          this.seek(0);
          if (this.dispatch) this.dispatch(setPlaying(false));
        }
      });

      this.audio.addEventListener('error', (e) => {
        console.error('Audio playback error:', e);
        if (this.dispatch) {
          this.dispatch(setPlaying(false));
          this.dispatch(setReady(false));
        }
      });
    }
  }

  load(url, autoPlay = false, trackId = null) {
    if (!this.audio || !url) return;
    this.currentTrackId = trackId;
    if (this.audio.src !== new URL(url, window.location.href).href) {
      this.isReady = false;
      if (this.dispatch) {
        this.dispatch(setReady(false));
        this.dispatch(setDuration(0));
        this.dispatch(setProgress(0));
      }
      this.audio.src = url;
      this.audio.load();
    }
    if (autoPlay) {
      this.play();
    }
  }

  async play() {
    if (!this.audio || !this.audio.src) return;
    try {
      await this.audio.play();
      if (this.dispatch) this.dispatch(setPlaying(true));
    } catch (err) {
      console.warn('Playback prevented or aborted:', err);
      if (this.dispatch) this.dispatch(setPlaying(false));
    }
  }

  pause() {
    if (!this.audio) return;
    this.audio.pause();
    if (this.dispatch) this.dispatch(setPlaying(false));
  }

  togglePlay() {
    if (!this.audio) return;
    if (this.audio.paused) {
      this.play();
    } else {
      this.pause();
    }
  }

  seek(seconds) {
    if (!this.audio) return;
    const clamped = Math.max(0, Math.min(seconds, this.audio.duration || 0));
    this.audio.currentTime = clamped;
    if (this.dispatch) this.dispatch(setProgress(clamped));
  }

  setVolume(volume) {
    if (!this.audio) return;
    const clamped = Math.max(0, Math.min(volume, 1));
    this.audio.volume = clamped;
  }

  setMuted(muted) {
    if (!this.audio) return;
    this.audio.muted = Boolean(muted);
  }

  getAudioElement() {
    return this.audio;
  }
}

export const audioEngine = new AudioEngine();
