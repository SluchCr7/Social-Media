'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { usePost } from '@/app/redux/hooks';
import { useAuth } from '@/app/redux/hooks';
import { useComment } from '@/app/redux/hooks';
import Loading from '@/app/Component/Loading';
import { renderTextWithMentionsHashtagsAndLinks } from '@/app/utils/CheckText';
import useDocumentTitle from '@/app/hooks/useDocumentTitle';
import DesignPostSelect from './Design';

const PostPage = ({ params }) => {
  const id = params.id;
  const { user, isLogin } = useAuth();
  const { posts, likePost, savePost, sharePost, setImageView, viewPost, hahaPost, getPostById } = usePost();
  const { comments, AddComment, isLoading, fetchCommentsByTarget } = useComment();
  const [openModel, setOpenModel] = useState(false);
  const [post, setPost] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  useDocumentTitle(post?.owner?.username ? `${post.owner.username}'s post` : null);

  // Pagination State
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const viewRequests = useRef(new Set());

  useEffect(() => {
    let active = true;
    setPost(null);

    getPostById(id).then((fetchedPost) => {
      if (active && fetchedPost?._id === id) setPost(fetchedPost);
    });

    return () => {
      active = false;
    };
  }, [id, getPostById]);

  useEffect(() => {
    const matchedPost = posts.find((item) => item?._id === id);
    if (matchedPost) setPost(matchedPost);
  }, [id, posts]);

  useEffect(() => {
    if (!user?._id || post?._id !== id || post.owner?._id === user._id) return;

    const requestKey = `${id}:${user._id}`;
    if (viewRequests.current.has(requestKey)) return;
    viewRequests.current.add(requestKey);

    viewPost(id).then((viewResult) => {
      if (viewResult && viewResult._id === id) {
        setPost((currentPost) =>
          currentPost?._id === id ? { ...currentPost, viewsCount: viewResult.viewsCount } : currentPost
        );
      }
    });
  }, [id, post, user?._id, viewPost]);

  // Initial Fetch
  useEffect(() => {
    if (!post?._id) return;
    const load = async () => {
      const res = await fetchCommentsByTarget(post._id, 'Post');
      if (res) {
        setNextCursor(res.nextCursor);
        setHasMore(res.hasMore);
      }
    };
    load();
  }, [post?._id, fetchCommentsByTarget]);

  // Load More Handler
  const handleLoadMore = useCallback(async () => {
    if (loadingMore || !hasMore || !post?._id) return;
    setLoadingMore(true);
    const res = await fetchCommentsByTarget(post._id, 'Post', nextCursor);
    if (res) {
      setNextCursor(res.nextCursor);
      setHasMore(res.hasMore);
    }
    setLoadingMore(false);
  }, [loadingMore, hasMore, nextCursor, post?._id, fetchCommentsByTarget]);

  const handleAddComment = useCallback(async () => {
    if (!commentText.trim() || !post?._id) return;

    try {
      await AddComment({ text: commentText, targetId: post._id, targetType: 'Post' });
      setCommentText('');
    } catch (err) {
      console.error(err);
    }
  }, [commentText, post?._id, AddComment]);


  if (!post) return <Loading />;

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
      loadingMore={loadingMore}
    />
  );
};



export default PostPage;
