'use client'

import Image from 'next/image'
import { useAuth } from '@/app/Context/AuthContext'
import { usePost } from '@/app/Context/PostContext'
import { useState, useEffect } from 'react'
import { RiUserFollowLine, RiUserUnfollowLine } from "react-icons/ri"
import InfoAboutUser from '@/app/Component/UserComponents/InfoAboutUser'
import { motion } from 'framer-motion'
import TabsContent from '@/app/Component/UserComponents/TabsContent'
import Tabs from '@/app/Component/UserComponents/Tabs'
import StatBlock from '@/app/Component/UserComponents/StatBlock'
import FollowModal from '@/app/Component/UserComponents/FollowModal'
import { useStory } from '@/app/Context/StoryContext'
import StoryViewer from '@/app/Component/StoryViewer'

const tabs = ['Posts', 'Saved', 'Comments']

const Page = ({ params }) => {
  const id = params.id
  const { users, followUser, user, blockOrUnblockUser, isLogin } = useAuth()
  const { posts } = usePost()
  const [isBlockedByMe, setIsBlockedByMe] = useState(false)
  const [userSelected, setUserSelected] = useState({})
  const [activeTab, setActiveTab] = useState('Posts')
  const [showMenu, setShowMenu] = useState(false)
  const [menuType, setMenuType] = useState('followers')
  const { getUserStories } = useStory()
  const [userStories, setUserStories] = useState([])
  const [isViewerOpen, setIsViewerOpen] = useState(false)

 
  // 📌 جلب ستوريز اليوزر عند الضغط على صورته
  const handleProfileClick = async () => {
    if (!userSelected?._id) return
    const fetchedStories = await getUserStories(userSelected._id)
    if (fetchedStories.length > 0) {
      setUserStories(fetchedStories)
      setIsViewerOpen(true)
    }
  }

  // 📌 تحديد اليوزر من قائمة الـ users
  useEffect(() => {
    const matchedUser = users.find((u) => u?._id === id)
    if (matchedUser) setUserSelected(matchedUser)
  }, [id, users])

  // 📌 تحديث حالة البلوك
  useEffect(() => {
    if (user && userSelected?._id) {
      setIsBlockedByMe(user.blockedUsers?.includes(userSelected._id))
    }
  }, [user, userSelected])

  const isFollowing = userSelected?.followers?.some(f => f?._id === user?._id)
  const isOwner = user?._id === userSelected?._id
  const canSeePrivateContent = !userSelected?.isPrivate || isOwner || isFollowing

  // 📌 تقسيم البوستات (مثبتة + عادية)
  const pinnedPosts = userSelected?.pinsPosts || []
  const pinnedIds = new Set(pinnedPosts.map((p) => p?._id))
  const regularPosts = (userSelected?.posts || []).filter((p) => !pinnedIds.has(p?._id))
  const combinedPosts = canSeePrivateContent
    ? [
        ...pinnedPosts.map((post) => ({ ...post, isPinned: true })),
        ...regularPosts.map((post) => ({ ...post, isPinned: false })),
      ]
    : []


  useEffect(()=>{
    console.log(userStories)
    console.log(userSelected)
  },[userStories ,  userSelected])
  // 📌 التحقق من حالة الحساب
  if (userSelected?.accountStatus === 'banned') {
    return (
      <div className="flex items-center justify-center min-h-screen text-center px-6">
        <div className="max-w-md">
          <h1 className="text-2xl font-bold text-red-600">This account has been banned</h1>
          <p className="text-gray-500 mt-2">
            account is permanently disabled due to policy violations.
          </p>
        </div>
      </div>
    )
  }

  if (userSelected?.accountStatus === 'suspended') {
    const until = userSelected?.suspendedUntil
      ? new Date(userSelected.suspendedUntil).toLocaleDateString()
      : 'a future date'

    return (
      <div className="flex items-center justify-center min-h-screen text-center px-6">
        <div className="max-w-md">
          <h1 className="text-2xl font-bold text-yellow-500">This account is suspended</h1>
          <p className="text-gray-500 mt-2">
            You cannot View This Page{' '}
            <span className="font-semibold">{until}</span>.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full pt-10 text-lightMode-text dark:text-darkMode-text bg-lightMode-bg dark:bg-darkMode-bg min-h-screen px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 gap-6">
      
      {/* Profile Info */}
      <div className="flex flex-col items-center lg:items-start justify-start gap-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`relative w-36 h-36 rounded-full shadow-lg cursor-pointer p-[3px]
            ${userSelected?.stories?.length > 0 
              ? 'border-[3px] border-blue-500' 
              : 'border-0 border-transparent'}
          `}
          onClick={handleProfileClick}
        >
          <div className="w-full h-full rounded-full bg-lightMode-bg dark:bg-darkMode-bg p-[2px]">
            <Image
              src={userSelected?.profilePhoto?.url || '/default-profile.png'}
              alt="Profile"
              fill
              className="object-cover rounded-full"
            />
          </div>
        </motion.div>

        {/* Username + Full Name */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl font-bold"
        >
          {userSelected?.username || 'Username'}
        </motion.h1>
        <span className="text-gray-400 -mt-2">{userSelected?.profileName || 'Profile Name'}</span>

        {/* Bio */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-base text-center text-gray-500 max-w-lg px-4 line-clamp-3"
        >
          {userSelected?.description || 'No bio provided.'}
        </motion.p>

        {/* Stats */}
        {canSeePrivateContent && (
          <div className="flex justify-center gap-10 mt-6">
            <StatBlock label="Posts" value={userSelected?.posts?.length} />
            <StatBlock label="Followers" value={userSelected?.followers?.length} onClick={() => { setMenuType('followers'); setShowMenu(true) }} />
            <StatBlock label="Following" value={userSelected?.following?.length} onClick={() => { setMenuType('following'); setShowMenu(true) }} />
          </div>
        )}

        {/* Follow Button */}
        {isLogin && !isOwner && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex gap-3 mt-4"
          >
            <button
              onClick={() => followUser(userSelected?._id)}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl border text-sm font-medium transition-all duration-300
                ${isFollowing
                  ? 'text-red-600 border-red-600 hover:bg-red-600 hover:text-white'
                  : 'text-green-600 border-green-600 hover:bg-green-600 hover:text-white'
                }`}
            >
              {isFollowing ? <RiUserUnfollowLine className="text-lg" /> : <RiUserFollowLine className="text-lg" />}
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>

            {/* Additional options */}
            <button
              onClick={() => setShowMenu(true)}
              className="px-4 py-2 border rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              ⋯
            </button>
          </motion.div>
        )}
      </div>

      {/* Main Content */}
      {isBlockedByMe ? (
        <div className="min-h-screen flex flex-col items-center justify-center text-center text-red-500 py-20 px-4">
          <h2 className="text-2xl font-bold mb-4">You have blocked this user</h2>
          <p className="text-sm text-gray-400 mb-6">Unblock them to see their profile again.</p>
          <button
            onClick={() => blockOrUnblockUser(userSelected?._id)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition"
          >
            Unblock User
          </button>
        </div>
      ) : (
        <div className='flex flex-col gap-6 w-full'>
          {canSeePrivateContent ? (
            <>
              <InfoAboutUser user={userSelected} />
              <Tabs activeTab={activeTab} setActiveTab={setActiveTab}/>
              <TabsContent activeTab={activeTab} combinedPosts={combinedPosts} posts={posts} userSelected={userSelected} />
            </>
          ) : (
            <p className="text-center text-gray-500 mt-4 text-lg">
              This account is private. Follow to see posts, comments, stats, and more information.
            </p>
          )}
        </div>
      )}

      {/* Followers / Following Modal */}
      <FollowModal
        visible={showMenu}
        onClose={() => setShowMenu(false)}
        type={menuType}
        list={menuType === 'followers' ? userSelected?.followers : userSelected?.following}
      />

      {/* Story Viewer */}
      {isViewerOpen && (
        <StoryViewer
          stories={userStories}
          onClose={() => setIsViewerOpen(false)}
        />
      )}
    </div>
  )
}

export default Page
