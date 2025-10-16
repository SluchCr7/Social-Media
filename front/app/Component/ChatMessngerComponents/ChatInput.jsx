'use client';
import React, { useState, useRef } from 'react';
import { IoIosSend } from 'react-icons/io';
import { IoImage, IoClose, IoMic, IoHappyOutline } from 'react-icons/io5';
import { useMessage } from '../../Context/MessageContext';

const ChatInput = () => {
  const { AddNewMessage, replyingTo, setReplyingTo } = useMessage();
  const [message, setMessage] = useState('');
  const [images, setImages] = useState([]);
  const fileInputRef = useRef();

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
    <div
      className="w-full px-2 sm:px-3 py-2 sm:py-3 bg-white dark:bg-darkMode-bg 
                 border-t border-gray-200 dark:border-gray-700 sticky bottom-0
                 flex flex-col"
    >

      {/* 💬 شريط الرد (Reply Preview) */}
      {replyingTo && (
        <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/40 border-l-4 border-blue-500 px-3 py-2 mb-2 rounded-md relative">
          <div className="flex flex-col text-sm max-w-[80%]">
            <span className="font-semibold text-blue-700 dark:text-blue-300">
              Replying to {replyingTo.sender?.username || 'user'}
            </span>
            {replyingTo.text ? (
              <p className="text-gray-700 dark:text-gray-300 truncate">
                {replyingTo.text}
              </p>
            ) : replyingTo.Photos?.length > 0 ? (
              <img
                src={replyingTo.Photos[0].url}
                alt="reply_img"
                className="w-16 h-16 rounded-md object-cover mt-1"
              />
            ) : (
              <p className="text-gray-400 italic">No content</p>
            )}
          </div>
          <IoClose
            onClick={() => setReplyingTo(null)}
            className="text-gray-500 hover:text-red-500 text-lg cursor-pointer"
            title="Cancel reply"
          />
        </div>
      )}

      {/* 🖼️ معاينة الصور */}
      {images.length > 0 && (
        <div className="flex overflow-x-auto gap-2 mb-2 sm:mb-3 pb-1">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 
                         rounded-lg overflow-hidden shadow border border-gray-200 dark:border-gray-600"
            >
              <img
                src={img.url}
                alt={`upload-${idx}`}
                className="w-full h-full object-cover hover:scale-105 transition"
              />
              <IoClose
                onClick={() => removeImage(img.url)}
                className="absolute top-1 right-1 bg-white dark:bg-black/70 
                           text-red-600 text-lg sm:text-xl rounded-full cursor-pointer"
              />
            </div>
          ))}
        </div>
      )}

      {/* 📝 إدخال النصوص والأزرار */}
      <div className="flex items-center gap-1 sm:gap-2 w-full">
        {/* 📁 رفع صورة */}
        <button
          onClick={() => fileInputRef.current.click()}
          className="flex-shrink-0 p-2 sm:p-2.5 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 transition"
          title="Upload Image"
        >
          <IoImage className="text-lg sm:text-xl text-blue-500" />
        </button>

        {/* 😀 إيموجي */}
        <button
          className="flex-shrink-0 p-2 sm:p-2.5 rounded-full hover:bg-yellow-100 dark:hover:bg-yellow-900 transition"
          title="Insert Emoji"
        >
          <IoHappyOutline className="text-lg sm:text-xl text-yellow-500" />
        </button>

        {/* 🎤 تسجيل صوتي */}
        <button
          className="hidden xs:flex sm:flex-shrink-0 p-2 sm:p-2.5 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900 transition"
          title="Record Voice"
        >
          <IoMic className="text-lg sm:text-xl text-purple-500" />
        </button>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          ref={fileInputRef}
          className="hidden"
        />

        {/* 🧾 مربع الإدخال */}
        <div className="flex-1 flex items-center bg-gray-50 dark:bg-darkMode-menu rounded-full shadow-sm px-2 sm:px-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 bg-transparent py-2 text-sm sm:text-base 
                       text-black dark:text-white focus:outline-none"
          />
        </div>

        {/* 📤 إرسال */}
        <button
          onClick={handleSend}
          className="flex-shrink-0 p-2 sm:p-3 bg-green-500 text-white 
                     rounded-full hover:bg-green-600 active:scale-95 transition"
          title="Send Message"
        >
          <IoIosSend className="text-lg sm:text-xl" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
