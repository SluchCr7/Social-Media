
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
import { useFeedback } from '@/app/Context/FeedbackContext'
import api from '@/app/utils/api'
import Loading from '@/app/Component/Loading'

// ✅ Lazy Load لتقليل وقت تحميل الصفحة الأولى
const NewPostPresenter = React.lazy(() => import('./Design'))

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
  const [activeMentionIndex, setActiveMentionIndex] = useState(0)
  const [filteredUsers, setFilteredUsers] = useState([])
  const [isSearchingUsers, setIsSearchingUsers] = useState(false)

  const textareaRef = useRef(null)

  const { user } = useAuth()
  const { AddPost } = usePost()
  const { communities } = useCommunity()
  const { music: musicList, isLoading: isMusicLoading } = useMusic() || { music: [], isLoading: false }
  const { showToast } = useFeedback()

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
      setActiveMentionIndex(0)
    },
    [cursorPosition, postText]
  )

  /* ------------------------- 🧩 Mentions Search Logic ------------------------- */
  useEffect(() => {
    const searchUsers = async () => {
      if (!mentionQuery) {
        setFilteredUsers([])
        return
      }

      setIsSearchingUsers(true)
      try {
        const res = await api.get(`/search?q=${mentionQuery}`)
        const users = res.data?.users || []
        setFilteredUsers(users.filter(u => u._id !== user?._id))
      } catch (err) {
        console.error('Mention search error:', err)
      } finally {
        setIsSearchingUsers(false)
      }
    }

    const timer = setTimeout(searchUsers, 300)
    return () => clearTimeout(timer)
  }, [mentionQuery, user?._id])

  // Sync selectedMentions with current text
  useEffect(() => {
    if (selectedMentions.length === 0) return
    const currentMentions = selectedMentions.filter(m =>
      postText.includes(`@${m.username}`)
    )
    if (currentMentions.length !== selectedMentions.length) {
      setSelectedMentions(currentMentions)
    }
  }, [postText, selectedMentions])

  const handleKeyDown = useCallback(
    (e) => {
      if (!showMentionBox || filteredUsers.length === 0) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveMentionIndex((prev) => (prev + 1) % filteredUsers.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveMentionIndex((prev) => (prev - 1 + filteredUsers.length) % filteredUsers.length)
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault()
        handleSelectMention(filteredUsers[activeMentionIndex])
      } else if (e.key === 'Escape') {
        setShowMentionBox(false)
      }
    },
    [showMentionBox, filteredUsers, activeMentionIndex, handleSelectMention]
  )

  /* ------------------------- 📍 Mention Box Position ------------------------- */
  useEffect(() => {
    if (showMentionBox && textareaRef.current) {
      const textarea = textareaRef.current;
      const { selectionStart } = textarea;

      // Use requestAnimationFrame for smoother positioning after layout
      const updatePos = () => {
        const { top, left } = getCaretCoordinates(textarea, selectionStart);
        setMentionBoxPos({ top, left });
      };

      const frameId = requestAnimationFrame(updatePos);
      return () => cancelAnimationFrame(frameId);
    }
  }, [showMentionBox, postText, cursorPosition, getCaretCoordinates]);

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

  /* ------------------------- 🖼️ Media (Images/Videos) ------------------------- */
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
    if (!postText.trim() && media.length === 0) return

    const scheduleTime =
      scheduleEnabled && scheduleDate ? scheduleDate : null

    setLoading(true)
    try {
      await AddPost(
        postText.trim(),
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

  /* ------------------------- 💾 Draft Handling ------------------------- */
  const handleSaveDraft = useCallback(() => {
    try {
      const draft = { postText, links, privacy, selectedCommunity }
      localStorage.setItem('post_draft', JSON.stringify(draft))
      showToast('Draft saved successfully locally!', 'success')
    } catch (err) {
      showToast('Failed to save draft.', 'error')
    }
  }, [postText, links, privacy, selectedCommunity, showToast])

  /* ------------------------- 👤 Sync Current User ------------------------- */
  useEffect(() => {
    setSelectedUser(users?.find((u) => u?._id === user?._id) || user || {})
  }, [users, user])


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
          handleSaveDraft,
          communities,
          showMentionBox,
          filteredUsers,
          activeMentionIndex,
          mentionBoxPos,
          textareaRef,
          handleKeyDown,
          selectedMusic,
          setSelectedMusic,
          musicList,
          isMusicLoading,
          isSearchingUsers
        }}
      />
    </Suspense>
  )
}

export default React.memo(NewPostContainer)
