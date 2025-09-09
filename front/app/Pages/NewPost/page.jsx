'use client';

import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { IoImage, IoHappyOutline } from 'react-icons/io5';
import { FiX } from 'react-icons/fi';
import { usePost } from '../../Context/PostContext';
import { useCommunity } from '../../Context/CommunityContext';
import { useAuth } from '@/app/Context/AuthContext';
import EmojiPicker from 'emoji-picker-react';
import { FaUsers } from 'react-icons/fa';

const NewPost = () => {
  const [postText, setPostText] = useState('');
  const [images, setImages] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef();

  const { user } = useAuth();
  const { AddPost } = usePost();
  const { communities } = useCommunity();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map(file => ({
      file,
      url: URL.createObjectURL(file)
    }));
    setImages(prev => [...prev, ...previews]);
  };

  const removeImage = (index) => {
    setImages(prev => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const extractHashtags = (text) => {
    const matches = text.match(/#[\w\u0600-\u06FF]+/g);
    if (!matches) return [];
    return Array.from(new Set(matches.map(tag => tag.slice(1).toLowerCase())));
  };

  const handlePost = () => {
    const hashtags = extractHashtags(postText);
    AddPost(
      postText.replace(/#[\w\u0600-\u06FF]+/g, '').trim(),
      images,
      hashtags,
      selectedCommunity
    );
  };

  const handleEmojiClick = (emojiData) => {
    const cursorPos = textareaRef.current.selectionStart;
    const newText =
      postText.slice(0, cursorPos) + emojiData.emoji + postText.slice(cursorPos);
    setPostText(newText);
    setShowEmojiPicker(false);
    setTimeout(() => {
      textareaRef.current.focus();
      textareaRef.current.selectionEnd = cursorPos + emojiData.emoji.length;
    }, 0);
  };

  return (
    <main className="flex items-center justify-center w-full py-8 px-4">
      <div className="w-full max-w-2xl bg-white dark:bg-darkMode-fg rounded-3xl shadow-2xl overflow-hidden transition-all duration-500">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between w-full p-6 border-b border-gray-200 dark:border-gray-700 gap-4">
          <div className="flex items-center gap-4">
            <Image
              src={user?.profilePhoto?.url}
              alt="profile"
              width={56}
              height={56}
              className="rounded-full w-14 h-14 object-cover border-2 border-blue-500"
            />
            <div className="flex flex-col">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">{user?.username}</h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">{user?.profileName}</span>
            </div>
          </div>

          {/* Community Selector */}
          <div className="w-full md:w-64">
            {communities.filter(com => com?.members.some((m) => m._id === user._id)).length > 0 ? (
              <div className="relative">
                <FaUsers className="absolute left-3 top-3 text-gray-400" />
                <select
                  value={selectedCommunity}
                  onChange={(e) => setSelectedCommunity(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-darkMode-bg border dark:border-gray-600 rounded-md text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a Community</option>
                  {communities
                    .filter(com => com.members.some((m) => m._id === user._id))
                    .map((com) => (
                      <option key={com._id} value={com._id}>
                        {com.Name}
                      </option>
                    ))}
                </select>
              </div>
            ) : (
              <span className="text-sm text-gray-500 dark:text-gray-400">You haven’t joined any communities.</span>
            )}
          </div>
        </div>

        {/* Textarea */}
        <div className="relative p-6 pb-2">
          <textarea
            ref={textareaRef}
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            rows={5}
            placeholder="What's on your mind? Add #hashtags or 😊 emojis..."
            className="w-full bg-gray-50 dark:bg-darkMode-bg p-4 text-base text-black dark:text-white rounded-lg resize-none border border-gray-300 dark:border-gray-600 shadow-inner focus:ring-2 focus:ring-blue-500"
          />
          <div className="text-right text-xs text-gray-400 mt-1">{postText.length}/500</div>
        </div>

        {/* Images Preview */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 px-6 pb-4">
            {images.map((img, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={img.url}
                  alt={`preview-${idx}`}
                  className="w-full h-32 object-cover rounded-xl shadow-md group-hover:scale-105 transition-transform"
                />
                <button
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full shadow hover:bg-red-600 transition"
                >
                  <FiX size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex relative items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <label className="cursor-pointer flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-darkMode-bg hover:bg-blue-100 dark:hover:bg-blue-800 text-gray-700 dark:text-gray-300 transition">
              <IoImage size={20} />
              <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
            </label>
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-darkMode-bg hover:bg-yellow-100 dark:hover:bg-yellow-800 text-gray-600 dark:text-gray-300 transition"
            >
              <IoHappyOutline size={22} />
            </button>
            {showEmojiPicker && (
              <div className="absolute z-50 top-[-360px] left-6">
                <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" />
              </div>
            )}
          </div>

          <button
            onClick={handlePost}
            disabled={!postText.trim() && images.length === 0}
            className={`px-8 py-2 text-sm font-semibold rounded-full shadow-md transition-all ${
              postText.trim() || images.length > 0
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Post
          </button>
        </div>
      </div>
    </main>
  );
};

export default NewPost;
