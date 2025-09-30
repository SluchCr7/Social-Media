'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useReels } from '../Context/ReelsContext';
import { useAlert } from '../Context/AlertContext';
import { motion, AnimatePresence } from 'framer-motion';
import TextareaAutosize from 'react-textarea-autosize';
import { AiOutlineCloudUpload, AiOutlineClose } from "react-icons/ai";
import { BiLoaderAlt } from "react-icons/bi";

const ReelUploadModal = () => {
  const { uploadReel ,setShowModelAddReel , showModelAddReel} = useReels();
  const { showAlert } = useAlert();

  const [videoFile, setVideoFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Close on Esc key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("video")) {
      showAlert("Please upload a valid video file.");
      return;
    }
    setVideoFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (!file.type.startsWith("video")) {
      showAlert("Please upload a valid video file.");
      return;
    }
    setVideoFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile) return showAlert("Please select a video first.");

    setIsUploading(true);
    await uploadReel(videoFile, caption);
    setIsUploading(false);
    setVideoFile(null);
    setCaption("");
    setPreviewUrl(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {showModelAddReel && (
        <motion.div
          className="fixed inset-0 z-[1000] bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-xl p-6 relative shadow-2xl flex flex-col"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Close Button */}
            <button
              aria-label="Close Modal"
              className="absolute top-4 right-4 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              onClick={()=> setShowModelAddReel(false)}
            >
              <AiOutlineClose size={24} />
            </button>

            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
              Upload Reel
            </h2>

            {/* Video Preview */}
            {previewUrl && (
              <div className="relative w-full aspect-video mb-4 rounded-xl overflow-hidden shadow-lg">
                <video
                  src={previewUrl}
                  controls
                  className="w-full h-full object-cover"
                />
                {!isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <AiOutlineCloudUpload size={48} className="text-white/50" />
                  </div>
                )}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              {/* Drag & Drop + File Input */}
              <label
                htmlFor="video-upload"
                className="border-2 border-dashed border-gray-400 dark:border-gray-600 p-6 rounded-xl cursor-pointer hover:border-gray-500 transition flex flex-col items-center justify-center text-gray-600 dark:text-gray-300"
              >
                {videoFile ? "Change Video" : "Drag & drop or click to select video"}
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  id="video-upload"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </label>

              {/* Caption Input */}
              <TextareaAutosize
                placeholder="Write a caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-100 resize-none"
                minRows={3}
              />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isUploading}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition shadow-lg flex items-center justify-center disabled:opacity-50"
              >
                {isUploading ? (
                  <BiLoaderAlt className="animate-spin mr-2" size={24} />
                ) : null}
                {isUploading ? "Uploading..." : "Upload Reel"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReelUploadModal;
