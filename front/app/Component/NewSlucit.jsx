import Image from 'next/image'
import React, { useState } from 'react'
import { IoImage } from "react-icons/io5";
import { FiX } from "react-icons/fi";
import { usePost } from '../Context/PostContext';
import { useCommunity } from '../Context/CommunityContext';

const NewSlucit = ({ showNewSluchit, setShowNewSluchit }) => {
  const [postText, setPostText] = useState('');
  const [images, setImages] = useState([]);
    const {AddPost} = usePost()
    const {community} = useCommunity()
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map(file => ({
      file,
      url: URL.createObjectURL(file)
    }));
    setImages(prev => [...prev, ...previews]);
  };


  const removeImage = (index) => {
    setImages(prev => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const extractHashtags = (text) => {
    const matches = text.match(/#[a-zA-Z0-9_]+/g);
    if (!matches) return [];
    // Remove '#' and lowercase
    return Array.from(new Set(matches.map(tag => tag.slice(1).toLowerCase())));
  };
  const handlePost = () => {
      const hashtags = extractHashtags(postText);
      AddPost(postText, images , hashtags);
      setTimeout(() => {
        setPostText('');
        setImages([]);
        setShowNewSluchit(false);
      }, 1000);
  };

  return (
    <div className={`fixed inset-0 z-[999] transition-all duration-500 ${showNewSluchit ? 'backdrop-blur-sm bg-black/30' : 'pointer-events-none opacity-0'}`}>
    <div className={`transform transition-all duration-700 ease-in-out 
        ${showNewSluchit ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} 
        w-[95%] md:w-[90%] max-w-6xl mx-auto
        bg-lightMode-fg dark:bg-darkMode-fg shadow-2xl rounded-xl p-6 mt-[10vh] relative`}>

        {/* Header Input */}
        <div className='w-full flex items-center gap-3 min-h-[10vh]'>
          <Image src="/Home.jpg" alt="profile" width={40} height={40} className='rounded-full w-12 h-12 object-cover' />
          <textarea
            className="w-full p-3 border rounded resize-none"
            rows={4}
            placeholder="Write your post here... include #hashtags if you want"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
          />
        </div>

        {/* Image Previews */}
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mt-4">
            {images.map((img, index) => (
              <div key={index} className="relative">
                <img src={img.url} alt={`preview-${index}`} className="w-full h-32 object-cover rounded-lg" />
                <button onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-white/50 hover:bg-black/50 rounded-full p-1 text-black dark:text-white">
                  <FiX size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Footer Actions */}
        <div className='w-full flex items-center justify-between pt-4 px-6 border-t border-fg mt-4'>
          <label className="cursor-pointer text-gray-500 text-xl">
            <IoImage />
            <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
          <button onClick={handlePost} className='text-fg bg-text py-2 px-4 rounded-lg'>
            Post
          </button>
        </div>

        {/* Close Button */}
        <button onClick={() => setShowNewSluchit(false)} className="text-gray-400 hover:text-gray-600 absolute top-2 right-2">
          <FiX size={18} />
        </button>
      </div>
    </div>
  )
}

export default NewSlucit;
