import Link from "next/link";

export const renderTextWithMentionsAndHashtags = (text, mentions = [], hashtags = []) => {
  if (!text) return null;

  let rendered = [];
  let lastIndex = 0;

  // نمشي على mentions ونحوّل كل username مطابق في النص إلى لينك
  const sortedMentions = [...mentions].sort(
    (a, b) => b.username.length - a.username.length
  );

  // نكرر العملية لإضافة كل mention كمطابقة دقيقة
  let tempText = text;

  sortedMentions.forEach((user) => {
    const mentionPattern = new RegExp(`@${user.username}`, "gi");
    tempText = tempText.replace(mentionPattern, `@@MENTION:${user._id}@@`);
  });

  // الآن نقسم النص بناءً على العلامة المؤقتة
  const parts = tempText.split(/(@@MENTION:[^@]+@@)/g);

  parts.forEach((part, i) => {
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
    } else {
      // تحليل باقي النص للهاشتاقات
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
    }
  });

  return rendered;
};
