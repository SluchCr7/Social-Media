import Link from "next/link";

export const renderTextWithMentionsHashtagsAndLinks = (
  text,
  mentions = [],
  hashtags = []
) => {
  if (!text) return null;

  let rendered = [];

  // ----------------- Mentions -----------------
  const escapeRegExp = (s) =>
    typeof s === "string" ? s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") : "";

  const sortedMentions = [...mentions].sort(
    (a, b) => (b?.username?.length || 0) - (a?.username?.length || 0)
  );

  let tempText = text;

  sortedMentions.forEach((user) => {
    const uname = user?.username;
    if (!uname || typeof uname !== "string") return;
    const mentionPattern = new RegExp(`@${escapeRegExp(uname)}`, "i");
    tempText = tempText.replace(mentionPattern, `@@MENTION:${user._id}@@`);
  });

  // ----------------- Split Text -----------------
  const parts = tempText.split(/(@@MENTION:[^@]+@@)/g);

  parts.forEach((part, i) => {
    // ---- Mentions ----
    const mentionMatch = part.match(/^@@MENTION:([^@]+)@@$/);
    if (mentionMatch) {
      const id = mentionMatch[1];
      const mentionedUser = mentions.find((u) => u._id === id);
      if (mentionedUser) {
        rendered.push(
          <Link
            key={i}
            href={`/Pages/User/${mentionedUser._id}`}
            className="text-blue-500 font-semibold hover:underline"
          >
            @{mentionedUser.username}
          </Link>
        );
      }
      return;
    }

    // ---- Hashtags ----
    const innerParts = part.match(/(#[\w\u0600-\u06FF]+|\s+|[^\s#]+)/g) || [];
    innerParts.forEach((inner, j) => {
      if (inner.startsWith("#")) {
        const tag = inner.slice(1).toLowerCase();
        if (hashtags.includes(tag)) {
          rendered.push(
            <Link
              key={`${i}-${j}`}
              href={`/Pages/Hashtag/${encodeURIComponent(tag)}`}
              className="text-purple-500 font-semibold hover:underline"
            >
              {inner}
            </Link>
          );
        } else {
          rendered.push(
            <span key={`${i}-${j}`} className="text-purple-400">
              {inner}
            </span>
          );
        }
      } else {
        rendered.push(inner);
      }
    });
  });

  return rendered;
};
