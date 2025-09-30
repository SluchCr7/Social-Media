'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { usePost } from '@/app/Context/PostContext';
import { useAuth } from '@/app/Context/AuthContext';
import { useComment } from '@/app/Context/CommentContext';
import Loading from '@/app/Component/Loading';
import { renderTextWithMentionsAndHashtags } from '@/app/utils/CheckText';
import DesignPostSelect from './Design';
import axios from 'axios';

const PostPage = ({ params }) => {
  const id = params.id;
  const { user, isLogin } = useAuth();
  const { likePost, savePost, sharePost, setImageView, viewPost, hahaPost } = usePost();
  const { comments, AddComment, isLoading, fetchCommentsByPostId } = useComment();
  
  const [openModel, setOpenModel] = useState(false);
  const [post, setPost] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  // ✅ fetch البوست من الـ API
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/post/${id}`);
        setPost(res.data);
      } catch (err) {
        console.error("Error fetching post:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPost();
  }, [id]);

  useEffect(() => {
    console.log(post)
  },[post])
  // ✅ جلب التعليقات بعد ما ييجي البوست
  useEffect(() => {
    if (post?._id) {
      fetchCommentsByPostId(post._id);
      viewPost(post._id); // ✅ زيادة الـ view
    }
  }, [post?._id, fetchCommentsByPostId, viewPost]);

  // ✅ إضافة تعليق
  const handleAddComment = useCallback(async () => {
    if (!commentText.trim()) return;

    try {
      await AddComment(commentText, post._id, post.owner._id);
      setCommentText('');
    } catch (err) {
      console.log(err);
    }
  }, [commentText, post?._id, post?.owner?._id, AddComment]);

  if (loading) return <Loading />;
  if (!post) return <p className="text-center mt-4">Post not found</p>;

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
