'use client';

import { useEffect } from 'react';
import { ErrorView } from './Component/ErrorBoundary';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an analytics or error tracking service
    console.error('Next.js route-level error caught:', error);
  }, [error]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <ErrorView error={error} resetErrorBoundary={reset} />
    </div>
  );
}
