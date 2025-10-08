import Link from "next/link";

export const renderTextWithMentionsHashtagsAndLinks = (
  text,
  mentions = [],
  hashtags = [],
  links = [] // مصفوفة روابط أو كائنات { label, url }
) => {
  if (!text) return null;

  let rendered = [];

  // ----------------- Mentions -----------------
  const sortedMentions = [...mentions].sort(
    (a, b) => b.username.length - a.username.length
  );

  let tempText = text;

  sortedMentions.forEach((user) => {
    const mentionPattern = new RegExp(`@${user.username}`, "gi");
    tempText = tempText.replace(mentionPattern, `@@MENTION:${user._id}@@`);
  });

  // ----------------- Links -----------------
  links.forEach((link) => {
    const url = typeof link === 'string' ? link : link.url;
    const label = typeof link === 'string' ? link : link.label || link.url;
    if (!url) return;
    const escapedUrl = url.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const linkPattern = new RegExp(escapedUrl, "gi");
    tempText = tempText.replace(linkPattern, `@@LINK:${url}::${label}@@`);
  });

  // ----------------- Split Text -----------------
  const parts = tempText.split(/(@@MENTION:[^@]+@@|@@LINK:[^@]+::[^@]+@@)/g);

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

    // ---- Links ----
    const linkMatch = part.match(/^@@LINK:([^:]+)::(.+)@@$/);
    if (linkMatch) {
      const url = linkMatch[1];
      const label = linkMatch[2];
      rendered.push(
        <a
          key={i}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-500 hover:underline"
        >
          {label}
        </a>
      );
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
