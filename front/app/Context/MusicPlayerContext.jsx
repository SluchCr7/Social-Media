'use client'

import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import { useMusic } from './MusicContext' // افترض أن هذا المسار صحيح

const MusicPlayerContext = createContext()

export const MusicPlayerProvider = ({ children }) => {
  const audioRef = useRef(null)
  // استخدام listenMusic (المفترض أنه الاسم النهائي لدالة تسجيل الاستماع)
  const { listenMusic, music } = useMusic() 
  // لتتبع الـ ID الذي تم تسجيل استماعه بالفعل (لمنع التكرار)
  const trackViewed = useRef(null) 
  // لتتبع ما إذا كان التشغيل مطلوبًا بعد تغيير المقطع (لمقاومة منع التشغيل التلقائي بعد تفاعل المستخدم)
  const isPlaybackRequested = useRef(false);

  // ✨ الحالة الأولية
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
        // عند تغيير المقطع تلقائياً بسبب تحديث القائمة، نلغي طلب التشغيل التلقائي
        isPlaybackRequested.current = false;
      }
    } else if (!music?.length) {
      setSongs([]);
      setCurrent(null);
      setCurrentIndex(0);
      // إيقاف التشغيل إذا كانت القائمة فارغة
      if (playing && audioRef.current) audioRef.current.pause();
      setPlaying(false);
      isPlaybackRequested.current = false;
    }
  }, [music, current, playing])


  // ⏸️ دالة الإيقاف المؤقت (Pause)
  const pause = useCallback(() => {
    if (!audioRef.current) return
    audioRef.current.pause()
    setPlaying(false) 
    isPlaybackRequested.current = false; // إلغاء طلب التشغيل
  }, []) // لا تحتاج to playing


  // ⏯️ دالة التشغيل الرئيسية (Play)
  const play = useCallback(async (isUserAction = false) => {
    const audio = audioRef.current
    if (!audio || (playing && !isUserAction) || !current?.url) return 

    // تسجيل أن المستخدم طلب التشغيل (مهم لـ useEffect التالي)
    if (isUserAction) {
        isPlaybackRequested.current = true;
    }

    try {
      // 💡 محاولة التشغيل، وإذا نجحت نحدث الحالة
      await audio.play()
      setPlaying(true) 
      
      // 🎶 منطق تسجيل الاستماع المحسّن: يسجل مرة واحدة فقط لكل أغنية
      if (current?._id && trackViewed.current !== current._id) {
        listenMusic(current._id)
        trackViewed.current = current._id // قم بتسجيل الـ ID لتجنب التكرار
      }
    } catch (err) {
      console.error('Play failed (Autoplay prevented?):', err)
      // إذا فشل التشغيل التلقائي (عادةً بسبب المتصفحات)، نؤكد حالة الإيقاف
      setPlaying(false); 
      isPlaybackRequested.current = false; // لا يوجد طلب تشغيل فعال الآن
    }
  }, [playing, current, listenMusic]) 

  // 🔄 تبديل التشغيل/الإيقاف
  const togglePlay = () => (playing ? pause() : play(true)) // isUserAction = true عند الضغط اليدوي

  // 🔊 تغيير المقطع الحالي
  const setTrack = useCallback((track, index = 0, allSongs = songs) => {
    if (!track) return
    // 💡 التعديل: عند طلب تغيير المسار يدوياً، نعتبر التشغيل مطلوباً
    isPlaybackRequested.current = true; 
    setCurrent(track)
    setCurrentIndex(index)
    if (allSongs?.length) setSongs(allSongs)
  }, [songs])


  // 2. تحديث src والتحميل
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    
    // إذا لم يكن هناك مسار حالي، نوقف التشغيل
    if (!current?.url) {
        if(playing) pause();
        return;
    }

    // إذا كان المسار مختلفاً
    if (audio.src !== current.url) {
      // إيقاف التشغيل الحالي قبل تغيير المصدر
      audio.pause();
      audio.src = current.url
      audio.load()
      trackViewed.current = null; // إعادة تعيين حالة المشاهدة لتمكين التسجيل الجديد
      setProgress(0); // إعادة تعيين شريط التقدم
      setDuration(0); // إعادة تعيين المدة
      setPlaying(false); // التأكد من حالة الإيقاف المؤقت أثناء التحميل
    }
    
    // إذا كان التشغيل مطلوبًا بعد تغيير المقطع (نتيجة لـ setTrack أو التنقل)
    // نستخدم play(false) لأن هذا ليس ضغطة زر مباشرة، لكنه متابعة لطلب سابق
    if (isPlaybackRequested.current) {
        play(false); 
    }
    
  }, [current, play, pause]) 


  // ⏭️ التالي
  const next = useCallback(() => {
    if (!songs.length) return
    // 💡 التعديل: isPlaybackRequested.current = true; لأن الانتقال هو طلب تشغيل
    // إذا كان المقطع يلعب، فالانتقال للمقطع التالي يعني استمرار التشغيل
    isPlaybackRequested.current = playing || isPlaybackRequested.current; 

    if (shuffle) {
      let rand;
      do {
        rand = Math.floor(Math.random() * songs.length);
      } while (rand === currentIndex && songs.length > 1); 
      return setTrack(songs[rand], rand, songs)
    }
    let nextIndex = currentIndex + 1
    if (nextIndex >= songs.length) {
      if (repeatMode === 'all') nextIndex = 0
      else {
        // إذا انتهت القائمة وليس هناك تكرار للكل
        setPlaying(false); 
        isPlaybackRequested.current = false;
        // نضبط على المقطع الأول في القائمة ليكون جاهزاً للتشغيل الجديد
        if (songs.length > 0) setTrack(songs[0], 0, songs);
        return; 
      }
    }
    setTrack(songs[nextIndex], nextIndex, songs)
  }, [songs, currentIndex, shuffle, repeatMode, setTrack, playing])


  // 🎧 السابق
  const prev = useCallback(() => {
    if (!songs.length) return
    // 💡 التعديل: isPlaybackRequested.current = true; لأن الانتقال هو طلب تشغيل
    isPlaybackRequested.current = playing || isPlaybackRequested.current; 

    if (shuffle) {
      let rand;
      do {
        rand = Math.floor(Math.random() * songs.length);
      } while (rand === currentIndex && songs.length > 1); 
      return setTrack(songs[rand], rand, songs)
    }
    const newIndex = (currentIndex - 1 + songs.length) % songs.length
    setTrack(songs[newIndex], newIndex, songs)
  }, [songs, currentIndex, shuffle, setTrack, playing]) 


  // 🎧 أحداث الصوت والتحكم بالتكرار
  const onEnd = useCallback(() => {
    setPlaying(false) // نوقف حالة الـ playing مؤقتاً
    
    if (repeatMode === 'one') {
      // إعادة تشغيل المقطع فوراً
      if (audioRef.current) audioRef.current.currentTime = 0;
      play(false); // التشغيل التلقائي هنا ليس عمل مستخدم
    } else {
      next(); // الانتقال للمقطع التالي (والذي بدوره سيحاول التشغيل)
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
    
    return () => {
      // إزالة المستمعين
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onLoaded)
      audio.removeEventListener('ended', onEnd)
    }
  }, [onEnd])


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
// 'use client'

