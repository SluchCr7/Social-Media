'use client'
import React, { useState, useEffect, useRef } from 'react'
import { IoClose, IoChevronBack, IoChevronForward } from "react-icons/io5"
import Image from 'next/image'

const StoryViewer = ({ stories, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const timeoutRef = useRef(null)

  useEffect(() => {
    startAutoAdvance()
    return () => clearTimeout(timeoutRef.current)
  }, [currentIndex])

  const startAutoAdvance = () => {
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      if (currentIndex < stories.length - 1) {
        setCurrentIndex((prev) => prev + 1)
      } else {
        onClose()
      }
    }, 5000)
  }

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      onClose()
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const story = stories[currentIndex]

  return (
    <div className="fixed inset-0 bg-black/90 z-[999] flex items-center justify-center">
      {/* زر الإغلاق */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white text-3xl z-50 hover:opacity-80"
      >
        <IoClose />
      </button>

      {/* أسهم التنقل */}
      {currentIndex > 0 && (
        <button
          onClick={handlePrev}
          className="absolute left-4 md:left-10 text-white text-4xl z-40 hover:opacity-80"
        >
          <IoChevronBack />
        </button>
      )}
      {currentIndex < stories.length - 1 && (
        <button
          onClick={handleNext}
          className="absolute right-4 md:right-10 text-white text-4xl z-40 hover:opacity-80"
        >
          <IoChevronForward />
        </button>
      )}

      {/* تقسيم الواجهة للنقر */}
      <div
        className="absolute inset-0 z-30 flex"
        onClick={(e) => {
          const width = window.innerWidth
          if (e.clientX < width / 2) {
            handlePrev()
          } else {
            handleNext()
          }
        }}
      >
        <div className="w-1/2 h-full" />
        <div className="w-1/2 h-full" />
      </div>

      {/* محتوى الستوري */}
      <div className="relative max-w-md w-full rounded-xl overflow-hidden bg-white text-black shadow-lg flex items-center justify-center h-[70vh] p-4 z-20">
        {story.Photo[0] ? (
          <Image
            src={story.Photo[0]}
            alt="story"
            fill
            className="object-contain"
          />
        ) : (
          <div className="bg-gradient-to-br from-[#2c2c2c] to-[#444] w-full h-full flex items-center justify-center px-6 text-center rounded-xl">
            <p className="text-2xl md:text-3xl font-semibold text-white leading-snug">
              {story.text}
            </p>
          </div>
        )}
    </div>

      {/* مؤشرات الستوري */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1 z-40">
        {stories.map((_, idx) => (
          <div
            key={idx}
            className={`h-1 w-14 rounded-full ${
              idx <= currentIndex ? 'bg-white' : 'bg-white/30'
            } transition-all duration-300`}
          />
        ))}
      </div>
    </div>
  )
}

export default StoryViewer
