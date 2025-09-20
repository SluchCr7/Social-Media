// 'use client';
// import React, { useEffect, useState } from 'react';
// import { FiSearch, FiX, FiUserPlus } from 'react-icons/fi';
// import { useAuth } from '../../Context/AuthContext';
// import Image from 'next/image';
// import Link from 'next/link';
// import { motion } from 'framer-motion';

// const Search = () => {
//   const { users, user } = useAuth();
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [search, setSearch] = useState('');

//   useEffect(() => {
//     if (!search.trim()) {
//       setFilteredUsers([]);
//       return;
//     }
//     if (Array.isArray(users)) {
//       const filtered = users.filter(
//         (u) =>
//           u.username.toLowerCase().includes(search.toLowerCase()) ||
//           (u.profileName &&
//             u.profileName.toLowerCase().includes(search.toLowerCase()))
//       );
//       setFilteredUsers(filtered);
//     }
//   }, [search, users]);

//   return (
//     <div className="w-full min-h-screen px-4 sm:px-8 py-12 text-lightMode-text dark:text-darkMode-text bg-lightMode-bg dark:bg-darkMode-bg transition">
      
//       {/* Hero Section */}
//       <div className="text-center mb-10">
//         <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white">
//           🔍 Find People
//         </h2>
//         <p className="text-gray-600 dark:text-gray-400 mt-2">
//           Discover friends, creators and expand your network.
//         </p>
//       </div>

//       {/* Search Box */}
//       <div className="relative max-w-2xl mx-auto mb-12">
//         <input
//           type="search"
//           placeholder="Search by username or name..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="w-full py-3 pl-12 pr-12 rounded-2xl bg-white/70 dark:bg-[#2b2d31] backdrop-blur-md
//             text-gray-800 dark:text-gray-200 placeholder-gray-400
//             focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm transition"
//         />
//         <FiSearch
//           className={`absolute left-4 top-1/2 -translate-y-1/2 ${
//             search ? 'text-indigo-500' : 'text-gray-400'
//           }`}
//           size={20}
//         />
//         {search && (
//           <button
//             onClick={() => setSearch('')}
//             className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-200 dark:bg-gray-700 p-1.5 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition"
//           >
//             <FiX size={16} className="text-gray-600 dark:text-gray-300" />
//           </button>
//         )}
//       </div>

//       {/* User Cards */}
//       <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//         {filteredUsers.length > 0 ? (
//           filteredUsers
//             .filter((u) => u._id !== user._id)
//             .map((u) => (
//               <motion.div
//                 key={u._id}
//                 whileHover={{ y: -6, scale: 1.02 }}
//                 className="group bg-white/80 dark:bg-[#2b2d31]/90 border border-gray-200 dark:border-[#383a40]
//                   rounded-2xl p-6 shadow-sm hover:shadow-lg transition backdrop-blur-md"
//               >
//                 <div className="flex flex-col items-center text-center space-y-4">
//                   <div className="relative">
//                     <Image
//                       src={u.profilePhoto?.url || '/default-avatar.png'}
//                       alt="profile"
//                       width={80}
//                       height={80}
//                       className="rounded-full object-cover w-20 h-20 ring-2 ring-indigo-500"
//                     />
//                     <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-[#2b2d31] rounded-full"></span>
//                   </div>
//                   <div>
//                     <p className="text-lg flex items-center gap-1 font-semibold text-gray-900 dark:text-white capitalize">
//                       {u.username} {u.isVerify}
//                     </p>
//                     <p className="text-sm text-gray-500 dark:text-gray-400">
//                       {u.profileName || 'No bio available'}
//                     </p>
//                   </div>
//                   {/* mini stats */}
//                   <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400">
//                     <span>👥 {u.followers?.length || 0} Followers</span>
//                     <span>📝 {u.posts?.length || 0} Posts</span>
//                   </div>
//                   <div className="flex gap-2 mt-3">
//                     <Link
//                       href={`/Pages/User/${u._id}`}
//                       className="px-4 py-1.5 bg-indigo-600 text-white text-sm rounded-lg shadow hover:bg-indigo-700 transition"
//                     >
//                       View
//                     </Link>
//                     <button className="px-3 py-1.5 border border-indigo-600 text-indigo-600 text-sm rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition flex items-center gap-1">
//                       <FiUserPlus size={16} />
//                       Follow
//                     </button>
//                   </div>
//                 </div>
//               </motion.div>
//             ))
//         ) : search.trim() ? (
//           <div className="col-span-full flex flex-col items-center text-center text-gray-500 dark:text-gray-400 py-20">
//             <Image
//               src="/empty.svg"
//               alt="No results"
//               width={160}
//               height={160}
//               className="mb-6 opacity-80"
//             />
//             <p className="text-lg">
//               No users found for{' '}
//               <span className="font-medium text-indigo-600 dark:text-indigo-400">{search}</span>.
//             </p>
//             <p className="text-sm text-gray-400 mt-1">
//               Try searching with another keyword.
//             </p>
//           </div>
//         ) : (
//           <div className="col-span-full text-center text-gray-400 dark:text-gray-500 py-10">
//             Start typing to search for users...
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Search;

