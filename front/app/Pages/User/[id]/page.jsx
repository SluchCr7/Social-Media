
'use client'

import Image from 'next/image'
import { useAuth } from '@/app/Context/AuthContext'
import { usePost } from '@/app/Context/PostContext'
import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
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
import { useReport } from '@/app/Context/ReportContext'
import { HiBadgeCheck } from "react-icons/hi";
import { CheckStateAccount } from '@/app/Component/UserComponents/UsersStats'
import ProfileSkeleton from '@/app/Skeletons/ProfileSkeleton'
import { useCombinedPosts } from '@/app/Custome/useCombinedPosts'
import { selectUserFromUsers } from '@/app/utils/SelectUserFromUsers'
import { FaLock } from "react-icons/fa";
import { useAlert } from '@/app/Context/AlertContext'
import FilterBar from '@/app/Component/UserComponents/FilterBar'
import { useInfiniteScroll } from '@/app/Custome/useInfinteScroll'
import ProfileHeader from '@/app/Component/UserComponents/ProfileHeader'
import { usePostYears } from '@/app/Custome/usePostYears'

const tabs = ['Posts', 'Saved', 'Comments']

const UserProfilePage = ({ params }) => {
  const id = params.id
  const { users, followUser, user, blockOrUnblockUser, isLogin, getUserById } = useAuth()
  const { fetchUserPosts, userPosts, posts, setUserPages, userHasMore } = usePost()
  const { getUserStories } = useStory()
  const { setIsTargetId, setShowMenuReport, setReportedOnType } = useReport();
  const {showAlert} = useAlert()
  const [userSelected, setUserSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('Posts')
  const [showFollowModal, setShowFollowModal] = useState(false)
  const [followModalType, setFollowModalType] = useState('followers')
  const [userStories, setUserStories] = useState([])
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [showDotsMenu, setShowDotsMenu] = useState(false)
  const [isBlockedByMe, setIsBlockedByMe] = useState(false)
  const [page, setPage] = useState(1) // ✅ رقم الصفحة الحالي
  const loaderRef = useRef(null)
  const [filters, setFilters] = useState({
    year: "all",
    month: "all",
    sort: "latest"
  })
  // 📌 تحديد اليوزر من قائمة الـ users
  useEffect(() => {
    // selectUserFromUsers(setUserSelected, users, id)
    getUserById(id).then(res => setUserSelected(res)).catch(err => console.log(err))
  }, [id, users])
    // 📌 أول تحميل للبوستات
  useEffect(() => {
    if (userSelected?._id) {
      setPage(1)
      fetchUserPosts(userSelected._id, 1, 10, true) // reset = true (يمسح القديم)
    }
  }, [userSelected?._id])


  useInfiniteScroll(page , setPage ,loaderRef, fetchUserPosts ,userSelected,userHasMore)
  

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
  const combinedPosts = useCombinedPosts(userPosts, userSelected?.pinsPosts || [])
  const postYears = usePostYears(combinedPosts);


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
    navigator.clipboard.writeText(`${window.location.origin}/Pages/User/${userSelected?._id}`)
    showAlert("Link copied to clipboard.");
    setShowDotsMenu(false)
  }

  const handleBlock = async () => {
    const updatedTargetUser = await blockOrUnblockUser(userSelected._id);
    if (updatedTargetUser) setUserSelected(updatedTargetUser);
    setShowDotsMenu(false);
  };


  const handleReport = () => {
    setIsTargetId(userSelected?._id);
    setReportedOnType('user');
    setShowMenuReport(true);
    setShowDotsMenu(false)
  }

  if (loading) return <ProfileSkeleton/>

  return (
    <div className="w-full pt-10 text-lightMode-text dark:text-darkMode-text bg-lightMode-bg dark:bg-darkMode-bg min-h-screen px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 gap-6">
      <div>

        {/* ===================== Upper Profile Section =====================

        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 w-full">
            <motion.div
              whileHover={{ scale: 1.05 }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className={`relative w-36 h-36 rounded-full shadow-lg cursor-pointer p-[3px]
              ${userSelected?.stories?.length > 0
                ? 'border-[5px] border-blue-500 animate-spin-slow'
                : 'border-0 border-transparent'}`}
              onClick={handleProfileClick}
            >
              <div className="w-full h-full rounded-full overflow-hidden bg-lightMode-bg dark:bg-darkMode-bg p-[2px]">
                <Image
                  src={userSelected?.profilePhoto?.url || '/default-profile.png'}
                  alt="Profile"
                  fill
                  className="object-cover rounded-full"
                />
              </div>
            </motion.div>

            <div className="flex flex-col gap-3 flex-1 w-full">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold break-words">
                  {userSelected?.username || 'Username'}
                </h1>
                {userSelected?.isAccountWithPremiumVerify && (
                  <HiBadgeCheck className="text-blue-500 text-xl" title="Verified account" />
                )}
              </div>

              <div className="w-full sm:max-w-xs">
                <div className="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-300">
                  <span className="flex items-center gap-1">
                    {userSelected?.userLevelRank || 'Junior'}
                    <span className="text-lg">🏅</span>
                  </span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {userSelected?.userLevelPoints || 0} XP
                  </motion.span>
                </div>

                <div className="w-full h-3 bg-gray-300 dark:bg-gray-700 rounded-full mt-2 overflow-hidden shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${
                        Math.min(
                          ((userSelected?.userLevelPoints || 0) / (userSelected?.nextLevelPoints || 500)) * 100,
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
                    (userSelected?.nextLevelPoints || 500) - (userSelected?.userLevelPoints || 0),
                    0
                  )} XP`}
                </span>
              </div>


              <p className="text-sm sm:text-base text-gray-500 max-w-xs break-words whitespace-pre-wrap">
                {userSelected?.description || 'No bio yet.'}
              </p>


              {canSeePrivateContent && (
                <div className="flex justify-center lg:justify-start gap-10 mt-4 w-full">
                  <StatBlock label="Posts" value={userSelected?.posts?.length} />
                  <StatBlock label="Followers" value={userSelected?.followers?.length} onClick={() => { setFollowModalType('followers'); setShowFollowModal(true) }} />
                  <StatBlock label="Following" value={userSelected?.following?.length} onClick={() => { setFollowModalType('following'); setShowFollowModal(true) }} />
                </div>
              )}
            
              {isLogin && !isOwner && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="flex gap-3 mt-4 relative w-fit"
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
                    <div className="absolute top-12 -right-3 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl z-50 overflow-hidden animate-scale-in">
                      <ul className="flex flex-col">
                        <li>
                          <button 
                            onClick={handleReport} 
                            className="flex items-center gap-3 px-5 py-3 w-full text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          >
                            🚩 Report User
                          </button>
                        </li>
                        <li>
                          <button 
                            onClick={handleBlock} 
                            className="flex items-center gap-3 px-5 py-3 w-full text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          >
                            {isBlockedByMe ? "🔓 Unblock User" : "⛔ Block User"}
                          </button>
                        </li>
                        <li>
                          <button 
                            onClick={handleCopyLink} 
                            className="flex items-center gap-3 px-5 py-3 w-full text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          >
                            🔗 Copy Profile Link
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}

                </motion.div>
              )}
            </div>

        </div> */}
      </div>
      <ProfileHeader
        user={userSelected}
        isOwner={false}
        isFollowing={isFollowing}
        canSeePrivateContent={canSeePrivateContent}
        onProfileClick={handleProfileClick}
        onFollow={() => followUser(userSelected?._id)}
        onUnfollow={() => followUser(userSelected?._id)}
        onShowFollowers={() => { setFollowModalType("followers"); setShowFollowModal(true); }}
        onShowFollowing={() => { setFollowModalType("following"); setShowFollowModal(true); }}
        renderVisitorMenu={() => (
          <button onClick={() => setShowDotsMenu(!showDotsMenu)} className="ml-auto">
            <IoEllipsisHorizontal className="text-xl" />
          </button>
        )}
      />
      {showDotsMenu && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-gray-800 shadow-lg border dark:border-gray-700 overflow-hidden z-50">
          <ul className="flex flex-col">
            <li>
              <button 
                onClick={handleReport} 
                className="flex items-center gap-3 px-5 py-3 w-full text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                🚩 Report User
              </button>
            </li>
            <li>
              <button 
                onClick={handleBlock} 
                className="flex items-center gap-3 px-5 py-3 w-full text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {isBlockedByMe ? "🔓 Unblock User" : "⛔ Block User"}
              </button>
            </li>
            <li>
              <button 
                onClick={handleCopyLink} 
                className="flex items-center gap-3 px-5 py-3 w-full text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                🔗 Copy Profile Link
              </button>
            </li>
          </ul>
        </div>
      )}
      {/* Main Content */}
      {isBlockedByMe ? (
        <div className="min-h-screen flex flex-col items-center justify-center text-center text-red-500 py-20 px-4">
          <h2 className="text-2xl font-bold mb-4">You have blocked this user</h2>
          <p className="text-sm text-gray-400 mb-6">Unblock them to see their profile again.</p>
          <button
            onClick={() => handleBlock(userSelected?._id)}
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
              {activeTab === "Posts" && (
                <FilterBar filters={filters} setFilters={setFilters} years={postYears} />
              )}

              <TabsContent 
                activeTab={activeTab} 
                combinedPosts={combinedPosts} 
                posts={posts} 
                userSelected={userSelected}
                filters={filters}
              />
            </>
          ) : (
            <div className="flex items-center w-full text-center flex-col gap-2">
              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                <FaLock className="w-10 h-10 text-gray-600 dark:text-gray-300" />
              </div>

              {/* العنوان */}
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                This account is private
              </h2>

              {/* النص التوضيحي */}
              <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
                Follow to unlock posts, comments, stats, and more exclusive content.
              </p>
            </div>
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
