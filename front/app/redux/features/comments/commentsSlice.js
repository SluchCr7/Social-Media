import { createSlice } from '@reduxjs/toolkit';

// Recursive helper functions matching existing Comment tree behavior
const updateCommentInTree = (tree, updatedComment) => {
  if (!Array.isArray(tree)) return [];
  return tree.map((comment) => {
    if (comment._id === updatedComment._id) {
      return {
        ...comment,
        ...updatedComment,
        replies: updatedComment.replies ?? comment.replies ?? [],
      };
    }
    if (comment.replies && comment.replies.length > 0) {
      return {
        ...comment,
        replies: updateCommentInTree(comment.replies, updatedComment),
      };
    }
    return comment;
  });
};

const deleteCommentFromTree = (tree, commentId) => {
  if (!Array.isArray(tree)) return [];
  return tree
    .filter((comment) => comment._id !== commentId)
    .map((comment) => {
      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: deleteCommentFromTree(comment.replies, commentId),
        };
      }
      return comment;
    });
};

const insertCommentToTree = (tree, newComment) => {
  if (!Array.isArray(tree)) return [newComment];
  const parentComment = newComment.parentComment
    || (newComment.targetType === 'Comment' ? newComment.targetId : null);
  if (!parentComment) {
    if (tree.some((c) => c._id === newComment._id)) return tree;
    return [newComment, ...tree];
  }
  return tree.map((comment) => {
    if (comment._id === parentComment) {
      const existingReplies = comment.replies || [];
      if (existingReplies.some((r) => r._id === newComment._id)) {
        return comment;
      }
      return {
        ...comment,
        replies: [...existingReplies, newComment],
        replyCount: (comment.replyCount || 0) + 1,
      };
    }
    if (comment.replies && comment.replies.length > 0) {
      return {
        ...comment,
        replies: insertCommentToTree(comment.replies, newComment),
      };
    }
    return comment;
  });
};

const modifyCommentInTree = (tree, commentId, modifierFn) => {
  if (!Array.isArray(tree)) return [];
  return tree.map((comment) => {
    if (comment._id === commentId) {
      return modifierFn(comment);
    }
    if (comment.replies && comment.replies.length > 0) {
      return {
        ...comment,
        replies: modifyCommentInTree(comment.replies, commentId, modifierFn),
      };
    }
    return comment;
  });
};

const initialState = {
  comments: [],
  isLoading: false,
};

export const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    setComments: (state, action) => {
      state.comments = Array.isArray(action.payload) ? action.payload : [];
    },
    appendComments: (state, action) => {
      const items = Array.isArray(action.payload) ? action.payload : [action.payload];
      const currentIds = new Set(state.comments.map((comment) => comment._id));
      items.forEach((comment) => {
        if (comment?._id && !currentIds.has(comment._id)) {
          currentIds.add(comment._id);
          state.comments.push(comment);
        }
      });
    },
    insertComment: (state, action) => {
      state.comments = insertCommentToTree(state.comments, action.payload);
    },
    updateComment: (state, action) => {
      state.comments = updateCommentInTree(state.comments, action.payload);
    },
    deleteCommentFromState: (state, action) => {
      state.comments = deleteCommentFromTree(state.comments, action.payload);
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    optimisticLikeComment: (state, action) => {
      const { commentId, userId } = action.payload;
      state.comments = modifyCommentInTree(state.comments, commentId, (c) => {
        const isLiked = c.likes?.includes(userId);
        const newLikes = isLiked
          ? c.likes.filter((id) => id !== userId)
          : [...(c.likes || []), userId];
        return { ...c, likes: newLikes };
      });
    },
  },
});

export const {
  setComments,
  appendComments,
  insertComment,
  updateComment,
  deleteCommentFromState,
  setIsLoading,
  optimisticLikeComment,
} = commentsSlice.actions;

export { updateCommentInTree, deleteCommentFromTree, insertCommentToTree, modifyCommentInTree };

export default commentsSlice.reducer;
