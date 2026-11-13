'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { usePost } from '@/app/redux/hooks';
import { useAuth } from '@/app/redux/hooks';
import { useComment } from '@/app/redux/hooks';
import { useGetPostByIdQuery } from '@/app/redux/features/posts/postsApi';
import Loading from '@/app/Component/Loading';
import { renderTextWithMentionsHashtagsAndLinks } from '@/app/utils/CheckText';
import useDocumentTitle from '@/app/hooks/useDocumentTitle';
import DesignPostSelect from './Design';

const PostPage = ({ params }) => {
  const id = params.id;
  const { user, isLogin } = useAuth();
  const {
    likePost,
    savePost,
    sharePost,
    sharePostExternally,
    setImageView,
    viewPost,
    hahaPost,
  } = usePost();
  const postQuery = useGetPostByIdQuery(id, { skip: !id });
  const post = postQuery.currentData || null;
  const {
    comments,
    AddComment,
    isLoading,
    hasMore,
    isFetchingMore,
    loadMoreComments,
  } = useComment({ targetId: id, targetType: 'Post' });
  const [openModel, setOpenModel] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  useDocumentTitle(post?.owner?.username ? `${post.owner.username}'s post` : null);

  const viewRequests = useRef(new Set());

  useEffect(() => {
    if (!user?._id || post?._id !== id || post.owner?._id === user._id) return;

    const requestKey = `${id}:${user._id}`;
    if (viewRequests.current.has(requestKey)) return;
    viewRequests.current.add(requestKey);

    viewPost(id);
  }, [id, post, user?._id, viewPost]);

  const handleLoadMore = useCallback(async () => {
    if (!isFetchingMore && hasMore) await loadMoreComments();
  }, [hasMore, isFetchingMore, loadMoreComments]);

  const handleAddComment = useCallback(async () => {
    if (!commentText.trim() || !post?._id) return;

    try {
      await AddComment({ text: commentText, targetId: post._id, targetType: 'Post' });
      setCommentText('');
    } catch (err) {
      console.error(err);
    }
  }, [commentText, post?._id, AddComment]);


  if (!post) {
    if (postQuery.isError) {
      return <div role="alert" className="p-8 text-center text-red-500">
        {postQuery.error?.data?.message || 'Could not load this post.'}
      </div>;
    }
    return <Loading />;
  }

  const isShared = post.isShared && post.originalPost;
  const original = post.originalPost;
  const isCommunityPost = post.community !== null;
  const canComment = () => {
    if (user?._id === post?.owner?._id) return true;
    if (post.privacy === 'public') return true;

    if (post.privacy === 'friends') {
      const isFollower = post.owner?.followers?.some(f => f._id === user._id);
      const isFollowing = post.owner?.following?.some(f => f._id === user._id);
      return isFollower || isFollowing;
    }

    return false;
  }
  return (
    <DesignPostSelect
      post={post}
      isShared={isShared}
      original={original}
      user={user}
      isLogin={isLogin}
      isCommunityPost={isCommunityPost}
      showMenu={showMenu}
      setShowMenu={setShowMenu}
      likePost={likePost}
      hahaPost={hahaPost}
      sharePost={sharePost}
      sharePostExternally={sharePostExternally}
      savePost={savePost}
      setImageView={setImageView}
      renderTextWithMentionsAndHashtags={renderTextWithMentionsHashtagsAndLinks}
      comments={comments}
      isLoading={isLoading}
      commentText={commentText}
      setCommentText={setCommentText}
      handleAddComment={handleAddComment}
      openModel={openModel}
      setOpenModel={setOpenModel}
      canComment={canComment}
      hasMore={hasMore}
      handleLoadMore={handleLoadMore}
      loadingMore={isFetchingMore}
    />
  );
};



export default PostPage;
