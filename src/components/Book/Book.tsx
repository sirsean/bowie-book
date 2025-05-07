import { useState, useEffect } from 'react';
import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { BookData } from '../../types/book';
import styles from './Book.module.css';

interface PageProps {
  bookKey: string;
  images: string[];
  texts: string[];
  page: number;
}

/**
 * Page component displays a single page of a book with navigation controls
 */
const Page = ({ bookKey, page, images, texts }: PageProps): JSX.Element | null => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // Make sure we have a valid page
  const imgSrc = images[page];
  if (!imgSrc) {
    navigate(`/${bookKey}`);
    return null;
  }
  
  const text = texts[page];
  
  // Navigation functions
  const goToPrevious = () => {
    if (page > 0) {
      navigate(`/${bookKey}/${page - 1}`);
    } else {
      navigate('/');
    }
  };
  
  const goToNext = () => {
    if (page < images.length - 1) {
      navigate(`/${bookKey}/${page + 1}`);
    }
  };
  
  const goToHome = () => navigate('/');
  const goToCover = () => navigate(`/${bookKey}`);
  
  // Handle image loading and keyboard navigation
  useEffect(() => {
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
  }, [page, imgSrc, bookKey]);
  
  return (
    <div className={styles.pageContainer}>
      {/* Navigation bar */}
      <nav className={styles.nav}>
        {/* Left button: Previous or Home */}
        <button 
          className={styles.navButton} 
          onClick={page > 0 ? goToPrevious : goToHome}
          aria-label={page > 0 ? "Previous page" : "Back to home"}
        >
          {page > 0 ? "Previous" : "Home"}
        </button>
        
        {/* Center button: Cover (only show if not on cover) */}
        {page > 0 && (
          <button 
            className={styles.navButton} 
            onClick={goToCover}
            aria-label="Go to cover"
          >
            Cover
          </button>
        )}
        
        {/* Right button: Next or Finish */}
        <button 
          className={styles.navButton} 
          onClick={page < images.length - 1 ? goToNext : goToHome}
          aria-label={page < images.length - 1 ? "Next page" : "Back to home"}
          disabled={loading}
        >
          {page < images.length - 1 ? "Next" : "Finish"}
        </button>
      </nav>
      
      {/* Image container */}
      <div className={styles.imageWrapper}>
        {loading && <div className={styles.loading} aria-label="Loading" />}
        <img 
          src={imgSrc}
          alt={`Page ${page}`}
          className={styles.pageImage}
          onLoad={() => setLoading(false)}
        />
      </div>
      
      {/* Touch navigation overlay for left/right swipes */}
      <div className={styles.touchOverlay}>
        <button 
          className={styles.touchPrevious} 
          onClick={goToPrevious}
          aria-label="Previous page (touch area)"
        />
        <button 
          className={styles.touchNext} 
          onClick={goToNext}
          aria-label="Next page (touch area)"
        />
      </div>
      
      {/* Text overlay at bottom */}
      {text && (
        <div className={styles.textOverlay}>
          {text}
        </div>
      )}
    </div>
  );
};

/**
 * PageRoute component that extracts page number from URL parameters
 */
const PageRoute = ({ bookKey, images, texts }: Omit<PageProps, 'page'>): JSX.Element => {
  const { page } = useParams<{ page: string }>();
  const pageNum = parseInt(page || '0', 10);
  
  // Validate page number to prevent issues
  const validPageNum = isNaN(pageNum) ? 0 : Math.max(0, Math.min(pageNum, images.length - 1));
  
  return (
    <Page 
      bookKey={bookKey} 
      images={images} 
      texts={texts} 
      page={validPageNum} 
    />
  );
};

/**
 * Book component displaying an interactive book with navigation
 */
const Book = (props: BookData): JSX.Element => {
  const { bookKey, images, texts } = props;
  
  return (
    <Routes>
      <Route 
        path="/" 
        element={<Page bookKey={bookKey} images={images} texts={texts} page={0} />} 
      />
      <Route 
        path="/:page" 
        element={<PageRoute bookKey={bookKey} images={images} texts={texts} />} 
      />
    </Routes>
  );
};

export default Book;