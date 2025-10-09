
'use client';

import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { usePost } from '../../Context/PostContext';
import { useCommunity } from '../../Context/CommunityContext';
import { useAuth } from '../../Context/AuthContext';
import DesignPost from './Design';
import { MentionsInput, Mention } from 'react-mentions';
const NewPost = () => {
  const [postText, setPostText] = useState('');
  const [images, setImages] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [errorText, setErrorText] = useState(false);
  const [selectedUser , setSelectedUser] = useState({});
  const [mentions, setMentions] = useState([]); // 🟢 حفظ IDs للمستخدمين المذكورين
  const [mentionsSelected , setMentionsSelected] = useState()
  // 🕓 حالات الجدولة الجديدة
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');

  const textareaRef = useRef();
  const { user ,users } = useAuth();
  const { AddPost } = usePost();
  const { communities } = useCommunity();
  const [links, setLinks] = useState([]); // 🟢 state للروابط
  const [linkInput, setLinkInput] = useState(''); // 🟢 حقل إدخال رابط جديد
  const myFollowing = selectedUser?.following || [];
  const handleTextareaChange = (e) => {
    const value = e.target.value;
    setPostText(value);
    if (value.length <= 500) setErrorText(false);
  };
// ---- إضافة رابط جديد ----
  const handleAddLink = () => {
    const url = linkInput.trim();
    if (!url) return;

    // التحقق من شكل الرابط
    const pattern = /^(https?:\/\/)/i;
    const formattedUrl = pattern.test(url) ? url : `https://${url}`;

    setLinks(prev => [...prev, formattedUrl]);
    setLinkInput('');
  };

  // ---- إزالة رابط ----
  const handleRemoveLink = (index) => {
    setLinks(prev => prev.filter((_, i) => i !== index));
  };
  useEffect(() => {
    const matchedUser = users?.find((u) => user?._id === u?._id)
    setSelectedUser(matchedUser || user || {})
  }, [users, user])


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
      scheduleTime ,
      links
    );
    setLinks([]);
    setPostText('');
    setImages([]);
    setSelectedMentions([]);
    setScheduleEnabled(false);
    setScheduleDate('');
  };
  const MentionInputBox = () => (
    <MentionsInput
      value={postText}
      onChange={(e) => setPostText(e.target.value)}
      className="mentions-input w-full rounded-2xl p-4 bg-gray-50 dark:bg-darkMode-bg text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
      placeholder="What's on your mind? Add #hashtags or @mentions..."
      style={{
        control: {
          fontSize: 16,
          fontWeight: '400',
          backgroundColor: 'transparent',
        },
        highlighter: {
          overflow: 'hidden',
        },
        input: {
          margin: 0,
        },
      }}
    >
      <Mention
        trigger="@"
        data={myFollowing.map((u) => ({
          id: u._id,
          display: u.username,
        }))}
        style={{ color: '#4F46E5', fontWeight: 600 }}
        onAdd={(id) => setMentions((prev) => [...new Set([...prev, id])])}
      />
    </MentionsInput>
  );
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
      textareaRef={textareaRef}
      handleTextareaChange={handleTextareaChange}
      errorText={errorText}
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
      links={links}
      setLinks={setLinks}
      linkInput={linkInput}
      setLinkInput={setLinkInput}
      handleAddLink={handleAddLink}
      handleRemoveLink={handleRemoveLink}
      MentionInputBox={MentionInputBox} // 🟢 تمرير مكون الإدخال
    />
  );
};

export default NewPost;
