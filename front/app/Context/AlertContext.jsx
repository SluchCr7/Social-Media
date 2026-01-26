'use client';

/**
 * DEPRECATED: This context is deprecated.
 * Please use FeedbackContext or useFeedback hook instead.
 * 
 * This file is kept for backward compatibility and points to the new Feedback system.
 */

import { useFeedback } from './FeedbackContext';

export { FeedbackProvider as AlertContextProvider } from './FeedbackContext';
export const useAlert = () => {
  const { showAlert } = useFeedback();
  return { showAlert };
};
export default useAlert;