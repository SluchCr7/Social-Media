'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { useMessage } from '../../Context/MessageContext';
import { useAuth } from '../../Context/AuthContext';
import UserCard from './UserCard';
import { Users2, Search, Zap } from 'lucide-react';
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
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={`
        flex flex-col h-full 
        border-r border-white/5
        bg-[#050505]
        w-full max-w-[320px] 
        absolute inset-y-0 left-0 z-30
        ${selectedUser ? 'hidden md:flex' : 'flex'}
        md:static
      `}
    >
      {/* Premium Header */}
      <div className="p-6 border-b border-white/5 bg-[#050505] relative">
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 group">
              <Image
                src={user?.profilePhoto?.url || '/default.jpg'}
                width={40}
                height={40}
                alt="User"
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-white text-xs uppercase tracking-tight">
                {user?.username}
              </span>
              <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                Central Hub
              </span>
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-white transition-all"
            >
              <BsThreeDots size={18} />
            </button>
            <AnimatePresence>
              {menuOpen && (
                <MenuUser setMenuOpen={setMenuOpen} router={router} users={users} markAllAsReadBetweenUsers={markAllAsReadBetweenUsers} />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Pro Search */}
        <div className="relative group">
          <div className="absolute inset-0 bg-indigo-500/5 blur-xl group-focus-within:bg-indigo-500/10 transition-colors" />
          <div className="relative flex items-center bg-white/[0.03] border border-white/5 rounded-xl px-4 focus-within:border-white/10 transition-all">
            <Search className="text-white/20 w-4 h-4 group-focus-within:text-indigo-400 transition-colors" />
            <input
              type="text"
              placeholder="DISCOVER CHANNELS..."
              className="w-full bg-transparent border-none outline-none py-3 px-3 text-[10px] font-black uppercase tracking-widest text-white placeholder:text-white/10"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* User List Feed */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2 custom-scrollbar">
        <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mb-4 pl-2">Syncing Direct Waves</div>
        {isUserLoading ? (
          <SidebarSkeleton />
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center opacity-20">
            <Users2 className="w-8 h-8 mb-4" />
            <p className="text-[10px] font-black uppercase tracking-widest">Signal Missing</p>
          </div>
        ) : (
          filteredUsers.map((u, idx) => {
            const isOnline = onlineUsers?.includes(u._id);
            const isSelected = selectedUser?._id === u._id;
            return (
              <motion.div
                key={u._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
                onClick={() => {
                  setSelectedUser(u);
                  markAllAsReadBetweenUsers(u?._id);
                }}
                className={`group relative p-3 rounded-2xl cursor-pointer flex items-center gap-4 transition-all border ${isSelected ? 'bg-white/10 border-white/10 shadow-lg' : 'bg-transparent border-transparent hover:bg-white/[0.03]'}`}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/5 group-hover:scale-105 transition-transform">
                    <img src={u?.profilePhoto?.url || '/default.jpg'} alt="av" className="w-full h-full object-cover" />
                  </div>
                  {isOnline && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-indigo-500 border-2 border-black animate-pulse" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className={`text-[11px] font-black uppercase tracking-tight transition-colors ${isSelected ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>
                      {u?.username}
                    </span>
                    {unreadCountPerUser[u._id] > 0 && (
                      <span className="w-4 h-4 rounded-full bg-indigo-500 text-[8px] font-black text-white flex items-center justify-center">
                        {unreadCountPerUser[u._id]}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] font-bold text-white/20 truncate group-hover:text-white/40 transition-colors">
                    {isSelected ? 'ACTIVE SESSION' : (u.lastMessage || 'START BROADCAST')}
                  </p>
                </div>
                {isSelected && (
                  <motion.div layoutId="activeMarker" className="absolute -left-1 w-1 h-8 bg-indigo-500 rounded-full" />
                )}
              </motion.div>
            );
          })
        )}
      </div>

      {/* Footer Hub */}
      <div className="p-6 border-t border-white/5 bg-[#050505]">
        <div className="flex items-center justify-between text-white/20">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-indigo-500" />
            <span className="text-[9px] font-black uppercase tracking-widest text-indigo-500">Live Network</span>
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest">{onlineUsers?.length || 0} Synced</span>
        </div>
      </div>
    </motion.aside>
  );
};

export default ChatSlider;