// import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
// import { useMusic } from './MusicContext' // افتراض أن هذا المسار صحيح

// const MusicPlayerContext = createContext()

// export const MusicPlayerProvider = ({ children }) => {
//   const audioRef = useRef(null)
//   // 1. التعديل: استبدال 'viewMusic' بـ 'listenMusic' (أفترض أن هذا هو الاسم الجديد للدالة)
//   const { listenMusic, music } = useMusic() 
//   // لتتبع الـ ID الذي تم تسجيل استماعه بالفعل (لمنع التكرار)
//   const trackViewed = useRef(null) 
//   // لتتبع ما إذا كان التشغيل مطلوبًا بعد تغيير المقطع (مهم لمقاومة منع التشغيل التلقائي)
//   const isPlaybackRequested = useRef(false);

//   // ✨ الحالة الأولية (بدون تغيير كبير)
//   const [songs, setSongs] = useState(music || [])
//   const [current, setCurrent] = useState(music && music.length ? music[0] : null)
//   const [currentIndex, setCurrentIndex] = useState(0)
//   const [playing, setPlaying] = useState(false) // حالة التشغيل الفعلية
//   const [progress, setProgress] = useState(0)
//   const [duration, setDuration] = useState(0)
//   const [volume, setVolume] = useState(0.9)
//   const [muted, setMuted] = useState(false)
//   const [shuffle, setShuffle] = useState(false)
//   const [repeatMode, setRepeatMode] = useState('off') // 'off' | 'one' | 'all'
//   const [expanded, setExpanded] = useState(false)
//   const [viewMusicPlayer, setViewMusicPlayer] = useState(false)


