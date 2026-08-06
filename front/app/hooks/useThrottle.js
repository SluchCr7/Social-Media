import { useRef, useCallback } from 'react';

/**
 * Custom hook to throttle a callback function
 * @param {Function} callback - Function to throttle
 * @param {number} delay - Throttle delay in ms (default: 300ms)
 * @returns {Function} throttled callback
 */
export function useThrottle(callback, delay = 300) {
    const lastRun = useRef(0);

    return useCallback((...args) => {
        const now = Date.now();
        if (now - lastRun.current >= delay) {
            lastRun.current = now;
            callback(...args);
        }
    }, [callback, delay]);
}

export default useThrottle;
