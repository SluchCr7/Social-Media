'use client'
import ProfileLayout from "@/app/Component/UserComponents/ProfileLayout"
import ProfileMenu from "@/app/Component/UserComponents/ProfileMenu"
import FollowModal from "@/app/Component/UserComponents/FollowModal"
import StoryViewer from "@/app/Component/StoryViewer"
import ProfileSkeleton from "@/app/Skeletons/ProfileSkeleton"
import { useAuth } from "@/app/Context/AuthContext"
import { useStory } from "@/app/Context/StoryContext"
import { useReport } from "@/app/Context/ReportContext"
import { useProfilePosts } from "@/app/Custome/useProfilePosts"
import { useState } from "react"

const UserProfilePage = ({ params }) => {
  const id = params.id
  const { followUser, blockOrUnblockUser, user } = useAuth()
  const { getUserStories } = useStory()
  const { setIsTargetId, setShowMenuReport, setReportedOnType } = useReport()

  const {
    combinedPosts, postYears, loading, loaderRef, userData,
    filters, setFilters, activeTab, setActiveTab, userHasMore
  } = useProfilePosts(id)

  const [showFollowModal, setShowFollowModal] = useState(false)
  const [followModalType, setFollowModalType] = useState("followers")
  const [userStories, setUserStories] = useState([])
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState(false)

  if (loading) return <ProfileSkeleton />

  const handleProfileClick = async () => {
    const fetchedStories = await getUserStories(userData._id)
    if (fetchedStories.length > 0) {
      setUserStories(fetchedStories)
      setIsViewerOpen(true)
    }
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
        userHasMore={userHasMore}
        loaderRef={loaderRef}
        renderMenu={() => (
          <ProfileMenu
            context="visitor"
            actions={{ followUser, blockOrUnblockUser, handleReport }}
            isBlockedByMe={user?.blockedUsers?.includes(userData._id)}
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
