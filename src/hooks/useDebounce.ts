import { useEffect } from 'react';

function useDebounce(callback: () => void, delay: number) {
  useEffect(() => {
    const handler = setTimeout(() => {
      callback();
    }, delay);

    return () => clearTimeout(handler);
  }, [callback, delay]);
}

export default useDebounce