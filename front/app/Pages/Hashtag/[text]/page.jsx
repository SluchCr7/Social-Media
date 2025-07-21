'use client'
import SluchitEntry from '@/app/Component/SluchitEntry'
import { usePost } from '@/app/Context/PostContext'
import React, { useEffect, useState } from 'react'

const Page = ({ params }) => {
  const [postsRelated, setPostsRelated] = useState([])
  // const text = "#" + params.text.slice(3); // only if you're slicing out a prefix (like "tag" from "tagNature")
  const { posts } = usePost()
  const text = params.text

  useEffect(() => {
    const filteredPosts = posts.filter((post) => post.Hashtags.includes(text))
    setPostsRelated(filteredPosts)
  }, [text, posts])

  return (
    <div className="w-full px-4 md:px-8 py-6 min-h-screen bg-lightMode-bg dark:bg-darkMode-bg transition-colors duration-300">
      <div className="border-b border-gray-300 dark:border-gray-600 pb-4 mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-lightMode-fg dark:text-darkMode-fg">
          #{text}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {postsRelated.length} {postsRelated.length === 1 ? "post" : "posts"} found for <span className="font-medium">#{text}</span>
        </p>
      </div>

      <div className="space-y-6">
        {postsRelated.length > 0 ? (
          postsRelated.map((post) => (
            <div
              key={post._id}
              className="animate-fadeIn"
            >
              <SluchitEntry post={post} />
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 text-lg mt-10">
            No posts found with the tag <span className="font-semibold text-darkMode-fg">#{text}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default Page
