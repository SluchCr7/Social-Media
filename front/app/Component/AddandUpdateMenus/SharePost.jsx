'use client';
import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { FaShare, FaSpinner } from "react-icons/fa";
import { HiX, HiPhotograph, HiHashtag } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../Context/AuthContext";
import { usePost } from "@/app/Context/PostContext";
import { useTranslation } from "react-i18next";
import React from "react";

/**
 * @component LoadingOverlay
 */
const LoadingOverlay = React.memo(() => (
  <motion.div
    className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center rounded-[2.5rem] z-[100]"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      className="text-indigo-500 text-5xl mb-4"
    >
      <FaSpinner />
    </motion.div>
    <p className="text-white text-xs font-black uppercase tracking-[0.3em]">{t("Syncing...")}</p>
  </motion.div>
));
LoadingOverlay.displayName = 'LoadingOverlay'

/**
 * @component PostPreview
 * @description A condensed visual summary of the post being shared.
 */
const PostPreview = React.memo(({ post }) => {
  if (!post) return null;
  return (
    <div className="relative group rounded-[2rem] border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] overflow-hidden p-5 transition-all hover:bg-black/[0.04] dark:hover:bg-white/[0.04] shadow-inner">
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-indigo-500/20 shadow-sm">
          <Image
            src={post?.owner?.profilePhoto?.url || "/default-profile.png"}
            alt="Owner"
            fill
            className="object-cover"
            loading="lazy"
          />
        </div>
        <div className="flex flex-col">
          <p className="font-black text-sm text-gray-900 dark:text-gray-100 uppercase tracking-tight">
            {post?.owner?.profileName}
          </p>
          <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">@{post?.owner?.username}</span>
        </div>
      </div>

      {post?.text && (
        <p className="text-gray-600 dark:text-gray-400 text-xs font-medium leading-relaxed mb-4 line-clamp-2 italic">
          "{post?.text}"
        </p>
      )}

      {(post?.media?.length > 0 || post?.Photos?.length > 0) && (
        <div className="relative rounded-2xl overflow-hidden aspect-video bg-black/10">
          <Image
            src={(post?.media?.[0]?.url || post?.Photos?.[0]?.url || post?.Photos?.[0] || "/default-post.png")}
            alt="Preview"
            fill
            className="object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-3 right-3 flex gap-2">
            <div className="px-3 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-1.5">
              <HiPhotograph className="text-white/80 text-xs" />
              <span className="text-[9px] text-white font-black uppercase tracking-tighter">Media Preview</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
PostPreview.displayName = 'PostPreview'

/**
 * @component ShareModal
 */
export function ShareModal({ post, isOpen, onClose, onShare }) {
  const [customText, setCustomText] = useState("");
  const { user } = useAuth();
  const { isLoading } = usePost();
  const { t } = useTranslation();

  const handleKey = useCallback(
    (e) => {
      if (e.key === "Escape" && !isLoading) onClose();
    },
    [onClose, isLoading]
  );

  const handleSubmit = useCallback(() => {
    if (!post?._id || isLoading) return;
    const targetId = post?.originalPost ? post?.originalPost?._id : post?._id;
    onShare(targetId, customText);
  }, [post, customText, isLoading, onShare]);

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [handleKey, isOpen]);

  const profileImage = useMemo(
    () => user?.profilePhoto?.url || "/default-profile.png",
    [user?.profilePhoto?.url]
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-md p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => !isLoading && onClose()}
      >
        <motion.div
          initial={{ y: 50, scale: 0.9, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          exit={{ y: 30, scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative w-full max-w-xl rounded-[3rem] bg-white/90 dark:bg-[#0A0A0A]/90 shadow-[0_32px_128px_-16px_rgba(0,0,0,0.4)] border border-black/5 dark:border-white/5 p-8 sm:p-10 backdrop-blur-3xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {isLoading && <LoadingOverlay />}

          {/* Decorative Gradients */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 blur-[80px] pointer-events-none" />

          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-600/20">
                <FaShare size={18} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">
                  {t("Amplify Post")}
                </h2>
                <p className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-[0.2em] opacity-60">
                  {t("Broadcasting System")}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="w-10 h-10 flex items-center justify-center rounded-2xl bg-black/5 dark:bg-white/5 text-gray-400 hover:text-red-500 transition-all"
            >
              <HiX size={24} />
            </button>
          </div>

          {/* Composition Area */}
          <div className="flex gap-4 mb-8">
            <div className="relative w-14 h-14 rounded-[1.2rem] overflow-hidden border border-black/5 dark:border-white/10 shrink-0 shadow-sm">
              <Image
                src={profileImage}
                alt="User"
                fill
                className="object-cover"
                loading="lazy"
              />
            </div>
            <div className="flex-1">
              <textarea
                disabled={isLoading}
                autoFocus
                className="w-full bg-transparent border-none text-gray-900 dark:text-white placeholder-gray-400 focus:ring-0 text-lg font-medium resize-none min-h-[100px]"
                maxLength={300}
                placeholder={t("What's on your mind?")}
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
              />
              <div className="flex items-center justify-between mt-2 pt-4 border-t border-black/5 dark:border-white/5">
                <div className="flex gap-3">
                  <button className="p-2 rounded-xl text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <HiHashtag size={20} />
                  </button>
                  <button className="p-2 rounded-xl text-gray-400 hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                    <HiPhotograph size={20} />
                  </button>
                </div>
                <span className="text-[10px] font-black text-gray-400 tracking-widest">
                  {customText.length} <span className="opacity-40">/ 300</span>
                </span>
              </div>
            </div>
          </div>

          {/* Post Preview */}
          <PostPreview post={post} />

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 mt-10">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-400 hover:text-black dark:hover:text-white transition-all"
            >
              {t("Stall")}
            </button>

            <motion.button
              onClick={handleSubmit}
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.25em] text-white shadow-xl flex items-center gap-3 transition-all ${isLoading
                  ? "bg-gray-400 opacity-50 cursor-not-allowed"
                  : "bg-indigo-600 shadow-indigo-600/20 hover:bg-indigo-500 active:bg-indigo-700"
                }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t("Syncing")}
                </>
              ) : (
                <>
                  <FaShare size={12} />
                  {t("Broadcast")}
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
ShareModal.displayName = 'ShareModal'
