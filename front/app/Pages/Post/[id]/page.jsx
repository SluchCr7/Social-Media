'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { usePost } from '@/app/Context/PostContext';
import { useAuth } from '@/app/Context/AuthContext';
import { useComment } from '@/app/Context/CommentContext';
import Loading from '@/app/Component/Loading';
import { renderTextWithMentionsAndHashtags } from '@/app/utils/CheckText';
import DesignPostSelect from './Design';

const PostPage = ({ params }) => {
  const id = params.id;
  const { user, isLogin } = useAuth();
  const { posts, likePost, savePost, sharePost, setImageView, viewPost,hahaPost } = usePost();
  const { comments, AddComment,hasMore,setPage,setHasMore, isLoading , page,pages,fetchCommentsByPostId,} = useComment();
  const [openModel, setOpenModel] = useState(false);
  const [post, setPost] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const matchedPost = posts.find(p => p?._id === id);
    if (matchedPost) setPost(matchedPost);
  }, [id, posts]);

  useEffect(() => {
    if (!post) return;
    fetchCommentsByPostId(post._id);
  }, [post?._id]); // ✅ فقط الـid، لا تضع post كامل


  useEffect(() => {
    if (post?._id) {
      viewPost(post._id);
    }
  }, [post?._id]); // فقط الـid
  
  const handleAddComment = useCallback(async () => {
    if (!commentText.trim()) return;

    try {
      await AddComment(commentText, post._id, post.owner._id);
      setCommentText('');
    } catch (err) {
      console.log(err);
    }
  }, [commentText, post?._id, post?.owner?._id, AddComment]);


  if (!post) return <Loading />;

  const isShared = post.isShared && post.originalPost;
  const original = post.originalPost;
  const isCommunityPost = post.community !== null;

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
      renderTextWithMentionsAndHashtags={renderTextWithMentionsAndHashtags}
      comments={comments}
      isLoading={isLoading}
      commentText={commentText}
      setCommentText={setCommentText}
      handleAddComment={handleAddComment}setHasMore={setHasMore}
      openModel={openModel}setPage={setPage}
      setOpenModel={setOpenModel} page={page} pages={pages} hasMore={hasMore}
    />
  );
};



export default PostPage;
