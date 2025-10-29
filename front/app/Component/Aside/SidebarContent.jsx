// 'use client';
// import React, { useEffect } from 'react'
// import { navSections } from '../../utils/Data'
// import Link from 'next/link'
// import Image from 'next/image'
// import { usePathname } from 'next/navigation'
// import { memo } from 'react'
// import { FiChevronLeft } from "react-icons/fi"
// import { useTranslation } from 'react-i18next';

// const baseStyle = `relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out`
// const activeStyle = `bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md`
// const inactiveStyle = `hover:bg-lightMode-bg/10 dark:hover:bg-darkMode-bg/10 text-lightMode-text dark:text-darkMode-text`

// const SidebarContent = memo(({ isCollapsed,setIsCollapsed, isMobile, setIsMobileMenuOpen, user, onlineUsers }) => {
//   const {t} = useTranslation()
//   const pathname = usePathname(); 
//   return (
//     <>
//       {/* Logo + Collapse Button */}
//       <div className="flex items-center justify-between mb-6 px-2">
//         {!isCollapsed && (
//           <span className="text-lg font-bold text-lightMode-text dark:text-darkMode-text truncate">
//             {process.env.NEXT_PUBLIC_WEBSITE_NAME || "Zocial"}
//           </span>
//         )}
//         {!isMobile && (
//           <button
//             onClick={() => setIsCollapsed(!isCollapsed)}
//             className="text-xl p-1 rounded hover:bg-lightMode-bg/10 dark:hover:bg-darkMode-bg/10 transition-all duration-300"
//           >
//             <FiChevronLeft className={`${isCollapsed ? "rotate-180" : ""}`} />
//           </button>
//         )}
//       </div>

//       {/* Nav Sections */}
//       <div className="flex-1 overflow-y-auto aside_scroll space-y-6">
//         {navSections.map(section => (
//           <div key={section.title}>
//             {!isCollapsed && (
//               <h4 className="px-3 mb-2 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">{t(section.title)}</h4>
//             )}
//             <div className="flex flex-col gap-1">
//               {section.items.map(({ icon, text, link }) => {
//                 const isActive = pathname === link;
//                 return (
//                   <Link
//                     key={text}
//                     href={link}
//                     onClick={() => setIsMobileMenuOpen(false)}
//                     className={`${baseStyle} ${isActive ? activeStyle : inactiveStyle}`}
//                   >
//                     <span className="text-xl">{icon}</span>
//                     {!isCollapsed && <span className="flex-1">{t(text)}</span>}
//                   </Link>
//                 )
//               })}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* User Profile + Logout */}
//       <div className={`mt-auto border-t pt-4 px-2`}>
//         <div className="flex items-center justify-between py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
//           {/* User Info */}
//           {!isCollapsed && (
//             <div className="flex items-center gap-3 truncate">
//               <div className={`relative p-[2px] rounded-full ${user?.stories?.length > 0 ? 'border-2 border-red-500' : ''}`}>
//               <Image
//                 src={user?.profilePhoto?.url || '/default-profile.png'}
//                 alt="User Profile"
//                 width={40}
//                 height={40}
//                 className="rounded-full w-10 h-10 min-w-10 aspect-square object-cover "
//               />
//               {onlineUsers?.includes(user?._id) && (
//                 <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-white dark:border-gray-900"></span>
//               )}
//               </div>
            
//               <div className="flex flex-col truncate">
//                 <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
//                   {user?.username || "User Name"}
//                 </p>
//                 <p className="text-xs text-gray-500 truncate">
//                   {user?.profileName || "@user_name"}
//                 </p>
//               </div>
//             </div>
//           )}

//           {/* Logout Icon */}
//           <button
//             onClick={user?.Logout}
//             className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-700 transition-colors flex items-center justify-center"
//             aria-label="Logout"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5 text-red-600"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5" />
//             </svg>
//           </button>
//         </div>
//       </div>
//     </>
//   )
// });


// SidebarContent.displayName = "SidebarContent"
// export default SidebarContent
'use client';
import React, { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { navSections } from '../../utils/Data';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FiChevronLeft, FiChevronDown } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const baseStyle = `relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out`;
const activeStyle = `bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 shadow-inner`;
const inactiveStyle = `hover:bg-lightMode-bg/10 dark:hover:bg-darkMode-bg/10 text-lightMode-text dark:text-darkMode-text`;

const SidebarContent = memo(({ isCollapsed, setIsCollapsed, isMobile, setIsMobileMenuOpen, user, onlineUsers }) => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [openSection, setOpenSection] = useState('');

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-2">
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-lg font-bold text-lightMode-text dark:text-darkMode-text truncate"
          >
            {process.env.NEXT_PUBLIC_WEBSITE_NAME || 'Zocial'}
          </motion.span>
        )}
        {!isMobile && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-xl p-1 rounded-lg hover:bg-lightMode-bg/10 dark:hover:bg-darkMode-bg/10 transition-all duration-300"
          >
            <motion.div animate={{ rotate: isCollapsed ? 180 : 0 }}>
              <FiChevronLeft />
            </motion.div>
          </motion.button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto aside_scroll space-y-6 px-1">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1">
            {!isCollapsed && (
              <button
                className="flex items-center justify-between w-full px-3 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400"
                onClick={() => setOpenSection(prev => (prev === section.title ? '' : section.title))}
              >
                {t(section.title)}
                <motion.div animate={{ rotate: openSection === section.title ? 180 : 0 }}>
                  <FiChevronDown size={14} />
                </motion.div>
              </button>
            )}

            <AnimatePresence>
              {openSection === section.title && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col gap-1 mt-1"
                >
                  {section.items.map(({ icon, text, link }) => {
                    const isActive = pathname === link;
                    return (
                      <Link
                        key={text}
                        href={link}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`${baseStyle} ${isActive ? activeStyle : inactiveStyle}`}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="activeIndicator"
                            className="absolute left-0 w-1 h-full bg-indigo-500 rounded-r-lg"
                          />
                        )}
                        <span className="text-xl">{icon}</span>
                        {!isCollapsed && <span className="flex-1 truncate">{t(text)}</span>}
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* User Section */}
      <div className="mt-auto border-t border-lightMode-bg/20 dark:border-darkMode-bg/30 pt-4 px-2">
        <div className="flex items-center justify-between py-2 rounded-xl bg-white/30 dark:bg-darkMode-bg/30 backdrop-blur-md border border-white/10 transition-all">
          {!isCollapsed && (
            <div className="flex items-center gap-3 truncate">
              <div className={`relative p-[2px] rounded-full ${user?.stories?.length > 0 ? 'border-2 border-red-500' : ''}`}>
                <Image
                  src={user?.profilePhoto?.url || '/default-profile.png'}
                  alt="User Profile"
                  width={40}
                  height={40}
                  className="rounded-full w-10 h-10 object-cover"
                />
                {onlineUsers?.includes(user?._id) && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-white dark:border-gray-900" />
                )}
              </div>
              <div className="flex flex-col truncate">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {user?.username || 'User Name'}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.profileName || '@user_name'}</p>
              </div>
            </div>
          )}
          <button
            onClick={user?.Logout}
            className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-700/40 transition-colors flex items-center justify-center"
            aria-label="Logout"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
});

SidebarContent.displayName = 'SidebarContent';
export default SidebarContent;
