'use client'
import React, { useState } from 'react'
import Header from './Header'
import NotificationMenu from './NotificationMenu'
// import MessangerSluchit from './MessangerSluchit'
import Aside from './Aside'
import Menu from './Menu'
import Search from './Search'
import NewSlucit from './NewSlucit'
import ThemeContextProvider from '../Context/ThemeContext'
import { usePathname } from 'next/navigation'
import { useAuth } from '../Context/AuthContext'

const LayoutComponent = ({ children }) => {
    const [showNotifications , setShowNotifications] = useState(false)
    const [showMessanger , setShowMessanger] = useState(false)
    const [showSearch , setShowSearch] = useState(false)
  const [showNewSluchit, setShowNewSluchit] = useState(false)
  const {isLogin} = useAuth()
  const pathname = usePathname();
  const hideLayout = pathname === '/Pages/Login' || pathname === '/Pages/Register' || pathname === "/Pages/Messanger";
  return (
    <div>
        {/* <Header showMessanger={showMessanger} setShowMessanger={setShowMessanger}  showNotifications={showNotifications} setShowNotifications={setShowNotifications} /> */}
        <NotificationMenu showNotifications={showNotifications} setShowNotifications={setShowNotifications} />
        {/* <MessangerSluchit showMessanger={showMessanger} setShowMessanger={setShowMessanger}/> */}
        {/* <Search showSearch={showSearch} setShowSearch={setShowSearch}/>
        <NewSlucit showNewSluchit={showNewSluchit} setShowNewSluchit={setShowNewSluchit}/> */}
        <div className={`flex items-start gap-3 w-full ${hideLayout ? "" : "py-5"}`}>
            {!hideLayout && <Aside showNotifications={showNotifications} setShowNotifications={setShowNotifications} showMessanger={showMessanger} setShowMessanger={setShowMessanger} showNewSluchit={showNewSluchit} setShowNewSluchit={setShowNewSluchit} showSearch={showSearch} setShowSearch={setShowSearch} />}
            <div className={`w-full flex items-start ${hideLayout ? "" : "pl-[15%]"}`}>
              {children}
              {
                isLogin && 
                  !hideLayout && <Menu showNotifications={showNotifications} setShowNotifications={setShowNotifications} showMessanger={showMessanger} setShowMessanger={setShowMessanger} />
              }
            </div>
        </div>    
    </div>
  )
}

export default LayoutComponent