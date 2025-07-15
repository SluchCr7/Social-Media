'use client';
import React, { useState, useRef } from 'react';
import { IoIosSend } from 'react-icons/io';
import { IoImage, IoClose, IoMic, IoHappyOutline } from 'react-icons/io5';
import { useMessage } from '../Context/MessageContext';

const ChatInput = () => {
  const { AddNewMessage, backgroundStyle } = useMessage();
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

  return (
    <div className="w-full px-3 py-3 border-t border-gray-300 dark:border-gray-700 bg-white dark:bg-darkMode-bg" style={backgroundStyle}>
      {/* Images Preview */}
      {images.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-3">
          {images.map((img, idx) => (
            <div key={idx} className="relative w-20 h-20 rounded-md overflow-hidden shadow-md">
              <img
                src={img.url}
                alt={`upload-${idx}`}
                className="w-full h-full object-cover"
              />
              <IoClose
                onClick={() => removeImage(img.url)}
                className="absolute top-1 right-1 bg-white dark:bg-black bg-opacity-70 text-red-600 text-xl rounded-full cursor-pointer"
              />
            </div>
          ))}
        </div>
      )}

      {/* Input Section */}
      <div className="flex items-center gap-2 w-full">
        <button
          onClick={() => fileInputRef.current.click()}
          className="text-xl  transition"
          title="Upload Image"
        >
          <IoImage />
        </button>

        {/* Emojis (placeholder) */}
        <button
          className="text-xl  transition"
          title="Insert Emoji"
        >
          <IoHappyOutline />
        </button>
        {/* text-gray-600 dark:text-gray-300 hover:text-red-500 */}
        {/* Voice Recorder (placeholder) */}
        <button
          className="text-xl  transition"
          title="Record Voice"
        >
          <IoMic />
        </button>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          ref={fileInputRef}
          className="hidden"
        />

        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 rounded-full bg-gray-100 dark:bg-darkMode-fg text-black dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <button
          onClick={handleSend}
          className="text-xl text-green-600 hover:text-green-500 transition"
          title="Send Message"
        >
          <IoIosSend />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
