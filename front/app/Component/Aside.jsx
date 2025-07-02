'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
// Icons
import { GoHome, GoSearch } from "react-icons/go"
import { CiUser, CiSettings } from "react-icons/ci"
import { FaPlus } from "react-icons/fa6"
import { LuMessageCircle } from "react-icons/lu"
import { IoIosLogIn, IoIosLogOut, IoIosNotificationsOutline } from "react-icons/io"
import { useAuth } from '../Context/AuthContext'
import { RiUserCommunityLine } from 'react-icons/ri'

const Aside = () => {
  const pathname = usePathname()
  const { Logout, user, isLogin } = useAuth()

  const items = [
    { icon: <GoHome />, text: "Home", link: "/", hide: false },
    { icon: <GoSearch />, text: "Search", link: "/Pages/Search", hide: false },
    { icon: <FaPlus />, text: "New Post", link: "/Pages/NewPost", hide: true },
    { icon: <LuMessageCircle />, text: "Messanger", link: "/Pages/Messanger", hide: true },
    {
      icon: <RiUserCommunityLine />,
      text: "Community",
      link: "/Pages/CommunityMain", 
      hide : true
    },
    { icon: <CiSettings />, text: "Settings", link: "/Pages/Setting", hide: true },
    { icon: <CiUser />, text: "Profile", link: "/Pages/Profile", hide: true }
  ]

  const baseStyle = `flex items-center gap-4 px-4 py-2 rounded-lg text-sm font-medium w-full cursor-pointer transition-all duration-300`

  const activeStyle = `bg-gradient-to-r from-lightMode-text2 to-lightMode-text dark:from-darkMode-text2 dark:to-darkMode-text text-lightMode-bg dark:text-darkMode-bg shadow-inner`
  const inactiveStyle = `hover:bg-lightMode-menu dark:hover:bg-darkMode-menu text-lightMode-text hover:text-lightMode-fg dark:text-darkMode-text dark:hover:text-darkMode-fg`

  return (
    <aside className="border-r w-max lg:w-[15%] bg-lightMode-menu dark:bg-darkMode-menu pr-3 min-h-screen fixed z-0 left-0 pl-5 py-10 flex items-center lg:items-start flex-col gap-6">
      
      {/* Logo */}
      <div className="flex items-start w-full">
        <Image src="/Logo.png" alt="logo" width={40} height={40} className="rounded-full w-14 h-14 object-cover" />
      </div>

      {/* Navigation Items */}
      <div className="flex flex-col gap-3 items-center lg:items-start w-full">
        {items
          .filter(item => isLogin || !item.hide)
          .map(item => {
            const isActive = pathname === item.link

            const className = `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`

            // If item has custom click (e.g., Notifications)
            if (!item.link && item.onClick) {
              return (
                <div key={item.text} onClick={item.onClick} className={className}>
                  <span className="text-xl">{item.icon}</span>
                  <span className="hidden lg:flex">{item.text}</span>
                </div>
              )
            }

            // Normal link item
            return (
              <Link href={item.link} key={item.text} className={className}>
                <span className="text-xl">{item.icon}</span>
                <span className="hidden lg:flex">{item.text}</span>
              </Link>
            )
          })}
      </div>

      {/* Logout Button */}
      {isLogin && (
        <div
          className="flex items-center gap-4 w-full px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:text-red-500 hover:bg-[#1a1a1a] transition-all duration-300 cursor-pointer mt-auto"
          onClick={Logout}
        >
          <IoIosLogOut className="text-2xl" />
          <span className="hidden lg:flex">Logout</span>
        </div>
      )}

      {/* Login Link */}
      {!isLogin && (
        <Link
          href="/Pages/Login"
          className="flex items-center gap-4 w-full px-4 py-3 rounded-lg text-sm font-medium text-blue-400 hover:text-blue-500 hover:bg-[#1a1a1a] transition-all duration-300 cursor-pointer mt-auto"
        >
          <IoIosLogIn className="text-2xl" />
          <span className="hidden lg:flex">Login</span>
        </Link>
      )}
    </aside>
  )
}

export default Aside
