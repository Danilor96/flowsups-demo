import { useState, useEffect, useRef } from 'react';

export const useElementScrollPosition = () => {
  const elementRef = useRef<HTMLElement | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const element = elementRef.current;

    if (!element) {
      return;
    }

    const updateScrollPosition = () => {
      setScrollPosition(element.scrollTop);
    };

    element.addEventListener('scroll', updateScrollPosition);

    updateScrollPosition();

    return () => {
      element.removeEventListener('scroll', updateScrollPosition);
    };
  }, []);

  return { elementRef, scrollPosition };
};
