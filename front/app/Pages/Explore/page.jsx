'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { FiSearch, FiX, FiUserPlus } from 'react-icons/fi';
import { useAuth } from '../../Context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useNews } from '@/app/Context/NewsContext';
import { usePost } from '@/app/Context/PostContext';
import { filterHashtags } from '@/app/utils/filterHashtags';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';

const tabs = ['Hashtags', 'News', 'Suggested'];

const Search = () => {
  const { users, user } = useAuth();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('Hashtags');
  const { news } = useNews();
  const { posts } = usePost();

  // Collect all hashtags from posts
  const hashtagCount = {};
  filterHashtags(posts, hashtagCount);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      if (!search.trim()) {
        setFilteredUsers([]);
        return;
      }
      if (Array.isArray(users)) {
        const filtered = users.filter(
          (u) =>
            u.username.toLowerCase().includes(search.toLowerCase()) ||
            (u.profileName &&
              u.profileName.toLowerCase().includes(search.toLowerCase()))
        );
        setFilteredUsers(filtered);
      }
    }, 200);

    return () => clearTimeout(handler);
  }, [search, users]);

  // Suggested Users
  const suggestedUsers = useMemo(() => {
    if (!Array.isArray(users)) return [];
    return users
      .filter((u) => u._id !== user._id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 8);
  }, [users, user]);

  const carouselResponsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 1024 }, items: 4 },
    desktop: { breakpoint: { max: 1024, min: 768 }, items: 3 },
    tablet: { breakpoint: { max: 768, min: 464 }, items: 2 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
  };

  const topHashtags = Object.entries(hashtagCount).sort((a, b) => b[1] - a[1]);

  return (
    <div className="w-full min-h-screen px-4 sm:px-8 py-8 
      bg-lightMode-bg dark:bg-darkMode-bg 
      text-lightMode-text dark:text-darkMode-text transition">

      {/* Header */}
      <div className="text-center mb-8">
        <motion.h2
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="text-4xl font-extrabold 
            text-lightMode-fg dark:text-darkMode-fg"
        >
          🔍 Explore
        </motion.h2>
        <p className="mt-2 text-lightMode-text2 dark:text-darkMode-text2">
          Discover friends, creators, trending topics and news.
        </p>
      </div>

      {/* Search Box */}
      <div className="relative max-w-2xl mx-auto mb-6">
        <input
          type="search"
          placeholder="Search by username or name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full py-3 pl-12 pr-12 rounded-2xl 
            bg-lightMode-menu dark:bg-darkMode-menu
            text-lightMode-text dark:text-darkMode-text 
            placeholder-lightMode-text2 dark:placeholder-darkMode-text2
            focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-600 
            focus:outline-none shadow-md transition"
        />
        <FiSearch
          className={`absolute left-4 top-1/2 -translate-y-1/2 ${
            search ? 'text-indigo-500' : 'text-lightMode-text2 dark:text-darkMode-text2'
          }`}
          size={20}
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 
              bg-lightMode-menu dark:bg-darkMode-menu 
              p-1.5 rounded-full hover:opacity-80 transition"
          >
            <FiX size={16} className="text-lightMode-text2 dark:text-darkMode-text2" />
          </button>
        )}
      </div>

      {/* Search Results */}
      {search.trim() && (
        <motion.div
          key="autocomplete-results"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
          className="max-w-2xl mx-auto space-y-2 
            bg-lightMode-menu dark:bg-darkMode-menu 
            rounded-xl shadow-md p-2 mb-6"
        >
          {filteredUsers.length > 0 ? (
            filteredUsers
              .filter((u) => u._id !== user._id)
              .map((u) => (
                <Link
                  key={u._id}
                  href={`/Pages/User/${u._id}`}
                  className="flex items-center gap-3 p-2 rounded-lg 
                    hover:bg-lightMode-bg dark:hover:bg-darkMode-bg transition"
                >
                  <div className="w-10 h-10 relative">
                    <div className="w-full h-full rounded-full 
                      bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[1px]">
                      <Image
                        src={u.profilePhoto?.url || '/default-avatar.png'}
                        alt="profile"
                        width={40}
                        height={40}
                        className="rounded-full object-cover w-10 h-10"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold 
                      text-lightMode-text dark:text-darkMode-text">
                      {u.username}
                    </span>
                    <span className="text-xs text-lightMode-text2 dark:text-darkMode-text2 truncate">
                      {u.profileName || 'No bio'}
                    </span>
                  </div>
                </Link>
              ))
          ) : (
            <p className="text-center text-lightMode-text2 dark:text-darkMode-text2 py-4">
              No users found for <span className="font-medium text-indigo-600 dark:text-indigo-400">{search}</span>
            </p>
          )}
        </motion.div>
      )}

      {/* Tabs */}
      <div className="max-w-3xl mx-auto flex justify-center gap-4 mb-6 relative">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full font-semibold transition
              ${activeTab === tab
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-lightMode-menu dark:bg-darkMode-menu text-lightMode-text2 dark:text-darkMode-text2 hover:opacity-80'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="max-w-3xl mx-auto space-y-4">
        <AnimatePresence mode="wait">
          {/* Hashtags */}
          {activeTab === 'Hashtags' && (
            <motion.div
              key="hashtags"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-3"
            >
              {topHashtags.map(([tag, count], index) => {
                const isTrendingUp = index % 2 === 0;
                return (
                  <Link
                    key={tag}
                    href={`/Pages/Hashtag/${encodeURIComponent(tag)}`}
                    className="flex justify-between items-center p-3 rounded-xl 
                      bg-lightMode-menu dark:bg-darkMode-menu 
                      hover:opacity-80 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm sm:text-base 
                        text-lightMode-text dark:text-darkMode-text">
                        #{tag}
                      </span>
                      <span className="text-xs text-lightMode-text2 dark:text-darkMode-text2">
                        {count} posts
                      </span>
                    </div>
                    <div className={`flex items-center justify-center w-6 h-6 rounded-full ${
                      isTrendingUp ? 'bg-green-100 dark:bg-green-800' : 'bg-red-100 dark:bg-red-800'
                    }`}>
                      {isTrendingUp ? (
                        <FaArrowUp className="text-green-600 dark:text-green-400 text-sm" />
                      ) : (
                        <FaArrowDown className="text-red-600 dark:text-red-400 text-sm" />
                      )}
                    </div>
                  </Link>
                );
              })}
            </motion.div>
          )}

          {/* News */}
          {activeTab === 'News' && (
            <motion.div
              key="news"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-3"
            >
              {news.map((item, index) => (
                <Link
                  key={index}
                  href={item?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-4 p-4 hover:opacity-80 transition rounded-xl 
                    bg-lightMode-menu dark:bg-darkMode-menu"
                >
                  <div className="flex-1">
                    <h3 className="text-sm break-all whitespace-pre-wrap font-semibold 
                      text-lightMode-text dark:text-darkMode-text leading-snug">
                      {item?.title}
                    </h3>
                    <p className="text-xs text-lightMode-text2 dark:text-darkMode-text2 mt-1">
                      {new Date(item?.publishedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-lightMode-bg dark:bg-darkMode-bg">
                    <Image
                      src={item?.image}
                      alt="news"
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </div>
                </Link>
              ))}
            </motion.div>
          )}

          {/* Suggested Users */}
          {activeTab === 'Suggested' && (
            <motion.div
              key="suggested"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Carousel responsive={carouselResponsive} infinite autoPlay autoPlaySpeed={4000}>
                {suggestedUsers.map((u) => (
                  <div
                    key={u._id}
                    className="flex flex-col items-center gap-2 
                      bg-lightMode-menu/70 dark:bg-darkMode-menu/80 
                      rounded-xl p-3 hover:scale-105 hover:shadow-lg transition"
                  >
                    <div className="relative w-16 h-16">
                      <div className="w-full h-full rounded-full 
                        bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[2px]">
                        <Image
                          src={u.profilePhoto?.url || '/default-avatar.png'}
                          alt="profile"
                          width={56}
                          height={56}
                          className="rounded-full object-cover w-14 h-14"
                        />
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-lightMode-text dark:text-darkMode-text">
                      {u.username} {u.isAccountWithPremiumVerify && <span className="text-blue-500 text-xs animate-pulse">✔️</span>}
                    </p>
                    <p className="text-xs text-lightMode-text2 dark:text-darkMode-text2 truncate w-32">
                      {u.profileName || 'No bio available'}
                    </p>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      className="px-3 py-1.5 border border-indigo-600 text-indigo-600 text-sm rounded-lg 
                        hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition flex items-center gap-1"
                    >
                      <FiUserPlus size={16} /> Follow
                    </motion.button>
                  </div>
                ))}
              </Carousel>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Search;
