'use client';

import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { IoImage, IoHappyOutline } from 'react-icons/io5';
import { FiX } from 'react-icons/fi';
import { FaUsers } from 'react-icons/fa';
import EmojiPicker from 'emoji-picker-react';
import { usePost } from '../../Context/PostContext';
import { useCommunity } from '../../Context/CommunityContext';
import { useAuth } from '../../Context/AuthContext';
import DesignPost from './Design';

const NewPost = () => {
  const [postText, setPostText] = useState('');
  const [images, setImages] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [errorText, setErrorText] = useState(false);
  const [selectedUser , setSelectedUser] = useState({});
  const [selectedMentions, setSelectedMentions] = useState([]);
  const [mentionSearch, setMentionSearch] = useState('');
  const [showMentionList, setShowMentionList] = useState(false);

  // 🕓 حالات الجدولة الجديدة
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');

  const textareaRef = useRef();
  const { user ,users } = useAuth();
  const { AddPost } = usePost();
  const { communities } = useCommunity();

  useEffect(() => {
    const matchedUser = users?.find((u) => user?._id === u?._id)
    setSelectedUser(matchedUser || user || {})
  }, [users, user])

  const myFollowing = selectedUser?.following || [];

  // ------------------- Image Upload -------------------
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map(file => ({ file, url: URL.createObjectURL(file) }));
    setImages(prev => [...prev, ...previews]);
  };

  const removeImage = (index) => {
    setImages(prev => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  };

  // ------------------- Hashtags -------------------
  const extractHashtags = (text) => {
    const matches = text.match(/#[\w\u0600-\u06FF]+/g);
    return matches ? Array.from(new Set(matches.map(tag => tag.slice(1).toLowerCase()))) : [];
  };

  // ------------------- Mentions Handling -------------------
  const handleTextareaChange = (e) => {
 const value = e.target.value;
  setPostText(value);
  if (value.length <= 500) setErrorText(false);

  const cursorPos = e.target.selectionStart;
  const lastAt = value.lastIndexOf('@', cursorPos - 1);

  if (lastAt >= 0) {
    const wordAfterAt = value.slice(lastAt + 1, cursorPos);

    // ✅ التعديل هنا: عرض القائمة حتى لو ما كتبش ولا حرف بعد @
    if (!wordAfterAt.includes(' ')) {
      setMentionSearch(wordAfterAt);
      setShowMentionList(true);
    } else {
      setShowMentionList(false);
    }
  } else {
    setShowMentionList(false);
  }
  };

  const filteredMentions = myFollowing.filter(u => {
    if (!u || typeof u?.username !== 'string') return false;
    const notAlreadySelected = !selectedMentions.some(m => m?._id === u?._id);

    // ✅ لو المستخدم كتب فقط @ يظهر كل من يتابعه
    if (!mentionSearch) return notAlreadySelected;

    const usernameMatch = u.username.toLowerCase().includes(mentionSearch.toLowerCase());
    return usernameMatch && notAlreadySelected;
  });


  const selectMention = (user) => {
    if (!user || typeof user.username !== 'string') return;

    const cursorPos = textareaRef.current.selectionStart;
    const textBeforeCursor = postText.slice(0, cursorPos);
    const lastAt = textBeforeCursor.lastIndexOf('@');
    const textAfterCursor = postText.slice(cursorPos);

    const newText =
      textBeforeCursor.slice(0, lastAt) +
      `@${user.username} ` +
      textAfterCursor;

    setPostText(newText);
    setSelectedMentions(prev => [...prev, user]);
    setShowMentionList(false);

    setTimeout(() => {
      textareaRef.current.focus();
      textareaRef.current.selectionStart = textareaRef.current.selectionEnd = lastAt + user.username.length + 2;
    }, 0);
  };

  // ------------------- Emoji Picker -------------------
  const handleEmojiClick = (emojiData) => {
    const cursorPos = textareaRef.current.selectionStart;
    const newText =
      postText.slice(0, cursorPos) + emojiData.emoji + postText.slice(cursorPos);
    setPostText(newText);
    setShowEmojiPicker(false);
    setTimeout(() => {
      textareaRef.current.focus();
      textareaRef.current.selectionEnd = cursorPos + emojiData.emoji.length;
    }, 0);
  };

  // ------------------- Post Submission -------------------
  const handlePost = () => {
    const hashtags = extractHashtags(postText);

    if (postText.trim().length > 500) {
      setErrorText(true);
      return;
    }

    if (!postText.trim() && images.length === 0) return;

    // 🕓 منطق الجدولة
    const scheduleTime = scheduleEnabled && scheduleDate ? scheduleDate : null;

    AddPost(
      postText.replace(/#[\w\u0600-\u06FF]+/g, '').trim(),
      images,
      hashtags,
      selectedCommunity,
      selectedMentions.map(u => u._id),
      scheduleTime // <-- إرسال وقت الجدولة هنا
    );

    setPostText('');
    setImages([]);
    setSelectedMentions([]);
    setScheduleEnabled(false);
    setScheduleDate('');
  };

  // ------------------- Highlight Text -------------------
  const renderHighlightedText = (text) => {
    return text.split(/(\s+)/).map((part, idx) => {
      if (part.startsWith('@')) {
        return <span key={idx} className="text-blue-500 font-semibold">{part}</span>;
      }
      if (part.startsWith('#')) {
        return <span key={idx} className="text-purple-600 font-semibold">{part}</span>;
      }
      return part;
    });
  };

  return (
    <DesignPost
      user={selectedUser}
      communities={communities}
      selectedCommunity={selectedCommunity}
      setSelectedCommunity={setSelectedCommunity}
      renderHighlightedText={renderHighlightedText}
      postText={postText}
      setPostText={setPostText}
      images={images}
      setImages={setImages}
      selectedMentions={selectedMentions}
      setSelectedMentions={setSelectedMentions}
      mentionSearch={mentionSearch}
      setMentionSearch={setMentionSearch}
      showMentionList={showMentionList}
      setShowMentionList={setShowMentionList}
      textareaRef={textareaRef}
      handleTextareaChange={handleTextareaChange}
      errorText={errorText}
      filteredMentions={filteredMentions}
      selectMention={selectMention}
      removeImage={removeImage}
      handleImageChange={handleImageChange}
      showEmojiPicker={showEmojiPicker}
      setShowEmojiPicker={setShowEmojiPicker}
      handleEmojiClick={handleEmojiClick}
      handlePost={handlePost}
      // 🕓 تمرير حالات الجدولة للمكون
      scheduleEnabled={scheduleEnabled}
      setScheduleEnabled={setScheduleEnabled}
      scheduleDate={scheduleDate}
      setScheduleDate={setScheduleDate}
    />
  );
};

export default NewPost;
