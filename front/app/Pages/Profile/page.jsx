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
import { useStory } from "@/app/Context/StoryContext"
import { FiX } from "react-icons/fi"
import { useEffect } from "react"

const ProfilePage = () => {
  const { user: authUser } = useAuth()
  const { updatePhoto, togglePrivateAccount } = useUser()
  const {
    combinedPosts, postYears, loading, loaderRef, userData,
    filters, setFilters, activeTab, setActiveTab, userHasMore
  } = useProfilePosts(authUser?._id)

  const [update, setUpdate] = useState(false)
  const { isStory, setIsStory } = useStory()
  const [showMenu, setShowMenu] = useState(false)
  const [menuType, setMenuType] = useState("followers")
  const [openMenu, setOpenMenu] = useState(false)
  // const serializableUserData = userData ? JSON.parse(JSON.stringify(userData)) : null;

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
        onImageChange={(e) => updatePhoto(e.target.files[0])}
        onEdit={() => setUpdate(true)}
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

      {update && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar relative">
            <button onClick={() => setUpdate(false)} className="absolute top-4 right-4 z-10 text-white hover:text-indigo-400 transition-colors">
              <FiX size={24} />
            </button>
            <UpdateProfile user={userData} />
          </div>
        </div>
      )}

      <AddStoryModel isOpen={isStory} onClose={() => setIsStory(false)} />

    </div>
  )
}

export default ProfilePage
