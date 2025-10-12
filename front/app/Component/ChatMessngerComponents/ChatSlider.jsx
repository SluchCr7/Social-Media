'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { useMessage } from '../../Context/MessageContext';
import { useAuth } from '../../Context/AuthContext';
import UserCard from './UserCard';
import { Users2, Search, Settings, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/Context/UserContext';
import SidebarSkeleton from '@/app/Skeletons/SidebarSkeleton';

const ChatSlider = () => {
  const {
    users,
    setSelectedUser,
    markAllAsReadBetweenUsers,
    unreadCountPerUser,
    selectedUser,
    isUserLoading
  } = useMessage();

  const { user } = useAuth();
  const { onlineUsers } = useUser();
  const [searchValue, setSearchValue] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  // 🔍 فلترة المستخدمين مع ترتيبهم حسب أحدث رسالة
  const filteredUsers = users
    .filter((u) =>
      u.username?.toLowerCase().includes(searchValue.toLowerCase())
    )
    .sort((a, b) => {
      const timeA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
      const timeB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
      return timeB - timeA;
    });

  return (
    <motion.aside
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`
        flex flex-col h-full 
        border-r border-gray-200 dark:border-gray-700
        bg-lightMode-bg dark:bg-darkMode-bg
        w-full max-w-[320px] 
        absolute inset-y-0 left-0 z-30
        ${selectedUser ? 'hidden md:flex' : 'flex'}
        md:static
      `}
    >
      {/* ✅ Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-darkMode-menu relative">
        <div className="flex items-center gap-3">
          <Image
            src={user?.profilePhoto?.url || '/default.jpg'}
            width={40}
            height={40}
            alt="User"
            className="rounded-full w-10 h-10 object-cover"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-black dark:text-white text-sm">
              {user?.username}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {user?.profileName}
            </span>
          </div>
        </div>

        {/* ⚙️ Menu */}
        <div className="relative">
          <BsThreeDots
            className="text-xl text-gray-700 dark:text-gray-300 cursor-pointer hover:rotate-90 transition"
            onClick={() => setMenuOpen(!menuOpen)}
          />

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-48 bg-white dark:bg-darkMode-fg shadow-lg rounded-xl border border-gray-200 dark:border-darkMode-border z-50 overflow-hidden"
              >
                <button
                  onClick={() => {
                    router.push(`/Pages/Profile`);
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  <UserCheck className="w-4 h-4" />
                  Profile
                </button>

                <button
                  onClick={() => {
                    users.forEach(u => markAllAsReadBetweenUsers(u._id));
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  <Users2 className="w-4 h-4" />
                  Mark All as Read
                </button>

                <button
                  onClick={() => {
                    router.push('/Pages/Setting');
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 🔍 Search */}
      <div className="relative p-3 border-b border-gray-200 dark:border-gray-700">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="search"
          placeholder="Search users..."
          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkMode-menu text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>

      {/* 👥 User List OR Skeleton */}
      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1 custom-scrollbar">
        {isUserLoading ? (
          // ✅ عرض Skeleton أثناء تحميل المستخدمين
          <SidebarSkeleton />
        ) : filteredUsers.length === 0 ? (
          // ❌ لا يوجد مستخدمين
          <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 mt-10 text-sm">
            <Users2 className="w-10 h-10 mb-2 opacity-50" />
            No users found.
          </div>
        ) : (
          // ✅ عرض المستخدمين
          filteredUsers.map((u) => (
            <motion.div
              key={u._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <UserCard
                user={u}
                isOnline={onlineUsers?.includes(u._id)}
                unreadCount={unreadCountPerUser[u._id] || 0}
                onSelect={() => {
                  setSelectedUser(u);
                  markAllAsReadBetweenUsers(u?._id);
                }}
                className={`p-3 rounded-xl cursor-pointer flex items-center gap-3 transition hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  selectedUser?._id === u._id ? 'bg-gray-200 dark:bg-gray-700' : ''
                }`}
              />
            </motion.div>
          ))
        )}
      </div>
    </motion.aside>
  );
};

export default ChatSlider;
