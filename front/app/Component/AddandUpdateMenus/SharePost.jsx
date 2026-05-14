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
    <div className="relative group rounded-3xl border border-gray-100 dark:border-threads-border bg-gray-50/50 dark:bg-white/[0.02] overflow-hidden p-6 transition-all hover:bg-gray-50 dark:hover:bg-white/[0.04]">
      <div className="flex items-center gap-3 mb-4">
        <Avatar
          src={post?.owner?.profilePhoto?.url}
          size="sm"
          className="border border-gray-100 dark:border-white/5"
        />
        <div className="flex flex-col">
          <p className="font-bold text-sm text-gray-900 dark:text-gray-100">
            {post?.owner?.profileName}
          </p>
          <span className="text-[11px] font-semibold text-gray-400">@{post?.owner?.username}</span>
        </div>
      </div>

      {post?.text && (
        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium leading-relaxed mb-4 line-clamp-3 italic opacity-80">
          {post?.text}
        </p>
      )}

      {(post?.media?.length > 0 || post?.Photos?.length > 0) && (
        <div className="relative rounded-2xl overflow-hidden aspect-video bg-black/5">
          <Image
            src={(post?.media?.[0]?.url || post?.Photos?.[0]?.url || post?.Photos?.[0] || "/default-post.png")}
            alt="Preview"
            fill
            className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute bottom-3 right-3">
            <div className="px-3 py-1 bg-black/20 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-1.5">
              <ImageIcon size={12} className="text-white/80" />
              <span className="text-[10px] text-white font-bold uppercase tracking-tight">{t('Preview')}</span>
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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => !isLoading && onClose()}
      >
        <motion.div
          initial={{ y: 20, scale: 0.98, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          exit={{ y: 20, scale: 0.98, opacity: 0 }}
          className="relative w-full max-w-xl rounded-[2.5rem] bg-white dark:bg-black shadow-2xl border border-gray-100 dark:border-threads-border flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center bg-indigo-50 dark:bg-white/5 rounded-2xl text-indigo-500">
                <Share size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight">
                  {t("Share Post")}
                </h2>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest opacity-60">
                  {t("Quote Post")}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 transition-all"
            >
              <X size={22} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-8">

            {/* Composition */}
            <div className="flex gap-4">
              <Avatar src={user?.profilePhoto?.url} size="md" />
              <div className="flex-1 space-y-4">
                <textarea
                  disabled={isLoading}
                  autoFocus
                  className="w-full bg-transparent border-none text-gray-900 dark:text-white placeholder-gray-400 focus:ring-0 text-lg font-medium resize-none min-h-[120px]"
                  maxLength={300}
                  placeholder={t("What's your take?")}
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                />

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/5">
                  <div className="flex gap-2">
                    <button className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                      <Hash size={20} />
                    </button>
                    <button className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                      <ImageIcon size={20} />
                    </button>
                  </div>
                  <span className={`text-[11px] font-bold tracking-tight ${customText.length > 280 ? 'text-red-500' : 'text-gray-400'}`}>
                    {customText.length} / 300
                  </span>
                </div>
              </div>
            </div>

            {/* Preview */}
            <PostPreview post={post} />
          </div>

          {/* Footer */}
          <div className="p-8 bg-gray-50/50 dark:bg-white/[0.02] border-t border-gray-100 dark:border-white/5 flex gap-4">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-8 py-3 rounded-full text-gray-500 hover:text-gray-900 dark:hover:text-white font-semibold text-sm transition-colors"
            >
              {t("Cancel")}
            </button>
            <Button
              onClick={handleSubmit}
              isLoading={isLoading}
              className="flex-1 rounded-full py-4 text-sm font-bold tracking-tight"
            >
              <Send size={18} className="mr-2" />
              {t("Post")}
            </Button>
          </div>

          {/* Loading Overlay */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-50"
              >
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                <p className="mt-4 font-bold text-[11px] uppercase tracking-[0.2em] animate-pulse">{t("Posting...")}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
ShareModal.displayName = 'ShareModal'
