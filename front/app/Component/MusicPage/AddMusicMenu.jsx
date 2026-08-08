'use client';

import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HiXMark, HiMusicalNote, HiPhoto, HiCloudArrowUp, HiSparkles, HiQueueList, HiCheckCircle } from 'react-icons/hi2';
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
      setError('Please choose a valid image file (PNG, JPG, WEBP).');
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
      setError('Please choose a valid audio format (MP3, WAV, M4A).');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setError('Audio file size must be less than 25MB.');
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
      setError('Upload failed. Please check your connection and try again.');
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
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 p-3 backdrop-blur-md sm:p-6 md:p-8"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0.05 }}
            className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950 shadow-[0_25px_70px_rgba(0,0,0,0.6)] md:flex-row"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/50 text-zinc-300 backdrop-blur-md transition hover:bg-white/20 hover:text-white"
            >
              <HiXMark size={18} />
            </button>

            {/* Left Sidebar Info Card */}
            <div className="flex w-full flex-col justify-between border-b border-white/10 bg-gradient-to-br from-indigo-950/40 via-zinc-900 to-zinc-950 p-6 md:w-[36%] md:border-b-0 md:border-r md:p-8">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-400">
                    <HiMusicalNote size={22} />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-white">Upload New Track</h2>
                    <p className="text-xs text-zinc-400">Publish your sound to the workspace.</p>
                  </div>
                </div>

                {/* Artwork Upload Widget */}
                <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-3.5 backdrop-blur-sm">
                  <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-inner">
                    {imagePreview ? (
                      <>
                        <Image src={imagePreview} alt="Track cover preview" fill className="object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 backdrop-blur-xs transition-opacity hover:opacity-100">
                          <button 
                            type="button" 
                            onClick={handleClearCover} 
                            className="rounded-full bg-red-500/80 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md transition hover:bg-red-500"
                          >
                            Remove Artwork
                          </button>
                        </div>
                      </>
                    ) : (
                      <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2.5 p-4 text-center transition hover:bg-white/[0.02]">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-zinc-300">
                          <HiPhoto size={22} />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-zinc-200">Upload Artwork</p>
                          <p className="text-[10px] text-zinc-500">PNG, JPG, WEBP</p>
                        </div>
                        <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Dynamic Summary Metadata Card */}
              <div className="mt-6 hidden space-y-2.5 rounded-2xl border border-white/10 bg-black/30 p-4 text-xs text-zinc-400 md:block">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Title</span>
                  <span className="max-w-[160px] truncate font-medium text-zinc-200">{title.trim() || 'Untitled'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Artist</span>
                  <span className="max-w-[160px] truncate font-medium text-indigo-400">{artist.trim() || 'Unknown artist'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Genre</span>
                  <span className="font-medium text-zinc-200">{genre}</span>
                </div>
              </div>
            </div>

            {/* Right Main Form Container */}
            <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-y-auto bg-zinc-950 p-6 sm:p-8">
              <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-indigo-400">Audio Distribution</span>
                  <h3 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">Track Specifications</h3>
                </div>
                <div className="flex items-center gap-1.5 self-start rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
                  <HiSparkles size={13} />
                  Lossless Ready
                </div>
              </div>

              {error && (
                <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              {/* Input Fields Grid */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5 text-xs text-zinc-400">
                  <label className="font-medium text-zinc-300">Track title *</label>
                  <input 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="e.g. Aurora Nights" 
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500 focus:bg-white/[0.06] focus:ring-2 focus:ring-indigo-500/20" 
                  />
                </div>
                <div className="space-y-1.5 text-xs text-zinc-400">
                  <label className="font-medium text-zinc-300">Artist / creator *</label>
                  <input 
                    value={artist} 
                    onChange={(e) => setArtist(e.target.value)} 
                    placeholder="e.g. Lina Vale" 
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500 focus:bg-white/[0.06] focus:ring-2 focus:ring-indigo-500/20" 
                  />
                </div>
                <div className="space-y-1.5 text-xs text-zinc-400">
                  <label className="font-medium text-zinc-300">Album / project</label>
                  <input 
                    value={album} 
                    onChange={(e) => setAlbum(e.target.value)} 
                    placeholder="Optional album name" 
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500 focus:bg-white/[0.06] focus:ring-2 focus:ring-indigo-500/20" 
                  />
                </div>
                <div className="space-y-1.5 text-xs text-zinc-400">
                  <label className="font-medium text-zinc-300">Language</label>
                  <input 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value)} 
                    placeholder="English" 
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500 focus:bg-white/[0.06] focus:ring-2 focus:ring-indigo-500/20" 
                  />
                </div>
              </div>

              {/* Genre Selector */}
              <div className="mt-5 space-y-2">
                <label className="text-xs font-medium text-zinc-300">Genre category</label>
                <div className="flex flex-wrap gap-1.5">
                  {genres.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setGenre(item)}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                        genre === item 
                          ? 'border-indigo-500 bg-indigo-500 text-white shadow-lg shadow-indigo-500/25' 
                          : 'border-white/10 bg-white/[0.03] text-zinc-400 hover:border-indigo-400/50 hover:text-white'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Audio Upload Dropzone */}
              <div className="mt-5">
                <label className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed p-6 text-center transition ${
                  audioFile 
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' 
                    : 'border-white/15 bg-white/[0.02] text-zinc-400 hover:border-indigo-500/40 hover:bg-white/[0.04] hover:text-white'
                }`}>
                  {audioFile ? <HiCheckCircle size={22} className="text-emerald-400" /> : <HiCloudArrowUp size={22} />}
                  <div>
                    <p className="text-xs font-semibold text-zinc-200">
                      {audioFile ? audioFile.name : 'Upload primary audio file *'}
                    </p>
                    <p className="mt-0.5 text-[10px] text-zinc-500">MP3, WAV, or M4A (Max size: 25MB)</p>
                  </div>
                  <input type="file" accept="audio/*" onChange={handleAudioChange} className="hidden" />
                </label>
              </div>

              {/* Tags Field */}
              <div className="mt-5 space-y-1.5 text-xs text-zinc-400">
                <label className="font-medium text-zinc-300">Tags (comma-separated)</label>
                <input 
                  value={tags} 
                  onChange={(e) => setTags(e.target.value)} 
                  placeholder="chill, electronic, vocal, acoustic" 
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500 focus:bg-white/[0.06] focus:ring-2 focus:ring-indigo-500/20" 
                />
              </div>

              {/* Footer Actions */}
              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="hidden items-center gap-2 text-xs text-zinc-500 sm:flex">
                  <HiQueueList size={14} />
                  <span>Ready for cloud synchronization</span>
                </div>
                <div className="flex w-full items-center justify-end gap-2.5 sm:w-auto">
                  <button 
                    type="button" 
                    onClick={onClose} 
                    className="flex-1 rounded-xl border border-white/10 bg-transparent px-4 py-2.5 text-xs font-semibold text-zinc-300 transition hover:bg-white/5 sm:flex-initial"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading || !title.trim() || !artist.trim() || !audioFile} 
                    className={`flex-1 rounded-xl px-5 py-2.5 text-xs font-semibold shadow-md transition sm:flex-initial ${
                      loading || !title.trim() || !artist.trim() || !audioFile 
                        ? 'cursor-not-allowed bg-white/10 text-zinc-500' 
                        : 'bg-indigo-600 text-white shadow-indigo-600/30 hover:bg-indigo-500'
                    }`}
                  >
                    {loading ? 'Publishing track...' : 'Publish Track'}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddMusicModal;