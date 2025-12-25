// 'use client'

// import React, { useRef, useState, useEffect } from 'react'
// import { useAuth } from '@/app/Context/AuthContext'
// import { usePost } from '@/app/Context/PostContext'
// import { useCommunity } from '@/app/Context/CommunityContext'
// import NewPostPresenter from './Design'

// const NewPostContainer = () => {
//   const [postText, setPostText] = useState('')
//   const [images, setImages] = useState([])
//   const [selectedCommunity, setSelectedCommunity] = useState('')
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false)
//   const [errorText, setErrorText] = useState(false)
//   const [selectedUser, setSelectedUser] = useState({})
//   const [selectedMentions, setSelectedMentions] = useState([])
//   const [privacy, setPrivacy] = useState('public')
//   const [scheduleEnabled, setScheduleEnabled] = useState(false)
//   const [scheduleDate, setScheduleDate] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [links, setLinks] = useState([])
//   const [linkInput, setLinkInput] = useState('')
//   const [cursorPosition, setCursorPosition] = useState(0)
//   const [mentionQuery, setMentionQuery] = useState('')
//   const [showMentionBox, setShowMentionBox] = useState(false)
//   const [mentionBoxPos, setMentionBoxPos] = useState({ top: 0, left: 0 })

//   const textareaRef = useRef()

//   const { user, users } = useAuth()
//   const { AddPost } = usePost()
//   const { communities } = useCommunity()

//   // ---------- Text & Mention Handling ----------
//   const handleTextareaChange = (e) => {
//     const value = e.target.value
//     const cursorPos = e.target.selectionStart
//     setPostText(value)
//     setCursorPosition(cursorPos)

//     if (value.length <= 500) setErrorText(false)

//     const textUntilCursor = value.slice(0, cursorPos)
//     const match = textUntilCursor.match(/@([\w\u0600-\u06FF]*)$/)

//     if (match) {
//       const query = match[1].toLowerCase()
//       setMentionQuery(query)
//       setShowMentionBox(true)
//     } else {
//       setShowMentionBox(false)
//     }
//   }

//   const handleSelectMention = (mention) => {
//     const beforeCursor = postText.slice(0, cursorPosition)
//     const afterCursor = postText.slice(cursorPosition)
//     const match = beforeCursor.match(/@([\w\u0600-\u06FF]*)$/)

//     if (!match) return

//     const startIdx = match.index
//     const newText =
//       beforeCursor.slice(0, startIdx) +
//       `@${mention.username} ` +
//       afterCursor

//     setPostText(newText)

//     setTimeout(() => {
//       const newPos = startIdx + mention.username.length + 2
//       textareaRef.current.focus()
//       textareaRef.current.selectionStart = newPos
//       textareaRef.current.selectionEnd = newPos
//     }, 0)

//     setSelectedMentions((prev) =>
//       prev.some((m) => m._id === mention._id)
//         ? prev
//         : [...prev, mention]
//     )

//     setShowMentionBox(false)
//     setMentionQuery('')
//   }

//   // ---------- Caret Position ----------
//   function getCaretCoordinates(element, position) {
//     const div = document.createElement('div')
//     const style = getComputedStyle(element)
//     for (const prop of style) div.style[prop] = style[prop]
//     div.style.position = 'absolute'
//     div.style.visibility = 'hidden'
//     div.style.whiteSpace = 'pre-wrap'
//     div.textContent = element.value.substring(0, position)
//     const span = document.createElement('span')
//     span.textContent = element.value.substring(position) || '.'
//     div.appendChild(span)
//     document.body.appendChild(div)
//     const { offsetTop: top, offsetLeft: left } = span
//     document.body.removeChild(div)
//     return { top, left }
//   }

//   // useEffect(() => {
//   //   if (showMentionBox && textareaRef.current) {
//   //     const textarea = textareaRef.current
//   //     const { top, left } = getCaretCoordinates(textarea, textarea.selectionStart)
//   //     const rect = textarea.getBoundingClientRect()
//   //     setMentionBoxPos({
//   //       top: rect.top + window.scrollY + top + 25,
//   //       left: rect.left + window.scrollX + left,
//   //     })
//   //   }
//   // }, [showMentionBox, postText, cursorPosition])

//   useEffect(() => {
//     if (showMentionBox && textareaRef.current) {
//       const textarea = textareaRef.current;
//       const { top, left } = getCaretCoordinates(textarea, textarea.selectionStart);
//       const rect = textarea.getBoundingClientRect();
//       const boxWidth = 256; // نفس w-64 (64 * 4px)
//       const boxHeight = 224; // نفس max-h-56 (56 * 4px)

