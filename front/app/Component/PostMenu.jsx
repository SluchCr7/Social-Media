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

const MenuOption = ({ icon, text, action, className, loading }) => (
  <motion.button
    variants={{
      hidden: { opacity: 0, x: -10 },
      visible: { opacity: 1, x: 0 }
    }}
    whileHover={{ x: 6, backgroundColor: 'rgba(0,0,0,0.05)' }}
    whileTap={{ scale: 0.98 }}
    onClick={action}
    disabled={loading}
    className={`flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-left transition-all rounded-lg focus:outline-none 
      ${className || 'text-gray-700 dark:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'}
      ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    role="menuitem"
  >
    <span className="text-xl opacity-80">{icon}</span>
    <span className="flex-1">{loading ? 'Processing...' : text}</span>
  </motion.button>
);

const PostMenu = ({ showMenu, setShowMenu, post, triggerRef }) => {
  const { pinPost, toggleBlockNotification } = useUser()
  const { blockOrUnblockUser } = useAdmin()
  const { t } = useTranslation()
  const { user } = useAuth();
  const { deletePost, setPostIsEdit, setShowPostModelEdit, displayOrHideComments, copyPostLink } = usePost();
  const { setIsTargetId, setShowMenuReport, setReportedOnType } = useReport();
  const { showAlert } = useAlert()
  const { userData } = useGetData(user?._id)
  const { isRTL } = useTranslate()

  const menuRef = useRef();
  const [confirmAction, setConfirmAction] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const isOwner = post?.owner?._id === user?._id;

  // Calculate position
  useEffect(() => {
    if (showMenu && triggerRef?.current) {
      const handlePosition = () => {
        const rect = triggerRef.current.getBoundingClientRect();
        const menuWidth = 256; // w-64

        setCoords({
          top: rect.bottom + 8,
          left: isRTL ? rect.left : rect.right - menuWidth
        });
      };

      handlePosition();

      // Close on scroll or resize to prevent the menu from "drifting"
      window.addEventListener('scroll', () => setShowMenu(false), { once: true });
      window.addEventListener('resize', () => setShowMenu(false), { once: true });
    }
  }, [showMenu, isRTL, triggerRef, setShowMenu]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) && !triggerRef?.current?.contains(e.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu, triggerRef]);

  const ownerOptions = useMemo(() => [
    {
      icon: <CiMapPin />,
      text: userData?.pinsPosts?.some((p) => p?.id === post?._id) ? t('Unpin Post') : t('Pin Post'),
      action: async () => {
        setLoadingBtn(true);
        await pinPost(post?._id);
        setLoadingBtn(false);
      },
    },
    {
      icon: <CiEdit />,
      text: t('Edit Post'),
      action: () => {
        setPostIsEdit(post);
        setShowPostModelEdit(true);
      },
    },
    {
      icon: <AiOutlineDelete />,
      text: t('Delete Post'),
      action: () => setConfirmAction(() => async () => {
        setLoadingBtn(true);
        await deletePost(post?._id);
        setLoadingBtn(false);
      }),
      className: 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20',
    },
    {
      icon: <FaRegCommentDots />,
      text: post?.isCommentOff ? t('Enable Comments') : t('Disable Comments'),
      action: async () => {
        setLoadingBtn(true);
        await displayOrHideComments(post?._id);
        setLoadingBtn(false);
      },
      className: post?.isCommentOff
        ? 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
        : 'text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20',
    },
  ], [userData, post, t]);

  const visitorOptions = useMemo(() => [
    {
      icon: user?.BlockedNotificationFromUsers?.includes(post?.owner?._id)
        ? <GoUnmute />
        : <IoVolumeMute />,
      text: user?.BlockedNotificationFromUsers?.includes(post?.owner?._id)
        ? t('Unmute Notifications')
        : t('Mute Notifications'),
      action: () => toggleBlockNotification(post?.owner?._id),
      className: user?.BlockedNotificationFromUsers?.includes(post?.owner?._id)
        ? 'text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
        : 'text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20',
    },
    {
      icon: <MdOutlineReport />,
      text: t('Report Post'),
      action: () => {
        setIsTargetId(post?._id);
        setReportedOnType('post');
        setShowMenuReport(true);
      },
      className: 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20',
    },
    {
      icon: <MdContentCopy />,
      text: t('Copy Link'),
      action: () => {
        copyPostLink(post?._id);
        showAlert('Post link copied!');
      },
      className: 'text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20',
    },
    {
      icon: <AiOutlineDelete />,
      text: user?.blockedUsers?.includes(post?.owner?._id)
        ? t('Unblock User')
        : t('Block User'),
      action: () => setConfirmAction(() => async () => {
        setLoadingBtn(true);
        await blockOrUnblockUser(post?.owner?._id);
        setLoadingBtn(false);
      }),
      className: user?.blockedUsers?.includes(post?.owner?._id)
        ? 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
        : 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20',
    }
  ], [user, post, t]);

  const optionsToShow = isOwner ? ownerOptions : visitorOptions;

  const menuContent = (
    <AnimatePresence>
      {showMenu && (
        <>
          {/* Transparent backdrop to catch clicks if needed, though handleClickOutside handles it */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998]"
            onClick={() => setShowMenu(false)}
          />

          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              position: 'fixed',
              top: coords.top,
              left: coords.left,
              width: '256px',
            }}
            className="z-[9999] bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl
                       border border-gray-200/50 dark:border-gray-700/50 
                       rounded-2xl shadow-2xl overflow-hidden p-2"
            role="menu"
          >
            <motion.div
              className="flex flex-col gap-1"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.05
                  }
                }
              }}
            >
              {optionsToShow.map((option, index) => (
                <MenuOption
                  key={index}
                  {...option}
                  loading={loadingBtn}
                  action={() => {
                    option.action();
                    setShowMenu(false);
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {typeof document !== 'undefined' && createPortal(menuContent, document.body)}

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {confirmAction && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10000] p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-2xl max-w-sm w-full text-center border border-gray-100 dark:border-gray-800"
            >
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <AiOutlineDelete size={32} className="text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {t("Confirm Action")}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                {t("Are you sure you want to proceed? This action cannot be reversed.")}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmAction(null)}
                  className="flex-1 px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  {t("Cancel")}
                </button>
                <button
                  onClick={() => {
                    confirmAction();
                    setConfirmAction(null);
                  }}
                  className="flex-1 px-6 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
                >
                  {t("Delete")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PostMenu;
