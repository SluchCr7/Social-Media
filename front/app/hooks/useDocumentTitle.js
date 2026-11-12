'use client';

import { useEffect } from 'react';

export default function useDocumentTitle(title) {
  useEffect(() => {
    if (!title) return;

    const appName = process.env.NEXT_PUBLIC_WEBSITE_NAME || 'Zocial';
    document.title = `${title} | ${appName}`;
  }, [title]);
}
