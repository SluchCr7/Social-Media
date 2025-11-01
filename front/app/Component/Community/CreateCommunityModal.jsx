'use client';
import React, { useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlus } from 'react-icons/fa'
import { CATEGORY_OPTIONS } from '@/app/utils/Data'
import Badge from './Badge'
import { useTranslation } from 'react-i18next'

const CreateCommunityModal = React.memo(({ show, onClose, form, setForm, handleCreate, isCreating }) => {
  const { t } = useTranslation()

  // 🧠 النصوص المترجمة
  const labels = useMemo(() => ({
    createCommunity: t("Create Community"),
    name: t("Name"),
    category: t("Category"),
    description: t("Description"),
    tags: t("Tags"),
    rules: t("Rules"),
    preview: t("Preview"),
    cancel: t("Cancel"),
    create: t("Create"),
  }), [t])

  // ⚡ دوال مستقرة عبر useCallback
  const addTag = useCallback(() => {
    const tag = form.newTag?.trim()
    if (tag && !(form.tags || []).includes(tag)) {
      setForm(p => ({ ...p, tags: [...(p.tags || []), tag], newTag: '' }))
    }
  }, [form.newTag, form.tags, setForm])

  const removeTag = useCallback((tag) => {
    setForm(p => ({ ...p, tags: (p.tags || []).filter(t => t !== tag) }))
  }, [setForm])

  const addRule = useCallback(() => {
    const rule = form.newRule?.trim()
    if (rule && !(form.rules || []).includes(rule)) {
      setForm(p => ({ ...p, rules: [...(p.rules || []), rule], newRule: '' }))
    }
  }, [form.newRule, form.rules, setForm])

  const removeRule = useCallback((rule) => {
    setForm(p => ({ ...p, rules: (p.rules || []).filter(r => r !== rule) }))
  }, [setForm])

  const handleChange = useCallback((field, value) => {
    setForm(p => ({ ...p, [field]: value }))
  }, [setForm])

  // 🧩 خيارات الفئة (Category)
  const categoryOptions = useMemo(
    () => CATEGORY_OPTIONS.filter(Boolean),
    []
  )

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            layout
            initial={{ y: 10, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 10, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="bg-lightMode-bg dark:bg-darkMode-bg rounded-2xl w-full max-w-lg p-6 mx-4 sm:mx-0 shadow-xl overflow-y-auto max-h-[90vh]"
          >
            <h3 className="text-xl font-semibold text-sky-600 flex items-center gap-2">
              <FaPlus /> {labels.createCommunity}
            </h3>

            <form onSubmit={handleCreate} className="mt-4 space-y-4">

              {/* Name */}
              <div>
                <label className="text-sm text-lightMode-text2 dark:text-darkMode-text2">{labels.name}</label>
                <input
                  value={form.Name}
                  onChange={(e) => handleChange("Name", e.target.value)}
                  required
                  className="w-full mt-1 p-3 rounded-lg border bg-lightMode-menu dark:bg-darkMode-menu text-lightMode-text dark:text-darkMode-text"
                  placeholder="e.g. Frontend Devs"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-sm text-lightMode-text2 dark:text-darkMode-text2">{labels.category}</label>
                <select
                  value={form.Category}
                  onChange={(e) => handleChange("Category", e.target.value)}
                  className="w-full mt-1 p-3 rounded-lg border bg-lightMode-menu dark:bg-darkMode-menu text-lightMode-text dark:text-darkMode-text"
                >
                  {categoryOptions.map(({ name, value }) => (
                    <option key={value} value={value}>{name}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm text-lightMode-text2 dark:text-darkMode-text2">{labels.description}</label>
                <textarea
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  required
                  rows={4}
                  className="w-full mt-1 p-3 rounded-lg border bg-lightMode-menu dark:bg-darkMode-menu text-lightMode-text dark:text-darkMode-text"
                  placeholder="Short description about what the community is for"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="text-sm text-lightMode-text2 dark:text-darkMode-text2">{labels.tags}</label>
                <div className="flex gap-2 flex-wrap mt-1">
                  {(form.tags || []).map((tag) => (
                    <Badge
                      key={tag}
                      className="bg-sky-100 text-sky-700 dark:bg-sky-900/30 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    >
                      {tag} &times;
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <input
                    value={form.newTag || ''}
                    onChange={(e) => handleChange("newTag", e.target.value)}
                    placeholder="Add a tag"
                    className="flex-1 p-2 rounded-lg border bg-lightMode-menu dark:bg-darkMode-menu text-lightMode-text dark:text-darkMode-text"
                  />
                  <button type="button" onClick={addTag} className="px-4 py-2 bg-sky-600 text-white rounded-lg">Add</button>
                </div>
              </div>

              {/* Rules */}
              <div>
                <label className="text-sm text-lightMode-text2 dark:text-darkMode-text2">{labels.rules}</label>
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
                    onChange={(e) => handleChange("newRule", e.target.value)}
                    placeholder="Add a rule"
                    className="flex-1 p-2 rounded-lg border bg-lightMode-menu dark:bg-darkMode-menu text-lightMode-text dark:text-darkMode-text"
                  />
                  <button type="button" onClick={addRule} className="px-4 py-2 bg-sky-600 text-white rounded-lg">Add</button>
                </div>
              </div>

              {/* Preview */}
              <div className="mt-2 border rounded-lg p-3 bg-lightMode-menu dark:bg-darkMode-menu">
                <h4 className="font-semibold">{labels.preview}:</h4>
                <p className="text-sm text-lightMode-text dark:text-darkMode-text">{form.Name || 'Community Name'}</p>
                <p className="text-xs text-lightMode-text2 dark:text-darkMode-text2">{form.description || 'Community Description'}</p>
                <div className="flex gap-2 flex-wrap mt-1">
                  {(form.tags || []).map((tag) => (
                    <Badge key={tag} className="bg-sky-100 text-sky-700 dark:bg-sky-900/30">{tag}</Badge>
                  ))}
                </div>
                <ul className="list-disc list-inside mt-1 text-xs text-lightMode-text2 dark:text-darkMode-text2">
                  {(form.rules || []).map((rule) => <li key={rule}>{rule}</li>)}
                </ul>
              </div>

              {/* Buttons */}
              <div className="flex justify-end items-center gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  {labels.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-6 py-2 rounded-lg bg-sky-600 text-white font-semibold"
                >
                  {isCreating ? 'Creating...' : labels.create}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
})
CreateCommunityModal.displayName = 'CreateCommunityModal'

export default CreateCommunityModal
