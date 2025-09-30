'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { usePost } from '@/app/Context/PostContext';
import { useAuth } from '@/app/Context/AuthContext';
import { useComment } from '@/app/Context/CommentContext';
import { renderTextWithMentionsAndHashtags } from '@/app/utils/CheckText';
import DesignPostSelect from './Design';
import Loading from '@/app/Component/Loading';

const PostPage = ({ params }) => {
  const id = params.id;
  const { user, isLogin } = useAuth();
  const { getPostById, likePost, savePost, sharePost, setImageView, viewPost, hahaPost } = usePost();
  const { comments, AddComment, isLoading, fetchCommentsByPostId } = useComment();

  const [openModel, setOpenModel] = useState(false);
  const [post, setPost] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  // ✅ fetch post once
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPostById(id);
        setPost(data);
      } catch (err) {
        console.error("Error fetching post:", err);
      }
    };

    if (id) fetchPost();
  }, [id, getPostById]);

  // ✅ fetch comments for this post
  useEffect(() => {
    if (!id) return;
    fetchCommentsByPostId(id);
  }, [id, fetchCommentsByPostId]);

  // ✅ count view
  useEffect(() => {
    if (id) viewPost(id);
  }, [id, viewPost]);

  const handleAddComment = useCallback(async () => {
    if (!commentText.trim()) return;

    try {
      await AddComment(commentText, id, post?.owner?._id);
      setCommentText('');
    } catch (err) {
      console.log(err);
    }
  }, [commentText, id, post?.owner?._id, AddComment]);

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
      comments={comments[id] || []} // ⬅️ جلب تعليقات البوست فقط
      isLoading={isLoading}
      commentText={commentText}
      setCommentText={setCommentText}
      handleAddComment={handleAddComment}
      openModel={openModel}
      setOpenModel={setOpenModel}
    />
  );
};

export default PostPage;
