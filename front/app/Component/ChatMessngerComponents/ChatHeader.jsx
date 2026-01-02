'use client';
import Image from 'next/image';
import React from 'react';
import { FiX, FiMoreVertical } from "react-icons/fi";
import { useMessage } from '../../Context/MessageContext';
import { useAuth } from '../../Context/AuthContext';
import { useUser } from '@/app/Context/UserContext';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { IoCall, IoVideocam } from 'react-icons/io5';

const ChatHeader = ({ onBack }) => {
  const { selectedUser, setSelectedUser } = useMessage();
  const { onlineUsers } = useUser();
  const { t } = useTranslation()
  const isOnline = onlineUsers?.includes(selectedUser?._id);

  return (
    <div
      className="w-full flex items-center justify-between px-4 py-3 bg-transparent backdrop-blur-md"
    >
      {/* User Info */}
      <div className="flex items-center gap-3">
        {onBack && (
          <button
            onClick={onBack}
            className="md:hidden mr-2 p-2 rounded-full hover:bg-white/10 text-white/60 transition-colors"
          >
            <FiX size={20} />
          </button>
        )}

        <div className="relative cursor-pointer group">
          <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/10 group-hover:ring-indigo-500/50 transition-all">
            <Image
              src={selectedUser?.profilePhoto?.url || '/placeholder.png'}
              alt="Profile"
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#121212] rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          )}
        </div>

        <div className="flex flex-col">
          <h3 className="text-sm font-semibold text-white tracking-wide">
            {selectedUser?.username || "Unknown"}
          </h3>
          <span className={`text-[10px] font-medium tracking-wider uppercase ${isOnline ? 'text-emerald-400' : 'text-white/30'}`}>
            {isOnline ? 'Active Now' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 sm:gap-2">
        <button className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all hidden sm:block">
          <IoCall size={18} />
        </button>
        <button className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all hidden sm:block">
          <IoVideocam size={18} />
        </button>
        <div className="w-px h-6 bg-white/10 mx-1 hidden sm:block" />

        <button className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all">
          <FiMoreVertical size={18} />
        </button>

        <button
          onClick={() => setSelectedUser(null)}
          className="p-2 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all md:flex hidden"
          title="Close"
        >
          <FiX size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
