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
//     <div className="w-full min-h-screen px-4 sm:px-8 py-12 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#1e1f22] dark:to-[#2b2d31] transition">
      
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
import React, { useEffect, useState } from 'react';
import { FiSearch, FiX, FiUserPlus } from 'react-icons/fi';
import { useAuth } from '../../Context/AuthContext';
import { usePost } from '../../Context/PostContext';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

// ✅ مكون الهاشتاجات
const TrendingHashtags = ({ posts }) => {
  const hashtagCount = {};
  posts.forEach((post) => {
    if (Array.isArray(post.Hashtags)) {
      const uniqueTags = [...new Set(post.Hashtags.map(tag => tag.toLowerCase()))];
      uniqueTags.forEach(tag => {
        hashtagCount[tag] = (hashtagCount[tag] || 0) + 1;
      });
    }
  });

  const topHashtags = Object.entries(hashtagCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="w-full bg-white/80 dark:bg-[#2b2d31]/90 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-5">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        🔥 Trending Now
      </h3>
      {topHashtags.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-6">
          No trending hashtags yet.
        </p>
      ) : (
        <div className="space-y-3">
          {topHashtags.map(([tag, count], index) => (
            <motion.div
              key={tag}
              whileHover={{ scale: 1.02, x: 5 }}
              className="flex items-center justify-between p-3 rounded-xl 
                bg-gray-50/80 dark:bg-[#1e1f22]/70 hover:bg-gray-100 dark:hover:bg-[#3a3c42]
                border border-gray-200 dark:border-gray-600 transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400 w-6">
                  {index + 1}
                </span>
                <div>
                  <Link
                    href={`/Pages/Hashtag/${encodeURIComponent(tag)}`}
                    className="font-medium text-gray-900 dark:text-white hover:underline"
                  >
                    #{tag}
                  </Link>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{count} posts</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

// ✅ صفحة السيرش
const Search = () => {
  const { users, user } = useAuth();
  const { posts } = usePost();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
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
  }, [search, users]);

  return (
    <div className="w-full min-h-screen px-4 sm:px-8 py-12 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#1e1f22] dark:to-[#2b2d31] transition">
      
      {/* Hero */}
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white">
          🔍 Find People
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Discover friends, creators and expand your network.
        </p>
      </div>

      {/* Search Bar */}
      <div className="sticky top-4 z-20 bg-transparent max-w-2xl mx-auto mb-10">
        <div className="relative">
          <input
            type="search"
            placeholder="Search by username or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full py-3 pl-12 pr-12 rounded-2xl bg-white/70 dark:bg-[#2b2d31] backdrop-blur-md 
              text-gray-800 dark:text-gray-200 placeholder-gray-400 
              focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm transition"
          />
          <FiSearch
            className={`absolute left-4 top-1/2 -translate-y-1/2 ${search ? 'text-indigo-500' : 'text-gray-400'}`}
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
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* User Results */}
        <div className="lg:col-span-2">
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredUsers.length > 0 ? (
              filteredUsers
                .filter((u) => u._id !== user._id)
                .map((u) => (
                  <motion.div
                    key={u._id}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className="group bg-white/80 dark:bg-[#2b2d31]/90 border border-gray-200 dark:border-[#383a40] 
                      rounded-2xl p-6 shadow-sm hover:shadow-lg transition backdrop-blur-md"
                  >
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="relative">
                        <Image
                          src={u.profilePhoto?.url || '/default-avatar.png'}
                          alt="profile"
                          width={80}
                          height={80}
                          className="rounded-full object-cover w-20 h-20 ring-2 ring-indigo-500"
                        />
                        <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-[#2b2d31] rounded-full"></span>
                      </div>
                      <div>
                        <p className="text-lg flex items-center gap-1 font-semibold text-gray-900 dark:text-white capitalize">
                          {u.username} {u.isVerify && '✅'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {u.profileName || 'No bio available'}
                        </p>
                      </div>
                      <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <span>👥 {u.followers?.length || 0} Followers</span>
                        <span>📝 {u.posts?.length || 0} Posts</span>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Link
                          href={`/Pages/User/${u._id}`}
                          className="px-4 py-1.5 bg-indigo-600 text-white text-sm rounded-lg shadow hover:bg-indigo-700 transition"
                        >
                          View
                        </Link>
                        <button className="px-3 py-1.5 border border-indigo-600 text-indigo-600 text-sm rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition flex items-center gap-1">
                          <FiUserPlus size={16} />
                          Follow
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
            ) : search.trim() ? (
              <div className="col-span-full flex flex-col items-center text-center text-gray-500 dark:text-gray-400 py-20">
                <Image
                  src="/empty.svg"
                  alt="No results"
                  width={160}
                  height={160}
                  className="mb-6 opacity-80"
                />
                <p className="text-lg">
                  No users found for{' '}
                  <span className="font-medium text-indigo-600 dark:text-indigo-400">{search}</span>.
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Try searching with another keyword or check trending hashtags.
                </p>
              </div>
            ) : (
              <div className="col-span-full text-center text-gray-400 dark:text-gray-500 py-10">
                Start typing to search for users...
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          <TrendingHashtags posts={posts} />
        </aside>
      </div>
    </div>
  );
};

export default Search;
