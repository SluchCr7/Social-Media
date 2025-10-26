'use client'
import Head from "next/head"
import ProfileLayout from "@/app/Component/UserComponents/ProfileLayout"
import ProfileMenu from "@/app/Component/UserComponents/ProfileMenu"
import UpdateProfile from "@/app/Component/AddandUpdateMenus/UpdateProfile"
import AddStoryModel from "@/app/Component/AddandUpdateMenus/AddStoryModel"
import FollowModal from "@/app/Component/UserComponents/FollowModal"
import { useAuth } from "@/app/Context/AuthContext"
import { useProfilePosts } from "@/app/Custome/useProfilePosts"
import ProfileSkeleton from "@/app/Skeletons/ProfileSkeleton"
import { useState } from "react"
import { useUser } from "@/app/Context/UserContext"

const ProfilePage = () => {
  const { user } = useAuth() 
  const {togglePrivateAccount} = useUser()
  const {
    combinedPosts, postYears, loading, loaderRef, userData,
    filters, setFilters, activeTab, setActiveTab, userHasMore
  } = useProfilePosts(user?._id)

  const [update, setUpdate] = useState(false)
  const [isStory, setIsStory] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [menuType, setMenuType] = useState("followers")
  const [openMenu, setOpenMenu] = useState(false)

  if (loading) return <ProfileSkeleton />

  return (
    <div className="w-full min-h-screen bg-lightMode-bg dark:bg-darkMode-bg">
      <Head>
        <title>{userData?.username || "Profile"} | Social App</title>
      </Head>

      <ProfileLayout
        user={userData}
        isOwner
        isFollowing={false}
        canSeePrivateContent
        filters={filters}
        setFilters={setFilters}
        postYears={postYears}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        combinedPosts={combinedPosts}
        userHasMore={userHasMore}
        loaderRef={loaderRef}
        onImageChange={(e) => console.log("change photo", e.target.files[0])}
        onAddStory={() => setIsStory(true)}
        onShowFollowers={() => {
          setMenuType("followers")
          setShowMenu(true)
        }}
        onShowFollowing={() => {
          setMenuType("following")
          setShowMenu(true)
        }}
        setOpenMenu={setOpenMenu}
        openMenu={openMenu}
        renderMenu={() => (
          <ProfileMenu
            context="owner"
            actions={{ updatePrivacy: togglePrivateAccount, setUpdate }}
            isPrivate={userData?.isPrivate}
            open={openMenu}
            onAddStory={() => setIsStory(true)}
            setOpen={setOpenMenu}
          />
        )}
      />

      <FollowModal
        visible={showMenu}
        onClose={() => setShowMenu(false)}
        type={menuType}
        list={menuType === "followers" ? userData?.followers : userData?.following}
      />
      <UpdateProfile update={update} setUpdate={setUpdate} user={userData} />
      <AddStoryModel isStory={isStory} setIsStory={setIsStory} />
    </div>
  )
}

export default ProfilePage
