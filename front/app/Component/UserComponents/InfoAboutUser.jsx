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
import { useTranslation } from 'react-i18next'

const InfoItem = ({ icon, label, value, bgColor, textColor }) => (
  <motion.div
    variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
    className="flex items-start sm:items-center gap-3 p-4 rounded-2xl
      bg-lightMode-bg/60 dark:bg-darkMode-bg/60
      shadow-sm hover:shadow-md transition-transform duration-300 hover:-translate-y-1
      border border-lightMode-border/40 dark:border-darkMode-border/20"
  >
    <div className={`w-10 h-10 flex items-center justify-center rounded-full shrink-0 ${bgColor} ${textColor}`}>
      {icon}
    </div>
    <div className="flex-1">
      <span className="block text-xs uppercase tracking-wide opacity-70 font-medium">{label}</span>
      <p className="text-sm sm:text-base font-semibold text-lightMode-text dark:text-darkMode-text break-words">
        {value || "Not Provided"}
      </p>
    </div>
  </motion.div>
)

const SocialIcon = ({ href, icon, bg, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    title={label}
    className={`w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-full
                bg-gradient-to-tr ${bg} text-white hover:scale-110 transition-transform duration-300 shadow-md`}
  >
    {icon}
  </a>
)

const InfoAboutUser = ({ user }) => {
  const { t } = useTranslation()

  const socialIcons = {
    github: { icon: <FaGithub size={18} />, bg: "from-gray-700 to-gray-900", label: "GitHub" },
    linkedin: { icon: <FaLinkedin size={18} />, bg: "from-blue-600 to-blue-800", label: "LinkedIn" },
    twitter: { icon: <FaTwitter size={18} />, bg: "from-blue-400 to-blue-600", label: "Twitter" },
    facebook: { icon: <FaFacebook size={18} />, bg: "from-blue-700 to-blue-900", label: "Facebook" },
    website: { icon: <FaGlobe size={18} />, bg: "from-purple-500 to-purple-700", label: "Website" },
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
      }}
      className="mt-8 w-full rounded-3xl bg-lightMode-menu dark:bg-darkMode-menu
                 shadow-lg p-6 sm:p-10 space-y-10 transition-all duration-300"
    >
      {/* عنوان القسم */}
      <h2 className="text-3xl font-bold tracking-tight mb-2 text-lightMode-text2 dark:text-darkMode-text2">
        {t("About")}
      </h2>
      <div className="h-[3px] w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-6"></div>

      <div className="space-y-10">
        {/* 🧍‍♂️ القسم الأول: المعلومات الشخصية */}
        <section>
          <h3 className="text-xl font-semibold mb-5 text-lightMode-text2 dark:text-darkMode-text2">
            {t("Personal Info")}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {user?.phone && <InfoItem icon={<FaPhone />} label={t("Phone")} value={user.phone} bgColor="bg-blue-100" textColor="text-blue-600" />}
            {user?.country && <InfoItem icon={<FaMapMarkerAlt />} label={t("Country")} value={user.country} bgColor="bg-green-100" textColor="text-green-600" />}
            {user?.city && <InfoItem icon={<FaMapMarkerAlt />} label={t("City")} value={user.city} bgColor="bg-teal-100" textColor="text-teal-600" />}
            {user?.gender && (
              <InfoItem
                icon={user.gender.toLowerCase() === 'male' ? <FaMars /> : <FaVenus />}
                label={t("Gender")}
                value={user.gender}
                bgColor="bg-pink-100"
                textColor="text-pink-600"
              />
            )}
            {user?.preferedLanguage && <InfoItem icon={<GrLanguage />} label={t("Preferred Language")} value={user.preferedLanguage} bgColor="bg-blue-200" textColor="text-blue-700" />}
            {user?.dateOfBirth && (
              <InfoItem
                icon={<FaBirthdayCake />}
                label={t("Date of Birth")}
                value={dayjs(user.dateOfBirth).format("MMMM D, YYYY")}
                bgColor="bg-yellow-100"
                textColor="text-yellow-600"
              />
            )}
            {user?.createdAt && (
              <InfoItem
                icon={<BsCalendar2Date />}
                label={t("Date Joined")}
                value={dayjs(user.createdAt).format("MMMM D, YYYY")}
                bgColor="bg-indigo-100"
                textColor="text-indigo-600"
              />
            )}
          </div>

          {/* ❤️ الحالة العاطفية */}
          {user?.relationshipStatus && (
            <motion.div
              variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
              className="flex flex-col sm:flex-row sm:items-center gap-3 mt-6 p-4 rounded-2xl
                         bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/30 dark:to-purple-900/30
                         shadow-sm border border-pink-100/30 dark:border-pink-900/30 transition"
            >
              <div className="min-w-10 min-h-10 flex items-center justify-center rounded-full bg-pink-100 text-pink-600">
                <FaHeart />
              </div>
              <p className="text-sm sm:text-base leading-relaxed text-lightMode-text dark:text-darkMode-text">
                <span className="font-semibold">{t("Relationship")}:</span>{" "}
                {user.relationshipStatus === "single" && t("Single")}
                {(user.relationshipStatus === "In a Relationship" || user.relationshipStatus === "Married") && (
                  <>
                    {user.relationshipStatus === "In a Relationship"
                      ? t("In a relationship with")
                      : t("Married to")}{" "}
                    {user.partner ? (
                      <Link
                        href={`/Pages/User/${user.partner._id}`}
                        className="text-blue-500 hover:underline"
                      >
                        {user.partner.username}
                      </Link>
                    ) : (
                      t("Unknown")
                    )}
                  </>
                )}
              </p>
            </motion.div>
          )}
        </section>

        {/* 🎯 الاهتمامات */}
        {user?.interests?.length > 0 && (
          <section>
            <h3 className="text-xl font-semibold mb-5 text-lightMode-text2 dark:text-darkMode-text2">
              {t("Interests")}
            </h3>
            <motion.div
              className="flex flex-wrap gap-3"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
            >
              {user.interests.map((interest, index) => (
                <motion.span
                  key={index}
                  variants={{ hidden: { scale: 0.9, opacity: 0 }, visible: { scale: 1, opacity: 1 } }}
                  className="px-4 py-2 rounded-full bg-lightMode-bg dark:bg-darkMode-bg
                    text-lightMode-text dark:text-darkMode-text shadow-sm hover:shadow-md
                    transition font-medium text-sm sm:text-base border border-lightMode-border/40 dark:border-darkMode-border/20"
                >
                  {interest}
                </motion.span>
              ))}
            </motion.div>
          </section>
        )}

        {/* 🌐 الروابط الاجتماعية */}
        {(user?.socialLinks && Object.values(user.socialLinks).some(link => link?.trim())) && (
          <section>
            <h3 className="text-xl font-semibold mb-5 text-lightMode-text2 dark:text-darkMode-text2">
              {t("Social Links")}
            </h3>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              {Object.entries(user.socialLinks).map(([key, link]) =>
                link && socialIcons[key] ? (
                  <SocialIcon key={key} href={link} {...socialIcons[key]} />
                ) : null
              )}
            </div>
          </section>
        )}
      </div>
    </motion.div>
  )
}

export default InfoAboutUser
