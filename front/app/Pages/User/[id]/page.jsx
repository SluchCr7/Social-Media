// 'use client'

// import Image from 'next/image'
// import { useAuth } from '@/app/Context/AuthContext'
// import SluchitEntry from '@/app/Component/SluchitEntry'
// import { usePost } from '@/app/Context/PostContext'
// import { useState, useEffect } from 'react'
// import { RiUserFollowLine, RiUserUnfollowLine } from "react-icons/ri"
// import { FaPhone, FaGlobe, FaLinkedin, FaGithub, FaMapMarkerAlt, FaTwitter, FaFacebook } from 'react-icons/fa'
// import { generateMeta } from '@/app/utils/MetaDataHelper'
// import InfoAboutUser from '@/app/Component/InfoAboutUser'

// const tabs = ['Posts', 'Saved', 'Comments']


// const Page = ({ params }) => {
//   const id = params.id
//   const { users, followUser, user , blockOrUnblockUser, isLogin,isAuthChecked } = useAuth()
//   const { posts } = usePost()
//   const [isBlockedByMe, setIsBlockedByMe] = useState(false);
//   const [userSelected, setUserSelected] = useState({})
//   const [activeTab, setActiveTab] = useState('Posts')

//   useEffect(() => {
//     const matchedUser = users.find((u) => u?._id === id)
//     if (matchedUser) setUserSelected(matchedUser)
//   }, [id, users])
//   useEffect(() => {
//     if (user && userSelected?._id) {
//       setIsBlockedByMe(user.blockedUsers?.includes(userSelected?._id));
//     }
//   }, [user, userSelected]);
//   const isFollowing = userSelected?.followers?.some(f => f?._id === user?._id)

//   const renderPosts = () => {
//     const pinnedPosts = userSelected?.pinsPosts || []
//     const pinnedIds = new Set(pinnedPosts.map(p => p?._id))
//     const regularPosts = (userSelected?.posts || []).filter(p => !pinnedIds.has(p?._id))

//     return [
//       ...pinnedPosts.map(p => ({ ...p, isPinned: true })),
//       ...regularPosts.map(p => ({ ...p, isPinned: false })),
//     ].map(post => <SluchitEntry key={post?._id} post={post} />)
//   }

//   const renderSaved = () => {
//     const savedPosts = posts?.filter(p => p.saved.includes(userSelected?._id)) || []
//     return savedPosts.length > 0 ? (
//       savedPosts.map(post => <SluchitEntry key={post?._id} post={post} />)
//     ) : (
//       <div className="text-center text-gray-500 py-10">You haven’t saved any posts yet.</div>
//     )
//   }

//   const renderComments = () => {
//     const comments = userSelected?.comments || []
//     return comments.length > 0 ? (
//       comments.map(comment => (
//         <div key={comment?._id} className="w-full bg-gray-900/70 rounded-xl p-5 shadow-md flex flex-col gap-4">
//           <div className="flex flex-col gap-2">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <Image
//                   src={comment.owner?.profilePhoto?.url || '/default-profile.png'}
//                   alt="Commenter"
//                   width={36}
//                   height={36}
//                   className="rounded-full object-cover"
//                 />
//                 <div>
//                   <p className="text-sm font-semibold">{comment.owner?.username}</p>
//                   <p className="text-xs text-gray-400">{comment.owner?.profileName}</p>
//                 </div>
//               </div>
//               <span className="text-xs text-gray-500">{new Date(comment?.createdAt).toLocaleDateString()}</span>
//             </div>
//             <p className="text-sm text-gray-300 pl-1 border-l-2 border-gray-600">{comment?.text}</p>
//           </div>

