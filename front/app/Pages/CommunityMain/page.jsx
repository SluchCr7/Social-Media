'use client'

import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { useCommunity } from '@/app/Context/CommunityContext'
import { useAuth } from '@/app/Context/AuthContext'
import MaidDesign from './MaidDesign'
import { useGetData } from '@/app/Custome/useGetData'

const CommunityPage = () => {
  const { communities, addCommunity } = useCommunity()
  const { user } = useAuth()
  const { userData } = useGetData(user?._id)

  // ✅ استخدم useState فقط للحالات التفاعلية
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [sortBy, setSortBy] = useState('Newest')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [visibleCount, setVisibleCount] = useState(6)

  const [form, setForm] = useState({
    Name: '',
    description: '',
    Category: 'Technology',
    cover: null,
    avatar: null,
    tags: [],
    newTag: '',
    rules: [],
    newRule: '',
  })

  // ✅ دالة ثابتة لزيادة العناصر المعروضة
  const loadMore = useCallback(() => setVisibleCount(v => v + 6), [])

  // ✅ Debounce Search - يقلل re-render الناتج عن الكتابة
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 300)
    return () => clearTimeout(t)
  }, [searchTerm])

  // ✅ استخدم useMemo لتوليد الفئات بدون إعادة حساب غير ضروري
  const categories = useMemo(() => {
    if (!communities?.length) return ['All']
    const cats = new Set(communities.map(c => c.Category || c.category || 'Other'))
    return ['All', ...Array.from(cats).slice(0, 12)]
  }, [communities])

  // ✅ فلترة وفرز البيانات - مكلفة => استخدم useMemo
  const filtered = useMemo(() => {
    if (!communities?.length) return []

    const s = debouncedSearch.toLowerCase()

    const results = communities
      .filter(c => activeCategory === 'All' || (c.Category || c.category) === activeCategory)
      .filter(c => {
        if (!s) return true
        const name = (c.Name || c.name || '').toLowerCase()
        const desc = (c.description || '').toLowerCase()
        const cat = ((c.Category || c.category) || '').toLowerCase()
        return name.includes(s) || desc.includes(s) || cat.includes(s)
      })
      .map(c => ({ ...c, _membersCount: (c.members || []).length }))

    // ✅ استخدم switch بدل ifs
    switch (sortBy) {
      case 'Most Members':
        results.sort((a, b) => b._membersCount - a._membersCount)
        break
      case 'A-Z':
        results.sort((a, b) =>
          (a.Name || a.name || '').localeCompare(b.Name || b.name || '')
        )
        break
      default:
        results.sort(
          (a, b) =>
            new Date(b.createdAt || b.CreatedAt) - new Date(a.createdAt || a.CreatedAt)
        )
        break
    }

    return results
  }, [communities, activeCategory, debouncedSearch, sortBy])

  // ✅ Scroll handler محسن ومُزال بعد التفكيك
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
        loadMore()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loadMore])

  // ✅ تثبيت دالة الإنشاء عبر useCallback
  const handleCreate = useCallback(async (e) => {
    e.preventDefault()
    if (!form.Name.trim() || !form.description.trim()) return

    try {
      setIsCreating(true)
      await addCommunity?.({
        Name: form.Name.trim(),
        Category: form.Category,
        description: form.description.trim(),
        tags: form.tags,
        rules: form.rules,
      })
      setForm({
        Name: '',
        description: '',
        Category: 'Technology',
        cover: null,
        avatar: null,
        tags: [],
        newTag: '',
        rules: [],
        newRule: '',
      })
      setShowCreateModal(false)
    } catch (err) {
      console.error('Create community error', err)
    } finally {
      setIsCreating(false)
    }
  }, [form, addCommunity])

  return (
    <MaidDesign
      user={userData}
      categories={categories}
      activeCategory={activeCategory}
      setActiveCategory={setActiveCategory}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      sortBy={sortBy}
      setSortBy={setSortBy}
      filtered={filtered}
      visibleCount={visibleCount}
      showCreateModal={showCreateModal}
      setShowCreateModal={setShowCreateModal}
      form={form}
      setForm={setForm}
      handleCreate={handleCreate}
      isCreating={isCreating}
    />
  )
}

export default React.memo(CommunityPage)
