'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { GoHome, GoSearch } from "react-icons/go"
import { CiUser, CiSettings } from "react-icons/ci"
import { FaPlus } from "react-icons/fa6"
import { IoIosLogIn, IoIosLogOut } from "react-icons/io"
import { RiUserCommunityLine } from 'react-icons/ri'
import { FiMenu } from "react-icons/fi"
import { MdClose } from "react-icons/md"
import { useAuth } from '../Context/AuthContext'

const Aside = () => {
  const pathname = usePathname()
  const { Logout, isLogin, isAuthChecked } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  if (!isAuthChecked) return null;

  const navItems = [
    { icon: <GoHome />, text: "Home", link: "/", hideForGuests: false },
    { icon: <GoSearch />, text: "Search", link: "/Pages/Search", hideForGuests: false },
    { icon: <FaPlus />, text: "New Post", link: "/Pages/NewPost", hideForGuests: true },
    { icon: <RiUserCommunityLine />, text: "Community", link: "/Pages/CommunityMain", hideForGuests: true },
    { icon: <CiSettings />, text: "Settings", link: "/Pages/Setting", hideForGuests: true },
    { icon: <CiUser />, text: "Profile", link: "/Pages/Profile", hideForGuests: true },
  ];

  const baseStyle = `flex items-center gap-4 px-4 py-2 rounded-lg text-sm font-medium w-full cursor-pointer transition-all duration-300`;
  const activeStyle = `bg-gradient-to-r from-lightMode-text2 to-lightMode-text dark:from-darkMode-text2 dark:to-darkMode-text text-white dark:text-black shadow-inner`;
  const inactiveStyle = `hover:bg-lightMode-bg/10 dark:hover:bg-darkMode-bg/10 text-lightMode-text dark:text-darkMode-text`;

  const renderLinks = () => (
    <div className="flex flex-col gap-3 w-full">
      {navItems
        .filter(item => isLogin || !item.hideForGuests)
        .map(({ icon, text, link }) => {
          const isActive = pathname === link;
          return (
            <Link
              key={text}
              href={link}
              className={`${baseStyle} ${isActive ? activeStyle : inactiveStyle}`}
              onClick={() => setIsMobileMenuOpen(false)} // يغلق القائمة في الجوال
            >
              <span className="text-xl">{icon}</span>
              <span className="">{text}</span>
            </Link>
          );
        })}
    </div>
  );

  const renderAuthAction = () => (
    <div className="mt-auto w-full">
      {isLogin ? (
        <div
          onClick={() => { Logout(); setIsMobileMenuOpen(false); }}
          className="flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:text-red-500 hover:bg-red-100/5 dark:hover:bg-red-500/10 transition-all duration-300 cursor-pointer"
        >
          <IoIosLogOut className="text-2xl" />
          <span className="hidden lg:inline">Logout</span>
        </div>
      ) : (
        <Link
          href="/Pages/Login"
          onClick={() => setIsMobileMenuOpen(false)}
          className="flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium text-blue-400 hover:text-blue-500 hover:bg-blue-100/5 dark:hover:bg-blue-500/10 transition-all duration-300"
        >
          <IoIosLogIn className="text-2xl" />
          <span className="hidden lg:inline">Login</span>
        </Link>
      )}
    </div>
  );

  return (
    <>
      {/* ===== Mobile Toggle Button ===== */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <button onClick={() => setIsMobileMenuOpen(true)}>
          <FiMenu className="text-3xl text-lightMode-text dark:text-darkMode-text" />
        </button>
      </div>

      {/* ===== Desktop Aside ===== */}
      <aside className="hidden lg:flex flex-col items-center lg:items-start border-r w-[15%] bg-lightMode-menu dark:bg-darkMode-menu pr-3 pl-5 py-10 min-h-screen fixed z-40 left-0 gap-6">
        {/* Logo */}
        <div className="w-full flex justify-center lg:justify-start">
          <Image src="/Logo.png" alt="logo" width={40} height={40} className="rounded-full w-16 h-16  object-cover" />
        </div>

        {/* Links */}
        {renderLinks()}

        {/* Auth Action */}
        {renderAuthAction()}
      </aside>

      {/* ===== Mobile Sidebar (Slide-in) ===== */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex">
          <aside className="w-64 bg-lightMode-menu dark:bg-darkMode-menu p-6 flex flex-col gap-6 min-h-screen">
            {/* Close Button */}
            <div className="flex justify-between items-center w-full mb-4">
              <Image src="/Logo.png" alt="logo" width={40} height={40} className="rounded-full w-12 h-12 object-cover" />
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <MdClose className="text-3xl text-lightMode-text dark:text-darkMode-text" />
              </button>
            </div>

            {/* Links */}
            {renderLinks()}

            {/* Auth */}
            {renderAuthAction()}
          </aside>
        </div>
      )}
    </>
  )
}

export default Aside
