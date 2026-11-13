'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useNews } from '@/app/redux/hooks';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FiArrowUpRight,
  FiCalendar,
  FiChevronDown,
  FiExternalLink,
  FiFilter,
  FiGlobe,
  FiLoader,
  FiX,
} from 'react-icons/fi';

const categories = ['general', 'world', 'business', 'technology', 'sports', 'science', 'health'];
const countries = ['us', 'gb', 'eg', 'fr', 'de'];
const languages = ['en', 'ar', 'fr', 'de'];
const defaultFilters = { category: 'general', country: 'us', lang: 'en' };

const MenuAllNews = ({ showAllNews, setShowAllNews }) => {
  const [filters, setFilters] = useState(defaultFilters);
  const { news, loading, error } = useNews(filters);
  const [numNews, setNumNews] = useState(10);
  const { t } = useTranslation();
  const allNews = Array.isArray(news) ? news : [];
  const visibleNews = allNews.filter((item) => item?.image && item?.url);

  const handleClose = useCallback(() => {
    setShowAllNews(false);
    setFilters({ ...defaultFilters });
    setNumNews(10);
  }, [setShowAllNews]);

  useEffect(() => {
    if (!showAllNews) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') handleClose();
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showAllNews, handleClose]);

  const handleChange = (event) => {
    setFilters((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
    setNumNews(10);
  };

  return (
    <AnimatePresence>
      {showAllNews && (
        <motion.div
          className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.button
            type="button"
            aria-label={t('Cancel')}
            onClick={handleClose}
            className="absolute inset-0 cursor-default bg-slate-950/60 backdrop-blur-sm"
          />

          <motion.section
            role="dialog"
            aria-modal="true"
            aria-labelledby="all-news-title"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative flex h-[min(90vh,860px)] w-full max-w-5xl flex-col overflow-hidden rounded-[1.75rem] border border-gray-200 bg-white shadow-2xl shadow-slate-950/20 dark:border-white/10 dark:bg-[#0D1220] dark:shadow-black/40"
          >
            <header className="shrink-0 border-b border-gray-100 bg-white px-5 py-5 dark:border-white/5 dark:bg-[#0D1220] sm:px-8 sm:py-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
                    <FiGlobe size={23} />
                  </div>
                  <div className="min-w-0">
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-300">
                      {t('News')}
                    </p>
                    <h2
                      id="all-news-title"
                      className="truncate text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl"
                    >
                      {t('All News')}
                    </h2>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <span className="hidden rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600 dark:bg-white/5 dark:text-gray-300 sm:inline-flex">
                    {visibleNews.length} {t('Results')}
                  </span>
                  <button
                    type="button"
                    onClick={handleClose}
                    aria-label={t('Cancel')}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 dark:border-white/10 dark:text-gray-400 dark:hover:border-white/20 dark:hover:bg-white/5 dark:hover:text-white"
                  >
                    <FiX size={20} />
                  </button>
                </div>
              </div>
            </header>

            <section className="shrink-0 border-b border-gray-100 bg-gray-50/80 px-5 py-4 dark:border-white/5 dark:bg-white/[0.02] sm:px-8">
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
                <FiFilter className="text-indigo-500" />
                {t('Filters')}
                {loading && (
                  <FiLoader className="ml-auto animate-spin text-indigo-500" aria-label={t('Loading')} />
                )}
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  {
                    name: 'category',
                    label: t('Category'),
                    value: filters.category,
                    options: categories.map((category) => ({
                      value: category,
                      label: `${category.charAt(0).toUpperCase()}${category.slice(1)}`,
                    })),
                  },
                  {
                    name: 'country',
                    label: t('Country'),
                    value: filters.country,
                    options: countries.map((country) => ({
                      value: country,
                      label: country.toUpperCase(),
                    })),
                  },
                  {
                    name: 'lang',
                    label: t('Language'),
                    value: filters.lang,
                    options: languages.map((language) => ({
                      value: language,
                      label: language.toUpperCase(),
                    })),
                  },
                ].map((filter) => (
                  <label key={filter.name} className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      {filter.label}
                    </span>
                    <span className="relative block">
                      <select
                        name={filter.name}
                        value={filter.value}
                        onChange={handleChange}
                        className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white px-3.5 pr-10 text-sm font-medium text-gray-800 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 dark:border-white/10 dark:bg-[#151B2B] dark:text-gray-100 dark:focus:border-indigo-400"
                      >
                        {filter.options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <FiChevronDown
                        aria-hidden="true"
                        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                    </span>
                  </label>
                ))}
              </div>
            </section>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-8 sm:py-6">
              {error && !loading && visibleNews.length === 0 && (
                <div className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50/70 px-6 text-center dark:border-red-400/10 dark:bg-red-400/5">
                  <p className="text-sm font-semibold text-red-700 dark:text-red-300">{error}</p>
                </div>
              )}

              {loading && visibleNews.length === 0 && (
                <div className="flex min-h-56 flex-col items-center justify-center text-center">
                  <FiLoader className="mb-3 animate-spin text-2xl text-indigo-500" />
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {t('Loading')}...
                  </p>
                </div>
              )}

              {!loading && !error && visibleNews.length === 0 && (
                <div className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/70 px-6 text-center dark:border-white/10 dark:bg-white/[0.02]">
                  <FiGlobe className="mb-3 text-3xl text-gray-300 dark:text-gray-600" />
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    {t('No recent news available in this category.')}
                  </p>
                </div>
              )}

              {visibleNews.length > 0 && (
                <div className="space-y-3">
                  {error && !loading && (
                    <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-400/5 dark:text-red-300">
                      {error}
                    </p>
                  )}
                  {visibleNews.slice(0, numNews).map((item, index) => {
                    const publishedDate =
                      item?.publishedAt && !Number.isNaN(Date.parse(item.publishedAt))
                        ? new Date(item.publishedAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : null;

                    return (
                      <motion.article
                        key={item.url || `${item.title}-${index}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.18, delay: Math.min(index * 0.025, 0.2) }}
                      >
                        <Link
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex gap-3 rounded-2xl border border-gray-100 bg-white p-3 transition hover:border-indigo-200 hover:bg-indigo-50/40 hover:shadow-sm dark:border-white/5 dark:bg-white/[0.02] dark:hover:border-indigo-400/20 dark:hover:bg-indigo-400/[0.04] sm:gap-5 sm:p-4"
                        >
                          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-white/5 sm:h-28 sm:w-36">
                            <Image
                              src={item.image}
                              alt=""
                              fill
                              sizes="(max-width: 640px) 96px, 144px"
                              className="object-cover transition duration-500 group-hover:scale-105"
                              unoptimized
                            />
                            <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg bg-black/45 text-white backdrop-blur-sm">
                              <FiExternalLink size={14} />
                            </span>
                          </div>

                          <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                              <span className="max-w-[12rem] truncate text-indigo-600 dark:text-indigo-300">
                                {item?.source?.name || t('News')}
                              </span>
                              {publishedDate && (
                                <span className="inline-flex items-center gap-1.5">
                                  <FiCalendar aria-hidden="true" />
                                  {publishedDate}
                                </span>
                              )}
                            </div>

                            <h3 className="my-2 line-clamp-3 text-sm font-semibold leading-relaxed text-gray-900 transition-colors group-hover:text-indigo-700 dark:text-gray-100 dark:group-hover:text-indigo-200 sm:text-base">
                              {item.title}
                            </h3>

                            <span className="inline-flex items-center gap-1 self-start text-xs font-semibold text-indigo-600 dark:text-indigo-300">
                              {t('News')}
                              <FiArrowUpRight className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                            </span>
                          </div>
                        </Link>
                      </motion.article>
                    );
                  })}
                </div>
              )}
            </div>

            {numNews < visibleNews.length && (
              <footer className="shrink-0 border-t border-gray-100 bg-white px-5 py-4 dark:border-white/5 dark:bg-[#0D1220] sm:px-8">
                <button
                  type="button"
                  onClick={() => setNumNews((current) => current + 10)}
                  className="mx-auto flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 dark:border-white/10 dark:text-gray-200 dark:hover:border-indigo-400/20 dark:hover:bg-indigo-400/10 dark:hover:text-indigo-200"
                >
                  {t('View More')}
                  <FiChevronDown />
                </button>
              </footer>
            )}
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MenuAllNews;
