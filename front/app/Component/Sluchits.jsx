// 'use client'
// import React, { useMemo } from 'react'
// import SluchitEntry from './SluchitEntry'
// import { usePost } from '../Context/PostContext'
// import { useAuth } from '../Context/AuthContext'
// import PostSkeleton from '../Skeletons/PostSkeleton'
// import { useCommunity } from '../Context/CommunityContext'

// const Sluchits = () => {
//   const { posts, isLoading } = usePost()
//   const { user , suggestedUser } = useAuth()
//   const {communities} = useCommunity()
//   const following = user?.following

//   // Memoized sorted posts for performance
//   const sortedPosts = useMemo(() => {
//     return posts
//       ?.slice()
//       ?.sort((a, b) => {
//         const isAFollowed = following?.includes(a?.owner?._id)
//         const isBFollowed = following?.includes(b?.owner?._id)

//         if (isAFollowed && !isBFollowed) return -1
//         if (!isAFollowed && isBFollowed) return 1

//         return new Date(b?.createdAt) - new Date(a?.createdAt)
//       })
//   }, [posts, following])

//   return (
//     <div className="w-full flex flex-col gap-6 px-4 md:px-6 lg:px-8">
//       {isLoading ? (
//         Array.from({ length: 4 }).map((_, i) => (
//           <PostSkeleton key={i} className="animate-pulse" />
//         ))
//       ) : sortedPosts?.length > 0 ? (
//         sortedPosts.map((post) => <SluchitEntry key={post?._id} post={post} />)
//       ) : (
//         <p className="text-gray-500 dark:text-gray-400 text-center py-10 text-sm">
//           No posts available
//         </p>
//       )}
//     </div>
//   )
// }

// export default Sluchits


'use client'
import React, { useMemo } from 'react'
import SluchitEntry from './SluchitEntry'
import { usePost } from '../Context/PostContext'
import { useAuth } from '../Context/AuthContext'
import PostSkeleton from '../Skeletons/PostSkeleton'
import { useCommunity } from '../Context/CommunityContext'
import { SuggestionRow } from './SuggestedRow'

const Sluchits = () => {
  const { posts, isLoading } = usePost()
  const { user, suggestedUser } = useAuth()
  const { communities } = useCommunity()
  const following = user?.following

  const sortedPosts = useMemo(() => {
    return posts
      ?.slice()
      ?.sort((a, b) => {
        const isAFollowed = following?.includes(a?.owner?._id)
        const isBFollowed = following?.includes(b?.owner?._id)
        if (isAFollowed && !isBFollowed) return -1
        if (!isAFollowed && isBFollowed) return 1
        return new Date(b?.createdAt) - new Date(a?.createdAt)
      })
  }, [posts, following])

  const combinedItems = useMemo(() => {
    if (!sortedPosts) return []

    const items = []
    const userList = suggestedUser || []
    const communityList = communities || []

    sortedPosts.forEach((post, index) => {
      items.push({ type: 'post', data: post })

      // كل 3 بوستات نضيف صف اقتراحات المستخدمين
      if ((index + 1) % 3 === 0 && userList.length > 0) {
        items.push({ type: 'user', data: userList.slice(0, 5) }) // 5 مستخدمين في صف واحد
      }

      // كل 6 بوستات نضيف صف اقتراحات المجتمعات
      if ((index + 1) % 6 === 0 && communityList.length > 0) {
        items.push({ type: 'community', data: communityList.slice(0, 5) }) // 5 مجتمعات في صف واحد
      }
    })

    return items
  }, [sortedPosts, suggestedUser, communities])

  return (
    <div className="w-full flex flex-col gap-6 px-4 md:px-6 lg:px-8">
      {isLoading ? (
        Array.from({ length: 4 }).map((_, i) => <PostSkeleton key={i} className="animate-pulse" />)
      ) : combinedItems.length > 0 ? (
        combinedItems.map((item, i) => {
          if (item.type === 'post') return <SluchitEntry key={item.data._id} post={item.data} />
          return <SuggestionRow key={`suggestion-${i}`} type={item.type} data={item.data} />
        })
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-center py-10 text-sm">No posts available</p>
      )}
    </div>
  )
}

export default Sluchits
