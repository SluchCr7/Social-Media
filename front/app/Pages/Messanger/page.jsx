'use client';

import React, { useEffect } from 'react';
import ChatSlider from './../../Component/ChatSlider';
import Chat from './../../Component/Chat';
import NoChat from './../../Component/NoChat';
import { useMessage } from '@/app/Context/MessageContext';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { generateMeta } from '@/app/utils/MetaDataHelper';

const MessangerSluchit = () => {
  const { selectedUser, setSelectedUser } = useMessage();
  const searchParams = useSearchParams();

  useEffect(() => {
    const userId = searchParams.get('userId');
    if (userId && !selectedUser) {
      // Fetch user data from backend and set selectedUser
      axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/${userId}`)
        .then((res) => {
          setSelectedUser(res.data);
        })
        .catch((err) => {
          console.error('Failed to fetch user for chat:', err);
        });
    }
  }, [searchParams, setSelectedUser, selectedUser]);

  return (
    <div className="w-full h-screen overflow-hidden bg-lightMode-bg dark:bg-darkMode-bg text-lightMode-text dark:text-darkMode-text">
      <div className="flex h-full w-full m-0 p-0 ">

        {/* Sidebar */}
        <aside className="w-[100%] md:w-[300px] lg:w-[280px] h-full border-r border-gray-300 dark:border-gray-700 bg-white dark:bg-darkMode-menu">
          <ChatSlider />
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 w-full h-full bg-lightMode-bg dark:bg-darkMode-bg">
          {selectedUser ? (
            <Chat />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <NoChat />
            </div>
          )}
        </main>
        
      </div>
    </div>
  );
};

export default MessangerSluchit;
