import { createSelector } from '@reduxjs/toolkit';

const selectPostsState = (state) => state.posts;

export const selectOptimisticPosts = createSelector(
  [selectPostsState],
  (posts) => posts?.optimisticPosts || []
);
export const selectImageView = createSelector([selectPostsState], (posts) => posts?.imageView);
export const selectShowPostModelEdit = createSelector(
  [selectPostsState],
  (posts) => Boolean(posts?.showPostModelEdit)
);
export const selectPostIsEdit = createSelector([selectPostsState], (posts) => posts?.postIsEdit);
export const selectPostCreatedLoading = createSelector(
  [selectPostsState],
  (posts) => Boolean(posts?.isLoadingPostCreated)
);
