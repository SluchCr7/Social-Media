'use client';

import { useCallback, useMemo } from 'react';
import { useAuth } from './useAuth';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  useAddPostMutation,
  useDeletePostMutation,
  useEditPostMutation,
  useGetPostsInfiniteQuery,
  useHahaPostMutation,
  useLikePostMutation,
  useLazyGetPostByIdQuery,
  useSavePostMutation,
  useSharePostMutation,
  useViewPostMutation,
} from '../features/posts/postsApi';
import {
  selectImageView,
  selectOptimisticPosts,
  selectPostCreatedLoading,
  selectPostIsEdit,
  selectShowPostModelEdit,
} from '../features/posts/postsSelectors';
import {
  addOptimisticPost,
  removeOptimisticPost,
  setImageView as setReduxImageView,
  setIsLoadingPostCreated,
  setPostIsEdit as setReduxPostIsEdit,
  setShowPostModelEdit as setReduxShowPostModelEdit,
} from '../features/posts/postsSlice';
import { useFeedback } from './useFeedback';
import { MESSAGES } from '@/app/utils/messages';

const getErrorMessage = (error, fallback) =>
  error?.data?.message || error?.response?.data?.message || error?.message || fallback;

export const usePost = ({ autoFetch = false } = {}) => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { showToast } = useFeedback();
  const optimisticPosts = useAppSelector(selectOptimisticPosts);
  const imageView = useAppSelector(selectImageView);
  const showPostModelEdit = useAppSelector(selectShowPostModelEdit);
  const postIsEdit = useAppSelector(selectPostIsEdit);
  const isLoadingPostCreated = useAppSelector(selectPostCreatedLoading);

  const postsQuery = useGetPostsInfiniteQuery(
    { viewerId: user?._id || 'anonymous', limit: 10 },
    { skip: !autoFetch }
  );
  const {
    fetchNextPage: fetchNextPostsPage,
    hasNextPage: hasMorePosts,
    isFetchingNextPage: isFetchingMorePosts,
    refetch: refetchPosts,
  } = postsQuery;
  const [addPostRequest] = useAddPostMutation();
  const [editPostRequest, editPostState] = useEditPostMutation();
  const [deletePostRequest] = useDeletePostMutation();
  const [likePostRequest] = useLikePostMutation();
  const [hahaPostRequest] = useHahaPostMutation();
  const [savePostRequest] = useSavePostMutation();
  const [sharePostRequest] = useSharePostMutation();
  const [viewPostRequest] = useViewPostMutation();
  const [loadPostById] = useLazyGetPostByIdQuery();

  const fetchedPosts = useMemo(
    () => postsQuery.data?.pages?.flatMap((page) => page?.posts || []) || [],
    [postsQuery.data]
  );
  const posts = useMemo(
    () => [...optimisticPosts, ...fetchedPosts.filter((post) =>
      !optimisticPosts.some((optimistic) => optimistic._id === post._id)
    )],
    [fetchedPosts, optimisticPosts]
  );

  const setImageView = useCallback((view) => dispatch(setReduxImageView(view)), [dispatch]);
  const setShowPostModelEdit = useCallback(
    (show) => dispatch(setReduxShowPostModelEdit(show)),
    [dispatch]
  );
  const setPostIsEdit = useCallback((item) => dispatch(setReduxPostIsEdit(item)), [dispatch]);

  const fetchPosts = useCallback(async (pageNum = 1) => {
    if (!autoFetch) return;
    if (pageNum === 1) return refetchPosts();
    if (hasMorePosts) return fetchNextPostsPage();
  }, [autoFetch, fetchNextPostsPage, hasMorePosts, refetchPosts]);

  const loadMorePosts = useCallback(async () => {
    if (!hasMorePosts || isFetchingMorePosts) return;
    return fetchNextPostsPage();
  }, [fetchNextPostsPage, hasMorePosts, isFetchingMorePosts]);

  const retry = useCallback(() => refetchPosts(), [refetchPosts]);

  const getPostById = useCallback(async (id) => {
    if (!id) return null;
    try {
      return await loadPostById(id).unwrap();
    } catch (error) {
      console.error('Error fetching post by ID:', error);
      return null;
    }
  }, [loadPostById]);

  const AddPost = useCallback(async (
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
    if (!user) {
      showToast(MESSAGES.COMMON.UNAUTHORIZED, 'error');
      return null;
    }

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
    const objectUrls = [];
    if (!scheduledAt) {
      const optimisticPost = {
        _id: optimisticId,
        text: content,
        media: mediaFiles.map((item) => {
          const url = typeof URL.createObjectURL === 'function'
            ? URL.createObjectURL(item.file)
            : '';
          if (url) objectUrls.push(url);
          return {
            url,
            type: item.type || (item.file.type.startsWith('video') ? 'video' : 'image'),
            publicId: `temp-media-${optimisticId}`,
          };
        }),
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
      dispatch(addOptimisticPost(optimisticPost));
    }

    dispatch(setIsLoadingPostCreated(true));
    const loadingToast = showToast(MESSAGES.COMMON.LOADING, 'loading');
    try {
      const data = await addPostRequest(formData).unwrap();
      const newPost = data?.post || data;
      if (scheduledAt) {
        showToast('Great! Your post has been scheduled.', 'success', { id: loadingToast });
      } else {
        dispatch(removeOptimisticPost(optimisticId));
        showToast(MESSAGES.POST.CREATE_SUCCESS, 'success', { id: loadingToast });
      }
      return newPost;
    } catch (error) {
      console.error(error);
      showToast(getErrorMessage(error, MESSAGES.POST.CREATE_ERROR), 'error', { id: loadingToast });
      dispatch(removeOptimisticPost(optimisticId));
      return null;
    } finally {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
      dispatch(setIsLoadingPostCreated(false));
    }
  }, [addPostRequest, dispatch, showToast, user]);

  const editPost = useCallback(async (id, data, mediaFiles = [], deletedMedia = []) => {
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

    const loadingToast = showToast(MESSAGES.COMMON.LOADING, 'loading');
    try {
      await editPostRequest({ id, formData }).unwrap();
      showToast(MESSAGES.POST.UPDATE_SUCCESS, 'success', { id: loadingToast });
      dispatch(setReduxShowPostModelEdit(false));
    } catch (error) {
      console.error(error);
      showToast(getErrorMessage(error, MESSAGES.POST.UPDATE_ERROR), 'error', { id: loadingToast });
    }
  }, [dispatch, editPostRequest, showToast]);

  const deletePost = useCallback(async (id) => {
    try {
      const data = await deletePostRequest(id).unwrap();
      showToast(data?.message || MESSAGES.POST.DELETE_SUCCESS, 'success');
    } catch (error) {
      console.error(error);
      showToast(getErrorMessage(error, MESSAGES.POST.DELETE_ERROR), 'error');
    }
  }, [deletePostRequest, showToast]);

  const likePost = useCallback(async (postId) => {
    if (!user) {
      showToast(MESSAGES.COMMON.UNAUTHORIZED, 'error');
      return;
    }
    try {
      await likePostRequest(postId).unwrap();
    } catch (error) {
      console.error(error);
      showToast(getErrorMessage(error, 'Failed to update like status.'), 'error');
    }
  }, [likePostRequest, showToast, user]);

  const hahaPost = useCallback(async (postId) => {
    if (!user) {
      showToast(MESSAGES.COMMON.UNAUTHORIZED, 'error');
      return;
    }
    try {
      await hahaPostRequest(postId).unwrap();
    } catch (error) {
      console.error(error);
      showToast(getErrorMessage(error, 'Failed to update haha status.'), 'error');
    }
  }, [hahaPostRequest, showToast, user]);

  const savePost = useCallback(async (id) => {
    if (!user) {
      showToast(MESSAGES.COMMON.UNAUTHORIZED, 'error');
      return;
    }
    try {
      await savePostRequest(id).unwrap();
      showToast(MESSAGES.POST.SAVE_SUCCESS, 'success');
    } catch (error) {
      console.error(error);
      showToast(getErrorMessage(error, 'Failed to save post.'), 'error');
    }
  }, [savePostRequest, showToast, user]);

  const viewPost = useCallback(async (id) => {
    try {
      return await viewPostRequest(id).unwrap();
    } catch (error) {
      console.error('Error recording post view:', error);
      return null;
    }
  }, [viewPostRequest]);

  const sharePost = useCallback(async (postId, customText = '') => {
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
      const sharedPost = await sharePostRequest({ id: postId, customText }).unwrap();
      if (!sharedPost?._id) throw new Error('The share request returned an invalid post.');
      showToast('Post shared successfully.', 'success', { id: loadingToast });
      return sharedPost;
    } catch (error) {
      console.error('Error sharing post:', error);
      showToast(
        getErrorMessage(error, 'Failed to share this post. Please try again.'),
        'error',
        { id: loadingToast }
      );
      return null;
    }
  }, [sharePostRequest, showToast, user]);

  const sharePostExternally = useCallback(async (post) => {
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
        } catch (error) {
          if (error?.name === 'AbortError') return false;
          if (!navigator.clipboard?.writeText) throw error;
        }
      }
      if (!navigator.clipboard?.writeText) {
        showToast('Sharing is not supported by this browser.', 'error');
        return false;
      }
      await navigator.clipboard.writeText(url);
      showToast('Post link copied to clipboard.', 'success');
      return true;
    } catch (error) {
      console.error('Error sharing post link:', error);
      showToast('Could not share this post. Please try again.', 'error');
      return false;
    }
  }, [showToast]);

  const error = postsQuery.error?.data?.message
    || (postsQuery.error ? 'Could not load posts. Please try again.' : null);

  return useMemo(() => ({
    posts,
    isLoading: postsQuery.isLoading || postsQuery.isFetchingNextPage,
    isLoadingPostCreated,
    error,
    retry,
    imageView,
    setImageView,
    showPostModelEdit,
    setShowPostModelEdit,
    postIsEdit,
    setPostIsEdit,
    hasMore: Boolean(postsQuery.hasNextPage),
    loadMorePosts,
    fetchPosts,
    getPostById,
    AddPost,
    editPost,
    isEditingPost: editPostState.isLoading,
    deletePost,
    likePost,
    hahaPost,
    savePost,
    viewPost,
    sharePost,
    sharePostExternally,
  }), [
    posts,
    postsQuery.isLoading,
    postsQuery.isFetchingNextPage,
    postsQuery.hasNextPage,
    isLoadingPostCreated,
    error,
    retry,
    imageView,
    setImageView,
    showPostModelEdit,
    setShowPostModelEdit,
    postIsEdit,
    setPostIsEdit,
    loadMorePosts,
    fetchPosts,
    getPostById,
    AddPost,
    editPost,
    editPostState.isLoading,
    deletePost,
    likePost,
    hahaPost,
    savePost,
    viewPost,
    sharePost,
    sharePostExternally,
  ]);
};

export default usePost;
