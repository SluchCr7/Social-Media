'use client'
import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useAuth } from '../../Context/AuthContext'
import { useAside } from '../../Context/AsideContext'
import SidebarContent from './SidebarContent'
import { useUser } from '@/app/Context/UserContext'
import { useTranslate } from '@/app/Context/TranslateContext'

const Aside = ({ isCollapsed, setIsCollapsed }) => {
  const { user, logout } = useAuth()
  const { onlineUsers } = useUser()
  const { isMobile, setIsMobile, isMobileMenuOpen, setIsMobileMenuOpen } = useAside()
  const { language } = useTranslate();
  const isRTL = ['ar', 'fa', 'he', 'ur'].includes(language);

  useEffect(() => {
    if (typeof window === "undefined") return
    const handleResize = () => setIsMobile(window.innerWidth < 1024)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    setIsCollapsed(isMobile)
    if (!isMobile) setIsMobileMenuOpen(false)
  }, [isMobile, setIsMobileMenuOpen])

  return (
    <>
      {/* ===== Desktop Sidebar ===== */}
      <motion.aside
        animate={{
          width: isCollapsed ? 80 : 260,
          opacity: 1
        }}
        initial={{ opacity: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        className={`
          hidden md:flex fixed top-0 ${isRTL ? 'right-0 border-l' : 'left-0 border-r'} 
          flex-col h-screen 
          bg-white dark:bg-black
          border-gray-100 dark:border-threads-border
          p-4 z-50 transition-colors duration-500
        `}
      >
        <SidebarContent
          isCollapsed={isCollapsed}
          isMobile={false}
          setIsCollapsed={setIsCollapsed}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          user={{ ...user, logout }}
          onlineUsers={onlineUsers}
        />
      </motion.aside>

      {/* ===== Mobile Drawer ===== */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[1000] flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-[2px]"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.aside
              initial={{ x: isRTL ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? '100%' : '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={`
                relative w-[280px] h-full
                bg-white dark:bg-black
                p-6 flex flex-col shadow-2xl
                ${isRTL ? 'mr-auto' : 'ml-0'}
              `}
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400"
              >
                <X size={20} />
              </motion.button>

              <SidebarContent
                isCollapsed={false}
                isMobile={true}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
                user={{ ...user, logout }}
                onlineUsers={onlineUsers}
              />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Aside
