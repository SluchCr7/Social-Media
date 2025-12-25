'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../Context/AuthContext';
import Link from 'next/link';
import { useUser } from '@/app/Context/UserContext';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineUserGroup, HiChevronRight } from 'react-icons/hi2';

const MenuFollowers = () => {
  const { user, users } = useAuth();
  const [myUser, setMyUser] = useState(null);
  const { followUser } = useUser();

  useEffect(() => {
    const currentUser = users.find((userObj) => userObj._id === user?._id);
    setMyUser(currentUser);
  }, [users, user]);

  const followers = Array.isArray(myUser?.followers)
    ? [...myUser.followers].sort(() => Math.random() - 0.5).slice(0, 4)
    : [];

  return (
    <div className="w-full bg-white/50 dark:bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl overflow-hidden flex flex-col">
      {/* 💎 Header */}
      <div className="px-7 pt-7 pb-4 flex items-center justify-between">
        <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
          <span className="w-2 h-6 bg-blue-600 dark:bg-blue-500 rounded-full" />
          Followers
        </h2>
        <div className="p-2 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400">
          <HiOutlineUserGroup size={20} />
        </div>
      </div>

      <div className="flex flex-col px-4 pb-6">
        <AnimatePresence mode="wait">
          {followers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-4 py-10 text-center"
            >
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-relaxed">
                No followers yet.
              </p>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-1">
              {followers.map((follower, idx) => (
                <motion.div
                  key={follower._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-300"
                >
                  <Link href={`/Pages/User/${follower._id}`} className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 rounded-[1.25rem] overflow-hidden ring-2 ring-white dark:ring-gray-900 shadow-sm transition-transform duration-500 group-hover:scale-110 bg-gray-100 dark:bg-gray-800">
                        <Image
                          src={follower?.profilePhoto?.url || '/default-avatar.png'}
                          alt="profile"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-gray-900 dark:text-gray-100 font-bold text-sm truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {follower?.username}
                      </span>
                      <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-0.5 truncate">
                        {follower?.profileName || `@${follower?.username}`}
                      </span>
                    </div>
                  </Link>
                  <HiChevronRight className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-gray-400" />
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Link */}
      <div className="px-7 py-4 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
        <button className="text-[12px] font-black text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors tracking-wide uppercase flex items-center gap-2 group">
          View all connections
          <HiChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default MenuFollowers;
