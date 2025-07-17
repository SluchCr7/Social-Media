'use client';
import React, { useState, useEffect } from 'react';
import { useNews } from '../Context/NewsContext';
import Image from 'next/image';
import Link from 'next/link';
import { FiX } from 'react-icons/fi';

const categories = ['general', 'world', 'business', 'technology', 'sports', 'science', 'health'];
const countries = ['us', 'gb', 'eg', 'fr', 'de'];
const languages = ['en', 'ar', 'fr', 'de'];

const MenuAllNews = ({showAllNews ,setShowAllNews}) => {
  const { news, fetchAllNews } = useNews();
  const [filters, setFilters] = useState({
    category: 'general',
    country: 'us',
    lang: 'en',
  });
  const [numNews , setNumNews] = useState(10)
  useEffect(() => {
    fetchAllNews(filters);
  }, [filters]);

  const handleChange = (e) => {
    setFilters(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className={`fixed inset-0 z-[1000] bg-black bg-opacity-60 ${showAllNews? "flex" : "hidden"} items-center justify-center p-4`}>
      <div className="bg-white dark:bg-[#121212] w-full max-w-3xl rounded-xl p-3 overflow-hidden shadow-xl">
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">📰 All News</h2>
          <span onClick={() => {
            setShowAllNews(false);
            setFilters({
              category: 'general',
              country: 'us',
              lang: 'en',
            });
          }}><FiX /></span>
        </div>

        {/* الفلاتر */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 py-3 bg-gray-50 dark:bg-[#1e1e1e]">
          <select name="category" value={filters.category} onChange={handleChange} className="p-2 rounded-md bg-white dark:bg-gray-800 text-sm dark:text-white">
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select name="country" value={filters.country} onChange={handleChange} className="p-2 rounded-md bg-white dark:bg-gray-800 text-sm dark:text-white">
            {countries.map(ct => (
              <option key={ct} value={ct}>{ct.toUpperCase()}</option>
            ))}
          </select>

          <select name="lang" value={filters.lang} onChange={handleChange} className="p-2 rounded-md bg-white dark:bg-gray-800 text-sm dark:text-white">
            {languages.map(l => (
              <option key={l} value={l}>{l.toUpperCase()}</option>
            ))}
          </select>
        </div>

        {/* قائمة الأخبار */}
        <ul className="max-h-[60vh] overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
            {news
                .filter(item => item?.image)
                .map((item, index) => (
                <li key={index}>
                    <Link
                    href={item?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-4 p-4 hover:bg-gray-100 dark:hover:bg-[#1e2025] transition"
                    >
                    <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 leading-snug line-clamp-2">
                        {item?.title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(item?.publishedAt).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-200 dark:bg-gray-800">
                        <Image
                        src={item?.image}
                        alt="news"
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                        unoptimized
                        />
                    </div>
                    </Link>
                </li>
                )).slice(0, numNews)
            }
              </ul>
              <button onClick={()=> setNumNews((prev)=> prev + 1)} className="w-full bg-transparent text-lightMode-fg dark:text-darkMode-fg text-sm font-bold p-3 hover:bg-gray-200 dark:hover:bg-gray-800">View More</button>
      </div>
    </div>
  );
};

export default MenuAllNews;
