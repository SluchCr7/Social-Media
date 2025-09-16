// 'use client';
// import React, { useEffect, useRef, useState } from 'react';
// import { CiEdit, CiMapPin } from 'react-icons/ci';
// import { AiOutlineDelete } from 'react-icons/ai';
// import { MdOutlineReport } from 'react-icons/md';
// import { FaRegCommentDots } from 'react-icons/fa';
// import { MdContentCopy } from "react-icons/md";
// import { useAuth } from '../Context/AuthContext';
// import { usePost } from '../Context/PostContext';
// import { useReport } from '../Context/ReportContext';
// import { motion, AnimatePresence } from 'framer-motion';

// const PostMenu = ({ showMenu, setShowMenu, post }) => {
//   const { user, pinPost, users, blockOrUnblockUser } = useAuth();
//   const { deletePost, setPostIsEdit, setShowPostModelEdit, displayOrHideComments, copyPostLink } = usePost();
//   const { setIsPostId, setShowMenuReport } = useReport();

//   const menuRef = useRef();
//   const isOwner = post?.owner?._id === user?._id;
//   const [myUser, setMyUser] = useState(null);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (menuRef.current && !menuRef.current.contains(e.target)) {
//         setShowMenu(false);
//       }
//     };

//     if (showMenu) {
//       document.addEventListener('mousedown', handleClickOutside);
//     }
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [showMenu]);

//   useEffect(() => {
//     setMyUser(users.find((userobj) => userobj?._id === user?._id));
//   }, [users]);

//   const ownerOptions = [
//     {
//       icon: <CiMapPin size={18} />,
//       text: myUser?.pinsPosts?.some((p) => p?.id === post?._id) ? 'Unpin Post' : 'Pin Post',
//       action: () => pinPost(post?._id),
//     },
//     {
//       icon: <CiEdit size={18} />,
//       text: 'Edit Post',
//       action: () => {
//         setPostIsEdit(post);
//         setShowPostModelEdit(true);
//       },
//     },
//     {
//       icon: <AiOutlineDelete size={18} />,
//       text: 'Delete Post',
//       action: () => deletePost(post?._id),
//       className: 'text-red-800 hover:bg-red-100',
//     },
//     {
//       icon: <FaRegCommentDots size={18} />,
//       text: post?.isCommentOff ? 'Enable Comments' : 'Disable Comments',
//       action: () => displayOrHideComments(post?._id),
//       className: post?.isCommentOff
//         ? 'text-green-600 hover:bg-green-100'
//         : 'text-red-600 hover:bg-yellow-100',
//     },
//   ];

//   const visitorOptions = [
//     {
//       icon: <MdOutlineReport size={18} />,
//       text: 'Report Post',
//       action: () => {
//         setIsPostId(post?._id);
//         setShowMenuReport(true);
//       },
//       className: 'text-red-600 hover:bg-red-100',
//     },
//     {
//       icon: <MdContentCopy size={18} />,
//       text: 'Copy Link',
//       action: () => copyPostLink(post?._id),
//       className: 'text-blue-600 hover:bg-blue-100',
//     },
//     {
//       icon: <AiOutlineDelete size={18} />,
//       text: user?.blockedUsers?.includes(post?.owner?._id) ? 'Unblock User' : 'Block User',
//       action: () => blockOrUnblockUser(post?.owner?._id),
//       className: user?.blockedUsers?.includes(post?.owner?._id)
//         ? 'text-green-600 hover:bg-green-100'
//         : 'text-red-600 hover:bg-red-100',
//     }
//   ];

//   const optionsToShow = isOwner ? ownerOptions : visitorOptions;

//   return (
//     <AnimatePresence>
//       {showMenu && (
//         <motion.div
//           ref={menuRef}
//           initial={{ opacity: 0, scale: 0.95, y: -8 }}
//           animate={{ opacity: 1, scale: 1, y: 0 }}
//           exit={{ opacity: 0, scale: 0.95, y: -8 }}
//           transition={{ duration: 0.2 }}
//           className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 overflow-hidden"
//         >
//           <div className="flex flex-col">
//             {optionsToShow.map((option, index) => (
//               <button
//                 key={index}
//                 onClick={() => {
//                   option.action();
//                   setShowMenu(false);
//                 }}
//                 className={`flex items-center gap-3 px-4 py-2 text-sm font-medium text-left transition rounded-md ${option.className || 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
//               >
//                 {option.icon}
//                 <span>{option.text}</span>
//               </button>
//             ))}
//           </div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// export default PostMenu;

'use client';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { CiEdit, CiMapPin } from 'react-icons/ci';
import { AiOutlineDelete } from 'react-icons/ai';
import { MdOutlineReport } from 'react-icons/md';
import { FaRegCommentDots } from 'react-icons/fa';
import { MdContentCopy } from "react-icons/md";
import { useAuth } from '../Context/AuthContext';
import { usePost } from '../Context/PostContext';
import { useReport } from '../Context/ReportContext';
import { motion, AnimatePresence } from 'framer-motion';

// ✅ مكوّن منفصل لزر واحد داخل القائمة
const MenuOption = ({ icon, text, action, className }) => {
  return (
    <motion.button
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.97 }}
      onClick={action}
      className={`flex items-center gap-3 px-4 py-2 text-sm font-medium text-left transition rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${className || 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
      role="menuitem"
    >
      {icon}
      <span>{text}</span>
    </motion.button>
  );
};

const PostMenu = ({ showMenu, setShowMenu, post }) => {
  const { user, pinPost, users, blockOrUnblockUser } = useAuth();
  const { deletePost, setPostIsEdit, setShowPostModelEdit, displayOrHideComments, copyPostLink } = usePost();
  const { setIsPostId, setShowMenuReport } = useReport();

  const menuRef = useRef();
  const isOwner = post?.owner?._id === user?._id;
  const [myUser, setMyUser] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null); // ✅ لتخزين الأكشن الحساس (delete, block)

  // إغلاق القائمة لو ضغط براها
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  // جلب بيانات المستخدم الحالي
  useEffect(() => {
    setMyUser(users.find((userobj) => userobj?._id === user?._id));
  }, [users, user]);

  // ✅ خيارات المالك
  const ownerOptions = useMemo(() => [
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
      action: () => setConfirmAction(() => () => deletePost(post?._id)), // ✅ modal تأكيد
      className: 'text-red-800 hover:bg-red-100',
    },
    {
      icon: <FaRegCommentDots size={18} />,
      text: post?.isCommentOff ? 'Enable Comments' : 'Disable Comments',
      action: () => displayOrHideComments(post?._id),
      className: post?.isCommentOff
        ? 'text-green-600 hover:bg-green-100'
        : 'text-red-600 hover:bg-yellow-100',
    },
  ], [myUser, post]);

  // ✅ خيارات الزائر
  const visitorOptions = useMemo(() => [
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
      action: () => setConfirmAction(() => () => blockOrUnblockUser(post?.owner?._id)), // ✅ modal تأكيد
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
            className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 overflow-hidden"
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

      {/* ✅ Modal لتأكيد الأكشنات الحساسة */}
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
                Are you sure?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                This action cannot be undone.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setConfirmAction(null)}
                  className="px-4 py-2 rounded-lg border text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    confirmAction();
                    setConfirmAction(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                >
                  Confirm
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
