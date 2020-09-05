import {useEffect, useRef} from 'react';

/**
 * Keep track of the previous value.
 *
 * See https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state
 */
export default function usePrevious<T>(value: T) {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
