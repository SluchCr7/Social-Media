'use client';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { CiEdit, CiMapPin } from 'react-icons/ci';
import { AiOutlineDelete } from 'react-icons/ai';
import { MdOutlineReport, MdContentCopy } from "react-icons/md";
import { FaRegCommentDots } from 'react-icons/fa';
import { useAuth } from '../Context/AuthContext';
import { usePost } from '../Context/PostContext';
import { useReport } from '../Context/ReportContext';
import { motion, AnimatePresence } from 'framer-motion';
import { RiUserFollowLine, RiUserUnfollowLine } from "react-icons/ri"
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
    whileHover={{ x: 4 }}
    whileTap={{ scale: 0.97 }}
    onClick={action}
    disabled={loading}
    className={`flex items-center gap-3 px-4 py-4 text-sm font-medium text-left transition rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400
      ${className || 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'}
      ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    role="menuitem"
  >
    {icon}
    <span>{loading ? 'Processing...' : text}</span>
  </motion.button>
);

const PostMenu = ({ showMenu, setShowMenu, post }) => {
  const { followUser, pinPost, toggleBlockNotification } = useUser()
  const { blockOrUnblockUser } = useAdmin()
  const { t, i18n } = useTranslation()
  const { user } = useAuth();
  const { deletePost, setPostIsEdit, setShowPostModelEdit, displayOrHideComments, copyPostLink } = usePost();
  const { setIsTargetId, setShowMenuReport, setReportedOnType } = useReport();
  const { showAlert } = useAlert()
  const menuRef = useRef();
  const isOwner = post?.owner?._id === user?._id;
  const [confirmAction, setConfirmAction] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const { userData } = useGetData(user?._id)
  
  // ✅ تحديد اتجاه اللغة
  const {isRTL} = useTranslate()
  useEffect(()=>{
    console.log(`user Data : ${userData}`)
  },[userData])
  // ✅ إغلاق القائمة عند الضغط خارجها
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
    };
    if (showMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  // ✅ خيارات المالك
  const ownerOptions = useMemo(() => [
    {
      icon: <CiMapPin size={18} />,
      text: userData?.pinsPosts?.some((p) => p?.id === post?._id) ? t('Unpin Post') : t('Pin Post'),
      action: async () => {
        setLoadingBtn(true);
        await pinPost(post?._id);
        setLoadingBtn(false);
      },
    },
    {
      icon: <CiEdit size={18} />,
      text: t('Edit Post'),
      action: () => {
        setPostIsEdit(post);
        setShowPostModelEdit(true);
      },
    },
    {
      icon: <AiOutlineDelete size={18} />,
      text: t('Delete Post'),
      action: () => setConfirmAction(() => async () => {
        setLoadingBtn(true);
        await deletePost(post?._id);
        setLoadingBtn(false);
      }),
      className: 'text-red-800 hover:bg-red-100',
    },
    {
      icon: <FaRegCommentDots size={18} />,
      text: post?.isCommentOff ? t('Enable Comments') : t('Disable Comments'),
      action: async () => {
        setLoadingBtn(true);
        await displayOrHideComments(post?._id);
        setLoadingBtn(false);
      },
      className: post?.isCommentOff
        ? 'text-green-600 hover:bg-green-100'
        : 'text-red-600 hover:bg-yellow-100',
    },
  ], [userData, post]);

  // ✅ خيارات الزائر
  const visitorOptions = useMemo(() => [
    {
      icon: user?.BlockedNotificationFromUsers?.some((userBlock)=> userBlock._id === post?.owner?._id)
        ? <GoUnmute className="text-lg" />
        : <IoVolumeMute className="text-lg" />,
      text: user?.BlockedNotificationFromUsers?.some((userBlock)=> userBlock._id === post?.owner?._id)
        ? t('Unmute Notifications From User')
        : t('Mute Notifications From User'),
      action: () => toggleBlockNotification(post?.owner?._id),
      className: user?.BlockedNotificationFromUsers?.some((userBlock)=> userBlock._id === post?.owner?._id)
        ? 'text-blue-400 hover:bg-blue-100'
        : 'text-red-400 hover:bg-red-100',
    },
    {
      icon: user?.following?.some(f => f._id === post?.owner?._id)
        ? <RiUserUnfollowLine className="text-lg" />
        : <RiUserFollowLine className="text-lg" />,
      text: user?.following?.some(f => f._id === post?.owner?._id)
        ? t('Unfollow User')
        : t('Follow User'),
      action: () => followUser(post?.owner?._id),
      className: user?.following?.some(f => f._id === post?.owner?._id)
        ? 'text-red-600 hover:bg-red-100'
        : 'text-blue-600 hover:bg-blue-100',
    },
    {
      icon: <MdOutlineReport size={18} />,
      text: t('Report Post'),
      action: () => {
        setIsTargetId(post?._id);
        setReportedOnType('post');
        setShowMenuReport(true);
      },
      className: 'text-red-600 hover:bg-red-100',
    },
    {
      icon: <MdContentCopy size={18} />,
      text: t('Copy Link'),
      action: () => {
        copyPostLink(post?._id);
        showAlert('Post link copied!');
      },
      className: 'text-blue-600 hover:bg-blue-100',
    },
    {
      icon: <AiOutlineDelete size={18} />,
      text: user?.blockedUsers?.includes(post?.owner?._id)
        ? t('Unblock User')
        : t('Block User'),
      action: () => setConfirmAction(() => async () => {
        setLoadingBtn(true);
        await blockOrUnblockUser(post?.owner?._id);
        setLoadingBtn(false);
      }),
      className: user?.blockedUsers?.includes(post?.owner?._id)
        ? 'text-green-600 hover:bg-green-100'
        : 'text-red-600 hover:bg-red-100',
    }
  ], [user, post]);

  const optionsToShow = isOwner ? ownerOptions : visitorOptions;

  return (
    <>
      <AnimatePresence>
        {showMenu && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.2 }}
            // ✅ هنا نحدد موقع القائمة حسب اللغة
            className={`absolute mt-2 w-64 bg-white dark:bg-gray-900 
                      border border-gray-200 dark:border-gray-700 
                      rounded-xl shadow-lg z-[3000]
                      ${isRTL ? 'left-0' : 'right-0'}`}
            role="menu"
          >
            <motion.div
              className="flex flex-col divide-y divide-gray-200 dark:divide-gray-700"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
                visible: { transition: { staggerChildren: 0.05 } },
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
        )}
      </AnimatePresence>

      {/* ✅ نافذة التأكيد */}
      <AnimatePresence>
        {confirmAction && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg max-w-sm w-full text-center"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {t("Are you sure?")}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                {t("This action cannot be undone.")}
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setConfirmAction(null)}
                  className="px-4 py-2 rounded-lg border text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {t("Cancel")}
                </button>
                <button
                  onClick={() => {
                    confirmAction();
                    setConfirmAction(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                >
                  {t("Confirm")}
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
