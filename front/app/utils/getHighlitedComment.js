export function getHighlightedComment(post) {
  if (!post?.comments || post.comments.length === 0) return null;

  // 1. Check for pinned comment
  const pinned = post.comments.find(c => c.isPinned);
  if (pinned) return { ...pinned, label: "📌 Pinned Comment" };

  // 2. Check for author's reply
  const authorReply = post.comments.find(c => c.owner._id === post.owner._id);
  if (authorReply) return { ...authorReply, label: "✍️ Author Reply" };

  // 3. Check for most liked comment
  const mostLiked = [...post.comments].sort((a, b) => b.likes.length - a.likes.length)[0];
  if (mostLiked && mostLiked.likes.length > 0) {
    return { ...mostLiked, label: "⭐ Top Comment" };
  }

  // 4. If too many comments, show the latest one
  if (post.comments.length > 10) {
    const lastComment = post.comments[post.comments.length - 1];
    return { ...lastComment, label: "🕒 Recent Comment" };
  }

  // Otherwise, don't show any
  return null;
}
