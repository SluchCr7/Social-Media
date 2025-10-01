'use client'

import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { FaUserEdit, FaCamera } from 'react-icons/fa'
import { IoAdd, IoEllipsisHorizontal } from 'react-icons/io5'
import { HiBadgeCheck } from 'react-icons/hi'
import Head from 'next/head'

import { useAuth } from '@/app/Context/AuthContext'
import { usePost } from '@/app/Context/PostContext'

import ProfileSkeleton from '@/app/Skeletons/ProfileSkeleton'
import UpdateProfile from '@/app/Component/UpdateProfile'
import AddStoryModel from '@/app/Component/AddStoryModel'
import InfoAboutUser from '@/app/Component/UserComponents/InfoAboutUser'
import TabsContent from '@/app/Component/UserComponents/TabsContent'
import Tabs from '@/app/Component/UserComponents/Tabs'
import StatBlock from '@/app/Component/UserComponents/StatBlock'
import FollowModal from '@/app/Component/UserComponents/FollowModal'
import { CheckStateAccount } from '@/app/Component/UserComponents/UsersStats'
import { useCombinedPosts } from '@/app/Custome/useCombinedPosts'
import { selectUserFromUsers } from '@/app/utils/SelectUserFromUsers'
import FilterBar from '@/app/Component/UserComponents/FilterBar'
import ProfileMenu from '@/app/Component/ProfileMenu'
import { useInfiniteScroll } from '@/app/Custome/useInfinteScroll'
import ProfileHeader from '@/app/Component/UserComponents/ProfileHeader'
import { usePostYears } from '@/app/Custome/usePostYears'

