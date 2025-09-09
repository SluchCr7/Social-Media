'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useAuth } from '@/app/Context/AuthContext'
import SluchitEntry from '@/app/Component/SluchitEntry'
import { usePost } from '@/app/Context/PostContext'
import Loading from '@/app/Component/Loading'
import UpdateProfile from '../../Component/UpdateProfile'
import { FaUserEdit } from 'react-icons/fa'
import AddStoryModel from '@/app/Component/AddStoryModel'
import InfoAboutUser from '@/app/Component/InfoAboutUser'
import { IoAdd } from 'react-icons/io5'
import { motion, AnimatePresence } from 'framer-motion'

const tabs = ['Posts', 'Saved', 'Comments', 'About']

// --- Animated counter small component ---
const AnimatedCounter = ({ value = 0, duration = 0.8, className = '' }) => {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    let start = 0
    const end = Number(value) || 0
    if (end === 0) {
      setDisplay(0)
      return
    }
    const increment = Math.ceil(end / (duration * 60)) // ~frames
    const id = setInterval(() => {
      start += increment
      if (start >= end) {
        setDisplay(end)
        clearInterval(id)
      } else {
        setDisplay(start)
      }
    }, 1000 / 60)
    return () => clearInterval(id)
  }, [value, duration])
  return <div className={className}>{display}</div>
}

