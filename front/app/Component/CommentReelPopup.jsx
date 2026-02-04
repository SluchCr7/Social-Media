'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { FaTimes, FaPaperPlane } from 'react-icons/fa';
import { useAuth } from '../Context/AuthContext';
import { useComment } from '../Context/CommentContext';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { HiChatBubbleLeftRight } from 'react-icons/hi2';
import Comment from './Comment';
import CommentSkeleton from '../Skeletons/CommentSkeleton';

const CommentsPopup = ({ reelId, isOpen, onClose }) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { comments, fetchCommentsByTarget, AddComment, isLoading, setComments } = useComment();
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  // Pagination State
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // 🔄 Fetch Reel Comments
  useEffect(() => {
    if (isOpen && reelId) {
      const load = async () => {
        const res = await fetchCommentsByTarget(reelId, 'Reel');
        if (res) {
          setNextCursor(res.nextCursor);
          setHasMore(res.hasMore);
        }
      };
      load();
    }
    // Cleanup comments when closing to avoid flicker
    return () => {
      if (!isOpen) {
        setComments([]);
        setNextCursor(null);
        setHasMore(false);
      }
    };
  }, [isOpen, reelId, fetchCommentsByTarget, setComments]);

  const handleLoadMore = useCallback(async () => {
    if (loadingMore || !hasMore || !reelId) return;
    setLoadingMore(true);
    const res = await fetchCommentsByTarget(reelId, 'Reel', nextCursor);
    if (res) {
      setNextCursor(res.nextCursor);
      setHasMore(res.hasMore);
    }
    setLoadingMore(false);
  }, [loadingMore, hasMore, nextCursor, reelId, fetchCommentsByTarget]);

  const handleAddComment = useCallback(async () => {
    if (!newComment.trim() || loading) return;

    setLoading(true);
    try {
      await AddComment(newComment, reelId, 'Reel');
      setNewComment('');
    } catch (err) {
      console.error("Failed to add reel comment:", err);
    } finally {
      setLoading(false);
    }
  }, [newComment, reelId, AddComment, loading]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Panel */}
          <motion.div
            className="relative w-full sm:max-w-xl h-[80vh] sm:h-[700px] bg-[#0A0A0A] border-t sm:border border-white/10 rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                  <HiChatBubbleLeftRight size={24} />
                </div>
                <div>
                  <h3 className="text-white font-black text-xl tracking-tight uppercase">{t('Discussion')}</h3>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{comments?.length || 0} {t('Active Signals')}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 flex items-center justify-center transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => <CommentSkeleton key={i} />)
              ) : comments.length > 0 ? (
                <>
                  {comments.map((c) => (
                    <Comment key={c._id} comment={c} />
                  ))}
                  {hasMore && (
                    <div className="flex justify-center pt-4">
                      <button
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                        className="text-[10px] font-black uppercase tracking-widest text-indigo-500 hover:text-indigo-400 disabled:opacity-50"
                      >
                        {loadingMore ? t('Refreshing Signals...') : t('Load More Discussions')}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                  <HiChatBubbleLeftRight size={64} className="text-gray-600" />
                  <div className="space-y-2">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">{t("No signals detected")}</p>
                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{t("Transmit the first resonance in this frequency")}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-6 bg-black/40 border-t border-white/5 backdrop-blur-2xl">
              <div className="relative flex items-center gap-4">
                <div className="relative shrink-0">
                  <Image
                    src={user?.profilePhoto?.url || '/default-avatar.png'}
                    width={40} height={40}
                    className="w-10 h-10 rounded-xl object-cover border border-white/10"
                    alt="Me"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-indigo-500 border-2 border-[#0A0A0A] rounded-full" />
                </div>
                <div className="flex-1 relative">
                  <input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={t("Transmit message...")}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-5 pr-14 py-4 text-sm text-white focus:border-indigo-500/50 focus:bg-white/10 outline-none transition-all placeholder:text-gray-600 font-medium"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        handleAddComment();
                      }
                    }}
                  />
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim() || loading}
                    className={`absolute right-2 top-2 w-10 h-10 rounded-xl transition-all flex items-center justify-center ${newComment.trim() ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-transparent text-gray-700'}`}
                  >
                    {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FaPaperPlane size={16} />}
                  </button>
                </div>
              </div>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
CommentsPopup.displayName = 'CommentsPopup';

export default CommentsPopup;
