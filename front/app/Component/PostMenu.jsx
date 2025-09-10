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

const PostMenu = ({ showMenu, setShowMenu, post }) => {
  const { user, pinPost, users, blockOrUnblockUser } = useAuth();
  const { deletePost, setPostIsEdit, setShowPostModelEdit, displayOrHideComments, copyPostLink } = usePost();
  const { setIsPostId, setShowMenuReport } = useReport();

  const menuRef = useRef();
  const isOwner = post?.owner?._id === user?._id;
  const [myUser, setMyUser] = useState(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
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
      icon: <CiMapPin size={18} />,
      text: myUser?.pinsPosts?.some((p) => p?.id === post?._id) ? 'Unpin Post' : 'Pin Post',
      action: () => pinPost(post?._id),
    },
    {
      icon: <CiEdit size={18} />,
      text: 'Edit Post',
      action: () => {
        setPostIsEdit(post);
        setShowPostModelEdit(true);
      },
    },
    {
      icon: <AiOutlineDelete size={18} />,
      text: 'Delete Post',
      action: () => deletePost(post?._id),
      className: 'text-red-600 hover:bg-red-100',
    },
    {
      icon: <FaRegCommentDots size={18} />,
      text: post?.isCommentOff ? 'Enable Comments' : 'Disable Comments',
      action: () => displayOrHideComments(post?._id),
      className: post?.isCommentOff
        ? 'text-green-600 hover:bg-green-100'
        : 'text-yellow-600 hover:bg-yellow-100',
    },
  ];

  const visitorOptions = [
    {
      icon: <MdOutlineReport size={18} />,
      text: 'Report Post',
      action: () => {
        setIsPostId(post?._id);
        setShowMenuReport(true);
      },
      className: 'text-red-600 hover:bg-red-100',
    },
    {
      icon: <MdContentCopy size={18} />,
      text: 'Copy Link',
      action: () => copyPostLink(post?._id),
      className: 'text-blue-600 hover:bg-blue-100',
    },
    {
      icon: <AiOutlineDelete size={18} />,
      text: user?.blockedUsers?.includes(post?.owner?._id) ? 'Unblock User' : 'Block User',
      action: () => blockOrUnblockUser(post?.owner?._id),
      className: user?.blockedUsers?.includes(post?.owner?._id)
        ? 'text-green-600 hover:bg-green-100'
        : 'text-red-600 hover:bg-red-100',
    }
  ];

  const optionsToShow = isOwner ? ownerOptions : visitorOptions;

  return (
    <AnimatePresence>
      {showMenu && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, scale: 0.95, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -8 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 overflow-hidden"
        >
          <div className="flex flex-col">
            {optionsToShow.map((option, index) => (
              <button
                key={index}
                onClick={() => {
                  option.action();
                  setShowMenu(false);
                }}
                className={`flex items-center gap-3 px-4 py-2 text-sm font-medium text-left transition rounded-md ${option.className || 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              >
                {option.icon}
                <span>{option.text}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PostMenu;
