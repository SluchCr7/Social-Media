'use client'

import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import { useMusic } from './MusicContext'

const MusicPlayerContext = createContext()

export const MusicPlayerProvider = ({ children }) => {
  const audioRef = useRef(null)
  const { viewMusic, music } = useMusic() // 'viewMusic' هي دالة تسجيل الاستماع
  const trackViewed = useRef(null) // لتتبع المقطع الذي تم تسجيل استماعه بالفعل

  // ✨ الحالة الأولية (بدون تغيير كبير)
  const [songs, setSongs] = useState(music || [])
  const [current, setCurrent] = useState(music && music.length ? music[0] : null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.9)
  const [muted, setMuted] = useState(false)
  const [shuffle, setShuffle] = useState(false)
  const [repeatMode, setRepeatMode] = useState('off') // 'off' | 'one' | 'all'
  const [expanded, setExpanded] = useState(false)
  const [viewMusicPlayer, setViewMusicPlayer] = useState(false)

  // 1. تحديث songs و current عند تغير music
  useEffect(() => {
    if (music && music.length) {
      setSongs(music)
      // إذا لم يكن هناك مقطع قيد التشغيل بالفعل، ابدأ من الأول
      if (!current) {
        setCurrent(music[0])
        setCurrentIndex(0)
      }
    }
  }, [music, current])

  // 2. تحديث src وضبط التشغيل التلقائي/اليدوي
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !current?.url) return

    // تحديث SRC فقط إذا كان مختلفًا
    if (audio.src !== current.url) {
        audio.src = current.url
        audio.load()
        trackViewed.current = null; // إعادة تعيين حالة المشاهدة عند تحميل مقطع جديد
    }
    
    // محاولة التشغيل التلقائي إذا كنا في وضع "تشغيل" سابق
    if (playing) {
        play();
    }

  }, [current]) // يجب أن تعتمد فقط على current

  // ⏯️ التحكم في الصوت
  const play = async (forcePlay = false) => {
    const audio = audioRef.current
    if (!audio || (!forcePlay && playing)) return

    try {
      await audio.play()
      setPlaying(true)

      // 🎶 تسجيل الاستماع بشكل احترافي
      if (current?._id && trackViewed.current !== current._id) {
        viewMusic(current._id)
        trackViewed.current = current._id // قم بتسجيل الـ ID لتجنب التكرار
        console.log(`View recorded for track ID: ${current._id}`); // للتتبع
      }
    } catch (err) {
      console.error('Play failed (Autoplay prevented?):', err)
      // إذا فشل التشغيل التلقائي (وهو شائع في المتصفحات)، نضبط الحالة على True فقط لنحاول لاحقاً
      setPlaying(true);
    }
  }

  const pause = useCallback(() => {
    if (!audioRef.current) return
    audioRef.current.pause()
    setPlaying(false)
  }, [])

  const togglePlay = () => (playing ? pause() : play(true)) // forcePlay عند الضغط اليدوي

  // 🔊 تغيير المقطع الحالي
  const setTrack = useCallback((track, index = 0, allSongs = songs) => {
    if (!track) return
    setCurrent(track)
    setCurrentIndex(index)
    if (allSongs?.length) setSongs(allSongs)
    // لا ندعو play() هنا، بل ندعوها في useEffect بعد تحديث current
    // هذه هي الطريقة الأكثر احترافية للتعامل مع تحديث الـ SRC والتحميل
  }, [songs])


  // 🎧 السابق
  const prev = useCallback(() => {
    if (!songs.length) return
    pause() // إيقاف التشغيل مؤقتاً لتغيير المقطع
    if (shuffle) {
      let rand;
      do {
        rand = Math.floor(Math.random() * songs.length);
      } while (rand === currentIndex && songs.length > 1); // تأكد من أنه ليس نفس المقطع
      return setTrack(songs[rand], rand)
    }
    const newIndex = (currentIndex - 1 + songs.length) % songs.length
    setTrack(songs[newIndex], newIndex)
    play(true); // بدء التشغيل بعد تغيير المقطع
  }, [songs, currentIndex, shuffle, setTrack, pause])

  // ⏭️ التالي
  const next = useCallback(() => {
    if (!songs.length) return
    pause() // إيقاف التشغيل مؤقتاً لتغيير المقطع
    if (shuffle) {
      let rand;
      do {
        rand = Math.floor(Math.random() * songs.length);
      } while (rand === currentIndex && songs.length > 1); // تأكد من أنه ليس نفس المقطع
      return setTrack(songs[rand], rand)
    }
    let nextIndex = currentIndex + 1
    if (nextIndex >= songs.length) {
      if (repeatMode === 'all') nextIndex = 0
      else {
        // إذا انتهت القائمة وليس هناك تكرار للكل
        setPlaying(false); // تأكيد إيقاف الحالة
        return; 
      }
    }
    setTrack(songs[nextIndex], nextIndex)
    play(true); // بدء التشغيل بعد تغيير المقطع
  }, [songs, currentIndex, shuffle, repeatMode, setTrack, pause])


  // 🎧 أحداث الصوت (تم تحسين التبعيات)
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTime = () => setProgress(audio.currentTime)
    const onLoaded = () => setDuration(audio.duration)
    const onEnd = () => {
      setPlaying(false) // تأكيد إيقاف التشغيل
      if (repeatMode === 'one') {
        audio.currentTime = 0
        play(true) // إعادة تشغيل المقطع فوراً
      } else next()
    }
    
    // يجب أن تكون الدالة play متاحة في نطاق useEffect
    const attemptPlay = () => {
      if (playing) {
        // تسجيل الاستماع عند بدء التشغيل الناجح
        if (current?._id && trackViewed.current !== current._id) {
            viewMusic(current._id)
            trackViewed.current = current._id
        }
      }
    };
    
    // إضافة المستمعين
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onLoaded)
    audio.addEventListener('ended', onEnd)
    audio.addEventListener('play', attemptPlay) // تسجيل الاستماع عند بدء التشغيل الفعلي
    
    return () => {
      // إزالة المستمعين
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onLoaded)
      audio.removeEventListener('ended', onEnd)
      audio.removeEventListener('play', attemptPlay)
    }
  }, [repeatMode, next, play, current, viewMusic]) // التبعيات يجب أن تشمل الدوال والحالات المستخدمة

  // ⏱️ التقدم (Seek)
  const seek = (time) => {
    if (!audioRef.current) return
    audioRef.current.currentTime = time
    setProgress(time)
    play() // محاولة استئناف التشغيل بعد التحريك
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
      {/* Preload metadata يساعد في تحميل مدة المقطع بشكل أسرع */}
      <audio ref={audioRef} preload="metadata" hidden /> 
      {children}
    </MusicPlayerContext.Provider>
  )
}

