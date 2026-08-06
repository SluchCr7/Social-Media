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
  <div className="flex items-center gap-2 mb-2">
    {Icon && <Icon size={14} className="text-slate-400" />}
    <h3 className="text-xs font-semibold text-slate-600 dark:text-slate-400">{title}</h3>
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
    const file = e.target.files?.[0];
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
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-[#0B0F1A] border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">{t('Edit Community')}</h2>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t('Customize community details')}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto">
          
          {/* Cover & Avatar Header */}
          <div className="relative">
            {/* Cover */}
            <div className="relative w-full h-36 bg-slate-100 dark:bg-white/5 overflow-hidden">
              <Image src={previewCover} alt="Cover" fill className="object-cover" />
              <label className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                <div className="bg-black/50 backdrop-blur-sm p-2 rounded-full text-white">
                  <Camera size={18} />
                </div>
                <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'cover')} className="hidden" />
              </label>
            </div>

            {/* Profile Avatar */}
            <div className="absolute -bottom-8 left-5">
              <div className="relative w-20 h-20 rounded-2xl border-4 border-white dark:border-[#0B0F1A] bg-slate-100 dark:bg-white/10 overflow-hidden shadow-md group">
                <Image src={previewPicture} alt="Avatar" fill className="object-cover" />
                <label className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                  <div className="bg-black/50 backdrop-blur-sm p-1.5 rounded-full text-white">
                    <Camera size={16} />
                  </div>
                  <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'picture')} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          <div className="mt-12 p-5 sm:p-6 space-y-5">
            {/* Name & Description */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">{t('Community Name')}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">{t('Description')}</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-100 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 rounded-xl p-3 text-xs sm:text-sm font-medium outline-none transition-all resize-none"
                />
              </div>
            </div>

            {/* Privacy Setting */}
            <div 
              onClick={() => setIsPrivate(!isPrivate)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                isPrivate 
                  ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30' 
                  : 'bg-slate-100 dark:bg-white/5 border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isPrivate ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-white/10 text-slate-400'}`}>
                  {isPrivate ? <Lock size={16} /> : <Globe size={16} />}
                </div>
                <div>
                  <p className="text-xs font-bold">{isPrivate ? t('Private Community') : t('Public Community')}</p>
                  <p className="text-[11px] text-slate-500">{isPrivate ? t('Only members can see content') : t('Anyone can see content')}</p>
                </div>
              </div>
              <div className={`w-8 h-4.5 rounded-full p-0.5 transition-all ${isPrivate ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-white/20'}`}>
                <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${isPrivate ? 'translate-x-3.5' : 'translate-x-0'}`} />
              </div>
            </div>

            {/* Tags & Rules */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <SectionHeader icon={TagIcon} title={t('Community Tags')} />
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder={t('Add tag...')}
                    className="flex-1 bg-slate-100 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 rounded-xl px-3 py-2 text-xs font-medium outline-none transition-all"
                  />
                  <Button size="sm" onClick={addTag} className="rounded-xl px-3 py-2 text-xs"><Plus size={16} /></Button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tItem, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-slate-100 dark:bg-white/10 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                      <span>#{tItem}</span>
                      <X size={12} className="cursor-pointer hover:text-rose-500" onClick={() => removeTag(tItem)} />
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <SectionHeader icon={Shield} title={t('Community Rules')} />
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newRule}
                    onChange={(e) => setNewRule(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRule())}
                    placeholder={t('Add rule...')}
                    className="flex-1 bg-slate-100 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 rounded-xl px-3 py-2 text-xs font-medium outline-none transition-all"
                  />
                  <Button size="sm" onClick={addRule} className="rounded-xl px-3 py-2 text-xs"><Plus size={16} /></Button>
                </div>
                <div className="space-y-1.5">
                  {rules.map((r, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-slate-100 dark:bg-white/5 p-2 rounded-xl text-xs font-medium">
                      <span className="truncate pr-2">{r}</span>
                      <button onClick={() => removeRule(r)} className="text-slate-400 hover:text-rose-500 shrink-0">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 bg-slate-50/50 dark:bg-white/[0.02] border-t border-slate-200/80 dark:border-white/10 flex items-center justify-end gap-2">
          <button
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 transition-colors"
            onClick={onClose}
          >
            {t('Cancel')}
          </button>
          <Button
            className="rounded-xl px-5 py-2 text-xs font-bold"
            isLoading={isLoading}
            onClick={handleSubmit}
          >
            <CheckCircle2 size={16} className="mr-1.5" />
            {t('Save Changes')}
          </Button>
        </div>
      </div>
    </div>
  );
});

EditCommunityMenu.displayName = 'EditCommunityMenu';
export default EditCommunityMenu;
