import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import YamlBookWrapper from './YamlBookWrapper';

// Mock the dependencies
vi.mock('./BookLoader', () => ({
  default: () => <div data-testid="book-loader">Loading...</div>,
}));

vi.mock('./BookError', () => ({
  default: ({ error, bookTitle }: { error: string; bookTitle: string }) => (
    <div data-testid="book-error">
      <span data-testid="error-message">{error}</span>
      <span data-testid="book-title">{bookTitle}</span>
    </div>
  ),
}));

vi.mock('./Book/Book', () => ({
  default: ({
    bookKey,
    pages,
  }: {
    bookKey: string;
    pages: Array<{ image: string; text: string }>;
  }) => (
    <div data-testid="book-component">
      <span data-testid="book-key">{bookKey}</span>
      <span data-testid="pages-count">{pages.length}</span>
    </div>
  ),
}));

// Mock the useBookData hook
vi.mock('../hooks/useBookData', () => ({
  useBookData: vi.fn(),
}));

import { useBookData } from '../hooks/useBookData';

const mockUseBookData = useBookData as ReturnType<typeof vi.fn>;

const mockBookData = {
  bookKey: 'test-book',
  title: 'Test Book Title',
  pages: [
    { image: '/test/cover.jpg', text: 'Cover text' },
    { image: '/test/page1.jpg', text: 'Page 1 text' },
    { image: '/test/page2.jpg', text: 'Page 2 text' },
  ],
};

const renderWithRouter = (component: React.ReactElement, initialPath: string = '/') => {
  return render(<MemoryRouter initialEntries={[initialPath]}>{component}</MemoryRouter>);
};

