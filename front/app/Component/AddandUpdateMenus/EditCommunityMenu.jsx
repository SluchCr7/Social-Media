'use client';

import React, {
  useState,
  useCallback,
  useMemo,
  memo,
} from 'react';
import { IoClose, IoCamera, IoAdd } from 'react-icons/io5';
import { useCommunity } from '../../Context/CommunityContext';
import Image from 'next/image';
import { useAlert } from '../../Context/AlertContext';
import { useTranslation } from 'react-i18next';

/**
 * ✅ Performance Enhancements:
 * - useCallback: تثبيت الدوال لمنع إعادة الإنشاء في كل render
 * - useMemo: لتجنب عمليات مقارنة أو إنشاء بيانات مكلفة
 * - memo: لمنع إعادة التصيير إلا عند تغيير props
 * - تقليل إنشاء عناصر inline والأنماط داخل JSX
 */

const EditCommunityMenu = memo(({ community, onClose }) => {
  const { t } = useTranslation();
  const { showAlert } = useAlert();
  const { editCommunity, updateCommunityPicture, updateCommunityCover } = useCommunity();

  const [name, setName] = useState(community?.Name || '');
  const [description, setDescription] = useState(community?.description || '');
  const [isPrivate, setIsPrivate] = useState(community?.isPrivate || false);
  const [tags, setTags] = useState(community?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [rules, setRules] = useState(community?.rules || []);
  const [newRule, setNewRule] = useState('');
  const [previewPicture, setPreviewPicture] = useState(
    community?.Picture?.url || '/default-profile.png'
  );
  const [previewCover, setPreviewCover] = useState(
    community?.Cover?.url || '/default-cover.png'
  );

  /** 🧠 Memoized initial community data for comparison */
  const initialData = useMemo(
    () => ({
      name: community?.Name,
      description: community?.description,
      isPrivate: community?.isPrivate,
      tags: community?.tags,
      rules: community?.rules,
    }),
    [community]
  );

  /** 🧩 Memoized handler functions to prevent unnecessary re-renders */
  const handleImageChange = useCallback(
    async (e, type) => {
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
        }
      } catch (err) {
        console.error('Image Upload Error:', err);
        showAlert(err?.response?.data?.message || 'Error uploading image.');
      }
    },
    [community?._id, showAlert, updateCommunityPicture, updateCommunityCover]
  );

  const addTag = useCallback(() => {
    const trimmed = newTag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
      setNewTag('');
    }
  }, [newTag, tags]);

  const removeTag = useCallback(
    (tag) => setTags((prev) => prev.filter((t) => t !== tag)),
    []
  );

  const addRule = useCallback(() => {
    const trimmed = newRule.trim();
    if (trimmed && !rules.includes(trimmed)) {
      setRules((prev) => [...prev, trimmed]);
      setNewRule('');
    }
  }, [newRule, rules]);

  const removeRule = useCallback(
    (rule) => setRules((prev) => prev.filter((r) => r !== rule)),
    []
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const updatedData = {};
      if (name !== initialData.name) updatedData.Name = name;
      if (description !== initialData.description)
        updatedData.description = description;
      if (isPrivate !== initialData.isPrivate)
        updatedData.isPrivate = isPrivate;
      if (JSON.stringify(tags) !== JSON.stringify(initialData.tags))
        updatedData.tags = tags;
      if (JSON.stringify(rules) !== JSON.stringify(initialData.rules))
        updatedData.rules = rules;

      if (Object.keys(updatedData).length > 0) {
        try {
          await editCommunity(community._id, updatedData);
          showAlert('Community details updated successfully.');
        } catch (err) {
          showAlert(
            err?.response?.data?.message || 'Failed to update community data.'
          );
        }
      }

      onClose();
    },
    [
      name,
      description,
      isPrivate,
      tags,
      rules,
      initialData,
      editCommunity,
      community?._id,
      showAlert,
      onClose,
    ]
  );

  /** 🖼️ Memoized render for tags and rules to prevent re-renders */
  const renderedTags = useMemo(
    () =>
      tags.map((t, idx) => (
        <span
          key={idx}
          className="bg-lightMode-menu dark:bg-darkMode-menu text-lightMode-text dark:text-darkMode-text px-2 py-1 rounded-full flex items-center gap-1 cursor-pointer"
          onClick={() => removeTag(t)}
        >
          {t} &times;
        </span>
      )),
    [tags, removeTag]
  );

  const renderedRules = useMemo(
    () =>
      rules.map((r, idx) => (
        <div
          key={idx}
          className="flex items-center justify-between bg-lightMode-menu dark:bg-darkMode-menu px-3 py-1 rounded-lg"
        >
          <span className="text-lightMode-fg dark:text-darkMode-fg">{r}</span>
          <button
            type="button"
            onClick={() => removeRule(r)}
            className="text-red-500 font-bold"
          >
            &times;
          </button>
        </div>
      )),
    [rules, removeRule]
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-2xl relative bg-lightMode-bg dark:bg-darkMode-bg rounded-2xl p-6 shadow-2xl border border-lightMode-menu/30 dark:border-darkMode-menu/40 overflow-y-auto max-h-[95vh] transition-all">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-lightMode-text2 dark:text-darkMode-text2 hover:text-red-500 text-2xl transition"
        >
          <IoClose />
        </button>

        <h2 className="text-2xl font-semibold mb-6 text-center text-lightMode-text dark:text-darkMode-text">
          {t('Edit Community')}
        </h2>

        {/* Cover */}
        <div className="relative w-full h-40 rounded-xl overflow-hidden mb-6">
          <Image src={previewCover} alt="Cover" fill className="object-cover" />
          <label className="absolute top-2 right-2 bg-black/60 p-2 rounded-full cursor-pointer text-white hover:bg-black/80 transition">
            <IoCamera />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, 'cover')}
              className="hidden"
            />
          </label>
        </div>

        {/* Profile */}
        <div className="relative w-28 h-28 mx-auto -mt-16 border-4 border-lightMode-bg dark:border-darkMode-bg rounded-full overflow-hidden">
          <Image src={previewPicture} alt="Photo" fill className="object-cover" />
          <label className="absolute bottom-1 right-1 bg-black/60 p-1 rounded-full cursor-pointer text-white hover:bg-black/80 transition">
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
          {/* Name */}
          <div>
            <label className="block mb-1 font-medium text-lightMode-text2 dark:text-darkMode-text2">
              {t('Community Name')}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-lightMode-menu dark:border-darkMode-menu bg-lightMode-bg dark:bg-darkMode-menu text-lightMode-fg dark:text-darkMode-fg rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-lightMode-text dark:focus:ring-darkMode-text transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 font-medium text-lightMode-text2 dark:text-darkMode-text2">
              {t('Description')}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full border border-lightMode-menu dark:border-darkMode-menu bg-lightMode-bg dark:bg-darkMode-menu text-lightMode-fg dark:text-darkMode-fg rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-lightMode-text dark:focus:ring-darkMode-text transition"
            />
          </div>

          {/* Privacy */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPrivate"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="accent-blue-600 w-4 h-4"
            />
            <label htmlFor="isPrivate" className="text-lightMode-text2 dark:text-darkMode-text2">
              {t('Private Community')}
            </label>
          </div>

          {/* Tags */}
          <div>
            <label className="block mb-1 font-medium text-lightMode-text2 dark:text-darkMode-text2">Tags</label>
            <div className="flex gap-2 flex-wrap mb-2">{renderedTags}</div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add new tag"
                className="w-full border border-lightMode-menu dark:border-darkMode-menu bg-lightMode-bg dark:bg-darkMode-menu text-lightMode-fg dark:text-darkMode-fg px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-lightMode-text dark:focus:ring-darkMode-text"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-3 py-2 bg-lightMode-text dark:bg-darkMode-text text-white rounded-lg transition hover:opacity-90"
              >
                <IoAdd />
              </button>
            </div>
          </div>

          {/* Rules */}
          <div>
            <label className="block mb-1 font-medium text-lightMode-text2 dark:text-darkMode-text2">Rules</label>
            <div className="flex flex-col gap-2 mb-2">{renderedRules}</div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newRule}
                onChange={(e) => setNewRule(e.target.value)}
                placeholder="Add new rule"
                className="w-full border border-lightMode-menu dark:border-darkMode-menu bg-lightMode-bg dark:bg-darkMode-menu text-lightMode-fg dark:text-darkMode-fg px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-lightMode-text dark:focus:ring-darkMode-text"
              />
              <button
                type="button"
                onClick={addRule}
                className="px-3 py-2 bg-lightMode-text dark:bg-darkMode-text text-white rounded-lg transition hover:opacity-90"
              >
                <IoAdd />
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-lightMode-text dark:bg-darkMode-text hover:opacity-90 text-white py-2 rounded-lg font-semibold transition"
          >
            {t('Save Changes')}
          </button>
        </form>
      </div>
    </div>
  );
});

export default EditCommunityMenu;
