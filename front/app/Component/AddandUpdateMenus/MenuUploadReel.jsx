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
  Play,
  Sparkles,
  CheckCircle2
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
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/70 px-3 py-4 backdrop-blur-sm sm:px-4">
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 12 }}
            className="relative flex w-full max-w-2xl flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-zinc-950 shadow-[0_25px_80px_rgba(0,0,0,0.45)]"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-400">
                  <Video size={18} />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-white">{t('Create Reel')}</h2>
                  <p className="text-xs text-zinc-400">{t('Share a short video with a clean, professional look')}</p>
                </div>
              </div>
              <button
                onClick={() => setShowModelAddReel(false)}
                className="rounded-full border border-white/10 bg-white/5 p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="rounded-[1.5rem] border border-dashed border-zinc-700 bg-zinc-900/80 p-3 transition hover:border-indigo-500/50">
                  <div className="relative aspect-video overflow-hidden rounded-[1.25rem] bg-zinc-950">
                    {previewUrl ? (
                      <div className="relative h-full w-full">
                        <video src={previewUrl} className="h-full w-full object-contain" controls />
                        <button
                          type="button"
                          onClick={() => {
                            setVideoFile(null);
                            setPreviewUrl(null);
                          }}
                          className="absolute right-3 top-3 rounded-full bg-black/65 p-2 text-white transition hover:bg-rose-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ) : (
                      <label
                        htmlFor="reel-upload"
                        className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-3 p-4 text-center text-zinc-400 transition hover:text-indigo-400"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                      >
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 text-zinc-300">
                          <CloudUpload size={24} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{t('Upload your video')}</p>
                          <p className="mt-1 text-xs text-zinc-500">{t('MP4 or MOV • up to 60 seconds')}</p>
                        </div>
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

                    <AnimatePresence>
                      {isUploading && (
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm text-white">
                          <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
                          <p className="mt-3 text-sm font-medium">{t('Uploading reel...')}</p>
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="rounded-[1.25rem] border border-zinc-800 bg-zinc-900/70 p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
                    <Sparkles size={14} className="text-indigo-400" />
                    {t('Caption')}
                  </div>
                  <TextareaAutosize
                    placeholder={t('Write a short caption for your reel...')}
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    minRows={3}
                    disabled={isUploading}
                    className="w-full resize-none rounded-2xl border border-transparent bg-zinc-950 px-3 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-indigo-500/50"
                  />
                </div>

                <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setShowModelAddReel(false)}
                    className="rounded-full border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:border-zinc-500 hover:text-white"
                  >
                    {t('Cancel')}
                  </button>
                  <Button
                    type="submit"
                    isLoading={isUploading}
                    disabled={!videoFile}
                    className="rounded-full px-5 py-2 text-sm font-semibold"
                  >
                    {isUploading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {t('Sharing...')}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Play size={14} />
                        {t('Share Reel')}
                      </span>
                    )}
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
