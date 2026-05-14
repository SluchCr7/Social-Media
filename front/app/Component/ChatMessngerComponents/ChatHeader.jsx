'use client';

import React, { memo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Phone, 
  Video, 
  MoreHorizontal, 
  X, 
  ChevronLeft,
  Info
} from 'lucide-react';
import { useMessage } from '../../Context/MessageContext';
import { useUser } from '@/app/Context/UserContext';
import { useTranslation } from 'react-i18next';
import { Avatar } from '../ui/Avatar';

const ChatHeader = memo(({ onBack }) => {
  const { selectedUser, setSelectedUser } = useMessage();
  const { onlineUsers } = useUser();
  const { t } = useTranslation();
  const isOnline = onlineUsers?.includes(selectedUser?._id);

  return (
    <div className="w-full flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-100 dark:border-threads-border z-30">
      {/* User Info */}
      <div className="flex items-center gap-4">
        {onBack && (
          <button
            onClick={onBack}
            className="md:hidden -ml-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 transition-colors"
          >
            <ChevronLeft size={22} />
          </button>
        )}

        <div className="relative cursor-pointer group">
          <Avatar 
            src={selectedUser?.profilePhoto?.url} 
            size="md" 
            className="hover:scale-105 transition-transform"
          />
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-black rounded-full" />
          )}
        </div>

        <div className="flex flex-col">
          <h3 className="text-[15px] font-bold tracking-tight">
            {selectedUser?.username || "Unknown"}
          </h3>
          <span className={`text-[11px] font-bold ${isOnline ? 'text-emerald-500' : 'text-gray-400'}`}>
            {isOnline ? t?.('Active now') || 'Active now' : t?.('Offline') || 'Offline'}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-1 mr-2">
          <button className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 transition-colors">
            <Phone size={18} />
          </button>
          <button className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 transition-colors">
            <Video size={18} />
          </button>
        </div>
        
        <button className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 transition-colors">
          <Info size={18} />
        </button>

        <div className="w-px h-4 bg-gray-100 dark:bg-threads-border mx-2 hidden md:block" />

        <button
          onClick={() => setSelectedUser(null)}
          className="hidden md:flex p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 hover:text-red-500 transition-colors"
          title="Close Chat"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
});

ChatHeader.displayName = 'ChatHeader';

export default ChatHeader;

export default ChatHeader;
