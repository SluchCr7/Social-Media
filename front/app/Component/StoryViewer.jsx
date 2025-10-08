'use client'

import React, { useState, useEffect, useRef } from 'react'
import { IoClose, IoChevronBack, IoChevronForward, IoSend } from "react-icons/io5"
import { FaHeart, FaRegCommentDots, FaShare } from "react-icons/fa"
import Image from 'next/image'
import { useSwipeable } from 'react-swipeable'
import { useStory } from '../Context/StoryContext'
import { useAuth } from '../Context/AuthContext'
import { useMessage } from '../Context/MessageContext'
import Link from 'next/link'

const StoryViewer = ({ stories, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showCommentInput, setShowCommentInput] = useState(false)
  const [comment, setComment] = useState("")
  const { viewStory, toggleLove , shareStory } = useStory()
  const { user } = useAuth()
  const { AddNewMessage, setSelectedUser } = useMessage()
  const story = stories[currentIndex]
  const timerRef = useRef(null)

  useEffect(() => {
    if (story?._id) viewStory(story._id)
  }, [currentIndex, story])

  useEffect(() => {
    if (!story || isPaused) return
    setProgress(0)

    const interval = 50
    const duration = 5000
    const increment = (interval / duration) * 100

    timerRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev + increment >= 100) {
          handleNext()
          return 0
        }
        return prev + increment
      })
    }, interval)

    return () => clearInterval(timerRef.current)
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

  const handleLove = () => toggleLove(story._id)
  const handleShare = ()=> shareStory(story._id)
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
        className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 sm:p-3 rounded-full bg-black/40 hover:bg-black/70 transition z-50 shadow-md"
        aria-label="Close Story"
      >
        <IoClose className="text-white text-2xl sm:text-3xl" />
      </button>

      {/* أسهم التنقل */}
      {currentIndex > 0 && (
        <button
          onClick={handlePrev}
          className="absolute left-2 sm:left-4 md:left-10 p-2 sm:p-3 rounded-full bg-black/40 hover:bg-black/60 transition z-40"
          aria-label="Previous Story"
        >
          <IoChevronBack className="text-white text-3xl sm:text-4xl" />
        </button>
      )}
      {currentIndex < stories.length - 1 && (
        <button
          onClick={handleNext}
          className="absolute right-2 sm:right-4 md:right-10 p-2 sm:p-3 rounded-full bg-black/40 hover:bg-black/60 transition z-40"
          aria-label="Next Story"
        >
          <IoChevronForward className="text-white text-3xl sm:text-4xl" />
        </button>
      )}

      {/* محتوى الستوري */}
      <div
        {...handlers}
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        className="relative w-[95%] sm:w-[80%] md:w-[60%] lg:max-w-lg h-[70vh] sm:h-[75vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col items-center justify-center z-20 bg-black"
      >
        {/* معلومات صاحب الستوري */}
        <div className="absolute top-4 left-4 flex items-center gap-3 z-30">
          {/* صورة المالك */}
          <div className="relative">
            <Image
              src={
                story?.originalStory
                  ? story.originalStory.owner?.profilePhoto?.url
                  : story?.owner?.profilePhoto?.url || '/default-profile.png'
              }
              alt="story owner"
              width={48}
              height={48}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white/70 shadow-md"
            />

            {/* لو القصة متشيرة */}
            {story?.originalStory && (
              <Link href={`/Pages/User/${story?.originalStory?.owner?._id}`} className="absolute -bottom-1 -right-1 bg-gradient-to-tr from-green-500 to-emerald-400 rounded-full p-[2px] shadow-md">
                <Image
                  src={story?.owner?.profilePhoto?.url || '/default-profile.png'}
                  alt="reshared by"
                  width={22}
                  height={22}
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover border border-white/70"
                />
              </Link>
            )}
          </div>

          {/* بيانات النصوص + الكولابوريتورز */}
          <div className="flex flex-col leading-tight">
            {/* اسم المالك */}
            <div className="flex items-center flex-wrap gap-1">
              <span className="text-white font-semibold text-sm sm:text-base cursor-pointer hover:underline">
                {story?.originalStory
                  ? story.originalStory.owner?.username
                  : story?.owner?.username || 'Unknown'}
              </span>

              {/* لو فيه Collaborators و مش ستوري متشيرة */}
              {!story?.originalStory && story?.collaborators?.length > 0 && (
                <div className="flex items-center ml-2">
                  {story.collaborators.slice(0, 3).map((colab, idx) => (
                    <Link
                      href={`/Pages/User/${colab._id}`}
                      key={colab._id || idx}
                      className={`-ml-2 border-2 border-black/50 rounded-full overflow-hidden`}
                      title={colab.username}
                    >
                      <Image
                        src={colab?.profilePhoto?.url || '/default-profile.png'}
                        alt={colab.username}
                        width={24}
                        height={24}
                        className="w-5 h-5 sm:w-6 sm:h-6 object-cover rounded-full"
                      />
                    </Link>
                  ))}
                  {story.collaborators.length > 3 && (
                    <span className="text-xs text-gray-300 ml-1">
                      +{story.collaborators.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* تاريخ الإنشاء */}
            <span className="text-gray-300 text-[10px] sm:text-xs">
              {new Date(story?.createdAt).toLocaleString()}
            </span>

            {/* لو القصة متشيرة */}
            {story?.originalStory && (
              <span className="text-[10px] sm:text-xs text-emerald-400 mt-0.5 italic">
                Reshared by @{story?.owner?.username}
              </span>
            )}
          </div>
        </div>
        {/* الصورة + النص */}
        {photoUrl ? (
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            <Image
              src={photoUrl}
              alt="story"
              fill
              className="object-contain max-h-[70vh] sm:max-h-[75vh]"
              priority
            />
            {story.text && (
              <div className="absolute bottom-24 sm:bottom-28 w-11/12 text-center">
                <p className="text-base sm:text-lg md:text-2xl font-semibold text-white px-3 sm:px-4 py-2 bg-black/50 rounded-xl shadow-lg backdrop-blur-md">
                  {story.text}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gradient-to-b from-gray-800 to-black w-full h-full flex items-center justify-center px-6 text-center rounded-xl overflow-auto">
            <p className="text-lg sm:text-2xl md:text-3xl font-semibold text-white drop-shadow-lg leading-snug">
              {story.text}
            </p>
          </div>
        )}

        {/* الأكشنات */}
        <div className={`absolute ${showCommentInput ? "bottom-20" : "bottom-6"} left-1/2 -translate-x-1/2 flex items-center gap-6 sm:gap-8 z-50`}>
          <button
            onClick={handleLove}
            className="p-3 sm:p-4 rounded-full bg-white/10 backdrop-blur-md hover:scale-110 transition shadow-md"
          >
            <FaHeart
              className={`text-2xl sm:text-3xl ${story?.loves?.some(u => u?._id === user?._id) ? "text-red-500" : "text-white"}`}
            />
          </button>
          <button
            onClick={handleShare}
            className="p-3 sm:p-4 rounded-full bg-white/10 backdrop-blur-md hover:scale-110 transition shadow-md"
          >
            <FaShare
              className={`text-2xl sm:text-3xl text-white`}
            />
          </button>
          {story?.owner?._id !== user?._id && (
            <button
              onClick={() => {
                setSelectedUser(story?.owner)
                setShowCommentInput(!showCommentInput)
              }}
              className="p-3 sm:p-4 rounded-full bg-white/10 backdrop-blur-md hover:scale-110 transition shadow-md"
            >
              <FaRegCommentDots className="text-white text-2xl sm:text-3xl" />
            </button>
          )}
        </div>

        {/* حقل التعليق */}
        {showCommentInput && (
          <div className="absolute bottom-0 left-0 w-full bg-black/70 backdrop-blur-md p-3 sm:p-4 flex items-center gap-2 sm:gap-3 animate-slide-up">
            <div className="relative flex-1">
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Type a message..."
                className="w-full px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl bg-gray-800/90 text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:ring-offset-black transition-shadow shadow-inner shadow-black/50"
              />
              <IoSend
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-blue-400 transition"
                size={18}
                onClick={handleCommentSubmit}
              />
            </div>
            <button
              onClick={handleCommentSubmit}
              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold text-sm rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              Send
            </button>
          </div>
        )}

        {/* عدد المشاهدات لصاحب الستوري */}
        {user?._id === story?.owner?._id && (
          <div className="absolute top-4 right-4 text-white text-xs sm:text-sm bg-black/50 px-3 py-1 rounded-lg z-30 shadow-md">
            {story?.views?.length || 0} Views
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="absolute top-3 sm:top-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-40 w-[92%] sm:w-11/12 max-w-lg">
        {stories.map((_, idx) => (
          <div key={idx} className="flex-1 h-1 rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 transition-all duration-50"
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