const ProfilePage = () => {
  const { user, users, updatePhoto,togglePrivateAccount,getUserById } = useAuth()
  const { fetchUserPosts, userPosts, posts, setUserPages, userHasMore } = usePost()

  const [activeTab, setActiveTab] = useState('Posts')
  const [loading, setLoading] = useState(true)
  const [image, setImage] = useState(null)
  const [userData, setUserData] = useState({})
  const [update, setUpdate] = useState(false)
  const [isStory, setIsStory] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [menuType, setMenuType] = useState('followers')
  const [page, setPage] = useState(1) // ✅ رقم الصفحة الحالي
  const loaderRef = useRef(null)
  const [openMenu , setOpenMenu] = useState(false)
  const [filters, setFilters] = useState({
    year: "all",
    month: "all",
    sort: "latest"
  })

  // 📌 تحديث بيانات المستخدم عند التغير
  useEffect(() => {
    if (!user?._id) return;
    setLoading(true);
    getUserById(user._id)
      .then(res => setUserData(res))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, [user?._id]);


  // 📌 أول تحميل للبوستات
  useEffect(() => {
    if (userData?._id) {
      setPage(1)
      fetchUserPosts(userData._id, 1, 10, true) // reset = true (يمسح القديم)
    }
  }, [userData?._id])

  useInfiniteScroll(page , setPage ,loaderRef, fetchUserPosts ,userData,userHasMore)
  // 📌 البوستات المثبتة + العادية
  const combinedPosts = useCombinedPosts(userPosts, userData?.pinsPosts || [])

  const postYears = usePostYears(combinedPosts);

  // 📌 تغيير الصورة الشخصية
  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      if (updatePhoto) await updatePhoto(file)
    }
  }
  if (loading) return <ProfileSkeleton />
  return (
    <div>
      <Head>
        <title>{userData?.username || 'Profile'} | Social App</title>
      </Head>

      <CheckStateAccount user={userData} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full min-h-screen bg-lightMode-bg dark:bg-darkMode-bg text-lightMode-text dark:text-darkMode-text px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 gap-6"
      >
        <div>

          {/* ===================== Upper Profile Section ===================== */}
          {/* <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 w-full">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden shadow-xl cursor-pointer p-1
                ${userData?.stories?.length > 0
                ? 'border-[5px] border-blue-500 animate-spin-slow'
                : 'border-0 border-transparent'}`}
            >
              <div className="w-full h-full rounded-full overflow-hidden relative group">
                <Image
                  src={image ? URL.createObjectURL(image) : userData?.profilePhoto?.url || '/default-profile.png'}
                  alt="Profile photo"
                  fill
                  className="object-cover rounded-full"
                />
                <div
                  className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                  onClick={() => document.getElementById('fileInput').click()}
                >
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

            <div className="flex flex-col gap-3 flex-1 w-full">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold break-words">
                  {userData?.username || 'Username'}
                </h1>
                {userData?.isAccountWithPremiumVerify && (
                  <HiBadgeCheck className="text-blue-500 text-xl" title="Verified account" />
                )}
                <button onClick={() => setOpenMenu(!openMenu)} className="ml-auto">
                  <IoEllipsisHorizontal className="text-xl" />
                </button>
                <ProfileMenu
                  updatePrivacy={togglePrivateAccount}
                  profileUrl={`${window.location.origin}/Pages/User/${userData?._id}`}
                  isPrivate={userData?.isPrivate} setUpdate={setUpdate}
                  userId={userData?._id} open={openMenu} setOpen={setOpenMenu}
                />
              </div>

              <div className="w-full sm:max-w-xs">
                <div className="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-300">
                  <span className="flex items-center gap-1">
                    {userData?.userLevelRank || 'Junior'}
                    <span className="text-lg">🏅</span>
                  </span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {userData?.userLevelPoints || 0} XP
                  </motion.span>
                </div>

                <div className="w-full h-3 bg-gray-300 dark:bg-gray-700 rounded-full mt-2 overflow-hidden shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${
                        Math.min(
                          ((userData?.userLevelPoints || 0) / (userData?.nextLevelPoints || 500)) * 100,
                          100
                        )
                      }%`,
                    }}
                    transition={{ duration: 1.2 }}
                    className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 rounded-full"
                  />
                </div>

                <span className="block text-xs text-gray-500 mt-1 text-right">
                  {`Next level in ${Math.max(
                    (userData?.nextLevelPoints || 500) - (userData?.userLevelPoints || 0),
                    0
                  )} XP`}
                </span>
              </div>

              <p className="text-sm sm:text-base text-gray-500 max-w-xs break-words whitespace-pre-wrap">
                {userData?.description || 'No bio yet.'}
              </p>

              <div className="flex gap-3 flex-wrap mt-2">
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
            </div>
          </div> */}
        </div>
        <ProfileHeader
          user={userData}
          isOwner
          image={image}
          onImageChange={handleImageChange}
          onEdit={() => setUpdate(true)}
          onAddStory={() => setIsStory(true)}
          onShowFollowers={() => { setMenuType("followers"); setShowMenu(true); }}
          onShowFollowing={() => { setMenuType("following"); setShowMenu(true); }}
          renderOwnerMenu={() => (
            <ProfileMenu
              updatePrivacy={togglePrivateAccount}
              profileUrl={`${window.location.origin}/Pages/User/${userData?._id}`}
              isPrivate={userData?.isPrivate}
              setUpdate={setUpdate}
              userId={userData?._id}
              open={openMenu}
              setOpen={setOpenMenu}
            />
          )}
        />

        <InfoAboutUser user={userData} />

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
              {activeTab === "Posts" && (
                <FilterBar filters={filters} 
                  setFilters={setFilters}
                  years={postYears} />
              )}

              <TabsContent 
                activeTab={activeTab} 
                combinedPosts={combinedPosts} 
                posts={posts} 
                userSelected={userData}
                filters={filters}
              />
              {/* Loader for Infinite Scroll */}
              {userHasMore && (
                <div ref={loaderRef} className="flex justify-center py-6">
                  <span className="text-gray-500">Loading more...</span>
                </div>
              )}
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
      <UpdateProfile update={update} setUpdate={setUpdate} user={userData} />
      <AddStoryModel isStory={isStory} setIsStory={setIsStory} />
    </div>
  )
}

export default ProfilePage
