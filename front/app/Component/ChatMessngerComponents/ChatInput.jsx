'use client';
import React, { useState, useRef } from 'react';
import { IoIosSend } from 'react-icons/io';
import { IoImage, IoClose, IoMic, IoHappyOutline } from 'react-icons/io5';
import { useMessage } from '../../Context/MessageContext';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const ChatInput = () => {
  const { AddNewMessage, replyingTo, setReplyingTo } = useMessage();
  const [message, setMessage] = useState('');
  const [images, setImages] = useState([]);
  const fileInputRef = useRef();
  const [isFocused, setIsFocused] = useState(false);

  // 🖼️ تحميل الصور
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imagePreviews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...imagePreviews]);
  };

  // ❌ إزالة صورة من المعاينة
  const removeImage = (urlToRemove) => {
    setImages((prev) => prev.filter((img) => img.url !== urlToRemove));
  };

  // 🚀 إرسال الرسالة
  const handleSend = () => {
    if (!message.trim() && images.length === 0) return;

    AddNewMessage(
      message,
      images.map((img) => img.file),
      replyingTo // تمرير الرسالة الأصلية هنا
    );

    setMessage('');
    setImages([]);
    setReplyingTo(null); // بعد الإرسال، يتم إلغاء الرد
  };

  // ⌨️ إرسال بالإنتر
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`
      relative w-full
      bg-white dark:bg-white/[0.03] backdrop-blur-xl 
      border border-gray-200 dark:border-white/5 
      rounded-2xl transition-all duration-300
      ${isFocused ? 'ring-1 ring-indigo-500/30 bg-white dark:bg-black/40' : 'hover:bg-gray-50 dark:hover:bg-white/[0.05]'}
    `}>

      {/* 💬 شريط الرد (Reply Preview) - Floating on top */}
      <AnimatePresence>
        {replyingTo && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 10, height: 0 }}
            className="px-4 pt-4"
          >
            <div className="flex items-center justify-between bg-indigo-500/10 border-l-2 border-indigo-500 rounded p-2 mb-2">
              <div className="flex flex-col text-xs max-w-[85%]">
                <span className="font-bold text-indigo-400 mb-0.5">
                  Reply to {replyingTo.sender?.username || 'user'}
                </span>
                {replyingTo.text ? (
                  <p className="text-gray-600 dark:text-white/60 truncate">
                    {replyingTo.text}
                  </p>
                ) : replyingTo.Photos?.length > 0 ? (
                  <div className="flex items-center gap-1.5 text-gray-500 dark:text-white/50 italic">
                    <IoImage size={10} />
                    <span>Image attachment</span>
                  </div>
                ) : (
                  <p className="text-gray-400 dark:text-white/30 italic">No content</p>
                )}
              </div>
              <button
                onClick={() => setReplyingTo(null)}
                className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors text-gray-400 dark:text-white/60 hover:text-gray-900 dark:hover:text-white"
              >
                <IoClose size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      <div className="p-2 sm:p-3">
        {/* 🖼️ معاينة الصور */}
        {images.length > 0 && (
          <div className="flex overflow-x-auto gap-3 py-2 px-1 mb-2">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-gray-200 dark:border-white/10 group"
              >
                <Image
                  width={100}
                  height={100}
                  src={img.url}
                  alt={`upload-${idx}`}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
                <button
                  onClick={() => removeImage(img.url)}
                  className="absolute top-1 right-1 bg-black/60 text-white p-0.5 rounded-full hover:bg-red-500 transition-colors"
                >
                  <IoClose size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 📝 أدوات الإدخال */}
        <div className="flex items-end gap-2 text-gray-500 dark:text-white/60">

          {/* أدوات المرفقات */}
          <div className="flex items-center gap-1 pb-1">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current.click()}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 dark:text-white/40 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
              title="Add Image"
            >
              <IoImage size={20} />
            </button>
            <button
              className="hidden sm:block p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 dark:text-white/40 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
            >
              <IoHappyOutline size={20} />
            </button>
            <button
              className="hidden sm:block p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 dark:text-white/40 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
            >
              <IoMic size={20} />
            </button>
          </div>

          {/* مربع النص */}
          <div className="flex-1 min-h-[44px] bg-transparent flex items-center">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Type a message..."
              className="w-full bg-transparent border-none text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/20 text-sm font-medium focus:ring-0 px-2 py-2"
            />
          </div>

          {/* زر الإرسال */}
          <button
            onClick={handleSend}
            disabled={!message.trim() && images.length === 0}
            className={`
              p-2.5 rounded-xl transition-all duration-300
              ${(!message.trim() && images.length === 0)
                ? 'bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-white/20 cursor-not-allowed'
                : 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-500 active:scale-95'
              }
            `}
          >
            <IoIosSend size={18} className={message.trim() || images.length > 0 ? "ml-0.5" : ""} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
