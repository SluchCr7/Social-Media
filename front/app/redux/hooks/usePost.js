'use client';

import { useEffect, useCallback, useMemo } from 'react';
import api from '@/app/utils/api';
import { useAuth } from './useAuth';
import { useAppDispatch, useAppSelector, useAppStore } from '../hooks';
import {
  selectPosts,
  selectUserPosts,
  selectMemories,
  selectMemoriesLoading,
  selectImageView,
  selectShowPostModelEdit,
  selectPostIsEdit,
  selectPostsPage,
  selectPostsHasMore,
  selectUserPostsHasMore,
  selectUserPostsLoading,
  selectPostsLoading,
  selectPostCreatedLoading,
  selectPostsError,
} from '../features/posts/postsSelectors';
import {
  setPosts as setReduxPosts,
  appendPosts,
  addPost as addReduxPost,
  setUserPosts as setReduxUserPosts,
  appendUserPosts,
  setMemories as setReduxMemories,
  setMemoriesLoading,
  setImageView as setReduxImageView,
  setShowPostModelEdit as setReduxShowPostModelEdit,
  setPostIsEdit as setReduxPostIsEdit,
  setPage as setReduxPage,
  setHasMore,
  setLoadedPage,
  setUserHasMore,
  setUserIsLoading,
  setIsLoading,
  setIsLoadingPostCreated,
  setError,
  updatePostInState,
  removePostFromState,
  optimisticLikePost,
  optimisticHahaPost,
  optimisticSavePost,
} from '../features/posts/postsSlice';
import { useFeedback } from './useFeedback';
import { MESSAGES } from '@/app/utils/messages';



