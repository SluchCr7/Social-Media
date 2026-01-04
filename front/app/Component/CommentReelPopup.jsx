'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { FaTimes, FaPaperPlane } from 'react-icons/fa';
import { useAuth } from '../Context/AuthContext';
import { useAlert } from '../Context/AlertContext';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { HiSparkles, HiChatBubbleLeftRight } from 'react-icons/hi2';

const CommentsPopup = ({ reelId, isOpen, onClose }) => {
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const { t } = useTranslation();
  const [comments, setComments] = useState([]); // This would come from props/context in real app
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  // Ideally, useReels or similar context should provide comments, 
  // or fetch them here. Assuming prop or mock for now, 
  // but preserving the existing logic structure.

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
            className="relative w-full sm:max-w-lg h-[80vh] sm:h-[600px] bg-[#0A0A0A] border-t sm:border border-white/10 rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                  <HiChatBubbleLeftRight className="text-xl" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">{t('Discussion')}</h3>
                  <p className="text-xs text-gray-500">{comments.length} {t('Active Signals')}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 flex items-center justify-center transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {comments.length > 0 ? (
                comments.map((c, i) => (
                  <div key={c._id || i} className="flex gap-4 group">
                    <div className="relative shrink-0">
                      <Image
                        src={c.owner?.profilePhoto?.url || '/default-avatar.png'}
                        width={32} height={32}
                        className="w-8 h-8 rounded-full object-cover border border-white/10"
                        alt="User"
                      />
                      <div className="absolute inset-0 rounded-full border border-indigo-500/0 group-hover:border-indigo-500/50 transition-all pointer-events-none" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-300">{c.owner?.username || 'User'}</span>
                        <span className="text-[10px] text-gray-600">• 2h</span>
                      </div>
                      <p className="text-sm text-gray-400 leading-relaxed font-medium">
                        {c.text}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                  <HiChatBubbleLeftRight className="text-4xl text-gray-600" />
                  <p className="text-sm text-gray-500 font-medium max-w-[200px]">{t("No signals found in this frequency. Transmit the first message.")}</p>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-black/40 border-t border-white/5 backdrop-blur-lg mb-safe">
              <div className="relative flex items-center gap-3">
                <Image
                  src={user?.profilePhoto?.url || '/default-avatar.png'}
                  width={30} height={30}
                  className="w-8 h-8 rounded-full opacity-50 border border-white/10"
                  alt="Me"
                />
                <div className="flex-1 relative">
                  <input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={t("Transmit message...")}
                    className="w-full bg-white/5 border border-white/10 rounded-full pl-4 pr-12 py-3 text-sm text-white focus:border-indigo-500/50 focus:bg-white/10 outline-none transition-all placeholder:text-gray-600"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        // Submit implementation
                      }
                    }}
                  />
                  <button
                    disabled={!newComment.trim() || loading}
                    className={`absolute right-1 top-1 p-2 rounded-full transition-all ${newComment.trim() ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-transparent text-gray-600'}`}
                  >
                    {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FaPaperPlane size={12} />}
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
