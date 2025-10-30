'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useReels } from '../../Context/ReelsContext';
import { useAlert } from '../../Context/AlertContext';
import { motion, AnimatePresence } from 'framer-motion';
import TextareaAutosize from 'react-textarea-autosize';
import { AiOutlineCloudUpload, AiOutlineClose } from "react-icons/ai";
import { BiLoaderAlt } from "react-icons/bi";
import { useTranslation } from 'react-i18next';

const ReelUploadModal = () => {
  const { uploadReel, setShowModelAddReel, showModelAddReel } = useReels();
  const { showAlert } = useAlert();
  const {t} = useTranslation()
  const [videoFile, setVideoFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // إغلاق بالـ ESC
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && setShowModelAddReel(false);
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("video")) return showAlert("Please upload a valid video file.");
    setVideoFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (!file.type.startsWith("video")) return showAlert("Please upload a valid video file.");
    setVideoFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile) return showAlert("Please select a video first.");
    setIsUploading(true);
    try {
      await uploadReel(videoFile, caption);
      showAlert("✅ Reel uploaded successfully!");
    } finally {
      setIsUploading(false);
      setVideoFile(null);
      setCaption("");
      setPreviewUrl(null);
      setShowModelAddReel(false);
    }
  };

  return (
    <AnimatePresence>
      {showModelAddReel && (
        <motion.div
          className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex justify-center items-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowModelAddReel(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative bg-lightMode-bg dark:bg-darkMode-bg border border-lightMode-menu dark:border-darkMode-menu
                       rounded-2xl shadow-2xl p-6 w-full max-w-xl transition-colors duration-300"
          >
            {/* زر الإغلاق */}
            <button
              aria-label="Close Modal"
              className="absolute top-4 right-4 text-lightMode-text2 dark:text-darkMode-text2 hover:text-red-500 transition"
              onClick={() => setShowModelAddReel(false)}
              disabled={isUploading}
            >
              <AiOutlineClose size={24} />
            </button>

            {/* العنوان */}
            <h2 className="text-2xl font-bold mb-5 text-lightMode-text dark:text-darkMode-text">
              {t("Upload Reel")}
            </h2>

            {/* المعاينة */}
            {previewUrl && (
              <div className="relative w-full aspect-video mb-5 rounded-xl overflow-hidden shadow-lg border border-lightMode-menu dark:border-darkMode-menu">
                <video src={previewUrl} controls className="w-full h-full object-cover" />
                {isUploading && (
                  <motion.div
                    className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center rounded-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <BiLoaderAlt className="animate-spin text-white text-5xl mb-3" />
                    <motion.p
                      className="text-white text-lg font-medium"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      {t("Uploading")}...
                    </motion.p>
                    <motion.div className="w-3/4 h-2 bg-gray-600 rounded-full mt-3 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: ["10%", "70%", "100%"] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      />
                    </motion.div>
                  </motion.div>
                )}
              </div>
            )}

            {/* النموذج */}
            <form
              onSubmit={handleSubmit}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="flex flex-col gap-4"
            >
              {/* منطقة السحب والإفلات */}
              <label
                htmlFor="video-upload"
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
                  ${
                    isUploading
                      ? "opacity-50 cursor-not-allowed border-gray-400"
                      : "hover:border-blue-500 border-lightMode-menu dark:border-darkMode-menu"
                  }
                  text-lightMode-text2 dark:text-darkMode-text2 bg-lightMode-menu/30 dark:bg-darkMode-menu/30`}
              >
                {videoFile ? (
                  <p className="font-medium text-base">
                    🎥 {videoFile.name}
                  </p>
                ) : (
                  <>
                    <AiOutlineCloudUpload className="mx-auto text-4xl mb-2 opacity-80" />
                    <p>{t("Drag & drop or click to select a video")}</p>
                    <span className="text-sm text-gray-400">MP4, MOV or AVI • Max 60s</span>
                  </>
                )}
                <input
                  id="video-upload"
                  type="file"
                  accept="video/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>

              {/* التسمية (Caption) */}
              <TextareaAutosize
                placeholder={t("Write a caption...")}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                minRows={3}
                disabled={isUploading}
                className="w-full p-4 rounded-xl border border-lightMode-menu dark:border-darkMode-menu
                           bg-lightMode-menu/40 dark:bg-darkMode-menu/40 text-lightMode-text dark:text-darkMode-text
                           focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition"
              />

              {/* الزر */}
              <button
                type="submit"
                disabled={isUploading}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700
                           text-white font-semibold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2
                           disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <>
                    <BiLoaderAlt className="animate-spin" size={22} />
                    {t("Uploading")}...
                  </>
                ) : (
                  <>
                    <AiOutlineCloudUpload size={22} />
                    {t("Upload Reel")}
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReelUploadModal;
