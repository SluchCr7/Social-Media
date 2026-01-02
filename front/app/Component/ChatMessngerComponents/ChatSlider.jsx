'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { useMessage } from '../../Context/MessageContext';
import { useAuth } from '../../Context/AuthContext';
import { Search, Zap, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/Context/UserContext';
import SidebarSkeleton from '@/app/Skeletons/SidebarSkeleton';
import MenuUser from './MenuUser';

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

  const filteredUsers = users
    .filter((u) => u.username?.toLowerCase().includes(searchValue.toLowerCase()))
    .sort((a, b) => {
      const timeA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
      const timeB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
      return timeB - timeA;
    });

  return (
    <div className="flex flex-col h-full w-full max-w-full">
      {/* Header Profile Section */}
      <div className="px-6 py-6 border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
        <div className="flex items-center justify-between mb-8">
          {/* User Profile */}
          <div className="flex items-center gap-4">
            <div className="relative group cursor-pointer">
              <div className="absolute inset-0 bg-indigo-500 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
              <div className="relative w-12 h-12 rounded-full p-[1px] bg-gradient-to-tr from-white/20 to-white/5">
                <div className="w-full h-full rounded-full overflow-hidden bg-black">
                  <Image
                    src={user?.profilePhoto?.url || '/default.jpg'}
                    width={48}
                    height={48}
                    alt="User"
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>
              {/* Status Dot */}
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-black rounded-full" />
            </div>

            <div className="flex flex-col">
              <h3 className="text-white font-bold text-sm tracking-wide">{user?.username}</h3>
              <div className="flex items-center gap-1.5 opacity-40">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-medium uppercase tracking-wider">Online</span>
              </div>
            </div>
          </div>

          {/* Menu Trigger */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all active:scale-95"
            >
              <BsThreeDots size={20} />
            </button>
            <AnimatePresence>
              {menuOpen && (
                <MenuUser setMenuOpen={setMenuOpen} router={router} users={users} markAllAsReadBetweenUsers={markAllAsReadBetweenUsers} />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl opacity-0 group-focus-within:opacity-20 transition-opacity duration-500 blur" />
          <div className="relative flex items-center bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 gap-3 transition-colors group-focus-within:bg-black/40 group-focus-within:border-white/10">
            <Search className="w-4 h-4 text-white/30 group-focus-within:text-indigo-400 transition-colors" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-white/80 placeholder:text-white/20 w-full"
            />
          </div>
        </div>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 custom-scrollbar">
        {isUserLoading ? (
          <SidebarSkeleton />
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-white/20 gap-3">
            <Activity className="w-8 h-8 opacity-20" />
            <span className="text-xs uppercase tracking-widest font-medium">No Threads Found</span>
          </div>
        ) : (
          filteredUsers.map((u, i) => {
            const isOnline = onlineUsers?.includes(u._id);
            const isSelected = selectedUser?._id === u._id;

            return (
              <motion.div
                key={u._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => {
                  setSelectedUser(u);
                  markAllAsReadBetweenUsers(u?._id);
                }}
                className={`
                            group relative p-3 rounded-xl cursor-pointer transition-all duration-300
                            ${isSelected ? 'bg-white/[0.06] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)]' : 'hover:bg-white/[0.02]'}
                        `}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeborder"
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-indigo-500 rounded-r-full"
                  />
                )}

                <div className="flex items-center gap-4 pl-2">
                  {/* Avatar */}
                  <div className="relative">
                    <div className={`relative w-11 h-11 rounded-xl overflow-hidden transition-all duration-300 ${isSelected ? 'ring-2 ring-indigo-500/30' : 'group-hover:ring-2 group-hover:ring-white/10'}`}>
                      <Image
                        src={u?.profilePhoto?.url || '/default.jpg'}
                        alt={u.username}
                        fill
                        className="object-cover"
                      />
                    </div>
                    {isOnline && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-[#1a1a1a]"></span>
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <h4 className={`text-sm font-semibold truncate transition-colors ${isSelected ? 'text-white' : 'text-white/70 group-hover:text-white'}`}>
                        {u.username}
                      </h4>
                      {unreadCountPerUser[u._id] > 0 && (
                        <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-indigo-500 text-[9px] font-bold text-white shadow shadow-indigo-500/50">
                          {unreadCountPerUser[u._id]}
                        </span>
                      )}
                    </div>
                    <p className={`text-xs truncate transition-colors font-medium ${isSelected ? 'text-indigo-400' : 'text-white/20 group-hover:text-white/40'}`}>
                      {u.lastMessage || (isOnline ? 'Active now' : 'Offline')}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })
        )}
      </div>

      {/* Bottom Footer Info */}
      <div className="px-6 py-4 border-t border-white/5 bg-[#050505]">
        <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-white/20">
          <span className="flex items-center gap-2">
            <Zap size={12} className={onlineUsers?.length > 0 ? "text-amber-400" : "text-gray-600"} />
            Status
          </span>
          <span>{onlineUsers?.length} Online</span>
        </div>
      </div>
    </div>
  );
};

export default ChatSlider;