//           {comment?.postId && (
//             <div className="flex gap-3 items-start border-t border-gray-700 pt-4">
//               <Image
//                 src={comment.postId?.owner?.profilePhoto?.url || '/default-profile.png'}
//                 alt="Post Owner"
//                 width={36}
//                 height={36}
//                 className="rounded-full object-cover mt-1"
//               />
//               <div className="flex flex-col bg-gray-800/50 px-4 py-3 rounded-lg w-full">
//                 <div className="flex justify-between items-center mb-1">
//                   <div>
//                     <p className="text-sm font-semibold">{comment.postId?.owner?.username}</p>
//                     <p className="text-xs text-gray-400">{comment.postId?.owner?.profileName}</p>
//                   </div>
//                   <span className="text-xs text-gray-500">{new Date(comment.postId?.createdAt).toLocaleDateString()}</span>
//                 </div>
//                 <p className="text-sm text-gray-300">{comment.postId?.text || 'No post content available.'}</p>
//               </div>
//             </div>
//           )}
//         </div>
//       ))
//     ) : (
//       <div className="text-center text-gray-500 py-10">You haven’t commented on any posts yet.</div>
//     )
//   }

//   return (
//     <div className="w-full flex flex-col items-center pt-10 text-lightMode-text dark:text-darkMode-text bg-lightMode-bg dark:bg-darkMode-bg min-h-screen">
//       {/* Profile Info */}
//       <div className="flex flex-col items-center gap-4">
//         <div className="relative w-32 h-32 rounded-full border-4 border-gray-700 overflow-hidden">
//           <Image
//             src={userSelected?.profilePhoto?.url || '/default-profile.png'}
//             alt="Profile"
//             fill
//             className="object-cover transition duration-300 hover:opacity-90"
//           />
//         </div>

//         <h1 className="text-2xl font-bold">{userSelected?.username || 'Username'}</h1>
//         <span className="text-gray-400">{userSelected?.profileName || 'Profile Name'}</span>
//         <p className="text-sm text-center text-gray-300 max-w-md px-4">{userSelected?.description || 'No bio provided.'}</p>

//         {/* Stats */}
//         <div className="flex gap-8 text-center mt-4">
//           <div>
//             <h2 className="text-lg font-bold">{userSelected?.posts?.length || 0}</h2>
//             <p className="text-sm text-gray-400">Posts</p>
//           </div>
//           <div>
//             <h2 className="text-lg font-bold">{userSelected?.followers?.length || 0}</h2>
//             <p className="text-sm text-gray-400">Followers</p>
//           </div>
//           <div>
//             <h2 className="text-lg font-bold">{userSelected?.following?.length || 0}</h2>
//             <p className="text-sm text-gray-400">Following</p>
//           </div>
//         </div>

//         {/* Follow Button */}
//         {isLogin && user?._id !== userSelected?._id && (
//           <button
//             onClick={() => followUser(userSelected?._id)}
//             className={`flex items-center gap-2 mt-4 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-300
//               ${isFollowing
//                 ? 'text-red-600 border-red-600 hover:bg-red-600 hover:text-white'
//                 : 'text-green-600 border-green-600 hover:bg-green-600 hover:text-white'
//               }`}
//           >
//             {isFollowing ? <RiUserUnfollowLine className="text-lg" /> : <RiUserFollowLine className="text-lg" />}
//             {isFollowing ? 'Unfollow' : 'Follow'}
//           </button>
//         )}
//       </div>
//       {isBlockedByMe ? (
//         <div className="min-h-screen flex flex-col items-center justify-center text-center text-red-500 py-20 px-4">
//           <h2 className="text-2xl font-bold mb-4">You have blocked this user</h2>
//           <p className="text-sm text-gray-400 mb-6">Unblock them to see their profile again.</p>
//           <button
//             onClick={() => blockOrUnblockUser(userSelected?._id)}
//             className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition"
//           >
//             Unblock User
//           </button>
//         </div>
//       ) : (
//         <>
//           {/* Personal Info */}
//           <InfoAboutUser user={userSelected} />
//           {/* Tabs */}
//           <div className="flex justify-center gap-10 mt-6 border-t border-gray-700 w-[90%] pt-4">
//             {tabs.map(tab => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`font-semibold px-4 py-1 rounded-md transition ${activeTab === tab ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>
//           {/* Content */}
//           <div className="w-[90%] mt-6 flex items-start flex-col gap-4">
//             {activeTab === 'Posts' && renderPosts()}
//             {activeTab === 'Saved' && renderSaved()}
//             {activeTab === 'Comments' && renderComments()}
//           </div>
//         </>
//       )}
      
