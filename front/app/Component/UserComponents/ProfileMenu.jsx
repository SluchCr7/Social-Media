'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaUserEdit } from 'react-icons/fa'
import { IoAdd, IoEyeSharp } from 'react-icons/io5'
import { HiLockClosed, HiLockOpen, HiLink } from 'react-icons/hi'
import Link from 'next/link'
import { useAuth } from '../../Context/AuthContext'
import { useTranslation } from 'react-i18next'
import { useTranslate } from '@/app/Context/TranslateContext'

const MenuItem = ({ icon, children, onClick, danger }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-5 py-3 text-sm w-full text-left transition
      ${danger
        ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30'
        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
  >
    {icon}
    <span>{children}</span>
  </button>
)

const Divider = () => (
  <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
)

const ProfileMenu = ({
  context,
  actions = {},
  isPrivate,
  isBlockedByMe,
  profileUrl,
  userId,
  open,
  onAddStory,
  setOpen
}) => {
  const { user } = useAuth()
  const { t } = useTranslation()
  const { isRTL } = useTranslate()


  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    alert('✅ ' + t('Profile link copied!'))
    setOpen(false)
  }

  return (
    <div
      className={`relative inline-block text-left ${
        isRTL ? 'text-right' : 'text-left'
      }`}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`absolute mt-2 w-64 rounded-xl bg-white dark:bg-gray-800 shadow-lg 
              border border-gray-200 dark:border-gray-700 overflow-hidden z-50
              ${
                isRTL
                  ? 'left-0 origin-top-left md:left-auto md:right-auto'
                  : 'right-0 origin-top-right'
              }`}
          >
            <div className="flex flex-col">

              {/* 👤 لو المالك */}
              {context === 'owner' && (
                <>
                  <Link href={`/Pages/User/${user?._id}`} onClick={() => setOpen(false)}>
                    <MenuItem icon={<IoEyeSharp />}>
                      {t('View as Visitor')}
                    </MenuItem>
                  </Link>

                  <MenuItem icon={<IoAdd />} onClick={onAddStory}>
                    {t('Add Story')}
                  </MenuItem>

                  {actions.updatePrivacy && (
                    <MenuItem
                      icon={
                        isPrivate ? <HiLockOpen /> : <HiLockClosed />
                      }
                      onClick={actions.updatePrivacy}
                    >
                      {isPrivate
                        ? t('Make Account Public')
                        : t('Make Account Private')}
                    </MenuItem>
                  )}
                </>
              )}

              {/* 👥 لو زائر */}
              {context === 'visitor' && (
                <>
                  {actions.handleReport && (
                    <MenuItem onClick={actions.handleReport} danger>
                      {t('Report User')}
                    </MenuItem>
                  )}

                  {actions.blockOrUnblockUser && (
                    <MenuItem
                      onClick={() =>
                        actions.blockOrUnblockUser(userId)
                      }
                      danger
                    >
                      {isBlockedByMe
                        ? t('Unblock User')
                        : t('Block User')}
                    </MenuItem>
                  )}
                </>
              )}

              <Divider />

              {/* مشترك */}
              <MenuItem icon={<HiLink />} onClick={copyToClipboard}>
                {t('Copy Profile Link')}
              </MenuItem>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProfileMenu
