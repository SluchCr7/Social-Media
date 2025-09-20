'use client'
import { useState } from "react";
import Image from "next/image";
import { FaShare } from "react-icons/fa";
import { useAuth } from "../Context/AuthContext";

export function ShareModal({ post, isOpen, onClose, onShare }) {
  const [customText, setCustomText] = useState("");
  const {user} = useAuth()
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-darkMode-bg rounded-2xl w-full max-w-2xl shadow-2xl animate-fadeIn">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-2">
            <FaShare className="text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
              Share Post
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition text-lg"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          {/* Input Section */}
          <div className="flex gap-3 mb-4">
            <Image
              src={user?.profilePhoto?.url || '/default-profile.png'}
              alt="User Profile"
              width={45}
              height={45}
              className="w-9 h-9 rounded-full object-cover"
            />
            <textarea
              className="w-full border border-gray-300 dark:border-gray-600 rounded-xl p-3 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 transition
                         bg-gray-50 dark:bg-darkMode-card text-gray-800 dark:text-gray-200 resize-none"
              rows="3"
              placeholder="Say something about this post..."
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
            />
          </div>

          {/* Original Post Preview */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 
                          bg-gray-50 dark:bg-darkMode-card hover:bg-gray-100 dark:hover:bg-darkMode-hover transition">
            {/* User Info */}
            <div className="flex items-center gap-3 mb-3">
              <Image
                src={user?.profilePhoto?.url || '/default-profile.png'}
                alt="User Profile"
                width={40}
                height={40}
                className="w-6 h-6 rounded-full object-cover"
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
                {post?.Photos.slice(0, 2).map((photo, i) => (
                  <Image
                    key={i}
                    src={photo?.url}
                    alt={`Post-${i}`}
                    width={500}
                    height={300}
                    className="rounded-xl object-cover w-full max-h-[220px]"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 border-t border-gray-200 dark:border-gray-700 p-4">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-200 text-gray-700 
                       dark:bg-gray-700 dark:text-gray-200 font-medium 
                       hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-xl bg-blue-600 text-white font-medium 
                       hover:bg-blue-700 hover:scale-105 transition-transform shadow-md"
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
