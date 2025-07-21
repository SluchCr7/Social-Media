'use client';

import React, { useState } from 'react';
import { IoClose, IoCamera } from 'react-icons/io5';
import { useCommunity } from '../Context/CommunityContext';
import Image from 'next/image';

const EditCommunityMenu = ({ community, onClose }) => {
  const [name, setName] = useState(community?.Name || '');
  const [description, setDescription] = useState(community?.description || '');
  const [previewPicture, setPreviewPicture] = useState(community?.Picture?.url || '/default-profile.png');
  const [previewCover, setPreviewCover] = useState(community?.Cover?.url || '/default-cover.png');

  const { editCommunity, updateCommunityPicture, updateCommunityCover } = useCommunity();

  const handleImageChange = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    try {
      if (type === 'picture') {
        setPreviewPicture(url);
        await updateCommunityPicture(community._id, file);
      } else {
        setPreviewCover(url);
        await updateCommunityCover(community._id, file);
      }
    } catch (err) {
      console.error("Image Upload Error:", err);
      const message =
        err?.response?.data?.message || err?.message || 'حدث خطأ أثناء رفع الصورة.';
      alert(message); // يمكنك استبداله بـ showAlert(message) إن كانت متاحة
    } finally {
      URL.revokeObjectURL(url); // تنظيف الرابط المؤقت من الذاكرة
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {};
    if (name !== community.Name) updatedData.Name = name;
    if (description !== community.description) updatedData.description = description;

    if (Object.keys(updatedData).length > 0) {
      try {
        await editCommunity(community._id, updatedData);
      } catch (err) {
        const message =
          err?.response?.data?.message || err?.message || 'فشل في تعديل البيانات';
        alert(message);
      }
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-darkMode-bg rounded-xl p-6 w-full max-w-2xl relative shadow-lg overflow-y-auto max-h-[95vh]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-2xl text-gray-500 hover:text-red-500"
        >
          <IoClose />
        </button>

        <h2 className="text-2xl font-semibold mb-6 text-center">Edit Community</h2>

        {/* Cover Image */}
        <div className="relative w-full h-40 rounded-lg overflow-hidden mb-6">
          <Image src={previewCover} alt="Cover" fill className="object-cover" />
          <label className="absolute top-2 right-2 bg-black bg-opacity-60 p-2 rounded-full cursor-pointer text-white">
            <IoCamera />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, 'cover')}
              className="hidden"
            />
          </label>
        </div>

        {/* Profile Image */}
        <div className="relative w-28 h-28 mx-auto -mt-16 border-4 border-white dark:border-darkMode-bg rounded-full overflow-hidden">
          <Image src={previewPicture} alt="Profile" fill className="object-cover" />
          <label className="absolute bottom-1 right-1 bg-black bg-opacity-60 p-1 rounded-full cursor-pointer text-white">
            <IoCamera size={16} />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, 'picture')}
              className="hidden"
            />
          </label>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4 px-2">
          <div>
            <label className="block mb-1 font-medium">Community Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition duration-150"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditCommunityMenu;
