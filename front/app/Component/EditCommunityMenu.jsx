'use client'

import React, { useState } from 'react'
import { IoClose, IoCamera } from 'react-icons/io5'
import { useCommunity } from '../Context/CommunityContext'
import Image from 'next/image'

const EditCommunityMenu = ({ community, onClose }) => {
  const [name, setName] = useState(community?.Name || '')
  const [description, setDescription] = useState(community?.description || '')
  const [isPrivate, setIsPrivate] = useState(community?.isPrivate || false)
  const [previewPicture, setPreviewPicture] = useState(community?.Picture.url || '')
  const [previewCover, setPreviewCover] = useState(community?.Cover.url || '')

  const { editCommunity, updateCommunityPicture, updateCommunityCover } = useCommunity()

  // رفع الصور تلقائيًا عند التحديد
  const handleImageChange = async (e, type) => {
    const file = e.target.files[0]
    if (!file) return

    const url = URL.createObjectURL(file)

    if (type === 'picture') {
      setPreviewPicture(url)
      await updateCommunityPicture(community._id, file)
    } else {
      setPreviewCover(url)
      await updateCommunityCover(community._id, file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // لا ترسل إلا القيم التي تم تعديلها
    const formData = new FormData()

    if (name !== community.Name) {
      formData.append('Name', name)
    }

    if (description !== community.description) {
      formData.append('description', description)
    }

    if (isPrivate !== community.isPrivate) {
      formData.append('isPrivate', isPrivate)
    }

    if (formData.has('Name') || formData.has('description') || formData.has('isPrivate')) {
      await editCommunity(community._id, formData)
    }

    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-darkMode-bg rounded-xl p-6 w-full max-w-2xl relative shadow-lg overflow-y-auto max-h-[95vh]">

        {/* زر الإغلاق */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-2xl text-gray-500 hover:text-red-500"
        >
          <IoClose />
        </button>

        <h2 className="text-2xl font-semibold mb-6 text-center">Edit Community</h2>

        {/* صورة الكافر */}
        <div className="relative w-full h-40 rounded-lg overflow-hidden mb-6">
          {previewCover && (
            <Image src={previewCover} alt="Cover" fill className="object-cover" />
          )}
          <label className="absolute top-2 right-2 bg-black bg-opacity-60 p-2 rounded-full cursor-pointer text-white">
            <IoCamera />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, 'cover')}
              className="hidden"
            />
          </label>
        </div>

        {/* صورة البروفايل */}
        <div className="relative w-28 h-28 mx-auto -mt-16 border-4 border-white dark:border-darkMode-bg rounded-full overflow-hidden">
          {previewPicture && (
            <Image src={previewPicture} alt="Profile" fill className="object-cover" />
          )}
          <label className="absolute bottom-1 right-1 bg-black bg-opacity-60 p-1 rounded-full cursor-pointer text-white">
            <IoCamera size={16} />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, 'picture')}
              className="hidden"
            />
          </label>
        </div>

        {/* النموذج */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4 px-2">
          <div>
            <label className="block mb-1 font-medium">Community Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={() => setIsPrivate(!isPrivate)}
              className="w-5 h-5"
              id="private-checkbox"
            />
            <label htmlFor="private-checkbox" className="text-sm font-medium">
              Private Community
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition duration-150"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditCommunityMenu
