'use client'
import React from 'react'
import { FaPhone, FaGlobe, FaLinkedin, FaGithub, FaMapMarkerAlt, FaTwitter, FaFacebook } from 'react-icons/fa'
import { BsCalendar2Date } from "react-icons/bs";

const InfoAboutUser = ({ user }) => {
  return (
    <div className="mt-8 w-full rounded-2xl bg-lightMode-menu dark:bg-darkMode-menu shadow-xl p-8">
      
      {/* عنوان */}
      <h2 className="text-3xl font-bold mb-8 text-lightMode-text2 dark:text-darkMode-text2 border-b border-gray-300 dark:border-gray-700 pb-3">
        About
      </h2>

      <div className="space-y-10">

        {/* القسم الأول: معلومات شخصية */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-lightMode-text2 dark:text-darkMode-text2">
            Personal Info
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-lightMode-text dark:text-darkMode-text">
            {user?.phone && (
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-lightMode-bg dark:bg-darkMode-bg shadow-sm hover:shadow-md transition">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-500">
                  <FaPhone />
                </div>
                <span><span className="font-semibold">Phone:</span> {user.phone}</span>
              </div>
            )}

            {user?.country && (
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-lightMode-bg dark:bg-darkMode-bg shadow-sm hover:shadow-md transition">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100 text-green-500">
                  <FaMapMarkerAlt />
                </div>
                <span><span className="font-semibold">Country:</span> {user.country}</span>
              </div>
            )}

            {user?.city && (
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-lightMode-bg dark:bg-darkMode-bg shadow-sm hover:shadow-md transition">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-teal-100 text-teal-500">
                  <FaMapMarkerAlt />
                </div>
                <span><span className="font-semibold">City:</span> {user.city}</span>
              </div>
            )}

            {user?.gender && (
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-lightMode-bg dark:bg-darkMode-bg shadow-sm hover:shadow-md transition">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-pink-100 text-pink-500 font-bold">
                  ♀
                </div>
                <span><span className="font-semibold">Gender:</span> {user.gender}</span>
              </div>
            )}

            {user?.dateOfBirth && (
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-lightMode-bg dark:bg-darkMode-bg shadow-sm hover:shadow-md transition">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-500 font-bold">
                  🎂
                </div>
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

            {user?.createdAt && (
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-lightMode-bg dark:bg-darkMode-bg shadow-sm hover:shadow-md transition">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-500 font-bold">
                  <BsCalendar2Date/>
                </div>
                <span>
                  <span className="font-semibold">Date of Join:</span>{" "}
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* القسم الثاني: الاهتمامات */}
        {user?.interests?.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-lightMode-text2 dark:text-darkMode-text2">
              Interests
            </h3>
            <div className="flex flex-wrap gap-3">
              {user.interests.map((interest, index) => (
                <span
                  key={index}
                  className="px-4 py-2 rounded-full bg-lightMode-bg dark:bg-darkMode-bg text-lightMode-text dark:text-darkMode-text shadow-sm hover:shadow-md transition text-sm font-medium"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* القسم الثالث: روابط التواصل */}
        {(user?.socialLinks && Object.values(user.socialLinks).some(link => link?.trim())) && (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-lightMode-text2 dark:text-darkMode-text2">
              Social Links
            </h3>
            <div className="flex items-center gap-4 flex-wrap">
              {user.socialLinks.github && (
                <a href={user.socialLinks.github} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 text-white hover:scale-110 transition"
                >
                  <FaGithub />
                </a>
              )}
              {user.socialLinks.linkedin && (
                <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white hover:scale-110 transition"
                >
                  <FaLinkedin />
                </a>
              )}
              {user.socialLinks.twitter && (
                <a href={user.socialLinks.twitter} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-400 text-white hover:scale-110 transition"
                >
                  <FaTwitter />
                </a>
              )}
              {user.socialLinks.facebook && (
                <a href={user.socialLinks.facebook} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-700 text-white hover:scale-110 transition"
                >
                  <FaFacebook />
                </a>
              )}
              {user.socialLinks.website && (
                <a href={user.socialLinks.website} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-500 text-white hover:scale-110 transition"
                >
                  <FaGlobe />
                </a>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default InfoAboutUser
