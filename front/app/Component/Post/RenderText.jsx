import { renderTextWithMentionsAndHashtags } from '@/app/utils/CheckText';
import React from 'react';

const RenderPostText = ({ text, mentions = [], hashtags = [], italic = false }) => {
  if (!text) return null;

  const isArabic = /[\u0600-\u06FF]/.test(text);

  return (
    <p
      className={`text-sm break-all whitespace-pre-wrap ${italic ? 'italic' : ''} ${
        isArabic ? 'text-right' : 'text-left'
      } text-gray-600 dark:text-gray-200`}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {renderTextWithMentionsAndHashtags(text, mentions, hashtags)}
    </p>
  );
};

export default RenderPostText;