//       let finalTop = rect.top + window.scrollY + top + 25;
//       let finalLeft = rect.left + window.scrollX + left;

//       // لو خرج يمين الشاشة، نحركه لليسار
//       if (finalLeft + boxWidth > window.innerWidth) {
//         finalLeft = window.innerWidth - boxWidth - 16; // 16px مسافة أمان
//       }

//       // لو خرج أسفل الصفحة، نحطه فوق المؤشر بدل تحته
//       if (finalTop + boxHeight > window.scrollY + window.innerHeight) {
//         finalTop = rect.top + window.scrollY + top - boxHeight - 10;
//       }

//       setMentionBoxPos({ top: finalTop, left: finalLeft });
//     }
//   }, [showMentionBox, postText, cursorPosition]);


//   // ---------- Links ----------
//   const handleAddLink = () => {
//     const url = linkInput.trim()
//     if (!url) return
//     const pattern = /^(https?:\/\/)/i
//     const formattedUrl = pattern.test(url) ? url : `https://${url}`
//     setLinks((prev) => [...prev, formattedUrl])
//     setLinkInput('')
//   }

//   const handleRemoveLink = (index) => {
//     setLinks((prev) => prev.filter((_, i) => i !== index))
//   }

//   // ---------- Images ----------
//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files)
//     const previews = files.map((file) => ({
//       file,
//       url: URL.createObjectURL(file),
//     }))
//     setImages((prev) => [...prev, ...previews])
//   }

//   const removeImage = (index) => {
//     setImages((prev) => {
//       URL.revokeObjectURL(prev[index].url)
//       return prev.filter((_, i) => i !== index)
//     })
//   }

//   // ---------- Emojis ----------
//   const handleEmojiClick = (emojiData) => {
//     const cursorPos = textareaRef.current.selectionStart
//     const newText =
//       postText.slice(0, cursorPos) + emojiData.emoji + postText.slice(cursorPos)
//     setPostText(newText)
//     setShowEmojiPicker(false)
//     setTimeout(() => {
//       textareaRef.current.focus()
//       textareaRef.current.selectionEnd = cursorPos + emojiData.emoji.length
//     }, 0)
//   }

//   // ---------- Hashtags ----------
//   const extractHashtags = (text) => {
//     const matches = text.match(/#[\w\u0600-\u06FF]+/g)
//     return matches
//       ? Array.from(new Set(matches.map((tag) => tag.slice(1).toLowerCase())))
//       : []
//   }

//   // ---------- Post Submission ----------
//   const handlePost = async () => {
//     const hashtags = extractHashtags(postText)
//     if (postText.trim().length > 500) {
//       setErrorText(true)
//       return
//     }
//     if (!postText.trim() && images.length === 0) return

//     const scheduleTime = scheduleEnabled && scheduleDate ? scheduleDate : null
//     setLoading(true)
//     try {
//       await AddPost(
//         postText.replace(/#[\w\u0600-\u06FF]+/g, '').trim(),
//         images,
//         hashtags,
//         selectedCommunity,
//         selectedMentions.map((u) => u._id),
//         scheduleTime,
//         links,
//         privacy
//       )
//     } finally {
//       setLoading(false)
//       setLinks([])
//       setPostText('')
//       setImages([])
//       setSelectedMentions([])
//       setScheduleEnabled(false)
//       setScheduleDate('')
//     }
//   }

//   // ---------- Sync user ----------
//   useEffect(() => {
//     const matchedUser = users?.find((u) => user?._id === u?._id)
//     setSelectedUser(matchedUser || user || {})
//   }, [users, user])

//   const filteredUsers =
//     users?.filter(
//       (u) =>
//         mentionQuery &&
//         (u.username?.toLowerCase().includes(mentionQuery.toLowerCase()) ||
//           u.profileName?.toLowerCase().includes(mentionQuery.toLowerCase())) &&
//         u._id !== user._id
//     ) || []

//   // ---------- Render ----------
//   return (
//     <NewPostPresenter
//       {...{
//         postText,
//         setPostText,
//         images,
//         setImages,
//         selectedCommunity,
//         setSelectedCommunity,
//         showEmojiPicker,
//         setShowEmojiPicker,
//         errorText,
//         selectedUser,
//         selectedMentions,
//         privacy,
//         setPrivacy,
//         scheduleEnabled,
//         setScheduleEnabled,
//         scheduleDate,
//         setScheduleDate,
//         loading,
//         links,
//         linkInput,
//         setLinkInput,
//         handleTextareaChange,
//         handleSelectMention,
//         handleAddLink,
//         handleRemoveLink,
//         handleImageChange,
//         removeImage,
//         handleEmojiClick,
//         handlePost,
//         communities,
//         showMentionBox,
//         filteredUsers,
//         mentionBoxPos,
//         textareaRef,
//       }}
//     />
//   )
// }

