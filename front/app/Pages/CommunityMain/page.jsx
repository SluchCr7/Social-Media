'use client';
import React, { useEffect, useState } from 'react';
import { useCommunity } from '@/app/Context/CommunityContext';
import { FaPlus, FaFilter } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';

const CommunityPage = () => {
  const { community, addCommunity } = useCommunity();
  const [filterCategory, setFilterCategory] = useState('All');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Technology',
  });

  const categories = [...new Set(community.map(c => c.Category))];

  useEffect(() => {
    console.log(community);
  }, [community]);

  const handleCreate = (e) => {
    e.preventDefault();
    addCommunity(formData.name, formData.category, formData.description);
    setFormData({ name: '', description: '', category: 'Technology' });
  };

  const filtered = filterCategory === 'All'
    ? community
    : community.filter(c => c.Category === filterCategory);

  return (
    <div className="w-full px-6 py-10 space-y-16">
      {/* Hero */}
      <div className="text-start space-y-2">
        <h1 className="text-5xl font-bold tracking-tight">🌐 Community Hub</h1>
        <p className="text-gray-500 dark:text-gray-300">Connect, create, and explore your passions.</p>
      </div>

      {/* Create Community Form */}
      <form onSubmit={handleCreate} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow space-y-6">
        <h2 className="text-2xl font-semibold flex items-center gap-3 text-blue-600 dark:text-blue-400">
          <FaPlus /> Create New Community
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
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
            {[
              'Technology', 'Art', 'Science', 'Gaming', 'Music', 'Food',
              'Travel', 'Health', 'Business', 'Politics', 'Sports', 'Other'
            ].map((cat, i) => (
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

      {/* Filter Section */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <FaFilter className="text-gray-500 dark:text-gray-400" />
          <span className="text-sm">Filter by Category:</span>
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="p-2 rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
        >
          <option value="All">All</option>
          {categories.map((cat, idx) => (
            <option key={idx}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Community Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((comm) => (
          <Link
            href={`/Pages/Community/${comm._id}`}
            key={comm._id}
            className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow hover:shadow-lg transition"
          >
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
            <div className="pt-10 pb-5 px-4 text-center space-y-1">
              <h3 className="text-lg font-semibold">{comm.Name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{comm.description}</p>
              <p className="text-sm text-blue-500">{comm.members?.length || 0} followers</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CommunityPage;
