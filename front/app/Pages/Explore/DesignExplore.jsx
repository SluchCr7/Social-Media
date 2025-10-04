// import React from 'react'
// import { FiSearch, FiX } from 'react-icons/fi';
// import Image from 'next/image';
// import Link from 'next/link';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
// import { IoIosSearch } from "react-icons/io";

// const DesignExplore = ({
//   search, setSearch, searchResults, activeTab, setActiveTab,
//   finalTabs, topHashtags, user
// }) => {

//   // استخرج الصور من الأشخاص الذين أتابعهم
//   const followingPhotos = user?.following?.flatMap(f => 
//     f.posts?.flatMap(p => p.Photos || []) || []
//   ) || [];

//   return (
//     <div className="w-full min-h-screen px-4 sm:px-8 py-8 
//       bg-lightMode-bg dark:bg-darkMode-bg 
//       text-lightMode-text dark:text-darkMode-text transition">

//       {/* Header */}
//       <div className="text-center mb-8 flex items-center flex-col gap-2 justify-center w-full">
//         <motion.h2
//           initial={{ scale: 0.9, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           transition={{ duration: 0.4 }}
//           className="text-4xl font-extrabold flex items-center gap-1 justify-center w-full
//             text-lightMode-fg dark:text-darkMode-fg"
//         >
//           <IoIosSearch /> Explore
//         </motion.h2>
//         <p className="mt-2 text-lightMode-text2 dark:text-darkMode-text2">
//           Discover friends, creators, trending topics and news.
//         </p>
//       </div>

//       {/* Search Box */}
//       <div className="relative max-w-2xl mx-auto mb-6">
//         <input
//           type="search"
//           placeholder="Search users, #hashtags or posts..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="w-full py-3 pl-12 pr-12 rounded-2xl 
//             bg-lightMode-menu dark:bg-darkMode-menu
//             text-lightMode-text dark:text-darkMode-text 
//             placeholder-lightMode-text2 dark:placeholder-darkMode-text2
//             focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-600 
//             focus:outline-none shadow-md transition"
//         />
//         <FiSearch
//           className={`absolute left-4 top-1/2 -translate-y-1/2 ${
//             search ? 'text-indigo-500' : 'text-lightMode-text2 dark:text-darkMode-text2'
//           }`}
//           size={20}
//         />
//         {search && (
//           <button
//             onClick={() => setSearch('')}
//             className="absolute right-4 top-1/2 -translate-y-1/2 
//               bg-lightMode-menu dark:bg-darkMode-menu 
//               p-1.5 rounded-full hover:opacity-80 transition"
//           >
//             <FiX size={16} className="text-lightMode-text2 dark:text-darkMode-text2" />
//           </button>
//         )}
//       </div>

//       {/* Search Results */}
//       {search.trim() && (
//         <motion.div
//           key="autocomplete-results"
//           initial={{ opacity: 0, y: 5 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: -5 }}
//           transition={{ duration: 0.2 }}
//           className="max-w-2xl mx-auto space-y-4 
//             bg-lightMode-menu dark:bg-darkMode-menu 
//             rounded-xl shadow-md p-4 mb-6"
//         >
//           {/* Users */}
//           {searchResults.users.length > 0 && (
//             <div>
//               <h4 className="text-sm font-bold mb-2 text-indigo-600 dark:text-indigo-400">Users</h4>
//               {searchResults.users
//                 .filter((u) => u._id !== user._id)
//                 .map((u) => (
//                   <Link
//                     key={u._id}
//                     href={`/Pages/User/${u._id}`}
//                     className="flex items-center gap-3 p-2 rounded-lg 
//                       hover:bg-lightMode-bg dark:hover:bg-darkMode-bg transition"
//                   >
//                     <div className="w-10 h-10 relative">
//                       <div className="w-full h-full rounded-full 
//                         bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[1px]">
//                         <Image
//                           src={u.profilePhoto?.url || '/default-avatar.png'}
//                           alt="profile"
//                           width={40}
//                           height={40}
//                           className="rounded-full object-cover w-10 h-10"
//                         />
//                       </div>
//                     </div>
//                     <div className="flex flex-col">
//                       <span className="text-sm font-semibold 
//                         text-lightMode-text dark:text-darkMode-text">
//                         {u.username}
//                       </span>
//                       <span className="text-xs text-lightMode-text2 dark:text-darkMode-text2 truncate">
//                         {u.profileName || 'No bio'}
//                       </span>
//                     </div>
//                   </Link>
//                 ))}
//             </div>
//           )}

