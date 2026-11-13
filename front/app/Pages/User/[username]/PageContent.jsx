'use client'
import dynamic from "next/dynamic"
import ProfileLayout from "@/app/Component/UserComponents/ProfileLayout"
import ProfileMenu from "@/app/Component/UserComponents/ProfileMenu"
const StoryViewer = dynamic(() => import('@/app/Component/StoryViewer'), {
  ssr: false,
});
const FollowModal = dynamic(() => import("@/app/Component/UserComponents/FollowModal"), {
  ssr: false,
});
import ProfileSkeleton from "@/app/Skeletons/ProfileSkeleton"
import { useAuth } from '@/app/redux/hooks';
import { useGetUserStoriesQuery } from '@/app/redux/hooks';
import { useReport } from '@/app/redux/hooks';
import { useProfilePosts } from "@/app/Custome/useProfilePosts"
import { useState } from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAdmin } from '@/app/redux/hooks';
import { useUser } from '@/app/redux/hooks';
import useDocumentTitle from '@/app/hooks/useDocumentTitle';

const UserProfilePage = ({ params }) => {
  const username = params.username
  const isLegacyProfileId = /^[a-f\d]{24}$/i.test(username)
  const router = useRouter()
  const { user } = useAuth()
  const {followUser} = useUser()
  const { setIsTargetId, setShowMenuReport, setReportedOnType } = useReport()
  const {blockOrUnblockUser} = useAdmin()
  const {
    combinedPosts, postYears, loading, postsLoading, loaderRef, userData,
    filters, setFilters, activeTab, setActiveTab, userHasMore
  } = useProfilePosts(username, [], true)
  const profileTitle = userData?.profileName || userData?.username
  const storiesQuery = useGetUserStoriesQuery(
    { userId: userData?._id },
    { skip: !userData?._id }
  )
  const userStories = storiesQuery.currentData || []
  useDocumentTitle(profileTitle ? `${profileTitle}'s profile` : null)

  useEffect(() => {
    if (isLegacyProfileId && userData?.username && userData.username !== username) {
      router.replace(`/Pages/User/${encodeURIComponent(userData.username)}`)
    }
  }, [isLegacyProfileId, userData?.username, username, router])

  const [showFollowModal, setShowFollowModal] = useState(false)
  const [followModalType, setFollowModalType] = useState("followers")
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState(false)

  if (loading) return <ProfileSkeleton />

  const handleProfileClick = () => {
    if (userStories.length > 0) setIsViewerOpen(true)
  }

  const handleReport = () => {
    setIsTargetId(userData?._id)
    setReportedOnType("user")
    setShowMenuReport(true)
  }

  const isFollowing = userData?.followers?.some(f => f?._id === user?._id)

  return (
    <div className="w-full min-h-screen bg-lightMode-bg dark:bg-darkMode-bg">
      <ProfileLayout
        user={userData}
        isOwner={false}
        isFollowing={isFollowing}
        canSeePrivateContent
        filters={filters}
        setFilters={setFilters}
        postYears={postYears}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        combinedPosts={combinedPosts}
        postsLoading={postsLoading}
        userHasMore={userHasMore}
        loaderRef={loaderRef}
        // ⬇️ مرر الدوال هنا
        onProfileClick={handleProfileClick}
        onFollow={() => followUser(userData?._id)}
        onUnfollow={() => followUser(userData?._id)} // أو دالة خاصة بالـ unfollow
        onShowFollowers={() => {
          setFollowModalType("followers")
          setShowFollowModal(true)
        }}
        onShowFollowing={() => {
          setFollowModalType("following")
          setShowFollowModal(true)
        }}
        setOpenMenu={setOpenMenu}
        openMenu={openMenu}
        renderMenu={() => (
          <ProfileMenu
            context="visitor"
            actions={{ followUser, blockOrUnblockUser, handleReport }}
            isBlockedByMe={user?.blockedUsers?.includes(userData?._id)}
            open={openMenu}
            setOpen={setOpenMenu}
          />
        )}
      />



      <FollowModal
        visible={showFollowModal}
        onClose={() => setShowFollowModal(false)}
        type={followModalType}
        list={followModalType === "followers" ? userData?.followers : userData?.following}
      />

      {isViewerOpen && (
        <StoryViewer stories={userStories} onClose={() => setIsViewerOpen(false)} />
      )}
    </div>
  )
}

export default UserProfilePage
