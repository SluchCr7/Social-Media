'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useReels } from '../../Context/ReelsContext';
import { useAlert } from '../../Context/AlertContext';
import { motion, AnimatePresence } from 'framer-motion';
import TextareaAutosize from 'react-textarea-autosize';
import { 
  CloudUpload, 
  X, 
  Video, 
  Disc, 
  Sparkles,
  Loader2,
  Trash2,
  Play
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';

const ReelUploadModal = () => {
  const { uploadReel, setShowModelAddReel, showModelAddReel } = useReels();
  const { showAlert } = useAlert();
  const { t } = useTranslation();
  const [videoFile, setVideoFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && setShowModelAddReel(false);
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [setShowModelAddReel]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("video")) return showAlert(t("Please upload a valid video file."));
    setVideoFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (!file.type.startsWith("video")) return showAlert(t("Please upload a valid video file."));
    setVideoFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile) return showAlert(t("Please select a video first."));
    setIsUploading(true);
    try {
      await uploadReel(videoFile, caption);
      showAlert(t("Reel shared successfully!"));
    } catch (error) {
      console.error(error);
      showAlert(t("Failed to share reel."));
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
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
        >
          <motion.div
            initial={{ scale: 0.98, y: 10, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.98, y: 10, opacity: 0 }}
            className="relative w-full max-w-2xl bg-white dark:bg-black border border-gray-100 dark:border-threads-border rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 dark:border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-white/5 flex items-center justify-center text-indigo-500">
                  <Video size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                    {t("Create Reel")}
                    <Sparkles size={16} className="text-indigo-400" />
                  </h2>
                  <p className="text-xs text-gray-500 font-semibold">{t("Share a video with your followers")}</p>
                </div>
              </div>
              <button
                onClick={() => setShowModelAddReel(false)}
                className="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 hover:text-black dark:hover:text-white flex items-center justify-center transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-8 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Upload Area */}
                <div className="w-full aspect-video rounded-3xl overflow-hidden bg-gray-50 dark:bg-white/5 border-2 border-dashed border-gray-100 dark:border-threads-border relative group hover:border-indigo-500/30 transition-all">
                  {previewUrl ? (
                    <div className="relative w-full h-full">
                      <video src={previewUrl} className="w-full h-full object-contain" controls />
                      <button
                        type="button"
                        onClick={() => { setVideoFile(null); setPreviewUrl(null); }}
                        className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor="reel-upload"
                      className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer text-gray-400 hover:text-indigo-500 transition-colors"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                    >
                      <div className="w-16 h-16 rounded-3xl bg-white dark:bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                        <CloudUpload size={32} />
                      </div>
                      <p className="font-bold text-sm uppercase tracking-widest">{t("Drag & Drop Video")}</p>
                      <p className="text-[10px] opacity-60 mt-2 font-semibold">{t("MP4 or MOV • MAX 60s")}</p>
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

                  {/* Uploading State */}
                  <AnimatePresence>
                    {isUploading && (
                      <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-20"
                      >
                        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                        <p className="mt-4 font-bold text-[11px] uppercase tracking-[0.2em] animate-pulse">{t("Processing Video...")}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Caption Input */}
                <div className="space-y-2">
                   <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">{t("Caption")}</label>
                   <div className="relative">
                      <div className="absolute top-4 left-4 text-gray-400">
                        <Disc size={18} />
                      </div>
                      <TextareaAutosize
                        placeholder={t("Write a caption for your reel...")}
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        minRows={3}
                        disabled={isUploading}
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-threads-border rounded-2xl pl-12 pr-4 py-4 text-[15px] placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 transition-all resize-none"
                      />
                   </div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  isLoading={isUploading}
                  disabled={!videoFile}
                  className="w-full rounded-full py-4 text-sm font-bold tracking-tight"
                >
                  <Play size={18} className="mr-2" />
                  {t("Share Reel")}
                </Button>

              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReelUploadModal;
