'use client'

import SluchitEntry from '@/app/Component/SluchitEntry'
import { useAuth } from '@/app/Context/AuthContext'
import { useCommunity } from '@/app/Context/CommunityContext'
import { usePost } from '@/app/Context/PostContext'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { FaPlus } from "react-icons/fa6";

const Page = ({ params }) => {
  const id = params.id
  const [CommunitySelected, setCommunitySelected] = useState(null)
  const { community , joinToCommunity } = useCommunity()
  const { user } = useAuth()
  const [postsFiltered, setPostsFiltered] = useState([])

  useEffect(() => {
    const matchedCommunity = community.find((c) => c._id === id)
    if (matchedCommunity) {
      setCommunitySelected(matchedCommunity)
    }
  }, [community, id])

  const { posts } = usePost()

  useEffect(() => {
    const filteredPosts = posts.filter((post) => post.community?._id === id)
    setPostsFiltered(filteredPosts)
  }, [posts, id])

  if (!CommunitySelected) {
    return <div className="text-center text-gray-500 py-10 flex items-center w-full justify-center text-lg">Loading community...</div>
  }

  return (
    <div className='flex flex-col w-full'>
      {/* Cover & Avatar */}
      <div className='relative w-full'>
        <Image
          src={CommunitySelected?.Cover?.url || '/default-cover.jpg'}
          alt='Community Cover'
          width={1200}
          height={300}
          className='w-full h-[200px] object-cover'
        />
        <div className='absolute left-4 -bottom-10'>
          <Image
            src={CommunitySelected?.Picture?.url || '/default-avatar.png'}
            alt='Community Avatar'
            width={100}
            height={100}
            className='w-24 h-24 rounded-full border-4 border-white dark:border-darkMode-bg object-cover shadow-lg'
          />
        </div>
      </div>

      {/* Community Info */}
      <div className='mt-16 px-4 flex flex-col gap-2'>
        <div className='flex items-center justify-between'>
          <h2 className='text-2xl font-bold text-lightMode-fg dark:text-darkMode-fg'>
            {CommunitySelected?.Name}
          </h2>
          {
            CommunitySelected?.members?.includes(user?._id) ?
            <button onClick={()=> joinToCommunity(CommunitySelected?._id)} className='flex items-center gap-2 text-sm bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-md'>
              <FaPlus /> Disjoin
            </button>
            :
            <button onClick={()=> joinToCommunity(CommunitySelected?._id)} className='flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-md'>
              <FaPlus /> Join
            </button>
          }
        </div>
        <p className='text-sm text-gray-600 dark:text-gray-300 max-w-2xl'>
          {CommunitySelected?.description}
        </p>
        <p className='text-sm text-gray-500'>
          👥 {CommunitySelected?.members?.length || 0} Members
        </p>
      </div>

      {/* Divider */}
      <hr className='my-6 border-lightMode-fg/20 dark:border-darkMode-fg/20 mx-4' />

      {/* Posts */}
      <div className='w-full px-4 flex flex-col gap-6 pb-10'>
        {postsFiltered.length > 0 ? (
          postsFiltered.map((post) => (
            <SluchitEntry post={post} key={post._id} />
          ))
        ) : (
          <div className='text-center text-gray-400 text-sm'>No posts in this community yet.</div>
        )}
      </div>
    </div>
  )
}

export default Page
