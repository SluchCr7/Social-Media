'use client'
import React, { useState } from 'react'
import { FiX } from "react-icons/fi"
import { useNotify } from '../Context/NotifyContext'

const NotificationMenu = ({ showNotifications, setShowNotifications }) => {
  // const initialNotifications = [
  //   {
  //     id: 1,
  //     avatar: "https://i.pravatar.cc/150?img=1",
  //     message: "Emily Tyler sent you a comment in Research task",
  //     time: "2h ago",
  //   },
  //   {
  //     id: 2,
  //     avatar: "https://i.pravatar.cc/150?img=2",
  //     message: "Updated the status of Mind Map task to In Progress",
  //     time: "6h ago",
  //   },
  //   {
  //     id: 3,
  //     avatar: "https://i.pravatar.cc/150?img=3",
  //     message: "Blake Silva assigned the issue to you",
  //     time: "Today 9:30 AM",
  //   },
  // ]

  const {notificationsByUser , setNotificationsByUser} = useNotify()
  const clearNotifications = () => {
    setNotificationsByUser([])
  }

  return (
    <div className={`fixed inset-0 z-[999] transition-all duration-500 ${showNotifications ? 'backdrop-blur-sm bg-black/30' : 'pointer-events-none opacity-0'}`}>
    <div className={`transform transition-all duration-700 ease-in-out 
        ${showNotifications ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} 
        w-[95%] md:w-[40rem] max-w-6xl mx-auto
        bg-lightMode-fg dark:bg-darkMode-fg shadow-2xl rounded-xl p-6 mt-[10vh] relative`}>

        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-xl font-bold">Notifications</h2>
          <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-gray-600 transition">
            <FiX size={24} />
          </button>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-5">
          {notificationsByUser.length > 0 ? (
            notificationsByUser.map((notif) => (
              <div
                key={notif.id}
                className="flex gap-4 p-3 hover:bg-gray-500 rounded-xl transition cursor-pointer items-start"
              >
                <img
                  src={sender?.profilePhoto?.url}
                  alt="avatar"
                  className="w-12 h-12 rounded-full object-cover shadow-sm"
                />
                <div className="flex-1">
                  <p className="text-base font-medium leading-snug">{notif.content}</p>
                  <p className="text-xs text-lightMode-text dark:text-darkMode-text mt-1">{new Date(notif.createdAt).toLocaleString()}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-600 text-sm py-20">
              No notifications
            </div>
          )}
        </div>

        {/* Footer */}
        {notificationsByUser.length > 0 && (
          <div className="pt-5 border-t mt-4">
            <button
              onClick={clearNotifications}
              className="w-full bg-white dark:bg-black text-black dark:text-white text-sm font-semibold py-3 rounded-xl transition hover:opacity-90"
            >
              Clear All
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default NotificationMenu
