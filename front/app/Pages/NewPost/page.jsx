'use client';

import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
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
  const [mentions, setMentions] = useState([])
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
  // ------------------- Mentions -------------------
  const [mentionSearch, setMentionSearch] = useState('');
  const [showMentionList, setShowMentionList] = useState(false);
  const [selectedMentions, setSelectedMentions] = useState([]);
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 });
  const myFollowing = selectedUser?.following || [];

  const filteredMentions = myFollowing.filter(f =>
    f?.username?.toLowerCase().includes(mentionSearch.toLowerCase())
  );

  const handleTextareaChange = (e) => {
    const value = e.target.value;
    setPostText(value);
    if (value.length <= 500) setErrorText(false);

    // 🟢 اكتشاف إذا كتب @
    const lastWord = value.split(/\s+/).pop();
    if (lastWord.startsWith('@')) {
      setMentionSearch(lastWord.slice(1));
      setShowMentionList(true);
    } else {
      setShowMentionList(false);
    }
  };

  const selectMention = (user) => {
    setSelectedMentions(prev => [...prev, user]);
    setShowMentionList(false);

    // 🟢 نضيف المنشن داخل النص
    const cursorPos = textareaRef.current.selectionStart;
    const newText =
      postText.slice(0, cursorPos).replace(/@\w*$/, `@${user.username} `) +
      postText.slice(cursorPos);
    setPostText(newText);
  };

  const removeMention = (index) => {
    setSelectedMentions(prev => prev.filter((_, i) => i !== index));
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
      // ========= Mentions
      selectedMentions={selectedMentions}
      setSelectedMentions={setSelectedMentions}
      mentionSearch={mentionSearch}
      setMentionSearch={setMentionSearch}
      showMentionList={showMentionList}
      setShowMentionList={setShowMentionList}
      filteredMentions={filteredMentions}
      selectMention={selectMention}
      removeMention={removeMention}
      mentionPosition={mentionPosition}
      // ==========
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
    />
  );
};

export default NewPost;
