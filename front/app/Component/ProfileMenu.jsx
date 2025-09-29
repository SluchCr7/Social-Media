'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BsThreeDots } from 'react-icons/bs'
import { FaUserEdit } from 'react-icons/fa'
import { IoEyeSharp } from 'react-icons/io5'
import { HiLockClosed, HiLockOpen, HiLink } from 'react-icons/hi'
import Link from 'next/link'

const ProfileMenu = ({ isPrivate,userId, updatePrivacy, setUpdate, profileUrl , open , setOpen }) => {


  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    alert("✅ Profile link copied!")
    setOpen(false)
  }

  return (
    <div className="relative inline-block text-left">
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
      >
        <BsThreeDots className="text-xl" />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-gray-800 shadow-lg border dark:border-gray-700 overflow-hidden z-50"
          >
            <div className="flex flex-col text-sm">
              {/* View as User */}
              <Link
              href={`/Pages/User/${userId}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <IoEyeSharp /> View as User
              </Link>

              {/* Edit Profile */}
              <button
                onClick={()=>{
                    setOpen(false)
                    setUpdate(true)
                }}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <FaUserEdit /> Edit Profile
              </button>

              {/* Toggle Privacy */}
              <button
                onClick={updatePrivacy}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                {isPrivate ? (
                  <>
                    <HiLockOpen /> Make Account Public
                  </>
                ) : (
                  <>
                    <HiLockClosed /> Make Account Private
                  </>
                )}
              </button>

              {/* Copy Profile Link */}
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <HiLink /> Copy Profile Link
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProfileMenu
