'use client'

import React, { useMemo, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FaBookmark, FaMusic, FaRegImage, FaPlay, FaPause, FaTimes, FaShareAlt, FaHeart } from 'react-icons/fa'
// 1. استيراد useMusicPlayer من المشغل العالمي

// استيرادات المكتبات المحلية
import { useProfilePosts } from '@/app/Custome/useProfilePosts'
import SluchitEntry from '@/app/Component/SluchitEntry'
import { useAuth } from '@/app/Context/AuthContext'
import { useGetData } from '@/app/Custome/useGetData'
import { useMusicPlayer } from '@/app/Context/MusicPlayerContext'
import Image from 'next/image'
import { usePost } from '@/app/Context/PostContext'

/*
  SavedPage.Dark.jsx - تصميم احترافي ومحسن
*/

// البيانات الثابتة (للتجربة في حال عدم توفر بيانات حية)
const savedPosts = [
  { id: 'p1', user: 'Ahmed', avatar: '/Home.jpg', image: '/Home.jpg', caption: 'Sunset vibes at the coast 🌅 — a short story about the day.', date: 'Oct 12, 2025' },
  { id: 'p2', user: 'Lina', avatar: '/Home.jpg', image: '/Home.jpg', caption: "My workspace — minimal and cozy.", date: 'Sep 20, 2025' },
]

const savedMusic = [
  { id: 'm1', title: 'Lost in Time', artist: 'Nova', cover: '/Home.jpg', url: '/song1.mp3', duration: '3:42' },
  { id: 'm2', title: 'Dreamstate', artist: 'Orion', cover: '/Home.jpg', url: '/song2.mp3', duration: '4:05' },
  { id: 'm3', title: 'Midnight Loop', artist: 'Echoes', cover: '/Home.jpg', url: '/song3.mp3', duration: '2:58' }
]

const savedReels = [
  { id: 'r1', thumbnail: '/reels/thumb1.jpg', video: '/video1.mp4', title: 'Quick Tips for Productivity' },
  { id: 'r2', thumbnail: '/reels/thumb2.jpg', video: '/video2.mp4', title: 'Street Photography - 60s' },
]


