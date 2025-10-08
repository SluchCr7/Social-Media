'use client';

import React, { useState } from 'react';
import { IoClose, IoCamera, IoAdd } from 'react-icons/io5';
import { useCommunity } from '../../Context/CommunityContext';
import Image from 'next/image';
import { useAlert } from '../../Context/AlertContext';

const EditCommunityMenu = ({ community, onClose }) => {
  const [name, setName] = useState(community?.Name || '');
  const [description, setDescription] = useState(community?.description || '');
  const [isPrivate, setIsPrivate] = useState(community?.isPrivate || false);
  const [previewPicture, setPreviewPicture] = useState(
    community?.Picture?.url || '/default-profile.png'
  );
  const [previewCover, setPreviewCover] = useState(
    community?.Cover?.url || '/default-cover.png'
  );

  // الحقول الجديدة
  const [tags, setTags] = useState(community?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [rules, setRules] = useState(community?.rules || []);
  const [newRule, setNewRule] = useState('');

  const { showAlert } = useAlert();
  const { editCommunity, updateCommunityPicture, updateCommunityCover } = useCommunity();

  // رفع الصور
  const handleImageChange = async (e, type) => {
    const file = e.target.files[0];
    if (!file || !(file instanceof File)) {
      showAlert('Invalid file selected.');
      return;
    }

    const objectURL = URL.createObjectURL(file);

    try {
      if (type === 'picture') {
        setPreviewPicture(objectURL);
        const result = await updateCommunityPicture(community._id, file);
        if (result?.url) setPreviewPicture(result.url);
      } else if (type === 'cover') {
        setPreviewCover(objectURL);
        const result = await updateCommunityCover(community._id, file);
        if (result?.url) setPreviewCover(result.url);
      } else {
        showAlert('Unsupported image type.');
      }
    } catch (err) {
      console.error('Image Upload Error:', err);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'An error occurred while uploading the image.';
      showAlert(message);
    }
  };

  // إضافة tag
  const addTag = () => {
    const trimmed = newTag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setNewTag('');
    }
  };

  const removeTag = (tag) => setTags(tags.filter((t) => t !== tag));

  // إضافة rule
  const addRule = () => {
    const trimmed = newRule.trim();
    if (trimmed && !rules.includes(trimmed)) {
      setRules([...rules, trimmed]);
      setNewRule('');
    }
  };

  const removeRule = (rule) => setRules(rules.filter((r) => r !== rule));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {};
    if (name !== community.Name) updatedData.Name = name;
    if (description !== community.description) updatedData.description = description;
    if (isPrivate !== community.isPrivate) updatedData.isPrivate = isPrivate;
    if (JSON.stringify(tags) !== JSON.stringify(community.tags)) updatedData.tags = tags;
    if (JSON.stringify(rules) !== JSON.stringify(community.rules)) updatedData.rules = rules;

    if (Object.keys(updatedData).length > 0) {
      try {
        await editCommunity(community._id, updatedData);
        showAlert('Community details updated successfully.');
      } catch (err) {
        const message =
          err?.response?.data?.message || err?.message || 'Failed to update community data.';
        showAlert(message);
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
          <Image src={previewPicture} alt="Photo" fill className="object-cover" />
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

          {/* isPrivate Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPrivate"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isPrivate" className="font-medium cursor-pointer">
              Private Community
            </label>
          </div>

          {/* Tags */}
          <div>
            <label className="block mb-1 font-medium">Tags</label>
            <div className="flex gap-2 flex-wrap mb-2">
              {tags.map((t, idx) => (
                <span
                  key={idx}
                  className="bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300 px-2 py-1 rounded-full flex items-center gap-1 cursor-pointer"
                  onClick={() => removeTag(t)}
                >
                  {t} &times;
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add new tag"
                className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="button" onClick={addTag} className="px-3 py-2 bg-blue-600 text-white rounded-lg">
                <IoAdd />
              </button>
            </div>
          </div>

          {/* Rules */}
          <div>
            <label className="block mb-1 font-medium">Rules</label>
            <div className="flex flex-col gap-2 mb-2">
              {rules.map((r, idx) => (
                <div key={idx} className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-lg">
                  <span>{r}</span>
                  <button type="button" onClick={() => removeRule(r)} className="text-red-500 font-bold">&times;</button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newRule}
                onChange={(e) => setNewRule(e.target.value)}
                placeholder="Add new rule"
                className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="button" onClick={addRule} className="px-3 py-2 bg-blue-600 text-white rounded-lg">
                <IoAdd />
              </button>
            </div>
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
