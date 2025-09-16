'use client'
import React, { useState, useEffect, useRef } from 'react'
import { IoClose, IoChevronBack, IoChevronForward } from "react-icons/io5"
import Image from 'next/image'
import { useSwipeable } from 'react-swipeable'
import { useStory } from '../Context/StoryContext'

const StoryViewer = ({ stories, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const timeoutRef = useRef(null)
  const { viewStory } = useStory() // ✅ تسجيل المشاهدة

  const story = stories[currentIndex]

  // ➕ تسجيل المشاهدة عند الانتقال لأي ستوري
  useEffect(() => {
    if (story?._id) viewStory(story._id)
  }, [currentIndex, story])

  // ➕ التحكم بالانتقال التلقائي
  const startAutoAdvance = () => {
    clearTimeout(timeoutRef.current)
    if (isPaused) return
    timeoutRef.current = setTimeout(() => {
      if (currentIndex < stories.length - 1) setCurrentIndex(prev => prev + 1)
      else onClose()
    }, 5000)
  }

  useEffect(() => {
    startAutoAdvance()
    return () => clearTimeout(timeoutRef.current)
  }, [currentIndex, isPaused])

  const handleNext = () => {
    if (currentIndex < stories.length - 1) setCurrentIndex(currentIndex + 1)
    else onClose()
  }

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1)
  }

  const handlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrev,
    trackMouse: true,
  })

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center backdrop-blur-sm bg-black/70">

      {/* زر الإغلاق */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 rounded-full bg-black/40 hover:bg-black/60 transition z-50"
      >
        <IoClose className="text-white text-3xl" />
      </button>

      {/* أسهم التنقل */}
      {currentIndex > 0 && (
        <button
          onClick={handlePrev}
          className="absolute left-4 md:left-10 p-2 rounded-full bg-black/30 hover:bg-black/50 transition z-40"
        >
          <IoChevronBack className="text-white text-4xl" />
        </button>
      )}
      {currentIndex < stories.length - 1 && (
        <button
          onClick={handleNext}
          className="absolute right-4 md:right-10 p-2 rounded-full bg-black/30 hover:bg-black/50 transition z-40"
        >
          <IoChevronForward className="text-white text-4xl" />
        </button>
      )}

      {/* محتوى الستوري */}
      <div
        {...handlers}
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        className="relative max-w-lg w-full rounded-xl overflow-hidden shadow-lg flex flex-col items-center justify-center h-[70vh] p-4 z-20 bg-black"
      >
        {/* معلومات صاحب الستوري */}
        <div className="absolute top-4 left-4 flex items-center gap-2 z-30">
          <Image
            src={story?.owner?.profilePhoto?.url || '/default-profile.png'}
            alt="avatar"
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="text-white font-semibold">{story?.owner?.username || 'Unknown'}</span>
        </div>

        {/* عدد المشاهدات */}
        <div className="absolute top-4 right-4 text-white text-xs z-50">
          {story?.views?.length || 0} مشاهدة
        </div>

        {/* عرض الصورة أو النص */}
        {story.Photo?.[0] ? (
          <Image
            src={story.Photo[0]}
            alt="story"
            fill
            className="object-cover transition-all duration-500"
          />
        ) : (
          <div className="bg-black/40 w-full h-full flex items-center justify-center px-6 text-center rounded-xl overflow-auto">
            <p className="text-2xl md:text-3xl font-semibold text-white drop-shadow-lg leading-snug">
              {story.text}
            </p>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2 z-40 w-11/12 max-w-lg">
        {stories.map((_, idx) => (
          <div key={idx} className="flex-1 h-1 rounded-full bg-white/30 overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-500"
              style={{
                width:
                  idx < currentIndex ? '100%' :
                  idx === currentIndex ? `${isPaused ? 50 : 100}%` :
                  '0%',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default StoryViewer
