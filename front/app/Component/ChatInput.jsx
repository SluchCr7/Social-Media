'use client'
import React, { useState, useRef } from 'react'
import { IoIosSend } from "react-icons/io";
import { IoImage, IoClose } from "react-icons/io5";
import { useMessage } from '../Context/MessageContext';

const ChatInput = () => {
  const { AddNewMessage } = useMessage()
  const [message, setMessage] = useState("")
  const [images, setImages] = useState([])
  const fileInputRef = useRef()

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    const imagePreviews = files.map(file => ({
      file,
      url: URL.createObjectURL(file)
    }))
    setImages(prev => [...prev, ...imagePreviews])
  }

  const removeImage = (urlToRemove) => {
    setImages(prev => prev.filter(img => img.url !== urlToRemove))
  }

  const handleSend = () => {
    AddNewMessage(message, images.map(img => img.file))
    setMessage("")
    setImages([])
  }

  return (
    <div className='w-full flex flex-col gap-2'>
      {/* Image preview section */}
      {images.length > 0 && (
        <div className='flex gap-2 flex-wrap'>
          {images.map((img, idx) => (
            <div key={idx} className='relative w-24 h-24 rounded-md overflow-hidden'>
              <img src={img.url} alt={`upload-${idx}`} className='w-full h-full object-cover rounded-md' />
              <IoClose
                onClick={() => removeImage(img.url)}
                className='absolute top-1 right-1 text-black bg-white dark:text-white dark:bg-black bg-opacity-50 rounded-full p-1 cursor-pointer text-lg'
              />
            </div>
          ))}
        </div>
      )}

      {/* Message input and actions */}
      <div className='w-full flex items-center gap-3'>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          placeholder='Type something...'
          className='w-full py-2 px-4 rounded-lg bg-[#1e1e1e] text-text outline-none'
        />
        <div className='flex items-center gap-3'>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
            className='hidden'
          />
          <IoImage
            className='text-lightMode-text dark:text-darkMode-text text-xl cursor-pointer'
            onClick={() => fileInputRef.current.click()}
          />
          <IoIosSend
            onClick={handleSend}
            className='text-green-500 text-xl cursor-pointer'
          />
        </div>
      </div>
    </div>
  )
}

export default ChatInput
