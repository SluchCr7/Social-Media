'use client';

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import {
  Share,
  Loader2,
  X,
  Image as ImageIcon,
  Hash,
  Send,
  User as UserIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../Context/AuthContext";
import { usePost } from "@/app/Context/PostContext";
import { useTranslation } from "react-i18next";
import React from "react";
import { Button } from "../ui/Button";
import { Avatar } from "../ui/Avatar";

/**
 * @component PostPreview
 * @description A condensed visual summary of the post being shared.
 */
const PostPreview = React.memo(({ post }) => {
  const { t } = useTranslation();
  if (!post) return null;
  return (
    <div className="relative group rounded-2xl border border-gray-200/80 dark:border-neutral-800 bg-gray-50/60 dark:bg-neutral-900/60 overflow-hidden p-4 md:p-5 transition-all hover:bg-gray-50 dark:hover:bg-neutral-900">
      <div className="flex items-center gap-3 mb-3">
        <Avatar
          src={post?.owner?.profilePhoto?.url}
          size="sm"
          className="ring-1 ring-gray-200 dark:ring-neutral-800"
        />
        <div className="flex items-center gap-1.5 min-w-0">
          <p className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">
            {post?.owner?.profileName}
          </p>
          <span className="text-xs text-gray-400 font-medium truncate">@{post?.owner?.username}</span>
        </div>
      </div>

      {post?.text && (
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-3 line-clamp-2">
          {post?.text}
        </p>
      )}

      {(post?.media?.length > 0 || post?.Photos?.length > 0) && (
        <div className="relative rounded-xl overflow-hidden aspect-video bg-gray-100 dark:bg-neutral-800">
          <Image
            src={(post?.media?.[0]?.url || post?.Photos?.[0]?.url || post?.Photos?.[0] || "/default-post.png")}
            alt="Preview"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute bottom-2.5 right-2.5">
            <div className="px-2.5 py-1 bg-black/40 backdrop-blur-md rounded-md flex items-center gap-1.5 border border-white/10">
              <ImageIcon size={12} className="text-white/90" />
              <span className="text-[10px] text-white font-medium uppercase tracking-wider">{t('Preview')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
PostPreview.displayName = 'PostPreview';

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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => !isLoading && onClose()}
      >
        <motion.div
          initial={{ y: 15, scale: 0.98, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          exit={{ y: 15, scale: 0.98, opacity: 0 }}
          className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#0a0a0a] shadow-2xl border border-gray-100 dark:border-neutral-800 flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 dark:border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center bg-indigo-50 dark:bg-neutral-800 rounded-xl text-indigo-600 dark:text-indigo-400">
                <Share size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">
                  {t("Share Post")}
                </h2>
                <p className="text-[11px] text-gray-400 font-medium tracking-wide uppercase">
                  {t("Quote Post")}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto max-h-[70vh] p-6 space-y-5">
            {/* Composition */}
            <div className="flex gap-3.5">
              <Avatar src={user?.profilePhoto?.url} size="md" className="shrink-0" />
              <div className="flex-1 space-y-3">
                <textarea
                  disabled={isLoading}
                  autoFocus
                  className="w-full bg-transparent border-none text-gray-900 dark:text-white placeholder-gray-400 focus:ring-0 text-base font-normal resize-none min-h-[90px] focus:outline-none"
                  maxLength={300}
                  placeholder={t("What's your take?")}
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                />

                <div className="flex items-center justify-between pt-2">
                  <div className="flex gap-1 text-gray-400">
                    <button type="button" className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors">
                      <Hash size={18} />
                    </button>
                    <button type="button" className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors">
                      <ImageIcon size={18} />
                    </button>
                  </div>
                  <span className={`text-xs font-semibold ${customText.length > 280 ? 'text-red-500' : 'text-gray-400'}`}>
                    {customText.length} / 300
                  </span>
                </div>
              </div>
            </div>

            {/* Preview */}
            <PostPreview post={post} />
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50/50 dark:bg-neutral-900/40 border-t border-gray-100 dark:border-neutral-800 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-200/60 dark:hover:bg-neutral-800 font-medium text-sm transition-colors"
            >
              {t("Cancel")}
            </button>
            <Button
              onClick={handleSubmit}
              isLoading={isLoading}
              className="rounded-full px-6 py-2.5 text-sm font-semibold tracking-tight bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all"
            >
              <Send size={16} className="mr-2" />
              {t("Post")}
            </Button>
          </div>

          {/* Loading Overlay */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white/70 dark:bg-black/70 backdrop-blur-xs flex flex-col items-center justify-center z-50"
              >
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                <p className="mt-3 font-semibold text-xs text-gray-700 dark:text-gray-300 tracking-wider animate-pulse">{t("Posting...")}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
ShareModal.displayName = 'ShareModal';