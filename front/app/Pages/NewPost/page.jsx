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
import { useMusic } from '@/app/Context/MusicContext'
import Loading from '@/app/Component/Loading'

// ✅ Lazy Load لتقليل وقت تحميل الصفحة الأولى
const NewPostPresenter = React.lazy(() => import('./Design'))

/**
 * NewPostContainer handles the business logic for creating a new post.
 * It manages state for text, media, mentions, scheduling, and music.
 */
const NewPostContainer = () => {
  const [postText, setPostText] = useState('')
  const [media, setMedia] = useState([])
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
  const [selectedMusic, setSelectedMusic] = useState(null)

  const textareaRef = useRef(null)

  const { user, users } = useAuth()
  const { AddPost } = usePost()
  const { communities } = useCommunity()
  const { music: musicList, isLoading: isMusicLoading } = useMusic() || { music: [], isLoading: false }

  /* ------------------------- 🧠 Helpers ------------------------- */

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

  /* ------------------------- ✍️ Handlers ------------------------- */

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
        prev.some((m) => m._id === mention._id) ? prev : [...prev, mention]
      )

      setShowMentionBox(false)
      setMentionQuery('')
    },
    [cursorPosition, postText]
  )

  useEffect(() => {
    if (showMentionBox && textareaRef.current) {
      const { top, left } = getCaretCoordinates(textareaRef.current, textareaRef.current.selectionStart)
      setMentionBoxPos({ top, left })
    }
  }, [showMentionBox, postText, cursorPosition, getCaretCoordinates])

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

  const handleMediaChange = useCallback((e) => {
    const files = Array.from(e.target.files)
    const previews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      type: file.type.startsWith('video') ? 'video' : 'image'
    }))
    setMedia((prev) => [...prev, ...previews])
  }, [])

  const removeMedia = useCallback((index) => {
    setMedia((prev) => {
      URL.revokeObjectURL(prev[index].url)
      return prev.filter((_, i) => i !== index)
    })
  }, [])

  const handleEmojiClick = useCallback(
    (emojiData) => {
      const cursorPos = textareaRef.current?.selectionStart || 0
      const newText = postText.slice(0, cursorPos) + emojiData.emoji + postText.slice(cursorPos)
      setPostText(newText)
      setShowEmojiPicker(false)
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.focus()
          textareaRef.current.selectionEnd = cursorPos + emojiData.emoji.length
        }
      })
    },
    [postText]
  )

  const extractHashtags = useCallback((text) => {
    const matches = text.match(/#[\w\u0600-\u06FF]+/g)
    return matches ? [...new Set(matches.map((tag) => tag.slice(1).toLowerCase()))] : []
  }, [])

  const handlePost = useCallback(async () => {
    const hashtags = extractHashtags(postText)
    if (postText.trim().length > 500) return setErrorText(true)
    if (!postText.trim() && media.length === 0) return

    const scheduleTime = scheduleEnabled && scheduleDate ? scheduleDate : null

    setLoading(true)
    try {
      await AddPost(
        postText.replace(/#[\w\u0600-\u06FF]+/g, '').trim(),
        media,
        hashtags,
        selectedCommunity,
        selectedMentions.map((u) => u._id),
        scheduleTime,
        links,
        privacy,
        selectedMusic?._id
      )
    } finally {
      setLoading(false)
      setLinks([])
      setPostText('')
      setMedia([])
      setSelectedMentions([])
      setScheduleEnabled(false)
      setScheduleDate('')
      setSelectedMusic(null)
    }
  }, [
    postText,
    media,
    selectedCommunity,
    selectedMentions,
    scheduleEnabled,
    scheduleDate,
    links,
    privacy,
    selectedMusic,
    AddPost,
    extractHashtags,
  ])

  useEffect(() => {
    setSelectedUser(users?.find((u) => u?._id === user?._id) || user || {})
  }, [users, user])

  const filteredUsers = useMemo(() => {
    if (!mentionQuery || !users) return []
    return users.filter(
      (u) =>
        (u.username?.toLowerCase().includes(mentionQuery.toLowerCase()) ||
          u.profileName?.toLowerCase().includes(mentionQuery.toLowerCase())) &&
        u._id !== user._id
    )
  }, [mentionQuery, users, user?._id])

  return (
    <Suspense fallback={<Loading />}>
      <NewPostPresenter
        {...{
          postText,
          setPostText,
          media,
          setMedia,
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
          handleMediaChange,
          removeMedia,
          handleEmojiClick,
          handlePost,
          communities,
          showMentionBox,
          filteredUsers,
          mentionBoxPos,
          textareaRef,
          selectedMusic,
          setSelectedMusic,
          musicList,
          isMusicLoading
        }}
      />
    </Suspense>
  )
}

export default React.memo(NewPostContainer)
