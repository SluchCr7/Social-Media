export function getHighlightedComment(post) {
  if (!Array.isArray(post?.comments) || post.comments.length === 0) return null;

  // 1. Pinned
  const pinned = post.comments.find(c => c.isPinned);
  if (pinned) return { ...pinned, label: "📌 Pinned Comment" };

  // 2. Author reply
  const authorReply = post.comments.find(
    c => (c.owner?._id || c.owner) == post.owner?._id
  );
  if (authorReply) return { ...authorReply, label: "✍️ Author Reply" };

  // 3. Most liked
  const mostLiked = [...post.comments].sort(
    (a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)
  )[0];
  if (mostLiked && (mostLiked.likes?.length || 0) > 0) {
    return { ...mostLiked, label: "⭐ Top Comment" };
  }

  // 4. Latest if too many
  if (post.comments.length > 10) {
    const lastComment = post.comments[post.comments.length - 1];
    return { ...lastComment, label: "🕒 Recent Comment" };
  }

  return null;
}
