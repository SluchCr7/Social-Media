'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useReels } from '../../Context/ReelsContext';
import { useAlert } from '../../Context/AlertContext';
import { motion, AnimatePresence } from 'framer-motion';
import TextareaAutosize from 'react-textarea-autosize';
import { AiOutlineCloudUpload, AiOutlineClose, AiOutlineVideoCamera } from "react-icons/ai";
import { BiLoaderAlt } from "react-icons/bi";
import { FaCompactDisc } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { HiSparkles } from 'react-icons/hi';

const ReelUploadModal = () => {
  const { uploadReel, setShowModelAddReel, showModelAddReel } = useReels();
  const { showAlert } = useAlert();
  const { t } = useTranslation();
  const [videoFile, setVideoFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && setShowModelAddReel(false);
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [setShowModelAddReel]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("video")) return showAlert("⚠️ Please upload a valid video file.");
    setVideoFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (!file.type.startsWith("video")) return showAlert("⚠️ Please upload a valid video file.");
    setVideoFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile) return showAlert("⚠️ Please select a video first.");
    setIsUploading(true);
    try {
      await uploadReel(videoFile, caption);
      showAlert("✅ Signal broadcasted successfully!");
    } catch (error) {
      console.error(error);
      showAlert("❌ Broadcast failed.");
    } finally {
      setIsUploading(false);
      setVideoFile(null);
      setCaption("");
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setShowModelAddReel(false);
    }
  };

  return (
    <AnimatePresence>
      {showModelAddReel && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 md:p-8"
        >
          {/* Main Card */}
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Glows */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between px-8 py-6 border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <AiOutlineVideoCamera className="text-white text-2xl" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    {t("Broadcast Signal")}
                    <HiSparkles className="text-indigo-400" />
                  </h2>
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">New Reel</p>
                </div>
              </div>
              <button
                onClick={() => setShowModelAddReel(false)}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-all"
              >
                <AiOutlineClose />
              </button>
            </div>

            {/* Body */}
            <div className="relative z-10 p-8">
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                {/* Preview / Dropzone */}
                <div className="w-full aspect-video rounded-3xl overflow-hidden bg-black/40 border-2 border-dashed border-white/10 relative group hover:border-indigo-500/50 transition-colors">
                  {previewUrl ? (
                    <>
                      <video src={previewUrl} className="w-full h-full object-contain bg-black" controls />
                      <button
                        type="button"
                        onClick={() => { setVideoFile(null); setPreviewUrl(null); }}
                        className="absolute top-4 right-4 bg-black/60 text-white p-2 rounded-full hover:bg-red-500 transition-colors"
                      >
                        <AiOutlineClose />
                      </button>
                    </>
                  ) : (
                    <label
                      htmlFor="reel-upload"
                      className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer text-gray-500 hover:text-indigo-400 transition-colors"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                    >
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <AiOutlineCloudUpload className="text-3xl" />
                      </div>
                      <p className="font-bold text-sm uppercase tracking-wide">{t("Drag & Drop Video Source")}</p>
                      <p className="text-xs opacity-50 mt-2">MP4, MOV (Max 60s)</p>
                    </label>
                  )}
                  <input
                    id="reel-upload"
                    type="file"
                    accept="video/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    disabled={isUploading}
                    className="hidden"
                  />

                  {/* Loading Overlay */}
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                      <div className="relative">
                        <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-indigo-500">
                          %
                        </div>
                      </div>
                      <p className="mt-4 font-bold text-white uppercase tracking-widest text-xs animate-pulse">{t("Transmitting Data...")}</p>
                    </div>
                  )}
                </div>

                {/* Caption */}
                <div className="relative">
                  <div className="absolute top-4 left-4 text-gray-500">
                    <FaCompactDisc />
                  </div>
                  <TextareaAutosize
                    placeholder={t("Add a transmission log (Caption)...")}
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    minRows={2}
                    disabled={isUploading}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-gray-600 outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all resize-none text-sm font-medium"
                  />
                </div>

                {/* Action */}
                <button
                  type="submit"
                  disabled={isUploading || !videoFile}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold uppercase tracking-widest text-xs shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isUploading ? t("Broadcasting...") : t("Initiate Broadcast")}
                </button>

              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReelUploadModal;