const ProfilePage = () => {
  const { user, users, updatePhoto } = useAuth()
  const { posts } = usePost()

  const [activeTab, setActiveTab] = useState('Posts')
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState(null)
  const [cover, setCover] = useState(null)
  const [userData, setUserData] = useState({})
  const [update, setUpdate] = useState(false)
  const [isStory, setIsStory] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [menuType, setMenuType] = useState('followers')

  // match user data from users list if available
  useEffect(() => {
    const matchedUser = users?.find((u) => user?._id === u?._id)
    if (matchedUser) setUserData(matchedUser)
    else if (user) setUserData(user)
  }, [users, user])

  // set loading when user available
  useEffect(() => {
    if (user) setLoading(true)
  }, [user])

  // handle profile image change
  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      // call your updatePhoto (assumed to exist)
      updatePhoto && (await updatePhoto(file))
    }
  }

  // handle cover change
  const handleCoverChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      setCover(file)
      // you might want a specific updateCover function; for now reuse updatePhoto or implement accordingly
      updatePhoto && (await updatePhoto(file, { type: 'cover' }))
    }
  }

  // helpers
  const pinnedPosts = userData?.pinsPosts || []
  const pinnedPostIds = new Set(pinnedPosts.map((p) => p?._id))
  const regularPosts = (userData?.posts || []).filter((p) => !pinnedPostIds.has(p?._id))
  const combinedPosts = [
    ...pinnedPosts.map((post) => ({ ...post, isPinned: true })),
    ...regularPosts.map((post) => ({ ...post, isPinned: false })),
  ]

  if (!loading) return <Loading />

  return (
    <>
      <div className="w-full min-h-screen bg-lightMode-bg dark:bg-darkMode-bg text-lightMode-text dark:text-darkMode-text flex flex-col items-center">
        {/* Cover */}
        <div className="w-full relative">
          <div className="h-48 w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
            {/* cover image preview if present */}
            {(cover || userData?.coverPhoto?.url) && (
              <div className="absolute inset-0">
                <Image
                  src={cover ? URL.createObjectURL(cover) : userData?.coverPhoto?.url}
                  alt="cover"
                  fill
                  className="object-cover opacity-90"
                />
              </div>
            )}
            {/* cover edit button */}
            <div className="absolute top-4 right-4 z-20">
              <label
                htmlFor="coverInput"
                className="bg-black/60 text-white px-3 py-1 rounded-md text-sm cursor-pointer hover:opacity-90 transition"
              >
                تعديل الغلاف
              </label>
              <input
                id="coverInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverChange}
              />
            </div>
          </div>

          {/* profile avatar - overlapping */}
          <div className="w-full max-w-2xl mx-auto relative">
            <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
              <div className="relative w-36 h-36 rounded-full border-4 border-white dark:border-gray-900 overflow-hidden shadow-lg">
                <Image
                  src={
                    image
                      ? URL.createObjectURL(image)
                      : userData?.profilePhoto?.url || '/default-profile.png'
                  }
                  alt="profile"
                  fill
                  className="object-cover"
                  onClick={() => document.getElementById('fileInput')?.click()}
                />
                <div
                  onClick={() => document.getElementById('fileInput')?.click()}
                  className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full opacity-0 hover:opacity-100 transition cursor-pointer"
                >
                  تعديل
                </div>
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main profile content */}
        <div className="w-full max-w-2xl px-4 mt-20">
          {/* Name / bio / badges */}
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{userData?.username || 'Username'}</h1>
              {userData?.isVerify && (
                <span className="text-blue-500 text-sm bg-blue-50 dark:bg-blue-900 px-2 py-1 rounded-md">
                  موثق
                </span>
              )}
            </div>
            <span className="text-sm text-gray-400">{userData?.profileName || ''}</span>
            <p className="text-sm text-gray-500 mt-2 max-w-xl">{userData?.description || 'لا يوجد وصف بعد.'}</p>
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-3 mt-4 flex-wrap">
            <button
              onClick={() => setUpdate(true)}
              className="flex items-center gap-2 border px-4 py-2 rounded-lg text-sm hover:shadow transition"
            >
              <FaUserEdit /> تعديل الملف
            </button>

            <button
              onClick={() => setIsStory(true)}
              className="flex items-center gap-2 border px-4 py-2 rounded-lg text-sm hover:shadow transition"
            >
              <IoAdd /> إضافة Story
            </button>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-10 mt-6">
            <div className="text-center">
              <AnimatedCounter value={userData?.posts?.length || 0} className="text-lg font-bold" />
              <div className="text-sm text-gray-400">المنشورات</div>
            </div>
            <div
              onClick={() => {
                setMenuType('followers')
                setShowMenu(true)
              }}
              className="text-center cursor-pointer"
            >
              <AnimatedCounter value={userData?.followers?.length || 0} className="text-lg font-bold" />
              <div className="text-sm text-gray-400">المتابِعون</div>
            </div>
            <div
              onClick={() => {
                setMenuType('following')
                setShowMenu(true)
              }}
              className="text-center cursor-pointer"
            >
              <AnimatedCounter value={userData?.following?.length || 0} className="text-lg font-bold" />
              <div className="text-sm text-gray-400">المتابَعون</div>
            </div>
          </div>

          {/* Info card */}
          <div className="mt-6 bg-gray-100 dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <InfoAboutUser user={userData} />
          </div>

          {/* Tabs */}
          <div className="mt-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex gap-6 justify-center">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 relative font-semibold text-sm ${
                    activeTab === tab ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.span
                      layoutId="underline"
                      className="absolute -bottom-[1px] left-0 right-0 h-1 bg-purple-500 rounded"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content with animation */}
          <div className="mt-6">
            <AnimatePresence mode="wait" initial={false}>
              {activeTab === 'Posts' && (
                <motion.div
                  key="posts"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col gap-4"
                >
                  {combinedPosts?.length > 0 ? (
                    combinedPosts.map((post) => <SluchitEntry key={post?._id} post={post} />)
                  ) : (
                    <div className="text-center text-gray-500 py-10">لا توجد منشورات حتى الآن.</div>
                  )}
                </motion.div>
              )}

              {activeTab === 'Saved' && (
                <motion.div
                  key="saved"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  {posts?.filter((post) => post.saved.includes(userData?._id)).length > 0 ? (
                    posts
                      .filter((post) => post.saved.includes(userData?._id))
                      .map((post) => <SluchitEntry key={post?._id} post={post} />)
                  ) : (
                    <div className="text-center text-gray-500 py-10">لم تحفظ أي منشورات بعد.</div>
                  )}
                </motion.div>
              )}

              {activeTab === 'Comments' && (
                <motion.div
                  key="comments"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col gap-4"
                >
                  {userData?.comments?.length > 0 ? (
                    userData.comments.map((comment) => (
                      <div key={comment?._id} className="w-full bg-gray-900/70 rounded-xl p-5 shadow-md flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Image
                              src={comment.owner?.profilePhoto?.url || '/default-profile.png'}
                              alt="Commenter"
                              width={36}
                              height={36}
                              className="rounded-full object-cover"
                            />
                            <div>
                              <p className="text-sm font-semibold">{comment.owner?.username}</p>
                              <p className="text-xs text-gray-400">{comment.owner?.profileName}</p>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300 pl-1 border-l-2 border-gray-600">{comment.text}</p>

                        {comment.postId && (
                          <div className="flex gap-3 items-start border-t border-gray-700 pt-4">
                            <Image
                              src={comment.postId?.owner?.profilePhoto?.url || '/default-profile.png'}
                              alt="Post Owner"
                              width={36}
                              height={36}
                              className="rounded-full object-cover mt-1"
                            />
                            <div className="flex flex-col bg-gray-800/50 px-4 py-3 rounded-lg w-full">
                              <div className="flex justify-between items-center mb-1">
                                <div>
                                  <p className="text-sm font-semibold">{comment.postId?.owner?.username}</p>
                                  <p className="text-xs text-gray-400">{comment.postId?.owner?.profileName}</p>
                                </div>
                                <span className="text-xs text-gray-500">
                                  {new Date(comment.postId?.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-300">{comment.postId?.text || 'No post content available.'}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-10">لم تكتب أي تعليقات بعد.</div>
                  )}
                </motion.div>
              )}

              {activeTab === 'About' && (
                <motion.div
                  key="about"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">معلومات أساسية</h3>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {userData?.location && <div className="mb-1">الموقع: {userData.location}</div>}
                        {userData?.phone && <div className="mb-1">الهاتف: {userData.phone}</div>}
                        {userData?.joinedAt && <div className="mb-1">انضم: {new Date(userData.joinedAt).toLocaleDateString()}</div>}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">روابط</h3>
                      <div className="flex flex-col gap-2">
                        {userData?.website && (
                          <a href={userData.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                            الموقع الشخصي
                          </a>
                        )}
                        {userData?.github && (
                          <a href={userData.github} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                            GitHub
                          </a>
                        )}
                        {userData?.linkedin && (
                          <a href={userData.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                            LinkedIn
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* bio long */}
                  {userData?.longBio && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">نبذة</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{userData.longBio}</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Followers / Following modal */}
      {showMenu && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-end md:items-center justify-center">
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full md:w-[480px] bg-lightMode-menu dark:bg-darkMode-menu rounded-t-2xl md:rounded-2xl p-4 max-h-[80vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{menuType === 'followers' ? 'المتابِعون' : 'المتابَعون'}</h3>
              <button onClick={() => setShowMenu(false)} className="text-gray-500 text-xl">&times;</button>
            </div>

            {(menuType === 'followers' ? userData.followers : userData.following)?.length > 0 ? (
              <div className="flex flex-col gap-3">
                {(menuType === 'followers' ? userData.followers : userData.following).map((p) => (
                  <div key={p._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition">
                    <Image src={p.profilePhoto?.url || '/default-profile.png'} alt={p.username} width={44} height={44} className="rounded-full object-cover" />
                    <div>
                      <div className="font-semibold text-sm">{p.username}</div>
                      <div className="text-xs text-gray-400">{p.profileName}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-6">لا يوجد نتائج</div>
            )}
          </motion.div>
        </div>
      )}

      {/* Modals */}
      <UpdateProfile update={update} setUpdate={setUpdate} />
      <AddStoryModel setIsStory={setIsStory} isStory={isStory} />
    </>
  )
}

export default ProfilePage
