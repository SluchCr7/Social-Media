'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FaTimes, FaPaperPlane } from 'react-icons/fa';
import { useAuth } from '../Context/AuthContext';
import { useAlert } from '../Context/AlertContext';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { Sparkles, MessageCircle } from 'lucide-react';

const CommentsPopup = ({ reelId, isOpen, onClose }) => {
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const { t } = useTranslation();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop with blur */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-black/70 via-gray-900/80 to-black/70 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Popup box with Neural Glass Effect */}
          <motion.div
            className="relative bg-gradient-to-br from-white/95 via-white/90 to-white/85 dark:from-gray-900/95 dark:via-gray-800/90 dark:to-gray-900/85 backdrop-blur-2xl rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_80px_rgba(0,0,0,0.6)] w-full max-w-2xl h-[80vh] flex flex-col overflow-hidden border border-white/20 dark:border-gray-700/30"
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 50, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-pink-500/10 to-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="relative flex justify-between items-center px-6 py-5 border-b border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg"
                >
                  <MessageCircle className="w-5 h-5 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    {t('Comments')}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {comments.length} {t('comments')}
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-red-500/10 dark:hover:bg-red-500/20 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-all"
              >
                <FaTimes size={20} />
              </motion.button>
            </div>

            {/* Comments List */}
            <div className="relative flex-1 overflow-y-auto px-6 py-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
              {comments.length > 0 ? (
                comments.map((c, index) => (
                  <motion.div
                    key={c._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group flex gap-3 items-start p-4 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="relative flex-shrink-0"
                    >
                      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 rounded-full blur-sm opacity-60 group-hover:opacity-100 transition-opacity" />
                      <Image
                        width={40}
                        height={40}
                        src={c.owner?.profilePhoto?.url || '/default-avatar.png'}
                        alt="avatar"
                        className="relative w-10 h-10 rounded-full object-cover ring-2 ring-white/50 dark:ring-gray-700/50"
                      />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-sm bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                          {c.owner?.username || 'User'}
                        </p>
                        <span className="text-xs text-gray-400">·</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2h ago</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed break-words">
                        {c.text}
                      </p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center h-full text-center py-20"
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="mb-4 p-6 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10"
                  >
                    <Sparkles className="w-12 h-12 text-gray-400" />
                  </motion.div>
                  <p className="text-gray-400 dark:text-gray-500 text-lg font-medium">
                    {t('No comments yet')} 👀
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                    {t('Be the first to share your thoughts!')}
                  </p>
                </motion.div>
              )}
            </div>

            {/* Input Box */}
            <div className="relative border-t border-gray-200/50 dark:border-gray-700/50 px-6 py-4 backdrop-blur-sm bg-white/30 dark:bg-gray-900/30">
              <div className="flex gap-3 items-end">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={t('Add a comment...')}
                    className="w-full bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-3.5 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        // addComment();
                      }
                    }}
                  />
                  <motion.div
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Sparkles className="w-5 h-5 text-gray-400" />
                  </motion.div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  // onClick={addComment}
                  disabled={loading || !newComment.trim()}
                  className={`p-4 rounded-2xl font-semibold shadow-lg transition-all ${loading || !newComment.trim()
                      ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-blue-500/50'
                    }`}
                >
                  <FaPaperPlane className="text-lg" />
                </motion.button>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 ml-1">
                {t('Press Enter to send')}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
CommentsPopup.displayName = 'CommentsPopup';

export default CommentsPopup;
