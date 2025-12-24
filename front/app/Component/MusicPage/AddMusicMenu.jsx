'use client';

import { useState, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose, IoImage, IoMusicalNotes, IoCloudUploadOutline, IoInformationCircleOutline, IoRocketOutline } from "react-icons/io5";
import Image from "next/image";
import { useMusic } from "../../Context/MusicContext";
import { useTranslation } from "react-i18next";

const genres = ["Pop", "Rock", "HipHop", "Jazz", "Classical", "Lo-Fi", "Electronic", "Other"];

const AddMusicModal = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [genre, setGenre] = useState("Other");
  const [audioFile, setAudioFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [language, setLanguage] = useState("Unknown");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const { uploadMusic } = useMusic();
  const { t } = useTranslation();

  const handleCoverChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }, [imagePreview]);

  const handleAudioChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) setAudioFile(file);
  }, []);

  const handleClearCover = useCallback(() => {
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
  }, [imagePreview]);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!title || !artist || !audioFile) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("artist", artist);
    formData.append("album", album);
    formData.append("genre", genre);
    formData.append("audio", audioFile);
    if (imageFile) formData.append("image", imageFile);
    formData.append("language", language);

    if (tags.trim()) {
      const tagsArray = tags.split(",").map(t => t.trim()).filter(Boolean);
      tagsArray.forEach(tag => formData.append("tags[]", tag));
    }

    try {
      await uploadMusic(formData);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [title, artist, album, genre, audioFile, imageFile, language, tags, uploadMusic, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-[1000] flex justify-center items-center p-4"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 30 }}
            className="relative w-full max-w-5xl bg-[#0F0F0F] rounded-[3rem] border border-white/5 shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:flex-row h-full max-h-[850px]"
          >
            {/* Sidebar / Preview Section */}
            <div className="w-full md:w-80 bg-[#151515] p-8 border-r border-white/5 flex flex-col gap-8 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <IoMusicalNotes className="text-white" size={20} />
                </div>
                <h2 className="text-xl font-black text-white tracking-tight">Music Studio</h2>
              </div>

              {/* Cover Preview Card */}
              <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-black shadow-2xl border border-white/5 group border-dashed flex flex-col items-center justify-center text-center p-4">
                {imagePreview ? (
                  <>
                    <Image src={imagePreview} alt="preview" fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                      <button type="button" onClick={handleClearCover} className="p-3 bg-red-500 text-white rounded-full">
                        <IoClose size={20} />
                      </button>
                    </div>
                  </>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center gap-2">
                    <IoImage size={48} className="text-white/10 group-hover:text-indigo-500 transition-colors" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20 group-hover:text-white transition-colors">Select Artwork</p>
                    <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
                  </label>
                )}
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                    <IoInformationCircleOutline /> Track Info
                  </div>
                  <p className="text-sm font-bold text-white truncate">{title || "Untitled Rhythm"}</p>
                  <p className="text-xs text-indigo-400 font-bold truncate">{artist || "Unknown Visionary"}</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-2">Asset Type</div>
                  <div className="flex items-center gap-2 text-white/60">
                    <IoMusicalNotes />
                    <span className="text-xs font-bold">{audioFile ? audioFile.name : "None Selected"}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="mt-auto py-4 text-xs font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors"
              >
                Abort Upload
              </button>
            </div>

            {/* Main Content Form */}
            <div className="flex-1 flex flex-col h-full">
              <div className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-10">
                <section>
                  <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                    <span className="w-8 h-px bg-white/10" /> Primary Metadata
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/40 uppercase ml-2">Track Title *</label>
                      <input
                        value={title} onChange={e => setTitle(e.target.value)}
                        placeholder="e.g. Midnight Waves"
                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-white placeholder:text-white/10 focus:border-indigo-500/50 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/40 uppercase ml-2">Artist Identity *</label>
                      <input
                        value={artist} onChange={e => setArtist(e.target.value)}
                        placeholder="e.g. Studio X"
                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-white placeholder:text-white/10 focus:border-indigo-500/50 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/40 uppercase ml-2">Collection / Album</label>
                      <input
                        value={album} onChange={e => setAlbum(e.target.value)}
                        placeholder="e.g. Neon Horizon"
                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-white placeholder:text-white/10 focus:border-indigo-500/50 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/40 uppercase ml-2">Recording Language</label>
                      <input
                        value={language} onChange={e => setLanguage(e.target.value)}
                        placeholder="e.g. English"
                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-white placeholder:text-white/10 focus:border-indigo-500/50 outline-none transition-all"
                      />
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                    <span className="w-8 h-px bg-white/10" /> Genre Selection
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {genres.map(g => (
                      <button
                        key={g}
                        onClick={() => setGenre(g)}
                        className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${genre === g ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20' : 'bg-white/[0.02] border-white/5 text-white/40 hover:border-white/20'}`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                    <span className="w-8 h-px bg-white/10" /> Master Audio Asset
                  </h3>
                  <label className={`block group relative w-full h-32 border-2 border-dashed rounded-3xl cursor-pointer transition-all flex flex-col items-center justify-center bg-white/[0.01] ${audioFile ? 'border-green-500/30' : 'border-white/5 hover:border-indigo-500/50 group-hover:bg-white/[0.03]'}`}>
                    <IoCloudUploadOutline size={32} className={`mb-2 transition-colors ${audioFile ? 'text-green-500' : 'text-white/10 group-hover:text-indigo-500'}`} />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${audioFile ? 'text-green-500' : 'text-white/20'}`}>
                      {audioFile ? `Verified: ${audioFile.name}` : "Upload Master .wav / .mp3"}
                    </span>
                    <input type="file" accept="audio/*" onChange={handleAudioChange} className="hidden" />
                  </label>
                </section>
              </div>

              {/* Launch Footer */}
              <div className="p-8 bg-[#0D0D0D] border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span className="text-[10px] font-black text-white/20 uppercase tracking-widest underline decoration-indigo-500 decoration-2 underline-offset-4 cursor-help">Digital Rights Verified</span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={loading || !title || !artist || !audioFile}
                  className={`flex items-center gap-4 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-500 ${loading || !title || !artist || !audioFile ? 'bg-white/5 text-white/10' : 'bg-white text-black hover:bg-indigo-600 hover:text-white shadow-2xl shadow-indigo-600/20'}`}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      <IoRocketOutline size={20} />
                      Launch Distribution
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddMusicModal;
