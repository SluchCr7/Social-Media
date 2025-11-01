'use client';
import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose, IoImage, IoMusicalNotes } from "react-icons/io5";
import Image from "next/image";
import { useMusic } from "../../Context/MusicContext";
import { useTranslation } from "react-i18next";

const genres = ["Pop", "Rock", "HipHop", "Jazz", "Classical", "Other"];

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

  // ✅ تحسين الأداء: تثبيت دوال المعالجة
  const handleCoverChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }, []);

  const handleAudioChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) setAudioFile(file);
  }, []);

  const handleClearCover = useCallback(() => {
    setImageFile(null);
    setImagePreview(null);
  }, []);

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

    await uploadMusic(formData);
    setLoading(false);
    onClose();
  }, [title, artist, album, genre, audioFile, imageFile, language, tags, uploadMusic, onClose]);

  // ✅ useMemo لتثبيت بيانات الحقول لتقليل إعادة التصيير
  const formFields = useMemo(() => ([
    { label: "Title", value: title, set: setTitle, placeholder: "Enter song title" },
    { label: "Artist", value: artist, set: setArtist, placeholder: "Enter artist name" },
    { label: "Album (Optional)", value: album, set: setAlbum, placeholder: "Enter album name" },
  ]), [title, artist, album]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-gradient-to-br from-black/80 via-gray-900/70 to-black/80 backdrop-blur-xl z-[1000] flex justify-center items-center overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-2xl mx-4 my-10 rounded-3xl bg-gradient-to-br from-gray-900/60 to-black/80 border border-white/10 p-8 shadow-[0_0_40px_rgba(59,130,246,0.25)] 
                       max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/70 hover:text-red-400 transition"
            >
              <IoClose size={26} />
            </button>

            {/* Title */}
            <h2 className="text-center text-2xl sm:text-3xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              🎵 {t("Add New Music")}
            </h2>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Cover Upload */}
              <div className="flex flex-col items-center text-center">
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border border-gray-600/40 shadow-md group cursor-pointer hover:scale-[1.03] transition">
                  {imagePreview ? (
                    <>
                      <Image
                        src={imagePreview}
                        alt="cover preview"
                        width={160}
                        height={160}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition">
                        <label className="px-3 py-1.5 bg-white/90 dark:bg-gray-800 text-sm rounded-lg font-medium cursor-pointer hover:bg-white dark:hover:bg-gray-700 transition">
                          {t("Change")}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleCoverChange}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={handleClearCover}
                          className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg font-medium hover:bg-red-600 transition"
                        >
                          {t("Clear")}
                        </button>
                      </div>
                    </>
                  ) : (
                    <label className="flex flex-col items-center justify-center gap-2 text-gray-400 cursor-pointer h-full w-full">
                      <IoImage size={28} />
                      <span className="text-sm font-medium">Upload Cover</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Inputs */}
              {formFields.map((f, i) => (
                <div key={i}>
                  <label className="block text-sm font-medium text-gray-300 mb-1">{t(f.label)}</label>
                  <input
                    type="text"
                    value={f.value}
                    onChange={(e) => f.set(e.target.value)}
                    placeholder={f.placeholder}
                    className="w-full px-4 py-2 border border-gray-700 rounded-xl bg-gray-900/50 text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  />
                </div>
              ))}

              {/* Genre */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{t("Genre")}</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {genres.map((g) => (
                    <label
                      key={g}
                      className={`px-3 py-2 rounded-lg text-sm font-medium cursor-pointer border transition-all ${
                        genre === g
                          ? "border-blue-500 bg-blue-500 text-white"
                          : "border-gray-700 bg-transparent text-gray-300 hover:border-blue-400"
                      }`}
                    >
                      <input
                        type="radio"
                        value={g}
                        checked={genre === g}
                        onChange={() => setGenre(g)}
                        className="hidden"
                      />
                      {g}
                    </label>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">{t("Language")}</label>
                <input
                  type="text"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  placeholder="Enter language (default: Unknown)"
                  className="w-full px-4 py-2 border border-gray-700 rounded-xl bg-gray-900/50 text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">{t("Tags")} (comma separated)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g., summer, chill, 2025"
                  className="w-full px-4 py-2 border border-gray-700 rounded-xl bg-gray-900/50 text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>

              {/* Audio Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">{t("Upload Music File")}</label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioChange}
                  className="w-full px-4 py-2 border border-gray-700 rounded-xl cursor-pointer bg-gray-900/50 text-gray-100"
                />
                {audioFile && (
                  <audio controls src={URL.createObjectURL(audioFile)} className="w-full mt-2 rounded-lg" />
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={loading}
                className={`w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg transition-all ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-5 h-5 border-t-2 border-white rounded-full mx-auto"
                  />
                ) : (
                  <>
                    <IoMusicalNotes className="inline-block text-xl mr-2" />
                    {t("Save Music")}
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddMusicModal;
