import React, {useEffect, useRef, useState} from 'react';
import './HorizontalScroll.scss';

type HorizontalScrollProps = {
  children: React.ReactNode;
};

/**
 * Wraps the children in a container that makes it never wrap, removes any
 * scrollbars and adds buttons for scrolling.
 */
export default function HorizontalScroll({children}: HorizontalScrollProps) {
  const scrollContainer = useRef<HTMLDivElement>(null);
  const [hasOverflowLeft, setHasOverflowLeft] = useState(false);
  const [hasOverflowRight, setHasOverflowRight] = useState(false);

  const scrollX = (x: number) => {
    const scroll = scrollContainer.current;
    if (scroll) {
      scroll.scrollBy(x, 0);
    }
  };

  const scrollLeft = () => {
    scrollX(-40);
  };

  const scrollRight = () => {
    scrollX(40);
  };

  useEffect(() => {
    const scroll = scrollContainer.current;
    const handleScroll = () => {
      if (!scroll) {
        console.log('No scroll element');
      } else {
        const hasOverflowLeft = scroll.scrollLeft > 0;
        // Allow for 1 pixel of rounding errors
        const hasOverflowRight = scroll.scrollWidth - scroll.offsetWidth > scroll.scrollLeft + 1;
        setHasOverflowLeft(hasOverflowLeft);
        setHasOverflowRight(hasOverflowRight);
      }
    };

    if (scroll) {
      // Initial configuration
      handleScroll();
      window.addEventListener('resize', handleScroll);
      scroll.addEventListener('scroll', handleScroll);

      return () => {
        scroll.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleScroll);
      };
    }
  }, []);

  return (
    <div
      className={
        'd-flex justify-content-center align-items-center horizontal-scroll' +
        (hasOverflowLeft ? ' horizontal-scroll--overflow-left' : '') +
        (hasOverflowRight ? ' horizontal-scroll--overflow-right' : '')
      }
    >
      <div
        className={
          'horizontal-scroll__button' +
          (hasOverflowLeft ? ' horizontal-scroll__button--enabled' : '')
        }
        onClick={scrollLeft}
      >
        &lsaquo;
      </div>
      <div className={'horizontal-scroll__content table-responsive'} ref={scrollContainer}>
        {children}
      </div>
      <div
        className={
          'horizontal-scroll__button' +
          (hasOverflowRight ? ' horizontal-scroll__button--enabled' : '')
        }
        onClick={scrollRight}
      >
        &rsaquo;
      </div>
    </div>
  );
}
