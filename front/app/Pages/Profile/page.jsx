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
import { FaPhone, FaGlobe, FaLinkedin, FaGithub, FaMapMarkerAlt } from 'react-icons/fa'
import { IoAdd } from 'react-icons/io5'

const tabs = ['Posts', 'Saved', 'Comments']

const ProfilePage = () => {
  const { user, users, updatePhoto } = useAuth()
  const [activeTab, setActiveTab] = useState('Posts')
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState(null)
  const [userData, setUserData] = useState({})
  const { posts } = usePost()
  const [update, setUpdate] = useState(false)
  const [isStory, setIsStory] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [menuType, setMenuType] = useState('followers')

  useEffect(() => {
    const matchedUser = users.find((u) => user?._id === u?._id)
    if (matchedUser) setUserData(matchedUser)
  }, [users])

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      updatePhoto(file)
    }
  }

  useEffect(() => {
    if (user) setLoading(true)
  }, [user])

  return (
    <>
      {loading ? (
        <div className="w-full flex flex-col items-center pt-8 text-lightMode-text dark:text-darkMode-text bg-lightMode-bg dark:bg-darkMode-bg min-h-screen">
          {/* ✅ القسم العلوي للبروفايل */}
          <div className="relative flex flex-col items-center w-full max-w-2xl px-4 py-6 rounded-xl">
            {/* صورة البروفايل + تعديل */}
            <div className="relative group cursor-pointer mt-2 w-32 h-32">
              <Image
                src={
                  image
                    ? URL.createObjectURL(image)
                    : user?.profilePhoto?.url || '/default-profile.png'
                }
                alt="profile"
                fill
                className="rounded-full object-cover border-4 border-gray-700"
                onClick={() => document.getElementById('fileInput')?.click()}
              />
              <div
                className="absolute bottom-2 right-2 bg-gray-800 p-1 rounded-full text-white text-xs group-hover:opacity-100 opacity-0 transition"
                onClick={() => document.getElementById('fileInput')?.click()}
              >
                🖊️
              </div>
              <input
                type="file"
                id="fileInput"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            {/* معلومات المستخدم */}
            <div className="text-center mt-4">
              <h1 className="text-2xl font-bold">{user?.username || 'Username'}</h1>
              <span className="text-sm text-gray-400">{user?.profileName || 'Profile Name'}</span>
              <p className="text-sm text-gray-300 mt-1 max-w-md">
                {user?.description || 'No bio provided.'}
              </p>
            </div>

            {/* أزرار تعديل و ستوري */}
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <button
                onClick={() => setUpdate(true)}
                className="border border-lightMode-text dark:border-darkMode-text text-lightMode-text dark:text-darkMode-text text-sm px-4 py-1 rounded-md flex items-center gap-2"
              >
                <FaUserEdit /> Edit Profile
              </button>
              <button
                onClick={() => setIsStory(true)}
                className="border border-lightMode-text dark:border-darkMode-text text-lightMode-text dark:text-darkMode-text text-sm px-4 py-1 rounded-md flex items-center gap-2"
              >
                <IoAdd /> Add Story
              </button>
            </div>

            {/* إحصائيات */}
            <div className="flex gap-8 text-center mt-6">
              <div>
                <h2 className="font-bold text-lg">{userData?.posts?.length}</h2>
                <p className="text-sm text-gray-400">Posts</p>
              </div>
              <div
                onClick={() => {
                  setMenuType('followers')
                  setShowMenu(true)
                }}
                className="cursor-pointer"
              >
                <h2 className="font-bold text-lg">{userData?.followers?.length}</h2>
                <p className="text-sm text-gray-400">Followers</p>
              </div>
              <div
                onClick={() => {
                  setMenuType('following')
                  setShowMenu(true)
                }}
                className="cursor-pointer"
              >
                <h2 className="font-bold text-lg">{userData?.following?.length}</h2>
                <p className="text-sm text-gray-400">Following</p>
              </div>
            </div>

            {/* معلومات إضافية */}
            <div className="mt-8 w-full rounded-2xl bg-lightMode-menu dark:bg-darkMode-menu shadow-xl p-6">
              <h2 className="text-2xl font-bold mb-6 text-lightMode-text2 dark:text-darkMode-text2">About</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-lightMode-text dark:text-darkMode-text">
                {userData?.phone && (
                  <div className="flex items-center space-x-3">
                    <FaPhone className="text-blue-400" />
                    <span><span className="font-semibold">Phone:</span> {userData.phone}</span>
                  </div>
                )}
                {userData?.country && (
                  <div className="flex items-center space-x-3">
                    <FaMapMarkerAlt className="text-green-400" />
                    <span><span className="font-semibold">Country:</span> {userData.country}</span>
                  </div>
                )}
                {(userData?.socialLinks && Object.keys(userData.socialLinks).length > 0) && (
                  <div className="sm:col-span-2 flex items-center gap-5 mt-2">
                    {userData.socialLinks.github && (
                      <a href={userData.socialLinks.github} target="_blank" rel="noopener noreferrer">
                        <FaGithub className="text-2xl text-gray-300 dark:text-white hover:text-white transition" />
                      </a>
                    )}
                    {userData.socialLinks.linkedin && (
                      <a href={userData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                        <FaLinkedin className="text-2xl text-blue-500 hover:text-blue-600 transition" />
                      </a>
                    )}
                    {userData.socialLinks.website && (
                      <a href={userData.socialLinks.website} target="_blank" rel="noopener noreferrer">
                        <FaGlobe className="text-2xl text-purple-400 hover:text-purple-500 transition" />
                      </a>
                    )}
                  </div>
                )}
                {userData?.interests?.length > 0 && (
                  <div className="sm:col-span-2">
                    <p><span className="font-semibold">Interests:</span> {userData.interests.join(', ')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ✅ التبويبات */}
          <div className="flex justify-center gap-4 mt-6 border-t border-gray-700 w-full px-3 pt-4 flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`font-semibold px-4 py-1 rounded-md transition text-sm ${
                  activeTab === tab
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* ✅ محتوى التبويبات */}
          <div className="w-full mt-6 flex flex-col gap-4 px-4">
            {activeTab === 'Posts' && (() => {
              const pinnedPosts = userData?.pinsPosts || []
              const pinnedPostIds = new Set(pinnedPosts.map((post) => post?._id))
              const regularPosts = (userData?.posts || []).filter(
                (post) => !pinnedPostIds.has(post?._id)
              )
              const combinedPosts = [
                ...pinnedPosts.map((post) => ({ ...post, isPinned: true })),
                ...regularPosts.map((post) => ({ ...post, isPinned: false })),
              ]
              return combinedPosts.map((post) => (
                <SluchitEntry key={post?._id} post={post} />
              ))
            })()}

            {activeTab === 'Saved' && (
              <div className="grid grid-cols-1 gap-4 w-full">
                {posts?.filter((post) => post.saved.includes(userData?._id)).length > 0 ? (
                  posts
                    .filter((post) => post.saved.includes(userData?._id))
                    .map((post) => <SluchitEntry key={post?._id} post={post} />)
                ) : (
                  <div className="col-span-full text-center text-gray-500 py-10">
                    You haven’t saved any posts yet.
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Comments' && (
              <div className="flex flex-col gap-6 w-full">
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
                                <p className="text-sm font-semibold">
                                  {comment.postId?.owner?.username}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {comment.postId?.owner?.profileName}
                                </p>
                              </div>
                              <span className="text-xs text-gray-500">
                                {new Date(comment.postId?.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-300">
                              {comment.postId?.text || 'No post content available.'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center col-span-full text-gray-500 py-10">
                    You haven’t commented on any posts yet.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <Loading />
      )}

      {/* ✅ Modal للـ Followers / Following */}
      {showMenu && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center">
          <div className="relative w-full max-w-md mx-auto bg-lightMode-menu dark:bg-darkMode-menu rounded-2xl shadow-2xl p-6 max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setShowMenu(false)}
              className="absolute top-3 right-4 text-gray-400 hover:text-red-500 text-xl"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center text-lightMode-text2 dark:text-darkMode-text2">
              {menuType === 'followers' ? 'Followers' : 'Following'}
            </h2>
            {(menuType === 'followers' ? userData?.followers : userData?.following)?.length > 0 ? (
              <div className="flex flex-col gap-4">
                {(menuType === 'followers' ? userData.followers : userData.following).map((person) => (
                  <div key={person._id} className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-700 transition">
                    <Image
                      src={person?.profilePhoto?.url || '/default-profile.png'}
                      alt={person?.username}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold">{person?.username}</p>
                      <p className="text-xs text-gray-400">{person?.profileName}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">No {menuType} found.</p>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <UpdateProfile update={update} setUpdate={setUpdate} />
      <AddStoryModel setIsStory={setIsStory} isStory={isStory} />
    </>
  )
}

export default ProfilePage
