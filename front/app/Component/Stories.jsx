'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useStory } from '../Context/StoryContext'
import StoryViewer from './StoryViewer'
import StorySkeleton from '../Skeletons/StoriesSkeleton'
const Stories = () => {
    const { stories , isLoading } = useStory()
    const [viewerStories, setViewerStories] = useState(null)

  // 🔁 Group stories by user
  const groupedStories = stories.reduce((acc, story) => {
    const userId = story.owner._id
    if (!acc[userId]) {
      acc[userId] = {
        user: story.owner,
        stories: [],
      }
    }
    acc[userId].stories.push(story)
    return acc
  }, {})

  const groupedArray = Object.values(groupedStories)
  return (
    <div>
        {
          isLoading
          ?(
            <div className="w-full overflow-x-auto flex gap-4 pt-4 rounded-lg">
              {Array.from({ length: 6 }).map((_, i) => <StorySkeleton key={i} />)}
            </div>)
          :(
            <div className="w-full overflow-x-auto flex gap-4 pt-4 rounded-lg">
              {groupedArray.map((group, index) => (
                <div
                  key={index}
                  className="relative cursor-pointer group flex flex-col items-center"
                  onClick={() => setViewerStories(group.stories)}
                >
                  {/* صورة البروفايل داخل إطار ملون (كما في واتساب/فيسبوك) */}
                  <div className="relative w-16 h-16 rounded-full border-4 p-[2px] border-gradient-to-tr from-green-400 to-yellow-400 overflow-hidden">
                    <Image
                      src={group?.user?.profilePhoto?.url || '/default-profile.png'}
                      alt={group?.user?.username}
                      fill
                      className="object-cover rounded-full"
                    />
                  </div>
      
                  {/* اسم المستخدم */}
                  <p className="text-sm mt-2 text-white text-center truncate w-16">{group?.user?.username}</p>
      
                  {/* عدد الستوريهات (لو أكثر من واحد) */}
                  {group.stories.length > 1 && (
                    <span className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                      {group.stories.length}
                    </span>
                  )}
                </div>
              ))}
            {viewerStories && (
                <StoryViewer stories={viewerStories} onClose={() => setViewerStories(null)} />
            )}
            </div>)
        }
    </div>
  )
}

export default Stories
