'use client';

import React, { memo, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HiArrowRight, HiHashtag, HiPhoto, HiVideoCamera } from 'react-icons/hi2';
import { useTranslation } from 'react-i18next';
import { usePost } from '@/app/redux/hooks';
import ExploreSearchBar from '../../Component/Explore/ExploreSearchBar';
import SearchResults from '../../Component/Explore/SearchResults';
import ExploreTabs from '../../Component/Explore/ExploreTabs';
import ExploreSkeleton from '../../Skeletons/ExploreSkeleton';
import UserCard from '../../Component/UserCard';

const PhotoCard = memo(({ url, postId }) => {
  const { setImageView } = usePost();

  return (
    <button
      type="button"
      onClick={() => setImageView({ url, postUrl: `/Pages/Post/${postId}` })}
      className="group relative aspect-square overflow-hidden rounded-2xl bg-slate-100 text-left dark:bg-white/5"
      aria-label="View photo"
    >
      <Image
        src={url}
        alt=""
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <span className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/15" />
    </button>
  );
});
PhotoCard.displayName = 'PhotoCard';

const DesignExplore = ({
  search,
  setSearch,
  searchResults,
  searchLoading,
  activeTab,
  setActiveTab,
  topHashtags = [],
  user,
  posts = [],
  suggestedUsersArr = [],
  loading = false,
  error,
  hasMore = false,
  loadMore,
  refreshExplore,
}) => {
  const { t } = useTranslation();
  const hasSearchQuery = search.trim().length > 0;
  const tabs = useMemo(
    () => [
      { name: 'Trending', icon: HiArrowRight },
      { name: 'Photos', icon: HiPhoto },
      { name: 'Videos', icon: HiVideoCamera },
      { name: 'Hashtags', icon: HiHashtag },
      { name: 'Creators', icon: HiArrowRight },
    ],
    []
  );

  const photos = useMemo(
    () =>
      posts.flatMap((post) => [
        ...(post.media || [])
          .filter((media) => media.type === 'image' && media.url)
          .map((media) => ({ url: media.url, postId: post._id })),
        ...(post.Photos || []).map((photo) => ({
          url: typeof photo === 'string' ? photo : photo?.url,
          postId: post._id,
        })),
      ]).filter((photo) => photo.url),
    [posts]
  );

  const videos = useMemo(
    () =>
      posts.flatMap((post) => [
        ...(post.media || [])
          .filter((media) => media.type === 'video' && media.url)
          .map((media) => ({ url: media.url, postId: post._id })),
        ...(post.Videos || []).map((video) => ({
          url: typeof video === 'string' ? video : video?.url,
          postId: post._id,
        })),
      ]).filter((video) => video.url),
    [posts]
  );

  const isInitialLoading = loading && posts.length === 0;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 dark:bg-[#080b12] dark:text-white sm:px-6 lg:px-8 w-full">
      <div className="mx-auto w-full max-w-6xl space-y-8">
        <header className="space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                {t('Find your next favorite')}
              </p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">{t('Explore')}</h1>
              <p className="mt-2 max-w-xl text-sm text-slate-500 dark:text-slate-400">
                {t('Discover people, ideas and conversations picked for you.')}
              </p>
            </div>
            <Link
              href="/Pages/Search"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold transition hover:border-indigo-300 dark:border-white/10 dark:bg-white/5"
            >
              {t('Advanced search')}
              <HiArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <ExploreSearchBar
            search={search}
            setSearch={setSearch}
            placeholder={t('Search creators, hashtags and posts')}
          />
        </header>

        {hasSearchQuery ? (
          <section
            aria-live="polite"
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.03] sm:p-7"
          >
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">
                {t('Results for')} <span className="text-indigo-600 dark:text-indigo-400">{search}</span>
              </h2>
              {searchLoading && (
                <span className="text-sm text-slate-500" role="status">{t('Searching...')}</span>
              )}
            </div>
            <SearchResults
              searchResults={searchResults}
              searchQuery={search}
              user={user}
              t={t}
              maxResults={6}
            />
            <Link
              href={`/Pages/Search?q=${encodeURIComponent(search.trim())}`}
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
            >
              {t('See all results')}
              <HiArrowRight className="h-4 w-4" />
            </Link>
          </section>
        ) : (
          <>
            <ExploreTabs allTabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

            {isInitialLoading ? (
              <ExploreSkeleton />
            ) : error ? (
              <div className="rounded-3xl border border-rose-200 bg-white p-8 text-center dark:border-rose-900/50 dark:bg-white/[0.03]">
                <p className="text-sm text-slate-600 dark:text-slate-300">{t(error)}</p>
                <button
                  type="button"
                  onClick={refreshExplore}
                  className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                >
                  {t('Try again')}
                </button>
              </div>
            ) : (
              <section className="space-y-6">
                {activeTab === 'Trending' && (
                  posts.length ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {posts.map((post) => {
                        const cover = post.media?.find((media) => media.type === 'image')?.url
                          || post.Photos?.[0]?.url
                          || post.Photos?.[0];
                        return (
                          <Link
                            key={post._id}
                            href={`/Pages/Post/${post._id}`}
                            className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-white/[0.03]"
                          >
                            {cover ? (
                              <div className="relative aspect-[4/3] bg-slate-100 dark:bg-white/5">
                                <Image
                                  src={cover}
                                  alt=""
                                  fill
                                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                              </div>
                            ) : null}
                            <div className="p-4">
                              <p className="line-clamp-3 text-sm text-slate-700 dark:text-slate-200">
                                {post.text || t('View this post')}
                              </p>
                              <p className="mt-3 text-xs text-slate-500">
                                {post.owner?.profileName || post.owner?.username || ''}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  ) : <EmptyState label={t('Nothing trending yet. Check back soon.')} />
                )}

                {activeTab === 'Photos' && (
                  photos.length ? (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                      {photos.map((photo, index) => (
                        <PhotoCard key={`${photo.postId}-${photo.url}-${index}`} {...photo} />
                      ))}
                    </div>
                  ) : <EmptyState label={t('No photos to show yet.')} />
                )}

                {activeTab === 'Videos' && (
                  videos.length ? (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                      {videos.map((video, index) => (
                        <Link
                          key={`${video.postId}-${video.url}-${index}`}
                          href={`/Pages/Post/${video.postId}`}
                          className="relative aspect-square overflow-hidden rounded-2xl bg-slate-900"
                        >
                          <video src={video.url} muted playsInline preload="none" className="h-full w-full object-cover" />
                          <span className="absolute bottom-3 right-3 rounded-full bg-black/60 p-2 text-white">
                            <HiVideoCamera className="h-4 w-4" />
                          </span>
                        </Link>
                      ))}
                    </div>
                  ) : <EmptyState label={t('No videos to show yet.')} />
                )}

                {activeTab === 'Hashtags' && (
                  topHashtags.length ? (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {topHashtags.map(([tag, count]) => (
                        <Link
                          key={tag}
                          href={`/Pages/Hashtag/${encodeURIComponent(tag)}`}
                          className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-indigo-300 hover:shadow-sm dark:border-white/10 dark:bg-white/[0.03]"
                        >
                          <span className="flex items-center gap-3">
                            <span className="rounded-xl bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                              <HiHashtag className="h-4 w-4" />
                            </span>
                            <span className="font-semibold">{tag}</span>
                          </span>
                          <span className="text-xs text-slate-500">{count}</span>
                        </Link>
                      ))}
                    </div>
                  ) : <EmptyState label={t('No trending hashtags yet.')} />
                )}

                {activeTab === 'Creators' && (
                  suggestedUsersArr.length ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {suggestedUsersArr.map((creator) => (
                        <UserCard key={creator._id} user={creator} t={t} />
                      ))}
                    </div>
                  ) : <EmptyState label={t('No creators to suggest yet.')} />
                )}

                {hasMore && (
                  <div className="flex justify-center pt-2">
                    <button
                      type="button"
                      onClick={loadMore}
                      disabled={loading}
                      className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold transition hover:border-indigo-300 disabled:cursor-wait disabled:opacity-60 dark:border-white/10 dark:bg-white/5"
                    >
                      {loading ? t('Loading...') : t('Load more')}
                    </button>
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
};

const EmptyState = ({ label }) => (
  <div className="rounded-3xl border border-dashed border-slate-300 py-16 text-center text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
    {label}
  </div>
);

export default memo(DesignExplore);
