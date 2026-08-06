'use client'
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ProfileHeader from "./ProfileHeader"
import InfoAboutUser from "./InfoAboutUser"
import Tabs from "./Tabs"
import TabsContent from "./TabsContent"
import FilterBar from "./FilterBar"
import PostSkeleton from "@/app/Skeletons/PostSkeleton"
import HighlightsBar from "../Highlights"
import { useHighlights } from "@/app/Context/HighlightContext"
import { memo } from "react"
import HighlightViewerModal from '../HighlightView';
import AddHighlightMenu from '../AddandUpdateMenus/AddHighlight';
import StickyProfileBar from "./StickyProfileBar"
import AdultContentWarning from "../AdultAlert"
import { useUser } from "@/app/Context/UserContext"
import { useAuth } from "@/app/Context/AuthContext"
import { useStory } from "@/app/Context/StoryContext"

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
  renderMenu,
  onImageChange,
  onEdit,
  onAddStory,
  onFollow,
  onUnfollow,
  onShowFollowers,
  onShowFollowing,
  onProfileClick,
  setOpenMenu,
  openMenu
}) => {
  const { updateCoverPhoto } = useUser();
  const { user: currentUser } = useAuth();
  const { getArchivedStories, getUserStories } = useStory();
  const [profileStories, setProfileStories] = useState([]);
  const { highlights, fetchHighlights, setOpenModal, selectedHighlight, setSelectedHighlight } = useHighlights();

  const [localUser, setLocalUser] = useState(user);
  const [localIsFollowing, setLocalIsFollowing] = useState(isFollowing);

  useEffect(() => {
    setLocalUser(user);
  }, [user]);

  useEffect(() => {
    setLocalIsFollowing(isFollowing);
  }, [isFollowing]);

  useEffect(() => {
    let active = true;
    if (!user?._id) return;

    const loadProfileStories = async () => {
      // If profile owner, load full archive so all past stories can be added to highlights
      const fetched = isOwner ? await getArchivedStories(user._id) : await getUserStories(user._id);
      if (active) setProfileStories(fetched || []);
    };

    loadProfileStories();
    return () => { active = false; };
  }, [user?._id, isOwner, getArchivedStories, getUserStories]);

  const handleOptimisticFollow = async () => {
    const wasFollowing = localIsFollowing;
    const newIsFollowing = !wasFollowing;
    setLocalIsFollowing(newIsFollowing);

    if (localUser) {
      let newFollowers = localUser.followers || [];
      if (wasFollowing) {
        newFollowers = newFollowers.filter(f => (f?._id || f) !== currentUser?._id);
      } else {
        if (currentUser) newFollowers = [...newFollowers, currentUser];
      }
      setLocalUser({ ...localUser, followers: newFollowers });
    }

    if (wasFollowing) {
      if (onUnfollow) await onUnfollow();
    } else {
      if (onFollow) await onFollow();
    }
  };

  useEffect(() => {
    if (user?._id) fetchHighlights(user._id);
  }, [user?._id, fetchHighlights]);

  const handleAddHighlight = () => {
    setOpenModal(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full min-h-screen bg-lightMode-bg dark:bg-darkMode-bg 
                  text-lightMode-text dark:text-darkMode-text px-3 sm:px-6 lg:px-8 py-6 grid grid-cols-1 gap-4 sm:gap-6"
    >
      <StickyProfileBar
        user={localUser}
        isOwner={isOwner}
        isFollowing={localIsFollowing}
        onFollow={handleOptimisticFollow}
        onUnfollow={handleOptimisticFollow}
      />
      <div id="profile-header">
        <ProfileHeader
          user={localUser}
          isOwner={isOwner}
          isFollowing={localIsFollowing}
          canSeePrivateContent={canSeePrivateContent}
          onImageChange={onImageChange}
          onEdit={onEdit}
          onAddStory={onAddStory}
          onFollow={handleOptimisticFollow}
          onUnfollow={handleOptimisticFollow}
          onShowFollowers={onShowFollowers}
          onShowFollowing={onShowFollowing}
          onProfileClick={onProfileClick}
          setOpenMenu={setOpenMenu}
          openMenu={openMenu}
          onCoverChange={(e) => updateCoverPhoto(e.target.files[0])}
          renderOwnerMenu={isOwner ? renderMenu : undefined}
          renderVisitorMenu={!isOwner ? renderMenu : undefined}
        />
      </div>
      {
        !isOwner && user?.isContainAdultContent && (
          <AdultContentWarning />
        )
      }
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 items-start">
        <HighlightsBar
          highlights={highlights}
          onAddHighlight={handleAddHighlight}
          isOwner={isOwner}
        />

        <InfoAboutUser user={localUser} />

        <div className="flex flex-col gap-6 w-full">
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
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
                  <span className="text-gray-500">
                    <PostSkeleton className="animate-pulse" />
                  </span>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {selectedHighlight && (
        <HighlightViewerModal
          highlight={selectedHighlight}
          onClose={() => setSelectedHighlight(null)}
          allStories={profileStories}
        />
      )}

      <AddHighlightMenu stories={profileStories || []} />

    </motion.div>
  )
}

export default memo(ProfileLayout)