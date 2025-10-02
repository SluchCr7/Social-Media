'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaUserEdit } from 'react-icons/fa'
import { IoEyeSharp } from 'react-icons/io5'
import { HiLockClosed, HiLockOpen, HiLink } from 'react-icons/hi'
import Link from 'next/link'
import { useAuth } from '../../Context/AuthContext'

const ProfileMenu = ({ 
  context,            // "owner" | "visitor"
  actions = {},       // object فيه الفانكشنز اللي محتاجها
  isPrivate,
  isBlockedByMe,
  profileUrl,
  userId,
  open,
  setOpen
}) => {
  const { user } = useAuth()

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    alert("✅ Profile link copied!")
    setOpen(false)
  }

  return (
    <div className="relative inline-block text-left">
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

              {/* 👤 لو المالك */}
              {context === "owner" && (
                <div className="flex flex-col gap-3 w-full">
                  <Link
                    href={`/Pages/User/${userId}`}
                    className="flex text-sm items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    <IoEyeSharp /> View as User
                  </Link>

                  {actions.setUpdate && (
                    <button
                      onClick={() => { setOpen(false); actions.setUpdate(true) }}
                      className="flex text-sm items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      <FaUserEdit /> Edit Profile
                    </button>
                  )}

                  {actions.updatePrivacy && (
                    <button
                      onClick={actions.updatePrivacy}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition text-sm"
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
                  )}
                </div>
              )}

              {/* 👥 لو زائر */}
              {context === "visitor" && (
                <div className="flex flex-col gap-3 w-full">
                  {actions.handleReport && (
                    <button
                      onClick={actions.handleReport}
                      className="flex items-center gap-3 px-5 py-3 w-full text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      🚩 Report User
                    </button>
                  )}

                  {actions.handleBlock && (
                    <button
                      onClick={actions.handleBlock}
                      className="flex items-center gap-3 px-5 py-3 w-full text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      {isBlockedByMe ? "🔓 Unblock User" : "⛔ Block User"}
                    </button>
                  )}
                </div>
              )}

              {/* زر مشترك */}
              <button
                onClick={copyToClipboard}
                className="flex text-sm items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
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
