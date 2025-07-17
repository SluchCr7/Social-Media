import Image from 'next/image'
import React from 'react'
import { IoClose } from 'react-icons/io5'

const ViewImage = ({imageView , setImageView}) => {
if (!imageView) return null

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      <button
        onClick={() => setImageView(null)}
        className="absolute top-5 right-5 text-white text-3xl"
      >
        <IoClose />
      </button>
      <Image
        width={1000}
        height={1000}
        src={imageView.url}
        alt="fullscreen"
        className="max-w-[90%] max-h-[90%] object-contain rounded-lg"
      />
    </div>
  )
}

export default ViewImage