//   // 1. مزامنة songs و current مع 'music' الخارجية
//   useEffect(() => {
//     if (music && music.length) {
//       setSongs(music)
//       // إذا لم يكن هناك مقطع قيد التشغيل بالفعل أو كانت قائمة المقاطع الجديدة مختلفة
//       if (!current || !music.some(m => m._id === current._id)) {
//         setCurrent(music[0])
//         setCurrentIndex(0)
//         // عند تغيير المقطع تلقائياً بسبب تحديث القائمة، نلغي طلب التشغيل التلقائي
//         isPlaybackRequested.current = false;
//       }
//     } else if (!music?.length) {
//         setSongs([]);
//         setCurrent(null);
//         setCurrentIndex(0);
//         // إيقاف التشغيل إذا كانت القائمة فارغة
//         if (playing && audioRef.current) audioRef.current.pause();
//         setPlaying(false);
//         isPlaybackRequested.current = false;
//     }
//   }, [music, current, playing])


//   // ⏯️ دالة التشغيل الرئيسية (Play)
//   const play = useCallback(async (isUserAction = false) => {
//     const audio = audioRef.current
//     // لن نخرج إذا كانت قيد التشغيل ونفذنا إجراء مستخدم (isUserAction) لضمان التحديث
//     if (!audio || (playing && !isUserAction)) return 

//     // تسجيل أن المستخدم طلب التشغيل (مهم لـ useEffect التالي)
//     if (isUserAction) {
//         isPlaybackRequested.current = true;
//     }

//     try {
//       await audio.play()
//       setPlaying(true) // تحديث الحالة عند بدء التشغيل بنجاح
//       
//       // 🎶 منطق تسجيل الاستماع المحسّن: يسجل مرة واحدة فقط لكل أغنية
//       if (current?._id && trackViewed.current !== current._id) {
//         listenMusic(current._id)
//         trackViewed.current = current._id // قم بتسجيل الـ ID لتجنب التكرار
//       }
//     } catch (err) {
//       console.error('Play failed (Autoplay prevented?):', err)
//       // ✨ الإصلاح الهام: إذا فشل التشغيل التلقائي، نؤكد حالة الإيقاف
//       setPlaying(false); 
//     }
//   }, [playing, current, listenMusic]) 

//   // ⏸️ دالة الإيقاف المؤقت (Pause)
//   const pause = useCallback(() => {
//     if (!audioRef.current || !playing) return
//     audioRef.current.pause()
//     setPlaying(false) // ✨ الإصلاح: تحديث حالة الإيقاف
//     isPlaybackRequested.current = false; // إلغاء طلب التشغيل
//   }, [playing])

//   // 🔄 تبديل التشغيل/الإيقاف
//   const togglePlay = () => (playing ? pause() : play(true)) // isUserAction = true عند الضغط اليدوي

//   // 🔊 تغيير المقطع الحالي
//   const setTrack = useCallback((track, index = 0, allSongs = songs) => {
//     if (!track) return
//     // 💡 التعديل: عند طلب تغيير المسار يدوياً، نعتبر التشغيل مطلوباً
//     isPlaybackRequested.current = true; 
//     setCurrent(track)
//     setCurrentIndex(index)
//     if (allSongs?.length) setSongs(allSongs)
//     // لا ندعو play() هنا، بل نعتمد على useEffect 
//   }, [songs])


//   // 2. تحديث src والتحميل
//   useEffect(() => {
//     const audio = audioRef.current
//     if (!audio || !current?.url) {
//         if(playing) pause();
//         return;
//     }

//     // إذا كان المسار مختلفاً
//     if (audio.src !== current.url) {
//       // إيقاف التشغيل الحالي قبل تغيير المصدر
//       audio.pause();
//       audio.src = current.url
//       audio.load()
//       trackViewed.current = null; // إعادة تعيين حالة المشاهدة لتمكين التسجيل الجديد
//       setProgress(0); // إعادة تعيين شريط التقدم
//       setDuration(0); // إعادة تعيين المدة
//       setPlaying(false); // التأكد من حالة الإيقاف المؤقت أثناء التحميل
//     }
//     
//     // إذا كان التشغيل مطلوبًا بعد تغيير المقطع (نتيجة لـ setTrack أو التنقل)
//     if (isPlaybackRequested.current) {
//         // نستخدم play(false) لأن هذا ليس ضغطة زر مباشرة
//         play(false);
//     }
//     
//   }, [current, play, pause]) // تم إزالة 'playing' من التبعيات لتجنب الحلقات اللانهائية