// export default NewPostContainer

'use client'

import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
  Suspense,
} from 'react'
import { useAuth } from '@/app/Context/AuthContext'
import { usePost } from '@/app/Context/PostContext'
import { useCommunity } from '@/app/Context/CommunityContext'
import Loading from '@/app/Component/Loading'

// ✅ Lazy Load لتقليل وقت تحميل الصفحة الأولى
const NewPostPresenter = React.lazy(() => import('./Design'))

const NewPostContainer = () => {
  const [postText, setPostText] = useState('')
  const [images, setImages] = useState([])
  const [selectedCommunity, setSelectedCommunity] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [errorText, setErrorText] = useState(false)
  const [selectedUser, setSelectedUser] = useState({})
  const [selectedMentions, setSelectedMentions] = useState([])
  const [privacy, setPrivacy] = useState('public')
  const [scheduleEnabled, setScheduleEnabled] = useState(false)
  const [scheduleDate, setScheduleDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [links, setLinks] = useState([])
  const [linkInput, setLinkInput] = useState('')
  const [cursorPosition, setCursorPosition] = useState(0)
  const [mentionQuery, setMentionQuery] = useState('')
  const [showMentionBox, setShowMentionBox] = useState(false)
  const [mentionBoxPos, setMentionBoxPos] = useState({ top: 0, left: 0 })

  const textareaRef = useRef(null)

  const { user, users } = useAuth()
  const { AddPost } = usePost()
  const { communities } = useCommunity()

  /* ------------------------- 🧠 Memoized helpers ------------------------- */

  const getCaretCoordinates = useCallback((element, position) => {
    const div = document.createElement('div')
    const style = getComputedStyle(element)
    for (const prop of style) div.style[prop] = style[prop]
    div.style.position = 'absolute'
    div.style.visibility = 'hidden'
    div.style.whiteSpace = 'pre-wrap'
    div.textContent = element.value.substring(0, position)
    const span = document.createElement('span')
    span.textContent = element.value.substring(position) || '.'
    div.appendChild(span)
    document.body.appendChild(div)
    const { offsetTop: top, offsetLeft: left } = span
    document.body.removeChild(div)
    return { top, left }
  }, [])

  /* ------------------------- ✍️ Textarea & Mentions ------------------------- */
  const handleTextareaChange = useCallback((e) => {
    const value = e.target.value
    const cursorPos = e.target.selectionStart
    setPostText(value)
    setCursorPosition(cursorPos)

    if (value.length <= 500) setErrorText(false)

    const textUntilCursor = value.slice(0, cursorPos)
    const match = textUntilCursor.match(/@([\w\u0600-\u06FF]*)$/)

    if (match) {
      setMentionQuery(match[1].toLowerCase())
      setShowMentionBox(true)
    } else {
      setShowMentionBox(false)
    }
  }, [])

  const handleSelectMention = useCallback(
    (mention) => {
      const beforeCursor = postText.slice(0, cursorPosition)
      const afterCursor = postText.slice(cursorPosition)
      const match = beforeCursor.match(/@([\w\u0600-\u06FF]*)$/)
      if (!match) return

      const startIdx = match.index
      const newText =
        beforeCursor.slice(0, startIdx) + `@${mention.username} ` + afterCursor

      setPostText(newText)

      requestAnimationFrame(() => {
        const newPos = startIdx + mention.username.length + 2
        if (textareaRef.current) {
          textareaRef.current.focus()
          textareaRef.current.selectionStart = newPos
          textareaRef.current.selectionEnd = newPos
        }
      })

      setSelectedMentions((prev) =>
        prev.some((m) => m._id === mention._id)
          ? prev
          : [...prev, mention]
      )

      setShowMentionBox(false)
      setMentionQuery('')
    },
    [cursorPosition, postText]
  )

  /* ------------------------- 📍 Mention Box Position ------------------------- */
  useEffect(() => {
    if (showMentionBox && textareaRef.current) {
      const textarea = textareaRef.current
      const { top, left } = getCaretCoordinates(
        textarea,
        textarea.selectionStart
      )

      // We only need the offsets relative to the textarea's top-left
      // the parent in Design.jsx is relative, so these offsets will work perfectly.
      setMentionBoxPos({ top, left })
    }
  }, [showMentionBox, postText, cursorPosition, getCaretCoordinates])

  /* ------------------------- 🔗 Links ------------------------- */
  const handleAddLink = useCallback(() => {
    const url = linkInput.trim()
    if (!url) return
    const formattedUrl = /^(https?:\/\/)/i.test(url) ? url : `https://${url}`
    setLinks((prev) => [...prev, formattedUrl])
    setLinkInput('')
  }, [linkInput])

  const handleRemoveLink = useCallback(
    (index) => setLinks((prev) => prev.filter((_, i) => i !== index)),
    []
  )

  /* ------------------------- 🖼️ Images ------------------------- */
  const handleImageChange = useCallback((e) => {
    const files = Array.from(e.target.files)
    const previews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }))
    setImages((prev) => [...prev, ...previews])
  }, [])

  const removeImage = useCallback((index) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].url)
      return prev.filter((_, i) => i !== index)
    })
  }, [])

  /* ------------------------- 😀 Emojis ------------------------- */
  const handleEmojiClick = useCallback(
    (emojiData) => {
      const cursorPos = textareaRef.current?.selectionStart || 0
      const newText =
        postText.slice(0, cursorPos) +
        emojiData.emoji +
        postText.slice(cursorPos)
      setPostText(newText)
      setShowEmojiPicker(false)
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.focus()
          textareaRef.current.selectionEnd =
            cursorPos + emojiData.emoji.length
        }
      })
    },
    [postText]
  )

  /* ------------------------- 🏷️ Hashtags ------------------------- */
  const extractHashtags = useCallback((text) => {
    const matches = text.match(/#[\w\u0600-\u06FF]+/g)
    return matches
      ? [...new Set(matches.map((tag) => tag.slice(1).toLowerCase()))]
      : []
  }, [])

  /* ------------------------- 🚀 Submit Post ------------------------- */
  const handlePost = useCallback(async () => {
    const hashtags = extractHashtags(postText)
    if (postText.trim().length > 500) return setErrorText(true)
    if (!postText.trim() && images.length === 0) return

    const scheduleTime =
      scheduleEnabled && scheduleDate ? scheduleDate : null

    setLoading(true)
    try {
      await AddPost(
        postText.replace(/#[\w\u0600-\u06FF]+/g, '').trim(),
        images,
        hashtags,
        selectedCommunity,
        selectedMentions.map((u) => u._id),
        scheduleTime,
        links,
        privacy
      )
    } finally {
      setLoading(false)
      setLinks([])
      setPostText('')
      setImages([])
      setSelectedMentions([])
      setScheduleEnabled(false)
      setScheduleDate('')
    }
  }, [
    postText,
    images,
    selectedCommunity,
    selectedMentions,
    scheduleEnabled,
    scheduleDate,
    links,
    privacy,
    AddPost,
    extractHashtags,
  ])

  /* ------------------------- 👤 Sync Current User ------------------------- */
  useEffect(() => {
    setSelectedUser(users?.find((u) => u?._id === user?._id) || user || {})
  }, [users, user])

  /* ------------------------- 🧩 Filtered Users ------------------------- */
  const filteredUsers = useMemo(() => {
    if (!mentionQuery || !users) return []
    return users.filter(
      (u) =>
        (u.username?.toLowerCase().includes(mentionQuery.toLowerCase()) ||
          u.profileName?.toLowerCase().includes(mentionQuery.toLowerCase())) &&
        u._id !== user._id
    )
  }, [mentionQuery, users, user?._id])

  /* ------------------------- 🧱 Render ------------------------- */
  return (
    <Suspense
      fallback={
        <div className="p-4 text-gray-400 animate-pulse text-center">
          <Loading />
        </div>
      }
    >
      <NewPostPresenter
        {...{
          postText,
          setPostText,
          images,
          setImages,
          selectedCommunity,
          setSelectedCommunity,
          showEmojiPicker,
          setShowEmojiPicker,
          errorText,
          selectedUser,
          selectedMentions,
          privacy,
          setPrivacy,
          scheduleEnabled,
          setScheduleEnabled,
          scheduleDate,
          setScheduleDate,
          loading,
          links,
          linkInput,
          setLinkInput,
          handleTextareaChange,
          handleSelectMention,
          handleAddLink,
          handleRemoveLink,
          handleImageChange,
          removeImage,
          handleEmojiClick,
          handlePost,
          communities,
          showMentionBox,
          filteredUsers,
          mentionBoxPos,
          textareaRef,
        }}
      />
    </Suspense>
  )
}

export default React.memo(NewPostContainer)
