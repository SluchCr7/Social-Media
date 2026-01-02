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
      className="flex justify-end relative group max-w-[85%] md:max-w-[70%]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex flex-col items-end gap-1">

        {/* Reply Indicator */}
        {message.replyTo && (
          <div className="mr-8 mb-1 flex items-center justify-end gap-2 opacity-50 text-[10px] text-white">
            <span className="bg-white/10 px-2 py-1 rounded max-w-[150px] truncate border-r-2 border-indigo-500/50">
              Replying to: {message.replyTo.text || 'Attachment'}
            </span>
            <BsArrowReturnLeft className="rotate-180" />
          </div>
        )}

        <div className="flex items-end gap-3">
          {/* Message Bubble */}
          <div className="relative">
            <div
              className={`
                        relative px-4 py-3 
                        bg-[#3f51b5] text-white
                        rounded-[1.2rem] rounded-tr-none px-4 py-3
                        shadow-[0_4px_15px_-5px_rgba(63,81,181,0.4)]
                        border border-white/5
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
                                        object-cover rounded-lg bg-black/20
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
              <div className="absolute -bottom-2 -left-2 bg-gradient-to-br from-pink-500 to-red-500 p-1 rounded-full shadow-lg border-2 border-[#121212]">
                <AiFillLike size={10} className="text-white" />
              </div>
            )}
          </div>
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 bg-white/5">
              <Image
                src={user?.profilePhoto?.url || '/default.jpg'}
                alt="Me"
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Metadata & Actions */}
        <div className="flex items-center gap-2 mr-12 mt-1">
          <span className="text-[9px] font-bold text-white/30 tracking-wider">
            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {isRead ? (
            <BsCheckAll size={14} className="text-indigo-400" />
          ) : (
            <BsCheck size={14} className="text-white/30" />
          )}

          {/* Action Menu - Desktop Hover */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-1 bg-[#2a2a2a] p-1 rounded-lg border border-white/5 shadow-xl ml-2"
              >
                <button onClick={() => toggleLikeMessage(message._id)} className="p-1.5 hover:bg-white/10 rounded-md text-white/60 hover:text-pink-500 transition-colors">
                  {isLiked ? <AiFillLike size={12} /> : <AiOutlineLike size={12} />}
                </button>
                <button onClick={() => setReplyingTo(message)} className="p-1.5 hover:bg-white/10 rounded-md text-white/60 hover:text-indigo-400 transition-colors">
                  <BsArrowReturnLeft size={12} />
                </button>
                <button onClick={() => copyMessageText(message.text || '')} className="p-1.5 hover:bg-white/10 rounded-md text-white/60 hover:text-white transition-colors">
                  <BsCopy size={12} />
                </button>
                <button onClick={() => deleteMessage(message._id)} className="p-1.5 hover:bg-white/10 rounded-md text-white/60 hover:text-red-500 transition-colors">
                  <MdDeleteForever size={12} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default SenderMessage;
