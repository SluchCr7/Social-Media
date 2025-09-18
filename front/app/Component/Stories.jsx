'use client'

import React, { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import { useStory } from '../Context/StoryContext'
import StoryViewer from './StoryViewer'
import StorySkeleton from '../Skeletons/StoriesSkeleton'
import { useAuth } from '../Context/AuthContext'

const Stories = () => {
  const { user } = useAuth()
  const { stories, isLoading, viewStory } = useStory()
  const [viewerStories, setViewerStories] = useState(null)
  useEffect(()=>{
    console.log(stories)
  },[stories])
  // 🧠 تحسين الأداء: تجميع الستوريز حسب المستخدم
  const groupedArray = useMemo(() => {
    const groupedStories = stories.reduce((acc, story) => {
      const userId = story?.owner?._id
      if (!acc[userId]) {
        acc[userId] = { user: story?.owner, stories: [] }
      }
      acc[userId].stories.push(story)
      return acc
    }, {})
    return Object.values(groupedStories)
  }, [stories])

  const handleOpenViewer = (userStories) => {
    setViewerStories(userStories)
    userStories.forEach(story => viewStory(story._id))
  }

  const getBorderColor = (userStories) => {
    const unseen = userStories.some(story => !story.views.includes(user?._id))
    return unseen
      ? 'bg-yellow-400 animate-pulse' // ستوري جديد لم يشاهده المستخدم
      : 'bg-gray-500'                  // شاهد كل الستوريز
  }

  return (
    <div className="w-[90%] md:w-full">
      {isLoading ? (
        <div className="w-full overflow-x-auto flex gap-4 py-4 rounded-lg">
          {Array.from({ length: 6 }).map((_, i) => (
            <StorySkeleton key={i} circle />
          ))}
        </div>
      ) : (
        <div className="w-full overflow-x-auto flex gap-4 pt-4 pb-2 rounded-lg snap-x snap-mandatory">
          {groupedArray.map((group, index) => (
            <div
              key={index}
              className="relative cursor-pointer group flex flex-col items-center snap-start"
              onClick={() => handleOpenViewer(group.stories)}
            >
              {/* صورة البروفايل مع إطار متغير حسب المشاهدة */}
              <div className={`relative w-16 h-16 rounded-full p-[2px] ${getBorderColor(group.stories)}`}>
                <div className="w-full h-full rounded-full bg-black p-[2px]">
                  <Image
                    src={group?.user?.profilePhoto?.url || '/default-profile.png'}
                    alt={group?.user?.username}
                    fill
                    loading="lazy"
                    className="object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

              {/* اسم المستخدم */}
              <p
                className="text-xs mt-2 text-gray-200 text-center truncate w-16"
                title={group?.user?.username}
              >
                {group?.user?.username}
              </p>

              {/* عدد الستوريهات */}
              {group.stories.length > 1 && (
                <span className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                  {group.stories.length}
                </span>
              )}
            </div>
          ))}

          {/* Story Viewer */}
          {viewerStories && (
            <StoryViewer
              stories={viewerStories}
              onClose={() => setViewerStories(null)}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default Stories
