import Image from 'next/image'
import React from 'react'
import { IoClose } from 'react-icons/io5'

const ViewImage = ({ imageView, setImageView }) => {
  if (!imageView) return null

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      <button
        onClick={() => setImageView(null)}
        className="absolute top-5 right-5 text-white text-3xl"
      >
        <IoClose />
      </button>
      {imageView.type === 'video' ? (
        <video
          src={imageView.url}
          className="max-w-[95%] max-h-[95%] rounded-xl outline-none shadow-2xl"
          controls
          autoPlay
        />
      ) : (
        <Image
          width={1000}
          height={1000}
          src={imageView.url}
          alt="fullscreen"
          className="max-w-[95%] max-h-[95%] object-contain rounded-xl shadow-2xl"
        />
      )}
    </div>
  )
}

export default ViewImage