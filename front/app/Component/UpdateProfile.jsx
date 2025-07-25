// 'use client'
// import React, { useState } from 'react'
// import { FiX } from "react-icons/fi"
// import { FaGithub, FaLinkedin, FaTwitter, FaFacebook, FaGlobe } from 'react-icons/fa'
// import { useAuth } from '../Context/AuthContext'
// import { toast } from 'react-toastify'

// const UpdateProfile = ({ update, setUpdate }) => {
//   const [formData, setFormData] = useState({
//     username: '',
//     profileName: '',
//     description: '',
//     country: '',
//     phone: '',
//     interests: '',
//     socialLinks: {
//       github: '',
//       linkedin: '',
//       twitter: '',
//       facebook: '',
//       website: '',
//     }
//   })

//   const { updateProfile } = useAuth()

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     if (name in formData.socialLinks) {
//       setFormData(prev => ({
//         ...prev,
//         socialLinks: {
//           ...prev.socialLinks,
//           [name]: value
//         }
//       }))
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         [name]: value
//       }))
//     }
//   }

// const handleSubmit = (e) => {
//   // ✅ التحقق النهائي
//    e.preventDefault()

//   const payload = {}

//   // ✅ الحقول الرئيسية
//   if (formData.username?.trim()) payload.username = formData.username.trim()
//   if (formData.profileName?.trim()) payload.profileName = formData.profileName.trim()
//   if (formData.description?.trim()) payload.description = formData.description.trim()
//   if (formData.country?.trim()) payload.country = formData.country.trim()
//   if (formData.phone?.trim()) payload.phone = formData.phone.trim()

//   // ✅ الاهتمامات
//   if (formData.interests?.trim()) {
//     payload.interests = formData.interests
//       .split(',')
//       .map(item => item.trim())
//       .filter(item => item.length > 0)
//   }


//   const social = formData.socialLinks
//   const links = {}

//   if (social.github?.trim()) links.github = social.github.trim()
//   if (social.linkedin?.trim()) links.linkedin = social.linkedin.trim()
//   if (social.twitter?.trim()) links.twitter = social.twitter.trim()
//   if (social.facebook?.trim()) links.facebook = social.facebook.trim()
//   if (social.website?.trim()) links.website = social.website.trim()

//   if (Object.keys(links).length > 0) {
//     payload.socialLinks = links
//   }
//   if (Object.keys(payload).length === 0) {
//     toast.error("Please fill in at least one field.")
//     return
//   }

//   // ✅ إرسال البيانات
//   updateProfile(payload)
//   setUpdate(false)
// }

//   return (
//     <div className={`${update ? 'fixed inset-0 bg-black/60 z-50 flex items-center justify-center' : 'hidden'}`}>
//       <div className="bg-[#181818] text-white w-[95%] max-w-2xl rounded-2xl shadow-2xl p-6 relative animate-fade-in space-y-6 max-h-[90vh] overflow-y-auto">

//         {/* Close Button */}
//         <button
//           onClick={() => setUpdate(false)}
//           className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl transition"
//         >
//           <FiX />
//         </button>

//         <h2 className="text-3xl font-bold text-center border-b pb-3 border-gray-700">
//           Edit Profile Info
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-5">
//           {/* General Inputs */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-300">Username</label>
//               <input
//                 name="username"
//                 value={formData.username}
//                 onChange={handleChange}
//                 className="w-full py-2 px-4 bg-gray-800 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
//                 placeholder="Enter username"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-300">Profile Name</label>
//               <input
//                 name="profileName"
//                 value={formData.profileName}
//                 onChange={handleChange}
//                 className="w-full py-2 px-4 bg-gray-800 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
//                 placeholder="Display name"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-300">Bio</label>
//               <input
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 className="w-full py-2 px-4 bg-gray-800 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
//                 placeholder="Short bio"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-300">Country</label>
//               <input
//                 name="country"
//                 value={formData.country}
//                 onChange={handleChange}
//                 className="w-full py-2 px-4 bg-gray-800 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
//                 placeholder="Your country"
//               />
//             </div>

//             <div className="sm:col-span-2">
//               <label className="block text-sm font-medium text-gray-300">Phone</label>
//               <input
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 className="w-full py-2 px-4 bg-gray-800 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
//                 placeholder="+20 10xxx"
//               />
//             </div>

//             <div className="sm:col-span-2">
//               <label className="block text-sm font-medium text-gray-300">Interests</label>
//               <input
//                 name="interests"
//                 value={formData.interests}
//                 onChange={handleChange}
//                 className="w-full py-2 px-4 bg-gray-800 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
//                 placeholder="e.g. Programming, Football, Music"
//               />
//               <p className="text-xs text-gray-500 mt-1">Separate with commas (,)</p>
//             </div>
//           </div>

//           {/* Social Links */}
//           <div className="mt-6">
//             <h3 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">Social Links</h3>
//             <div className="space-y-4">
//               {[
//                 { name: 'github', label: 'GitHub', icon: <FaGithub className="text-xl text-white" /> },
//                 { name: 'linkedin', label: 'LinkedIn', icon: <FaLinkedin className="text-xl text-blue-400" /> },
//                 { name: 'twitter', label: 'Twitter', icon: <FaTwitter className="text-xl text-blue-500" /> },
//                 { name: 'facebook', label: 'Facebook', icon: <FaFacebook className="text-xl text-blue-600" /> },
//                 { name: 'website', label: 'Website', icon: <FaGlobe className="text-xl text-green-400" /> },
//               ].map(({ name, label, icon }) => (
//                 <div key={name} className="flex items-center gap-3">
//                   <div className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-full">
//                     {icon}
//                   </div>
//                   <input
//                     name={name}
//                     value={formData.socialLinks[name]}
//                     onChange={handleChange}
//                     placeholder={`${label} URL`}
//                     className="flex-1 py-2 px-4 bg-gray-800 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="w-full mt-6 py-2 px-4 rounded-lg bg-green-600 hover:bg-green-500 transition text-white font-semibold text-lg shadow-lg"
//           >
//             Save Changes
//           </button>
//         </form>
//       </div>
//     </div>
//   )
// }

// export default UpdateProfile

'use client'
import React, { useState } from 'react'
import { FiX } from "react-icons/fi"
import { FaGithub, FaLinkedin, FaTwitter, FaFacebook, FaGlobe } from 'react-icons/fa'
import { useAuth } from '../Context/AuthContext'
import { toast } from 'react-toastify'

const UpdateProfile = ({ update, setUpdate }) => {
  const [formData, setFormData] = useState({
    username: '',
    profileName: '',
    description: '',
    country: '',
    phone: '',
    interests: '',
    dateOfBirth: '',
    gender: '',
    city: '',
    socialLinks: {
      github: '',
      linkedin: '',
      twitter: '',
      facebook: '',
      website: '',
    }
  })

  const { updateProfile } = useAuth()

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name in formData.socialLinks) {
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [name]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = {}

    if (formData.username?.trim()) payload.username = formData.username.trim()
    if (formData.profileName?.trim()) payload.profileName = formData.profileName.trim()
    if (formData.description?.trim()) payload.description = formData.description.trim()
    if (formData.country?.trim()) payload.country = formData.country.trim()
    if (formData.phone?.trim()) payload.phone = formData.phone.trim()
    if (formData.dateOfBirth?.trim()) payload.dateOfBirth = formData.dateOfBirth
    if (formData.gender?.trim()) payload.gender = formData.gender
    if (formData.city?.trim()) payload.city = formData.city.trim()

    if (formData.interests?.trim()) {
      payload.interests = formData.interests
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0)
    }

    const social = formData.socialLinks
    const links = {}

    if (social.github?.trim()) links.github = social.github.trim()
    if (social.linkedin?.trim()) links.linkedin = social.linkedin.trim()
    if (social.twitter?.trim()) links.twitter = social.twitter.trim()
    if (social.facebook?.trim()) links.facebook = social.facebook.trim()
    if (social.website?.trim()) links.website = social.website.trim()

    if (Object.keys(links).length > 0) {
      payload.socialLinks = links
    }

    if (Object.keys(payload).length === 0) {
      toast.error("Please fill in at least one field.")
      return
    }

    updateProfile(payload)
    setUpdate(false)
  }

  const inputStyle = "w-full py-3 px-4 text-sm text-white bg-[#1f1f1f] border border-gray-700 rounded-xl placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition"

  return (
    <div className={`${update ? 'fixed inset-0 bg-black/60 z-50 flex items-center justify-center' : 'hidden'}`}>
      <div className="bg-[#181818] text-white w-[95%] max-w-2xl rounded-2xl shadow-2xl p-6 relative animate-fade-in space-y-6 max-h-[90vh] overflow-y-auto">

        <button onClick={() => setUpdate(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl transition">
          <FiX />
        </button>

        <h2 className="text-3xl font-bold text-center border-b pb-3 border-gray-700">Edit Profile Info</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
              <input name="username" value={formData.username} onChange={handleChange} className={inputStyle} placeholder="Enter username" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Profile Name</label>
              <input name="profileName" value={formData.profileName} onChange={handleChange} className={inputStyle} placeholder="Display name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Bio</label>
              <input name="description" value={formData.description} onChange={handleChange} className={inputStyle} placeholder="Short bio" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Country</label>
              <input name="country" value={formData.country} onChange={handleChange} className={inputStyle} placeholder="Your country" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">City</label>
              <input name="city" value={formData.city} onChange={handleChange} className={inputStyle} placeholder="Your City" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
              <input name="phone" value={formData.phone} onChange={handleChange} className={inputStyle} placeholder="+20 10xxx" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Date of Birth</label>
              <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className={inputStyle} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className={inputStyle}>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">Interests</label>
              <input name="interests" value={formData.interests} onChange={handleChange} className={inputStyle} placeholder="e.g. Programming, Music" />
              <p className="text-xs text-gray-500 mt-1">Separate with commas (,)</p>
            </div>
          </div>

          {/* Social Links */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">Social Links</h3>
            <div className="space-y-4">
              {[
                { name: 'github', label: 'GitHub', icon: <FaGithub /> },
                { name: 'linkedin', label: 'LinkedIn', icon: <FaLinkedin className="text-blue-400" /> },
                { name: 'twitter', label: 'Twitter', icon: <FaTwitter className="text-blue-500" /> },
                { name: 'facebook', label: 'Facebook', icon: <FaFacebook className="text-blue-600" /> },
                { name: 'website', label: 'Website', icon: <FaGlobe className="text-green-400" /> },
              ].map(({ name, label, icon }) => (
                <div key={name} className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-full">{icon}</div>
                  <input
                    name={name}
                    value={formData.socialLinks[name]}
                    onChange={handleChange}
                    placeholder={`${label} URL`}
                    className="flex-1 py-3 px-4 text-sm text-white bg-[#1f1f1f] border border-gray-700 rounded-xl placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                  />
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="w-full mt-6 py-3 px-4 rounded-xl bg-green-600 hover:bg-green-500 transition text-white font-semibold text-lg shadow-lg">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  )
}

export default UpdateProfile
