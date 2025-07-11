import { useState, useEffect } from 'react';
import yaml from 'js-yaml';
import Book from '../../components/Book/Book';
import { BookData } from '../../types/book';

/**
 * SuperBowie book component
 *
 * Displays an interactive storybook about Super Bowie's adventures
 * as a superhero helping others and saving the day.
 */
export default function SuperBowie(): JSX.Element | null {
  const [data, setData] = useState<BookData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBookData = async () => {
      try {
        const response = await fetch('/super-bowie.yaml');
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Book file not found. The super-bowie.yaml file may be missing or moved.');
          }
          throw new Error(`Failed to load book data: ${response.status} - ${response.statusText}`);
        }
        const yamlText = await response.text();
        const bookData = yaml.load(yamlText) as BookData;
        setData(bookData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred loading the book');
      } finally {
        setLoading(false);
      }
    };

    loadBookData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-grad bg-[length:400%_400%] animate-gradient-slow">
        <div
          className="w-16 h-16 rounded-full bg-conic-gradient animate-loader"
          aria-label="Loading"
        >
          <div className="absolute top-1 left-1 right-1 bottom-1 bg-background rounded-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background-grad bg-[length:400%_400%] animate-gradient-slow p-4">
        <div className="text-center max-w-lg bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 shadow-2xl">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-3xl font-bold text-white mb-4">Oops! Book Not Found</h2>
          <p className="text-white/90 mb-6 text-lg leading-relaxed">
            We're having trouble loading the Super Bowie book. The story file might be missing or temporarily unavailable.
          </p>
          <details className="mb-6 text-left">
            <summary className="text-white/70 cursor-pointer hover:text-white transition-colors">
              Technical Details
            </summary>
            <p className="text-white/60 mt-2 font-mono text-sm bg-black/20 p-3 rounded">
              {error}
            </p>
          </details>
          <a
            href="/"
            className="inline-block bg-purple/90 text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple/80 transition-all hover:scale-105 hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
          >
            🏠 Back to Home
          </a>
        </div>
      </div>
    );
  }

  if (data) {
    return <Book bookKey={data.bookKey} pages={data.pages} />;
  }

  return null;
}
