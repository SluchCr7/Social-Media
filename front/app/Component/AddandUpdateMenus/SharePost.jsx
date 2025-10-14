'use client';
import { useState, useEffect } from "react";
import Image from "next/image";
import { FaShare, FaSpinner } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../Context/AuthContext";
import { usePost } from "@/app/Context/PostContext";

export function ShareModal({ post, isOpen, onClose, onShare }) {
  const [customText, setCustomText] = useState("");
  const { user } = useAuth();
  const { isLoading } = usePost();

  // Close modal on ESC
  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && !isLoading && onClose();
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose, isLoading]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!post?._id || isLoading) return;
    onShare(post?.originalPost ? post?.originalPost?._id : post?._id, customText);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-2xl rounded-2xl bg-white/90 dark:bg-gray-900/90 shadow-2xl border border-gray-200/40 dark:border-gray-700/40 p-6 sm:p-8 backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Loading overlay */}
            {isLoading && (
              <motion.div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl z-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="text-white text-4xl mb-3"
                >
                  <FaSpinner />
                </motion.div>
                <p className="text-white text-sm font-medium tracking-wide">Sharing post...</p>
              </motion.div>
            )}

            {/* Header */}
            <div className="flex justify-between items-center mb-5 border-b border-gray-200/50 dark:border-gray-700/50 pb-3">
              <div className="flex items-center gap-2">
                <motion.div
                  initial={{ rotate: -20 }}
                  animate={{ rotate: 0 }}
                  className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                >
                  <FaShare size={16} />
                </motion.div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">
                  Share Post
                </h2>
              </div>
              <button
                onClick={onClose}
                disabled={isLoading}
                className={`text-gray-400 text-2xl leading-none hover:text-gray-600 dark:hover:text-gray-300 transition-transform ${
                  isLoading ? "opacity-40 cursor-not-allowed" : "hover:rotate-90"
                }`}
              >
                ✕
              </button>
            </div>

            {/* Input */}
            <div className="flex gap-3 mb-6">
              <Image
                src={user?.profilePhoto?.url || "/default-profile.png"}
                alt="User"
                width={48}
                height={48}
                className="rounded-full w-12 h-12 object-cover border border-gray-300/60 dark:border-gray-600/60"
              />
              <div className="flex-1 flex flex-col">
                <textarea
                  disabled={isLoading}
                  className={`w-full rounded-xl p-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-100 resize-none transition ${
                    isLoading && "opacity-50 cursor-not-allowed"
                  }`}
                  rows={3}
                  maxLength={300}
                  placeholder="Add your thoughts..."
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                />
                <span className="text-xs text-gray-400 mt-1 self-end">
                  {customText.length}/300
                </span>
              </div>
            </div>

            {/* Post Preview */}
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-800/60 shadow-inner p-4 hover:bg-gray-100/60 dark:hover:bg-gray-800 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <Image
                  src={post?.owner?.profilePhoto?.url || "/default-profile.png"}
                  alt="Owner"
                  width={40}
                  height={40}
                  className="rounded-full border border-gray-300/60 dark:border-gray-600/60 object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-100 leading-tight">
                    {post?.owner?.profileName}
                  </p>
                  <span className="text-sm text-gray-500">@{post?.owner?.username}</span>
                </div>
              </div>

              {post?.text && (
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-3 line-clamp-3">
                  {post?.text}
                </p>
              )}

              {post?.Photos?.length > 0 && (
                <div
                  className={`grid gap-2 ${
                    post?.Photos?.length > 1 ? "grid-cols-2" : "grid-cols-1"
                  }`}
                >
                  {post?.Photos.slice(0, 2).map((photo, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden rounded-xl"
                    >
                      <Image
                        src={photo?.url}
                        alt={`Post-${i}`}
                        width={500}
                        height={300}
                        className="rounded-xl object-cover w-full h-[220px]"
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={onClose}
                disabled={isLoading}
                className={`px-5 py-2 rounded-xl font-medium transition ${
                  isLoading
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                }`}
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`px-6 py-2.5 rounded-xl font-semibold text-white shadow-md flex items-center gap-2 transition-transform ${
                  isLoading
                    ? "bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-purple-500 hover:scale-[1.03] hover:shadow-lg"
                }`}
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="text-white"
                    >
                      <FaSpinner />
                    </motion.div>
                    Sharing...
                  </>
                ) : (
                  <>
                    <FaShare /> Share
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
