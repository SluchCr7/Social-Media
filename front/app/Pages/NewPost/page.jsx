// 'use client';

// import Image from 'next/image';
// import React, { useRef, useState } from 'react';
// import { IoImage, IoHappyOutline } from 'react-icons/io5';
// import { FiX } from 'react-icons/fi';
// import { FaUsers } from 'react-icons/fa';
// import EmojiPicker from 'emoji-picker-react';
// import { usePost } from '../../Context/PostContext';
// import { useCommunity } from '../../Context/CommunityContext';
// import { useAuth } from '@/app/Context/AuthContext';

// const NewPost = () => {
//   const [postText, setPostText] = useState('');
//   const [images, setImages] = useState([]);
//   const [selectedCommunity, setSelectedCommunity] = useState('');
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const textareaRef = useRef();
//   const [errorText , setErrorText] = useState(false)
//   const { user } = useAuth();
//   const { AddPost } = usePost();
//   const { communities } = useCommunity();

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     const previews = files.map(file => ({ file, url: URL.createObjectURL(file) }));
//     setImages(prev => [...prev, ...previews]);
//   };

//   const removeImage = (index) => {
//     setImages(prev => {
//       URL.revokeObjectURL(prev[index].url);
//       return prev.filter((_, i) => i !== index);
//     });
//   };

//   const extractHashtags = (text) => {
//     const matches = text.match(/#[\w\u0600-\u06FF]+/g);
//     return matches ? Array.from(new Set(matches.map(tag => tag.slice(1).toLowerCase()))) : [];
//   };

//   const handlePost = () => {
//     const hashtags = extractHashtags(postText);

//     // ✅ شرط عدد الحروف
//     if (postText.trim().length > 500) {
//       // هنا تعمل action معين زي رسالة خطأ أو alert أو منع النشر
//       setErrorText(true)
//       return;
//     }
//     if (postText.trim()) {
//       AddPost(
//         postText.replace(/#[\w\u0600-\u06FF]+/g, '').trim(),
//         images,
//         hashtags,
//         selectedCommunity
//       );
//     }
//   };

//   const handleEmojiClick = (emojiData) => {
//     const cursorPos = textareaRef.current.selectionStart;
//     const newText =
//       postText.slice(0, cursorPos) + emojiData.emoji + postText.slice(cursorPos);
//     setPostText(newText);
//     setShowEmojiPicker(false);
//     setTimeout(() => {
//       textareaRef.current.focus();
//       textareaRef.current.selectionEnd = cursorPos + emojiData.emoji.length;
//     }, 0);
//   };

//   return (
//     <main className="flex items-center justify-center w-full py-10 px-4 bg-gray-50 dark:bg-darkMode-bg transition-colors">
//       <div className="w-full max-w-5xl mx-auto bg-white dark:bg-darkMode-fg rounded-3xl shadow-xl overflow-hidden transition-all duration-500">
        
//         {/* Header */}
//         <div className="flex flex-col md:flex-row md:items-center justify-between w-full p-6 border-b border-gray-200 dark:border-gray-700 gap-4">
//           <div className="flex items-center gap-4">
//             <Image
//               src={user?.profilePhoto?.url}
//               alt="profile"
//               width={56}
//               height={56}
//               className="rounded-full w-14 h-14 object-cover border-2 border-gradient-to-br from-blue-400 to-purple-600"
//             />
//             <div className="flex flex-col">
//               <h2 className="text-lg font-bold text-gray-800 dark:text-white">{user?.username}</h2>
//               <span className="text-sm text-gray-500 dark:text-gray-400">{user?.profileName}</span>
//             </div>
//           </div>

