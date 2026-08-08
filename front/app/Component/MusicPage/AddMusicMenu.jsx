'use client';

import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HiXMark, HiMusicalNote, HiPhoto, HiCloudArrowUp, HiSparkles, HiQueueList } from 'react-icons/hi2';
import Image from 'next/image';
import { useMusic } from '../../Context/MusicContext';

const genres = ['Pop', 'Rock', 'HipHop', 'Jazz', 'Classical', 'Lo-Fi', 'Electronic', 'Ambient', 'Trap', 'Other'];

const AddMusicModal = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('');
  const [genre, setGenre] = useState('Ambient');
  const [audioFile, setAudioFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [language, setLanguage] = useState('English');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { uploadMusic } = useMusic();

  const resetState = useCallback(() => {
    setTitle('');
    setArtist('');
    setAlbum('');
    setGenre('Ambient');
    setAudioFile(null);
    setImageFile(null);
    setLanguage('English');
    setTags('');
    setError('');
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
  }, [imagePreview]);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleCoverChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please choose a valid image file.');
      return;
    }

    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError('');
  }, [imagePreview]);

  const handleAudioChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      setError('Please choose a valid audio file.');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setError('Audio file should be smaller than 25MB.');
      return;
    }

    setAudioFile(file);
    setError('');
  }, []);

  const handleClearCover = useCallback(() => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
  }, [imagePreview]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!title.trim() || !artist.trim() || !audioFile) {
      setError('Title, artist, and a valid audio file are required.');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('artist', artist.trim());
    formData.append('album', album.trim());
    formData.append('genre', genre);
    formData.append('audio', audioFile);
    if (imageFile) formData.append('image', imageFile);
    formData.append('language', language.trim() || 'English');

    if (tags.trim()) {
      tags.split(',').map((item) => item.trim()).filter(Boolean).forEach((tag) => formData.append('tags[]', tag));
    }

    try {
      await uploadMusic(formData);
      resetState();
      onClose();
    } catch (err) {
      console.error(err);
      setError('Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [album, artist, audioFile, genre, imageFile, language, onClose, resetState, tags, title, uploadMusic]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/85 px-3 py-4 backdrop-blur-xl sm:px-4"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            className="relative flex w-full max-w-5xl flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950 shadow-[0_30px_80px_rgba(0,0,0,0.45)] md:flex-row"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/30 text-zinc-300 transition hover:bg-white/10 hover:text-white"
            >
              <HiXMark size={18} />
            </button>

            <div className="w-full bg-gradient-to-br from-indigo-600/20 via-zinc-900 to-zinc-950 p-6 sm:p-8 md:w-[38%] md:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-400">
                  <HiMusicalNote size={22} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Upload a new track</p>
                  <p className="text-xs text-zinc-400">Make it available across the whole experience.</p>
                </div>
              </div>

              <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                <div className="relative aspect-square overflow-hidden rounded-[1.25rem] border border-white/10 bg-zinc-900">
                  {imagePreview ? (
                    <>
                      <Image src={imagePreview} alt="Track cover preview" fill className="object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 transition hover:opacity-100">
                        <button type="button" onClick={handleClearCover} className="rounded-full bg-red-500 px-3 py-2 text-sm font-semibold text-white">
                          Remove
                        </button>
                      </div>
                    </>
                  ) : (
                    <label className="flex h-full cursor-pointer flex-col items-center justify-center gap-3 text-center text-zinc-400">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-zinc-300">
                        <HiPhoto size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-zinc-200">Add artwork</p>
                        <p className="text-xs text-zinc-500">PNG, JPG or WEBP</p>
                      </div>
                      <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              <div className="mt-6 space-y-3 rounded-[1.25rem] border border-white/10 bg-black/20 p-4 text-sm text-zinc-400">
                <div className="flex items-center justify-between">
                  <span>Title</span>
                  <span className="font-semibold text-zinc-200">{title.trim() || 'Untitled'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Artist</span>
                  <span className="font-semibold text-indigo-400">{artist.trim() || 'Unknown artist'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Genre</span>
                  <span className="font-semibold text-zinc-200">{genre}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-5 bg-zinc-950/90 p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-400">Professional upload</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">Share your next release</h3>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
                  <HiSparkles size={14} />
                  Fast and clean
                </div>
              </div>

              {error ? (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              ) : null}

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-zinc-400">
                  <span>Track title</span>
                  <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Aurora Nights" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none ring-0 transition focus:border-indigo-500" />
                </label>
                <label className="space-y-2 text-sm text-zinc-400">
                  <span>Artist / creator</span>
                  <input value={artist} onChange={(e) => setArtist(e.target.value)} placeholder="e.g. Lina Vale" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none ring-0 transition focus:border-indigo-500" />
                </label>
                <label className="space-y-2 text-sm text-zinc-400">
                  <span>Album / project</span>
                  <input value={album} onChange={(e) => setAlbum(e.target.value)} placeholder="Optional" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none ring-0 transition focus:border-indigo-500" />
                </label>
                <label className="space-y-2 text-sm text-zinc-400">
                  <span>Language</span>
                  <input value={language} onChange={(e) => setLanguage(e.target.value)} placeholder="English" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none ring-0 transition focus:border-indigo-500" />
                </label>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-zinc-300">Choose a genre</p>
                <div className="flex flex-wrap gap-2">
                  {genres.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setGenre(item)}
                      className={`rounded-full border px-3 py-2 text-sm transition ${genre === item ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-white/10 bg-white/5 text-zinc-400 hover:border-indigo-400 hover:text-white'}`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <label className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[1.5rem] border border-dashed px-4 py-8 text-center transition ${audioFile ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' : 'border-white/10 bg-white/5 text-zinc-400 hover:border-indigo-500/40 hover:text-white'}`}>
                <HiCloudArrowUp size={24} />
                <span className="text-sm font-semibold">
                  {audioFile ? `Selected: ${audioFile.name}` : 'Upload your audio file'}
                </span>
                <span className="text-xs text-zinc-500">MP3, WAV, M4A up to 25MB</span>
                <input type="file" accept="audio/*" onChange={handleAudioChange} className="hidden" />
              </label>

              <label className="space-y-2 text-sm text-zinc-400">
                <span>Tags</span>
                <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="chill, vocal, deep" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none ring-0 transition focus:border-indigo-500" />
              </label>

              <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-400">
                  <HiQueueList size={14} />
                  Ready for discovery
                </div>
                <button type="submit" disabled={loading || !title.trim() || !artist.trim() || !audioFile} className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition ${loading || !title.trim() || !artist.trim() || !audioFile ? 'cursor-not-allowed bg-white/10 text-zinc-500' : 'bg-indigo-500 text-white hover:bg-indigo-400'}`}>
                  {loading ? 'Uploading…' : 'Publish track'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddMusicModal;
