'use client';
import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { useStory } from '../Context/StoryContext';

const AddStoryModel = ({ setIsStory, isStory }) => {
  const [storyText, setStoryText] = useState('');
  const [storyImage, setStoryImage] = useState(null);
  const { addNewStory } = useStory();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setStoryImage(file);
      setStoryText('');
    }
  };

  const handleTextChange = (e) => {
    setStoryText(e.target.value);
    setStoryImage(null);
  };

  const handleSubmit = () => {
    if (!storyText && !storyImage) {
      alert('You Must Add Image or Text');
      return;
    }

    const storyData = storyImage
      ? { type: 'image', file: storyImage }
      : { type: 'text', text: storyText };

    addNewStory(storyData);
    clearInput();
    setIsStory(false);
  };

  const clearInput = () => {
    setStoryImage(null);
    setStoryText('');
  };

  return (
    <div className={`${isStory ? 'flex' : 'hidden'} fixed inset-0 bg-black/70 z-50 items-center justify-center`}>
      <div className="bg-lightMode-bg dark:bg-darkMode-bg text-lightMode-text dark:text-darkMode-text w-[90%] max-w-md rounded-2xl shadow-xl p-6 relative transition-all duration-300">

        {/* Close */}
        <button
          className="absolute top-4 right-4 text-lightMode-text2 dark:text-darkMode-text2 hover:text-red-500 text-2xl"
          onClick={() => setIsStory(false)}
        >
          <IoClose />
        </button>

        {/* Title */}
        <h2 className="text-center text-2xl font-bold mb-6 text-lightMode-text dark:text-darkMode-text">Add Story</h2>

        {/* Textarea */}
        {!storyImage && (
          <textarea
            value={storyText}
            onChange={handleTextChange}
            placeholder="Write your story..."
            rows={4}
            className="w-full bg-lightMode-menu dark:bg-darkMode-menu text-lightMode-text dark:text-darkMode-text p-3 rounded-xl mb-4 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        )}

        {/* Image Upload */}
        {!storyText && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-lightMode-text2 dark:text-darkMode-text2">Choose Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-500 transition"
            />
          </div>
        )}

        {/* Preview */}
        {storyImage && (
          <div className="mb-4">
            <img
              src={URL.createObjectURL(storyImage)}
              alt="Preview"
              className="rounded-xl max-h-64 object-contain mx-auto border border-gray-200 dark:border-gray-700"
            />
          </div>
        )}

        {/* Clear Button */}
        {(storyText || storyImage) && (
          <button
            onClick={clearInput}
            className="block mx-auto text-sm text-red-500 hover:underline mb-4"
          >
            remove
          </button>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="bg-green-600 hover:bg-green-500 w-full py-2 rounded-xl text-white font-semibold transition text-lg"
        >
          Share Story
        </button>
      </div>
    </div>
  );
};

export default AddStoryModel;
