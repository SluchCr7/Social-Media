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
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4">
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            className="relative w-full max-w-lg bg-white dark:bg-[#0B0F1A] border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/80 dark:border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Video size={18} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    {t("Create Reel")}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t("Share short video content")}</p>
                </div>
              </div>
              <button
                onClick={() => setShowModelAddReel(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <div className="p-5 sm:p-6 space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Upload Canvas */}
                <div className="w-full aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-white/5 border border-dashed border-slate-300 dark:border-white/15 relative group hover:border-indigo-500/50 transition-all flex items-center justify-center">
                  {previewUrl ? (
                    <div className="relative w-full h-full">
                      <video src={previewUrl} className="w-full h-full object-contain" controls />
                      <button
                        type="button"
                        onClick={() => { setVideoFile(null); setPreviewUrl(null); }}
                        className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white p-1.5 rounded-lg hover:bg-rose-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor="reel-upload"
                      className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer text-slate-400 hover:text-indigo-600 transition-colors p-4"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                    >
                      <div className="w-12 h-12 rounded-xl bg-white dark:bg-white/5 flex items-center justify-center mb-2 shadow-sm border border-slate-200/60 dark:border-white/10">
                        <CloudUpload size={24} />
                      </div>
                      <p className="font-bold text-xs">{t("Drag & Drop Video")}</p>
                      <p className="text-[11px] text-slate-400 mt-1">{t("MP4 or MOV • MAX 60s")}</p>
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

                  {/* Uploading Overlay */}
                  <AnimatePresence>
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-20 text-white">
                        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                        <p className="mt-3 font-semibold text-xs animate-pulse">{t("Uploading Reel...")}</p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Caption Field */}
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">{t("Caption")}</label>
                  <TextareaAutosize
                    placeholder={t("Write a caption for your reel...")}
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    minRows={3}
                    disabled={isUploading}
                    className="w-full bg-slate-100 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 rounded-xl p-3 text-xs sm:text-sm font-medium placeholder:text-slate-400 outline-none transition-all resize-none"
                  />
                </div>

                {/* Submit */}
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModelAddReel(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 transition-colors"
                  >
                    {t("Cancel")}
                  </button>
                  <Button
                    type="submit"
                    isLoading={isUploading}
                    disabled={!videoFile}
                    className="rounded-xl px-5 py-2 text-xs font-bold"
                  >
                    <Play size={14} className="mr-1.5" />
                    {t("Share Reel")}
                  </Button>
                </div>

              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ReelUploadModal;
