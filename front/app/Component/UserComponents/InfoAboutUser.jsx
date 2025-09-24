'use client'
import React from 'react'
import { FaPhone, FaGlobe, FaLinkedin, FaGithub, FaMapMarkerAlt, FaTwitter, FaFacebook, FaBirthdayCake, FaMars, FaVenus, FaHeart } from 'react-icons/fa'
import { BsCalendar2Date } from "react-icons/bs"
import { motion } from 'framer-motion'
import Link from 'next/link'

const InfoAboutUser = ({ user }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8 w-full rounded-2xl bg-lightMode-menu dark:bg-darkMode-menu shadow-xl p-8"
    >
      {/* العنوان */}
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
              <div className="flex items-center space-x-3 p-4 rounded-xl bg-lightMode-bg dark:bg-darkMode-bg shadow-lg hover:shadow-2xl transition hover:-translate-y-1">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-500">
                  <FaPhone />
                </div>
                <span><span className="font-semibold">Phone:</span> {user.phone}</span>
              </div>
            )}

            {user?.country && (
              <div className="flex items-center space-x-3 p-4 rounded-xl bg-lightMode-bg dark:bg-darkMode-bg shadow-lg hover:shadow-2xl transition hover:-translate-y-1">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100 text-green-500">
                  <FaMapMarkerAlt />
                </div>
                <span><span className="font-semibold">Country:</span> {user.country}</span>
              </div>
            )}

            {user?.city && (
              <div className="flex items-center space-x-3 p-4 rounded-xl bg-lightMode-bg dark:bg-darkMode-bg shadow-lg hover:shadow-2xl transition hover:-translate-y-1">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-teal-100 text-teal-500">
                  <FaMapMarkerAlt />
                </div>
                <span><span className="font-semibold">City:</span> {user.city}</span>
              </div>
            )}

            {user?.gender && (
              <div className="flex items-center space-x-3 p-4 rounded-xl bg-lightMode-bg dark:bg-darkMode-bg shadow-lg hover:shadow-2xl transition hover:-translate-y-1">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-pink-100 text-pink-500">
                  {user.gender.toLowerCase() === 'male' ? <FaMars /> : <FaVenus />}
                </div>
                <span><span className="font-semibold">Gender:</span> {user.gender}</span>
              </div>
            )}

            {user?.dateOfBirth && (
              <div className="flex items-center space-x-3 p-4 rounded-xl bg-lightMode-bg dark:bg-darkMode-bg shadow-lg hover:shadow-2xl transition hover:-translate-y-1">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-500">
                  <FaBirthdayCake />
                </div>
                <span>
                  <span className="font-semibold">Date of Birth:</span>{" "}
                  {new Date(user.dateOfBirth).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
            )}

            {user?.createdAt && (
              <div className="flex items-center space-x-3 p-4 rounded-xl bg-lightMode-bg dark:bg-darkMode-bg shadow-lg hover:shadow-2xl transition hover:-translate-y-1">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-500">
                  <BsCalendar2Date />
                </div>
                <span>
                  <span className="font-semibold">Date of Join:</span>{" "}
                  {new Date(user.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
            )}

            {/* قسم العلاقة العاطفية */}
            {user?.partner && (
              <div className="flex items-center space-x-3 p-4 rounded-xl bg-purple-50 dark:bg-purple-900 shadow-lg hover:shadow-2xl transition hover:-translate-y-1 col-span-1 sm:col-span-2">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-pink-100 text-pink-500">
                  <FaHeart />
                </div>
                <span className="text-sm">
                  <span className="font-semibold">Relationship:</span>{" "}
                  {user.relationshipStatus === "single" && "Single"}
                  {(user.relationshipStatus === "In a Relationship" || user.relationshipStatus === "Married") && (
                    <>
                      {user.relationshipStatus === "In a Relationship" ? "In a relationship with " : "Married to "}
                      {user.partner ? (
                        <Link href={`/Pages/User/${user.partner._id}`} className="text-blue-500 hover:underline">
                          {user.partner.username}
                        </Link>
                      ) : "Unknown"}
                    </>
                  )}
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
                  className="px-4 py-2 rounded-full bg-lightMode-bg dark:bg-darkMode-bg text-lightMode-text dark:text-darkMode-text shadow hover:shadow-lg transition text-sm font-medium"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* القسم الثالث: الروابط الاجتماعية */}
        {(user?.socialLinks && Object.values(user.socialLinks).some(link => link?.trim())) && (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-lightMode-text2 dark:text-darkMode-text2">
              Social Links
            </h3>
            <div className="flex items-center gap-4 flex-wrap">
              {user.socialLinks.github && (
                <a
                  href={user.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Profile"
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-tr from-gray-700 to-gray-900 text-white hover:scale-110 transition"
                >
                  <FaGithub />
                </a>
              )}
              {user.socialLinks.linkedin && (
                <a
                  href={user.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Profile"
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-blue-800 text-white hover:scale-110 transition"
                >
                  <FaLinkedin />
                </a>
              )}
              {user.socialLinks.twitter && (
                <a
                  href={user.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter Profile"
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-tr from-blue-400 to-blue-600 text-white hover:scale-110 transition"
                >
                  <FaTwitter />
                </a>
              )}
              {user.socialLinks.facebook && (
                <a
                  href={user.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook Profile"
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-tr from-blue-700 to-blue-900 text-white hover:scale-110 transition"
                >
                  <FaFacebook />
                </a>
              )}
              {user.socialLinks.website && (
                <a
                  href={user.socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Website"
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-tr from-purple-500 to-purple-700 text-white hover:scale-110 transition"
                >
                  <FaGlobe />
                </a>
              )}
            </div>
          </div>
        )}

      </div>
    </motion.div>
  )
}

export default InfoAboutUser
