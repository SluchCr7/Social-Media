// 'use client'
// import React, { useState, useEffect, memo } from 'react'

// import { Tooltip } from 'react-tooltip'
// import { motion } from 'framer-motion'
// import { FiChevronLeft, FiX } from "react-icons/fi"
// import 'react-tooltip/dist/react-tooltip.css'
// import { useAuth } from '../../Context/AuthContext'
// import { useAside } from '../../Context/AsideContext'
// import SidebarContent from './SidebarContent'
// import { useUser } from '@/app/Context/UserContext'
// import { useTranslate } from '@/app/Context/TranslateContext'




// const Aside = ({isCollapsed, setIsCollapsed}) => {
//   const { user, Logout } = useAuth()
//   const {onlineUsers} = useUser()
//   const { isMobile, setIsMobile, isMobileMenuOpen, setIsMobileMenuOpen } = useAside()
//   // const [isCollapsed, setIsCollapsed] = useState(false)
//   const { language } = useTranslate();
//   const isRTL = ['ar', 'fa', 'he', 'ur'].includes(language); // true لو RTL
//   // Detect mobile safely (SSR safe)
//   useEffect(() => {
//     if (typeof window === "undefined") return
//     const handleResize = () => setIsMobile(window.innerWidth < 1024)
//     handleResize()
//     window.addEventListener("resize", handleResize)
//     return () => window.removeEventListener("resize", handleResize)
//   }, [])

//   // Adjust collapsed on mobile
//   useEffect(() => {
//     setIsCollapsed(isMobile)
//     if (!isMobile) setIsMobileMenuOpen(false)
//   }, [isMobile, setIsMobileMenuOpen])

//   return (
//     <>
//       {/* ===== Desktop Sidebar ===== */}
//       <motion.aside
//         animate={{ width: isCollapsed ? 80 : 260 }}
//         transition={{ type: 'spring', stiffness: 300, damping: 30 }}
//         className={`hidden md:flex fixed top-0 ${isRTL ? 'right-0' : 'left-0'} flex-col h-screen bg-lightMode-menu dark:bg-darkMode-menu border-r p-3 hover-expanded`}
//       >

//         <SidebarContent
//           isCollapsed={isCollapsed}
//           isMobile={false}
//           setIsCollapsed={setIsCollapsed}
//           setIsMobileMenuOpen={setIsMobileMenuOpen}
//           user={{ ...user, Logout }}
//           onlineUsers={onlineUsers}
//         />
//       </motion.aside>

//       {/* ===== Mobile Drawer ===== */}
//       {isMobileMenuOpen && (
//         <div className="fixed inset-0 z-[1000] flex">
//           <div
//             className="fixed inset-0 bg-black/40"
//             onClick={() => setIsMobileMenuOpen(false)}
//           />
//           {/* <motion.aside
//             initial={{ x: -300 }}
//             animate={{ x: 0 }}
//             exit={{ x: -300 }}
//             transition={{ type: 'spring', stiffness: 260, damping: 25 }}
//             className="relative w-72 bg-lightMode-menu dark:bg-darkMode-menu p-4 flex flex-col"
//           > */}
//           <motion.aside
//             initial={{ x: isRTL ? 300 : -300 }}
//             animate={{ x: 0 }}
//             exit={{ x: isRTL ? 300 : -300 }}
//             transition={{ type: 'spring', stiffness: 260, damping: 25 }}
//             className={`relative w-72 bg-lightMode-menu dark:bg-darkMode-menu p-4 flex flex-col ${isRTL ? 'right-0' : 'left-0'}`}
//           >

//             <button
//               onClick={() => setIsMobileMenuOpen(false)}
//               className="absolute top-4 right-4 text-2xl text-lightMode-text dark:text-darkMode-text"
//             >
//               <FiX />
//             </button>
//             <SidebarContent
//               isCollapsed={false} // always expanded in mobile drawer
//               isMobile={true}
//               setIsMobileMenuOpen={setIsMobileMenuOpen}
//               user={{ ...user, Logout }}
//               onlineUsers={onlineUsers}
//             />
//           </motion.aside>
//         </div>
//       )}
//     </>
//   )
// }

// export default Aside

'use client'
import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX } from 'react-icons/fi'
import { useAside } from '@/app/Context/AsideContext'
import { useAuth } from '@/app/Context/AuthContext'
import { useUser } from '@/app/Context/UserContext'
import { useTranslate } from '@/app/Context/TranslateContext'
import SidebarContent from './SidebarContent'

export default function Aside({ isCollapsed, setIsCollapsed }) {
  const { user, Logout } = useAuth()
  const { onlineUsers } = useUser()
  const { isMobile, setIsMobile, isMobileMenuOpen, setIsMobileMenuOpen } = useAside()
  const { language } = useTranslate()
  const isRTL = ['ar', 'fa', 'he', 'ur'].includes(language)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const handleResize = () => setIsMobile(window.innerWidth < 1024)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    setIsCollapsed(isMobile)
    if (!isMobile) setIsMobileMenuOpen(false)
  }, [isMobile])

  return (
    <>
      {/* ===== Desktop Sidebar ===== */}
      <motion.aside
        onMouseEnter={() => isCollapsed && setIsCollapsed(false)}
        onMouseLeave={() => !isMobile && setIsCollapsed(true)}
        animate={{ width: isCollapsed ? 80 : 280 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`hidden md:flex fixed top-0 ${isRTL ? 'right-0' : 'left-0'} 
          flex-col h-screen 
          bg-gradient-to-b from-lightMode-menu to-lightMode-bg/80 
          dark:from-darkMode-menu dark:to-darkMode-bg/70 
          border-r shadow-md backdrop-blur-xl 
          z-40 transition-all duration-300`}
      >
        <SidebarContent
          isCollapsed={isCollapsed}
          isMobile={false}
          setIsCollapsed={setIsCollapsed}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          user={{ ...user, Logout }}
          onlineUsers={onlineUsers}
        />
      </motion.aside>

      {/* ===== Mobile Drawer ===== */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[1000] flex">
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.aside
              initial={{ x: isRTL ? 300 : -300 }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? 300 : -300 }}
              transition={{ type: 'spring', stiffness: 260, damping: 25 }}
              className={`relative w-72 
                bg-gradient-to-b from-lightMode-menu to-lightMode-bg/80 
                dark:from-darkMode-menu dark:to-darkMode-bg/70 
                p-5 flex flex-col shadow-2xl ${isRTL ? 'right-0' : 'left-0'} rounded-tr-2xl rounded-br-2xl`}
            >
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-4 right-4 text-2xl text-lightMode-text dark:text-darkMode-text"
              >
                <FiX />
              </button>

              <SidebarContent
                isCollapsed={false}
                isMobile={true}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
                user={{ ...user, Logout }}
                onlineUsers={onlineUsers}
              />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
