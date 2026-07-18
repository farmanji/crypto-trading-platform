import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * React Router doesn't reset scroll position on navigation (unlike a
 * traditional multi-page site) — without this, clicking a link while
 * scrolled halfway down one page lands you at the same scroll offset on
 * the next page. Mount this once inside <BrowserRouter>, above the <Routes>.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
