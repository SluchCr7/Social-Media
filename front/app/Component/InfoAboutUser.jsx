'use client'
import React from 'react'
import { FaPhone, FaGlobe, FaLinkedin, FaGithub, FaMapMarkerAlt, FaTwitter, FaFacebook } from 'react-icons/fa'

const InfoAboutUser = ({user}) => {
  return (
    <div className="mt-8 w-[70%] mx-auto rounded-2xl bg-lightMode-menu dark:bg-darkMode-menu shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-6 text-lightMode-text2 dark:text-darkMode-text2">About</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-lightMode-text dark:text-darkMode-text">

        {user?.phone && (
            <div className="flex items-center space-x-3">
            <FaPhone className="text-blue-400" />
            <span><span className="font-semibold">Phone:</span> {user.phone}</span>
            </div>
        )}

        {user?.country && (
            <div className="flex items-center space-x-3">
            <FaMapMarkerAlt className="text-green-400" />
            <span><span className="font-semibold">Country:</span> {user.country}</span>
            </div>
            )}
            
        {user?.city && (
            <div className="flex items-center space-x-3">
            <FaMapMarkerAlt className="text-green-400" />
            <span><span className="font-semibold">City:</span> {user.city}</span>
            </div>
        )}

        {user?.gender && (
            <div className="flex items-center space-x-3">
            <span className="text-pink-400 font-bold">♀</span>
            <span><span className="font-semibold">Gender:</span> {user.gender}</span>
            </div>
        )}

        {user?.dateOfBirth && (
            <div className="flex items-center space-x-3">
            <span className="text-yellow-400 font-bold">🎂</span>
            <span>
                <span className="font-semibold">Date of Birth:</span>{" "}
                {new Date(user.dateOfBirth).toLocaleDateString("en-US", {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
                })}
            </span>
            </div>
        )}

        {/* الاهتمامات */}
        {user?.interests?.length > 0 && (
            <div className="sm:col-span-2">
            <p>
                <span className="font-semibold">Interests:</span>{' '}
                {user.interests.join(', ')}
            </p>
            </div>
        )}

        {/* روابط التواصل الاجتماعي */}
        {(user?.socialLinks && Object.values(user.socialLinks).some(link => link?.trim())) && (
            <div className="sm:col-span-2 flex items-center gap-5 mt-2 flex-wrap">
            {user.socialLinks.github && (
                <a href={user.socialLinks.github} target="_blank" rel="noopener noreferrer" title="GitHub">
                <FaGithub className="text-2xl text-gray-300 hover:text-white transition" />
                </a>
            )}
            {user.socialLinks.linkedin && (
                <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn">
                <FaLinkedin className="text-2xl text-blue-500 hover:text-blue-600 transition" />
                </a>
            )}
            {user.socialLinks.twitter && (
                <a href={user.socialLinks.twitter} target="_blank" rel="noopener noreferrer" title="Twitter">
                <FaTwitter className="text-2xl text-blue-400 hover:text-blue-500 transition" />
                </a>
            )}
            {user.socialLinks.facebook && (
                <a href={user.socialLinks.facebook} target="_blank" rel="noopener noreferrer" title="Facebook">
                <FaFacebook className="text-2xl text-blue-600 hover:text-blue-700 transition" />
                </a>
            )}
            {user.socialLinks.website && (
                <a href={user.socialLinks.website} target="_blank" rel="noopener noreferrer" title="Website">
                <FaGlobe className="text-2xl text-purple-400 hover:text-purple-500 transition" />
                </a>
            )}
            </div>
        )}
        </div>
    </div>
  )
}

export default InfoAboutUser