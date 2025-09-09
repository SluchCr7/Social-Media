'use client';
import React, { useEffect, useRef, useState } from 'react';
import { CiEdit, CiMapPin } from 'react-icons/ci';
import { AiOutlineDelete } from 'react-icons/ai';
import { MdOutlineReport } from 'react-icons/md';
import { FaRegCommentDots } from 'react-icons/fa';
import { MdContentCopy } from "react-icons/md";
import { useAuth } from '../Context/AuthContext';
import { usePost } from '../Context/PostContext';
import { useReport } from '../Context/ReportContext';
import { motion, AnimatePresence } from 'framer-motion';

const PostMenu = ({ showMenu, setShowMenu, post, anchorRef }) => {
  const { user, pinPost, users, blockOrUnblockUser } = useAuth();
  const { deletePost, setPostIsEdit, setShowPostModelEdit, displayOrHideComments, copyPostLink } = usePost();
  const { setIsPostId, setShowMenuReport } = useReport();

  const menuRef = useRef();
  const isOwner = post?.owner?._id === user?._id;
  const [myUser, setMyUser] = useState(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) && !anchorRef?.current?.contains(e.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      if (anchorRef?.current) {
        const rect = anchorRef.current.getBoundingClientRect();
        setCoords({
          top: rect.bottom + 8,
          left: rect.right - 240, // يفتح القائمة بمحاذاة الزر
        });
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  useEffect(() => {
    setMyUser(users.find((userobj) => userobj?._id === user?._id));
  }, [users]);

  const ownerOptions = [
    {
      icon: <CiMapPin size={20} />,
      text: myUser?.pinsPosts?.some((p) => p?.id === post?._id) ? 'Unpin Post' : 'Pin Post',
      action: () => pinPost(post?._id),
    },
    {
      icon: <CiEdit size={20} />,
      text: 'Edit Post',
      action: () => {
        setPostIsEdit(post);
        setShowPostModelEdit(true);
      },
    },
    {
      icon: <AiOutlineDelete size={20} />,
      text: 'Delete Post',
      action: () => deletePost(post?._id),
      className: 'text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30',
    },
    {
      icon: <FaRegCommentDots size={20} />,
      text: post?.isCommentOff ? 'Enable Comments' : 'Disable Comments',
      action: () => displayOrHideComments(post?._id),
      className: post?.isCommentOff
        ? 'text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30'
        : 'text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/30',
    },
  ];

  const visitorOptions = [
    {
      icon: <MdOutlineReport size={20} />,
      text: 'Report Post',
      action: () => {
        setIsPostId(post?._id);
        setShowMenuReport(true);
      },
      className: 'text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30',
    },
    {
      icon: <MdContentCopy size={20} />,
      text: 'Copy Link',
      action: () => copyPostLink(post?._id),
      className: 'text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30',
    },
    {
      icon: <AiOutlineDelete size={20} />,
      text: user?.blockedUsers?.includes(post?.owner?._id) ? 'Unblock User' : 'Block User',
      action: () => blockOrUnblockUser(post?.owner?._id),
      className: user?.blockedUsers?.includes(post?.owner?._id)
        ? 'text-green-500 hover:bg-green-100 dark:hover:bg-green-900/30'
        : 'text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30',
    }
  ];

  const optionsToShow = isOwner ? ownerOptions : visitorOptions;

  return (
    <AnimatePresence>
      {showMenu && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, scale: 0.9, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -10 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'fixed',
            top: coords.top,
            left: coords.left,
            zIndex: 2000,
          }}
          className="w-60 rounded-xl bg-white dark:bg-[#1f1f1f] shadow-2xl border border-gray-200 dark:border-gray-700 backdrop-blur-md"
        >
          {optionsToShow.map((option, index) => (
            <div
              key={index}
              onClick={() => {
                option.action();
                setShowMenu(false);
              }}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer group rounded-xl transition duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                option.className || 'text-gray-800 dark:text-gray-100'
              }`}
            >
              <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:scale-110 transition">
                {option.icon}
              </div>
              <span className="text-sm font-medium">{option.text}</span>
            </div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PostMenu;
