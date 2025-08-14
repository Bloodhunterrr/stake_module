import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollToTop = (
  containerRef: React.RefObject<HTMLDivElement|null>
) => {
  const location = useLocation();

  useEffect(() => {
    const container = containerRef?.current;

    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname, containerRef]);
};