//   // 🎧 السابق
//   const prev = useCallback(() => {
//     if (!songs.length) return
//     // 💡 التعديل: isPlaybackRequested.current = true; لأن الانتقال هو طلب تشغيل
//     isPlaybackRequested.current = true; 

//     if (shuffle) {
//       let rand;
//       do {
//         rand = Math.floor(Math.random() * songs.length);
//       } while (rand === currentIndex && songs.length > 1); 
//       return setTrack(songs[rand], rand, songs)
//     }
//     const newIndex = (currentIndex - 1 + songs.length) % songs.length
//     setTrack(songs[newIndex], newIndex, songs)
//   }, [songs, currentIndex, shuffle, setTrack]) 

//   // ⏭️ التالي
//   const next = useCallback(() => {
//     if (!songs.length) return
//     // 💡 التعديل: isPlaybackRequested.current = true; لأن الانتقال هو طلب تشغيل
//     isPlaybackRequested.current = true; 

//     if (shuffle) {
//       let rand;
//       do {
//         rand = Math.floor(Math.random() * songs.length);
//       } while (rand === currentIndex && songs.length > 1); 
//       return setTrack(songs[rand], rand, songs)
//     }
//     let nextIndex = currentIndex + 1
//     if (nextIndex >= songs.length) {
//       if (repeatMode === 'all') nextIndex = 0
//       else {
//         // إذا انتهت القائمة وليس هناك تكرار للكل
//         setPlaying(false); 
//         isPlaybackRequested.current = false;
//         // نضبط على المقطع الأول في القائمة ليكون جاهزاً للتشغيل الجديد
//         if (songs.length > 0) setTrack(songs[0], 0, songs);
//         return; 
//       }
//     }
//     setTrack(songs[nextIndex], nextIndex, songs)
//   }, [songs, currentIndex, shuffle, repeatMode, setTrack])


//   // 🎧 أحداث الصوت والتحكم بالتكرار
//   const onEnd = useCallback(() => {
//     setPlaying(false) 
//     
//     if (repeatMode === 'one') {
//       // إعادة تشغيل المقطع فوراً
//       if (audioRef.current) audioRef.current.currentTime = 0;
//       play(false); // التشغيل التلقائي هنا ليس عمل مستخدم
//     } else {
//       next(); // الانتقال للمقطع التالي
//     }
//   }, [repeatMode, next, play])

//   useEffect(() => {
//     const audio = audioRef.current
//     if (!audio) return

//     const onTime = () => setProgress(audio.currentTime)
//     const onLoaded = () => setDuration(audio.duration)
//     
//     // ربط المستمعين
//     audio.addEventListener('timeupdate', onTime)
//     audio.addEventListener('loadedmetadata', onLoaded)
//     audio.addEventListener('ended', onEnd)
//     

//     return () => {
//       // إزالة المستمعين
//       audio.removeEventListener('timeupdate', onTime)
//       audio.removeEventListener('loadedmetadata', onLoaded)
//       audio.removeEventListener('ended', onEnd)
//     }
//   }, [onEnd])


//   // ⏱️ التقدم (Seek)
//   const seek = (time) => {
//     if (!audioRef.current) return
//     audioRef.current.currentTime = time
//     setProgress(time)
//     // عند تحريك شريط التقدم، نعتبره طلباً للتشغيل إذا لم يكن قيد التشغيل بالفعل
//     if (!playing) play(true); 
//   }

//   // 🔊 الصوت
//   useEffect(() => {
//     if (!audioRef.current) return
//     audioRef.current.volume = muted ? 0 : volume
//   }, [volume, muted])


//   return (
//     <MusicPlayerContext.Provider
//       value={{
//         audioRef,
//         current,
//         setCurrent,
//         playing,
//         play,
//         pause,
//         togglePlay,
//         progress,
//         setProgress,
//         duration,
//         setDuration,
//         volume,
//         setVolume,
//         muted,
//         setMuted,
//         shuffle,
//         setShuffle,
//         repeatMode,
//         setRepeatMode,
//         next,
//         prev,
//         seek,
//         setTrack,
//         songs,
//         setSongs,
//         currentIndex,
//         setCurrentIndex,
//         expanded,
//         setExpanded,
//         viewMusicPlayer,
//         setViewMusicPlayer
//       }}
//     >
//       <audio ref={audioRef} preload="metadata" hidden /> 
//       {children}
//     </MusicPlayerContext.Provider>
//   )
// }

// export const useMusicPlayer = () => useContext(MusicPlayerContext)