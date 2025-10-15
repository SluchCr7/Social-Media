import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlus, FaUsers, FaSearch, FaLock, FaGlobe } from 'react-icons/fa'
import { CATEGORY_OPTIONS } from '@/app/utils/Data'
import Badge from './Badge'
import { useTranslation } from 'react-i18next'
const CreateCommunityModal = ({ show, onClose, form, setForm, handleCreate, isCreating }) => {
  const {t} = useTranslation()
  // إضافة tag جديد
  const addTag = () => {
    const tag = form.newTag?.trim();
    if (tag && !(form.tags || []).includes(tag)) {
      setForm((p) => ({
        ...p,
        tags: [...(p.tags || []), tag],
        newTag: '',
      }));
    }
  };

  // إزالة tag
  const removeTag = (tag) => {
    setForm((p) => ({
      ...p,
      tags: (p.tags || []).filter((t) => t !== tag),
    }));
  };

  // إضافة rule جديد
  const addRule = () => {
    const rule = form.newRule?.trim();
    if (rule && !(form.rules || []).includes(rule)) {
      setForm((p) => ({
        ...p,
        rules: [...(p.rules || []), rule],
        newRule: '',
      }));
    }
  };

  // إزالة rule
  const removeRule = (rule) => {
    setForm((p) => ({
      ...p,
      rules: (p.rules || []).filter((r) => r !== rule),
    }));
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div initial={{ y: 10, scale: 0.98 }} animate={{ y: 0, scale: 1 }} exit={{ y: 10, scale: 0.98 }} transition={{ type: 'spring', stiffness: 200 }} className="bg-lightMode-bg dark:bg-darkMode-bg rounded-2xl w-full max-w-lg p-6 mx-4 sm:mx-0 shadow-xl overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl font-semibold text-sky-600 flex items-center gap-2"><FaPlus /> {t("Create Community")}</h3>

            <form onSubmit={handleCreate} className="mt-4 space-y-4">
              {/* Name */}
              <div>
                <label className="text-sm text-lightMode-text2 dark:text-darkMode-text2">{t("Name")}</label>
                <input
                  value={form.Name}
                  onChange={(e) => setForm((p) => ({ ...p, Name: e.target.value }))}
                  required
                  className="w-full mt-1 p-3 rounded-lg border bg-lightMode-menu dark:bg-darkMode-menu text-lightMode-text dark:text-darkMode-text"
                  placeholder="e.g. Frontend Devs"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-sm text-lightMode-text2 dark:text-darkMode-text2">{t("Category")}</label>
                <select value={form.Category} onChange={(e) => setForm((p) => ({ ...p, Category: e.target.value }))} className="w-full mt-1 p-3 rounded-lg border bg-lightMode-menu dark:bg-darkMode-menu text-lightMode-text dark:text-darkMode-text">
                  {CATEGORY_OPTIONS.filter(Boolean).map(({name,value}) => (
                    <option key={value} value={value}>{name}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm text-lightMode-text2 dark:text-darkMode-text2">{t("Description")}</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  required
                  rows={4}
                  className="w-full mt-1 p-3 rounded-lg border bg-lightMode-menu dark:bg-darkMode-menu text-lightMode-text dark:text-darkMode-text"
                  placeholder="Short description about what the community is for"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="text-sm text-lightMode-text2 dark:text-darkMode-text2">{t("Tags")}</label>
                <div className="flex gap-2 flex-wrap mt-1">
                  {(form.tags || []).map((tag) => (
                    <Badge key={tag} className="bg-sky-100 text-sky-700 dark:bg-sky-900/30 cursor-pointer" onClick={() => removeTag(tag)}>
                      {tag} &times;
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <input
                    value={form.newTag || ''}
                    onChange={(e) => setForm((p) => ({ ...p, newTag: e.target.value }))}
                    placeholder="Add a tag"
                    className="flex-1 p-2 rounded-lg border bg-lightMode-menu dark:bg-darkMode-menu text-lightMode-text dark:text-darkMode-text"
                  />
                  <button type="button" onClick={addTag} className="px-4 py-2 bg-sky-600 text-white rounded-lg">Add</button>
                </div>
              </div>

              {/* Rules */}
              <div>
                <label className="text-sm text-lightMode-text2 dark:text-darkMode-text2">{t("Rules")}</label>
                <ul className="list-disc list-inside mt-1">
                  {(form.rules || []).map((rule) => (
                    <li key={rule} className="flex justify-between items-center gap-2">
                      <span>{rule}</span>
                      <button type="button" className="text-red-500" onClick={() => removeRule(rule)}>×</button>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2 mt-2">
                  <input
                    value={form.newRule || ''}
                    onChange={(e) => setForm((p) => ({ ...p, newRule: e.target.value }))}
                    placeholder="Add a rule"
                    className="flex-1 p-2 rounded-lg border bg-lightMode-menu dark:bg-darkMode-menu text-lightMode-text dark:text-darkMode-text"
                  />
                  <button type="button" onClick={addRule} className="px-4 py-2 bg-sky-600 text-white rounded-lg">Add</button>
                </div>
              </div>

              {/* Preview */}
              <div className="mt-2 border rounded-lg p-3 bg-lightMode-menu dark:bg-darkMode-menu">
                <h4 className="font-semibold">{t("Preview")}:</h4>
                <p className="text-sm text-lightMode-text dark:text-darkMode-text">{form.Name || 'Community Name'}</p>
                <p className="text-xs text-lightMode-text2 dark:text-darkMode-text2">{form.description || 'Community Description'}</p>
                <div className="flex gap-2 flex-wrap mt-1">
                  {(form.tags || []).map((tag) => <Badge key={tag} className="bg-sky-100 text-sky-700 dark:bg-sky-900/30">{tag}</Badge>)}
                </div>
                <ul className="list-disc list-inside mt-1 text-xs text-lightMode-text2 dark:text-darkMode-text2">
                  {(form.rules || []).map((rule) => <li key={rule}>{rule}</li>)}
                </ul>
              </div>

              {/* Buttons */}
              <div className="flex justify-end items-center gap-3 flex-wrap">
                <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-800 transition">{t("Cancel")}</button>
                <button type="submit" disabled={isCreating} className="px-6 py-2 rounded-lg bg-sky-600 text-white font-semibold">{isCreating ? 'Creating...' : t('Create')}</button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CreateCommunityModal