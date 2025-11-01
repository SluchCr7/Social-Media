import React, { useEffect, useState , useMemo , memo } from 'react';
import { renderTextWithMentionsHashtagsAndLinks } from '@/app/utils/CheckText';

const RenderPostText = memo(({ text, mentions = [], hashtags = [], italic = false }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const renderedText = useMemo(
    () => renderTextWithMentionsHashtagsAndLinks(text, mentions, hashtags),
    [text, mentions, hashtags]
  );
  if (!mounted) {
    // أثناء SSR أو قبل التحميل الكامل، نعرض النص العادي بدون روابط
    return (
      <p className="text-sm text-gray-600 dark:text-gray-200 whitespace-pre-wrap">
        {text}
      </p>
    );
  }

  const isArabic = /[\u0600-\u06FF]/.test(text);

  return (
    <p
      className={`text-sm break-all whitespace-pre-wrap ${italic ? 'italic' : ''} ${
        isArabic ? 'text-right' : 'text-left'
      } text-gray-600 dark:text-gray-200`}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {renderedText}
    </p>
  );
});
RenderPostText.displayName = 'RenderPostText'
export default RenderPostText;
