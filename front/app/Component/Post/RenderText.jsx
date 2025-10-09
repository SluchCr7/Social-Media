// import { renderTextWithMentionsHashtagsAndLinks } from '@/app/utils/CheckText';
// import React from 'react';

// const RenderPostText = ({ text, mentions = [], hashtags = [], italic = false }) => {
//   if (!text) return null;

//   const isArabic = /[\u0600-\u06FF]/.test(text);

//   return (
//     <p
//       className={`text-sm break-all whitespace-pre-wrap ${italic ? 'italic' : ''} ${
//         isArabic ? 'text-right' : 'text-left'
//       } text-gray-600 dark:text-gray-200`}
//       dir={isArabic ? 'rtl' : 'ltr'}
//     >
//       {renderTextWithMentionsHashtagsAndLinks(text, mentions, hashtags)}
//     </p>
//   );
// };

// export default RenderPostText;

import React, { useEffect, useState } from 'react';
import { renderTextWithMentionsHashtagsAndLinks } from '@/app/utils/CheckText';

const RenderPostText = ({ text, mentions = [], hashtags = [], italic = false }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      {renderTextWithMentionsHashtagsAndLinks(text, mentions, hashtags)}
    </p>
  );
};

export default RenderPostText;
