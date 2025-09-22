'use client'

import React, { useEffect, useState, useMemo } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { FaUserEdit, FaCamera } from 'react-icons/fa'
import { IoAdd } from 'react-icons/io5'
import { BsPatchCheckFill } from 'react-icons/bs'
import Head from 'next/head'

import { useAuth } from '@/app/Context/AuthContext'
import { usePost } from '@/app/Context/PostContext'
import { useStory } from '@/app/Context/StoryContext'

import Loading from '@/app/Component/Loading'
import UpdateProfile from '@/app/Component/UpdateProfile'
import AddStoryModel from '@/app/Component/AddStoryModel'
import InfoAboutUser from '@/app/Component/UserComponents/InfoAboutUser'
import TabsContent from '@/app/Component/UserComponents/TabsContent'
import Tabs from '@/app/Component/UserComponents/Tabs'
import StatBlock from '@/app/Component/UserComponents/StatBlock'
import FollowModal from '@/app/Component/UserComponents/FollowModal'
import { HiBadgeCheck } from 'react-icons/hi'
import { CheckStateAccount } from '@/app/Component/UserComponents/UsersStats'
import ProfileSkeleton from '@/app/Skeletons/ProfileSkeleton'


const ProfilePage = () => {
  const { user, users, updatePhoto } = useAuth()
  const { posts } = usePost()
  const { stories } = useStory()

  const [activeTab, setActiveTab] = useState('Posts')
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState(null)
  const [userData, setUserData] = useState({})
  const [update, setUpdate] = useState(false)
  const [isStory, setIsStory] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [menuType, setMenuType] = useState('followers')

  const myStories = stories.filter(story => story?.owner?._id === user?._id)

  // تحديث بيانات المستخدم
  useEffect(() => {
    const matchedUser = users?.find((u) => user?._id === u?._id)
    setUserData(matchedUser || user || {})
  }, [users, user])

  useEffect(() => {
    if (user) setLoading(true)
  }, [user])

  // تغيير الصورة
  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      if (updatePhoto) await updatePhoto(file)
    }
  }

  // ترتيب البوستات (المثبتة أولاً)
  const combinedPosts = useMemo(() => {
    const pinnedPosts = userData?.pinsPosts || []
    const pinnedIds = new Set(pinnedPosts.map((p) => p?._id))
    const regularPosts = (userData?.posts || []).filter((p) => !pinnedIds.has(p?._id))
    return [
      ...pinnedPosts.map((post) => ({ ...post, isPinned: true })),
      ...regularPosts.map((post) => ({ ...post, isPinned: false })),
    ]
  }, [userData])

  if (!loading) {
    <ProfileSkeleton/>
  }

  // 📌 التحقق من حالة الحساب
  <CheckStateAccount user={userData}/>


  return (
    <>
      <Head>
        <title>{userData?.username || 'Profile'} | Social App</title>
      </Head>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full min-h-screen bg-lightMode-bg dark:bg-darkMode-bg text-lightMode-text dark:text-darkMode-text px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 gap-6"
      >
        {/* Left Column */}
        <div className="flex flex-col items-center lg:items-start justify-start gap-6">
          {/* Avatar */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className={`relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden shadow-xl cursor-pointer p-1
              ${myStories.length > 0 
                ? 'bg-gradient-to-tr from-pink-500 via-yellow-400 to-purple-600 animate-spin-slow' 
                : 'bg-transparent'}`}
          >
            <div className="w-full h-full rounded-full overflow-hidden relative group">
              <Image
                src={image ? URL.createObjectURL(image) : userData?.profilePhoto?.url || '/default-profile.png'}
                alt="Profile photo"
                fill
                className="object-cover rounded-full"
              />
              {/* Overlay عند Hover */}
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <FaCamera className="text-white text-xl" />
              </div>
            </div>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </motion.div>

          {/* Username & Bio */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center lg:text-left flex flex-col items-center lg:items-start gap-2"
          >
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold break-words">
                {userData?.username || 'Username'}
              </h1>
              {userData?.isAccountWithPremiumVerify && (
                <HiBadgeCheck
                  className="text-blue-500 text-xl"
                  title="Verified account"
                />
              )}
            </div>
            <span className="text-gray-400 text-sm">{userData?.profileName || ''}</span>
            <p className="text-sm sm:text-base text-gray-500 mt-2 max-w-xs break-words whitespace-pre-wrap">
              {userData?.description || 'No bio yet.'}
            </p>
          </motion.div>

          {/* Actions */}
          <div className="flex gap-3 flex-wrap">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setUpdate(true)}
              className="flex items-center gap-2 border px-4 sm:px-6 py-2 rounded-xl text-sm font-medium hover:bg-lightMode-hover dark:hover:bg-darkMode-hover hover:shadow-md transition"
            >
              <FaUserEdit /> Edit profile
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsStory(true)}
              className="flex items-center gap-2 border px-4 sm:px-6 py-2 rounded-xl text-sm font-medium hover:bg-lightMode-hover dark:hover:bg-darkMode-hover hover:shadow-md transition"
            >
              <IoAdd /> Add story
            </motion.button>
          </div>

          {/* Stats */}
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-6 sm:gap-10 mt-4 w-full">
            <StatBlock label="Posts" value={userData?.posts?.length} />
            <StatBlock
              label="Followers"
              value={userData?.followers?.length}
              onClick={() => {
                setMenuType('followers')
                setShowMenu(true)
              }}
            />
            <StatBlock
              label="Following"
              value={userData?.following?.length}
              onClick={() => {
                setMenuType('following')
                setShowMenu(true)
              }}
            />
          </div>

          {/* About User */}
          <InfoAboutUser user={userData} />
        </div>

        {/* Main Column */}
        <div className="flex flex-col gap-6 w-full">
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent
                activeTab={activeTab}
                combinedPosts={combinedPosts}
                posts={posts}
                userSelected={userData}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Modals */}
      <FollowModal
        visible={showMenu}
        onClose={() => setShowMenu(false)}
        type={menuType}
        list={menuType === 'followers' ? userData?.followers : userData?.following}
      />
      <UpdateProfile update={update} setUpdate={setUpdate} />
      <AddStoryModel isStory={isStory} setIsStory={setIsStory} />
    </>
  )
}

export default ProfilePage
