'use client'
import { useState } from "react";
import Image from "next/image";

export function ShareModal({ post, isOpen, onClose, onShare }) {
  const [customText, setCustomText] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!post?._id) return;
    onShare(
      post?.originalPost ? post?.originalPost?._id : post?._id, 
      customText
    );
    setCustomText("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-darkMode-bg rounded-2xl w-full max-w-xl p-6 shadow-2xl transform transition-all duration-300 scale-95 animate-fadeIn">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            Share Post
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
          >
            ✕
          </button>
        </div>

        {/* Textarea */}
        <textarea
          className="w-full border border-gray-300 dark:border-gray-600 rounded-xl p-3 mb-4 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 transition
                     bg-gray-50 dark:bg-darkMode-card text-gray-800 dark:text-gray-200"
          rows="3"
          placeholder="Add a caption..."
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
        />

        {/* Original Post Preview */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 
                        bg-gray-50 dark:bg-darkMode-card hover:bg-gray-100 dark:hover:bg-darkMode-hover transition">
          
          {/* User Info */}
          <div className="flex items-center gap-3 mb-3">
            <Image
              src={post?.owner?.profilePhoto?.url || "/default-avatar.png"}
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-200">
                {post?.owner?.profileName}
              </p>
              <span className="text-sm text-gray-500">
                @{post?.owner?.username}
              </span>
            </div>
          </div>

          {/* Post text */}
          {post?.text && (
            <p className="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-3">
              {post?.text}
            </p>
          )}

          {/* Photos */}
          {post?.Photos?.length > 0 && (
            <div
              className={`grid gap-2 ${
                post?.Photos?.length > 1 ? "grid-cols-2" : ""
              }`}
            >
              {post.Photos.slice(0, 2).map((photo, i) => (
                <Image
                  key={i}
                  src={photo.url}
                  alt={`Post-${i}`}
                  width={500}
                  height={300}
                  className="rounded-xl object-cover w-full max-h-[200px]"
                />
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 hover:scale-105 transition"
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