describe('YamlBookWrapper', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading State', () => {
    it('shows loading component when data is loading', () => {
      mockUseBookData.mockReturnValue({
        data: null,
        loading: true,
        error: null,
      });

      renderWithRouter(<YamlBookWrapper yamlFileName="test-book.yaml" />);

      expect(screen.getByTestId('book-loader')).toBeInTheDocument();
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('calls useBookData with correct yaml filename', () => {
      mockUseBookData.mockReturnValue({
        data: null,
        loading: true,
        error: null,
      });

      renderWithRouter(<YamlBookWrapper yamlFileName="super-bowie.yaml" />);

      expect(mockUseBookData).toHaveBeenCalledWith('super-bowie.yaml');
    });
  });

  describe('Error State', () => {
    it('shows error component when there is an error', () => {
      const errorMessage = 'Failed to load book data: 404 - Not Found';
      mockUseBookData.mockReturnValue({
        data: null,
        loading: false,
        error: errorMessage,
      });

      renderWithRouter(<YamlBookWrapper yamlFileName="test-book.yaml" />);

      expect(screen.getByTestId('book-error')).toBeInTheDocument();
      expect(screen.getByTestId('error-message')).toHaveTextContent(errorMessage);
      expect(screen.getByTestId('book-title')).toHaveTextContent('test-book.yaml');
    });

    it('shows book title from data in error state when data is available', () => {
      const errorMessage = 'Network error';
      mockUseBookData.mockReturnValue({
        data: mockBookData,
        loading: false,
        error: errorMessage,
      });

      renderWithRouter(<YamlBookWrapper yamlFileName="test-book.yaml" />);

      expect(screen.getByTestId('book-error')).toBeInTheDocument();
      expect(screen.getByTestId('error-message')).toHaveTextContent(errorMessage);
      expect(screen.getByTestId('book-title')).toHaveTextContent('Test Book Title');
    });

    it('falls back to yamlFileName when data is null in error state', () => {
      const errorMessage = 'Book file not found';
      mockUseBookData.mockReturnValue({
        data: null,
        loading: false,
        error: errorMessage,
      });

      renderWithRouter(<YamlBookWrapper yamlFileName="missing-book.yaml" />);

      expect(screen.getByTestId('book-error')).toBeInTheDocument();
      expect(screen.getByTestId('book-title')).toHaveTextContent('missing-book.yaml');
    });
  });

  describe('Success State', () => {
    it('renders Book component when data is loaded successfully', () => {
      mockUseBookData.mockReturnValue({
        data: mockBookData,
        loading: false,
        error: null,
      });

      renderWithRouter(<YamlBookWrapper yamlFileName="test-book.yaml" />);

      expect(screen.getByTestId('book-component')).toBeInTheDocument();
      expect(screen.getByTestId('book-key')).toHaveTextContent('test-book');
      expect(screen.getByTestId('pages-count')).toHaveTextContent('3');
    });

    it('passes correct props to Book component', () => {
      const customBookData = {
        bookKey: 'custom-book',
        title: 'Custom Book',
        pages: [
          { image: '/custom/cover.jpg', text: 'Custom cover' },
          { image: '/custom/page1.jpg', text: 'Custom page 1' },
        ],
      };

      mockUseBookData.mockReturnValue({
        data: customBookData,
        loading: false,
        error: null,
      });

      renderWithRouter(<YamlBookWrapper yamlFileName="custom-book.yaml" />);

      expect(screen.getByTestId('book-component')).toBeInTheDocument();
      expect(screen.getByTestId('book-key')).toHaveTextContent('custom-book');
      expect(screen.getByTestId('pages-count')).toHaveTextContent('2');
    });
  });

  describe('State Transitions', () => {
    it('transitions from loading to success state', async () => {
      // Start with loading state
      mockUseBookData.mockReturnValue({
        data: null,
        loading: true,
        error: null,
      });

      const { rerender } = renderWithRouter(<YamlBookWrapper yamlFileName="test-book.yaml" />);

      expect(screen.getByTestId('book-loader')).toBeInTheDocument();

      // Simulate transition to success state
      mockUseBookData.mockReturnValue({
        data: mockBookData,
        loading: false,
        error: null,
      });

      rerender(<YamlBookWrapper yamlFileName="test-book.yaml" />);

      await waitFor(() => {
        expect(screen.queryByTestId('book-loader')).not.toBeInTheDocument();
        expect(screen.getByTestId('book-component')).toBeInTheDocument();
      });
    });

    it('transitions from loading to error state', async () => {
      // Start with loading state
      mockUseBookData.mockReturnValue({
        data: null,
        loading: true,
        error: null,
      });

      const { rerender } = renderWithRouter(<YamlBookWrapper yamlFileName="test-book.yaml" />);

      expect(screen.getByTestId('book-loader')).toBeInTheDocument();

      // Simulate transition to error state
      const errorMessage = 'Failed to load';
      mockUseBookData.mockReturnValue({
        data: null,
        loading: false,
        error: errorMessage,
      });

      rerender(<YamlBookWrapper yamlFileName="test-book.yaml" />);

      await waitFor(() => {
        expect(screen.queryByTestId('book-loader')).not.toBeInTheDocument();
        expect(screen.getByTestId('book-error')).toBeInTheDocument();
        expect(screen.getByTestId('error-message')).toHaveTextContent(errorMessage);
      });
    });
  });

  describe('Edge Cases', () => {
    it('returns null when data is null and not loading and no error', () => {
      mockUseBookData.mockReturnValue({
        data: null,
        loading: false,
        error: null,
      });

      const { container } = renderWithRouter(<YamlBookWrapper yamlFileName="test-book.yaml" />);

      expect(container.firstChild).toBeNull();
    });

    it('handles empty book data gracefully', () => {
      const emptyBookData = {
        bookKey: '',
        title: '',
        pages: [],
      };

      mockUseBookData.mockReturnValue({
        data: emptyBookData,
        loading: false,
        error: null,
      });

      renderWithRouter(<YamlBookWrapper yamlFileName="test-book.yaml" />);

      expect(screen.getByTestId('book-component')).toBeInTheDocument();
      expect(screen.getByTestId('book-key')).toHaveTextContent('');
      expect(screen.getByTestId('pages-count')).toHaveTextContent('0');
    });

    it('handles book data with missing title', () => {
      const bookDataWithoutTitle = {
        bookKey: 'test-book',
        title: undefined as unknown as string,
        pages: [{ image: '/test/cover.jpg', text: 'Cover text' }],
      };

      mockUseBookData.mockReturnValue({
        data: bookDataWithoutTitle,
        loading: false,
        error: 'Some error',
      });

      renderWithRouter(<YamlBookWrapper yamlFileName="test-book.yaml" />);

      expect(screen.getByTestId('book-error')).toBeInTheDocument();
      expect(screen.getByTestId('book-title')).toHaveTextContent('test-book.yaml');
    });
  });

  describe('Different YAML Files', () => {
    it('works with different yaml file names', () => {
      const testCases = [
        'super-bowie.yaml',
        'bonne-adventure.yaml',
        'dragon-fighter.yaml',
        'custom-book.yaml',
      ];

      testCases.forEach((fileName) => {
        mockUseBookData.mockReturnValue({
          data: mockBookData,
          loading: false,
          error: null,
        });

        renderWithRouter(<YamlBookWrapper yamlFileName={fileName} />);

        expect(mockUseBookData).toHaveBeenCalledWith(fileName);
      });
    });
  });
});
