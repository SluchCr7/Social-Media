import Link from "next/link";

// Helper function لتلوين mentions و hashtags
export const renderTextWithMentionsAndHashtags = (text, mentions = [], hashtags = []) => {
  if (!text) return null;

  const words = text.split(/(\s+)/); // حافظ على المسافات
  return words.map((word, i) => {
    if (word.startsWith('@')) {
      const username = word.slice(1);
      const mentionedUser = mentions.find(u => u.username === username);
      if (mentionedUser) {
        return (
          <Link 
            key={i} 
            href={`/Pages/User/${mentionedUser._id}`} 
            className="text-blue-500 font-semibold hover:underline"
          >
            {word}
          </Link>
        );
      }
      return <span key={i} className="text-blue-400">{word}</span>;
    } 
    else if (word.startsWith('#')) {
      const tag = word.slice(1);
      if (hashtags.includes(tag.toLowerCase())) {
        return (
          <Link 
            key={i} 
            href={`/Pages/Hashtag/${tag}`} 
            className="text-purple-500 font-semibold hover:underline"
          >
            {word}
          </Link>
        );
      }
      return <span key={i} className="text-purple-400">{word}</span>;
    }
    return word;
  });
};
