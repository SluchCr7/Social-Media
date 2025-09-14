'use client'
import React from 'react'
import Image from 'next/image'
import { useAuth } from '../Context/AuthContext'
import { FiX, FiUserPlus, FiCheck } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

const MenuAllSuggestedFriends = () => {
  const { showAllSuggestedUsers, user, setShowAllSuggestedUsers, suggestedUsers, followUser } = useAuth()

  return (
    <AnimatePresence>
      {showAllSuggestedUsers && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] flex items-start justify-center backdrop-blur-sm bg-black/40 p-4 md:p-6"
        >
          {/* Modal */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 15 }}
            className="w-full max-w-2xl bg-lightMode-bg dark:bg-darkMode-bg rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b px-5 py-4">
              <h2 className="text-lg md:text-xl font-bold text-lightMode-fg dark:text-darkMode-fg">
                Suggested Friends
              </h2>
              <button
                onClick={() => setShowAllSuggestedUsers(false)}
                className="text-gray-500 hover:text-red-500 transition"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-thumb-rounded-full px-2">
              {Array.isArray(suggestedUsers) && suggestedUsers.length > 0 ? (
                suggestedUsers.map((userData) => {
                  const isFriend =
                    userData.following?.includes(user?._id) &&
                    userData.followers?.includes(user?._id)

                  // mutual friends safely
                  const myFollowing = Array.isArray(user?.following) ? user.following : []
                  const hisFollowing = Array.isArray(userData.following) ? userData.following : []
                  const mutualFriends = myFollowing.filter((id) => hisFollowing.includes(id))

                  // new user check safely
                  const createdAt = userData.createdAt ? new Date(userData.createdAt) : null
                  const isNew =
                    createdAt &&
                    (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24) < 7

                  // posts check safely
                  const posts = Array.isArray(userData.posts) ? userData.posts : []

                  const statusMessage = isFriend
                    ? 'You are friends'
                    : isNew
                    ? 'New here – welcome!'
                    : mutualFriends.length > 0
                    ? `${mutualFriends.length} mutual friends`
                    : posts.length > 50
                    ? 'Active member'
                    : 'Suggested for you'

                  return (
                    <div
                      key={userData._id}
                      className="flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-[#1f2124] transition-all"
                    >
                      {/* User Info */}
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Image
                            src={userData.profilePhoto?.url || '/default-avatar.png'}
                            alt={userData.username}
                            width={44}
                            height={44}
                            className="rounded-full border border-gray-300 dark:border-gray-600 shadow-sm"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-lightMode-fg dark:text-darkMode-fg">
                            {userData.username}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {statusMessage}
                          </span>
                        </div>
                      </div>

                      {/* Follow Button */}
                      <button
                        onClick={() => followUser(userData._id)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm transition 
                          ${
                            isFriend
                              ? 'bg-green-600 hover:bg-green-700 text-white'
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                          }`}
                      >
                        {isFriend ? <FiCheck size={16} /> : <FiUserPlus size={16} />}
                        {isFriend ? 'Following' : 'Follow'}
                      </button>
                    </div>
                  )
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
                  <Image
                    src="/empty-state.svg"
                    alt="No users"
                    width={120}
                    height={120}
                    className="mb-4 opacity-70"
                  />
                  <p className="text-sm">No suggested users at the moment.</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default MenuAllSuggestedFriends
