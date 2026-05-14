'use client';

import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Home, 
  User, 
  MessageSquare, 
  Compass, 
  Settings, 
  Plus, 
  LogOut, 
  Moon, 
  Sun,
  Command,
  Hash,
  Users,
  Bell,
  X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/Context/AuthContext';
import { useTranslation } from 'react-i18next';

const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { user, logout } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();
  const inputRef = useRef(null);

  const actions = [
    { id: 'home', label: 'Go to Home', icon: Home, shortcut: 'H', action: () => router.push('/') },
    { id: 'profile', label: 'View Profile', icon: User, shortcut: 'P', action: () => router.push(`/Pages/Profile/${user?._id}`) },
    { id: 'messenger', label: 'Messages', icon: MessageSquare, shortcut: 'M', action: () => router.push('/Pages/Messanger') },
    { id: 'explore', label: 'Explore', icon: Compass, shortcut: 'E', action: () => router.push('/Pages/Explore') },
    { id: 'notifications', label: 'Notifications', icon: Bell, shortcut: 'N', action: () => router.push('/Pages/Notification') },
    { id: 'settings', label: 'Settings', icon: Settings, shortcut: 'S', action: () => router.push('/Pages/Setting') },
    { id: 'new-post', label: 'Create New Post', icon: Plus, shortcut: 'C', action: () => router.push('/Pages/NewPost') },
    { id: 'logout', label: 'Logout Session', icon: LogOut, shortcut: 'L', action: logout, danger: true },
  ];

  const filteredActions = actions.filter(a => 
    a.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSelect = useCallback((action) => {
    action.action();
    setIsOpen(false);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredActions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredActions.length) % filteredActions.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredActions[selectedIndex]) {
        handleSelect(filteredActions[selectedIndex]);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-start justify-center pt-[15vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            className="relative w-full max-w-2xl bg-white dark:bg-black border border-gray-100 dark:border-threads-border rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Search Input */}
            <div className="flex items-center px-8 py-6 border-b border-gray-100 dark:border-threads-border gap-4">
              <Command className="w-5 h-5 text-gray-400" />
              <input
                ref={inputRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a command or search..."
                className="flex-1 bg-transparent border-none outline-none text-[18px] font-medium placeholder-gray-400 dark:text-white"
              />
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-[10px] font-black text-gray-400">
                ESC
              </div>
            </div>

            {/* Actions List */}
            <div className="flex-1 overflow-y-auto max-h-[50vh] p-4 no-scrollbar">
              {filteredActions.length === 0 ? (
                <div className="py-20 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-white/5 mx-auto flex items-center justify-center text-gray-300">
                    <Search size={32} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">No results found</p>
                    <p className="text-xs text-gray-500 font-medium mt-1">Try a different search term.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="px-4 py-2 mb-2">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Quick Actions</p>
                  </div>
                  {filteredActions.map((action, index) => (
                    <div
                      key={action.id}
                      onClick={() => handleSelect(action)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`
                        flex items-center justify-between px-6 py-4 rounded-2xl cursor-pointer transition-all duration-200
                        ${selectedIndex === index ? 'bg-gray-50 dark:bg-white/10' : 'hover:bg-gray-50 dark:hover:bg-white/5'}
                      `}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2.5 rounded-xl ${action.danger ? 'bg-red-50 dark:bg-red-500/10 text-red-500' : 'bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400'} ${selectedIndex === index ? (action.danger ? 'text-red-600' : 'text-black dark:text-white') : ''}`}>
                          <action.icon size={20} />
                        </div>
                        <span className={`text-[15px] font-bold ${action.danger ? 'text-red-500' : (selectedIndex === index ? 'text-black dark:text-white' : 'text-gray-600 dark:text-gray-400')}`}>
                          {action.label}
                        </span>
                      </div>
                      {action.shortcut && (
                        <div className="hidden sm:flex items-center gap-1 text-[11px] font-black text-gray-300 dark:text-white/10">
                          <span className="px-2 py-1 rounded-lg border border-gray-100 dark:border-white/5">{action.shortcut}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 bg-gray-50 dark:bg-white/[0.02] border-t border-gray-100 dark:border-threads-border flex items-center justify-between">
               <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded border border-gray-200 dark:border-white/10">↵</span>
                    <span>to select</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded border border-gray-200 dark:border-white/10">↑↓</span>
                    <span>to navigate</span>
                  </div>
               </div>
               <div className="flex items-center gap-2 opacity-30">
                  <Command size={14} />
                  <span className="text-[10px] font-black tracking-widest uppercase">Pallete v1.0</span>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default memo(CommandPalette);
