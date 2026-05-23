import { useState, useEffect } from 'react';

/**
 * Custom hook to detect if the viewport is within mobile/tablet screens.
 * Defaults to 768px as the breakpoint.
 */
export const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Safety check for SSR or window environment
    if (typeof window === 'undefined') return;

    const media = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const listener = () => setIsMobile(media.matches);
    
    // Set initial value
    setIsMobile(media.matches);
    
    // Add event listener
    if (media.addEventListener) {
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    } else {
      // Fallback support for older browsers
      media.addListener(listener);
      return () => media.removeListener(listener);
    }
  }, [breakpoint]);

  return isMobile;
};