'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { FiSearch, FiX, FiUserPlus, FiTrendingUp } from 'react-icons/fi';
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

const trendingHashtags = ['#React', '#NextJS', '#OpenAI', '#WebDev', '#TailwindCSS'];
const newsItems = [
  { title: 'AI is changing web development', link: '#' },
  { title: 'Next.js 14 released', link: '#' },
  { title: 'Top 10 JavaScript libraries in 2025', link: '#' },
];
const tabs = ['Users', 'Hashtags', 'News', 'Suggested'];

const Search = () => {
  const { users, user } = useAuth();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('Users');
  const { news } = useNews();
  const { posts } = usePost();

  // Collect all hashtags from all posts
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

  // Suggested Users Carousel
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

  const topHashtags = Object.entries(hashtagCount)
  .sort((a, b) => b[1] - a[1])
  return (
    <div className="w-full min-h-screen px-4 sm:px-8 py-8 text-lightMode-text dark:text-darkMode-text bg-gradient-to-b from-gray-50 to-white dark:from-[#1f1f1f] dark:to-[#2b2d31] transition">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.h2
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="text-4xl font-extrabold text-gray-900 dark:text-white"
        >
          🔍 Explore
        </motion.h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
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
          className="w-full py-3 pl-12 pr-12 rounded-2xl bg-white/80 dark:bg-[#2b2d31] backdrop-blur-md
            text-gray-800 dark:text-gray-200 placeholder-gray-400
            focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-600 focus:outline-none shadow-md transition"
        />
        <FiSearch
          className={`absolute left-4 top-1/2 -translate-y-1/2 ${
            search ? 'text-indigo-500' : 'text-gray-400'
          }`}
          size={20}
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-200 dark:bg-gray-700 p-1.5 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            <FiX size={16} className="text-gray-600 dark:text-gray-300" />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="max-w-3xl mx-auto flex justify-center gap-4 mb-6 relative">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full font-semibold transition
              ${activeTab === tab
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-gray-200 dark:bg-[#2b2d31] text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-[#3a3b3f]'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="max-w-3xl mx-auto space-y-4">
        <AnimatePresence mode="wait">
          {activeTab === 'Users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {filteredUsers.length > 0 ? (
                filteredUsers
                  .filter((u) => u._id !== user._id)
                  .map((u) => (
                    <motion.div
                      key={u._id}
                      whileHover={{ scale: 1.03 }}
                      className="flex items-center justify-between bg-white/80 dark:bg-[#2b2d31]/90 rounded-xl p-4 shadow-sm hover:shadow-lg transition backdrop-blur-md"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[2px]">
                            <Image
                              src={u.profilePhoto?.url || '/default-avatar.png'}
                              alt="profile"
                              width={56}
                              height={56}
                              className="rounded-full object-cover w-14 h-14"
                              loading="lazy"
                            />
                          </div>
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-[#2b2d31] rounded-full"></span>
                        </div>
                        <div className="flex flex-col">
                          <p className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                            {u.username}
                            {u.isVerify && (
                              <span className="text-blue-500 text-sm animate-pulse">✔️</span>
                            )}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {u.profileName || 'No bio available'}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href={`/Pages/User/${u._id}`}
                          className="px-4 py-1.5 bg-indigo-600 text-white text-sm rounded-lg shadow hover:bg-indigo-700 transition"
                        >
                          View
                        </Link>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          className="px-3 py-1.5 border border-indigo-600 text-indigo-600 text-sm rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition flex items-center gap-1"
                        >
                          <FiUserPlus size={16} />
                          Follow
                        </motion.button>
                      </div>
                    </motion.div>
                  ))
              ) : search.trim() ? (
                <motion.div
                  key="empty-search"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full flex flex-col items-center text-center text-gray-500 dark:text-gray-400 py-20"
                >
                  <Image
                    src="/empty.svg"
                    alt="No results"
                    width={160}
                    height={160}
                    className="mb-6 opacity-80"
                  />
                  <p className="text-lg">
                    No users found for{' '}
                    <span className="font-medium text-indigo-600 dark:text-indigo-400">
                      {search}
                    </span>
                    .
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Try searching with another keyword.
                  </p>
                </motion.div>
              ) : (
                <div className="col-span-full text-center text-gray-400 dark:text-gray-500 py-10">
                  Start typing to search for users...
                </div>
              )}
            </motion.div>
          )}

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
                const isTrendingUp = index % 2 === 0; // محاكاة بسيطة للاتجاه

                return (
                  <Link
                    key={tag}
                    href={`/Pages/Hashtag/${encodeURIComponent(tag)}`}
                    className="flex justify-between items-center p-3 rounded-xl bg-white dark:bg-[#2b2d31] hover:bg-gray-100 dark:hover:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex flex-col">
                      <span className="text-gray-900 dark:text-gray-100 font-semibold text-sm sm:text-base">
                        #{tag}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {count} posts
                      </span>
                    </div>

                    <div
                      className={`flex items-center justify-center w-6 h-6 rounded-full ${
                        isTrendingUp
                          ? 'bg-green-100 dark:bg-green-800'
                          : 'bg-red-100 dark:bg-red-800'
                      }`}
                    >
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
                <div key={index}>
                  <Link
                    href={item?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-4 p-4 hover:bg-gray-100 dark:hover:bg-[#1e2025] transition"
                  >
                    <div className="flex-1">
                      <h3 className="text-sm break-all whitespace-pre-wra font-semibold text-gray-800 dark:text-gray-100 leading-snug">
                        {item?.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(item?.publishedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-200 dark:bg-gray-800">
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
                </div>
              ))}
            </motion.div>
          )}

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
                    className="flex flex-col items-center gap-2 bg-white/70 dark:bg-[#2b2d31]/80 rounded-xl p-3 hover:scale-105 hover:shadow-lg transition"
                  >
                    <div className="relative w-16 h-16">
                      <div className="w-full h-full rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[2px]">
                        <Image
                          src={u.profilePhoto?.url || '/default-avatar.png'}
                          alt="profile"
                          width={56}
                          height={56}
                          className="rounded-full object-cover w-14 h-14"
                        />
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {u.username} {u.isVerify && <span className="text-blue-500 text-xs animate-pulse">✔️</span>}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate w-32">
                      {u.profileName || 'No bio available'}
                    </p>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      className="px-3 py-1.5 border border-indigo-600 text-indigo-600 text-sm rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition flex items-center gap-1"
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



