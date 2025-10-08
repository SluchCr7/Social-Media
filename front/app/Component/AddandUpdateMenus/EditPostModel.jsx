'use client';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { usePost } from '../Context/PostContext';
import { FaTimes } from 'react-icons/fa';
import { FaUsers } from 'react-icons/fa';
import { IoImage, IoHappyOutline } from 'react-icons/io5';
import EmojiPicker from 'emoji-picker-react';
import { useCommunity } from '@/app/Context/CommunityContext';
import { useAuth } from '@/app/Context/AuthContext';

const EditPostModal = ({ post, onClose }) => {
  const { editPost } = usePost();
  const {communities} = useCommunity()
  const [text, setText] = useState('');
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [newPhotos, setNewPhotos] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState('');
  const {user} = useAuth()
  // Mentions
  const [selectedMentions, setSelectedMentions] = useState([]);
  const [mentionSearch, setMentionSearch] = useState('');
  const [showMentionList, setShowMentionList] = useState(false);
  const [filteredMentions, setFilteredMentions] = useState([]);

  // Links
  const [links, setLinks] = useState([]);
  const [linkInput, setLinkInput] = useState('');

  // Emoji
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const textareaRef = useRef();

  // تحميل البيانات عندما يكون post متاح
  useEffect(() => {
    if (post) {
      setText(post.text || '');
      setExistingPhotos(post.Photos || []);
      setSelectedCommunity(post.community || '');
      setSelectedMentions(post.mentions || []);
      setLinks(post.links || []);
    }
  }, [post]);

  const removePhoto = (public_id) => {
    setExistingPhotos(existingPhotos.filter(photo => photo.public_id !== public_id));
  };

  const handleNewPhotos = (e) => {
    setNewPhotos([...newPhotos, ...Array.from(e.target.files)]);
  };

  const handleAddLink = () => {
    if (linkInput.trim()) {
      setLinks(prev => [...prev, linkInput.trim()]);
      setLinkInput('');
    }
  };

  const handleRemoveLink = (idx) => {
    setLinks(prev => prev.filter((_, i) => i !== idx));
  };

  const handleEmojiClick = (emojiData) => {
    setText(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleSubmit = async () => {
    if (!post) return;
    await editPost(post._id, {
      text,
      community: selectedCommunity,
      existingPhotos,
      newPhotos,
      mentions: selectedMentions,
      links
    });
    onClose();
  };

  if (!post) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 backdrop-blur-sm bg-black/60">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">Edit Post</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition">
            <FaTimes size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-4">

          {/* Community Selector */}
          {ommunities.filter(com => com?.members.some(m => m._id === user._id)).length > 0 && (
            <div className="mb-4">
              <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 block">Community</label>
              <select
                value={selectedCommunity}
                onChange={(e) => setSelectedCommunity(e.target.value)}
                className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-darkMode-bg text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
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
          )}

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            className="w-full h-32 md:h-40 p-4 text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-800 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's on your mind? Add #hashtags, @mentions or emojis..."
          />

          {/* Mentions Chips */}
          {selectedMentions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedMentions.map(m => (
                <div key={m._id} className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                  <span className="text-sm text-gray-800 dark:text-gray-100">@{m.username}</span>
                  <button onClick={() => setSelectedMentions(prev => prev.filter(x => x._id !== m._id))}>
                    <FaTimes size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Links Chips */}
          {links.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {links.map((l, idx) => (
                <div key={idx} className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                  <span className="text-sm text-gray-800 dark:text-gray-100 truncate max-w-xs">{l}</span>
                  <button onClick={() => handleRemoveLink(idx)}>
                    <FaTimes size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Link Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              placeholder="Add a link..."
              className="flex-1 px-3 py-2 border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-darkMode-bg text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
            />
            <button onClick={handleAddLink} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
              Add
            </button>
          </div>

          {/* Existing Photos */}
          {existingPhotos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {existingPhotos.map((photo, idx) => (
                <div key={idx} className="relative group rounded-lg overflow-hidden">
                  <Image
                    src={photo.url}
                    alt="post-img"
                    width={500}
                    height={500}
                    className="object-cover w-full h-32 md:h-36 rounded-lg"
                  />
                  <button
                    onClick={() => removePhoto(photo.public_id)}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* New Photos Preview */}
          {newPhotos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
              {newPhotos.map((file, idx) => (
                <div key={idx} className="relative rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="new"
                    className="w-full h-32 md:h-36 object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Add Photos Input */}
          <div>
            <label className="block text-sm md:text-base font-medium text-gray-700 dark:text-gray-300 mb-1">Add Photos</label>
            <input
              type="file"
              multiple
              onChange={(e) => handleNewPhotos(e)}
              className="block w-full text-sm md:text-base text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm md:file:text-base file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 transition"
            />
          </div>

          {/* Emoji Picker */}
          <div className="relative mt-2">
            <button
              onClick={() => setShowEmojiPicker(prev => !prev)}
              className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg"
            >
              <IoHappyOutline size={22} />
            </button>
            {showEmojiPicker && (
              <div className="absolute z-50 mt-2">
                <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" height={300} />
              </div>
            )}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPostModal;
