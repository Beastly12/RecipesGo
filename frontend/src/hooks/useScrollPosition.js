// hooks/useScrollPosition.js
import { useState, useEffect } from 'react';

export default function useScrollPosition() {
  const [scrollPos, setScrollPos] = useState(0);

  useEffect(() => {
    const updateScroll = () => {
      setScrollPos(window.scrollY);
    };

    window.addEventListener('scroll', updateScroll);

    // Clean up the event listener
    return () => {
      window.removeEventListener('scroll', updateScroll);
    };
  }, []); // Only run on mount and unmount

  return scrollPos;
}