//     </div>
//   )
// }

// export default Page


'use client'
import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/app/Context/AuthContext'
import { usePost } from '@/app/Context/PostContext'
import ProfileHeader from '@/app/Component/UserComponents/ProfileHeader'
import UserStats from '@/app/Component/UserComponents/UserStats'
import UserTabs from '@/app/Component/UserComponents/UserTabs'
import CommentsList from '@/app/Component/UserComponents/CommentsList'
import FollowersModal from '@/app/Component/UserComponents/FollowersModal'
import InfoAboutUser from '@/app/Component/UserComponents/InfoAboutUser'
import Loading from '@/app/Component/Loading'

const UserPage = () => {
  const { id } = useParams()
  const { auth } = useAuth()
  const { getUserPosts, getUserSavedPosts, getUserComments, getUserById } = usePost()

  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [savedPosts, setSavedPosts] = useState([])
  const [comments, setComments] = useState([])

  const [activeTab, setActiveTab] = useState('Posts')
  const [showFollowers, setShowFollowers] = useState(false)
  const [showFollowing, setShowFollowing] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [loading, setLoading] = useState(true)

  // جلب بيانات المستخدم
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true)
      const userData = await getUserById(id)
      setUser(userData)
      setPosts(await getUserPosts(id))
      setSavedPosts(await getUserSavedPosts(id))
      setComments(await getUserComments(id))
      setIsFollowing(userData?.followers?.includes(auth?._id))
      setLoading(false)
    }
    if (id) fetchUserData()
  }, [id])

  const handleFollowToggle = () => {
    // هنا تنفذ API حقيقية
    setIsFollowing((prev) => !prev)
  }

  if (loading) return <Loading />

  if (!user) {
    return <div className="text-center py-10 text-gray-500">User not found.</div>
  }

  return (
    <div className="flex flex-col items-center w-full min-h-screen py-6">
      {/* Header */}
      <ProfileHeader
        user={user}
        isCurrentUser={false}
        followBtn={
          <button
            onClick={handleFollowToggle}
            className={`px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition ${
              isFollowing
                ? 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            {isFollowing ? 'Unfollow' : 'Follow'}
          </button>
        }
      />

      {/* Stats */}
      <UserStats
        posts={posts?.length}
        followers={user?.followers?.length}
        following={user?.following?.length}
        onShowFollowers={() => setShowFollowers(true)}
        onShowFollowing={() => setShowFollowing(true)}
      />

      {/* Tabs */}
      <UserTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Content */}
      <div className="mt-6 w-full max-w-3xl">
        {activeTab === 'Posts' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts && posts.length > 0 ? (
              posts.map((post) => (
                <div key={post._id} className="w-full aspect-square bg-gray-800 rounded-lg shadow-md" />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-10">No posts yet.</div>
            )}
          </div>
        )}

        {activeTab === 'Saved' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedPosts && savedPosts.length > 0 ? (
              savedPosts.map((post) => (
                <div key={post._id} className="w-full aspect-square bg-gray-700 rounded-lg shadow-md" />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-10">No saved posts yet.</div>
            )}
          </div>
        )}

        {activeTab === 'Comments' && <CommentsList comments={comments} />}
      </div>

      {/* Extra info */}
      <div className="mt-10 w-full max-w-3xl">
        <InfoAboutUser user={user} />
      </div>

      {/* Followers / Following Modals */}
      {showFollowers && (
        <FollowersModal
          title="Followers"
          users={user?.followers}
          onClose={() => setShowFollowers(false)}
        />
      )}
      {showFollowing && (
        <FollowersModal
          title="Following"
          users={user?.following}
          onClose={() => setShowFollowing(false)}
        />
      )}
    </div>
  )
}

export default UserPage
