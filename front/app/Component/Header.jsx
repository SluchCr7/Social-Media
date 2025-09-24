'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { Bell, MessageCircle } from 'lucide-react';
import { useNotify } from '../Context/NotifyContext';
import { useAuth } from '../Context/AuthContext';
import { IoIosLogIn } from "react-icons/io";
import { FiMenu } from "react-icons/fi";
import { useAside } from '../Context/AsideContext';
import ReelUploadModal from './MenuUploadReel';
import { RiVideoUploadLine } from "react-icons/ri";

// const Header = ({ unReadedMessage, setShowNotifications }) => {
//   const { unreadCount } = useNotify();
//   const { isLogin } = useAuth();
//   const {isMobile,setIsMobileMenuOpen} = useAside()
//   const [showModelAddReel , setShowModelAddReel] = useState(false)
//   const handleBellClick = () => {
//     setShowNotifications(true);
//   };

//   return (
//     <>
//       <ReelUploadModal isOpen={showModelAddReel} onClose={() => setShowModelAddReel(false)} />
//       <header className="sticky top-0 z-50 bg-white/70 dark:bg-darkMode-bg/70 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm">
//         <div className="w-full flex items-center justify-between py-4 px-3 md:px-6 ">
//           {/* Title */}
//           <span className="text-lightMode-text dark:text-darkMode-text font-bold text-lg md:text-xl tracking-[3px] uppercase">
//             Home
//           </span>

//           {/* Actions */}
//           <div className="flex items-center gap-4">
//             {isLogin ? (
//               <>
//                 {/* Notifications */}
//                 <div className="relative">
//                   <button
//                     onClick={handleBellClick}
//                     className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-darkMode-bg2 transition-all duration-200 ease-in-out hover:scale-110 hover:rotate-3"
//                   >
//                     <Bell className="w-5 h-5 text-lightMode-text dark:text-darkMode-text" />
//                   </button>
//                   {unreadCount > 0 && (
//                     <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-md">
//                       {unreadCount > 99 ? '99+' : unreadCount}
//                     </span>
//                   )}
//                 </div>

//                 {/* Upload Reel */}
//                 <div className="relative">
//                   <button
//                     onClick={() => setShowModelAddReel(true)}
//                     className="p-2 rounded-full bg-gradient-to-r from-pink-500 to-orange-400 text-white shadow-md hover:scale-110 transition-all duration-200 ease-in-out"
//                   >
//                     <RiVideoUploadLine className="w-5 h-5" />
//                   </button>
//                 </div>

//                 {/* Messenger */}
//                 <Link href="/Pages/Messanger" className="relative">
//                   <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-darkMode-bg2 transition-all duration-200 ease-in-out hover:scale-110 hover:rotate-3">
//                     <MessageCircle className="w-5 h-5 text-lightMode-text dark:text-darkMode-text" />
//                   </button>
//                   {unReadedMessage > 0 && (
//                     <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-md">
//                       {unReadedMessage > 99 ? '99+' : unReadedMessage}
//                     </span>
//                   )}
//                 </Link>

//                 {/* Menu (Mobile Only) */}
//                 {isMobile && (
//                   <div className="flex lg:hidden">
//                     <button
//                       onClick={() => setIsMobileMenuOpen(true)}
//                       className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-darkMode-bg2 transition-all duration-200 ease-in-out hover:scale-110 hover:rotate-3"
//                     >
//                       <FiMenu className="w-5 h-5 text-lightMode-text dark:text-darkMode-text" />
//                     </button>
//                   </div>
//                 )}
//               </>
//             ) : (
//               <Link href="/Pages/Login">
//                 <IoIosLogIn
//                   aria-label="Login"
//                   className="w-6 h-6 text-lightMode-text dark:text-darkMode-text hover:text-lightMode-text2 dark:hover:text-darkMode-text hover:scale-110 transition-transform"
//                 />
//               </Link>
//             )}
//           </div>
//         </div>
//       </header>
//     </>

//   );
// };

// export default Header;


const Header = ({ unReadedMessage, setShowNotifications, activeTab, setActiveTab }) => {
  const { unreadCount } = useNotify();
  const { isLogin } = useAuth();
  const { isMobile, setIsMobileMenuOpen } = useAside();
  const [showModelAddReel , setShowModelAddReel] = useState(false);

  const handleBellClick = () => {
    setShowNotifications(true);
  };

  return (
    <>
      <ReelUploadModal isOpen={showModelAddReel} onClose={() => setShowModelAddReel(false)} />
      <header className="sticky top-0 z-50 bg-white/70 dark:bg-darkMode-bg/70 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="w-full flex items-center justify-between px-3 md:px-6">
          
          {/* ✅ Tabs */}
          <div className="flex gap-6 relative -mb-[7px]">
            <button
              onClick={() => setActiveTab("following")}
              className={`pb-2 border-b-2 transition-colors ${
                activeTab === "following"
                  ? "border-blue-500 text-blue-500 font-medium"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Following
            </button>
            <button
              onClick={() => setActiveTab("forYou")}
              className={`pb-2 border-b-2 transition-colors ${
                activeTab === "forYou"
                  ? "border-blue-500 text-blue-500 font-medium"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              For You
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 py-3">
            {isLogin ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={handleBellClick}
                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-darkMode-bg2 transition-all duration-200 ease-in-out hover:scale-110 hover:rotate-3"
                  >
                    <Bell className="w-5 h-5 text-lightMode-text dark:text-darkMode-text" />
                  </button>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-md">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </div>

                {/* Upload Reel */}
                <div className="relative">
                  <button
                    onClick={() => setShowModelAddReel(true)}
                    className="p-2 rounded-full bg-gradient-to-r from-pink-500 to-orange-400 text-white shadow-md hover:scale-110 transition-all duration-200 ease-in-out"
                  >
                    <RiVideoUploadLine className="w-5 h-5" />
                  </button>
                </div>

                {/* Messenger */}
                <Link href="/Pages/Messanger" className="relative">
                  <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-darkMode-bg2 transition-all duration-200 ease-in-out hover:scale-110 hover:rotate-3">
                    <MessageCircle className="w-5 h-5 text-lightMode-text dark:text-darkMode-text" />
                  </button>
                  {unReadedMessage > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-md">
                      {unReadedMessage > 99 ? '99+' : unReadedMessage}
                    </span>
                  )}
                </Link>

                {/* Menu (Mobile Only) */}
                {isMobile && (
                  <div className="flex lg:hidden">
                    <button
                      onClick={() => setIsMobileMenuOpen(true)}
                      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-darkMode-bg2 transition-all duration-200 ease-in-out hover:scale-110 hover:rotate-3"
                    >
                      <FiMenu className="w-5 h-5 text-lightMode-text dark:text-darkMode-text" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link href="/Pages/Login">
                <IoIosLogIn
                  aria-label="Login"
                  className="w-6 h-6 text-lightMode-text dark:text-darkMode-text hover:text-lightMode-text2 dark:hover:text-darkMode-text hover:scale-110 transition-transform"
                />
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