export default function SavedPage() {
  const tabs = ['posts', 'music', 'reels']
  const [active, setActive] = useState('posts')
  const [query, setQuery] = useState('')
  const {posts} = usePost()
  // 2. استخدام المشغل الموسيقي العالمي
  const { current, playing, play, pause, setTrack, setSongs } = useMusicPlayer()

  // reel modal
  const [openReel, setOpenReel] = useState(null)
  const {combinedPosts} =  useProfilePosts()
  const {user} = useAuth()
  const {userData} = useGetData()

  // فلاتر البيانات
  const filteredPosts = useMemo(() => posts?.saved?.includes(user?._id).filter(p => (p.text + p.username).toLowerCase().includes(query.toLowerCase())), [query, posts?.saved?.includes(user?._id)])
  
  // استخدام قائمة التشغيل الحقيقية، والرجوع إلى البيانات الثابتة في حال عدم وجودها
  const filteredMusic = useMemo(() => 
    (userData?.myMusicPlaylist?.length > 0 ? userData?.myMusicPlaylist : savedMusic)
      .filter(m => (m.title + m.artist).toLowerCase().includes(query.toLowerCase())), 
    [query, userData?.myMusicPlaylist]
  )
  
  const filteredReels = useMemo(() => savedReels.filter(r => (r.title).toLowerCase().includes(query.toLowerCase())), [query])


  // 3. دالة موحدة لتشغيل/إيقاف الموسيقى باستخدام المشغل العالمي
  const handleMusicAction = (track) => {
    // إذا كانت الأغنية الحالية هي نفس الأغنية: تبديل
    if (current && current.id === track.id) {
      playing ? pause() : play();
    } else {
      // إذا كانت أغنية جديدة: اضبط المسار وشغل
      const trackIndex = filteredMusic.findIndex(m => m.id === track.id);
      setTrack(track, trackIndex, filteredMusic); 
    }
  }

  // 4. مزامنة قائمة الأغاني مع المشغل العالمي عند تفعيل تبويب الموسيقى
  useEffect(() => {
    if (active === 'music' && filteredMusic.length) {
      // نرسل القائمة المفلترة إلى المشغل العالمي ليعرف التسلسل التالي/السابق
      setSongs(filteredMusic)
    }
  }, [active, filteredMusic, setSongs])

  useEffect(()=>{
    console.log(filteredPosts)
  },[filteredPosts])
  return (
    <div className="min-h-screen py-12 px-6 bg-lightMode-bg dark:bg-darkMode-bg text-lightMode-fg dark:text-darkMode-fg">
      <div className="max-w-7xl mx-auto">
        
        {/* ========================================= */}
        {/* 5. تصميم الهيدر المحسن */}
        {/* ========================================= */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          
          {/* العنوان الرئيسي */}
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold flex items-center gap-4">
              <span className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-500/30"> 
                <FaBookmark />
              </span>
              {"Saved Items"}
            </h1>
            <p className="text-sm text-lightMode-text2 dark:text-darkMode-text2 mt-2">All your saved posts, music and reels in one place.</p>
          </div>

          {/* شريط البحث والتبويبات للشاشات الكبيرة */}
          <div className="flex flex-col md:flex-row items-end gap-3 w-full md:w-auto">
            
            {/* حقل البحث الأنيق */}
            <div className="relative w-full md:w-64">
                <input 
                    value={query} 
                    onChange={(e) => setQuery(e.target.value)} 
                    placeholder="Search saved content..." 
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-lightMode-fg/5 dark:bg-white/5 border border-lightMode-fg/10 dark:border-white/10 placeholder:text-lightMode-text2 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-inner dark:shadow-none" 
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-lightMode-text2 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>

            {/* التبويبات (Pills Design) للشاشات الكبيرة */}
            <div className="hidden md:flex items-center bg-lightMode-fg/5 dark:bg-white/5 border border-lightMode-fg/10 dark:border-white/10 rounded-xl p-1 gap-1 shadow-md backdrop-blur-sm">
              {tabs.map(tab => (
                <button 
                  key={tab} 
                  onClick={() => setActive(tab)} 
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    active === tab 
                      ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/50' 
                      : 'text-lightMode-text2 dark:text-darkMode-text2 hover:bg-white/10'
                  }`}
                >
                  {tab === 'posts' && <span className="inline-flex items-center gap-2"> <FaRegImage /> Posts</span>}
                  {tab === 'music' && <span className="inline-flex items-center gap-2"> <FaMusic /> Music</span>}
                  {tab === 'reels' && <span className="inline-flex items-center gap-2"> <FaPlay /> Reels</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* ========================================= */}
        {/* 6. التبويبات للجوال (Mobile Tabs) */}
        {/* ========================================= */}
        <div className="flex md:hidden gap-3 mb-8">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActive(tab)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${active === tab ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-md' : 'bg-white/5 text-lightMode-text dark:text-darkMode-text2 border border-white/5'}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* ========================================= */}
        {/* 7. المحتوى (Content) */}
        {/* ========================================= */}
        <div>
          {/* تبويب Posts */}
          {active === 'posts' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 gap-6">
              {filteredPosts?.length === 0 ? (
                <EmptyState />
              ) : (
                filteredPosts?.map((post) => <SluchitEntry key={post?._id} post={post} />)
              )}
            </motion.div>
          )}

          {/* تبويب Music - تصميم قائمة المسارات المحسن */}
          {active === 'music' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white/3 border border-white/6 rounded-3xl p-6 backdrop-blur-md shadow-2xl dark:shadow-inner">
              {filteredMusic.length === 0 ? <EmptyState /> : (
                <div className="space-y-4">
                  {filteredMusic.map(track => {
                    const isPlayingThis = playing && current && current.id === track.id
                    
                    return (
                      <motion.div 
                        key={track.id} 
                        whileHover={{ scale: 1.015, boxShadow: '0 6px 15px rgba(0,0,0,0.2)' }} 
                        transition={{ duration: 0.2 }}
                        className={`flex items-center gap-4 p-3 rounded-2xl transition duration-200 cursor-pointer ${isPlayingThis ? 'bg-indigo-900/40 border border-indigo-700/50 shadow-lg' : 'bg-white/5 hover:bg-white/10'}`} 
                        onClick={() => handleMusicAction(track)} // جعل السطر بأكمله تفاعلياً
                      >
                        <Image width={800} height={800} src={track.cover} alt={track.title} className="w-16 h-16 rounded-xl object-cover shadow-lg" />
                        
                        <div className="flex-1 min-w-0">
                          <div className={`font-semibold text-lg truncate ${isPlayingThis ? 'text-cyan-400' : 'text-lightMode-fg dark:text-darkMode-fg'}`}>{track.title}</div> 
                          <div className="text-sm text-lightMode-text2 dark:text-darkMode-text2 mt-0.5">{track.artist}</div>
                        </div>
                        
                        <div className="text-sm text-lightMode-text2 dark:text-darkMode-text2 hidden sm:block">{track.duration}</div>

                        {/* زر التشغيل/الإيقاف المحسن */}
                        <button 
                          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 ${
                            isPlayingThis 
                              ? 'bg-red-500/90 text-white shadow-xl shadow-red-500/30' 
                              : 'bg-gradient-to-br from-indigo-600 to-cyan-500 text-black shadow-xl shadow-indigo-500/30'
                          }`}
                          // منع انتشار النقر لمنع استدعاء handleMusicAction مرتين
                          onClick={(e) => { e.stopPropagation(); handleMusicAction(track); }} 
                        >
                          {isPlayingThis ? <FaPause className="w-5 h-5" /> : <FaPlay className="w-5 h-5 ml-0.5" />}
                        </button>

                      </motion.div>
                    )
                  })}
                </div>
              )}
              {/* ملاحظة: تم إزالة عنصر <audio> المحلي، حيث يعتمد الآن على المشغل العالمي */}
            </motion.div>
          )}

          {/* تبويب Reels - تصميم شبكة المقاطع المحسن */}
          {active === 'reels' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredReels.length === 0 ? <EmptyState /> : (
                filteredReels.map(r => (
                  <motion.div 
                    key={r.id} 
                    whileHover={{ scale: 1.05, boxShadow: '0 8px 25px rgba(0,0,0,0.4)' }} 
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="relative rounded-2xl overflow-hidden bg-white/3 border border-white/6 group cursor-pointer shadow-xl"
                    onClick={() => setOpenReel(r)} 
                  >
                    <div className="relative w-full h-48 md:h-60 overflow-hidden">
                      <img src={r.thumbnail} alt={r.title} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                      
                      {/* طبقة تظليل ديناميكية مع أيقونة التشغيل البارزة */}
                      <div className="absolute inset-0 bg-black/40 transition duration-300 group-hover:bg-black/10 flex items-center justify-center">
                        <motion.button 
                            whileTap={{ scale: 0.9 }}
                            className="w-14 h-14 rounded-full bg-white/30 backdrop-blur-sm text-white flex items-center justify-center shadow-2xl opacity-80 group-hover:opacity-100 transition duration-300"
                            onClick={(e) => { e.stopPropagation(); setOpenReel(r); }}
                        >
                            <FaPlay className="ml-1" />
                        </motion.button>
                      </div>
                    </div>
                    
                    <div className="p-3">
                      <div className="font-semibold text-sm truncate">{r.title}</div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </div>

        {/* Reel Modal */}
        {openReel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div onClick={() => setOpenReel(null)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div 
                initial={{ scale: 0.8, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative z-10 w-full max-w-3xl bg-lightMode-bg dark:bg-darkMode-bg rounded-3xl p-6 shadow-2xl"
            >
              <button onClick={() => setOpenReel(null)} className="absolute top-3 right-3 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition z-20"><FaTimes /></button>
              <video src={openReel.video} controls className="w-full rounded-xl shadow-xl" />
              <div className="mt-4">
                <div className="font-semibold text-xl">{openReel.title}</div>
                <div className="text-sm text-lightMode-text2 dark:text-darkMode-text2 mt-1">Saved reel — {openReel.id}</div>
              </div>
            </motion.div>
          </div>
        )}

      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="col-span-full p-16 rounded-3xl bg-white/3 border border-white/6 text-center shadow-inner">
      <div className="text-5xl mb-4">✨</div>
      <div className="font-bold text-xl mb-2">No saved items yet</div>
      <div className="text-md text-lightMode-text2 dark:text-darkMode-text2 mb-6">Save posts, tracks and reels to find them quickly later.</div>
      <button className="px-6 py-2.5 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-black font-semibold shadow-lg hover:shadow-xl transition">Explore Content</button>
    </div>
  )
}