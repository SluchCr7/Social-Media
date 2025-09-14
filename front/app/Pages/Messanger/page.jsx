'use client';

import React, { useEffect, useState } from 'react';
import ChatSlider from './../../Component/ChatSlider';
import Chat from './../../Component/Chat';
import NoChat from './../../Component/NoChat';
import { useMessage } from '@/app/Context/MessageContext';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { FaBars } from 'react-icons/fa'; // 👈 أيقونة الهامبرجر

const MessangerSluchit = () => {
  const { selectedUser, setSelectedUser } = useMessage();
  const searchParams = useSearchParams();
  const [showSidebar, setShowSidebar] = useState(true); // للتحكم في ظهور السايدبار في الموبايل

  useEffect(() => {
    const userId = searchParams.get('userId');
    if (userId && !selectedUser) {
      axios
        .get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/${userId}`)
        .then((res) => {
          setSelectedUser(res.data);
          setShowSidebar(false); // لما يختار يفتح الشات على طول
        })
        .catch((err) => {
          console.error('Failed to fetch user for chat:', err);
        });
    }
  }, [searchParams, setSelectedUser, selectedUser]);

  return (
    <div className="w-full h-screen overflow-hidden bg-lightMode-bg dark:bg-darkMode-bg text-lightMode-text dark:text-darkMode-text">
      <div className="flex h-full w-full m-0 p-0">

        {/* Sidebar */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-30 
            w-[80%] max-w-[300px] 
            bg-white dark:bg-darkMode-menu 
            border-r border-gray-300 dark:border-gray-700 
            transform transition-transform duration-300 ease-in-out
            ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
            md:static md:translate-x-0 md:w-[280px]
          `}
        >
          <ChatSlider />
        </aside>

        {/* Overlay للموبايل */}
        {showSidebar && (
          <div
            className="fixed inset-0 bg-black/40 z-20 md:hidden"
            onClick={() => setShowSidebar(false)}
          />
        )}

        {/* Main Chat Area */}
        <main className="flex-1 w-full h-full relative">
          {/* زر الهامبرجر يظهر فقط في الموبايل */}
          <button
            onClick={() => setShowSidebar(true)}
            className="absolute top-4 left-4 z-10 p-2 rounded-md bg-lightMode-menu dark:bg-darkMode-menu text-lightMode-text dark:text-darkMode-text shadow md:hidden"
          >
            <FaBars size={20} />
          </button>

          {selectedUser ? (
            <Chat onBack={() => setShowSidebar(true)} />
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
