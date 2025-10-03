'use client';
import React, { useState, useRef } from 'react';
import { IoIosSend } from 'react-icons/io';
import { IoImage, IoClose, IoMic, IoHappyOutline } from 'react-icons/io5';
import { useMessage } from '../../Context/MessageContext';

const ChatInput = () => {
  const { AddNewMessage } = useMessage();
  const [message, setMessage] = useState('');
  const [images, setImages] = useState([]);
  const fileInputRef = useRef();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imagePreviews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...imagePreviews]);
  };

  const removeImage = (urlToRemove) => {
    setImages((prev) => prev.filter((img) => img.url !== urlToRemove));
  };

  const handleSend = () => {
    if (!message.trim() && images.length === 0) return;
    AddNewMessage(message, images.map((img) => img.file));
    setMessage('');
    setImages([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full px-2 sm:px-4 py-2 sm:py-3 bg-white dark:bg-darkMode-bg border-t border-gray-200 dark:border-gray-700 sticky bottom-0">
      {/* Images Preview */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-2 sm:mb-3">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden shadow border border-gray-200 dark:border-gray-600"
            >
              <img
                src={img.url}
                alt={`upload-${idx}`}
                className="w-full h-full object-cover hover:scale-105 transition"
              />
              <IoClose
                onClick={() => removeImage(img.url)}
                className="absolute top-1 right-1 bg-white dark:bg-black bg-opacity-70 text-red-600 text-lg sm:text-xl rounded-full cursor-pointer"
              />
            </div>
          ))}
        </div>
      )}

      {/* Input Section */}
      <div className="flex items-center gap-1 sm:gap-2 w-full">
        {/* Upload */}
        <button
          onClick={() => fileInputRef.current.click()}
          className="p-2 sm:p-2.5 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 transition"
          title="Upload Image"
        >
          <IoImage className="text-lg sm:text-xl text-blue-500" />
        </button>

        {/* Emoji */}
        <button
          className="p-2 sm:p-2.5 rounded-full hover:bg-yellow-100 dark:hover:bg-yellow-900 transition"
          title="Insert Emoji"
        >
          <IoHappyOutline className="text-lg sm:text-xl text-yellow-500" />
        </button>

        {/* Mic */}
        <button
          className="p-2 sm:p-2.5 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900 transition"
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

        {/* Message Input */}
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="flex-1 px-3 sm:px-4 py-2 rounded-xl bg-gray-50 dark:bg-darkMode-menu text-black dark:text-white text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm"
        />

        {/* Send */}
        <button
          onClick={handleSend}
          className="p-2 sm:p-3 bg-green-500 text-white rounded-full hover:bg-green-600 active:scale-95 transition"
          title="Send Message"
        >
          <IoIosSend className="text-lg sm:text-xl" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
