// 'use client';
// import Image from 'next/image';
// import React, { useState } from 'react';
// import { useMessage } from '../Context/MessageContext';
// import { BsCheck, BsCheckAll, BsTrash, BsCopy } from 'react-icons/bs';
// import { AiOutlineLike, AiFillLike } from 'react-icons/ai';
// import { MdDeleteForever } from 'react-icons/md';
// import { motion } from 'framer-motion';

// const SenderMessage = ({ message, user }) => {
//   const {
//     toggleLikeMessage,
//     deleteMessage,
//     deleteForMe,
//     copyMessageText
//   } = useMessage();

//   const isRead = message.isRead;
//   const isLiked = message.likes?.includes(user?._id);
//   const [hovered, setHovered] = useState(false);

//   return (
//     <div
//       className="flex justify-end px-4 py-2 relative group"
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//     >
//       <div className="flex max-w-[85%] gap-2 items-end relative">
//         {/* رسالة */}
//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.2 }}
//           className="flex flex-col items-end text-right relative"
//         >
//           <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white px-4 py-2 rounded-2xl rounded-br-sm shadow-md relative overflow-hidden">
//             {/* الصور */}
//             {Array.isArray(message.Photos) && message.Photos.length > 0 && (
//               <div
//                 className={`${
//                   message.Photos.length > 2
//                     ? 'grid grid-cols-2 gap-2 mb-2'
//                     : 'flex flex-wrap gap-2 mb-2'
//                 }`}
//               >
//                 {message.Photos.map((img, index) => (
//                   <motion.div
//                     key={index}
//                     whileHover={{ scale: 1.05 }}
//                     className="overflow-hidden rounded-xl"
//                   >
//                     <Image
//                       src={img.url}
//                       alt={`image_message_${index}`}
//                       width={200}
//                       height={200}
//                       className="rounded-xl object-cover max-w-[150px] md:max-w-[250px]"
//                     />
//                   </motion.div>
//                 ))}
//               </div>
//             )}

//             {/* النص */}
//             {message.text && (
//               <p className="text-[15px] leading-relaxed break-words whitespace-pre-wrap">
//                 {message.text}
//               </p>
//             )}
//           </div>

//           {/* التوقيت + حالة القراءة */}
//           <div className="flex items-center gap-1 mt-1 text-[11px] text-gray-400 opacity-70">
//             <span>
//               {new Date(message.createdAt).toLocaleTimeString([], {
//                 hour: '2-digit',
//                 minute: '2-digit',
//               })}
//             </span>
//             {isRead ? (
//               <BsCheckAll className="text-blue-500" title="Seen" />
//             ) : (
//               <BsCheck className="text-gray-400" title="Sent" />
//             )}
//           </div>

//           {/* قائمة الأكشن عند التمرير */}
//           {hovered && (
//             <motion.div
//               initial={{ opacity: 0, y: 5 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0 }}
//               className="absolute -top-8 right-0 flex gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md px-2 py-1 rounded-xl shadow-md z-10"
//             >
//               {/* Like */}
//               <button
//                 onClick={() => toggleLikeMessage(message._id)}
//                 className={`p-1 rounded-full transition ${
//                   isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
//                 }`}
//                 title={isLiked ? 'Unlike' : 'Like'}
//               >
//                 {isLiked ? <AiFillLike size={18} /> : <AiOutlineLike size={18} />}
//               </button>

//               {/* Copy */}
//               {message.text && (
//                 <button
//                   onClick={() => copyMessageText(message.text)}
//                   className="p-1 rounded-full text-gray-500 hover:text-blue-500 transition"
//                   title="Copy text"
//                 >
//                   <BsCopy size={16} />
//                 </button>
//               )}

//               {/* Delete for me */}
//               <button
//                 onClick={() => deleteForMe(message._id)}
//                 className="p-1 rounded-full text-gray-500 hover:text-yellow-500 transition"
//                 title="Remove for me"
//               >
//                 <BsTrash size={16} />
//               </button>

//               {/* Delete for everyone */}
//               <button
//                 onClick={() => deleteMessage(message._id)}
//                 className="p-1 rounded-full text-gray-500 hover:text-red-600 transition"
//                 title="Delete for everyone"
//               >
//                 <MdDeleteForever size={18} />
//               </button>
//             </motion.div>
//           )}
//         </motion.div>

//         {/* صورة البروفايل */}
//         <Image
//           src={user?.profilePhoto?.url || '/default.jpg'}
//           alt="Sender"
//           width={32}
//           height={32}
//           className="rounded-full object-cover w-8 h-8 border border-gray-300 dark:border-gray-700"
//         />
//       </div>
//     </div>
//   );
// };

// export default SenderMessage;

'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import { useMessage } from '../../Context/MessageContext';
import { BsCheck, BsCheckAll, BsTrash, BsCopy, BsArrowReturnLeft } from 'react-icons/bs';
import { AiOutlineLike, AiFillLike } from 'react-icons/ai';
import { MdDeleteForever } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';

