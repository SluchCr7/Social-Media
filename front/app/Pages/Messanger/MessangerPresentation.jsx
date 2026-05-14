'use client';

import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, MessageSquare, ChevronLeft } from 'lucide-react';
import Chat from '@/app/Component/ChatMessngerComponents/Chat';
import ChatSlider from '@/app/Component/ChatMessngerComponents/ChatSlider';
import NoChat from '@/app/Component/ChatMessngerComponents/NoChat';

const MessangerPresentation = memo(({
  showSidebar,
  setShowSidebar,
  selectedUser
}) => {
  return (
    <div className="flex h-screen w-full bg-white dark:bg-black overflow-hidden relative">
      {/* Sidebar Panel */}
      <motion.aside
        initial={false}
        animate={{
          x: 0,
          width: showSidebar ? '380px' : '0px',
          opacity: showSidebar ? 1 : 0
        }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className={`
          relative h-full border-r border-gray-100 dark:border-threads-border
          z-30 bg-white dark:bg-black
          hidden md:flex flex-col flex-shrink-0
        `}
      >
        <ChatSlider />
      </motion.aside>

      {/* Mobile Sidebar (Fixed/Absolute) */}
      <AnimatePresence>
        {showSidebar && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-[100] w-[85%] bg-white dark:bg-black border-r border-gray-100 dark:border-threads-border md:hidden"
          >
            <ChatSlider />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {showSidebar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSidebar(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90] md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <main className="flex-1 h-full relative flex flex-col bg-white dark:bg-black overflow-hidden">
        {/* Mobile Header / Toggle */}
        <header className="flex md:hidden items-center justify-between p-4 border-b border-gray-100 dark:border-threads-border bg-white dark:bg-black z-20">
          <button
            onClick={() => setShowSidebar(true)}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-sm font-bold tracking-tight">
            {selectedUser ? selectedUser.username : "Messenger"}
          </h1>
          <div className="w-8" /> {/* Spacer */}
        </header>

        {selectedUser ? (
          <div className="w-full h-full flex flex-col relative">
            <Chat onBack={() => setShowSidebar(true)} />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center p-8 text-center">
            <NoChat />
          </div>
        )}
      </main>

      {/* Desktop Toggle Button (Float) */}
      {!showSidebar && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setShowSidebar(true)}
          className="hidden md:flex fixed bottom-8 left-8 z-50 p-4 bg-black dark:bg-white text-white dark:text-black rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all"
        >
          <MessageSquare size={24} />
        </motion.button>
      )}
    </div>
  );
});

MessangerPresentation.displayName = 'MessangerPresentation';

export default MessangerPresentation;