//           {/* Hashtags */}
//           {searchResults.hashtags.length > 0 && (
//             <div>
//               <h4 className="text-sm font-bold mb-2 text-indigo-600 dark:text-indigo-400">Hashtags</h4>
//               {searchResults.hashtags.map(({ tag, count }) => (
//                 <Link
//                   key={tag}
//                   href={`/Pages/Hashtag/${encodeURIComponent(tag)}`}
//                   className="flex justify-between items-center p-2 rounded-lg 
//                     hover:bg-lightMode-bg dark:hover:bg-darkMode-bg transition"
//                 >
//                   <span className="font-medium">#{tag}</span>
//                   <span className="text-xs text-lightMode-text2 dark:text-darkMode-text2">{count} posts</span>
//                 </Link>
//               ))}
//             </div>
//           )}

//           {/* Posts */}
//           {searchResults.posts.length > 0 && (
//             <div>
//               <h4 className="text-sm font-bold mb-2 text-indigo-600 dark:text-indigo-400">Posts</h4>
//               {searchResults.posts.map((p) => (
//                 <Link
//                   key={p._id}
//                   href={`/Pages/Post/${p._id}`}
//                   className="block p-2 rounded-lg hover:bg-lightMode-bg dark:hover:bg-darkMode-bg transition"
//                 >
//                   <p className="text-sm font-semibold text-lightMode-text dark:text-darkMode-text line-clamp-1">
//                     {p.title || 'Untitled Post'}
//                   </p>
//                   <p className="text-xs text-lightMode-text2 dark:text-darkMode-text2 line-clamp-2">
//                     {p.content}
//                   </p>
//                 </Link>
//               ))}
//             </div>
//           )}

//           {searchResults.users.length === 0 &&
//            searchResults.hashtags.length === 0 &&
//            searchResults.posts.length === 0 && (
//             <p className="text-center text-lightMode-text2 dark:text-darkMode-text2 py-4">
//               No results found for{' '}
//               <span className="font-medium text-indigo-600 dark:text-indigo-400">{search}</span>
//             </p>
//           )}
//         </motion.div>
//       )}

//       {/* Tabs */}
//       <div className="max-w-3xl mx-auto flex justify-center flex-wrap gap-3 mb-6 relative">
//         {finalTabs.concat([{ name: 'Hashtags' }, { name: 'Photos' }]).map((tab) => (
//           <button
//             key={tab.name}
//             onClick={() => setActiveTab(tab.name)}
//             className={`px-4 py-2 rounded-full font-semibold transition
//               ${activeTab === tab.name
//                 ? 'bg-indigo-600 text-white shadow-lg'
//                 : 'bg-lightMode-menu dark:bg-darkMode-menu text-lightMode-text2 dark:text-darkMode-text2 hover:opacity-80'}`}
//           >
//             {tab.name}
//           </button>
//         ))}
//       </div>

