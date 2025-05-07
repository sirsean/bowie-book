import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { PageProps, PageRouteProps, BookData } from '../types/book';

export function Page({ bookKey, page, images, texts }: PageProps): JSX.Element | null {
  const navigate = useNavigate();
  const imgSrc = images[page];
  
  if (!imgSrc) {
    return null;
  }
  
  const text = texts[page];
  
  return (
    <div className="Page">
      <div className="Page-nav">
        {page > 0 && (
          <button onClick={() => navigate(`/${bookKey}/${page - 1}`)}>
            Previous
          </button>
        )}
        {page === 0 && <button onClick={() => navigate("/")}>Home</button>}
        {page > 0 && (
          <>
            <div className="spacer" />
            <button onClick={() => navigate(`/${bookKey}`)}>Cover</button>
          </>
        )}
        <div className="spacer" />
        {page < images.length - 1 && (
          <button onClick={() => navigate(`/${bookKey}/${page + 1}`)}>
            Next
          </button>
        )}
      </div>
      <div>
        <img src={imgSrc} alt={`Page ${page}`} />
      </div>
      {text && <div className="Page-text">{text}</div>}
    </div>
  );
}

export function PageRoute({ bookKey, images, texts }: PageRouteProps): JSX.Element {
  const { page } = useParams<{ page: string }>();
  return (
    <Page 
      bookKey={bookKey} 
      images={images} 
      texts={texts} 
      page={parseInt(page || '0', 10)} 
    />
  );
}

/**
 * A functional implementation of the Book component
 * @param bookData Object containing book information (bookKey, images, texts)
 */
export default function BookFunctional(bookData: BookData): JSX.Element {
  const { bookKey, images, texts } = bookData;
  
  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <Page 
            bookKey={bookKey} 
            images={images} 
            texts={texts} 
            page={0} 
          />
        } 
      />
      <Route 
        path="/:page" 
        element={
          <PageRoute 
            bookKey={bookKey} 
            images={images} 
            texts={texts} 
          />
        } 
      />
    </Routes>
  );
}