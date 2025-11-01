'use client'
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FaPlay, FaPause, FaStepForward, FaStepBackward
} from "react-icons/fa"
// ... (بقية الـ Imports)
import ProfileHeader from "./ProfileHeader"
import InfoAboutUser from "./InfoAboutUser"
import Tabs from "./Tabs"
import TabsContent from "./TabsContent"
import FilterBar from "./FilterBar"
import Image from "next/image"
import PostSkeleton from "@/app/Skeletons/PostSkeleton"
import HighlightsBar from "../Highlights" // تم جلب المكون
import { useHighlights } from "@/app/Context/HighlightContext" // تم جلب الـ Context
import { memo } from "react"
// Imports للمكونات الجديدة (يجب عليك إنشاء هذه الملفات أو التأكد من مساراتها)
// أنا أُضيفها هنا لتبسيط التنظيم، افترض أنها موجودة في نفس المسار أو مسار مُعَرَّف
import HighlightViewerModal from '../HighlightView'; // جلب مُكون العرض
import AddHighlightMenu from '../AddandUpdateMenus/AddHighlight'; // جلب مُكون الإضافة 
import StickyProfileBar from "./StickyProfileBar"
import AdultContentWarning from "../AdultAlert"


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
  const { highlights, fetchHighlights, setOpenModal,selectedHighlight, setSelectedHighlight } = useHighlights();
  useEffect(() => {
    fetchHighlights();
  }, [fetchHighlights]);
  const handleAddHighlight = () => {
    // لفتح قائمة إضافة هايلايت
    setOpenModal(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full min-h-screen bg-lightMode-bg dark:bg-darkMode-bg 
                  text-lightMode-text dark:text-darkMode-text px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 gap-6"
    >
      {/* ✅ الشريط الثابت */}
      <StickyProfileBar
        user={user}
        isOwner={isOwner}
        isFollowing={isFollowing}
        onFollow={onFollow}
        onUnfollow={onUnfollow}
      />
      {/* 👤 رأس البروفايل */}
      <div id="profile-header">
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
      </div>
      {
        !isOwner && user?.isContainAdultContent && (
          <AdultContentWarning />
        )
      }
      {/* ⚡ Highlights Bar - تم إلغاء التعليق عنه */}
      <HighlightsBar
        highlights={user?.highlights}
        onAddHighlight={handleAddHighlight}   // لفتح قائمة الإضافة
        isOwner={isOwner}                     // لتحديد إمكانية عرض زر 'New'
      />
      
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

      {/* 👁️ عارض الـ Highlight (HighlightViewerModal) */}
      {selectedHighlight && (
        <HighlightViewerModal
          highlight={selectedHighlight}
          onClose={()=> setSelectedHighlight(null)} // إغلاق الـ Viewer
          allStories={user?.stories}
        />
      )}

      {/* ➕ قائمة إضافة Highlight (AddHighlightMenu) */}
      {/* تُدار حالة الفتح/الإغلاق بواسطة 'openModal' في الـ Context */}
      <AddHighlightMenu stories={user?.stories} /> 
      
    </motion.div>
  )
}

export default memo(ProfileLayout)