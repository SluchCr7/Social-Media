'use client'
import React, { useState, useEffect, memo } from 'react'

import { Tooltip } from 'react-tooltip'
import { motion } from 'framer-motion'
import { FiChevronLeft, FiX } from "react-icons/fi"
import 'react-tooltip/dist/react-tooltip.css'
import { useAuth } from '../../Context/AuthContext'
import { useAside } from '../../Context/AsideContext'
import SidebarContent from './SidebarContent'
import { useUser } from '@/app/Context/UserContext'




const Aside = ({isCollapsed, setIsCollapsed}) => {
  const { user, Logout } = useAuth()
  const {onlineUsers} = useUser()
  const { isMobile, setIsMobile, isMobileMenuOpen, setIsMobileMenuOpen } = useAside()
  // const [isCollapsed, setIsCollapsed] = useState(false)

  // Detect mobile safely (SSR safe)
  useEffect(() => {
    if (typeof window === "undefined") return
    const handleResize = () => setIsMobile(window.innerWidth < 1024)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Adjust collapsed on mobile
  useEffect(() => {
    setIsCollapsed(isMobile)
    if (!isMobile) setIsMobileMenuOpen(false)
  }, [isMobile, setIsMobileMenuOpen])

  return (
    <>
      {/* ===== Desktop Sidebar ===== */}
      <motion.aside
        animate={{ width: isCollapsed ? 80 : 260 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="hidden fixed top-0 left-0 lg:flex flex-col h-screen bg-lightMode-menu dark:bg-darkMode-menu border-r p-3 hover-expanded"
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
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[1000] flex">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', stiffness: 260, damping: 25 }}
            className="relative w-72 bg-lightMode-menu dark:bg-darkMode-menu p-4 flex flex-col"
          >
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-4 right-4 text-2xl text-lightMode-text dark:text-darkMode-text"
            >
              <FiX />
            </button>
            <SidebarContent
              isCollapsed={false} // always expanded in mobile drawer
              isMobile={true}
              setIsMobileMenuOpen={setIsMobileMenuOpen}
              user={{ ...user, Logout }}
              onlineUsers={onlineUsers}
            />
          </motion.aside>
        </div>
      )}
    </>
  )
}

export default Aside
