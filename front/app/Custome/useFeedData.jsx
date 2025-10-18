import { useMemo, useRef, useCallback, useEffect } from "react";

export const useFeedData = ({
  posts,
  following,
  activeTab,
  userData,
  suggestedUsers,
  communities,
  hasMore,
  isLoading,
  setPage,
}) => {
  const userId = userData?._id;

  // 🧩 فلترة المنشورات
  const filteredPosts = useMemo(() => {
    if (!Array.isArray(posts)) return [];

    const sortedByDate = (arr) =>
      arr.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    switch (activeTab) {
      case "following":
        return sortedByDate(
          posts.filter((p) => following?.includes(p?.owner?._id))
        );

      case "foryou":
        if (!userData?.interests?.length) return sortedByDate(posts);

        const matched = posts
          .map((post) => {
            const text = `
              ${post?.text || ""}
              ${post?.Hashtags?.join(" ") || ""}
              ${post?.owner?.description || ""}
            `.toLowerCase();

            const score = userData.interests.reduce(
              (acc, interest) =>
                text.includes(interest.toLowerCase()) ? acc + 1 : acc,
              0
            );

            return { post, score };
          })
          .filter((i) => i.score > 0)
          .sort((a, b) => b.score - a.score)
          .map((i) => i.post);

        return matched.length ? matched : sortedByDate(posts);

      default:
        return sortedByDate(posts);
    }
  }, [posts, following, activeTab, userData?.interests]);

  // 🧩 اقتراحات المستخدمين والمجتمعات
  const filteredUsers = useMemo(
    () =>
      (suggestedUsers || []).filter(
        (u) => !following?.some((f) => f?._id === u?._id)
      ),
    [suggestedUsers, following]
  );

  const filteredCommunities = useMemo(
    () =>
      (communities || []).filter(
        (c) => !c.members?.some((m) => m?._id === userId)
      ),
    [communities, userId]
  );

  // 🧩 دمج المحتوى والاقتراحات
  const combinedItems = useMemo(() => {
    if (!Array.isArray(filteredPosts)) return [];
    const items = [];
    const interval = Math.floor(filteredPosts.length / 4) || 5;

    filteredPosts.forEach((post, i) => {
      items.push({ type: "post", data: post });
      if ((i + 1) % interval === 0 && filteredUsers.length)
        items.push({ type: "user", data: filteredUsers.slice(0, 3) });
      if ((i + 1) % (interval * 2) === 0 && filteredCommunities.length)
        items.push({ type: "community", data: filteredCommunities.slice(0, 3) });
    });

    return items;
  }, [filteredPosts, filteredUsers, filteredCommunities]);

  // 🧩 Infinite Scroll
  const observer = useRef();
  const lastItemRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) setPage((p) => p + 1);
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  return { combinedItems, lastItemRef, filteredPosts };
};
