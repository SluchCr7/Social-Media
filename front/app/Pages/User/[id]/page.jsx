
'use client'

import Image from 'next/image'
import { useAuth } from '@/app/Context/AuthContext'
import { usePost } from '@/app/Context/PostContext'
import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import InfoAboutUser from '@/app/Component/UserComponents/InfoAboutUser'
import TabsContent from '@/app/Component/UserComponents/TabsContent'
import Tabs from '@/app/Component/UserComponents/Tabs'
import FollowModal from '@/app/Component/UserComponents/FollowModal'
import { useStory } from '@/app/Context/StoryContext'
import StoryViewer from '@/app/Component/StoryViewer'
import { useReport } from '@/app/Context/ReportContext'
import { RiUserFollowLine, RiUserUnfollowLine } from "react-icons/ri"
import { IoEllipsisHorizontal } from "react-icons/io5"
import { motion } from 'framer-motion'
import StatBlock from '@/app/Component/UserComponents/StatBlock'
import { HiBadgeCheck } from "react-icons/hi";
import { CheckStateAccount } from '@/app/Component/UserComponents/UsersStats'
import { selectUserFromUsers } from '@/app/utils/SelectUserFromUsers'
import ProfileSkeleton from '@/app/Skeletons/ProfileSkeleton'
import { useCombinedPosts } from '@/app/Custome/useCombinedPosts'
import { FaLock } from "react-icons/fa";
import { useAlert } from '@/app/Context/AlertContext'
import FilterBar from '@/app/Component/UserComponents/FilterBar'
import { useInfiniteScroll } from '@/app/Custome/useInfinteScroll'
import ProfileHeader from '@/app/Component/UserComponents/ProfileHeader'
import { usePostYears } from '@/app/Custome/usePostYears'
import ProfileMenu from '@/app/Component/UserComponents/ProfileMenu'

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
  const [isBlockedByMe, setIsBlockedByMe] = useState(false)
  const [page, setPage] = useState(1) // ✅ رقم الصفحة الحالي
  const loaderRef = useRef(null)
  const [openMenu, setOpenMenu] = useState(false)
  const [filters, setFilters] = useState({
    year: "all",
    month: "all",
    sort: "latest"
  })
  // 📌 تحديد اليوزر من قائمة الـ users
  useEffect(() => {
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
      if (user?.blockedUsers?.includes(userSelected._id)) setIsBlockedByMe(true)
      else setIsBlockedByMe(false)
    }
  }, [user, userSelected])

  const isFollowing = useMemo(() => userSelected?.followers?.some(f => f?._id === user?._id), [userSelected, user])
  const isOwner = user?._id === userSelected?._id
  const canSeePrivateContent = useMemo(() => !userSelected?.isPrivate || isOwner || isFollowing, [userSelected, isOwner, isFollowing])
  const combinedPosts = useMemo(() => {
      if (!userPosts.length && !userSelected?.pinsPosts.length) return []
  
      const pinnedIds = new Set(userSelected?.pinsPosts.map(p => p._id))
      const regularPosts = userPosts.filter(p => !pinnedIds.has(p._id))
  
      return [
        ...userSelected?.pinsPosts.map(p => ({ ...p, isPinned: true })),
        ...regularPosts.map(p => ({ ...p, isPinned: false })),
      ]
  }, [posts, userSelected?.pinsPosts])
  
  const postYears = useMemo(() => {
    if (!combinedPosts || combinedPosts.length === 0) return [];
    const yearsSet = new Set(
      combinedPosts.map((p) => new Date(p.createdAt).getFullYear().toString())
    );
    return Array.from(yearsSet).sort((a, b) => b - a); // ترتيب تنازلي
  }, [combinedPosts]);


  // 📌 جلب ستوريز اليوزر عند الضغط على صورته
  const handleProfileClick = async () => {
    if (!userSelected?._id) return
    const fetchedStories = await getUserStories(userSelected._id)
    if (fetchedStories.length > 0) {
      setUserStories(fetchedStories)
      setIsViewerOpen(true)
    }
  }


  const handleReport = () => {
    setIsTargetId(userSelected?._id);
    setReportedOnType('user');
    setShowMenuReport(true);
  }

  if (loading) return <ProfileSkeleton/>

  return (
    <div className="w-full pt-10 text-lightMode-text dark:text-darkMode-text bg-lightMode-bg dark:bg-darkMode-bg min-h-screen px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 gap-6">
      <ProfileHeader
        user={userSelected}
        isOwner={false}
        isFollowing={isFollowing}
        canSeePrivateContent={canSeePrivateContent}
        onProfileClick={handleProfileClick}
        onFollow={() => followUser(userSelected?._id)}
        openMenu={openMenu}
        setOpenMenu={setOpenMenu}
        onUnfollow={() => followUser(userSelected?._id)}
        onShowFollowers={() => { setFollowModalType("followers"); setShowFollowModal(true); }}
        onShowFollowing={() => { setFollowModalType("following"); setShowFollowModal(true); }}
        renderVisitorMenu={() => (
          <ProfileMenu
            context="visitor"
            actions={{
              handleReport,
              blockOrUnblockUser
            }}
            isBlockedByMe={isBlockedByMe}
            profileUrl={`${window.location.origin}/Pages/User/${userSelected?._id}`}
            userId={userSelected?._id}
            open={openMenu}
            setOpen={setOpenMenu}
          />
        )}
      />
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
