'use client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { motion } from 'framer-motion';

const NoChat = () => {
  return (
    <div className="flex flex-col items-center justify-center flex-1 w-full px-4 bg-lightMode-bg dark:bg-darkMode-bg">
      
      {/* Logo */}
      <Link href="/" className="mb-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Image
            src="/Logo.png"
            alt="Sluchit Logo"
            width={140}
            height={140}
            className="transition hover:scale-105 duration-300"
          />
        </motion.div>
      </Link>

      {/* Title */}
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="text-2xl font-semibold text-gray-800 dark:text-gray-100"
      >
        Welcome to {process.env.WEBSITE_NAME || "Zocial"}!
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-sm text-center"
      >
        Start a new conversation by selecting a chat from the sidebar or searching for a friend.
      </motion.p>

      {/* Hint */}
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="mt-6 text-xs text-gray-400 dark:text-gray-500"
      >
        Your messages will appear here once you start chatting.
      </motion.p>
    </div>
  );
};

export default NoChat;