//       {/* Tab Content */}
//       <div className="max-w-3xl mx-auto space-y-4">
//         <AnimatePresence mode="wait">
//           {finalTabs.concat([{ name: 'Hashtags' }, { name: 'Photos' }]).map((tab) => (
//             activeTab === tab.name && (
//               <motion.div
//                 key={tab.name}
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -10 }}
//                 transition={{ duration: 0.3 }}
//                 className="flex flex-col gap-3"
//               >
//                 {/* Hashtags Tab */}
//                 {tab.name === 'Hashtags' ? (
//                   topHashtags.map(([tag, count], index) => {
//                     const isTrendingUp = index % 2 === 0;
//                     return (
//                       <Link
//                         key={tag}
//                         href={`/Pages/Hashtag/${encodeURIComponent(tag)}`}
//                         className="flex justify-between items-center p-4 rounded-xl 
//                           bg-lightMode-menu dark:bg-darkMode-menu 
//                           hover:bg-lightMode-bg dark:hover:bg-darkMode-bg 
//                           shadow-sm hover:shadow-md transition-all duration-200"
//                       >
//                         <div className="flex flex-col">
//                           <span className="text-gray-900 dark:text-gray-100 font-semibold text-sm sm:text-base">
//                             #{tag}
//                           </span>
//                           <span className="text-xs text-gray-500 dark:text-gray-400">
//                             {count} posts
//                           </span>
//                         </div>
//                         <div className={`flex items-center justify-center w-6 h-6 rounded-full ${isTrendingUp ? 'bg-green-100 dark:bg-green-800' : 'bg-red-100 dark:bg-red-800'}`}>
//                           {isTrendingUp ? (
//                             <FaArrowUp className="text-green-600 dark:text-green-400 text-sm" />
//                           ) : (
//                             <FaArrowDown className="text-red-600 dark:text-red-400 text-sm" />
//                           )}
//                         </div>
//                       </Link>
//                     );
//                   })
//                 ) : tab.name === 'Photos' ? (
//                   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
//                     {followingPhotos.length > 0 ? (
//                       followingPhotos.map((photo, idx) => (
//                         <motion.div
//                           key={idx}
//                           initial={{ opacity: 0 }}
//                           animate={{ opacity: 1 }}
//                           transition={{ delay: idx * 0.03 }}
//                           className="overflow-hidden rounded-xl relative group"
//                         >
//                           <div className="block">
//                             <Image
//                               src={photo?.url || '/placeholder.png'}
//                               alt="Photo"
//                               width={300}
//                               height={300}
//                               className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
//                             />
//                           </div>
//                         </motion.div>
//                       ))
//                     ) : (
//                       <p className="text-center text-lightMode-text2 dark:text-darkMode-text2 py-8 col-span-full">
//                         No photos from people you follow yet.
//                       </p>
//                     )}
//                   </div>
//                 ) : (
//                   // Default News Tabs
//                   tab.news?.map((item, index) => (
//                     <Link
//                       key={index}
//                       href={item.url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="flex gap-4 p-4 hover:opacity-80 transition rounded-xl 
//                         bg-lightMode-menu dark:bg-darkMode-menu"
//                     >
//                       <div className="flex-1">
//                         <h3 className="text-sm break-all whitespace-pre-wrap font-semibold 
//                           text-lightMode-text dark:text-darkMode-text leading-snug">
//                           {item.title}
//                         </h3>
//                         <p className="text-xs text-lightMode-text2 dark:text-darkMode-text2 mt-1">
//                           {new Date(item.publishedAt).toLocaleDateString()}
//                         </p>
//                       </div>
//                       {item.image && (
//                         <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-lightMode-bg dark:bg-darkMode-bg">
//                           <Image
//                             src={item.image}
//                             alt="news"
//                             width={64}
//                             height={64}
//                             className="w-full h-full object-cover"
//                             unoptimized
//                           />
//                         </div>
//                       )}
//                     </Link>
//                   ))
//                 )}
//               </motion.div>
//             )
//           ))}
//         </AnimatePresence>
//       </div>
//     </div>
//   )
// }

// export default DesignExplore;

import React, { useMemo, useState } from 'react'
import { FiSearch, FiX } from 'react-icons/fi';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { IoIosSearch } from "react-icons/io";

