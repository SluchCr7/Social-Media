'use client'
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FaPlay, FaPause, FaStepForward, FaStepBackward
} from "react-icons/fa"
import ProfileHeader from "./ProfileHeader"
import InfoAboutUser from "./InfoAboutUser"
import Tabs from "./Tabs"
import TabsContent from "./TabsContent"
import FilterBar from "./FilterBar"
import Image from "next/image"

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
  // 🎵 إدارة حالة مشغل الموسيقى
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)

  const musicList = user?.audios || []

  const handlePlayPause = (index) => {
    if (currentTrackIndex === index) {
      setIsPlaying(!isPlaying)
    } else {
      setCurrentTrackIndex(index)
      setIsPlaying(true)
    }
  }

  useEffect(() => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false))
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying, currentTrackIndex])

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % musicList.length)
    setIsPlaying(true)
  }

  const handlePrev = () => {
    setCurrentTrackIndex((prev) =>
      prev === 0 ? musicList.length - 1 : prev - 1
    )
    setIsPlaying(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full min-h-screen bg-lightMode-bg dark:bg-darkMode-bg 
                 text-lightMode-text dark:text-darkMode-text px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 gap-6"
    >
      {/* 👤 رأس البروفايل */}
      <ProfileHeader
        user={user}
        isOwner={isOwner}
        isFollowing={isFollowing}
        canSeePrivateContent={canSeePrivateContent}
        onImageChange={onImageChange}
        onEdit={onEdit}
        onAddStory={onAddStory}
        onFollow={onFollow}
        onUnfollow={onUnfollow}
        onShowFollowers={onShowFollowers}
        onShowFollowing={onShowFollowing}
        onProfileClick={onProfileClick}
        setOpenMenu={setOpenMenu}
        openMenu={openMenu}
        renderOwnerMenu={isOwner ? renderMenu : undefined}
        renderVisitorMenu={!isOwner ? renderMenu : undefined}
      />

      {/* 🎶 قسم الموسيقى */}
      {musicList.length > 0 && (
        <div className="flex flex-col items-center gap-6 w-full py-4">
          <h2 className="text-xl font-semibold text-center">My Music</h2>

          {/* ✅ غلاف الأغنية مع أنميشن */}
          <motion.div
            className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden shadow-xl cursor-pointer border-4 border-primary/40"
            animate={{
              rotate: isPlaying ? 360 : 0,
            }}
            transition={{
              repeat: isPlaying ? Infinity : 0,
              duration: 10,
              ease: "linear",
            }}
            onClick={() => handlePlayPause(currentTrackIndex)}
          >
            <Image
              width={300}
              height={300}
              src={musicList[currentTrackIndex]?.cover || "/default-cover.jpg"}
              alt="cover"
              className="object-cover w-full h-full"
            />
            <motion.div
              className="absolute inset-0 bg-black/30 flex items-center justify-center text-white"
              whileTap={{ scale: 0.9 }}
            >
              {isPlaying ? (
                <FaPause size={32} />
              ) : (
                <FaPlay size={32} />
              )}
            </motion.div>
          </motion.div>

          {/* 🔊 معلومات الأغنية */}
          <div className="text-center">
            <p className="text-lg font-medium">
              {musicList[currentTrackIndex]?.title || "Unknown Track"}
            </p>
            <p className="text-sm text-gray-500">
              {musicList[currentTrackIndex]?.artist || user?.username}
            </p>
          </div>

          {/* ⏯️ أزرار التحكم */}
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={handlePrev}
              className="p-3 rounded-full bg-primary/20 hover:bg-primary/40 transition"
            >
              <FaStepBackward size={20} />
            </button>
            <button
              onClick={() => handlePlayPause(currentTrackIndex)}
              className="p-4 rounded-full bg-primary text-white hover:bg-primary/80 transition"
            >
              {isPlaying ? <FaPause size={22} /> : <FaPlay size={22} />}
            </button>
            <button
              onClick={handleNext}
              className="p-3 rounded-full bg-primary/20 hover:bg-primary/40 transition"
            >
              <FaStepForward size={20} />
            </button>
          </div>

          {/* 🎧 العنصر الصوتي الفعلي */}
          <audio
            ref={audioRef}
            src={musicList[currentTrackIndex]?.url}
            onEnded={handleNext}
          />
        </div>
      )}

      {/* 🧾 معلومات المستخدم */}
      <InfoAboutUser user={user} />

      {/* 🧭 التبويبات والمحتوى */}
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
