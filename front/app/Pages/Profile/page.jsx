'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useAuth } from '@/app/Context/AuthContext'
import SluchitEntry from '@/app/Component/SluchitEntry'
import axios from 'axios'
import { usePost } from '@/app/Context/PostContext'
import Loading from '@/app/Component/Loading'
import UpdateProfile from '../../Component/UpdateProfile'
import { BsThreeDots } from "react-icons/bs";
import { FaUserEdit } from "react-icons/fa";

const tabs = ['Posts', 'Saved', 'Comments']

const ProfilePage = () => {
  const { user ,  users , updatePhoto } = useAuth()
  const [activeTab, setActiveTab] = useState('Posts')
  const [loading , setLoading] = useState(false)
  const [image, setImage] = useState(null)
  const [userData, setUserData] = useState({})
  const {posts} = usePost()
  const [update ,setUpdate] = useState(false)
  useEffect(() => {
    const matchedUser = users.find((User) => user._id === User._id);
    if (matchedUser) {
      setUserData(matchedUser);
    }
  }, [users]);
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      updatePhoto(file)
    }
  }
  useEffect(() => {
    if (user) setLoading(true)
  },[user])
  useEffect(()=>{
    // console.log(`UserData : ${userData}`)
    console.log(`user :  ${user}`)
  },[user])
  return (
    <>
      {
        loading ? 
        <div className="w-full flex flex-col items-center pt-8 text-lightMode-text dark:text-darkMode-text bg-lightMode-bg dark:bg-darkMode-bg min-h-screen">
        {/* Profile Section */}
        <div className="flex flex-col items-center gap-3 w-full">
          <div className="relative w-32 h-32 cursor-pointer group">
            <div className="relative w-full h-full">
              <Image
                src={
                  image
                    ? URL.createObjectURL(image)
                    : user?.profilePhoto?.url || '/default-profile.png'
                }
                alt="profile"
                fill
                className="rounded-full object-cover border-4 border-gray-800 group-hover:opacity-80 transition"
                onClick={() => document.getElementById('fileInput')?.click()}
                  />
              <div className='text-gray-700 hover:text-gray-500 absolute -right-4 font-semibold text-2xl' onClick={() => setUpdate(true)}>
                <FaUserEdit/>
              </div>
            </div>
            <input
              type="file"
              id="fileInput"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <h1 className="text-2xl font-bold">{user?.username || 'Username'}</h1>
          <span className="text-gray-400">{user?.profileName || 'Profile Name'}</span>
          <p className="text-center text-gray-300 w-[80%] max-w-md">{user?.description || 'No bio provided.'}</p>

          {/* Stats */}
          <div className="flex gap-10 text-center mt-4">
            <div>
              <h2 className="font-bold text-lg">{userData?.posts?.length}</h2>
              <p className="text-sm text-gray-400">Posts</p>
            </div>
            <div>
              <h2 className="font-bold text-lg">{userData?.followers?.length}</h2>
              <p className="text-sm text-gray-400">Followers</p>
            </div>
            <div>
              <h2 className="font-bold text-lg">
                {
                  users.filter((u) => u.followers.includes(userData._id)).length
                }
              </h2>
              <p className="text-sm text-gray-400">Following</p>
            </div>
            </div>

        </div>
        {/* <button className="bg-gray-700 hover:bg-gray-600 text-lightMode-text dark:text-darkMode-text font-semibold py-2 px-4 rounded-md mt-6" onClick={() => setUpdate(true)}>Edit Profile</button> */}
        {/* Tabs */}
        <div className="flex justify-center gap-10 mt-6 border-t border-gray-700 w-[90%] pt-4">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`font-semibold px-4 py-1 rounded-md transition ${
                activeTab === tab ? 'bg-gray-700 text-lightMode-text dark:text-darkMode-text' : 'text-gray-400 hover:text-lightMode-text dark:text-darkMode-text'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Entries Section */}
        <div className="w-[90%] mt-6 flex items-start flex-col gap-4">
          {/* Show The Posts and PinPosts in Top Of Page  */}
        {activeTab === 'Posts' && (
          <>
            {
              (() => {
                const pinnedPosts = userData?.pinsPosts || [];
                const pinnedPostIds = new Set(pinnedPosts.map(post => post._id));

                const regularPosts = (userData?.posts || []).filter(post => !pinnedPostIds.has(post._id));

                const combinedPosts = [
                  ...pinnedPosts.map(post => ({ ...post, isPinned: true })),
                  ...regularPosts.map(post => ({ ...post, isPinned: false }))
                ];

                return combinedPosts.map(post => (
                  <SluchitEntry key={post._id} post={post} />
                ));
              })()
            }
          </>
        )}

          {activeTab === 'Saved' && (
            <div className="grid grid-cols-1 gap-4 w-full">
              {posts?.filter(post => post.saved.includes(userData._id)).length > 0 ? (
                posts
                  .filter(post => post.saved.includes(userData._id))
                  .map(post => (
                    <SluchitEntry key={post._id} post={post} />
                  ))
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
                <div
                  key={comment._id}
                  className="w-full bg-gray-900/70 rounded-xl p-5 shadow-md flex flex-col gap-4"
                >
                  {/* Your Comment */}
                  <div className="flex flex-col gap-2">
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
                          <p className="text-sm font-semibold text-lightMode-text dark:text-darkMode-text">{comment.owner?.username}</p>
                          <p className="text-xs text-gray-400">{comment.owner?.profileName}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-gray-300 pl-1 border-l-2 border-gray-600">
                      {comment.text}
                    </p>
                  </div>

                  {/* Post Referenced */}
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
                            <p className="text-sm font-semibold text-lightMode-text dark:text-darkMode-text">{comment.postId?.owner?.username}</p>
                            <p className="text-xs text-gray-400">{comment.postId?.owner?.profileName}</p>
                          </div>
                          <span className="text-xs text-gray-500">{new Date(comment.postId?.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-gray-300">{comment.postId?.text || 'No post content available.'}</p>
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
          :          
          <Loading />
      }
      <UpdateProfile update={update} setUpdate={setUpdate} />
    </>
  )
}

export default ProfilePage
