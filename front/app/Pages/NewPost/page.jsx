'use client'

import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { IoImage } from "react-icons/io5";
import { FiX } from "react-icons/fi";
import { usePost } from '../../Context/PostContext';
import { useCommunity } from '../../Context/CommunityContext';
import { useAuth } from '@/app/Context/AuthContext';

const NewPostPage = () => {
  const [postText, setPostText] = useState('');
  const [images, setImages] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState('');
  const {user} = useAuth()
  const { AddPost } = usePost();
  const { community } = useCommunity();

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
    const matches = text.match(/#[a-zA-Z][a-zA-Z0-9_]+/g);
    if (!matches) return [];
    return Array.from(new Set(matches.map(tag => tag.slice(1).toLowerCase())));
  };
  const handlePost = () => {
    const hashtags = extractHashtags(postText);
    console.log('Extracted Hashtags:', hashtags);
    AddPost(postText.replace(/#[\w\u0600-\u06FF]+/g, '').trim(), images, hashtags, selectedCommunity);
    setTimeout(() => {
      setPostText('');
      setImages([]);
      setSelectedCommunity('');
    }, 1000);
    window.location.href = "/"
  };
  useEffect(()=> console.log(postText) , [postText])
  useEffect(()=> console.log(selectedCommunity) , [selectedCommunity])
  return (
    <main className=" flex items-center justify-center w-full py-3 px-4">
      <div className="w-full bg-white dark:bg-darkMode-fg rounded-2xl shadow-2xl overflow-hidden relative transition-all duration-500">

        {/* Header */}
        <div className="flex items-center justify-between w-full gap-4 p-6 border-b border-gray-200 dark:border-gray-700">
          <div className='flex items-center gap-3'>
            <Image src={user?.profilePhoto?.url} alt="profile" width={48} height={48} className="rounded-full w-12 h-12 object-cover" />
            <div className="flex flex-col items-start">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{user?.username}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">{user?.profileName}</p>
            </div>
          </div>
          {/* Community Selector */}
          <div className="px-6">

            {community.filter(com => com?.members?.includes(user?._id)).length > 0 ? (
              <div className="relative">
                <select
                  value={selectedCommunity}
                  onChange={(e) => setSelectedCommunity(e.target.value)}
                  className="w-full appearance-none p-3 pl-4 pr-10 bg-white dark:bg-darkMode-bg border dark:border-gray-600 rounded-lg text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Choose a Community --</option>
                  {community
                    .filter(com => com?.members?.includes(user?._id))
                    .map((com) => (
                      <option key={com.id} value={com._id}>
                        {com.Name}
                      </option>
                    ))}
                </select>
                {/* Dropdown Icon */}
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500 dark:text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">You haven't joined any communities yet.</p>
            )}
          </div>
        </div>

        <textarea
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          rows={5}
          placeholder="What's on your mind? Include #hashtags..."
          className="w-full bg-gray-50 dark:bg-darkMode-bg p-4 text-sm text-black dark:text-white rounded-md resize-none shadow-inner border border-gray-200 dark:border-gray-600"
        />

        {/* Image Preview Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-4 p-6">
            {images.map((img, idx) => (
              <div key={idx} className="relative group">
                <img src={img.url} alt={`preview-${idx}`} className="w-full h-28 object-cover rounded-lg shadow-md" />
                <button
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                >
                  <FiX size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Footer: Upload + Post Button */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className='flex items-center gap-3'>
            <label className="cursor-pointer flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-500 transition">
              <IoImage size={20} />
              <span className="text-sm font-medium">Add Images</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
          <button
            onClick={handlePost}
            className={`px-6 py-2 text-sm font-semibold rounded-lg ${
              postText.trim()
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!postText.trim()}
          >
            Post
          </button>
        </div>
      </div>
    </main>
  );
};

export default NewPostPage;
