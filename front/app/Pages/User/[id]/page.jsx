'use client'
import Image from 'next/image'
import { useAuth } from '@/app/Context/AuthContext'
import SluchitEntry from '@/app/Component/SluchitEntry'
import axios from 'axios'
import { usePost } from '@/app/Context/PostContext'
import { useState , useEffect } from 'react'
import Loading from '@/app/Component/Loading'
const tabs = ['Posts', 'Saved', 'Comments']
import { RiUserFollowLine } from "react-icons/ri";
import { RiUserUnfollowLine } from "react-icons/ri";

const Page = ({ params }) => {
    const id = params.id
    const {users , followUser , user} = useAuth()
    const [userSelected, setUserSelected] = useState({})
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('Posts')
    const {posts} = usePost()
    useEffect(() => {
        const matchedUser = users.find((user) => user._id === id);
        if (matchedUser) {
            setUserSelected(matchedUser);
            setLoading(false);
        }
    }, [id, users])
    useEffect(()=>{
      console.log(userSelected)
    },[userSelected])
  return (
    <>
      {
        // loading ? 
        <div className="w-full flex flex-col items-center pt-8 text-lightMode-text dark:text-darkMode-text bg-lightMode-bg dark:bg-darkMode-bg min-h-screen">
        {/* Profile Section */}
        <div className="flex flex-col items-center gap-3 w-full">
          <div className="relative w-32 h-32 cursor-pointer group">
            <Image
              src={userSelected?.profilePhoto?.url }
              alt="profile"
              fill
              className="rounded-full object-cover border-4 border-gray-800 group-hover:opacity-80 transition"
            />
          </div>
          <h1 className="text-2xl font-bold">{userSelected?.username || 'Username'}</h1>
          <span className="text-gray-400">{userSelected?.profileName || 'Profile Name'}</span>
          <p className="text-center text-gray-300 w-[80%] max-w-md">{userSelected?.description || 'No bio provided.'}</p>

          {/* Stats */}
          <div className="flex gap-10 text-center mt-4">
            <div>
              <h2 className="font-bold text-lg">{userSelected?.posts?.length}</h2>
              <p className="text-sm text-gray-400">Posts</p>
            </div>
            <div>
              <h2 className="font-bold text-lg">{userSelected?.followers?.length}</h2>
              <p className="text-sm text-gray-400">Followers</p>
            </div>
            <div>
              <h2 className="font-bold text-lg">
                {
                  users.filter((u) => u.followers.includes(userSelected._id)).length
                }
              </h2>
              <p className="text-sm text-gray-400">Following</p>
            </div>
          </div>
          <button onClick={() => followUser(userSelected._id)} className={`text-2xl rounded-md font-semibold ${userSelected?.followers?.some((follower) => follower._id === user._id) ? " text-red-700" : " text-green-700"}`}>
            {
              userSelected?.followers?.some((follower) => follower._id === user._id) ? <RiUserUnfollowLine/> : <RiUserFollowLine/>
            }
          </button>
        </div>
        {/* Tabs */}
        <div className="flex justify-center gap-10 mt-6 border-t border-gray-700 w-[90%] pt-4">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`font-semibold px-4 py-1 rounded-md transition ${
                activeTab === tab ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Entries Section */}
        <div className="w-[90%] mt-6 flex items-start flex-col gap-4">
          {activeTab === 'Posts' && (
            <>
              {
                (() => {
                  const pinnedPosts = userSelected?.pinsPosts || [];
                  const pinnedPostIds = new Set(pinnedPosts.map(post => post._id));
  
                  const regularPosts = (userSelected?.posts || []).filter(post => !pinnedPostIds.has(post._id));
  
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
              {posts?.filter(post => post.saved.includes(userSelected._id)).length > 0 ? (
                posts
                  .filter(post => post.saved.includes(userSelected._id))
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
            {userSelected?.comments?.length > 0 ? (
              userSelected.comments.map((comment) => (
                <div
                  key={comment._id}
                  className="w-full bg-gray-900/70 rounded-xl p-5 shadow-md flex flex-col gap-4"
                >
                
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
        //   :          
        // <Loading/>
      }
    </>
  )
}

export default Page