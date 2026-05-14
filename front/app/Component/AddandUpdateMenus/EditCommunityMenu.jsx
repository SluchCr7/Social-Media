'use client';

import React, {
  useState,
  useCallback,
  useMemo,
  memo,
} from 'react';
import { 
  X, 
  Camera, 
  Plus, 
  Trash2, 
  Shield, 
  Globe, 
  Lock,
  Tag as TagIcon,
  CheckCircle2
} from 'lucide-react';
import { useCommunity } from '../../Context/CommunityContext';
import Image from 'next/image';
import { useAlert } from '../../Context/AlertContext';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';

const SectionHeader = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2 mb-4">
    {Icon && <Icon size={16} className="text-gray-400" />}
    <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">{title}</h3>
  </div>
);

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
  const [previewPicture, setPreviewPicture] = useState(community?.Picture?.url || '/default-profile.png');
  const [previewCover, setPreviewCover] = useState(community?.Cover?.url || '/default-cover.png');
  const [isLoading, setIsLoading] = useState(false);

  const initialData = useMemo(() => ({
    name: community?.Name,
    description: community?.description,
    isPrivate: community?.isPrivate,
    tags: community?.tags,
    rules: community?.rules,
  }), [community]);

  const handleImageChange = useCallback(async (e, type) => {
    const file = e.target.files[0];
    if (!file || !(file instanceof File)) return;
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
      showAlert(t('Error uploading image.'));
    }
  }, [community?._id, showAlert, updateCommunityPicture, updateCommunityCover, t]);

  const addTag = useCallback(() => {
    const trimmed = newTag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
      setNewTag('');
    }
  }, [newTag, tags]);

  const removeTag = useCallback((tag) => setTags((prev) => prev.filter((t) => t !== tag)), []);

  const addRule = useCallback(() => {
    const trimmed = newRule.trim();
    if (trimmed && !rules.includes(trimmed)) {
      setRules((prev) => [...prev, trimmed]);
      setNewRule('');
    }
  }, [newRule, rules]);

  const removeRule = useCallback((rule) => setRules((prev) => prev.filter((r) => r !== rule)), []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const updatedData = {};
    if (name !== initialData.name) updatedData.Name = name;
    if (description !== initialData.description) updatedData.description = description;
    if (isPrivate !== initialData.isPrivate) updatedData.isPrivate = isPrivate;
    if (JSON.stringify(tags) !== JSON.stringify(initialData.tags)) updatedData.tags = tags;
    if (JSON.stringify(rules) !== JSON.stringify(initialData.rules)) updatedData.rules = rules;

    if (Object.keys(updatedData).length > 0) {
      try {
        await editCommunity(community._id, updatedData);
        showAlert(t('Community updated successfully.'));
        onClose();
      } catch (err) {
        showAlert(t('Failed to update community.'));
      } finally {
        setIsLoading(false);
      }
    } else {
      onClose();
    }
  }, [name, description, isPrivate, tags, rules, initialData, editCommunity, community?._id, showAlert, onClose, t]);

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-black border border-gray-100 dark:border-threads-border rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight">{t('Edit Community')}</h2>
            <p className="text-xs text-gray-500 font-semibold">{t('Customize your space')}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 transition-all"
          >
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          
          {/* Visual Assets */}
          <div className="relative group">
            {/* Cover */}
            <div className="relative w-full h-48 bg-gray-50 dark:bg-white/5 overflow-hidden">
              <Image src={previewCover} alt="Cover" fill className="object-cover" />
              <label className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-all">
                <div className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white">
                  <Camera size={24} />
                </div>
                <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'cover')} className="hidden" />
              </label>
            </div>

            {/* Profile Picture */}
            <div className="absolute -bottom-12 left-8">
              <div className="relative w-32 h-32 rounded-[2.5rem] border-4 border-white dark:border-black bg-gray-100 dark:bg-white/10 overflow-hidden shadow-xl group/avatar">
                <Image src={previewPicture} alt="Avatar" fill className="object-cover" />
                <label className="absolute inset-0 bg-black/20 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center cursor-pointer transition-all">
                  <div className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white">
                    <Camera size={20} />
                  </div>
                  <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'picture')} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          <div className="mt-16 p-8 space-y-10">
            {/* Basic Info */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">{t('Community Name')}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-threads-border rounded-2xl p-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 transition-all outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">{t('Description')}</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-threads-border rounded-2xl p-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 transition-all resize-none outline-none"
                />
              </div>
            </div>

            {/* Privacy Setting */}
            <div 
              onClick={() => setIsPrivate(!isPrivate)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer flex items-center justify-between ${isPrivate ? 'bg-indigo-500/5 border-indigo-500/20' : 'bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-threads-border'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isPrivate ? 'bg-indigo-500 text-white' : 'bg-gray-200 dark:bg-white/10 text-gray-400'}`}>
                  {isPrivate ? <Lock size={22} /> : <Globe size={22} />}
                </div>
                <div>
                  <p className="font-bold text-[15px]">{isPrivate ? t('Private Community') : t('Public Community')}</p>
                  <p className="text-[12px] text-gray-500">{isPrivate ? t('Only members can see content') : t('Anyone can see content')}</p>
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full p-1 transition-all ${isPrivate ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-white/10'}`}>
                <div className={`w-4 h-4 rounded-full bg-white transition-all ${isPrivate ? 'translate-x-6' : 'translate-x-0'}`} />
              </div>
            </div>

            {/* Tags & Rules */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <SectionHeader icon={TagIcon} title={t('Tags')} />
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder={t('Add tag...')}
                    className="flex-1 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-threads-border rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-black/5 transition-all"
                  />
                  <Button size="sm" onClick={addTag} className="rounded-xl px-4"><Plus size={18} /></Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((t, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gray-100 dark:bg-white/10 rounded-lg text-xs font-semibold flex items-center gap-2">
                      {t}
                      <X size={12} className="cursor-pointer hover:text-red-500" onClick={() => removeTag(t)} />
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <SectionHeader icon={Shield} title={t('Community Rules')} />
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newRule}
                    onChange={(e) => setNewRule(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRule())}
                    placeholder={t('Add rule...')}
                    className="flex-1 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-threads-border rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-black/5 transition-all"
                  />
                  <Button size="sm" onClick={addRule} className="rounded-xl px-4"><Plus size={18} /></Button>
                </div>
                <div className="space-y-2">
                  {rules.map((r, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-gray-50 dark:bg-white/5 p-3 rounded-xl border border-gray-100 dark:border-threads-border">
                      <span className="text-xs font-medium">{r}</span>
                      <button onClick={() => removeRule(r)} className="text-gray-400 hover:text-red-500">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 bg-gray-50/50 dark:bg-white/[0.02] border-t border-gray-100 dark:border-white/5 flex gap-4">
          <button
            className="px-8 py-3 rounded-full text-gray-500 hover:text-gray-900 dark:hover:text-white font-semibold text-sm transition-colors"
            onClick={onClose}
          >
            {t('Cancel')}
          </button>
          <Button
            className="flex-1 rounded-full py-4 text-sm font-bold tracking-tight"
            isLoading={isLoading}
            onClick={handleSubmit}
          >
            <CheckCircle2 size={18} className="mr-2" />
            {t('Save Changes')}
          </Button>
        </div>
      </div>
    </div>
  );
});

EditCommunityMenu.displayName = 'EditCommunityMenu';
export default EditCommunityMenu;
