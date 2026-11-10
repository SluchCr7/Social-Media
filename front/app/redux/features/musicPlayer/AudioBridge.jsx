'use client';

import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector, useAppStore } from '../../hooks';
import { audioEngine } from '../../services/audioEngine';
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

  // Sync track changes
  useEffect(() => {
    if (!current?.url) return;

    if (prevTrackId.current !== current._id) {
      prevTrackId.current = current._id;
      audioEngine.load(current.url, playing);
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
