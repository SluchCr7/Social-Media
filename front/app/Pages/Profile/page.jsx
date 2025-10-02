'use client'

import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { FaUserEdit, FaCamera } from 'react-icons/fa'
import { IoAdd, IoEllipsisHorizontal } from 'react-icons/io5'
import { HiBadgeCheck } from 'react-icons/hi'
import Head from 'next/head'

import { useAuth } from '@/app/Context/AuthContext'
import { usePost } from '@/app/Context/PostContext'

import ProfileSkeleton from '@/app/Skeletons/ProfileSkeleton'
import UpdateProfile from '@/app/Component/UpdateProfile'
import AddStoryModel from '@/app/Component/AddStoryModel'
import InfoAboutUser from '@/app/Component/UserComponents/InfoAboutUser'
import TabsContent from '@/app/Component/UserComponents/TabsContent'
import Tabs from '@/app/Component/UserComponents/Tabs'
import StatBlock from '@/app/Component/UserComponents/StatBlock'
import FollowModal from '@/app/Component/UserComponents/FollowModal'
import { CheckStateAccount } from '@/app/Component/UserComponents/UsersStats'
import { useCombinedPosts } from '@/app/Custome/useCombinedPosts'
import { selectUserFromUsers } from '@/app/utils/SelectUserFromUsers'
import FilterBar from '@/app/Component/UserComponents/FilterBar'
import ProfileMenu from '@/app/Component/UserComponents/ProfileMenu'
import { useInfiniteScroll } from '@/app/Custome/useInfinteScroll'
import ProfileHeader from '@/app/Component/UserComponents/ProfileHeader'
import { usePostYears } from '@/app/Custome/usePostYears'

const ProfilePage = () => {
  const { user, users, updatePhoto,togglePrivateAccount,getUserById } = useAuth()
  const { fetchUserPosts, userPosts, posts, setUserPages, userHasMore } = usePost()

  const [activeTab, setActiveTab] = useState('Posts')
  const [loading, setLoading] = useState(true)
  const [image, setImage] = useState(null)
  const [userData, setUserData] = useState({})
  const [update, setUpdate] = useState(false)
  const [isStory, setIsStory] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [menuType, setMenuType] = useState('followers')
  const [page, setPage] = useState(1) // ✅ رقم الصفحة الحالي
  const loaderRef = useRef(null)
  const [openMenu , setOpenMenu] = useState(false)
  const [filters, setFilters] = useState({
    year: "all",
    month: "all",
    sort: "latest"
  })

  // 📌 تحديث بيانات المستخدم عند التغير
  useEffect(() => {
    if (!user?._id) return;
    setLoading(true);
    getUserById(user._id)
      .then(res => setUserData(res))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, [user?._id]);


  // 📌 أول تحميل للبوستات
  useEffect(() => {
    if (userData?._id) {
      setPage(1)
      fetchUserPosts(userData._id, 1, 10, true) // reset = true (يمسح القديم)
    }
  }, [userData?._id])

  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && userHasMore && user?._id) {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchUserPosts(user._id, nextPage, 10);
      }
    },
    [page, userHasMore, user?._id, setPage, fetchUserPosts]
  );

  useEffect(() => {
    if (!loaderRef?.current) return;

    const options = { root: null, rootMargin: "20px", threshold: 1.0 };
    const observer = new IntersectionObserver(handleObserver, options);

    observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [handleObserver, loaderRef]);
  const combinedPosts = useMemo(() => {
    if (!userPosts && !userData?.pinsPosts) return []

    const pins = (userData?.pinsPosts || []).map(p => ({ ...p, isPinned: true }))
    const pinnedIds = new Set(pins.map(p => p._id))

    // دمج: أي بوست في userPosts نشوف لو هو pinned
    const regularPosts = (userPosts || []).map(p => ({
      ...p,
      isPinned: pinnedIds.has(p._id),
    }))

    // ندمج الاثنين (للتأكد مفيش تكرار)
    const all = [...pins, ...regularPosts.filter(p => !pinnedIds.has(p._id))]

    // ✅ ترتيب: pinned فوق، بعدين الباقي بالـ createdAt
    return all.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return new Date(b.createdAt) - new Date(a.createdAt) // الأحدث بعد البيند
    })
  }, [userPosts, userData?.pinsPosts])
  useEffect(()=>{
    console.log(combinedPosts)
  },[combinedPosts])
  const postYears = useMemo(() => {
    if (!combinedPosts || combinedPosts?.length === 0) return [];
    const yearsSet = new Set(
      combinedPosts?.map((p) => new Date(p.createdAt).getFullYear().toString())
    );
    return Array.from(yearsSet).sort((a, b) => b - a); // ترتيب تنازلي
  }, [combinedPosts]);

  // 📌 تغيير الصورة الشخصية
  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      if (updatePhoto) await updatePhoto(file)
    }
  }
  if (loading) return <ProfileSkeleton />
  return (
    <div className="w-full min-h-screen bg-lightMode-bg dark:bg-darkMode-bg text-lightMode-text dark:text-darkMode-text">
      <Head>
        <title>{userData?.username || 'Profile'} | Social App</title>
      </Head>

      <CheckStateAccount user={userData} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full min-h-screen bg-lightMode-bg dark:bg-darkMode-bg text-lightMode-text dark:text-darkMode-text px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 gap-6"
      >
        <ProfileHeader
          user={userData}
          isOwner
          image={image}
          onImageChange={handleImageChange}
          onEdit={() => setUpdate(true)}
          onAddStory={() => setIsStory(true)}
          setOpenMenu={setOpenMenu}
          openMenu={openMenu}
          onShowFollowers={() => { setMenuType("followers"); setShowMenu(true); }}
          onShowFollowing={() => { setMenuType("following"); setShowMenu(true); }}
          renderOwnerMenu={() => (
            <ProfileMenu
              context="owner"
              actions={{
                updatePrivacy: togglePrivateAccount,
                setUpdate
              }}
              isPrivate={userData?.isPrivate}
              profileUrl={`${window.location.origin}/Pages/User/${userData?._id}`}
              userId={userData._id}
              open={openMenu}
              setOpen={setOpenMenu}
            />
          )}
        />

        <InfoAboutUser user={userData} />

        {/* Main Column */}
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
                <FilterBar filters={filters} 
                  setFilters={setFilters}
                  years={postYears} />
              )}

              <TabsContent 
                activeTab={activeTab} 
                combinedPosts={combinedPosts} 
                posts={posts} 
                userSelected={userData}
                filters={filters}
              />
              {/* Loader for Infinite Scroll */}
              {userHasMore && (
                <div ref={loaderRef} className="flex justify-center py-6">
                  <span className="text-gray-500">Loading more...</span>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Modals */}
      <FollowModal
        visible={showMenu}
        onClose={() => setShowMenu(false)}
        type={menuType}
        list={menuType === 'followers' ? userData?.followers : userData?.following}
      />
      <UpdateProfile update={update} setUpdate={setUpdate} user={userData} />
      <AddStoryModel isStory={isStory} setIsStory={setIsStory} />
    </div>
  )
}

export default ProfilePage
