'use client';

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiXMark,
  HiPhoto,
  HiMusicalNote,
  HiCloudArrowUp,
  HiInformationCircle,
  HiRocketLaunch,
  HiLanguage,
  HiQueueList
} from "react-icons/hi2";
import Image from "next/image";
import { useMusic } from "../../Context/MusicContext";
import { useTranslation } from "react-i18next";

const genres = ["Pop", "Rock", "HipHop", "Jazz", "Classical", "Lo-Fi", "Electronic", "Ambient", "Trap"];

const AddMusicModal = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [genre, setGenre] = useState("Ambient");
  const [audioFile, setAudioFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [language, setLanguage] = useState("English");
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
          className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-[1000] flex justify-center items-center p-4"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 50, rotateX: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            className="relative w-full max-w-6xl bg-[#080808] rounded-[3.5rem] border border-white/5 shadow-[0_0_120px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col md:flex-row h-full max-h-[900px] perspective-1000"
          >
            {/* 🛠️ Studio Sidebar */}
            <div className="w-full md:w-96 bg-[#0B0B0B] p-10 border-r border-white/5 flex flex-col gap-10 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/20">
                  <HiMusicalNote className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white tracking-tighter uppercase leading-none">Studio <span className="text-indigo-500">Node</span></h2>
                  <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mt-1">Asset Distribution v2.0</p>
                </div>
              </div>

              {/* Cover Art Dropzone */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-2">Release Visuals</label>
                <div className="relative aspect-square w-full rounded-[2.5rem] overflow-hidden bg-black shadow-2xl border border-white/5 group border-dashed flex flex-col items-center justify-center text-center p-4 cursor-pointer hover:border-indigo-500/50 transition-all">
                  {imagePreview ? (
                    <>
                      <Image src={imagePreview} alt="preview" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                        <button type="button" onClick={handleClearCover} className="p-4 bg-red-500 text-white rounded-2xl shadow-xl">
                          <HiXMark size={24} />
                        </button>
                      </div>
                    </>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center gap-4">
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="w-20 h-20 rounded-3xl bg-white/[0.03] flex items-center justify-center text-white/10 group-hover:text-indigo-500 group-hover:bg-indigo-500/10 transition-all"
                      >
                        <HiPhoto size={40} />
                      </motion.div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Inject Artwork</p>
                        <p className="text-[8px] font-bold text-white/10 group-hover:text-white/20">SVG, PNG, JPG (800x800+)</p>
                      </div>
                      <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              {/* Status Modules */}
              <div className="mt-auto space-y-3">
                <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-[9px] font-black text-white/20 uppercase tracking-widest">
                    <span>Signal Title</span>
                    <HiInformationCircle />
                  </div>
                  <p className="text-xs font-black text-white truncate uppercase tracking-tight">{title || "Waiting for signal..."}</p>
                </div>

                <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-[9px] font-black text-white/20 uppercase tracking-widest">
                    <span>Identity</span>
                    <HiLanguage />
                  </div>
                  <p className="text-xs font-black text-indigo-400 truncate uppercase tracking-tight">{artist || "Unknown Entity"}</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="py-4 text-[9px] font-black uppercase tracking-[0.4em] text-white/10 hover:text-red-500 transition-colors"
              >
                Terminate Process
              </button>
            </div>

            {/* 📝 Configuration Core */}
            <div className="flex-1 flex flex-col h-full bg-[#050505]">
              <div className="flex-1 overflow-y-auto no-scrollbar p-12 space-y-12">

                {/* Section 1: Metadata */}
                <section className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-px bg-white/10" />
                    <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Core Parameters</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-3 px-2">
                      <label className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">Composition Title</label>
                      <input
                        value={title} onChange={e => setTitle(e.target.value)}
                        placeholder="e.g. DARK MATTER"
                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-white placeholder:text-white/10 focus:border-indigo-500/50 outline-none transition-all font-bold uppercase tracking-tighter"
                      />
                    </div>
                    <div className="space-y-3 px-2">
                      <label className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">Creator / Artist</label>
                      <input
                        value={artist} onChange={e => setArtist(e.target.value)}
                        placeholder="e.g. SECTOR-7"
                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-white placeholder:text-white/10 focus:border-indigo-500/50 outline-none transition-all font-bold uppercase tracking-tighter"
                      />
                    </div>
                    <div className="space-y-3 px-2">
                      <label className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">Collection / Tape</label>
                      <input
                        value={album} onChange={e => setAlbum(e.target.value)}
                        placeholder="e.g. CHROME HORIZON"
                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-white placeholder:text-white/10 focus:border-indigo-500/50 outline-none transition-all font-bold uppercase tracking-tighter"
                      />
                    </div>
                    <div className="space-y-3 px-2">
                      <label className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">Audio Language</label>
                      <input
                        value={language} onChange={e => setLanguage(e.target.value)}
                        placeholder="e.g. English"
                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-white placeholder:text-white/10 focus:border-indigo-500/50 outline-none transition-all font-bold uppercase tracking-tighter"
                      />
                    </div>
                  </div>
                </section>

                {/* Section 2: Frequency Categorization */}
                <section className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-px bg-white/10" />
                    <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Signal Sector</h3>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {genres.map(g => (
                      <button
                        key={g}
                        onClick={() => setGenre(g)}
                        className={`px-8 py-3 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] border transition-all duration-500 ${genre === g ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_10px_20px_rgba(79,70,229,0.3)]' : 'bg-white/[0.02] border-white/5 text-white/30 hover:border-white/20'}`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </section>

                {/* Section 3: The Master File */}
                <section className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-px bg-white/10" />
                    <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Audio Core</h3>
                  </div>
                  <label className={`block group relative w-full h-40 border-2 border-dashed rounded-[3rem] cursor-pointer transition-all flex flex-col items-center justify-center overflow-hidden ${audioFile ? 'border-green-500/40 bg-green-500/5' : 'border-white/5 hover:border-indigo-500/50'}`}>
                    <div className={`transition-all duration-700 ${audioFile ? 'scale-75 opacity-50' : 'group-hover:scale-110'}`}>
                      <HiCloudArrowUp size={48} className={`mb-3 ${audioFile ? 'text-green-500' : 'text-white/10 group-hover:text-indigo-500'}`} />
                    </div>
                    <div className="relative z-10 text-center space-y-1">
                      <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${audioFile ? 'text-green-500' : 'text-white/20'}`}>
                        {audioFile ? `Signal Captured: ${audioFile.name}` : "Upload Uncompressed Master"}
                      </span>
                      {!audioFile && <p className="text-[8px] font-bold text-white/5 group-hover:text-white/10 tracking-widest uppercase">Lossless .WAV / .MP3 Allowed</p>}
                    </div>
                    {audioFile && (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        className="absolute bottom-0 left-0 h-1 bg-green-500"
                      />
                    )}
                    <input type="file" accept="audio/*" onChange={handleAudioChange} className="hidden" />
                  </label>
                </section>
              </div>

              {/* 🚀 Launch Protocol Footer */}
              <div className="p-10 bg-[#080808] border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-white/[0.03] flex items-center justify-center">
                    <HiQueueList className="text-white/20" size={20} />
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-[10px] font-black text-white uppercase tracking-widest">Global Sync</p>
                    <p className="text-[8px] font-bold text-indigo-500 uppercase tracking-widest">Available across all nodes</p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={loading || !title || !artist || !audioFile}
                  className={`flex items-center gap-6 px-12 py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.3em] transition-all duration-500 ${loading || !title || !artist || !audioFile ? 'bg-white/5 text-white/10 cursor-not-allowed' : 'bg-white text-black hover:bg-indigo-600 hover:text-white shadow-[0_20px_40px_rgba(0,0,0,0.5)]'}`}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      <HiRocketLaunch size={20} />
                      Transmit Frequency
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
