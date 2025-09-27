// 'use client'
// import { useMemo } from 'react'

// export const useCombinedPosts = (user) => {
//   return useMemo(() => {
//     if (!user) return []
//     const pinnedPosts = user.pinsPosts || []
//     const pinnedIds = new Set(pinnedPosts.map(p => p._id))
//     const regularPosts = (user.posts || []).filter(p => !pinnedIds.has(p._id))
//     return [
//       ...pinnedPosts.map(p => ({ ...p, isPinned: true })),
//       ...regularPosts.map(p => ({ ...p, isPinned: false })),
//     ]
//   }, [user])
// }

'use client'
import { useMemo } from 'react'

export const useCombinedPosts = (posts = [], pinnedPosts = []) => {
  return useMemo(() => {
    if (!posts.length && !pinnedPosts.length) return []

    const pinnedIds = new Set(pinnedPosts.map(p => p._id))
    const regularPosts = posts.filter(p => !pinnedIds.has(p._id))

    return [
      ...pinnedPosts.map(p => ({ ...p, isPinned: true })),
      ...regularPosts.map(p => ({ ...p, isPinned: false })),
    ]
  }, [posts, pinnedPosts])
}


