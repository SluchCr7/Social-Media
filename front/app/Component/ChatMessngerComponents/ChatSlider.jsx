'use client';

import React, { useState, memo, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Settings, 
  MoreHorizontal, 
  Plus, 
  Circle,
  MessageSquareOff,
  Zap
} from 'lucide-react';
import { useMessage } from '../../Context/MessageContext';
import { useAuth } from '../../Context/AuthContext';
import { useUser } from '@/app/Context/UserContext';
import SidebarSkeleton from '@/app/Skeletons/SidebarSkeleton';
import MenuUser from './MenuUser';
import { Avatar } from '../ui/Avatar';

const UserListItem = memo(({ u, isOnline, isSelected, unreadCount, onClick }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    onClick={onClick}
    className={`
      group relative p-4 rounded-2xl cursor-pointer transition-all duration-200
      ${isSelected ? 'bg-gray-50 dark:bg-white/5' : 'hover:bg-gray-50 dark:hover:bg-white/[0.03]'}
    `}
  >
    <div className="flex items-center gap-4">
      {/* Avatar Section */}
      <div className="relative">
        <Avatar 
          src={u?.profilePhoto?.url} 
          size="md" 
          className={isSelected ? 'ring-2 ring-black dark:ring-white ring-offset-2 dark:ring-offset-black' : ''} 
        />
        {isOnline && (
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-black rounded-full" />
        )}
      </div>

      {/* Info Section */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-0.5">
          <h4 className="text-[15px] font-bold truncate">
            {u.username}
          </h4>
          {unreadCount > 0 && (
            <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1.5 rounded-full bg-black dark:bg-white text-[10px] font-black text-white dark:text-black">
              {unreadCount}
            </span>
          )}
        </div>
        <p className={`text-[13px] truncate ${unreadCount > 0 ? 'font-bold text-black dark:text-white' : 'text-gray-500 dark:text-white/40'}`}>
          {u.lastMessage || (isOnline ? 'Active now' : 'View profile')}
        </p>
      </div>
    </div>
  </motion.div>
));

UserListItem.displayName = 'UserListItem';

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

  const filteredUsers = useMemo(() => {
    return users
      .filter((u) => u.username?.toLowerCase().includes(searchValue.toLowerCase()))
      .sort((a, b) => {
        const timeA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
        const timeB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
        return timeB - timeA;
      });
  }, [users, searchValue]);

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-black">
      {/* Premium Header */}
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <Avatar src={user?.profilePhoto?.url} size="sm" />
             <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight">{user?.username}</span>
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Online</span>
             </div>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
              <Plus size={20} />
            </button>
            <div className="relative">
               <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              >
                <MoreHorizontal size={20} />
              </button>
              <AnimatePresence>
                {menuOpen && (
                  <MenuUser setMenuOpen={setMenuOpen} router={router} users={users} markAllAsReadBetweenUsers={markAllAsReadBetweenUsers} />
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Minimal Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full bg-gray-50 dark:bg-white/5 border border-transparent focus:border-gray-200 dark:focus:border-white/10 rounded-2xl pl-11 pr-4 py-3 text-[14px] font-medium outline-none transition-all"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-2 pb-6 no-scrollbar">
        <div className="px-4 mb-2">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">Messages</h3>
        </div>

        {isUserLoading ? (
          <SidebarSkeleton />
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 px-8">
            <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-300">
               <MessageSquareOff size={32} />
            </div>
            <div>
               <p className="text-sm font-bold">No conversations yet</p>
               <p className="text-xs text-gray-500 font-medium mt-1">Start a new chat to see it here.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredUsers.map((u) => (
              <UserListItem
                key={u._id}
                u={u}
                isOnline={onlineUsers?.includes(u._id)}
                isSelected={selectedUser?._id === u._id}
                unreadCount={unreadCountPerUser[u._id]}
                onClick={() => {
                  setSelectedUser(u);
                  markAllAsReadBetweenUsers(u?._id);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Subtle Footer */}
      <div className="p-6 border-t border-gray-100 dark:border-threads-border flex items-center justify-between">
        <div className="flex items-center gap-2">
           <Zap size={14} className="text-amber-500 fill-amber-500" />
           <span className="text-[11px] font-bold uppercase tracking-widest opacity-40">{onlineUsers?.length} Online</span>
        </div>
        <button className="text-[11px] font-bold uppercase tracking-widest text-indigo-500 hover:text-indigo-600 transition-colors">
          Privacy Settings
        </button>
      </div>
    </div>
  );
};

export default ChatSlider;
