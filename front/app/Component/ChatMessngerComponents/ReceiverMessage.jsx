// 'use client';
// import Image from 'next/image';
// import React, { useState } from 'react';
// import { useMessage } from '../Context/MessageContext';
// import { AiOutlineLike, AiFillLike } from 'react-icons/ai';
// import { BsCopy, BsTrash } from 'react-icons/bs';
// import { motion } from 'framer-motion';

// const ReceiverMessage = ({ message, user }) => {
//   const { toggleLikeMessage, copyMessageText, deleteForMe,replyingTo, setReplyingTo } = useMessage();
//   const isLiked = message.likes?.includes(user?._id);
//   const [hovered, setHovered] = useState(false);

//   return (
//     <div
//       className="flex justify-start px-4 py-2 group relative"
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//     >
//       <div className="flex max-w-[85%] gap-2 items-end">
//         {/* صورة المستلم */}
//         <Image
//           src={user?.profilePhoto?.url || '/default.jpg'}
//           alt="Receiver"
//           width={32}
//           height={32}
//           className="rounded-full w-8 h-8 object-cover border border-gray-300 dark:border-gray-700"
//         />

//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.2 }}
//           className="flex flex-col items-start text-left relative"
//         >
//           <div className="bg-gray-200 dark:bg-gray-800 text-black dark:text-white px-4 py-2 rounded-2xl rounded-bl-sm shadow-md relative">
//             {/* صور الرسالة */}
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

//             {/* نص الرسالة */}
//             {message.text && (
//               <p className="text-[15px] leading-relaxed break-words whitespace-pre-wrap">
//                 {message.text}
//               </p>
//             )}
//           </div>

//           {/* الوقت */}
//           <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 ml-1 opacity-70">
//             {new Date(message.createdAt).toLocaleTimeString([], {
//               hour: '2-digit',
//               minute: '2-digit',
//             })}
//           </span>

//           {/* أدوات الأكشن */}
//           {hovered && (
//             <motion.div
//               initial={{ opacity: 0, y: 5 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0 }}
//               className="absolute -top-8 left-0 flex gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md px-2 py-1 rounded-xl shadow-md z-10"
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
//               <button
//                 onClick={() => setReplyingTo(message)}
//                 className="text-gray-500 hover:text-blue-500 text-sm"
//               >
//                 Reply
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
//             </motion.div>
//           )}
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default ReceiverMessage;

'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import { useMessage } from '../../Context/MessageContext';
import { AiOutlineLike, AiFillLike } from 'react-icons/ai';
import { BsCopy, BsTrash, BsArrowReturnLeft } from 'react-icons/bs';
import { motion, AnimatePresence } from 'framer-motion';

const ReceiverMessage = ({ message, user }) => {
  const {
    toggleLikeMessage,
    copyMessageText,
    deleteForMe,
    replyingTo,
    setReplyingTo,
  } = useMessage();

  const isLiked = message.likes?.includes(user?._id);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="flex justify-start px-4 py-2 group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex max-w-[85%] gap-2 items-end">
        {/* صورة المستلم */}
        <Image
          src={user?.profilePhoto?.url || '/default.jpg'}
          alt="Receiver"
          width={32}
          height={32}
          className="rounded-full w-8 h-8 object-cover border border-gray-300 dark:border-gray-700"
        />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col items-start text-left relative"
        >
          {/* ✅ جزء الرد داخل الرسالة */}
          {message.replyTo && (
            <div className="border-l-4 border-blue-500 pl-3 mb-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100/70 dark:bg-gray-700/40 rounded-lg p-2 max-w-[250px]">
              {message.replyTo.text ? (
                <p className="line-clamp-2 italic opacity-90">
                  Replying to: {message.replyTo.text}
                </p>
              ) : message.replyTo.Photos?.length > 0 ? (
                <div className="flex items-center gap-2">
                  <Image
                    src={message.replyTo.Photos[0].url}
                    alt="reply_preview"
                    width={40}
                    height={40}
                    className="rounded-md object-cover"
                  />
                  <span className="italic text-xs opacity-80">Photo message</span>
                </div>
              ) : null}
            </div>
          )}

          {/* الرسالة الفعلية */}
          <div className="bg-gray-200 dark:bg-gray-800 text-black dark:text-white px-4 py-2 rounded-2xl rounded-bl-sm shadow-md relative">
            {/* صور الرسالة */}
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

            {/* نص الرسالة */}
            {message.text && (
              <p className="text-[15px] leading-relaxed break-words whitespace-pre-wrap">
                {message.text}
              </p>
            )}
          </div>

          {/* الوقت */}
          <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 ml-1 opacity-70">
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>

          {/* أدوات الأكشن */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute -top-8 left-0 flex gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md px-2 py-1 rounded-xl shadow-md z-10"
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
                      ? setReplyingTo(null) // ✅ إغلاق الرد إن كان نفس الرسالة
                      : setReplyingTo(message) // ✅ فتح الرد
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
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default ReceiverMessage;