//           {/* Community Selector */}
//           <div className="w-full md:w-64 relative">
//             {communities.filter(com => com?.members.some(m => m._id === user._id)).length > 0 ? (
//               <div className="relative">
//                 <FaUsers className="absolute left-3 top-3 text-gray-400" />
//                 <select
//                   value={selectedCommunity}
//                   onChange={(e) => setSelectedCommunity(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-darkMode-bg border dark:border-gray-600 rounded-xl text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
//                 >
//                   <option value="">Select a Community</option>
//                   {communities
//                     .filter(com => com.members.some(m => m._id === user._id))
//                     .map((com) => (
//                       <option key={com._id} value={com._id}>
//                         {com.Name}
//                       </option>
//                     ))}
//                 </select>
//               </div>
//             ) : (
//               <span className="text-sm text-gray-500 dark:text-gray-400">You haven’t joined any communities.</span>
//             )}
//           </div>
//         </div>

//         {/* Textarea */}
//         <div className="relative p-6 pb-2">
//           <textarea
//             ref={textareaRef}
//             value={postText}
//             onChange={(e) => {
//               setPostText(e.target.value);
//               if (e.target.value.length <= 500) setErrorText(false); // تصفير الخطأ
//             }}
//             rows={5}
//             placeholder="What's on your mind? Add #hashtags or 😊 emojis..."
//             className={`w-full p-5 text-base rounded-2xl resize-none border shadow-inner focus:ring-2 transition-all duration-300
//               ${errorText 
//                 ? 'border-red-500 focus:ring-red-500 dark:border-red-500 dark:focus:ring-red-500' 
//                 : 'bg-gray-50 dark:bg-darkMode-bg text-black dark:text-white border-gray-300 dark:border-gray-600 focus:ring-blue-500'}`}
//           />
          
//           {/* Counter */}
//           <div className="flex justify-between items-center mt-1 text-xs">
//             <span className={`transition ${errorText ? 'text-red-500 font-semibold' : 'text-gray-400'}`}>
//               {postText.length}/500
//             </span>
//             {errorText && <span className="text-red-500">Max 500 characters allowed</span>}
//           </div>
//         </div>


//         {/* Images Preview */}
//         {images.length > 0 && (
//           <div className="grid grid-cols-2 md:grid-cols-3 gap-4 px-6 pb-4">
//             {images.map((img, idx) => (
//               <div key={idx} className="relative group rounded-xl overflow-hidden shadow-lg">
//                 <img
//                   src={img.url}
//                   alt={`preview-${idx}`}
//                   className="w-full h-32 object-cover rounded-xl transform group-hover:scale-105 transition-transform duration-300"
//                 />
//                 <button
//                   onClick={() => removeImage(idx)}
//                   className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full shadow hover:bg-red-600 transition"
//                 >
//                   <FiX size={16} />
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Footer */}
//         <div className="flex relative items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
//           <div className="flex items-center gap-3 relative">
//             <label className="cursor-pointer flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-darkMode-bg hover:bg-blue-100 dark:hover:bg-blue-800 text-gray-700 dark:text-gray-300 transition shadow-md">
//               <IoImage size={22} />
//               <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
//             </label>

//             <button
//               onClick={() => setShowEmojiPicker(!showEmojiPicker)}
//               className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-darkMode-bg hover:bg-yellow-100 dark:hover:bg-yellow-800 text-gray-600 dark:text-gray-300 transition shadow-md"
//             >
//               <IoHappyOutline size={22} />
//             </button>

//             {/* Emoji Picker Menu */}
//             {showEmojiPicker && (
//               <div className="absolute z-50 top-[-400px] left-6 w-[320px] rounded-2xl shadow-2xl overflow-hidden transition-transform duration-300 transform scale-95 animate-scale-up">
//                 {/* Header with close button */}
//                 <div className="flex justify-between items-center bg-gray-200 dark:bg-gray-700 px-3 py-2">
//                   <span className="text-gray-700 dark:text-gray-200 font-semibold">Emojis</span>
//                   <button
//                     onClick={() => setShowEmojiPicker(false)}
//                     className="text-gray-600 dark:text-gray-300 hover:text-red-500 transition"
//                   >
//                     <FiX size={18} />
//                   </button>
//                 </div>
//                 <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" height={300} />
//               </div>
//             )}
//           </div>