export const useMusicPlayer = () => useContext(MusicPlayerContext)

// 'use client'

// import { createContext, useContext, useEffect, useRef, useState } from 'react'
// import { useMusic } from './MusicContext'

// const MusicPlayerContext = createContext()

// export const MusicPlayerProvider = ({ children }) => {
//   const audioRef = useRef(null)
//   const { viewMusic, music,addListen } = useMusic()

//   // ✨ الحالة الأولية
//   const [songs, setSongs] = useState(music || [])
//   const [current, setCurrent] = useState(music && music.length ? music[0] : null)
//   const [currentIndex, setCurrentIndex] = useState(0)
//   const [playing, setPlaying] = useState(false)
//   const [progress, setProgress] = useState(0)
//   const [duration, setDuration] = useState(0)
//   const [volume, setVolume] = useState(0.9)
//   const [muted, setMuted] = useState(false)
//   const [shuffle, setShuffle] = useState(false)
//   const [repeatMode, setRepeatMode] = useState('off') // 'off' | 'one' | 'all'
//   const [expanded, setExpanded] = useState(false)
//   const [viewMusicPlayer, setViewMusicPlayer] = useState(false)

//   const [firstLoad, setFirstLoad] = useState(true) // ✅ لمنع التشغيل التلقائي

//   // ✨ تحديث songs و current عند تغير music
//   useEffect(() => {
//     if (music && music.length) {
//       setSongs(music)
//       setCurrent(music[0])
//       setCurrentIndex(0)
//     }
//   }, [music])

//   // ✨ ضبط src للأوديو عند تغير current
//   useEffect(() => {
//     if (!audioRef.current || !current?.url) return;
//     audioRef.current.src = current.url;
//     audioRef.current.load();

