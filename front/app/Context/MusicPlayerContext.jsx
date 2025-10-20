'use client'

import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import { useMusic } from './MusicContext' // افتراض أن هذا المسار صحيح

const MusicPlayerContext = createContext()

export const MusicPlayerProvider = ({ children }) => {
  const audioRef = useRef(null)
  // 'viewMusic' هي دالة تسجيل الاستماع، 'music' هي قائمة المقاطع
  const { viewMusic, music } = useMusic() 
  // لتتبع الـ ID الذي تم تسجيل استماعه بالفعل (لمنع التكرار)
  const trackViewed = useRef(null) 
  // لتتبع ما إذا كان التشغيل مطلوبًا بعد تغيير المقطع (مهم لمقاومة منع التشغيل التلقائي)
  const isPlaybackRequested = useRef(false);

  // ✨ الحالة الأولية (بدون تغيير كبير)
  const [songs, setSongs] = useState(music || [])
  const [current, setCurrent] = useState(music && music.length ? music[0] : null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [playing, setPlaying] = useState(false) // حالة التشغيل الفعلية
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.9)
  const [muted, setMuted] = useState(false)
  const [shuffle, setShuffle] = useState(false)
  const [repeatMode, setRepeatMode] = useState('off') // 'off' | 'one' | 'all'
  const [expanded, setExpanded] = useState(false)
  const [viewMusicPlayer, setViewMusicPlayer] = useState(false)

  // 1. مزامنة songs و current مع 'music' الخارجية
  useEffect(() => {
    if (music && music.length) {
      setSongs(music)
      // إذا لم يكن هناك مقطع قيد التشغيل بالفعل أو كانت قائمة المقاطع الجديدة مختلفة
      if (!current || !music.some(m => m._id === current._id)) {
        setCurrent(music[0])
        setCurrentIndex(0)
      }
    } else if (!music?.length) {
        setSongs([]);
        setCurrent(null);
        setCurrentIndex(0);
        // لا داعي لإيقاف التشغيل هنا، useEffect التالي سيتعامل مع ذلك
    }
  }, [music, current])

  // ⏯️ دالة التشغيل (مع تحسين تسجيل الاستماع والتعامل مع أخطاء المتصفح)
  const play = useCallback(async (isUserAction = false) => {
    const audio = audioRef.current
    if (!audio || playing) return

    // تسجيل أن المستخدم طلب التشغيل (مهم لـ useEffect التالي)
    if (isUserAction) {
        isPlaybackRequested.current = true;
    }

    try {
      await audio.play()
      setPlaying(true) // تحديث الحالة عند بدء التشغيل بنجاح
      
      // 🎶 تسجيل الاستماع بشكل احترافي عند بدء التشغيل الفعلي
      if (current?._id && trackViewed.current !== current._id) {
        // تأكد من عدم وجود تسجيل مسبق قبل الإرسال
        viewMusic(current._id)
        trackViewed.current = current._id // قم بتسجيل الـ ID لتجنب التكرار
        console.log(`View recorded for track ID: ${current._id}`);
      }
    } catch (err) {
      console.error('Play failed (Autoplay prevented?):', err)
      // إذا فشل التشغيل التلقائي، نقوم فقط بتحديث الحالة على أنها 'Playing'
      // وندع المستخدم يضغط على الزر لإعادة المحاولة.
      setPlaying(true); // نعتبره 'قيد التشغيل' ليتمكن زر التشغيل/الإيقاف المؤقت من العمل
      // isPlaybackRequested ستبقى 'true'، مما سيجعلنا نحاول مجدداً في useEffect التالي.
    }
  }, [playing, current, viewMusic])

  const pause = useCallback(() => {
    if (!audioRef.current || !playing) return
    audioRef.current.pause()
    setPlaying(false)
    isPlaybackRequested.current = false; // إلغاء طلب التشغيل
  }, [playing])

  const togglePlay = () => (playing ? pause() : play(true)) // isUserAction = true عند الضغط اليدوي

  // 🔊 تغيير المقطع الحالي (الخطوة 1: تحديث المقطع)
  const setTrack = useCallback((track, index = 0, allSongs = songs) => {
    if (!track) return
    setCurrent(track)
    setCurrentIndex(index)
    if (allSongs?.length) setSongs(allSongs)
    // لا ندعو play() هنا، بل نعتمد على useEffect 
  }, [songs])


  // 2. تحديث src والتحميل (الخطوة 2: تغيير المصدر)
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !current?.url) return

    // إذا كان المسار مختلفاً أو لم يكن هناك مسار محمل
    if (audio.src !== current.url) {
      // إيقاف التشغيل الحالي قبل تغيير المصدر
      audio.pause();
      audio.src = current.url
      audio.load()
      trackViewed.current = null; // إعادة تعيين حالة المشاهدة
      setProgress(0); // إعادة تعيين شريط التقدم
      setDuration(0); // إعادة تعيين المدة
    }
    
    // إذا كان التشغيل مطلوبًا بعد تغيير المقطع (مثل الانتقال التلقائي أو اليدوي)
    if (isPlaybackRequested.current) {
        // نستخدم play(true) لنتأكد من أننا نطلب التشغيل
        play(true);
    }
    
  }, [current, play]) // يعتمد على current و play (التي هي نفسها useCallback)


  // 🎧 أحداث الصوت والتحكم بالتكرار
  const onEnd = useCallback(() => {
    setPlaying(false) 
    
    if (repeatMode === 'one') {
      // إعادة تشغيل المقطع فوراً
      if (audioRef.current) audioRef.current.currentTime = 0;
      play(true); 
    } else {
      next(); // الانتقال للمقطع التالي
    }
  }, [repeatMode, next, play])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTime = () => setProgress(audio.currentTime)
    const onLoaded = () => setDuration(audio.duration)
    
    // ربط المستمعين
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onLoaded)
    audio.addEventListener('ended', onEnd)
    
    // ملاحظة: تم نقل تسجيل الاستماع إلى دالة 'play' نفسها للتعامل مع التشغيل الناجح.

    return () => {
      // إزالة المستمعين
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onLoaded)
      audio.removeEventListener('ended', onEnd)
    }
  }, [onEnd]) // التبعيات: فقط onEnd لأنها تستخدم next و repeatMode

  // 🎧 السابق
  const prev = useCallback(() => {
    if (!songs.length) return
    isPlaybackRequested.current = playing; // حفظ حالة التشغيل المطلوبة

    if (shuffle) {
      let rand;
      do {
        rand = Math.floor(Math.random() * songs.length);
      } while (rand === currentIndex && songs.length > 1); 
      return setTrack(songs[rand], rand)
    }
    const newIndex = (currentIndex - 1 + songs.length) % songs.length
    setTrack(songs[newIndex], newIndex)
  }, [songs, currentIndex, shuffle, setTrack, playing]) // أضف playing كتبعية

  // ⏭️ التالي
  const next = useCallback(() => {
    if (!songs.length) return
    isPlaybackRequested.current = playing; // حفظ حالة التشغيل المطلوبة

    if (shuffle) {
      let rand;
      do {
        rand = Math.floor(Math.random() * songs.length);
      } while (rand === currentIndex && songs.length > 1); 
      return setTrack(songs[rand], rand)
    }
    let nextIndex = currentIndex + 1
    if (nextIndex >= songs.length) {
      if (repeatMode === 'all') nextIndex = 0
      else {
        // إذا انتهت القائمة وليس هناك تكرار للكل
        setPlaying(false); 
        isPlaybackRequested.current = false;
        // setTrack(songs[currentIndex], currentIndex); // البقاء على المقطع الأخير
        return; 
      }
    }
    setTrack(songs[nextIndex], nextIndex)
  }, [songs, currentIndex, shuffle, repeatMode, setTrack, playing]) // أضف playing كتبعية


  // ⏱️ التقدم (Seek)
  const seek = (time) => {
    if (!audioRef.current) return
    audioRef.current.currentTime = time
    setProgress(time)
    // عند تحريك شريط التقدم، نعتبره طلباً للتشغيل إذا لم يكن قيد التشغيل بالفعل
    if (!playing) play(true); 
  }

  // 🔊 الصوت
  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.volume = muted ? 0 : volume
  }, [volume, muted])


  return (
    <MusicPlayerContext.Provider
      value={{
        audioRef,
        current,
        setCurrent,
        playing,
        play,
        pause,
        togglePlay,
        progress,
        setProgress,
        duration,
        setDuration,
        volume,
        setVolume,
        muted,
        setMuted,
        shuffle,
        setShuffle,
        repeatMode,
        setRepeatMode,
        next,
        prev,
        seek,
        setTrack,
        songs,
        setSongs,
        currentIndex,
        setCurrentIndex,
        expanded,
        setExpanded,
        viewMusicPlayer,
        setViewMusicPlayer
      }}
    >
      <audio ref={audioRef} preload="metadata" hidden /> 
      {children}
    </MusicPlayerContext.Provider>
  )
}

export const useMusicPlayer = () => useContext(MusicPlayerContext)
