'use client'
import SluchitEntry from '@/app/Component/SluchitEntry'
import { usePost } from '@/app/Context/PostContext'
import React, { useEffect, useState } from 'react'

const Page = ({params}) => {
  const [postsRelated , setPostsRelated] = useState([])
  // const text = "#" + params.text.slice(3); // only if you're slicing out a prefix (like "tag" from "tagNature")
  const text = params.text; 
  const { posts } = usePost()
  useEffect(() => {
    const filteredPosts = posts.filter((post) =>
      post.Hashtags.includes(text)
    );
    setPostsRelated(filteredPosts);
  }, [text, posts]);
  return (
    <div className='flex items-start flex-col w-full py-6 px-4'>
      <div className='flex items-start flex-col w-full border-b pb-3 border-gray-500 gap-2'>
        <h1 className='text-2xl text-lightMode-fg dark:text-darkMode-fg font-bold'>#{text}</h1>
        <span className='text-sm text-gray-400'>{postsRelated.length} posts found for {text}</span>
      </div>
      <div className='w-full flex flex-col gap-4 mt-4'>
        {postsRelated.map((post) => (
          <SluchitEntry post={post} key={post._id} />
        ))}
      </div>
    </div>
  )
}

export default Page