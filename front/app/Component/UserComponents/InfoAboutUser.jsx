'use client'
import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import dayjs from 'dayjs'
import { GrLanguage } from "react-icons/gr"
import {
  FaPhone, FaGlobe, FaLinkedin, FaGithub, FaMapMarkerAlt, FaTwitter,
  FaFacebook, FaBirthdayCake, FaMars, FaVenus, FaHeart
} from 'react-icons/fa'
import { BsCalendar2Date } from "react-icons/bs"

const InfoItem = ({ icon, label, value, bgColor, textColor }) => (
  <motion.div
    variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
    className="flex items-center space-x-3 p-4 rounded-xl 
      bg-lightMode-bg dark:bg-darkMode-bg 
      shadow-md hover:shadow-xl transition hover:-translate-y-1 
      w-full"
  >
    <div className={`min-w-10 min-h-10 flex items-center justify-center rounded-full ${bgColor} ${textColor}`}>
      {icon}
    </div>
    <span className="text-sm sm:text-base break-words">
      <span className="font-semibold">{label}:</span>{" "}
      {value || "Not Provided"}
    </span>
  </motion.div>
)

const SocialIcon = ({ href, icon, bg, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    title={label}
    className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full 
                bg-gradient-to-tr ${bg} text-white hover:scale-110 transition-transform`}
  >
    {icon}
  </a>
)

const InfoAboutUser = ({ user }) => {
  const socialIcons = {
    github: { icon: <FaGithub />, bg: "from-gray-700 to-gray-900", label: "GitHub" },
    linkedin: { icon: <FaLinkedin />, bg: "from-blue-600 to-blue-800", label: "LinkedIn" },
    twitter: { icon: <FaTwitter />, bg: "from-blue-400 to-blue-600", label: "Twitter" },
    facebook: { icon: <FaFacebook />, bg: "from-blue-700 to-blue-900", label: "Facebook" },
    website: { icon: <FaGlobe />, bg: "from-purple-500 to-purple-700", label: "Website" },
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
      }}
      className="mt-8 w-full rounded-2xl bg-lightMode-menu dark:bg-darkMode-menu shadow-xl p-5 sm:p-8"
    >
      {/* العنوان */}
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-lightMode-text2 dark:text-darkMode-text2 border-b border-lightMode-menu/40 dark:border-darkMode-menu/40 pb-3">
        About
      </h2>

      <div className="space-y-10">
        {/* القسم الأول: معلومات شخصية */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-lightMode-text2 dark:text-darkMode-text2">
            Personal Info
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-lightMode-text dark:text-darkMode-text">
            {user?.phone && <InfoItem icon={<FaPhone />} label="Phone" value={user.phone} bgColor="bg-blue-100" textColor="text-blue-500" />}
            {user?.country && <InfoItem icon={<FaMapMarkerAlt />} label="Country" value={user.country} bgColor="bg-green-100" textColor="text-green-500" />}
            {user?.city && <InfoItem icon={<FaMapMarkerAlt />} label="City" value={user.city} bgColor="bg-teal-100" textColor="text-teal-500" />}
            {user?.gender && <InfoItem icon={user.gender.toLowerCase() === 'male' ? <FaMars /> : <FaVenus />} label="Gender" value={user.gender} bgColor="bg-pink-100" textColor="text-pink-500" />}
            {user?.preferedLanguage && <InfoItem icon={<GrLanguage />} label="Preferred Language" value={user.preferedLanguage} bgColor="bg-blue-200" textColor="text-blue-600" />}
            {user?.dateOfBirth && <InfoItem icon={<FaBirthdayCake />} label="Date of Birth" value={dayjs(user.dateOfBirth).format("MMMM D, YYYY")} bgColor="bg-yellow-100" textColor="text-yellow-500" />}
            {user?.createdAt && <InfoItem icon={<BsCalendar2Date />} label="Date Joined" value={dayjs(user.createdAt).format("MMMM D, YYYY")} bgColor="bg-yellow-100" textColor="text-yellow-500" />}

            {/* العلاقة العاطفية */}
            {user?.relationshipStatus && (
              <motion.div
                variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl 
                  bg-purple-50 dark:bg-purple-900/40 
                  shadow-md hover:shadow-xl transition hover:-translate-y-1 
                  col-span-1 sm:col-span-2"
              >
                <div className="min-w-10 min-h-10 flex items-center justify-center rounded-full bg-pink-100 text-pink-500">
                  <FaHeart />
                </div>

                <span className="text-sm sm:text-base leading-relaxed text-lightMode-text dark:text-darkMode-text break-words">
                  <span className="font-semibold">Relationship:</span>{" "}
                  {user.relationshipStatus === "single" && "Single"}

                  {(user.relationshipStatus === "In a Relationship" || user.relationshipStatus === "Married") && (
                    <>
                      {user.relationshipStatus === "In a Relationship"
                        ? "In a relationship with "
                        : "Married to "}
                      {user.partner ? (
                        <Link
                          href={`/Pages/User/${user.partner._id}`}
                          className="text-blue-500 hover:underline break-all"
                        >
                          {user.partner.username}
                        </Link>
                      ) : (
                        "Unknown"
                      )}
                    </>
                  )}
                </span>
              </motion.div>
            )}
          </div>
        </div>

        {/* القسم الثاني: الاهتمامات */}
        {user?.interests?.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-lightMode-text2 dark:text-darkMode-text2">
              Interests
            </h3>
            <motion.div
              className="flex flex-wrap gap-2 sm:gap-3"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
            >
              {user.interests.map((interest, index) => (
                <motion.span
                  key={index}
                  variants={{ hidden: { scale: 0.9, opacity: 0 }, visible: { scale: 1, opacity: 1 } }}
                  className="px-3 sm:px-4 py-2 rounded-full bg-lightMode-bg dark:bg-darkMode-bg 
                    text-lightMode-text dark:text-darkMode-text 
                    shadow hover:shadow-lg transition text-sm sm:text-base font-medium"
                >
                  {interest}
                </motion.span>
              ))}
            </motion.div>
          </div>
        )}

        {/* القسم الثالث: الروابط الاجتماعية */}
        {(user?.socialLinks && Object.values(user.socialLinks).some(link => link?.trim())) && (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-lightMode-text2 dark:text-darkMode-text2">
              Social Links
            </h3>
            <div className="flex items-center gap-3 sm:gap-5 flex-wrap">
              {Object.entries(user.socialLinks).map(([key, link]) =>
                link && socialIcons[key] ? (
                  <SocialIcon key={key} href={link} {...socialIcons[key]} />
                ) : null
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default InfoAboutUser
