import Link from "next/link";

export const renderTextWithMentionsAndHashtags = (text, mentions = [], hashtags = []) => {
  if (!text) return null;

  // نلتقط @mention حتى لو فيه مسافات مثل @Ahmed Abobakr
  const parts = text.match(/(@[A-Za-z0-9_.\u0600-\u06FF-]+(?:\s+[A-Za-z0-9_.\u0600-\u06FF-]+)*|#[\w\u0600-\u06FF]+|\s+|[^\s@#]+)/g);

  return parts.map((part, i) => {
    // 🎯 mentions
    if (part.startsWith('@')) {
      const username = part.slice(1).trim(); // إزالة @ والمسافات
      const mentionedUser = mentions.find(
        u => u.username?.toLowerCase().trim() === username.toLowerCase()
      );

      if (mentionedUser) {
        return (
          <Link
            key={i}
            href={`/Pages/User/${mentionedUser._id}`}
            className="text-blue-500 font-semibold hover:underline"
          >
            {part}
          </Link>
        );
      } else {
        return (
          <span key={i} className="text-blue-400">
            {part}
          </span>
        );
      }
    }

    // 🟣 hashtags
    if (part.startsWith('#')) {
      const tag = part.slice(1).toLowerCase();
      if (hashtags.includes(tag)) {
        return (
          <Link
            key={i}
            href={`/Pages/Hashtag/${tag}`}
            className="text-purple-500 font-semibold hover:underline"
          >
            {part}
          </Link>
        );
      } else {
        return (
          <span key={i} className="text-purple-400">
            {part}
          </span>
        );
      }
    }

    // نص عادي
    return part;
  });
};
