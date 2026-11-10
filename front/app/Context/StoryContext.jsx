'use client';

/**
 * @deprecated
 * LEGACY INACTIVE CONTEXT
 *
 * This file is preserved for historical architecture records only.
 * It has ZERO active responsibilities in the application.
 *
 * All state management and server communication are unified under
 * Redux Toolkit and RTK Query via direct hooks in `@/app/redux/hooks`.
 */

export const StoryContextProvider = ({ children }) => <>{children}</>;
export const StoryContext = null;

export default function DeprecatedStoryContext() {
  return null;
}
