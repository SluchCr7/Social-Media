'use client';

import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector, useAppStore } from '../../hooks';
import { audioEngine } from '../../services/audioEngine';
import api from '@/app/utils/api';
import { updateMusicInState } from '../music/musicSlice';
import { selectCurrentUser } from '../auth/authSelectors';
import {
  selectCurrentTrack,
  selectIsPlaying,
  selectTrackVolume,
  selectIsMuted,
} from './musicPlayerSelectors';

export default function AudioBridge() {
  const dispatch = useAppDispatch();
  const store = useAppStore();
  const current = useAppSelector(selectCurrentTrack);
  const playing = useAppSelector(selectIsPlaying);
  const volume = useAppSelector(selectTrackVolume);
  const muted = useAppSelector(selectIsMuted);

  const prevTrackId = useRef(null);

  // Initialize audio engine singleton with store dispatch & getState
  useEffect(() => {
    audioEngine.init(dispatch, store.getState);
  }, [dispatch, store]);

  useEffect(() => {
    const audio = audioEngine.getAudioElement();
    if (!audio) return undefined;
    const handleTrackEnded = () => {
      const trackId = audioEngine.currentTrackId || selectCurrentTrack(store.getState())?._id;
      if (!trackId || !selectCurrentUser(store.getState())?._id) return;
      api.post(`/music/listen/${trackId}`)
        .then(({ data }) => dispatch(updateMusicInState(data)))
        .catch((error) => console.error('Could not record completed music playback:', error));
    };
    audio.addEventListener('ended', handleTrackEnded);
    return () => audio.removeEventListener('ended', handleTrackEnded);
  }, [dispatch, store]);

  // Sync track changes
  useEffect(() => {
    if (!current?.url) {
      if (prevTrackId.current) {
        audioEngine.pause();
        prevTrackId.current = null;
      }
      return;
    }

    if (prevTrackId.current !== current._id) {
      prevTrackId.current = current._id;
      audioEngine.load(current.url, playing, current._id);
    }
  }, [current, playing]);

  // Sync volume & muted
  useEffect(() => {
    audioEngine.setVolume(volume);
  }, [volume]);

  useEffect(() => {
    audioEngine.setMuted(muted);
  }, [muted]);

  return null;
}
