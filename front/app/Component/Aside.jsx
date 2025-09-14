// 'use client'
// import React, { useState } from 'react'
// import Link from 'next/link'
// import { usePathname } from 'next/navigation'
// import Image from 'next/image'
// import { GoHome, GoSearch } from "react-icons/go"
// import { CiUser, CiSettings } from "react-icons/ci"
// import { FaPlus } from "react-icons/fa6"
// import { IoIosLogIn, IoIosLogOut } from "react-icons/io"
// import { RiUserCommunityLine } from 'react-icons/ri'
// import { FiMenu } from "react-icons/fi"
// import { MdClose } from "react-icons/md"
// import { useAuth } from '../Context/AuthContext'
// import { LuMessagesSquare } from "react-icons/lu";
// import { MdOutlineOndemandVideo } from "react-icons/md";
// import { IoTrophyOutline } from "react-icons/io5";
// import { SlCalender } from "react-icons/sl";

// const Aside = () => {
//   const pathname = usePathname()
//   const { Logout, isLogin, isAuthChecked  , user} = useAuth()
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

//   if (!isAuthChecked) return null;

//   const navItems = [
//     { icon: <GoHome />, text: "Home", link: "/", hideForGuests: false },
//     { icon: <GoSearch />, text: "Search", link: "/Pages/Search", hideForGuests: false },
//     { icon: <FaPlus />, text: "New Post", link: "/Pages/NewPost", hideForGuests: true },
//     { icon: <RiUserCommunityLine />, text: "Community", link: "/Pages/CommunityMain", hideForGuests: true },
//     { icon: <CiSettings />, text: "Settings", link: "/Pages/Setting", hideForGuests: true },
//     { icon: <CiUser />, img : user?.profilePhoto?.url, text: "Profile", link: "/Pages/Profile", hideForGuests: true },
//     {icon: <LuMessagesSquare/> , text: "Messanger" , link:"/Pages/Messanger" , hideForGuests : true},
//     {icon: <MdOutlineOndemandVideo/> , text: "Video" , link:"/Pages/Videos" , hideForGuests : false},
//     {icon: <IoTrophyOutline/> , text: "Challenge" , link:"/Pages/Challenge" , hideForGuests : true},
//     {icon: <SlCalender/> , text: "Calender" , link:"/Pages/Calender" , hideForGuests : true}
//   ];

//   const baseStyle = `flex items-center gap-4 px-4 py-2 rounded-lg text-sm font-medium w-full cursor-pointer transition-all duration-300`;
//   const activeStyle = `bg-gradient-to-r from-lightMode-text2 to-lightMode-text dark:from-darkMode-text2 dark:to-darkMode-text text-white dark:text-black shadow-inner`;
//   const inactiveStyle = `hover:bg-lightMode-bg/10 dark:hover:bg-darkMode-bg/10 text-lightMode-text dark:text-darkMode-text`;

//   const renderLinks = () => (
//     <div className="flex flex-col gap-2 w-full">
//       {navItems
//         .filter(item => isLogin || !item.hideForGuests)
//         .map(({ icon, text, link , img }) => {
//           const isActive = pathname === link;
//           return (
//             <Link
//               key={text}
//               href={link}
//               className={`${baseStyle} ${isActive ? activeStyle : inactiveStyle}`}
//               onClick={() => setIsMobileMenuOpen(false)} // يغلق القائمة في الجوال
//             >
//               {
//                 img ? 
//                   <Image src={img} width={500} height={500} 
//                     className='w-6 h-6 rounded-full' alt='profilePhoto' />
//                   :
//                   <span className="text-xl">{icon}</span>
//               }
//               <span className="">{text}</span>
//             </Link>
//           );
//         })}
//     </div>
//   );

//   const renderAuthAction = () => (
//     <div className="mt-auto w-full">
//       {isLogin ? (
//         <div
//           onClick={() => { Logout(); setIsMobileMenuOpen(false); }}
//           className="flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:text-red-500 hover:bg-red-100/5 dark:hover:bg-red-500/10 transition-all duration-300 cursor-pointer"
//         >
//           <IoIosLogOut className="text-2xl" />
//           <span className="hidden lg:inline">Logout</span>
//         </div>
//       ) : (
//         <Link
//           href="/Pages/Login"
//           onClick={() => setIsMobileMenuOpen(false)}
//           className="flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium text-blue-400 hover:text-blue-500 hover:bg-blue-100/5 dark:hover:bg-blue-500/10 transition-all duration-300"
//         >
//           <IoIosLogIn className="text-2xl" />
//           <span className="">Login</span>
//         </Link>
//       )}
//     </div>
//   );

//   return (
//     <>
//       {/* ===== Mobile Toggle Button ===== */}
//       <div className="fixed top-4 left-4 z-50 lg:hidden">
//         <button onClick={() => setIsMobileMenuOpen(true)}>
//           <FiMenu className="text-3xl text-lightMode-text dark:text-darkMode-text" />
//         </button>
//       </div>

//       {/* ===== Desktop Aside ===== */}
//       <aside className="hidden lg:flex flex-col items-center lg:items-start border-r w-[15%] bg-lightMode-menu dark:bg-darkMode-menu pr-3 pl-5 py-10 min-h-screen fixed z-40 left-0 gap-6">
//         {/* Logo */}
//         <div className="w-full px-4 py-2 flex justify-center lg:justify-start">
//           {/* <Image src="/Logo.png" alt="logo" width={40} height={40} className="rounded-full w-16 h-16  object-cover" /> */}
//           <span className='text-lg font-bold text-lightMode-text dark:text-darkMode-text'>{process.env.NEXT_PUBLIC_WEBSITE_NAME || "Zocial"}</span>
//         </div>

