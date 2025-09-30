'use client'
import { useCallback, useEffect } from "react";

export const useInfiniteScroll = (
  page,
  setPage,
  loaderRef,
  fetchUserPosts,
  user,
  userHasMore
) => {
  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && userHasMore && user?._id) {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchUserPosts(user._id, nextPage, 10);
      }
    },
    [page, userHasMore, user?._id, setPage, fetchUserPosts]
  );

  useEffect(() => {
    if (!loaderRef?.current) return;

    const options = { root: null, rootMargin: "20px", threshold: 1.0 };
    const observer = new IntersectionObserver(handleObserver, options);

    observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [handleObserver, loaderRef]);
};
