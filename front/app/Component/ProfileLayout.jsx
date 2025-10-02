'use client'
import { motion, AnimatePresence } from "framer-motion"
import ProfileHeader from "./ProfileHeader"
import InfoAboutUser from "./InfoAboutUser"
import Tabs from "./Tabs"
import TabsContent from "./TabsContent"
import FilterBar from "./FilterBar"

const ProfileLayout = ({
  user,
  isOwner,
  isFollowing,
  canSeePrivateContent,
  filters,
  setFilters,
  postYears,
  activeTab,
  setActiveTab,
  combinedPosts,
  userHasMore,
  loaderRef,
  renderMenu
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full min-h-screen bg-lightMode-bg dark:bg-darkMode-bg 
                 text-lightMode-text dark:text-darkMode-text px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 gap-6"
    >
      <ProfileHeader
        user={user}
        isOwner={isOwner}
        isFollowing={isFollowing}
        renderMenu={renderMenu}
      />

      <InfoAboutUser user={user} />

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
              <FilterBar filters={filters} setFilters={setFilters} years={postYears} />
            )}

            <TabsContent
              activeTab={activeTab}
              combinedPosts={combinedPosts}
              userSelected={user}
              filters={filters}
            />

            {userHasMore && (
              <div ref={loaderRef} className="flex justify-center py-6">
                <span className="text-gray-500">Loading more...</span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default ProfileLayout
