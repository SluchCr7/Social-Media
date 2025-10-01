import { useMemo } from "react";


export const usePostYears = (posts = []) => {
  return useMemo(() => {
    if (!posts || posts.length === 0) return [];
    const yearsSet = new Set(
      posts.map((p) => new Date(p.createdAt).getFullYear().toString())
    );
    return Array.from(yearsSet).sort((a, b) => b - a); // ترتيب تنازلي
  }, [posts]);
};
