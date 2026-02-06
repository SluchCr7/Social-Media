'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoAdd, IoEyeSharp } from 'react-icons/io5'
import { HiLockClosed, HiLockOpen, HiLink } from 'react-icons/hi'
import Link from 'next/link'
import { useAuth } from '../../Context/AuthContext'
import { useTranslation } from 'react-i18next'
import { useTranslate } from '@/app/Context/TranslateContext'

const MenuItem = ({ icon, children, onClick, danger }) => (
  <button
    onClick={onClick}
    className={`group flex items-center gap-3 px-4 py-3 text-sm font-medium w-full text-left transition-all duration-200 rounded-xl
      ${danger
        ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-700'
        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-white/10 dark:hover:text-white'
      }`}
  >
    <span className={`text-lg transition-transform duration-200 group-hover:scale-110 ${danger ? 'text-red-500' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-white'}`}>
      {icon}
    </span>
    <span>{children}</span>
  </button>
)

const Divider = () => (
  <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent my-2 opacity-50" />
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
    // You might want to use a toast here instead of alert for a more premium feel, 
    // but keeping alert as per original logic for now, or assume global toast exists.
    alert('✅ ' + t('Profile link copied!'))
    setOpen(false)
  }

  return (
    <div className={`relative inline-block text-left z-50 ${isRTL ? 'text-right' : 'text-left'}`}>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, scale: 0.95, filter: 'blur(10px)' }}
            transition={{ duration: 0.2, ease: "circOut" }}
            className={`absolute mt-4 w-72 rounded-2xl shadow-2xl overflow-hidden z-50
              bg-white/80 dark:bg-[#1a1a1a]/90 backdrop-blur-xl
              border border-white/20 dark:border-white/5
              ring-1 ring-black/5 dark:ring-white/5
              ${isRTL
                ? 'left-0 origin-top-left md:left-auto md:right-auto'
                : 'right-0 origin-top-right'
              }`}
          >
            <div className="p-2 flex flex-col gap-0.5">

              {/* 👤 Owner Actions */}
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
                      icon={isPrivate ? <HiLockOpen /> : <HiLockClosed />}
                      onClick={actions.updatePrivacy}
                    >
                      {isPrivate ? t('Make Account Public') : t('Make Account Private')}
                    </MenuItem>
                  )}
                </>
              )}

              {/* 👥 Visitor Actions */}
              {context === 'visitor' && (
                <>
                  {actions.handleReport && (
                    <MenuItem onClick={actions.handleReport} danger>
                      {t('Report User')}
                    </MenuItem>
                  )}

                  {actions.blockOrUnblockUser && (
                    <MenuItem
                      onClick={() => actions.blockOrUnblockUser(userId)}
                      danger
                    >
                      {isBlockedByMe ? t('Unblock User') : t('Block User')}
                    </MenuItem>
                  )}
                </>
              )}

              <Divider />

              {/* Shared Actions */}
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
