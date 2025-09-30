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
  const { likePost, savePost, sharePost, setImageView, viewPost, hahaPost, getPostById } = usePost();
  const { comments, AddComment, isLoading, fetchCommentsByPostId } = useComment();

  const [openModel, setOpenModel] = useState(false);
  const [post, setPost] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  // ✅ استخدم getPostById بدلاً من البحث في posts
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const data = await getPostById(id);
        setPost(data);
      } catch (err) {
        console.error("Error fetching post:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPost();
  }, [id, getPostById]);

  useEffect(() => {
    if (!post?._id) return;
    fetchCommentsByPostId(post._id);
  }, [post?._id, fetchCommentsByPostId]);

  useEffect(() => {
    if (post?._id) {
      viewPost(post._id);
    }
  }, [post?._id, viewPost]);

  const handleAddComment = useCallback(async () => {
    if (!commentText.trim()) return;

    try {
      await AddComment(commentText, post._id, post.owner._id);
      setCommentText('');
    } catch (err) {
      console.log(err);
    }
  }, [commentText, post?._id, post?.owner?._id, AddComment]);

  if (loading || !post) return <Loading />;

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
      handleAddComment={handleAddComment}
      openModel={openModel}
      setOpenModel={setOpenModel}
    />
  );
};

export default PostPage;