//     // لا تشغل تلقائياً إلا إذا المستخدم ضغط play أو اختار أغنية
//     if (!firstLoad && playing) play();
//     else setFirstLoad(false);
//   }, [current]);

//   // ⏯️ التحكم في الصوت
//   const play = async () => {
//     if (!audioRef.current) return;
//     if (!audioRef.current.src && current?.url) {
//       audioRef.current.src = current.url;
//       await audioRef.current.load();
//     }
//     try {
//       await audioRef.current.play();
//       setPlaying(true);
//       // addListen(current._id);
//     } catch (err) {
//       console.warn('Playback blocked by browser policy');
//     }
//   };

//   const pause = () => {
//     if (!audioRef.current) return
//     audioRef.current.pause()
//     setPlaying(false)
//   }

//   const togglePlay = () => (playing ? pause() : play())

//   // 🔊 تغيير المقطع الحالي
//   const setTrack = (track, index = 0, allSongs = songs, autoPlay = true) => {
//     if (!track) return;
//     pause(); // ✅ أوقف السابقة قبل التحميل الجديد
//     setCurrent(track);
//     setCurrentIndex(index);
//     if (allSongs?.length) setSongs(allSongs);
//     viewMusic(track._id);
//     addListen(track._id)
//     if (autoPlay) {
//       setPlaying(true);
//     } else {
//       setPlaying(false);
//     }
//   };


//   // ⏮️ السابق
//   const prev = () => {
//     if (!songs.length) return
//     if (shuffle) {
//       const rand = Math.floor(Math.random() * songs.length)
//       return setTrack(songs[rand], rand)
//     }
//     const newIndex = (currentIndex - 1 + songs.length) % songs.length
//     setTrack(songs[newIndex], newIndex)
//   }

//   // ⏭️ التالي
//   const next = () => {
//     if (!songs.length) return
//     if (shuffle) {
//       const rand = Math.floor(Math.random() * songs.length)
//       return setTrack(songs[rand], rand)
//     }
//     let nextIndex = currentIndex + 1
//     if (nextIndex >= songs.length) {
//       if (repeatMode === 'all') nextIndex = 0
//       else return pause()
//     }
//     setTrack(songs[nextIndex], nextIndex)
//   }

//   // ⏱️ التقدم
//   const seek = (time) => {
//     if (!audioRef.current) return
//     audioRef.current.currentTime = time
//     setProgress(time)
//   }

//   // 🔊 الصوت
//   useEffect(() => {
//     if (!audioRef.current) return
//     audioRef.current.volume = muted ? 0 : volume
//   }, [volume, muted])

//   // 🎧 أحداث الصوت
//   useEffect(() => {
//     const audio = audioRef.current
//     if (!audio) return
//     const onTime = () => setProgress(audio.currentTime)
//     const onLoaded = () => setDuration(audio.duration)
//     const onEnd = () => {
//       if (repeatMode === 'one') {
//         audio.currentTime = 0
//         play()
//       } else next()
//     }
//     audio.addEventListener('timeupdate', onTime)
//     audio.addEventListener('loadedmetadata', onLoaded)
//     audio.addEventListener('ended', onEnd)
//     return () => {
//       audio.removeEventListener('timeupdate', onTime)
//       audio.removeEventListener('loadedmetadata', onLoaded)
//       audio.removeEventListener('ended', onEnd)
//     }
//   }, [repeatMode, songs, currentIndex, shuffle])
//   return (
//     <MusicPlayerContext.Provider
//       value={{
//         audioRef,
//         current,
//         setCurrent,
//         playing,
//         play,
//         pause,
//         togglePlay,
//         progress,
//         setProgress,
//         duration,
//         setDuration,
//         volume,
//         setVolume,
//         muted,
//         setMuted,
//         shuffle,
//         setShuffle,
//         repeatMode,
//         setRepeatMode,
//         next,
//         prev,
//         seek,
//         setTrack,
//         songs,
//         setSongs,
//         currentIndex,
//         setCurrentIndex,
//         expanded,
//         setExpanded,
//         viewMusicPlayer,
//         setViewMusicPlayer
//       }}
//     >
//       <audio ref={audioRef} preload="metadata" hidden />
//       {children}
//     </MusicPlayerContext.Provider>
//   )
// }

// export const useMusicPlayer = () => useContext(MusicPlayerContext)
