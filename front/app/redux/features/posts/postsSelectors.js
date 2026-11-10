import { createSelector } from '@reduxjs/toolkit';

const EMPTY_ARRAY = [];

export const selectPostsState = (state) => state.posts;
export const selectPosts = createSelector([selectPostsState], (posts) => posts?.posts || EMPTY_ARRAY);
export const selectUserPosts = createSelector([selectPostsState], (posts) => posts?.userPosts || EMPTY_ARRAY);
export const selectMemories = createSelector([selectPostsState], (posts) => posts?.memories || EMPTY_ARRAY);
export const selectMemoriesLoading = createSelector([selectPostsState], (posts) => Boolean(posts?.memoriesLoading));
export const selectImageView = createSelector([selectPostsState], (posts) => posts?.imageView);
export const selectShowPostModelEdit = createSelector([selectPostsState], (posts) => Boolean(posts?.showPostModelEdit));
export const selectPostIsEdit = createSelector([selectPostsState], (posts) => posts?.postIsEdit);
export const selectPostsPage = createSelector([selectPostsState], (posts) => posts?.page || 1);
export const selectPostsHasMore = createSelector([selectPostsState], (posts) => Boolean(posts?.hasMore));
export const selectUserPostsHasMore = createSelector([selectPostsState], (posts) => Boolean(posts?.userHasMore));
export const selectUserPostsLoading = createSelector([selectPostsState], (posts) => Boolean(posts?.userIsLoading));
export const selectPostsLoading = createSelector([selectPostsState], (posts) => Boolean(posts?.isLoading));
export const selectPostCreatedLoading = createSelector([selectPostsState], (posts) => Boolean(posts?.isLoadingPostCreated));
