'use client'

import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import { useMusic } from './MusicContext' // افترض أن هذا المسار صحيح

const MusicPlayerContext = createContext()

export const MusicPlayerProvider = ({ children }) => {
  const audioRef = useRef(null)
  const { listenMusic, music } = useMusic() 
  const trackViewed = useRef(null) 
  // 💡 متغير حالة جديد: لتتبع ما إذا كان مصدر الصوت قد تم تحميله وجاهزاً
  const [isReady, setIsReady] = useState(false); 
  // 💡 متغير جديد: لتتبع ما إذا كان المستخدم (أو النظام) طلب تشغيلاً
  const isPlaybackRequested = useRef(false);

  // ✨ الحالة الأولية (بدون تغيير)
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
      if (!current || !music.some(m => m._id === current._id)) {
        setCurrent(music[0])
        setCurrentIndex(0)
      }
    } else if (!music?.length) {
      setSongs([]);
      setCurrent(null);
      setCurrentIndex(0);
      if (playing && audioRef.current) audioRef.current.pause();
      setPlaying(false);
      isPlaybackRequested.current = false;
    }
  }, [music, current, playing])


  // =============================================================
  // ⏸️ دالة الإيقاف المؤقت (Pause) - ✅ تحسين
  // تم جعلها بسيطة ومباشرة: أوقف الصوت، وحدّث الحالة، وألغِ طلب التشغيل.
  const pause = useCallback(() => {
    if (!audioRef.current) return
    audioRef.current.pause()
    setPlaying(false) 
    isPlaybackRequested.current = false; 
    console.log('Music paused by user/system.')
  }, []) 
  // =============================================================


  // =============================================================
  // ⏯️ دالة التشغيل الرئيسية (Play) - ✅ تحسين
  // تم فصلها عن تحديث حالة isReady. تعتمد على isPlaybackRequested.
  const play = useCallback(async (isUserAction = false) => {
    const audio = audioRef.current
    if (!audio || !current?.url || playing || !isReady) return 
    
    // إذا لم يكن جاهزاً بعد، أو كان قيد التشغيل بالفعل، نخرج.
    if (!isReady) {
        console.log('Audio not ready, deferring play.')
        return
    }

    // إذا كانت ضغطة من المستخدم، نسجل ذلك ليتم التشغيل لاحقاً في useEffect إذا لم يتم فوراً
    if (isUserAction) {
        isPlaybackRequested.current = true;
    }
    
    if (!isPlaybackRequested.current) return; // لا تشغل إلا إذا كان هناك طلب تشغيل فعال

    try {
      await audio.play()
      setPlaying(true) 
      console.log('Music playing.')
      
      // منطق تسجيل الاستماع
      if (current?._id && trackViewed.current !== current._id) {
        listenMusic(current._id)
        trackViewed.current = current._id 
      }
    } catch (err) {
      console.error('Play failed (Autoplay prevented?):', err)
      setPlaying(false); 
      isPlaybackRequested.current = false;
    }
  }, [playing, current, listenMusic, isReady]) // ✅ إضافة isReady للـ dependencies
  // =============================================================


  // 🔄 تبديل التشغيل/الإيقاف
  const togglePlay = () => (playing ? pause() : play(true)) // isUserAction = true


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
    if (!audio || !current?.url) {
        setIsReady(false);
        if(playing) pause();
        return;
    }

    // إذا كان المسار مختلفاً: قم بتغيير المصدر وإعادة التعيين
    if (audio.src !== current.url) {
      audio.pause();
      audio.src = current.url;
      audio.load();
      
      // إعادة تعيين كل حالات التشغيل والتقدم
      setPlaying(false); 
      setIsReady(false); // ليس جاهزاً حتى يتم التحميل
      trackViewed.current = null;
      setProgress(0);
      setDuration(0);
    }
    
  }, [current, pause]) // ✅ إزالة `play` لتجنب الحلقات اللانهائية


  // 3. مستمعو أحداث عنصر الـ <audio> - ✅ تحسين ومزامنة
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    
    // تحديث حالة الجاهزية
    const onLoadedData = () => {
        setIsReady(true);
        setDuration(audio.duration);
        console.log('Audio data loaded. Ready to play.');
        // 💡 منطق التشغيل المؤجل: محاولة التشغيل فور الجاهزية إذا كان مطلوباً
        if (isPlaybackRequested.current) {
            play(false); // ليس عمل مستخدم مباشر، بل متابعة لطلب سابق
        }
    }
    
    // تحديث شريط التقدم
    const onTime = () => setProgress(audio.currentTime);
    
    // عند الانتهاء
    const onEnd = () => {
        setPlaying(false) 
        if (repeatMode === 'one') {
          if (audioRef.current) audioRef.current.currentTime = 0;
          isPlaybackRequested.current = true; // طلب تشغيل للتكرار
          play(false); 
        } else {
          next(); 
        }
    }
    
    // ربط المستمعين
    audio.addEventListener('loadeddata', onLoadedData)
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('ended', onEnd)
    
    return () => {
      // إزالة المستمعين
      audio.removeEventListener('loadeddata', onLoadedData)
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('ended', onEnd)
    }
  }, [repeatMode, next, play]) // ✅ إضافة play و next للـ deps


  // ⏭️ التالي
  const next = useCallback(() => {
    if (!songs.length) return
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
        setPlaying(false); 
        isPlaybackRequested.current = false;
        if (songs.length > 0) setTrack(songs[0], 0, songs);
        return; 
      }
    }
    setTrack(songs[nextIndex], nextIndex, songs)
  }, [songs, currentIndex, shuffle, repeatMode, setTrack, playing])


  // 🎧 السابق (بدون تغيير)
  const prev = useCallback(() => {
    if (!songs.length) return
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


  // ⏱️ التقدم (Seek) - ✅ تحسين
  const seek = (time) => {
    if (!audioRef.current) return
    audioRef.current.currentTime = time
    setProgress(time)
    // عند تحريك شريط التقدم، نعتبره طلباً للتشغيل إذا لم يكن قيد الإيقاف بالفعل
    if (!playing) {
        isPlaybackRequested.current = true;
        play(false); // نستخدم play(false) هنا لأنها ليست ضغطة زر
    }
  }

  // 🔊 الصوت (بدون تغيير)
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
        setViewMusicPlayer,
        isReady // ✅ إضافة isReady للقيمة
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