export const usePost = ({ autoFetch = false } = {}) => {
  const dispatch = useAppDispatch();
  const store = useAppStore();
  const { user } = useAuth();
  const { showToast } = useFeedback();

  const posts = useAppSelector(selectPosts);
  const userPosts = useAppSelector(selectUserPosts);
  const memories = useAppSelector(selectMemories);
  const memoriesLoading = useAppSelector(selectMemoriesLoading);
  const imageView = useAppSelector(selectImageView);
  const showPostModelEdit = useAppSelector(selectShowPostModelEdit);
  const postIsEdit = useAppSelector(selectPostIsEdit);
  const page = useAppSelector(selectPostsPage);
  const hasMore = useAppSelector(selectPostsHasMore);
  const userHasMore = useAppSelector(selectUserPostsHasMore);
  const userIsLoading = useAppSelector(selectUserPostsLoading);
  const isLoading = useAppSelector(selectPostsLoading);
  const isLoadingPostCreated = useAppSelector(selectPostCreatedLoading);
  const error = useAppSelector(selectPostsError);

  const setPosts = useCallback(
    (p) => {
      const currentPosts = selectPosts(store.getState());
      dispatch(setReduxPosts(typeof p === 'function' ? p(currentPosts) : p));
    },
    [dispatch, store]
  );

  const setImageView = useCallback(
    (view) => {
      dispatch(setReduxImageView(view));
    },
    [dispatch]
  );

  const setShowPostModelEdit = useCallback(
    (show) => {
      dispatch(setReduxShowPostModelEdit(show));
    },
    [dispatch]
  );

  const setPostIsEdit = useCallback(
    (item) => {
      dispatch(setReduxPostIsEdit(item));
    },
    [dispatch]
  );

  const setPage = useCallback(
    (p) => {
      const currentPage = selectPostsPage(store.getState());
      dispatch(setReduxPage(typeof p === 'function' ? p(currentPage) : p));
    },
    [dispatch, store]
  );

  const fetchPosts = useCallback(
    async (pageNum = 1) => {
      if (pageNum !== 1 && !hasMore) return;
      const currentPostsState = store.getState().posts;
      if (
        currentPostsState?.isLoading ||
        (currentPostsState?.loadedPage >= pageNum && currentPostsState?.posts?.length > 0)
      ) return;

      dispatch(setIsLoading(true));
      dispatch(setError(null));
      try {
        const res = await api.get(`/post?page=${pageNum}&limit=10`);
        const fetchedPosts = Array.isArray(res.data.posts) ? res.data.posts : [];

        dispatch(pageNum === 1 ? setReduxPosts(fetchedPosts) : appendPosts(fetchedPosts));
        dispatch(setHasMore(pageNum < res.data.pages));
        dispatch(setLoadedPage(pageNum));
      } catch (err) {
        console.error('Error fetching feed posts:', err.message);
        dispatch(setError(err.response?.data?.message || 'Could not load posts. Please try again.'));
      } finally {
        dispatch(setIsLoading(false));
      }
    },
    [hasMore, dispatch, store]
  );

  const fetchUserPosts = useCallback(
    async (userId, pageNum = 1, limit = 5) => {
      if (!userId || (pageNum !== 1 && userIsLoading)) return;

      dispatch(setUserIsLoading(true));
      try {
        const res = await api.get(`/post/user/${userId}?page=${pageNum}&limit=${limit}`);
        const fetchedPosts = Array.isArray(res.data.posts) ? res.data.posts : [];

        dispatch(pageNum === 1 ? setReduxUserPosts(fetchedPosts) : appendUserPosts(fetchedPosts));
        dispatch(setUserHasMore(pageNum < res.data.pages));
      } catch (err) {
        console.error('Error fetching profile posts:', err.message);
      } finally {
        dispatch(setUserIsLoading(false));
      }
    },
    [userIsLoading, dispatch]
  );

  const getPostById = useCallback(async (id) => {
    if (!id) return null;
    try {
      const res = await api.get(`/post/${id}`);
      return res.data;
    } catch (err) {
      console.error('Error fetching post by ID:', err);
      return null;
    }
  }, []);

  const fetchMemories = useCallback(async () => {
    dispatch(setMemoriesLoading(true));
    try {
      const res = await api.get('/post/memories');
      dispatch(setReduxMemories(Array.isArray(res.data) ? res.data : []));
    } catch (err) {
      console.error('Error fetching memories:', err.message);
    } finally {
      dispatch(setMemoriesLoading(false));
    }
  }, [dispatch]);

  const AddPost = useCallback(
    async (
      content,
      mediaFiles = [],
      Hashtags = [],
      communityId = null,
      mentions = [],
      scheduledAt = null,
      links = [],
      privacy = 'public',
      music = null
    ) => {
      if (!user) return showToast(MESSAGES.COMMON.UNAUTHORIZED, 'error');

      const formData = new FormData();
      formData.append('text', content);
      mediaFiles.forEach((item) => formData.append('media', item.file));
      Hashtags.forEach((tag) => formData.append('Hashtags', tag));
      if (communityId) formData.append('community', communityId);
      if (mentions.length > 0) formData.append('mentions', JSON.stringify(mentions));
      if (scheduledAt) formData.append('scheduledAt', scheduledAt);
      if (privacy) formData.append('privacy', privacy);
      if (links.length > 0) formData.append('links', JSON.stringify(links));
      if (music) formData.append('music', music);

      const optimisticId = `temp-${Date.now()}`;
      if (!scheduledAt) {
        const optimisticPost = {
          _id: optimisticId,
          text: content,
          media: mediaFiles.map((item) => ({
            url: URL.createObjectURL(item.file),
            type: item.type || (item.file.type.startsWith('video') ? 'video' : 'image'),
            publicId: `temp-media-${Date.now()}`,
          })),
          owner: user,
          createdAt: new Date().toISOString(),
          likes: [],
          hahas: [],
          comments: [],
          saved: [],
          views: [],
          Hashtags,
          mentions,
          isOptimistic: true,
          status: 'published',
          community: communityId,
          links,
          music,
          privacy,
          userLevelPoints: 0,
        };
        dispatch(addReduxPost(optimisticPost));
      }

      dispatch(setIsLoadingPostCreated(true));
      const loadingToast = showToast(MESSAGES.COMMON.LOADING, 'loading');

      try {
        const res = await api.post('/post/add', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const newPost = res.data?.post || res.data;

        if (scheduledAt) {
          showToast('Great! Your post has been scheduled.', 'success', { id: loadingToast });
        } else {
          showToast(MESSAGES.POST.CREATE_SUCCESS, 'success', { id: loadingToast });
          dispatch(removePostFromState(optimisticId));
          dispatch(addReduxPost(newPost));
        }
        return newPost;
      } catch (err) {
        console.error(err);
        showToast(err.response?.data?.message || MESSAGES.POST.CREATE_ERROR, 'error', { id: loadingToast });
        dispatch(removePostFromState(optimisticId));
      } finally {
        dispatch(setIsLoadingPostCreated(false));
      }
    },
    [user, showToast, dispatch]
  );

  const editPost = useCallback(
    async (id, data, mediaFiles = [], deletedMedia = []) => {
      const formData = new FormData();
      formData.append('text', data.text || '');
      formData.append('privacy', data.privacy || 'public');

      if (data.Hashtags) formData.append('Hashtags', JSON.stringify(data.Hashtags));
      if (data.mentions) formData.append('mentions', JSON.stringify(data.mentions));
      if (data.links) formData.append('links', JSON.stringify(data.links));
      if (data.music) formData.append('music', data.music);
      if (data.community?._id || data.community) {
        formData.append('community', data.community?._id || data.community);
      }
      if (data.existingPhotos) {
        formData.append('existingPhotos', JSON.stringify(data.existingPhotos));
      }

      (data.newPhotos || mediaFiles).forEach((file) => formData.append('newMedia', file));
      if (deletedMedia.length > 0) {
        formData.append('deletedMedia', JSON.stringify(deletedMedia));
      }

      dispatch(setIsLoading(true));
      const loadingToast = showToast(MESSAGES.COMMON.LOADING, 'loading');

      try {
        const res = await api.put(`/post/edit/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const updatedPost = res.data?.post || res.data;
        dispatch(updatePostInState(updatedPost));
        showToast(MESSAGES.POST.UPDATE_SUCCESS, 'success', { id: loadingToast });
        dispatch(setReduxShowPostModelEdit(false));
      } catch (err) {
        console.error(err);
        showToast(MESSAGES.POST.UPDATE_ERROR, 'error', { id: loadingToast });
      } finally {
        dispatch(setIsLoading(false));
      }
    },
    [dispatch, showToast]
  );

  const deletePost = useCallback(
    async (id) => {
      try {
        const res = await api.delete(`/post/${id}`);
        showToast(res.data.message || MESSAGES.POST.DELETE_SUCCESS, 'success');
        dispatch(removePostFromState(id));
      } catch (err) {
        console.error(err);
        showToast(MESSAGES.POST.DELETE_ERROR, 'error');
      }
    },
    [dispatch, showToast]
  );

  const likePost = useCallback(
    async (postId) => {
      if (!user) return showToast(MESSAGES.COMMON.UNAUTHORIZED, 'error');

      dispatch(optimisticLikePost({ postId, userId: user._id }));

      try {
        const res = await api.put(`/post/like/${postId}`, {});
        dispatch(updatePostInState(res.data));
      } catch (err) {
        console.error(err);
        showToast(err?.response?.data?.message || 'Failed to update like status.', 'error');
      }
    },
    [user, dispatch, showToast]
  );

  const hahaPost = useCallback(
    async (postId) => {
      if (!user) return showToast(MESSAGES.COMMON.UNAUTHORIZED, 'error');

      dispatch(optimisticHahaPost({ postId, userId: user._id }));

      try {
        const res = await api.put(`/post/haha/${postId}`, {});
        dispatch(updatePostInState(res.data));
      } catch (err) {
        console.error(err);
        showToast(err?.response?.data?.message || 'Failed to update haha status.', 'error');
      }
    },
    [user, dispatch, showToast]
  );

  const savePost = useCallback(
    async (id) => {
      if (!user) return showToast(MESSAGES.COMMON.UNAUTHORIZED, 'error');

      dispatch(optimisticSavePost({ postId: id, userId: user._id }));

      try {
        const res = await api.put(`/post/save/${id}`, {});
        dispatch(updatePostInState(res.data));
        showToast(MESSAGES.POST.SAVE_SUCCESS, 'success');
      } catch (err) {
        console.error(err);
        showToast(err?.response?.data?.message || 'Failed to save post.', 'error');
      }
    },
    [user, dispatch, showToast]
  );

  const viewPost = useCallback(
    async (id) => {
      try {
        const res = await api.put(`/post/view/${id}`, {});
        if (res.data?._id) dispatch(updatePostInState(res.data));
        return res.data;
      } catch (err) {
        console.error('Error recording post view:', err);
        return null;
      }
    },
    [dispatch]
  );

  const sharePost = useCallback(
    async (postId, customText = '') => {
      if (!user) {
        showToast(MESSAGES.COMMON.UNAUTHORIZED, 'error');
        return null;
      }
      if (!postId) {
        showToast('Could not find the post to share.', 'error');
        return null;
      }
      if (typeof customText !== 'string' || customText.length > 300) {
        showToast('Share text must be 300 characters or fewer.', 'error');
        return null;
      }

      const loadingToast = showToast(MESSAGES.COMMON.LOADING, 'loading');
      try {
        const res = await api.post(`/post/share/${postId}`, { customText });
        const sharedPost = res.data;
        if (!sharedPost?._id) throw new Error('The share request returned an invalid post.');

        dispatch(addReduxPost(sharedPost));
        const originalPost = selectPosts(store.getState()).find((post) => post?._id === postId);
        if (originalPost) {
          const shares = Array.isArray(originalPost.shares) ? originalPost.shares : [];
          const alreadyShared = shares.some((share) =>
            String(share?._id ?? share?.user?._id ?? share?.user ?? share) === String(user._id)
          );
          if (!alreadyShared) {
            dispatch(updatePostInState({ ...originalPost, shares: [...shares, user._id] }));
          }
        }

        showToast('Post shared successfully.', 'success', { id: loadingToast });
        return sharedPost;
      } catch (err) {
        console.error('Error sharing post:', err);
        showToast(
          err?.response?.data?.message || 'Failed to share this post. Please try again.',
          'error',
          { id: loadingToast }
        );
        return null;
      }
    },
    [user, showToast, dispatch, store]
  );

  const sharePostExternally = useCallback(
    async (post) => {
      const originalPost = post?.originalPost || post;
      const postId = typeof originalPost === 'string' ? originalPost : originalPost?._id;
      if (!postId || typeof window === 'undefined' || typeof navigator === 'undefined') {
        showToast('Could not create a link for this post.', 'error');
        return false;
      }

      const url = `${window.location.origin}/Pages/Post/${encodeURIComponent(postId)}`;
      const shareData = {
        title: originalPost?.owner?.profileName
          ? `${originalPost.owner.profileName}'s post`
          : 'Post',
        text: originalPost?.text || undefined,
        url,
      };

      try {
        if (navigator.share) {
          try {
            await navigator.share(shareData);
            return true;
          } catch (err) {
            if (err?.name === 'AbortError') return false;
            if (!navigator.clipboard?.writeText) throw err;
          }
        }

        if (!navigator.clipboard?.writeText) {
          showToast('Sharing is not supported by this browser.', 'error');
          return false;
        }

        await navigator.clipboard.writeText(url);
        showToast('Post link copied to clipboard.', 'success');
        return true;
      } catch (err) {
        console.error('Error sharing post link:', err);
        showToast('Could not share this post. Please try again.', 'error');
        return false;
      }
    },
    [showToast]
  );

  useEffect(() => {
    if (autoFetch) {
      fetchPosts(page);
    }
  }, [autoFetch, page, fetchPosts]);

  const retry = useCallback(() => {
    fetchPosts(page);
  }, [fetchPosts, page]);

  return useMemo(
    () => ({
      posts,
      setPosts,
      isLoading,
      isLoadingPostCreated,
      error,
      retry,
      imageView,
      setImageView,
      showPostModelEdit,
      setShowPostModelEdit,
      postIsEdit,
      setPostIsEdit,
      hasMore,
      setPage,
      page,
      userPosts,
      userHasMore,
      userIsLoading,
      memories,
      memoriesLoading,
      fetchPosts,
      fetchUserPosts,
      getPostById,
      fetchMemories,
      AddPost,
      editPost,
      deletePost,
      likePost,
      hahaPost,
      savePost,
      viewPost,
      sharePost,
      sharePostExternally,
    }),
    [
      posts,
      setPosts,
      isLoading,
      isLoadingPostCreated,
      error,
      retry,
      imageView,
      setImageView,
      showPostModelEdit,
      setShowPostModelEdit,
      postIsEdit,
      setPostIsEdit,
      hasMore,
      setPage,
      page,
      userPosts,
      userHasMore,
      userIsLoading,
      memories,
      memoriesLoading,
      fetchPosts,
      fetchUserPosts,
      getPostById,
      fetchMemories,
      AddPost,
      editPost,
      deletePost,
      likePost,
      hahaPost,
      savePost,
      viewPost,
      sharePost,
      sharePostExternally,
    ]
  );
};

export default usePost;
