'use client'
import * as HoverCard from '@radix-ui/react-hover-card'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../Context/AuthContext'
import { useState, useEffect } from 'react'
import { FaUserPlus, FaUserCheck } from 'react-icons/fa'
import { HiCheckBadge, HiUsers, HiChatBubbleLeftRight } from 'react-icons/hi2'
import { useUser } from '../Context/UserContext'
import { useGetData } from '../Custome/useGetData'
import { useTranslation } from 'react-i18next'

const UserHoverCard = ({ userSelected, children, side = 'right' }) => {
  const { user } = useAuth()
  const [isHovered, setIsHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { followUser, loading } = useUser()
  const { userData } = useGetData(user?._id)
  const { t } = useTranslation()

  // Local state for real-time updates
  const [localIsFollowing, setLocalIsFollowing] = useState(
    userData?.following?.some(member => member._id === userSelected._id)
  )
  const [localFollowerCount, setLocalFollowerCount] = useState(userSelected?.followers?.length || 0)

  // Check screen size to avoid showing card on mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 640)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Update local state when userData changes
  useEffect(() => {
    const isFollowing = userData?.following?.some(member => member._id === userSelected._id)
    setLocalIsFollowing(isFollowing)
  }, [userData?.following, userSelected._id])

  const handleFollow = async () => {
    // Optimistic update
    const wasFollowing = localIsFollowing
    setLocalIsFollowing(!wasFollowing)
    setLocalFollowerCount(prev => wasFollowing ? prev - 1 : prev + 1)

    const result = await followUser(userSelected._id)

    // If failed, revert
    if (!result?.success) {
      setLocalIsFollowing(wasFollowing)
      setLocalFollowerCount(userSelected?.followers?.length || 0)
    }
  }

  if (isMobile) {
    return (
      <Link
        href={`/Pages/User/${userSelected?._id}`}
        className="font-semibold text-sm text-lightMode-fg dark:text-darkMode-fg hover:underline"
      >
        {children || userSelected?.username}
      </Link>
    )
  }

  if (!userSelected) return null

  return (
    <HoverCard.Root openDelay={200} closeDelay={150}>
      <HoverCard.Trigger asChild>
        {children || (
          <Link
            href={`/Pages/User/${userSelected?._id}`}
            className="font-semibold text-sm text-lightMode-fg dark:text-darkMode-fg hover:underline"
          >
            {userSelected?.username}
          </Link>
        )}
      </HoverCard.Trigger>

      <HoverCard.Portal>
        <AnimatePresence>
          <HoverCard.Content
            side={side}
            sideOffset={10}
            align="center"
            avoidCollisions={true}
            collisionPadding={8}
            className="z-50 rounded-[1.5rem] border border-gray-200/50 dark:border-white/10 bg-white/95 dark:bg-[#0D1117]/95 backdrop-blur-2xl shadow-2xl overflow-hidden max-w-[90vw] sm:max-w-[320px]"
            onPointerEnter={() => setIsHovered(true)}
            onPointerLeave={() => setIsHovered(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Gradient Header Background */}
              <div className="relative h-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 overflow-hidden">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0]
                  }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"
                />
              </div>

              {/* Content */}
              <div className="relative px-5 pb-5 -mt-10">
                {/* Profile Image */}
                <div className="flex items-start justify-between mb-4">
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    className="relative"
                  >
                    <div className="w-20 h-20 rounded-[1.5rem] overflow-hidden ring-4 ring-white dark:ring-[#0D1117] shadow-xl">
                      <Image
                        src={userSelected?.profilePhoto?.url || '/default-avatar.png'}
                        alt="Profile"
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {userSelected?.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-4 border-white dark:border-[#0D1117] shadow-lg" />
                    )}
                  </motion.div>

                  {/* Follow Button (Top Right) */}
                  {user?._id !== userSelected._id && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleFollow}
                      disabled={loading}
                      className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg ${localIsFollowing
                        ? 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-indigo-500/30 hover:shadow-xl'
                        }`}
                    >
                      {localIsFollowing ? <FaUserCheck size={12} /> : <FaUserPlus size={12} />}
                      {localIsFollowing ? t('Following') : t('Follow')}
                    </motion.button>
                  )}
                </div>

                {/* User Info */}
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-black text-lg text-gray-900 dark:text-white truncate">
                        {userSelected?.username}
                      </h3>
                      {userSelected?.isAccountWithPremiumVerify && (
                        <HiCheckBadge className="text-indigo-500 text-xl flex-shrink-0" title="Verified" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                      @{userSelected?.profileName}
                    </p>
                  </div>

                  {/* Bio */}
                  {userSelected?.description && (
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 leading-relaxed">
                      {userSelected.description}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200/50 dark:border-white/10">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 dark:from-indigo-500/20 dark:to-indigo-500/10 border border-indigo-500/20"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <HiUsers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
                          {t("Followers")}
                        </span>
                      </div>
                      <div className="text-xl font-black text-gray-900 dark:text-white">
                        {localFollowerCount}
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="p-3 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 dark:from-purple-500/20 dark:to-purple-500/10 border border-purple-500/20"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <HiChatBubbleLeftRight className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
                          {t("Following")}
                        </span>
                      </div>
                      <div className="text-xl font-black text-gray-900 dark:text-white">
                        {userSelected?.following?.length || 0}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>

            <HoverCard.Arrow className="fill-white dark:fill-[#0D1117]" />
          </HoverCard.Content>
        </AnimatePresence>
      </HoverCard.Portal>
    </HoverCard.Root>
  )
}

export default UserHoverCard
