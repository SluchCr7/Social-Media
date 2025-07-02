'use client'
import React, { useState } from 'react'
import Sluchits from './Sluchits'
import Stories from './Stories'
import { IoIosNotificationsOutline } from "react-icons/io"
import NotificationMenu from './NotificationMenu'

const MainApp = () => {
  const [showNotifications, setShowNotifications] = useState(false)
  return (
    <div className='w-[100%] h-full px-3'>
        <div className='w-full flex items-center justify-between'>
          <span className='text-lightMode-text dark:text-darkMode-text font-bold text-xl tracking-[3px] uppercase'>Home</span>
          <IoIosNotificationsOutline onClick={() => setShowNotifications(true)} className='text-2xl text-lightMode-text dark:text-darkMode-text cursor-pointer'/>
        </div>
        <Stories/>
      <Sluchits />
      {
        showNotifications &&
        <NotificationMenu
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
        />
      }
    </div>
  )
}

export default MainApp