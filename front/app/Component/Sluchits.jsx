import React from 'react';
import SluchitEntry from './SluchitEntry';
import { usePost } from '../Context/PostContext';
import { useAuth } from '../Context/AuthContext';
import PostSkeleton from '../Skeletons/PostSkeleton'; 
const Sluchits = () => {
  const { posts, isLoading } = usePost();
  const { user } = useAuth();
  const following = user?.following;

  const sortedPosts = posts
    ?.slice()
    ?.sort((a, b) => {
      const isAFollowed = following?.includes(a?.owner?._id);
      const isBFollowed = following?.includes(b?.owner?._id);

      if (isAFollowed && !isBFollowed) return -1;
      if (!isAFollowed && isBFollowed) return 1;

      return new Date(b?.createdAt) - new Date(a?.createdAt);
    });
    if (posts.length === 0) {
      return (
        <div className="w-full flex items-start flex-col gap-8">
          {Array.from({ length: 4 }).map((_, i) => <PostSkeleton key={i} />)}
        </div>
      );
    }
  return (
    <div className="w-full flex items-start flex-col gap-8">
      {isLoading
        ? Array.from({ length: 4 }).map((_, i) => <PostSkeleton key={i} />)
        : sortedPosts?.map((post) => <SluchitEntry key={post?._id} post={post} />)
      }
    </div>
  );
};

export default Sluchits;
