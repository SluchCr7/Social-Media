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

  // ✅ Fetch post only once when id changes
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

  // ✅ Fetch comments separately (based on id, not post object)
  useEffect(() => {
    if (id) fetchCommentsByPostId(id);
  }, [id, fetchCommentsByPostId]);

  // ✅ Count view once when id changes
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

  if (loading) return <Loading />;
  if (!post) return <p className="text-center text-gray-500">Post not found</p>;

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