const DesignExplore = ({
  search, setSearch, searchResults, activeTab, setActiveTab,
  finalTabs, topHashtags, user, trendingPosts = []
}) => {

  // فلتر الصور من الأشخاص الذين تتابعهم
  const followingPhotos = user?.following?.flatMap(f =>
    f.posts?.flatMap(p => (p.images || p.media?.filter(m => m.type === 'image') || [])) || []
  ) || [];

  // فلتر الوقت للتبويب Trending
  const [timeFilter, setTimeFilter] = useState('today'); // 'today' | 'week'

  // دالة مساعدة: هل المنشور ضمن الفلتر الزمني
  const withinTimeFilter = (post) => {
    if (!post?.createdAt) return false;
    const created = new Date(post.createdAt);
    const now = new Date();
    if (timeFilter === 'today') {
      const diff = now - created;
      return diff <= 1000 * 60 * 60 * 24; // 24 ساعة
    } else {
      // this week (7 days)
      const diff = now - created;
      return diff <= 1000 * 60 * 60 * 24 * 7; // 7 days
    }
  };

  // المصفوفة المرشحة للعرض في Trending (ترتيب افتراضي حسب score بسيط)
  const trendingToShow = useMemo(() => {
    return (trendingPosts || [])
      .filter(withinTimeFilter)
      .map(p => {
        // حساب score بسيط لو أردت الفرز (يمكن تغييره ليتناسب مع الخادم)
        const likes = Array.isArray(p?.likes) ? p?.likes.length : (p?.likes || 0);
        const comments = Array.isArray(p?.comments) ? p?.comments.length : (p?.comments || 0);
        const shares = p?.shares || 0;
        const views = p?.views || 0;
        const score = likes * 2 + comments * 3 + shares * 5 + views * 0.1;
        return { ...p, score };
      })
      .sort((a, b) => b.score - a.score);
  }, [trendingPosts, timeFilter]);

  return (
    <div className="w-full min-h-screen px-4 sm:px-8 py-8 
      bg-lightMode-bg dark:bg-darkMode-bg 
      text-lightMode-text dark:text-darkMode-text transition">

      {/* Header */}
      <div className="text-center mb-8 flex items-center flex-col gap-2 justify-center w-full">
        <motion.h2
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="text-4xl font-extrabold flex items-center gap-2 justify-center w-full
            text-lightMode-fg dark:text-darkMode-fg"
        >
          <IoIosSearch /> Explore
        </motion.h2>
        <p className="mt-2 text-lightMode-text2 dark:text-darkMode-text2">
          Discover friends, creators, trending topics and news.
        </p>
      </div>

      {/* Search Box */}
      <div className="relative max-w-2xl mx-auto mb-6">
        <input
          type="search"
          placeholder="Search users, #hashtags or posts..."
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

      {/* Search Results (same as before) */}
      {search.trim() && (
        <motion.div
          key="autocomplete-results"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
          className="max-w-2xl mx-auto space-y-4 
            bg-lightMode-menu dark:bg-darkMode-menu 
            rounded-xl shadow-md p-4 mb-6"
        >
          {/* users / hashtags / posts rendering (unchanged) */}
          {searchResults.users.length > 0 && (
            <div>
              <h4 className="text-sm font-bold mb-2 text-indigo-600 dark:text-indigo-400">Users</h4>
              {searchResults.users
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
                ))}
            </div>
          )}

          {searchResults.hashtags.length > 0 && (
            <div>
              <h4 className="text-sm font-bold mb-2 text-indigo-600 dark:text-indigo-400">Hashtags</h4>
              {searchResults.hashtags.map(({ tag, count }) => (
                <Link
                  key={tag}
                  href={`/Pages/Hashtag/${encodeURIComponent(tag)}`}
                  className="flex justify-between items-center p-2 rounded-lg 
                    hover:bg-lightMode-bg dark:hover:bg-darkMode-bg transition"
                >
                  <span className="font-medium">#{tag}</span>
                  <span className="text-xs text-lightMode-text2 dark:text-darkMode-text2">{count} posts</span>
                </Link>
              ))}
            </div>
          )}

          {searchResults.posts.length > 0 && (
            <div>
              <h4 className="text-sm font-bold mb-2 text-indigo-600 dark:text-indigo-400">Posts</h4>
              {searchResults.posts.map((p) => (
                <Link
                  key={p._id}
                  href={`/Pages/Post/${p._id}`}
                  className="block p-2 rounded-lg hover:bg-lightMode-bg dark:hover:bg-darkMode-bg transition"
                >
                  <p className="text-sm font-semibold text-lightMode-text dark:text-darkMode-text line-clamp-1">
                    {p.title || 'Untitled Post'}
                  </p>
                  <p className="text-xs text-lightMode-text2 dark:text-darkMode-text2 line-clamp-2">
                    {p.content}
                  </p>
                </Link>
              ))}
            </div>
          )}

          {searchResults.users.length === 0 &&
           searchResults.hashtags.length === 0 &&
           searchResults.posts.length === 0 && (
            <p className="text-center text-lightMode-text2 dark:text-darkMode-text2 py-4">
              No results found for{' '}
              <span className="font-medium text-indigo-600 dark:text-indigo-400">{search}</span>
            </p>
          )}
        </motion.div>
      )}

      {/* Tabs (add Trending + Photos + Hashtags) */}
      <div className="max-w-3xl mx-auto flex justify-center flex-wrap gap-3 mb-6 relative">
        {finalTabs.concat([{ name: 'Trending' }, { name: 'Hashtags' }, { name: 'Photos' }]).map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`px-4 py-2 rounded-full font-semibold transition
              ${activeTab === tab.name
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-lightMode-menu dark:bg-darkMode-menu text-lightMode-text2 dark:text-darkMode-text2 hover:opacity-80'}`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="max-w-3xl mx-auto space-y-4">
        <AnimatePresence mode="wait">
          {finalTabs.concat([{ name: 'Trending' }, { name: 'Hashtags' }, { name: 'Photos' }]).map((tab) => (
            activeTab === tab.name && (
              <motion.div
                key={tab.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.28 }}
                className="flex flex-col gap-3"
              >
                {/* Trending Tab */}
                {tab.name === 'Trending' ? (
                  <>
                    {/* Time filter */}
                    <div className="flex items-center gap-3 justify-end">
                      <div className="inline-flex rounded-xl bg-lightMode-menu dark:bg-darkMode-menu p-1">
                        <button
                          onClick={() => setTimeFilter('today')}
                          className={`px-3 py-1 rounded-lg font-medium text-sm transition ${
                            timeFilter === 'today' ? 'bg-indigo-600 text-white shadow' : 'text-lightMode-text2 dark:text-darkMode-text2'
                          }`}
                        >
                          Today
                        </button>
                        <button
                          onClick={() => setTimeFilter('week')}
                          className={`px-3 py-1 rounded-lg font-medium text-sm transition ${
                            timeFilter === 'week' ? 'bg-indigo-600 text-white shadow' : 'text-lightMode-text2 dark:text-darkMode-text2'
                          }`}
                        >
                          This Week
                        </button>
                      </div>
                    </div>

                    {/* Mixed content grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {trendingToShow.length > 0 ? trendingToShow.map((post, idx) => {
                        const media = post.media || (post.images ? post.images[0] : null);
                        const likes = Array.isArray(post.likes) ? post.likes.length : (post.likes || 0);
                        const comments = Array.isArray(post.comments) ? post.comments.length : (post.comments || 0);

                        return (
                          <motion.div
                            key={post._id || idx}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.03 }}
                            className="bg-lightMode-menu dark:bg-darkMode-menu rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
                          >
                            <Link href={post.url || `/Pages/Post/${post._id}`}>
                              <div className="w-full h-44 md:h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
                                {media ? (
                                  media.type === 'video' ? (
                                    <video
                                      src={media.url}
                                      poster={media.poster || ''}
                                      controls={false}
                                      className="w-full h-full object-cover"
                                      muted
                                      playsInline
                                    />
                                  ) : (
                                    <Image
                                      src={media.url}
                                      alt={post.title || 'media'}
                                      width={800}
                                      height={600}
                                      className="w-full h-full object-cover"
                                    />
                                  )
                                ) : (
                                  <div className="flex items-center justify-center w-full h-full text-sm text-lightMode-text2 dark:text-darkMode-text2">
                                    No preview
                                  </div>
                                )}
                              </div>

                              <div className="p-3">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                                    <Image
                                      src={post.author?.profilePhoto?.url || '/default-avatar.png'}
                                      alt={post.author?.username || 'author'}
                                      width={32}
                                      height={32}
                                      className="object-cover w-full h-full"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold truncate">{post.title || post.author?.username}</p>
                                    <p className="text-xs text-lightMode-text2 dark:text-darkMode-text2 truncate">
                                      @{post.author?.username} · {new Date(post.createdAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>

                                <p className="text-sm text-lightMode-text2 dark:text-darkMode-text2 line-clamp-2 mb-3">
                                  {post.content || ''}
                                </p>

                                <div className="flex items-center justify-between text-xs text-lightMode-text2 dark:text-darkMode-text2">
                                  <div className="flex items-center gap-3">
                                    <span>❤️ {likes}</span>
                                    <span>💬 {comments}</span>
                                  </div>
                                  <div className="text-xs">
                                    Score {Math.round(post.score || 0)}
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </motion.div>
                        );
                      }) : (
                        <p className="text-center text-lightMode-text2 dark:text-darkMode-text2 py-8 col-span-full">
                          No trending content for the selected timeframe.
                        </p>
                      )}
                    </div>
                  </>
                ) : tab.name === 'Hashtags' ? (
                  // Hashtags content (as before)
                  topHashtags.map(([tag, count], index) => {
                    const isTrendingUp = index % 2 === 0;
                    return (
                      <Link
                        key={tag}
                        href={`/Pages/Hashtag/${encodeURIComponent(tag)}`}
                        className="flex justify-between items-center p-4 rounded-xl 
                          bg-lightMode-menu dark:bg-darkMode-menu 
                          hover:bg-lightMode-bg dark:hover:bg-darkMode-bg 
                          shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex flex-col">
                          <span className="text-gray-900 dark:text-gray-100 font-semibold text-sm sm:text-base">
                            #{tag}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {count} posts
                          </span>
                        </div>
                        <div className={`flex items-center justify-center w-6 h-6 rounded-full ${isTrendingUp ? 'bg-green-100 dark:bg-green-800' : 'bg-red-100 dark:bg-red-800'}`}>
                          {isTrendingUp ? (
                            <FaArrowUp className="text-green-600 dark:text-green-400 text-sm" />
                          ) : (
                            <FaArrowDown className="text-red-600 dark:text-red-400 text-sm" />
                          )}
                        </div>
                      </Link>
                    );
                  })
                ) : tab.name === 'Photos' ? (
                  // Photos grid (from following)
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {followingPhotos.length > 0 ? (
                      followingPhotos.map((photo, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: idx * 0.03 }}
                          className="overflow-hidden rounded-xl relative group"
                        >
                          <Link href={photo.postUrl || '#'}>
                            <Image
                              src={photo.url || '/placeholder.png'}
                              alt="Photo"
                              width={300}
                              height={300}
                              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                            />
                          </Link>
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-center text-lightMode-text2 dark:text-darkMode-text2 py-8 col-span-full">
                        No photos from people you follow yet.
                      </p>
                    )}
                  </div>
                ) : (
                  // Default: render tab.news if exists (unchanged)
                  tab.news?.map((item, index) => (
                    <Link
                      key={index}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex gap-4 p-4 hover:opacity-80 transition rounded-xl 
                        bg-lightMode-menu dark:bg-darkMode-menu"
                    >
                      <div className="flex-1">
                        <h3 className="text-sm break-all whitespace-pre-wrap font-semibold 
                          text-lightMode-text dark:text-darkMode-text leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-xs text-lightMode-text2 dark:text-darkMode-text2 mt-1">
                          {new Date(item.publishedAt).toLocaleDateString()}
                        </p>
                      </div>
                      {item.image && (
                        <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-lightMode-bg dark:bg-darkMode-bg">
                          <Image
                            src={item.image}
                            alt="news"
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                            unoptimized
                          />
                        </div>
                      )}
                    </Link>
                  ))
                )}
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default DesignExplore;
