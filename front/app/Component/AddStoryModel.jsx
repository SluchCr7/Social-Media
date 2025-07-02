'use client'
import React, { useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { useStory } from '../Context/StoryContext'

const AddStoryModel = ({ setIsStory , isStory }) => {
  const [storyText, setStoryText] = useState('')
  const [storyImage, setStoryImage] = useState(null)
    const {addNewStory} = useStory()
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setStoryImage(file)
      setStoryText('') // تأكد من عدم وجود نص
    }
  }

  const handleTextChange = (e) => {
    setStoryText(e.target.value)
    setStoryImage(null) // تأكد من عدم وجود صورة
  }

  const handleSubmit = () => {
    if (!storyText && !storyImage) {
      alert('يجب إضافة صورة أو نص.')
      return
    }

    const storyData = storyImage
      ? { type: 'image', file: storyImage }
      : { type: 'text', text: storyText }

    addNewStory(storyData)

    clearInput()
    setIsStory(false)
  }

  const clearInput = () => {
    setStoryImage(null)
    setStoryText('')
  }

  return (
    <div className={` ${isStory ? 'flex' : 'hidden'} fixed inset-0 bg-black/70 z-50 items-center justify-center`}>
      <div className="bg-darkMode-bg text-darkMode-text w-[90%] max-w-md rounded-2xl p-6 relative shadow-lg">

        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl"
          onClick={() => setIsStory(false)}
        >
          <IoClose />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-center">إضافة ستوري</h2>

        {/* Input Options */}
        {!storyImage && (
          <textarea
            value={storyText}
            onChange={handleTextChange}
            placeholder="اكتب نصًا لستوريك..."
            rows={4}
            className="w-full bg-gray-800 text-white p-3 rounded-lg mb-4 focus:outline-none"
            disabled={!!storyImage}
          />
        )}

        {!storyText && (
          <div className="mb-4">
            <label className="block text-sm text-gray-300 mb-1">اختر صورة:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="text-sm text-gray-400"
            />
          </div>
        )}

        {/* Preview */}
        {storyImage && (
          <div className="mb-4">
            <img
              src={URL.createObjectURL(storyImage)}
              alt="Preview"
              className="rounded-lg max-h-64 object-contain mx-auto"
            />
          </div>
        )}

        {/* Clear */}
        {(storyText || storyImage) && (
          <button
            onClick={clearInput}
            className="text-red-400 hover:text-red-300 text-sm mb-4"
          >
            إزالة المحتوى
          </button>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="bg-green-600 hover:bg-green-500 w-full py-2 rounded-lg text-white font-semibold transition"
        >
          نشر الستوري
        </button>
      </div>
    </div>
  )
}

export default AddStoryModel
