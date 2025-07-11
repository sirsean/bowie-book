import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useBookData } from './useBookData';
import { BookData } from '../types/book';

// Mock js-yaml
vi.mock('js-yaml', () => ({
  default: {
    load: vi.fn(),
  },
}));

import yaml from 'js-yaml';
const mockYamlLoad = vi.mocked(yaml.load);

// Mock fetch
global.fetch = vi.fn();

const mockFetch = fetch as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.clearAllMocks();
});

const mockBookData: BookData = {
  bookKey: 'test-book',
  title: 'Test Book Title',
  pages: [
    { image: '/test/cover.jpg', text: 'Cover text' },
    { image: '/test/page1.jpg', text: 'Page 1 text' },
  ],
};

describe('useBookData', () => {
  describe('Successful Data Loading', () => {
    it('should load book data successfully', async () => {
      const yamlContent = `
        bookKey: test-book
        title: Test Book Title
        pages:
          - image: /test/cover.jpg
            text: Cover text
          - image: /test/page1.jpg
            text: Page 1 text
      `;

      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(yamlContent),
      } as Response);

      mockYamlLoad.mockReturnValue(mockBookData);

      const { result } = renderHook(() => useBookData('test-book.yaml'));

      // Initially should be loading
      expect(result.current.loading).toBe(true);
      expect(result.current.data).toBe(null);
      expect(result.current.error).toBe(null);

      // Wait for the hook to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Should have loaded successfully
      expect(result.current.data).toEqual(mockBookData);
      expect(result.current.error).toBe(null);
      expect(mockFetch).toHaveBeenCalledWith('/books/test-book.yaml');
      expect(mockYamlLoad).toHaveBeenCalledWith(yamlContent);
    });

    it('should handle different yaml file names', async () => {
      const testCases = ['super-bowie.yaml', 'bonne-adventure.yaml', 'dragon-fighter.yaml'];

      for (const fileName of testCases) {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve('bookKey: test\ntitle: Test\npages: []'),
        } as Response);

        mockYamlLoad.mockReturnValue({
          bookKey: 'test',
          title: 'Test',
          pages: [],
        });

        const { result } = renderHook(() => useBookData(fileName));

        await waitFor(() => {
          expect(result.current.loading).toBe(false);
        });

        expect(mockFetch).toHaveBeenCalledWith(`/books/${fileName}`);
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 errors with specific message', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      } as Response);

      const { result } = renderHook(() => useBookData('missing-book.yaml'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toBe(null);
      expect(result.current.error).toBe(
        'Book file not found. The missing-book.yaml file may be missing or moved.'
      );
    });

    it('should handle other HTTP errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      } as Response);

      const { result } = renderHook(() => useBookData('test-book.yaml'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toBe(null);
      expect(result.current.error).toBe('Failed to load book data: 500 - Internal Server Error');
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useBookData('test-book.yaml'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toBe(null);
      expect(result.current.error).toBe('Network error');
    });

    it('should handle YAML parsing errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve('invalid yaml content'),
      } as Response);

      mockYamlLoad.mockImplementation(() => {
        throw new Error('Invalid YAML format');
      });

      const { result } = renderHook(() => useBookData('test-book.yaml'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toBe(null);
      expect(result.current.error).toBe('Invalid YAML format');
    });

    it('should handle unknown errors', async () => {
      mockFetch.mockRejectedValueOnce('Unknown error');

      const { result } = renderHook(() => useBookData('test-book.yaml'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toBe(null);
      expect(result.current.error).toBe('An error occurred loading the book');
    });
  });

  describe('State Transitions', () => {
    it('should transition from loading to success', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve('bookKey: test\ntitle: Test\npages: []'),
      } as Response);

      mockYamlLoad.mockReturnValue({
        bookKey: 'test',
        title: 'Test',
        pages: [],
      });

      const { result } = renderHook(() => useBookData('test-book.yaml'));

      // Should start loading
      expect(result.current.loading).toBe(true);
      expect(result.current.data).toBe(null);
      expect(result.current.error).toBe(null);

      // Should transition to success
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).not.toBe(null);
      expect(result.current.error).toBe(null);
    });

    it('should transition from loading to error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Fetch failed'));

      const { result } = renderHook(() => useBookData('test-book.yaml'));

      // Should start loading
      expect(result.current.loading).toBe(true);
      expect(result.current.data).toBe(null);
      expect(result.current.error).toBe(null);

      // Should transition to error
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toBe(null);
      expect(result.current.error).toBe('Fetch failed');
    });
  });

  describe('Hook Behavior', () => {
    it('should only make one fetch request per hook instance', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('bookKey: test\ntitle: Test\npages: []'),
      } as Response);

      mockYamlLoad.mockReturnValue({
        bookKey: 'test',
        title: 'Test',
        pages: [],
      });

      const { result, rerender } = renderHook(() => useBookData('test-book.yaml'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Rerender should not cause another fetch
      rerender();

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should make new fetch request when yamlFileName changes', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('bookKey: test\ntitle: Test\npages: []'),
      } as Response);

      mockYamlLoad.mockReturnValue({
        bookKey: 'test',
        title: 'Test',
        pages: [],
      });

      const { result, rerender } = renderHook(({ fileName }) => useBookData(fileName), {
        initialProps: { fileName: 'first-book.yaml' },
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockFetch).toHaveBeenCalledWith('/books/first-book.yaml');

      // Change the filename
      rerender({ fileName: 'second-book.yaml' });

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/books/second-book.yaml');
      });

      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should reset loading state when filename changes', async () => {
      // Setup initial fetch that resolves
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve('bookKey: test\ntitle: Test\npages: []'),
      } as Response);

      mockYamlLoad.mockReturnValue({
        bookKey: 'test',
        title: 'Test',
        pages: [],
      });

      const { result, rerender } = renderHook(({ fileName }) => useBookData(fileName), {
        initialProps: { fileName: 'first-book.yaml' },
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Setup second fetch that takes longer to resolve
      mockFetch.mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  text: () => Promise.resolve('bookKey: test2\ntitle: Test2\npages: []'),
                } as Response),
              100
            );
          })
      );

      // Change the filename - should reset to loading
      rerender({ fileName: 'second-book.yaml' });

      // Should immediately be loading again
      expect(result.current.loading).toBe(true);
    });
  });
});
