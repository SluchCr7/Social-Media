'use client';

import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import dayjs from 'dayjs';
import {
  HiPhone,
  HiGlobeAlt,
  HiMapPin,
  HiCake,
  HiCalendarDays,
  HiHeart,
  HiCommandLine,
  HiUsers,
  HiMusicalNote,
  HiInboxStack,
} from 'react-icons/hi2';
import { useTranslation } from 'react-i18next';

// 💎 Modern Prism Card for Info Items
const InfoItem = memo(({ icon, label, value, colorClass }) => (
  <motion.div
    variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
    className="relative group p-6 rounded-[2rem] bg-white/70 dark:bg-white/[0.02] backdrop-blur-3xl border border-gray-100 dark:border-white/5 shadow-xl transition-all hover:-translate-y-1 overflow-hidden"
  >
    <div className={`absolute top-0 right-0 w-24 h-24 blur-[40px] opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2 ${colorClass}`} />

    <div className="relative flex items-center gap-5">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg ${colorClass} bg-opacity-10 text-opacity-100`}>
        {icon}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">{label}</span>
        <p className="text-base font-bold text-gray-900 dark:text-white truncate">
          {value || "—"}
        </p>
      </div>
    </div>
  </motion.div>
));
InfoItem.displayName = 'InfoItem';

// 🎭 Premium Social Icon
const SocialIcon = memo(({ href, icon, label, gradient }) => (
  <motion.a
    whileHover={{ scale: 1.1, y: -4 }}
    whileTap={{ scale: 0.9 }}
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    title={label}
    className={`w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-xl shadow-opacity-30 transition-shadow`}
  >
    {icon}
  </motion.a>
));
SocialIcon.displayName = 'SocialIcon';

const InfoAboutUser = memo(({ user }) => {
  const { t } = useTranslation();

  const socialGrids = useMemo(() => [
    { key: 'github', icon: <HiCommandLine className="w-6 h-6" />, gradient: "from-gray-700 to-gray-900", label: "GitHub" },
    { key: 'linkedin', icon: <HiUsers className="w-6 h-6" />, gradient: "from-blue-600 to-blue-800", label: "LinkedIn" },
    { key: 'twitter', icon: <HiGlobeAlt className="w-6 h-6" />, gradient: "from-sky-400 to-sky-600", label: "Twitter" },
    { key: 'facebook', icon: <HiUsers className="w-6 h-6" />, gradient: "from-blue-700 to-blue-900", label: "Facebook" },
    { key: 'website', icon: <HiGlobeAlt className="w-6 h-6" />, gradient: "from-indigo-500 to-purple-600", label: "Website" },
  ], []);

  const dateOfBirth = useMemo(() => user?.dateOfBirth ? dayjs(user.dateOfBirth).format("MMMM D, YYYY") : null, [user?.dateOfBirth]);
  const createdAt = useMemo(() => user?.createdAt ? dayjs(user.createdAt).format("MMMM D, YYYY") : null, [user?.createdAt]);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
      }}
      className="mt-12 space-y-12"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-end justify-between gap-6 border-b border-gray-100 dark:border-white/5 pb-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-[10px] font-black uppercase tracking-[0.2em]">
            <HiInboxStack className="w-3 h-3" />
            {t('Neural Identity Index')}
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-gray-900 dark:text-white leading-none uppercase">
            {t('About')} <span className="text-indigo-500">{user?.username}</span>
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Core Profile Data */}
        <div className="lg:col-span-2 space-y-12">
          <section className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 pl-2">
              {t("Identity Parameters")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {user?.phone && <InfoItem icon={<HiPhone />} label={t("Phone")} value={user.phone} colorClass="bg-blue-500 text-blue-500" />}
              {user?.country && <InfoItem icon={<HiMapPin />} label={t("Country")} value={user.country} colorClass="bg-green-500 text-green-500" />}
              {user?.city && <InfoItem icon={<HiMapPin />} label={t("City")} value={user.city} colorClass="bg-emerald-500 text-emerald-500" />}
              {user?.gender && (
                <InfoItem
                  icon={user.gender.toLowerCase() === 'male' ? <HiCommandLine /> : <HiMusicalNote />}
                  label={t("Signal Type")}
                  value={user.gender}
                  colorClass="bg-rose-500 text-rose-500"
                />
              )}
              {dateOfBirth && <InfoItem icon={<HiCake />} label={t("Temporal Origin")} value={dateOfBirth} colorClass="bg-yellow-500 text-yellow-500" />}
              {createdAt && <InfoItem icon={<HiCalendarDays />} label={t("Node Initialized")} value={createdAt} colorClass="bg-indigo-500 text-indigo-500" />}
            </div>
          </section>

          {/* Relationship Status - Premium Overlay */}
          {user?.relationshipStatus && (
            <motion.div
              variants={{ hidden: { scale: 0.95, opacity: 0 }, visible: { scale: 1, opacity: 1 } }}
              className="relative p-10 rounded-[3rem] bg-gradient-to-br from-rose-500/10 to-purple-500/10 border border-rose-500/20 shadow-2xl overflow-hidden group"
            >
              <HiHeart className="absolute -bottom-10 -right-10 w-48 h-48 text-rose-500 opacity-5 -rotate-12 transition-transform group-hover:scale-110" />
              <div className="relative flex items-center gap-8">
                <div className="w-20 h-20 rounded-full bg-rose-500 flex items-center justify-center text-white text-3xl shadow-xl shadow-rose-500/20">
                  <HiHeart />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500 mb-2">{t("Connection Status")}</span>
                  <p className="text-xl md:text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                    {user.relationshipStatus === "single" ? t("Independent Node") : (
                      <>
                        {user.relationshipStatus} {t("with")}{" "}
                        {user.partner ? (
                          <Link href={`/Pages/User/${user.partner._id}`} className="text-rose-500 hover:underline">
                            @{user.partner.username}
                          </Link>
                        ) : t("Unknown Entity")}
                      </>
                    )}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar Interests & Socials */}
        <div className="space-y-12">
          {/* Interests Prism */}
          {user?.interests?.length > 0 && (
            <section className="bg-white/70 dark:bg-white/[0.02] backdrop-blur-3xl rounded-[3rem] p-10 border border-gray-100 dark:border-white/5 space-y-8">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                {t("Data Interests")}
              </h3>
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest, index) => (
                  <motion.span
                    key={index}
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(99, 102, 241, 0.1)' }}
                    className="px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 border border-transparent hover:border-indigo-500/30 transition-all cursor-default"
                  >
                    #{interest}
                  </motion.span>
                ))}
              </div>
            </section>
          )}

          {/* Social Links Rail */}
          {(user?.socialLinks && Object.values(user.socialLinks).some(link => link?.trim())) && (
            <section className="bg-white/70 dark:bg-white/[0.02] backdrop-blur-3xl rounded-[3rem] p-10 border border-gray-100 dark:border-white/5 space-y-8">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                {t("Network Links")}
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {socialGrids.map(({ key, icon, label, gradient }) => (
                  user.socialLinks[key] ? (
                    <SocialIcon key={key} href={user.socialLinks[key]} icon={icon} label={label} gradient={gradient} />
                  ) : null
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </motion.div>
  );
});

InfoAboutUser.displayName = 'InfoAboutUser';
export default InfoAboutUser;
