'use client';

import React, { useState } from 'react';
import { useReels } from '../Context/ReelsContext';
import { useAlert } from '../Context/AlertContext';

const ReelUploadModal = ({ isOpen, onClose }) => {
  const { uploadReel } = useReels();
  const { showAlert } = useAlert();

  const [videoFile, setVideoFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-black bg-opacity-70 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-md p-6 relative">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-700 dark:text-gray-300 font-bold text-xl"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Upload Reel</h2>

        {/* Video Preview */}
        {previewUrl && (
          <video
            src={previewUrl}
            controls
            className="w-full h-64 object-cover mb-4 rounded"
          />
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Video Input */}
          <label className="border-2 border-dashed border-gray-400 dark:border-gray-600 p-4 rounded cursor-pointer text-center hover:border-gray-600 dark:hover:border-gray-400 transition">
            {videoFile ? "Change Video" : "Select Video"}
            <input type="file" accept="video/*" className="hidden" onChange={handleFileChange} />
          </label>

          {/* Caption Input */}
          <textarea
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full p-3 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-100"
            rows={3}
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isUploading}
            className="bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isUploading ? "Uploading..." : "Upload Reel"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReelUploadModal;