const SenderMessage = ({ message, user }) => {
  const {
    toggleLikeMessage,
    deleteMessage,
    deleteForMe,
    copyMessageText,
    replyingTo,
    setReplyingTo,
  } = useMessage();

  const isRead = message.isRead;
  const isLiked = message.likes?.includes(user?._id);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="flex justify-end px-4 py-2 relative group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex max-w-[85%] gap-2 items-end relative">
        {/* الرسالة */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col items-end text-right relative"
        >
          {/* ✅ جزء الرد إن وُجد */}
          {message.replyTo && (
            <div className="border-r-4 border-blue-400 pr-3 mb-2 text-sm text-gray-100 dark:text-gray-200 bg-blue-600/20 dark:bg-blue-800/30 rounded-lg p-2 max-w-[250px] self-end">
              {message.replyTo.text ? (
                <p className="line-clamp-2 italic opacity-90">
                  Replying to: {message.replyTo.text}
                </p>
              ) : message.replyTo.Photos?.length > 0 ? (
                <div className="flex items-center justify-end gap-2">
                  <span className="italic text-xs opacity-80">Photo message</span>
                  <Image
                    src={message.replyTo.Photos[0].url}
                    alt="reply_preview"
                    width={40}
                    height={40}
                    className="rounded-md object-cover"
                  />
                </div>
              ) : null}
            </div>
          )}

          {/* محتوى الرسالة */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white px-4 py-2 rounded-2xl rounded-br-sm shadow-md relative overflow-hidden">
            {/* الصور */}
            {Array.isArray(message.Photos) && message.Photos.length > 0 && (
              <div
                className={`${
                  message.Photos.length > 2
                    ? 'grid grid-cols-2 gap-2 mb-2'
                    : 'flex flex-wrap gap-2 mb-2'
                }`}
              >
                {message.Photos.map((img, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="overflow-hidden rounded-xl"
                  >
                    <Image
                      src={img.url}
                      alt={`image_message_${index}`}
                      width={200}
                      height={200}
                      className="rounded-xl object-cover max-w-[150px] md:max-w-[250px]"
                    />
                  </motion.div>
                ))}
              </div>
            )}

            {/* النص */}
            {message.text && (
              <p className="text-[15px] leading-relaxed break-words whitespace-pre-wrap">
                {message.text}
              </p>
            )}
          </div>

          {/* الوقت + حالة القراءة */}
          <div className="flex items-center gap-1 mt-1 text-[11px] text-gray-400 opacity-70">
            <span>
              {new Date(message.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
            {isRead ? (
              <BsCheckAll className="text-blue-500" title="Seen" />
            ) : (
              <BsCheck className="text-gray-400" title="Sent" />
            )}
          </div>

          {/* قائمة الأكشن عند التمرير */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute -top-8 right-0 flex gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md px-2 py-1 rounded-xl shadow-md z-10"
              >
                {/* Like */}
                <button
                  onClick={() => toggleLikeMessage(message._id)}
                  className={`p-1 rounded-full transition ${
                    isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                  }`}
                  title={isLiked ? 'Unlike' : 'Like'}
                >
                  {isLiked ? <AiFillLike size={18} /> : <AiOutlineLike size={18} />}
                </button>

                {/* Reply */}
                <button
                  onClick={() =>
                    replyingTo && replyingTo._id === message._id
                      ? setReplyingTo(false)
                      : setReplyingTo(message)
                  }
                  className={`p-1 rounded-full text-gray-500 hover:text-blue-500 transition ${
                    replyingTo && replyingTo._id === message._id ? 'text-blue-600' : ''
                  }`}
                  title="Reply"
                >
                  <BsArrowReturnLeft size={16} />
                </button>

                {/* Copy */}
                {message.text && (
                  <button
                    onClick={() => copyMessageText(message.text)}
                    className="p-1 rounded-full text-gray-500 hover:text-blue-500 transition"
                    title="Copy text"
                  >
                    <BsCopy size={16} />
                  </button>
                )}

                {/* Delete for me */}
                <button
                  onClick={() => deleteForMe(message._id)}
                  className="p-1 rounded-full text-gray-500 hover:text-yellow-500 transition"
                  title="Remove for me"
                >
                  <BsTrash size={16} />
                </button>

                {/* Delete for everyone */}
                <button
                  onClick={() => deleteMessage(message._id)}
                  className="p-1 rounded-full text-gray-500 hover:text-red-600 transition"
                  title="Delete for everyone"
                >
                  <MdDeleteForever size={18} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* صورة البروفايل */}
        <Image
          src={user?.profilePhoto?.url || '/default.jpg'}
          alt="Sender"
          width={32}
          height={32}
          className="rounded-full object-cover w-8 h-8 border border-gray-300 dark:border-gray-700"
        />
      </div>
    </div>
  );
};

export default SenderMessage;
