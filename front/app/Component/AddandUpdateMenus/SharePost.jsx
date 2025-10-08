'use client'
import { useState, useEffect } from "react";
import Image from "next/image";
import { FaShare } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../Context/AuthContext";

export function ShareModal({ post, isOpen, onClose, onShare }) {
  const [customText, setCustomText] = useState("");
  const { user } = useAuth();

  // إغلاق المودال عند الضغط على Escape
  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!post?._id) return;
    onShare(post?.originalPost ? post?.originalPost?._id : post?._id, customText);
    setCustomText("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={onClose} // إغلاق عند النقر على الخلفية
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-darkMode-bg rounded-2xl w-full max-w-2xl shadow-2xl p-6 sm:p-8 relative"
            onClick={(e) => e.stopPropagation()} // منع الإغلاق عند النقر داخل المودال
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <FaShare className="text-blue-600 dark:text-blue-400 text-xl" />
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                  Share Post
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition text-xl hover:rotate-90 hover:scale-110"
              >
                ✕
              </button>
            </div>

            {/* Input */}
            <div className="flex gap-3 mb-5">
              <Image
                src={user?.profilePhoto?.url || "/default-profile.png"}
                alt="User Profile"
                width={50}
                height={50}
                className="rounded-full w-12 h-12 min-w-10 aspect-square object-cover "
              />
              <div className="flex-1 flex flex-col">
                <textarea
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-gray-50 dark:bg-darkMode-card text-gray-800 dark:text-gray-200 resize-none transition"
                  rows={3}
                  placeholder="Say something about this post..."
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                />
                <span className="text-xs text-gray-400 mt-1 self-end">
                  {customText.length}/300
                </span>
              </div>
            </div>

            {/* Post Preview */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-gray-50 dark:bg-darkMode-card hover:bg-gray-100 dark:hover:bg-darkMode-hover transition shadow-sm">
              {/* Owner */}
              <div className="flex items-center gap-3 mb-3">
                <Image
                  src={post?.owner?.profilePhoto?.url || "/default-profile.png"}
                  alt="Owner"
                  width={40}
                  height={40}
                  className="rounded-full w-10 h-10 min-w-10 aspect-square object-cover "
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

              {/* Post Text */}
              {post?.text && (
                <p className="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-3">
                  {post?.text}
                </p>
              )}

              {/* Photos */}
              {post?.Photos?.length > 0 && (
                <div
                  className={`grid gap-2 ${
                    post?.Photos?.length > 1 ? "grid-cols-2" : "grid-cols-1"
                  }`}
                >
                  {post?.Photos.slice(0, 2).map((photo, i) => (
                    <Image
                      key={i}
                      src={photo?.url}
                      alt={`Post-${i}`}
                      width={500}
                      height={300}
                      className="rounded-xl object-cover w-full h-[220px] hover:scale-105 transition-transform"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:scale-105 transition-transform shadow-lg flex items-center gap-2"
              >
                <FaShare /> Share
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
