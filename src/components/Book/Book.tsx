import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { BookData, type Page } from '../../types/book';

interface PageProps {
  bookKey: string;
  pages: Page[];
  page: number;
}

/**
 * Page component displays a single page of a book with navigation controls
 */
const Page = ({ bookKey, page, pages }: PageProps): JSX.Element | null => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Navigation functions
  const goToPrevious = useCallback(() => {
    if (page > 0) {
      navigate(`/${bookKey}/${page - 1}`);
    } else {
      navigate('/');
    }
  }, [page, bookKey, navigate]);

  const goToNext = useCallback(() => {
    if (pages && page < pages.length - 1) {
      navigate(`/${bookKey}/${page + 1}`);
    }
  }, [page, bookKey, navigate, pages]);

  const goToHome = useCallback(() => navigate('/'), [navigate]);
  const goToCover = useCallback(() => navigate(`/${bookKey}`), [navigate, bookKey]);

  // Get current page data
  const currentPage = pages?.[page];
  const imgSrc = currentPage?.image;
  const text = currentPage?.text;

  // Handle image loading and keyboard navigation
  useEffect(() => {
    // If no image, navigate back to cover
    if (!imgSrc) {
      navigate(`/${bookKey}`);
      return;
    }

    // Reset loading state when page changes
    setLoading(true);

    // Load current image
    const img = new Image();
    img.src = imgSrc;
    img.onload = () => setLoading(false);

    // Keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrevious();
      else if (e.key === 'ArrowRight') goToNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [page, imgSrc, bookKey, goToNext, goToPrevious, navigate]);

  // Early returns after all hooks have been called
  if (!pages || pages.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center bg-background-grad p-4 animate-fade">
        <h2 className="text-2xl font-bold text-white mb-6">No Pages Available</h2>
        <p className="text-white/80">
          There seems to be an issue with loading the book pages. Please try again later or contact
          support.
        </p>
      </div>
    );
  }

  if (!imgSrc) {
    return null;
  }

  return (
    <div className="relative flex flex-col w-full min-h-screen h-full overflow-hidden bg-background-grad bg-[length:400%_400%] animate-gradient-slow">
      {/* Navigation bar */}
      <nav className="flex justify-between items-center w-full p-3 bg-gradient-to-r from-red/85 to-purple/85 backdrop-blur z-10 shadow-lg">
        {/* Left button: Previous or Home */}
        <button
          className="min-w-[90px] bg-green/90 rounded font-semibold shadow-md px-4 py-2 text-white transition hover:-translate-y-1 hover:brightness-110 disabled:opacity-50 md:min-w-[110px] md:text-xl md:px-5 md:py-3 text-lg sm:min-w-[80px] sm:text-base sm:px-3 sm:py-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
          onClick={page > 0 ? goToPrevious : goToHome}
          aria-label={page > 0 ? 'Previous page' : 'Back to home'}
        >
          {page > 0 ? 'Previous' : 'Home'}
        </button>

        {/* Center button: Cover (only show if not on cover) */}
        {page > 0 && (
          <button
            className="min-w-[90px] bg-yellow/90 rounded font-semibold shadow-md px-4 py-2 text-white transition hover:-translate-y-1 hover:brightness-110 disabled:opacity-50 md:min-w-[110px] md:text-xl md:px-5 md:py-3 text-lg sm:min-w-[80px] sm:text-base sm:px-3 sm:py-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
            onClick={goToCover}
            aria-label="Go to cover"
          >
            Cover
          </button>
        )}

        {/* Right button: Next or Finish */}
        <button
          className="min-w-[90px] bg-red/90 rounded font-semibold shadow-md px-4 py-2 text-white transition hover:-translate-y-1 hover:brightness-110 disabled:opacity-50 md:min-w-[110px] md:text-xl md:px-5 md:py-3 text-lg sm:min-w-[80px] sm:text-base sm:px-3 sm:py-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
          onClick={pages && page < pages.length - 1 ? goToNext : goToHome}
          aria-label={pages && page < pages.length - 1 ? 'Next page' : 'Back to home'}
          disabled={loading}
        >
          {pages && page < pages.length - 1 ? 'Next' : 'Finish'}
        </button>
      </nav>

      {/* Image container */}
      <div className="flex-1 flex items-center justify-center relative p-4">
        {loading && (
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-conic-gradient animate-loader"
            aria-label="Loading"
          >
            <div className="absolute top-1 left-1 right-1 bottom-1 bg-background rounded-full"></div>
          </div>
        )}
        <img
          src={imgSrc}
          alt={`Page ${page}`}
          className="max-w-[95%] max-h-[95%] rounded-lg border-4 md:border-5 border-white shadow-2xl animate-float object-contain sm:max-w-[92%] sm:max-h-[85%]"
          onLoad={() => setLoading(false)}
        />
      </div>

      {/* Touch navigation overlay for left/right swipes */}
      <div className="absolute top-0 left-0 w-full h-full flex z-[4]">
        <button
          className="flex-1 h-full bg-transparent focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/50 focus-visible:ring-inset"
          onClick={goToPrevious}
          aria-label="Previous page (touch area)"
        />
        <button
          className="flex-1 h-full bg-transparent focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/50 focus-visible:ring-inset"
          onClick={goToNext}
          aria-label="Next page (touch area)"
        />
      </div>

      {/* Text overlay at bottom */}
      {text && (
        <div
          className="absolute bottom-0 left-0 w-full max-h-[40%] overflow-y-auto p-5 text-white text-lg leading-relaxed bg-gradient-to-t from-purple/90 via-blue/80 via-80% to-blue/10 backdrop-blur border-t border-white/30 text-shadow shadow-text z-overlay md:text-xl md:p-5 sm:text-base sm:p-3 sm:max-h-[50%]"
          data-testid="text-overlay"
        >
          {text}
        </div>
      )}
    </div>
  );
};

/**
 * PageRoute component that extracts page number from URL parameters
 */
const PageRoute = ({ bookKey, pages }: Omit<PageProps, 'page'>): JSX.Element => {
  const { page } = useParams<{ page: string }>();
  const pageNum = parseInt(page || '0', 10);

  // Validate page number to prevent issues
  const validPageNum = isNaN(pageNum)
    ? 0
    : Math.max(0, Math.min(pageNum, (pages?.length || 1) - 1));

  return <Page bookKey={bookKey} pages={pages} page={validPageNum} />;
};

/**
 * Book component displaying an interactive book with navigation
 */
const Book = (props: BookData): JSX.Element => {
  const { bookKey, pages } = props;

  return (
    <Routes>
      <Route path="/" element={<Page bookKey={bookKey} pages={pages} page={0} />} />
      <Route path="/:page" element={<PageRoute bookKey={bookKey} pages={pages} />} />
    </Routes>
  );
};

export default Book;