//           <button
//             onClick={handlePost}
//             disabled={(!postText.trim() && images.length === 0) || errorText} // ممنوع النشر مع الخطأ
//             className={`px-8 py-2 text-sm font-semibold rounded-full shadow-lg transition-all duration-300 ${
//               (!postText.trim() && images.length === 0) || errorText
//                 ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                 : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
//             }`}
//           >
//             Post
//           </button>

//         </div>
//       </div>
//     </main>
//   );
// };

// export default NewPost;

'use client';

import Image from 'next/image';
import React, { useRef, useState } from 'react';
import { IoImage, IoHappyOutline } from 'react-icons/io5';
import { FiX } from 'react-icons/fi';
import { FaUsers } from 'react-icons/fa';
import EmojiPicker from 'emoji-picker-react';
import { usePost } from '../../Context/PostContext';
import { useCommunity } from '../../Context/CommunityContext';
import { useAuth } from '@/app/Context/AuthContext';

const NewPost = () => {
  const [postText, setPostText] = useState('');
  const [images, setImages] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [errorText, setErrorText] = useState(false);

  const [selectedMentions, setSelectedMentions] = useState([]); // Mentions selected
  const [mentionSearch, setMentionSearch] = useState(''); // Current search after @
  const [showMentionList, setShowMentionList] = useState(false);

  const textareaRef = useRef();
  const { user } = useAuth();
  const { AddPost } = usePost();
  const { communities } = useCommunity();

  // Users you follow
  const myFollowing = user?.following || [];

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
// ------------------- Mentions Handling -------------------
const handleTextareaChange = (e) => {
  const value = e.target.value;
  setPostText(value);
  if (value.length <= 500) setErrorText(false);

  const cursorPos = e.target.selectionStart;
  const lastAt = value.lastIndexOf('@', cursorPos - 1);

  if (lastAt >= 0) {
    const wordAfterAt = value.slice(lastAt + 1, cursorPos);
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

// Filtered mentions safely
const filteredMentions = myFollowing.filter(u => {
  if (!u || typeof u?.username !== 'string') return false; // تجاهل أي عنصر غير صحيح
  const usernameMatch = u.username.toLowerCase().includes((mentionSearch || '').toLowerCase());
  const notAlreadySelected = !selectedMentions.some(m => m?._id === u?._id);
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

    if (postText.trim() || images.length > 0) {
      AddPost(
        postText.replace(/#[\w\u0600-\u06FF]+/g, '').trim(),
        images,
        hashtags,
        selectedCommunity,
        selectedMentions.map(u => u._id) // send mentions as userIds
      );

      // Reset state
      setPostText('');
      setImages([]);
      setSelectedMentions([]);
    }
  };

  return (
    <main className="flex items-center justify-center w-full py-10 px-4 bg-gray-50 dark:bg-darkMode-bg transition-colors">
      <div className="w-full max-w-5xl mx-auto bg-white dark:bg-darkMode-fg rounded-3xl shadow-xl overflow-hidden transition-all duration-500">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between w-full p-6 border-b border-gray-200 dark:border-gray-700 gap-4">
          <div className="flex items-center gap-4">
            <Image
              src={user?.profilePhoto?.url}
              alt="profile"
              width={56}
              height={56}
              className="rounded-full w-14 h-14 object-cover border-2 border-gradient-to-br from-blue-400 to-purple-600"
            />
            <div className="flex flex-col">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">{user?.username}</h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">{user?.profileName}</span>
            </div>
          </div>

          {/* Community Selector */}
          <div className="w-full md:w-64 relative">
            {communities.filter(com => com?.members.some(m => m._id === user._id)).length > 0 ? (
              <div className="relative">
                <FaUsers className="absolute left-3 top-3 text-gray-400" />
                <select
                  value={selectedCommunity}
                  onChange={(e) => setSelectedCommunity(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-darkMode-bg border dark:border-gray-600 rounded-xl text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                >
                  <option value="">Select a Community</option>
                  {communities
                    .filter(com => com.members.some(m => m._id === user._id))
                    .map((com) => (
                      <option key={com._id} value={com._id}>
                        {com.Name}
                      </option>
                    ))}
                </select>
              </div>
            ) : (
              <span className="text-sm text-gray-500 dark:text-gray-400">You haven’t joined any communities.</span>
            )}
          </div>
        </div>

        {/* Textarea */}
        <div className="relative p-6 pb-2">
          <textarea
            ref={textareaRef}
            value={postText}
            onChange={handleTextareaChange}
            rows={5}
            placeholder="What's on your mind? Add #hashtags, @mentions or 😊 emojis..."
            className={`w-full p-5 text-base rounded-2xl resize-none border shadow-inner focus:ring-2 transition-all duration-300
              ${errorText 
                ? 'border-red-500 focus:ring-red-500 dark:border-red-500 dark:focus:ring-red-500' 
                : 'bg-gray-50 dark:bg-darkMode-bg text-black dark:text-white border-gray-300 dark:border-gray-600 focus:ring-blue-500'}`}
          />

          {/* Counter */}
          <div className="flex justify-between items-center mt-1 text-xs">
            <span className={`transition ${errorText ? 'text-red-500 font-semibold' : 'text-gray-400'}`}>
              {postText.length}/500
            </span>
            {errorText && <span className="text-red-500">Max 500 characters allowed</span>}
          </div>

          {/* Mentions Dropdown */}
          {showMentionList && filteredMentions.length > 0 && (
            <div className="absolute z-50 bg-white dark:bg-darkMode-bg shadow-lg rounded-md w-64 max-h-48 overflow-auto mt-1">
              {filteredMentions.map((u) => (
                <div
                  key={u._id}
                  className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => selectMention(u)}
                >
                  {u.username}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Images Preview */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 px-6 pb-4">
            {images.map((img, idx) => (
              <div key={idx} className="relative group rounded-xl overflow-hidden shadow-lg">
                <img
                  src={img.url}
                  alt={`preview-${idx}`}
                  className="w-full h-32 object-cover rounded-xl transform group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={() => removeImage(idx)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full shadow hover:bg-red-600 transition"
                >
                  <FiX size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex relative items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 relative">
            <label className="cursor-pointer flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-darkMode-bg hover:bg-blue-100 dark:hover:bg-blue-800 text-gray-700 dark:text-gray-300 transition shadow-md">
              <IoImage size={22} />
              <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
            </label>

            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-darkMode-bg hover:bg-yellow-100 dark:hover:bg-yellow-800 text-gray-600 dark:text-gray-300 transition shadow-md"
            >
              <IoHappyOutline size={22} />
            </button>

            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="absolute z-50 top-[-400px] left-6 w-[320px] rounded-2xl shadow-2xl overflow-hidden transition-transform duration-300 transform scale-95 animate-scale-up">
                <div className="flex justify-between items-center bg-gray-200 dark:bg-gray-700 px-3 py-2">
                  <span className="text-gray-700 dark:text-gray-200 font-semibold">Emojis</span>
                  <button
                    onClick={() => setShowEmojiPicker(false)}
                    className="text-gray-600 dark:text-gray-300 hover:text-red-500 transition"
                  >
                    <FiX size={18} />
                  </button>
                </div>
                <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" height={300} />
              </div>
            )}
          </div>

          <button
            onClick={handlePost}
            disabled={(!postText.trim() && images.length === 0) || errorText}
            className={`px-8 py-2 text-sm font-semibold rounded-full shadow-lg transition-all duration-300 ${
              (!postText.trim() && images.length === 0) || errorText
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
            }`}
          >
            Post
          </button>

        </div>
      </div>
    </main>
  );
};

export default NewPost;
