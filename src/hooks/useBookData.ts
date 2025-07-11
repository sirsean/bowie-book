import { useState, useEffect } from 'react';
import yaml from 'js-yaml';
import { BookData } from '../types/book';

/**
 * Custom hook for loading book data from YAML files
 *
 * @param yamlFileName - The filename of the YAML file to load (e.g., 'super-bowie.yaml')
 * @returns Object containing book data, loading state, and error state
 */
export function useBookData(yamlFileName: string) {
  const [data, setData] = useState<BookData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset state when filename changes
    setLoading(true);
    setData(null);
    setError(null);

    const loadBookData = async () => {
      try {
        const response = await fetch(`/books/${yamlFileName}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(
              `Book file not found. The ${yamlFileName} file may be missing or moved.`
            );
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
  }, [yamlFileName]);

  return { data, loading, error };
}
