'use client'
import React, { useState, useEffect, memo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import { GoHome, GoSearch } from "react-icons/go"
import { CiUser, CiSettings } from "react-icons/ci"
import { SiGoogledisplayandvideo360 } from "react-icons/si"
import { FaPlus } from "react-icons/fa6"
import { RiUserCommunityLine } from 'react-icons/ri'
import { LuMessagesSquare } from "react-icons/lu"
import { MdOutlineOndemandVideo } from "react-icons/md"
import { IoTrophyOutline } from "react-icons/io5"
import { SlCalender } from "react-icons/sl"
import { FiChevronLeft, FiX } from "react-icons/fi"
import { useAuth } from '../Context/AuthContext'
import { useAside } from '../Context/AsideContext'

const Aside = () => {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { user, Logout, onlineUsers } = useAuth()
  const { isMobile, setIsMobile, isMobileMenuOpen, setIsMobileMenuOpen } = useAside()

  // Detect mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true)
    } else {
      setIsMobileMenuOpen(false)
    }
  }, [isMobile])

  const navSections = [
    {
      title: "Main",
      items: [
        { icon: <GoHome />, text: "Home", link: "/" },
        { icon: <GoSearch />, text: "Explore", link: "/Pages/Explore" },
        { icon: <MdOutlineOndemandVideo />, text: "Videos", link: "/Pages/Videos" },
      ]
    },
    {
      title: "Community",
      items: [
        { icon: <FaPlus />, text: "New Zoc", link: "/Pages/NewPost" },
        { icon: <RiUserCommunityLine />, text: "Community", link: "/Pages/CommunityMain" },
        { icon: <LuMessagesSquare />, text: "Messenger", link: "/Pages/Messanger" },
      ]
    },
    {
      title: "Personal",
      items: [
        { icon: <SiGoogledisplayandvideo360 />, text: "Shorts", link: "/Pages/Reels" },
        { icon: <IoTrophyOutline />, text: "Challenge", link: "/Pages/Challenge" },
        { icon: <SlCalender />, text: "Calendar", link: "/Pages/Calender" },
        { icon: <CiUser />, text: "Profile", link: "/Pages/Profile" },
        { icon: <CiSettings />, text: "Settings", link: "/Pages/Setting" },
      ]
    }
  ]

  const baseStyle = `relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out`
  const activeStyle = `bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md`
  const inactiveStyle = `hover:bg-lightMode-bg/10 dark:hover:bg-darkMode-bg/10 text-lightMode-text dark:text-darkMode-text`

  const SidebarContent = memo(({ mobile = false }) => {
    const collapsed = mobile ? false : isCollapsed
    return (
      <>
        {/* Logo + Collapse Button */}
        <div className="flex items-center justify-between mb-6">
          {!collapsed && (
            <span className="text-lg font-bold text-lightMode-text dark:text-darkMode-text truncate">
              {process.env.NEXT_PUBLIC_WEBSITE_NAME || "Zocial"}
            </span>
          )}
          {!isMobile && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-xl p-1 rounded hover:bg-lightMode-bg/10 dark:hover:bg-darkMode-bg/10 transition-all duration-300"
            >
              <FiChevronLeft className={`${isCollapsed ? "rotate-180" : ""}`} />
            </button>
          )}
        </div>

        {/* Nav Sections */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 space-y-6">
          {navSections.map(section => (
            <div key={section.title}>
              {!collapsed && (
                <h4 className="px-3 mb-2 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">{section.title}</h4>
              )}
              <div className="flex flex-col gap-1">
                {section.items.map(({ icon, text, link }) => {
                  const isActive = pathname === link
                  return (
                    <Link
                      key={text}
                      href={link}
                      onClick={() => setIsMobileMenuOpen(false)}
                      data-tooltip-id="sidebar-tooltip"
                      data-tooltip-content={text}
                      className={`${baseStyle} ${isActive ? activeStyle : inactiveStyle}`}
                    >
                      <span className="text-xl">{icon}</span>
                      {!collapsed && <span className="flex-1">{text}</span>}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* User Profile + Logout */}
        <div className={`mt-auto border-t pt-4 px-2`}>
          <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            
            {/* User Info */}
            <div className="flex items-center gap-3 truncate">
              <div className={`relative p-[2px] rounded-full ${user?.stories?.length > 0 ? 'border-2 border-red-500' : ''}`}>
                <Image
                  src={user?.profilePhoto?.url || '/default-profile.png'}
                  alt="User Profile"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover"
                />
                {onlineUsers?.includes(user?._id) && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-white dark:border-gray-900"></span>
                )}
              </div>
              {!collapsed && (
                <div className="flex flex-col truncate">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {user?.username || "User Name"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.profileName || "@user_name"}
                  </p>
                </div>
              )}
            </div>

            {/* Logout Icon */}
            <button
              onClick={Logout}
              className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-700 transition-colors flex items-center justify-center"
              aria-label="Logout"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5" />
              </svg>
            </button>
          </div>
        </div>

        {collapsed && <Tooltip id="sidebar-tooltip" place="right" />}
      </>
    )
  })

  return (
    <>
      {/* ===== Desktop Sidebar ===== */}
      <motion.aside
        animate={{ width: isCollapsed ? 85 : 260 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="hidden lg:flex flex-col h-screen bg-lightMode-menu dark:bg-darkMode-menu border-r p-3 hover-expanded"
      >
        <SidebarContent />
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
            <SidebarContent mobile />
          </motion.aside>
        </div>
      )}
    </>
  )
}

SidebarContent.displayName = "SidebarContent"
export default Aside
