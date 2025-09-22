'use client'

import React, { useState, useEffect } from 'react'
import { IoClose, IoChevronBack, IoChevronForward } from "react-icons/io5"
import { FaHeart, FaRegCommentDots } from "react-icons/fa"
import Image from 'next/image'
import { useSwipeable } from 'react-swipeable'
import { useStory } from '../Context/StoryContext'
import { useAuth } from '../Context/AuthContext'
import { useMessage } from '../Context/MessageContext'

const StoryViewer = ({ stories, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showCommentInput, setShowCommentInput] = useState(false)
  const [comment, setComment] = useState("")
  const { viewStory, toggleLove } = useStory()
  const { user } = useAuth()
  const { AddNewMessage, setSelectedUser } = useMessage()
  const story = stories[currentIndex]

  // تسجيل المشاهدة
  useEffect(() => {
    if (story?._id) viewStory(story._id)
  }, [currentIndex, story])

  // progress bar
  useEffect(() => {
    if (!story) return
    setProgress(0)
    if (isPaused) return

    const interval = 50
    const duration = 5000
    const increment = (interval / duration) * 100

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev + increment >= 100) {
          handleNext()
          return 0
        }
        return prev + increment
      })
    }, interval)

    return () => clearInterval(timer)
  }, [currentIndex, isPaused, story])

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

  const photoUrl = Array.isArray(story?.Photo)
    ? story.Photo.find(url => url) || null
    : story?.Photo || null

  const handleLove = () => {
    toggleLove(story._id)
  }

  const handleCommentSubmit = async () => {
    if (!comment.trim()) return
    await AddNewMessage(comment)
    setComment("")
    setShowCommentInput(false)
    setSelectedUser(null)
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center backdrop-blur-lg bg-black/90">

      {/* زر الإغلاق */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-3 rounded-full bg-black/40 hover:bg-black/70 transition z-50 shadow-md"
      >
        <IoClose className="text-white text-3xl" />
      </button>

      {/* أسهم التنقل */}
      {currentIndex > 0 && (
        <button
          onClick={handlePrev}
          className="absolute left-4 md:left-10 p-2 rounded-full bg-black/40 hover:bg-black/60 transition z-40"
        >
          <IoChevronBack className="text-white text-4xl" />
        </button>
      )}
      {currentIndex < stories.length - 1 && (
        <button
          onClick={handleNext}
          className="absolute right-4 md:right-10 p-2 rounded-full bg-black/40 hover:bg-black/60 transition z-40"
        >
          <IoChevronForward className="text-white text-4xl" />
        </button>
      )}

      {/* محتوى الستوري */}
      <div
        {...handlers}
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        className="relative max-w-lg w-full rounded-2xl overflow-hidden shadow-2xl flex flex-col items-center justify-center h-[75vh] z-20 bg-black"
      >
        {/* معلومات صاحب الستوري */}
        <div className="absolute top-4 left-4 flex items-center gap-3 z-30">
          <Image
            src={story?.owner?.profilePhoto?.url || '/default-profile.png'}
            alt="avatar"
            width={42}
            height={42}
            className="w-11 h-11 rounded-full object-cover border-2 border-white/50"
          />
          <div className="flex flex-col">
            <span className="text-white font-semibold text-sm">{story?.owner?.username || 'Unknown'}</span>
            <span className='text-gray-300 text-xs'>{new Date(story?.createdAt).toLocaleString()}</span>
          </div>
        </div>

        {/* الصورة + النص */}
        {photoUrl ? (
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            <Image
              src={photoUrl}
              alt="story"
              fill
              className="object-contain"
            />
            {story.text && (
              <div className="absolute bottom-28 w-11/12 text-center">
                <p className="text-lg md:text-2xl font-semibold text-white px-4 py-2 bg-black/50 rounded-xl shadow-lg backdrop-blur-md">
                  {story.text}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gradient-to-b from-gray-800 to-black w-full h-full flex items-center justify-center px-6 text-center rounded-xl overflow-auto">
            <p className="text-2xl md:text-3xl font-semibold text-white drop-shadow-lg leading-snug">
              {story.text}
            </p>
          </div>
        )}

        {/* الأكشنات */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-10 z-50">
          <button
            onClick={handleLove}
            className="p-4 rounded-full bg-white/10 backdrop-blur-md hover:scale-110 transition shadow-md"
          >
            <FaHeart
              className={`text-3xl ${
                story?.loves?.some(u => u?._id === user?._id)
                  ? "text-red-500"
                  : "text-white"
              }`}
            />
          </button>
          {story?.owner?._id !== user?._id && (
            <button
              onClick={() => {
                setSelectedUser(story?.owner)
                setShowCommentInput(!showCommentInput)
              }}
              className="p-4 rounded-full bg-white/10 backdrop-blur-md hover:scale-110 transition shadow-md"
            >
              <FaRegCommentDots className="text-white text-3xl" />
            </button>
          )}
        </div>

        {/* حقل التعليق */}
        {showCommentInput && (
          <div className="absolute bottom-0 left-0 w-full bg-black/70 backdrop-blur-md p-3 flex items-center gap-2 animate-slide-up">
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-3 rounded-lg bg-gray-800/90 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleCommentSubmit}
              className="px-5 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium text-sm shadow-md"
            >
              Send
            </button>
          </div>
        )}

        {/* عدد المشاهدات لصاحب الستوري */}
        {user?._id === story?.owner?._id && (
          <div className="absolute top-4 right-4 text-white text-sm bg-black/50 px-3 py-1 rounded-lg z-30 shadow-md">
            {story?.views?.length || 0} Views
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2 z-40 w-11/12 max-w-lg">
        {stories.map((_, idx) => (
          <div key={idx} className="flex-1 h-1 rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-50"
              style={{
                width:
                  idx < currentIndex ? '100%' :
                  idx === currentIndex ? `${progress}%` :
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
