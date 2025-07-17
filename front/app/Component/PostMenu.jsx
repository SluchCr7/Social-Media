'use client';
import React, { useEffect, useRef, useState } from 'react';
import { CiEdit, CiMapPin } from 'react-icons/ci';
import { AiOutlineDelete } from 'react-icons/ai';
import { MdOutlineReport } from 'react-icons/md';
import { useAuth } from '../Context/AuthContext';
import { usePost } from '../Context/PostContext';
import { useReport } from '../Context/ReportContext';
import { FaRegCommentDots } from 'react-icons/fa';
import { MdContentCopy } from "react-icons/md";

const PostMenu = ({ showMenu, setShowMenu, post }) => {
  const { user, pinPost, users , blockOrUnblockUser} = useAuth();
  const { deletePost, setPostIsEdit, setShowPostModelEdit, displayOrHideComments  , copyPostLink} = usePost();
  const { setIsPostId , showMenuReport, setShowMenuReport } = useReport();

  const menuRef = useRef();
  const isOwner = post?.owner?._id === user?._id;
  const [myUser, setMyUser] = useState(null);

  // إغلاق القائمة عند النقر خارجها
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
    setMyUser(users.find((userobj) => userobj._id === user._id));
  }, [users]);

  const ownerOptions = [
    {
      icon: <CiMapPin size={20} />,
      text: myUser?.pinsPosts?.some((p) => p.id === post._id) ? 'Unpin Post' : 'Pin Post',
      action: () => pinPost(post._id),
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
      action: () => deletePost(post._id),
      className: 'text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30',
    },
    {
      icon: <FaRegCommentDots size={20} />,
      text: post?.isCommentOff ? 'Enable Comments' : 'Disable Comments',
      action: () => displayOrHideComments(post._id),
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
        setIsPostId(post._id);
        setShowMenuReport(true);
      },
      className: 'text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30',
    },
    {
      icon: <MdContentCopy size={20} />, 
      text: 'Copy Link',
      action: () => copyPostLink(post._id),
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
    <div
      ref={menuRef}
      className={`${
        showMenu ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
      } absolute top-12 right-2 z-[2000] transition-all duration-200 origin-top-right w-60 rounded-xl bg-white dark:bg-[#1f1f1f] shadow-xl border border-gray-200 dark:border-gray-700`}
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
    </div>
  );
};

export default PostMenu;
