'use client'

import Image from 'next/image'
import { useAuth } from '@/app/Context/AuthContext'
import SluchitEntry from '@/app/Component/SluchitEntry'
import { usePost } from '@/app/Context/PostContext'
import { useState, useEffect } from 'react'
import { RiUserFollowLine, RiUserUnfollowLine } from "react-icons/ri"
import { FaPhone, FaGlobe, FaLinkedin, FaGithub, FaMapMarkerAlt, FaTwitter, FaFacebook } from 'react-icons/fa'
import { generateMeta } from '@/app/utils/MetaDataHelper'
import InfoAboutUser from '@/app/Component/UserComponents/InfoAboutUser'
import { motion, AnimatePresence } from 'framer-motion'
import CommentCard from '@/app/Component/UserComponents/CommentCard'
import TabsContent from '@/app/Component/UserComponents/TabsContent'
import Tabs from '@/app/Component/UserComponents/Tabs'
import StatBlock from '@/app/Component/UserComponents/StatBlock'
import FollowModal from '@/app/Component/UserComponents/FollowModal'

const tabs = ['Posts', 'Saved', 'Comments']


const Page = ({ params }) => {
  const id = params.id
  const { users, followUser, user , blockOrUnblockUser, isLogin,isAuthChecked } = useAuth()
  const { posts } = usePost()
  const [isBlockedByMe, setIsBlockedByMe] = useState(false);
  const [userSelected, setUserSelected] = useState({})
  const [activeTab, setActiveTab] = useState('Posts')
  const [showMenu, setShowMenu] = useState(false)
  const [menuType, setMenuType] = useState('followers')
  useEffect(() => {
    const matchedUser = users.find((u) => u?._id === id)
    if (matchedUser) setUserSelected(matchedUser)
  }, [id, users])
  useEffect(() => {
    if (user && userSelected?._id) {
      setIsBlockedByMe(user.blockedUsers?.includes(userSelected?._id));
    }
  }, [user, userSelected]);
  const isFollowing = userSelected?.followers?.some(f => f?._id === user?._id)


  const pinnedPosts = userSelected?.pinsPosts || []
  const pinnedIds = new Set(pinnedPosts.map((p) => p?._id))
  const regularPosts = (userSelected?.posts || []).filter((p) => !pinnedIds.has(p?._id))
  const combinedPosts = [
    ...pinnedPosts.map((post) => ({ ...post, isPinned: true })),
    ...regularPosts.map((post) => ({ ...post, isPinned: false })),
  ]

  return (
    <div className="w-full flex flex-col items-center pt-10 text-lightMode-text dark:text-darkMode-text bg-lightMode-bg dark:bg-darkMode-bg min-h-screen">
      {/* Profile Info */}
      <div className="flex flex-col items-center gap-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-36 h-36 rounded-full overflow-hidden shadow-lg"
        >
          <Image
            src={userSelected?.profilePhoto?.url || '/default-profile.png'}
            alt="Profile"
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
        </motion.div>


        {/* اسم المستخدم + الاسم الكامل */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl font-bold"
        >
          {userSelected?.username || 'Username'}
        </motion.h1>
        <span className="text-gray-400 -mt-2">
          {userSelected?.profileName || 'Profile Name'}
        </span>

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
        <div className="flex justify-center gap-10 mt-6">
          <StatBlock label="Posts" value={userSelected?.posts?.length} />
          <StatBlock label="Followers" value={userSelected?.followers?.length} onClick={() => { setMenuType('followers'); setShowMenu(true) }} />
          <StatBlock label="Following" value={userSelected?.following?.length} onClick={() => { setMenuType('following'); setShowMenu(true) }} />
        </div>
        {/* Follow Button */}
        {isLogin && user?._id !== userSelected?._id && (
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

          {/* زر خيارات إضافية */}
          <button
            onClick={() => setShowMenu(true)}
            className="px-4 py-2 border rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            ⋯
          </button>
        </motion.div>
        )}
      </div>
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
        <>
          {/* Personal Info */}
          <InfoAboutUser user={userSelected} />
          {/* Tabs */}
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab}/>
          <TabsContent activeTab={activeTab} combinedPosts={combinedPosts} posts={posts} userSelected={userSelected} />
        </>
      )}
      <FollowModal visible={showMenu} onClose={() => setShowMenu(false)} type={menuType} list={menuType === 'followers' ? userSelected?.followers : userSelected?.following} />
    </div>
  )
}


export default Page
