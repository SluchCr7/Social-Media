'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { CiEdit, CiMapPin } from 'react-icons/ci';
import { AiOutlineDelete } from 'react-icons/ai';
import { MdOutlineReport, MdContentCopy } from "react-icons/md";
import { FaRegCommentDots } from 'react-icons/fa';
import { useAuth } from '../Context/AuthContext';
import { usePost } from '../Context/PostContext';
import { useReport } from '../Context/ReportContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../Context/UserContext';
import { useAdmin } from '../Context/UserAdminContext';
import { useAlert } from '../Context/AlertContext';
import { useGetData } from '../Custome/useGetData';
import { useTranslation } from 'react-i18next';
import { IoVolumeMute } from "react-icons/io5";
import { GoUnmute } from "react-icons/go";
import { useTranslate } from '../Context/TranslateContext';

const MenuOption = ({ icon, text, action, className, loading }) => {
  const { t } = useTranslation();
  return (
    <motion.button
      whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.05)' }}
      whileTap={{ scale: 0.98 }}
      onClick={action}
      disabled={loading}
      className={`flex items-center gap-4 px-5 py-3.5 text-[10px] font-black uppercase tracking-widest text-left transition-all rounded-xl border border-transparent hover:bg-gray-100 dark:hover:bg-white/5
        ${className || 'text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white'}
        ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span className="text-xl opacity-40">{icon}</span>
      <span className="flex-1">{loading ? t('SYNCING...') : text}</span>
    </motion.button>
  );
};

const PostMenu = ({ showMenu, setShowMenu, post, triggerRef }) => {
  const { pinPost, toggleBlockNotification } = useUser();
  const { blockOrUnblockUser } = useAdmin();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { deletePost, setPostIsEdit, setShowPostModelEdit, displayOrHideComments, copyPostLink } = usePost();
  const { setIsTargetId, setShowMenuReport, setReportedOnType } = useReport();
  const { showAlert } = useAlert();
  const { userData } = useGetData(user?._id);
  const { isRTL } = useTranslate();

  const menuRef = useRef();
  const [confirmAction, setConfirmAction] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const isOwner = post?.owner?._id === user?._id;

  useEffect(() => {
    if (showMenu && triggerRef?.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const menuWidth = 280;
      setCoords({
        top: rect.bottom + 12,
        left: isRTL ? rect.left : rect.right - menuWidth
      });

      const handleScroll = () => setShowMenu(false);
      window.addEventListener('scroll', handleScroll, { once: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [showMenu, isRTL, triggerRef, setShowMenu]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) && !triggerRef?.current?.contains(e.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu, triggerRef, setShowMenu]);

  const ownerOptions = useMemo(() => [
    {
      id: 'pin',
      icon: <CiMapPin />,
      text: userData?.pinsPosts?.some((p) => p?.id === post?._id) ? t('Unpin Terminal') : t('Pin Terminal'),
      action: async () => {
        setLoadingBtn(true);
        await pinPost(post?._id);
        setLoadingBtn(false);
      },
    },
    {
      id: 'edit',
      icon: <CiEdit />,
      text: t('Modify Data'),
      action: () => {
        setPostIsEdit(post);
        setShowPostModelEdit(true);
      },
    },
    {
      id: 'comments',
      icon: <FaRegCommentDots />,
      text: post?.isCommentOff ? t('Open Discourse') : t('Close Discourse'),
      action: async () => {
        setLoadingBtn(true);
        await displayOrHideComments(post?._id);
        setLoadingBtn(false);
      },
    },
    {
      id: 'delete',
      icon: <AiOutlineDelete />,
      text: t('Terminated'),
      action: () => {
        setConfirmAction(() => async () => {
          setLoadingBtn(true);
          await deletePost(post?._id);
          setLoadingBtn(false);
        });
      },
      className: 'text-red-500 hover:bg-red-500/10 border-red-500/10 hover:border-red-500/20',
    },
  ], [userData, post, t, pinPost, setPostIsEdit, setShowPostModelEdit, displayOrHideComments, deletePost]);

  const visitorOptions = useMemo(() => [
    {
      id: 'mute',
      icon: user?.BlockedNotificationFromUsers?.includes(post?.owner?._id) ? <GoUnmute /> : <IoVolumeMute />,
      text: user?.BlockedNotificationFromUsers?.includes(post?.owner?._id) ? t('Unmute Waves') : t('Mute Waves'),
      action: () => toggleBlockNotification(post?.owner?._id),
    },
    {
      id: 'report',
      icon: <MdOutlineReport />,
      text: t('Flag Anomaly'),
      action: () => {
        setIsTargetId(post?._id);
        setReportedOnType('post');
        setShowMenuReport(true);
      },
    },
    {
      id: 'copy',
      icon: <MdContentCopy />,
      text: t('Copy Hash'),
      action: () => {
        copyPostLink(post?._id);
        showAlert(t('Signal Hash Copied!'));
      },
    },
    {
      id: 'block',
      icon: <AiOutlineDelete />,
      text: user?.blockedUsers?.includes(post?.owner?._id) ? t('Restore Link') : t('Sever Connection'),
      action: () => {
        setConfirmAction(() => async () => {
          setLoadingBtn(true);
          await blockOrUnblockUser(post?.owner?._id);
          setLoadingBtn(false);
        });
      },
      className: 'text-red-500 hover:bg-red-500/10 border-red-500/10 hover:border-red-500/20',
    }
  ], [user, post, t, toggleBlockNotification, setIsTargetId, setReportedOnType, setShowMenuReport, copyPostLink, showAlert, blockOrUnblockUser]);

  const optionsToShow = isOwner ? ownerOptions : visitorOptions;

  const menuContent = (
    <AnimatePresence>
      {showMenu && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000]"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(false);
            }}
          />

          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              top: coords.top,
              left: coords.left,
              width: '280px',
            }}
            className="z-[1001] bg-white/90 dark:bg-[#0A0A0ACC] backdrop-blur-3xl border border-gray-200 dark:border-white/10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden p-3"
          >
            <div className="flex flex-col gap-1">
              {optionsToShow.map((option, index) => (
                <MenuOption
                  key={index}
                  {...option}
                  loading={loadingBtn}
                  action={(e) => {
                    e.stopPropagation();
                    option.action();
                    // Close menu only for actions that don't trigger sub-modals
                    if (!['delete', 'block', 'edit'].includes(option.id)) {
                      setShowMenu(false);
                    }
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Confirmation Modal - Also Portaled */}
          <AnimatePresence>
            {confirmAction && (
              <motion.div
                className="fixed inset-0 bg-white/80 dark:bg-black/80 backdrop-blur-xl flex items-center justify-center z-[10000] p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmAction(null);
                }}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white dark:bg-[#0A0A0A] rounded-[3rem] p-10 border border-gray-200 dark:border-white/10 shadow-2xl max-w-sm w-full text-center"
                >
                  <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
                    <AiOutlineDelete size={40} className="text-red-500" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-4">{t('Confirm Termination')}</h3>
                  <p className="text-gray-500 dark:text-white/40 text-sm font-bold leading-relaxed mb-10 px-4">
                    {t('This action will permanently sever the data link. It cannot be recovered once initiated.')}
                  </p>
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (typeof confirmAction === 'function') {
                          await confirmAction();
                        }
                        setConfirmAction(null);
                        setShowMenu(false);
                      }}
                      disabled={loadingBtn}
                      className="w-full py-4 rounded-2xl bg-red-500 text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-red-500/20 hover:bg-red-600 transition-all disabled:opacity-50"
                    >
                      {loadingBtn ? (
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
                      ) : (
                        t('Confirm Delete')
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmAction(null);
                      }}
                      className="w-full py-4 rounded-2xl bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-white/40 font-black text-xs uppercase tracking-widest hover:text-gray-900 dark:hover:text-white transition-all"
                    >
                      {t('Abort Action')}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {typeof document !== 'undefined' && createPortal(menuContent, document.body)}
    </>
  );
};

export default PostMenu;
