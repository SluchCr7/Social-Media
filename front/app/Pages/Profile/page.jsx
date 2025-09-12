'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { FaUserEdit } from 'react-icons/fa'
import { IoAdd } from 'react-icons/io5'
import { BsPatchCheckFill } from 'react-icons/bs'

import { useAuth } from '@/app/Context/AuthContext'
import { usePost } from '@/app/Context/PostContext'

import SluchitEntry from '@/app/Component/SluchitEntry'
import Loading from '@/app/Component/Loading'
import UpdateProfile from '@/app/Component/UpdateProfile'
import AddStoryModel from '@/app/Component/AddStoryModel'
import InfoAboutUser from '@/app/Component/UserComponents/InfoAboutUser'
import CommentCard from '@/app/Component/UserComponents/CommentCard'
import TabsContent from '@/app/Component/UserComponents/TabsContent'
import Tabs from '@/app/Component/UserComponents/Tabs'
import StatBlock from '@/app/Component/UserComponents/StatBlock'
import FollowModal from '@/app/Component/UserComponents/FollowModal'

// ---------------- Constants ----------------
const tabs = ['Posts', 'Saved', 'Comments']

// ---------------- Components ----------------


// ---------------- Main Page ----------------

const ProfilePage = () => {
  const { user, users, updatePhoto } = useAuth()
  const { posts } = usePost()

  const [activeTab, setActiveTab] = useState('Posts')
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState(null)
  const [userData, setUserData] = useState({})
  const [update, setUpdate] = useState(false)
  const [isStory, setIsStory] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [menuType, setMenuType] = useState('followers')

  // Hydrate userData
  useEffect(() => {
    const matchedUser = users?.find((u) => user?._id === u?._id)
    setUserData(matchedUser || user || {})
  }, [users, user])

  useEffect(() => {
    if (user) setLoading(true)
  }, [user])

  // Handle profile image change
  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      if (updatePhoto) await updatePhoto(file)
    }
  }

  // Arrange posts (pinned first)
  const pinnedPosts = userData?.pinsPosts || []
  const pinnedIds = new Set(pinnedPosts.map((p) => p?._id))
  const regularPosts = (userData?.posts || []).filter((p) => !pinnedIds.has(p?._id))
  const combinedPosts = [
    ...pinnedPosts.map((post) => ({ ...post, isPinned: true })),
    ...regularPosts.map((post) => ({ ...post, isPinned: false })),
  ]

  if (!loading) return <Loading />

  return (
    <>
      <div className="w-full min-h-screen bg-lightMode-bg dark:bg-darkMode-bg text-lightMode-text dark:text-darkMode-text flex flex-col items-center">
        
        {/* Avatar */}
        <div className="w-full flex justify-center mt-10">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative w-36 h-36 rounded-full overflow-hidden shadow-xl"
          >
            <Image
              src={image ? URL.createObjectURL(image) : userData?.profilePhoto?.url || '/default-profile.png'}
              alt="Profile photo"
              fill
              className="object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
              onClick={() => document.getElementById('fileInput')?.click()}
            />
            <button
              onClick={() => document.getElementById('fileInput')?.click()}
              className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full opacity-0 hover:opacity-100 transition"
            >
              Change
            </button>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </motion.div>
        </div>

        {/* User Info */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-full px-4 mt-12 text-center"
        >
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-3xl font-bold">{userData?.username || 'Username'}</h1>
            {userData?.isVerify && (
              <BsPatchCheckFill
                className="text-blue-500 text-xl"
                title="Verified account"
              />
            )}
          </div>
          <span className="text-gray-400 text-sm -mt-1 block">
            {userData?.profileName || ''}
          </span>
          <p className="text-base text-gray-500 mt-2 max-w-xl mx-auto line-clamp-3">
            {userData?.description || 'No bio yet.'}
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex justify-center gap-3 mt-4 flex-wrap"
        >
          <button
            onClick={() => setUpdate(true)}
            className="flex items-center gap-2 border px-6 py-2 rounded-xl text-sm font-medium hover:shadow-md transition"
          >
            <FaUserEdit /> Edit profile
          </button>
          <button
            onClick={() => setIsStory(true)}
            className="flex items-center gap-2 border px-6 py-2 rounded-xl text-sm font-medium hover:shadow-md transition"
          >
            <IoAdd /> Add story
          </button>
        </motion.div>

        {/* Stats */}
        <div className="flex justify-center gap-10 mt-6">
          <StatBlock label="Posts" value={userData?.posts?.length} />
          <StatBlock label="Followers" value={userData?.followers?.length} onClick={() => { setMenuType('followers'); setShowMenu(true) }} />
          <StatBlock label="Following" value={userData?.following?.length} onClick={() => { setMenuType('following'); setShowMenu(true) }} />
        </div>

        {/* About Me */}
        <InfoAboutUser user={userData} />

        {/* Tabs */}
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Tab Content */}
        <TabsContent activeTab={activeTab} combinedPosts={combinedPosts} posts={posts} userSelected={userData} />
      </div>

      {/* Modals */}
      <FollowModal visible={showMenu} onClose={() => setShowMenu(false)} type={menuType} list={menuType === 'followers' ? userData?.followers : userData?.following} />
      <UpdateProfile update={update} setUpdate={setUpdate} />
      <AddStoryModel isStory={isStory} setIsStory={setIsStory} />
    </>
  )
}



export default ProfilePage
