import Image from 'next/image';
import React from 'react';

const NoChat = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center min-h-[100vh] w-full px-4">
      <Image src="/Logo.png" alt="nochat" width={200} height={200} />
      <span className="font-bold text-darkMode-text dark:text-lightMode-text text-lg">Sluchit</span>
      <p className="w-full max-w-sm text-sm text-gray-500 mt-2">
        Select a chat to start messaging from the sidebar or search for a friend.
      </p>
    </div>
  );
};

export default NoChat;
