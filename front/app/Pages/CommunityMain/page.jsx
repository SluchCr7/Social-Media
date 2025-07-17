'use client';
import React, { useEffect, useState } from 'react';
import { useCommunity } from '@/app/Context/CommunityContext';
import { useAuth } from '@/app/Context/AuthContext';
import { FaPlus, FaFilter } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import { generateMeta } from '@/app/utils/MetaDataHelper';



const CommunityPage = () => {
  const { communities, addCommunity } = useCommunity();
  const { user } = useAuth();

  const [filterCategory, setFilterCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('Newest');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Technology',
  });

  const categories = [...new Set(communities.map(c => c.Category))];

  useEffect(() => {
    console.log(communities);
  }, [communities]);

  const handleCreate = (e) => {
    e.preventDefault();
    addCommunity(formData.name, formData.category, formData.description);
    setFormData({ name: '', description: '', category: 'Technology' });
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
        return new Date(b.createdAt) - new Date(a.createdAt); // Newest first
      }
    });

  return (
    <div className="w-full px-6 py-10 space-y-16">
      {/* Hero */}
      <div className="text-start space-y-2">
        <h1 className="text-5xl font-bold tracking-tight">🌐 Community Hub</h1>
        <p className="text-gray-500 dark:text-gray-300 pl-3">Connect, create, and explore your passions.</p>
      </div>

      {/* Create Community Form */}
      <form onSubmit={handleCreate} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg w-full space-y-6">
        <h2 className="text-2xl font-semibold flex items-center gap-3 text-blue-600 dark:text-blue-400">
          <FaPlus /> Create New Community
        </h2>

        <div className="grid md:grid-cols-2 gap-4 w-full">
          <input
            type="text"
            required
            placeholder="Community Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white"
          />
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white"
          >
            <option disabled>-- Choose Category --</option>
            {[ 'Technology', 'Art', 'Science', 'Gaming', 'Music', 'Food', 'Travel', 'Health', 'Business', 'Politics', 'Sports', 'Other' ].map((cat, i) => (
              <option key={i} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <textarea
          required
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white"
          rows={4}
        />

        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
        >
          Create
        </button>
      </form>

      {/* Filter & Search Section */}
      <div className="flex flex-wrap items-center gap-4 w-full">
        <div className="flex items-center gap-2">
          <FaFilter className="text-gray-500 dark:text-gray-400" />
          <span className="text-sm">Filter by:</span>
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="p-2 rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
        >
          <option value="All">All Categories</option>
          {categories.map((cat, idx) => (
            <option key={idx}>{cat}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search communities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 rounded bg-gray-100 dark:bg-gray-700 dark:text-white flex-1 min-w-[200px]"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="p-2 rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
        >
          <option value="Newest">Newest</option>
          <option value="Most Members">Most Members</option>
          <option value="A-Z">A-Z</option>
        </select>
      </div>

      {/* Community Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
        {filtered.map((comm) => (
          <div key={comm._id} className="relative group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-transform transform hover:-translate-y-1">
            <Link href={`/Pages/Community/${comm._id}`}>
              <div className="relative w-full h-32 bg-gray-200 dark:bg-gray-700">
                <Image
                  src={comm?.Cover?.url || '/placeholder-cover.png'}
                  alt={comm.name}
                  layout="fill"
                  objectFit="cover"
                />
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                  <Image
                    src={comm?.Picture?.url || '/placeholder-avatar.png'}
                    alt={comm.Name}
                    width={64}
                    height={64}
                    className="rounded-full border-4 border-white dark:border-gray-800"
                  />
                </div>
              </div>
            </Link>
            <div className="pt-12 pb-5 px-4 text-center space-y-2">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{comm.Name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{comm.description}</p>
              <p className="text-sm text-blue-500">{comm.members?.length || 0} members</p>
              <div className="flex justify-center items-center gap-2 text-xs text-gray-400 dark:text-gray-300">
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">{comm.Category}</span>
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                  {comm.isPrivate ? 'Private' : 'Public'}
                </span>
              </div>
          
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityPage;