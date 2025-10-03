'use client'
import React from 'react'
import Image from 'next/image'


const PostPhotos = ({ photos = [], setImageView, postId }) => {
  if (!photos || photos.length === 0) return null;

  return (
    <div className={`grid gap-2 ${photos.length > 1 ? 'grid-cols-2 sm:grid-cols-2' : ''}`}>
      {photos.map((photo, index) => (
        <div
          key={index}
          onClick={() => setImageView({ url: photo?.url, postId })}
          className="cursor-pointer"
        >
          <Image
            src={photo?.url || photo}
            alt={`photo-${index}`}
            width={500}
            height={500}
            className="w-full max-h-[500px] object-cover rounded-lg shadow-sm"
          />
        </div>
      ))}
    </div>
  )
}

export default PostPhotos
