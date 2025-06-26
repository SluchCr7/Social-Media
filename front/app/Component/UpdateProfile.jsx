'use client'
import React, { useState } from 'react'
import { FiX } from "react-icons/fi"
import { useAuth } from '../Context/AuthContext'

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
  }
  

  return (
    <div className={`${update ? 'fixed inset-0 bg-white/60 dark:bg-black/60 z-50' : 'hidden'}`}>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-xl bg-lightMode-menu dark:bg-darkMode-menu rounded-2xl shadow-lg p-6 space-y-6">
        <div className="flex justify-between items-center border-b border-lightMode-fg dark:border-darkMode-fg pb-2">
          <h2 className="text-lg font-semibold text-lightMode-fg dark:text-darkMode-fg">Update Profile</h2>
          <FiX onClick={() => setUpdate(false)} className="text-lightMode-fg dark:text-darkMode-fg cursor-pointer hover:opacity-75" size={20} />
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-lightMode-fg dark:text-darkMode-fg mb-1">Username</label>
            <input
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              id="name"
              type="text"
              placeholder="Leave empty to skip"
              className="w-full py-2 px-4 rounded-lg bg-[#1e1e1e] text-text outline-none"
            />
          </div>

          <div>
            <label htmlFor="desc" className="block text-sm font-semibold text-lightMode-fg dark:text-darkMode-fg mb-1">Description</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              id="desc"
              type="text"
              placeholder="Leave empty to skip"
              className="w-full py-2 px-4 rounded-lg bg-[#1e1e1e] text-text outline-none"
            />
          </div>

          <div>
            <label htmlFor="profileName" className="block text-sm font-semibold text-lightMode-fg dark:text-darkMode-fg mb-1">Profile Name</label>
            <input
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              id="profileName"
              type="text"
              placeholder="Leave empty to skip"
              className="w-full py-2 px-4 rounded-lg bg-[#1e1e1e] text-text outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 rounded-lg bg-lightMode-fg text-lightMode-bg dark:bg-darkMode-fg dark:text-darkMode-bg hover:bg-opacity-80 transition-colors font-semibold"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  )
}

export default UpdateProfile
