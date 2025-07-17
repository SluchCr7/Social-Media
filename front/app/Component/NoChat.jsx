'use client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const NoChat = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center min-h-screen w-full px-4 bg-lightMode-bg dark:bg-darkMode-bg">
      <Link href="/" className="mb-4">
        <Image
          src="/Logo.png"
          alt="Sluchit Logo"
          width={140}
          height={140}
          className="transition hover:scale-105 duration-300"
        />
      </Link>

      <h1 className="text-2xl font-semibold text-darkMode-text dark:text-lightMode-text">
        Welcome to {process.env.WEBSITE_NAME || "Zocial"}!
      </h1>

      <p className="mt-2 text-sm text-gray-500 max-w-sm">
        Start a new conversation by selecting a chat from the sidebar or searching for a friend.
      </p>

      <p className="mt-6 text-xs text-gray-400">Your messages will appear here once you start chatting.</p>
    </div>
  );
};

export default NoChat;
