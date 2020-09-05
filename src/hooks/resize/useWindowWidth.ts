import {useEffect, useState} from 'react';

/**
 * Return the current window width.
 *
 * This ignores the window height, to avoid changes when mobile browsers
 * show/hide their location bar. This does not do any debouncing.
 */
export default function useWindowWidth() {
  const [width, setWidth] = useState<number>(-1);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
}
