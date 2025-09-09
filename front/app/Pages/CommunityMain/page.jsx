'use client';
import React, { useEffect, useState } from 'react';
import { useCommunity } from '@/app/Context/CommunityContext';
import { useAuth } from '@/app/Context/AuthContext';
import { FaPlus, FaFilter, FaUsers, FaSearch } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const CommunityPage = () => {
  const { communities, addCommunity } = useCommunity();
  const { user } = useAuth();

  const [filterCategory, setFilterCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('Newest');
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Technology',
  });

  const categories = [...new Set(communities.map(c => c.Category))];

  const handleCreate = (e) => {
    e.preventDefault();
    addCommunity(formData.name, formData.category, formData.description);
    setFormData({ name: '', description: '', category: 'Technology' });
    setShowModal(false);
  };

  const filtered = communities
    .filter(c =>
      (filterCategory === 'All' || c.Category === filterCategory) &&
      (c.Name.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'Most Members') {
        return (b.members?.length || 0) - (a.members?.length || 0);
      } else if (sortBy === 'A-Z') {
        return a.Name.localeCompare(b.Name);
      } else {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  return (
    <div className="w-full px-6 py-10 space-y-16">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl text-white p-12 overflow-hidden shadow-lg">
        <h1 className="text-5xl font-bold mb-4">🌐 Community Hub</h1>
        <p className="text-lg opacity-90 max-w-2xl">
          Discover, create, and grow your passions with like-minded people.
        </p>
        <button
          onClick={() => setShowModal(true)}
          className="mt-6 px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl shadow hover:scale-105 transition"
        >
          <FaPlus className="inline mr-2" /> Create Community
        </button>
      </div>

      {/* Filter & Search Section */}
      <div className="bg-white p-6 rounded-xl shadow flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-gray-600">
          <FaFilter /> <span className="text-sm">Filter by:</span>
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="p-2 rounded-lg border text-gray-700"
        >
          <option value="All">All Categories</option>
          {categories.map((cat, idx) => (
            <option key={idx}>{cat}</option>
          ))}
        </select>

        <div className="flex items-center flex-1 min-w-[200px] bg-gray-100 rounded-lg px-3">
          <FaSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Search communities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent p-2 w-full focus:outline-none"
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="p-2 rounded-lg border text-gray-700"
        >
          <option value="Newest">Newest</option>
          <option value="Most Members">Most Members</option>
          <option value="A-Z">A-Z</option>
        </select>
      </div>

      {/* Community Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((comm) => (
          <motion.div
            key={comm._id}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition"
          >
            <Link href={`/Pages/Community/${comm._id}`}>
              <div className="relative w-full h-32">
                <Image
                  src={comm?.Cover?.url || '/placeholder-cover.png'}
                  alt={comm.Name}
                  layout="fill"
                  objectFit="cover"
                />
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
                  <Image
                    src={comm?.Picture?.url || '/placeholder-avatar.png'}
                    alt={comm.Name}
                    width={72}
                    height={72}
                    className="rounded-full border-4 border-white"
                  />
                </div>
              </div>
            </Link>

            <div className="pt-12 pb-6 px-4 text-center space-y-3">
              <h3 className="text-lg font-semibold text-gray-800">{comm.Name}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{comm.description}</p>
              <div className="flex justify-center items-center gap-2 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <FaUsers /> {comm.members?.length || 0}
                </span>
                <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">{comm.Category}</span>
                <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                  {comm.isPrivate ? 'Private' : 'Public'}
                </span>
              </div>
              <div className="flex justify-center gap-3 mt-3">
                <Link href={`/Pages/Community/${comm._id}`}>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    View
                  </button>
                </Link>
                <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition">
                  Join
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal for Create Community */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-8 space-y-6"
            >
              <h2 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                <FaPlus /> Create New Community
              </h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <input
                  type="text"
                  required
                  placeholder="Community Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 rounded-lg border"
                />
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-3 rounded-lg border"
                >
                  <option disabled>-- Choose Category --</option>
                  {[ 'Technology', 'Art', 'Science', 'Gaming', 'Music', 'Food', 'Travel', 'Health', 'Business', 'Politics', 'Sports', 'Other' ].map((cat, i) => (
                    <option key={i} value={cat}>{cat}</option>
                  ))}
                </select>
                <textarea
                  required
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 rounded-lg border"
                  rows={4}
                />
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                  >
                    Create
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommunityPage;