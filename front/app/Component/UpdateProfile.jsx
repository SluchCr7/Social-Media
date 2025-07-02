'use client'
import React, { useState } from 'react'
import { FiX } from "react-icons/fi"
import { useAuth } from '../Context/AuthContext'
import { toast } from 'react-toastify'

const UpdateProfile = ({ update, setUpdate }) => {
  const [username, setUserName] = useState('')
  const [description, setDescription] = useState('')
  const [profileName, setProfileName] = useState('')

  const { updateProfile } = useAuth()

  const handleUpdate = (e) => {
    e.preventDefault()
    const updatedFields = {}
    if (username.trim()) updatedFields.username = username.trim()
    if (description.trim()) updatedFields.description = description.trim()
    if (profileName.trim()) updatedFields.profileName = profileName.trim()
    if (Object.keys(updatedFields).length === 0) {
      toast.error("Please fill at least one field.")
      return
    }
    updateProfile(updatedFields)
    setUpdate(false)
  }

  return (
    <div className={`${update ? 'fixed inset-0 bg-black/60 z-50 flex items-center justify-center' : 'hidden'}`}>
      <div className="bg-[#181818] text-white w-[90%] max-w-lg rounded-2xl shadow-2xl p-6 relative animate-fade-in">
        
        {/* زر الإغلاق */}
        <button
          onClick={() => setUpdate(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl transition"
        >
          <FiX />
        </button>

        {/* العنوان */}
        <h2 className="text-2xl font-bold text-center mb-6 border-b pb-2 border-gray-700">
          Update Profile
        </h2>

        <form onSubmit={handleUpdate} className="space-y-5">
          {/* اسم المستخدم */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-300">اسم المستخدم</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Username"
              className="w-full py-2 px-4 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-green-500 outline-none transition"
            />
          </div>

          {/* البايو */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-300">الوصف</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="w-full py-2 px-4 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-green-500 outline-none transition"
            />
          </div>

          {/* الاسم المعروض */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-300">الاسم المعروض</label>
            <input
              type="text"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              placeholder="Nickname"
              className="w-full py-2 px-4 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-green-500 outline-none transition"
            />
          </div>

          {/* زر التحديث */}
          <button
            type="submit"
            className="w-full py-2 px-4 rounded-lg bg-green-600 hover:bg-green-500 transition text-white font-semibold text-lg shadow-md"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  )
}

export default UpdateProfile
