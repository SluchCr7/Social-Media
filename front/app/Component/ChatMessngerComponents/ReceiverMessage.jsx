'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import { useMessage } from '../../Context/MessageContext';
import { AiOutlineLike, AiFillLike } from 'react-icons/ai';
import { BsCopy, BsTrash, BsArrowReturnLeft, BsReply } from 'react-icons/bs';
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
      className="flex justify-start relative group max-w-[85%] md:max-w-[70%]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex flex-col items-start gap-1">

        {/* Reply Indicator (If receiver is replying to someone) - Less common to track nicely without complex logic but good for consistency */}
        {message.replyTo && (
          <div className="ml-12 mb-1 flex items-center justify-start gap-2 opacity-50 text-[10px] text-white">
            <BsArrowReturnLeft className="rotate-180 -scale-x-100" />
            <span className="bg-white/10 px-2 py-1 rounded max-w-[150px] truncate border-l-2 border-white/30">
              Replying to: {message.replyTo.text || 'Attachment'}
            </span>
          </div>
        )}

        <div className="flex items-end gap-3 flex-row-reverse">
          {/* Message Bubble */}
          <div className="relative">
            <div
              className={`
                        relative px-4 py-3 
                        bg-[#1e1e1e] text-white/90
                        rounded-[1.2rem] rounded-tl-none 
                        border border-white/10
                    `}
            >
              {/* Images Grid */}
              {Array.isArray(message.Photos) && message.Photos.length > 0 && (
                <div className={`mb-2 gap-1.5 ${message.Photos.length > 1 ? 'grid grid-cols-2' : 'flex'}`}>
                  {message.Photos.map((img, index) => (
                    <Image
                      key={index}
                      src={img.url}
                      alt="attachment"
                      width={200}
                      height={200}
                      className={`
                                        object-cover rounded-lg bg-white/5
                                        ${message.Photos.length === 1 ? 'max-w-full max-h-[200px] w-auto h-auto' : 'w-full h-24'}
                                    `}
                    />
                  ))}
                </div>
              )}

              {/* Text */}
              {message.text && (
                <p className="text-[14px] leading-6 font-normal whitespace-pre-wrap">
                  {message.text}
                </p>
              )}
            </div>

            {/* Reaction Icon */}
            {isLiked && (
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-pink-500 to-red-500 p-1 rounded-full shadow-lg border-2 border-[#121212]">
                <AiFillLike size={10} className="text-white" />
              </div>
            )}
          </div>

          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 bg-white/5">
              <Image
                src={user?.profilePhoto?.url || '/default.jpg'}
                alt={user?.username}
                width={32}
                height={32}
                className="w-full h-full object-cover grayscale opacity-80"
              />
            </div>
          </div>
        </div>

        {/* Metadata & Actions */}
        <div className="flex items-center gap-2 ml-12 mt-1 flex-row-reverse self-start">
          <span className="text-[9px] font-bold text-white/20 tracking-wider">
            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>

          {/* Action Menu - Desktop Hover */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-1 bg-[#2a2a2a] p-1 rounded-lg border border-white/5 shadow-xl mr-2"
              >
                <button onClick={() => toggleLikeMessage(message._id)} className="p-1.5 hover:bg-white/10 rounded-md text-white/60 hover:text-pink-500 transition-colors">
                  {isLiked ? <AiFillLike size={12} /> : <AiOutlineLike size={12} />}
                </button>
                <button onClick={() => setReplyingTo(message)} className="p-1.5 hover:bg-white/10 rounded-md text-white/60 hover:text-indigo-400 transition-colors">
                  <BsReply size={14} />
                </button>
                <button onClick={() => copyMessageText(message.text || '')} className="p-1.5 hover:bg-white/10 rounded-md text-white/60 hover:text-white transition-colors">
                  <BsCopy size={12} />
                </button>
                <button onClick={() => deleteForMe(message._id)} className="p-1.5 hover:bg-white/10 rounded-md text-white/60 hover:text-amber-500 transition-colors">
                  <BsTrash size={12} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default ReceiverMessage;
