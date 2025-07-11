import { useBookData } from '../hooks/useBookData';
import BookLoader from './BookLoader';
import BookError from './BookError';
import Book from './Book/Book';

interface YamlBookWrapperProps {
  yamlFileName: string;
}

/**
 * Higher-order component for YAML-based book components
 *
 * Handles loading, error states, and rendering of books that use YAML data files
 */
export default function YamlBookWrapper({
  yamlFileName,
}: YamlBookWrapperProps): JSX.Element | null {
  const { data, loading, error } = useBookData(yamlFileName);

  if (loading) {
    return <BookLoader />;
  }

  if (error) {
    return <BookError error={error} bookTitle={data?.title || yamlFileName} />;
  }

  if (data) {
    return <Book bookKey={data.bookKey} title={data.title} pages={data.pages} />;
  }

  return null;
}
