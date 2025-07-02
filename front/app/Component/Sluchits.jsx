import React from 'react'
import SluchitEntry from './SluchitEntry'
import { usePost } from '../Context/PostContext'
import { useAuth } from '../Context/AuthContext'

const Sluchits = () => {
  const {posts} = usePost() 
  const {user} = useAuth()
  const following = user.following
  return (
    <div className='w-full flex items-start flex-col gap-8 py-2'>
    {
      posts
        .slice() // لتجنب التعديل على الأصل
        .sort((a, b) => {
          // const isAFollowed = following.includes(a.owner._id)
          // const isBFollowed = following.includes(b.owner._id)
  
          // // 1. قدم البوستات من الأشخاص المتابعين
          // if (isAFollowed && !isBFollowed) return -1
          // if (!isAFollowed && isBFollowed) return 1
  
          // 2. إذا كان كلاهما متابع أو غير متابع، رتب حسب التاريخ
          return new Date(b.createdAt) - new Date(a.createdAt)
        })
        .map(post => (
          <SluchitEntry key={post._id} post={post} />
        ))
    }
  </div>
  
  )
}

export default Sluchits