//         {/* Links */}
//         {renderLinks()}

//         {/* Auth Action */}
//         {renderAuthAction()}
//       </aside>

//       {/* ===== Mobile Sidebar (Slide-in) ===== */}
//       {isMobileMenuOpen && (
//         <div className="fixed inset-0 bg-black/40 z-50 flex">
//           <aside className="w-64 bg-lightMode-menu dark:bg-darkMode-menu p-6 flex flex-col gap-6 min-h-screen">
//             {/* Close Button */}
//             <div className="flex justify-between items-center w-full mb-4">
//               {/* Logo */}
//               <div className="w-full px-4 py-2 flex justify-center lg:justify-start">
//                 {/* <Image src="/Logo.png" alt="logo" width={40} height={40} className="rounded-full w-16 h-16  object-cover" /> */}
//                 <span className='text-lg font-bold text-lightMode-text dark:text-darkMode-text'>{process.env.NEXT_PUBLIC_WEBSITE_NAME}</span>
//               </div>
//               <button onClick={() => setIsMobileMenuOpen(false)}>
//                 <MdClose className="text-3xl text-lightMode-text dark:text-darkMode-text" />
//               </button>
//             </div>

//             {/* Links */}
//             {renderLinks()}

//             {/* Auth */}
//             {renderAuthAction()}
//           </aside>
//         </div>
//       )}
//     </>
//   )
// }

// export default Aside
'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { GoHome, GoSearch } from "react-icons/go"
import { CiUser, CiSettings } from "react-icons/ci"
import { FaPlus } from "react-icons/fa6"
import { RiUserCommunityLine } from 'react-icons/ri'
import { LuMessagesSquare } from "react-icons/lu"
import { MdOutlineOndemandVideo } from "react-icons/md"
import { IoTrophyOutline } from "react-icons/io5"
import { SlCalender } from "react-icons/sl"
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"
import { useAuth } from '../Context/AuthContext'
import Image from 'next/image'

const Aside = () => {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const {user}= useAuth()
  // ✅ detect if mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true) // always collapsed on mobile
    }
  }, [isMobile])

  const navSections = [
    {
      title: "Main",
      items: [
        { icon: <GoHome />, text: "Home", link: "/" },
        { icon: <GoSearch />, text: "Search", link: "/Pages/Search" },
        { icon: <MdOutlineOndemandVideo />, text: "Videos", link: "/Pages/Videos" },
      ]
    },
    {
      title: "Community",
      items: [
        { icon: <FaPlus />, text: "New Post", link: "/Pages/NewPost" },
        { icon: <RiUserCommunityLine />, text: "Community", link: "/Pages/CommunityMain"},
        { icon: <LuMessagesSquare />, text: "Messenger", link: "/Pages/Messanger" },
      ]
    },
    {
      title: "Personal",
      items: [
        { icon: <IoTrophyOutline />, text: "Challenge", link: "/Pages/Challenge" },
        { icon: <SlCalender />, text: "Calendar", link: "/Pages/Calender" },
        { icon: <CiUser />, text: "Profile", link: "/Pages/Profile" },
        { icon: <CiSettings />, text: "Settings", link: "/Pages/Setting" },
      ]
    }
  ]

  const baseStyle = `relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300`
  const activeStyle = `bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md`
  const inactiveStyle = `hover:bg-lightMode-bg/10 dark:hover:bg-darkMode-bg/10 text-lightMode-text dark:text-darkMode-text`

  return (
    <aside 
      className={`flex flex-col h-screen bg-lightMode-menu dark:bg-darkMode-menu border-r transition-all duration-500 
      ${isCollapsed ? "w-16" : "w-56"} p-3`}
    >
      {/* ===== Logo + Collapse Button ===== */}
      <div className="flex items-center justify-between mb-6">
        {!isCollapsed && (
          <span className="text-lg font-bold text-lightMode-text dark:text-darkMode-text truncate">
            {process.env.NEXT_PUBLIC_WEBSITE_NAME || "Zocial"}
          </span>
        )}
        {!isMobile && (
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-xl p-1 rounded hover:bg-lightMode-bg/10 dark:hover:bg-darkMode-bg/10"
          >
            {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </button>
        )}
      </div>

      {/* ===== Nav Sections ===== */}
      <div className="flex-1 overflow-y-auto space-y-6">
        {navSections.map(section => (
          <div key={section.title}>
            {!isCollapsed && (
              <h4 className="px-3 mb-2 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {section.title}
              </h4>
            )}
            <div className="flex flex-col gap-1">
              {section.items.map(({ icon, text, link, badge }) => {
                const isActive = pathname === link
                return (
                  <Link 
                    key={text}
                    href={link}
                    className={`${baseStyle} ${isActive ? activeStyle : inactiveStyle}`}
                  >
                    <span className="text-xl">{icon}</span>
                    {!isCollapsed && (
                      <span className="flex-1">{text}</span>
                    )}
                    {badge && !isCollapsed && (
                      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ===== Footer (User / Auth) ===== */}
      <div className={`mt-auto border-t pt-4 ${isCollapsed ? "text-center" : ""}`}>
        <div className="flex items-center gap-3 cursor-pointer hover:bg-lightMode-bg/10 dark:hover:bg-darkMode-bg/10 px-2 py-2 rounded-lg">
          <Image src={user?.profilePhoto?.url} alt="User Profile" width={100} height={100} className="w-8 h-8 rounded-full" />
          {!isCollapsed && (
            <div>
              <p className="text-sm font-medium">{user?.username || "User Name"}</p>
              <p className="text-xs text-gray-500">@{user?.profileName || "user_name"}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}

export default Aside
