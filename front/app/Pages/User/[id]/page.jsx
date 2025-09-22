'use client'

import Image from 'next/image'
import { useAuth } from '@/app/Context/AuthContext'
import { usePost } from '@/app/Context/PostContext'
import { useState, useEffect, useMemo } from 'react'
import { RiUserFollowLine, RiUserUnfollowLine } from "react-icons/ri"
import { IoEllipsisHorizontal } from "react-icons/io5"
import InfoAboutUser from '@/app/Component/UserComponents/InfoAboutUser'
import { motion } from 'framer-motion'
import TabsContent from '@/app/Component/UserComponents/TabsContent'
import Tabs from '@/app/Component/UserComponents/Tabs'
import StatBlock from '@/app/Component/UserComponents/StatBlock'
import FollowModal from '@/app/Component/UserComponents/FollowModal'
import { useStory } from '@/app/Context/StoryContext'
import StoryViewer from '@/app/Component/StoryViewer'
import { toast } from 'react-hot-toast'
import { useReport } from '@/app/Context/ReportContext'
import { HiBadgeCheck } from "react-icons/hi";
import { CheckStateAccount } from '@/app/Component/UserComponents/UsersStats'
import ProfileSkeleton from '@/app/Skeletons/ProfileSkeleton'

const tabs = ['Posts', 'Saved', 'Comments']

const UserProfilePage = ({ params }) => {
  const id = params.id
  const { users, followUser, user, blockOrUnblockUser, isLogin } = useAuth()
  const { posts } = usePost()
  const { getUserStories } = useStory()
  const { setIsTargetId, setShowMenuReport, setReportedOnType } = useReport();

  const [userSelected, setUserSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('Posts')
  const [showFollowModal, setShowFollowModal] = useState(false)
  const [followModalType, setFollowModalType] = useState('followers')
  const [userStories, setUserStories] = useState([])
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [showDotsMenu, setShowDotsMenu] = useState(false)
  const [isBlockedByMe, setIsBlockedByMe] = useState(false)

  // 📌 تحديد اليوزر من قائمة الـ users
  useEffect(() => {
    const matchedUser = users.find(u => u?._id === id)
    setUserSelected(matchedUser || null)
  }, [id, users])

  useEffect(() => {
    if (userSelected) setLoading(false)
  }, [userSelected])

  useEffect(() => {
    if (user && userSelected) {
      setIsBlockedByMe(user.blockedUsers?.includes(userSelected._id))
    }
  }, [user, userSelected])

  const isFollowing = useMemo(() => userSelected?.followers?.some(f => f?._id === user?._id), [userSelected, user])
  const isOwner = user?._id === userSelected?._id
  const canSeePrivateContent = useMemo(() => !userSelected?.isPrivate || isOwner || isFollowing, [userSelected, isOwner, isFollowing])

  // 📌 تقسيم البوستات (مثبتة + عادية)
  const combinedPosts = useMemo(() => {
    if (!canSeePrivateContent || !userSelected) return []
    const pinnedPosts = userSelected?.pinsPosts || []
    const pinnedIds = new Set(pinnedPosts.map(p => p?._id))
    const regularPosts = (userSelected?.posts || []).filter(p => !pinnedIds.has(p?._id))
    return [
      ...pinnedPosts.map(post => ({ ...post, isPinned: true })),
      ...regularPosts.map(post => ({ ...post, isPinned: false })),
    ]
  }, [userSelected, canSeePrivateContent])

  // 📌 جلب ستوريز اليوزر عند الضغط على صورته
  const handleProfileClick = async () => {
    if (!userSelected?._id) return
    const fetchedStories = await getUserStories(userSelected._id)
    if (fetchedStories.length > 0) {
      setUserStories(fetchedStories)
      setIsViewerOpen(true)
    }
  }

  // 📌 وظائف الدوتس مينو
  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/user/${userSelected?._id}`)
    toast.success("Profile link copied!")
    setShowDotsMenu(false)
  }

  const handleBlock = () => {
    blockOrUnblockUser(userSelected?._id)
    setShowDotsMenu(false)
  }

  const handleReport = () => {
    setIsTargetId(userSelected?._id);
    setReportedOnType('user');
    setShowMenuReport(true);
    setShowDotsMenu(false)
  }

  if (loading) return <ProfileSkeleton/>

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
              ? 'border-[5px] border-blue-500' 
              : 'border-0 border-transparent'}`}
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

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl font-bold flex items-center gap-2"
        >
          {userSelected?.username || 'Username'}
          {userSelected?.isAccountWithPremiumVerify && <HiBadgeCheck className='text-blue-500'/>}
        </motion.h1>
        <span className="text-gray-400 -mt-2">{userSelected?.profileName || 'Profile Name'}</span>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-base text-center text-gray-500 max-w-lg px-4 line-clamp-3"
        >
          {userSelected?.description || 'No bio provided.'}
        </motion.p>

        <CheckStateAccount user={userSelected}/>

        {canSeePrivateContent && (
          <div className="flex justify-center gap-10 mt-6">
            <StatBlock label="Posts" value={userSelected?.posts?.length} />
            <StatBlock label="Followers" value={userSelected?.followers?.length} onClick={() => { setFollowModalType('followers'); setShowFollowModal(true) }} />
            <StatBlock label="Following" value={userSelected?.following?.length} onClick={() => { setFollowModalType('following'); setShowFollowModal(true) }} />
          </div>
        )}

        {/* Follow Button + Dots Menu */}
        {isLogin && !isOwner && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex gap-3 mt-4 relative"
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

            <button
              onClick={() => setShowDotsMenu(!showDotsMenu)}
              className="px-4 py-2 border rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition relative"
            >
              <IoEllipsisHorizontal className="text-xl" />
            </button>

            {showDotsMenu && (
              <div className="absolute top-12 right-0 w-48 bg-white dark:bg-gray-900 border rounded-xl shadow-lg z-50 flex flex-col py-2">
                <button onClick={handleReport} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-left">Report User</button>
                <button onClick={handleBlock} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-left">
                  {isBlockedByMe ? "Unblock User" : "Block User"}
                </button>
                <button onClick={handleCopyLink} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-left">Copy Profile Link</button>
              </div>
            )}
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
        visible={showFollowModal}
        onClose={() => setShowFollowModal(false)}
        type={followModalType}
        list={followModalType === 'followers' ? userSelected?.followers : userSelected?.following}
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

export default UserProfilePage
