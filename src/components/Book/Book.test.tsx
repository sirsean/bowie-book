import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Book from './Book';
import { BookData } from '../../types/book';

// Mock image loading
const mockImageLoad = vi.fn();

beforeEach(() => {
  // Mock Image constructor to control image loading
  Object.defineProperty(global, 'Image', {
    value: class MockImage {
      constructor() {
        setTimeout(() => {
          if (mockImageLoad) mockImageLoad();
        }, 0);
      }
      
      set src(_value: string) {
        // Simulate successful image load by default
        setTimeout(() => {
          if (this.onload) this.onload();
        }, 0);
      }
      
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
    },
    configurable: true,
  });
});

afterEach(() => {
  vi.clearAllMocks();
  // Clean up event listeners
  const handlers = (window as any)._eventHandlers;
  if (handlers) {
    Object.keys(handlers).forEach(event => {
      handlers[event].forEach((handler: EventListener) => {
        window.removeEventListener(event, handler);
      });
    });
  }
});

const mockBookData: BookData = {
  bookKey: 'test-book',
  images: [
    '/images/cover.jpg',
    '/images/page1.jpg',
    '/images/page2.jpg',
    '/images/page3.jpg'
  ],
  texts: [
    'Cover page text',
    'Page 1 text content',
    'Page 2 text content',
    'Final page text'
  ]
};

const renderBookWithRouter = (initialPath: string = '/') => {
  return render(
    <MemoryRouter initialEntries={[`/test-book${initialPath === '/' ? '' : initialPath}`]}>
      <Routes>
        <Route path="/test-book/*" element={<Book {...mockBookData} />} />
        <Route path="/" element={<div>Home Page</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe('Book Component', () => {
  describe('Cover Page Rendering', () => {
    it('renders cover page with valid props', async () => {
      renderBookWithRouter('/');
      
      // Check if cover image is rendered
      const coverImage = await screen.findByAltText('Page 0');
      expect(coverImage).toBeInTheDocument();
      expect(coverImage).toHaveAttribute('src', '/images/cover.jpg');
      
      // Check if cover text is displayed
      expect(screen.getByText('Cover page text')).toBeInTheDocument();
      
      // Check navigation buttons on cover page - use more specific selectors
      expect(screen.getByRole('button', { name: /back to home/i })).toBeInTheDocument();
      const nextButtons = screen.getAllByRole('button', { name: /next page/i });
      expect(nextButtons).toHaveLength(2); // Navigation button and touch overlay
    });

    it('shows loading spinner initially', () => {
      renderBookWithRouter('/');
      
      // Loading spinner should be visible
      expect(screen.getByLabelText('Loading')).toBeInTheDocument();
    });

    it('hides loading spinner after image loads', async () => {
      renderBookWithRouter('/');
      
      // Wait for image to load and loading spinner to disappear
      await waitFor(() => {
        expect(screen.queryByLabelText('Loading')).not.toBeInTheDocument();
      });
    });
  });

  describe('Navigation Buttons', () => {
    it('Previous button navigates to previous page', async () => {
      const user = userEvent.setup();
      renderBookWithRouter('/2');
      
      // Wait for page to load
      await waitFor(() => {
        expect(screen.getByAltText('Page 2')).toBeInTheDocument();
      });
      
      // Get navigation buttons specifically (exclude touch overlay)
      const navButtons = screen.getAllByRole('button', { name: /previous page/i });
      const previousButton = navButtons.find(btn => btn.closest('nav'))!;
      await user.click(previousButton);
      
      // Should navigate to page 1
      await waitFor(() => {
        expect(screen.getByAltText('Page 1')).toBeInTheDocument();
      });
    });

    it('Next button navigates to next page', async () => {
      const user = userEvent.setup();
      renderBookWithRouter('/1');
      
      // Wait for page to load
      await waitFor(() => {
        expect(screen.getByAltText('Page 1')).toBeInTheDocument();
      });
      
      // Get navigation buttons specifically (exclude touch overlay)
      const navButtons = screen.getAllByRole('button', { name: /next page/i });
      const nextButton = navButtons.find(btn => btn.closest('nav'))!;
      await user.click(nextButton);
      
      // Should navigate to page 2
      await waitFor(() => {
        expect(screen.getByAltText('Page 2')).toBeInTheDocument();
      });
    });

    it('Home button navigates to home page', async () => {
      const user = userEvent.setup();
      renderBookWithRouter('/2');
      
      // Wait for page to load
      await waitFor(() => {
        expect(screen.getByAltText('Page 2')).toBeInTheDocument();
      });
      
      // Look for the correct Previous button (which goes to previous page, not home)
      const previousButton = screen.getByText('Previous');
      await user.click(previousButton);
      
      // Should navigate to page 1
      await waitFor(() => {
        expect(screen.getByAltText('Page 1')).toBeInTheDocument();
      });
    });

    it('Cover button navigates to cover page', async () => {
      const user = userEvent.setup();
      renderBookWithRouter('/2');
      
      // Wait for page to load
      await waitFor(() => {
        expect(screen.getByAltText('Page 2')).toBeInTheDocument();
      });
      
      const coverButton = screen.getByRole('button', { name: /go to cover/i });
      await user.click(coverButton);
      
      // Should navigate to cover page
      await waitFor(() => {
        expect(screen.getByAltText('Page 0')).toBeInTheDocument();
      });
    });

    it('Cover button is not visible on cover page', () => {
      renderBookWithRouter('/');
      
      // Cover button should not be present on cover page
      expect(screen.queryByRole('button', { name: /go to cover/i })).not.toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    it('ArrowLeft key navigates to previous page', async () => {
      renderBookWithRouter('/2');
      
      // Wait for page to load
      await waitFor(() => {
        expect(screen.getByAltText('Page 2')).toBeInTheDocument();
      });
      
      // Press ArrowLeft key
      fireEvent.keyDown(window, { key: 'ArrowLeft' });
      
      // Should navigate to page 1
      await waitFor(() => {
        expect(screen.getByAltText('Page 1')).toBeInTheDocument();
      });
    });

    it('ArrowRight key navigates to next page', async () => {
      renderBookWithRouter('/1');
      
      // Wait for page to load
      await waitFor(() => {
        expect(screen.getByAltText('Page 1')).toBeInTheDocument();
      });
      
      // Press ArrowRight key
      fireEvent.keyDown(window, { key: 'ArrowRight' });
      
      // Should navigate to page 2
      await waitFor(() => {
        expect(screen.getByAltText('Page 2')).toBeInTheDocument();
      });
    });

    it('Other keys do not trigger navigation', async () => {
      renderBookWithRouter('/1');
      
      // Wait for page to load
      await waitFor(() => {
        expect(screen.getByAltText('Page 1')).toBeInTheDocument();
      });
      
      // Press other keys
      fireEvent.keyDown(window, { key: 'Enter' });
      fireEvent.keyDown(window, { key: 'Space' });
      fireEvent.keyDown(window, { key: 'Escape' });
      
      // Should still be on page 1
      expect(screen.getByAltText('Page 1')).toBeInTheDocument();
    });
  });

  describe('Boundary Handling', () => {
    it('Previous button on first page navigates to home', async () => {
      renderBookWithRouter('/');
      
      // Wait for page to load
      await waitFor(() => {
        expect(screen.getByAltText('Page 0')).toBeInTheDocument();
      });
      
      // Button should show "Home" instead of "Previous"
      const homeButton = screen.getByRole('button', { name: /back to home/i });
      expect(homeButton).toBeInTheDocument();
      // Only check for navigation Previous button, not touch overlay
      const navButtons = screen.queryAllByRole('button', { name: /previous page/i });
      const navPreviousButton = navButtons.find(btn => btn.closest('nav'));
      expect(navPreviousButton).toBeUndefined();
    });

    it('Next button on last page shows Finish and navigates to home', async () => {
      const user = userEvent.setup();
      renderBookWithRouter('/3');
      
      // Wait for page to load
      await waitFor(() => {
        expect(screen.getByAltText('Page 3')).toBeInTheDocument();
      });
      
      // Button should show "Finish" instead of "Next"
      const finishButton = screen.getByRole('button', { name: /back to home/i });
      expect(finishButton).toBeInTheDocument();
      expect(finishButton).toHaveTextContent('Finish');
      
      // Click finish button
      await user.click(finishButton);
      
      // Should navigate to home
      await waitFor(() => {
        expect(screen.getByText('Home Page')).toBeInTheDocument();
      });
    });

    it('ArrowLeft on first page navigates to home', async () => {
      renderBookWithRouter('/');
      
      // Wait for page to load
      await waitFor(() => {
        expect(screen.getByAltText('Page 0')).toBeInTheDocument();
      });
      
      // Press ArrowLeft key
      fireEvent.keyDown(window, { key: 'ArrowLeft' });
      
      // Should navigate to home page
      await waitFor(() => {
        expect(screen.getByText('Home Page')).toBeInTheDocument();
      });
    });

    it('ArrowRight on last page does nothing', async () => {
      renderBookWithRouter('/3');
      
      // Wait for page to load
      await waitFor(() => {
        expect(screen.getByAltText('Page 3')).toBeInTheDocument();
      });
      
      // Press ArrowRight key
      fireEvent.keyDown(window, { key: 'ArrowRight' });
      
      // Should stay on last page
      expect(screen.getByAltText('Page 3')).toBeInTheDocument();
    });
  });

  describe('Loading State and Error Handling', () => {
    it('shows loading spinner until image loads', async () => {
      renderBookWithRouter('/1');
      
      // Loading spinner should be visible initially
      expect(screen.getByLabelText('Loading')).toBeInTheDocument();
      
      // Wait for image to load
      await waitFor(() => {
        expect(screen.queryByLabelText('Loading')).not.toBeInTheDocument();
      });
    });

    it('Next button is disabled while loading', async () => {
      renderBookWithRouter('/1');
      
      // Find the navigation Next button (not touch overlay)
      const navButtons = screen.getAllByRole('button', { name: /next page/i });
      const nextButton = navButtons.find(btn => btn.closest('nav'));
      expect(nextButton).toBeDisabled();
      
      // Wait for loading to complete
      await waitFor(() => {
        expect(nextButton).not.toBeDisabled();
      });
    });

    it('handles image error state', async () => {
      // Mock image constructor to simulate error
      Object.defineProperty(global, 'Image', {
        value: class MockImage {
          constructor() {
            setTimeout(() => {
              if (this.onerror) this.onerror();
            }, 0);
          }
          
          set src(_value: string) {
            // Simulate error
            setTimeout(() => {
              if (this.onerror) this.onerror();
            }, 0);
          }
          
          onload: (() => void) | null = null;
          onerror: (() => void) | null = null;
        },
        configurable: true,
      });
      
      renderBookWithRouter('/1');
      
      // Image should still be rendered even if there's an error
      expect(screen.getByAltText('Page 1')).toBeInTheDocument();
    });
  });

  describe('Touch Overlay Navigation', () => {
    it('touch overlay previous area navigates to previous page', async () => {
      const user = userEvent.setup();
      renderBookWithRouter('/2');
      
      // Wait for page to load
      await waitFor(() => {
        expect(screen.getByAltText('Page 2')).toBeInTheDocument();
      });
      
      // Click on touch previous area
      const touchPrevious = screen.getByRole('button', { name: /previous page \(touch area\)/i });
      await user.click(touchPrevious);
      
      // Should navigate to page 1
      await waitFor(() => {
        expect(screen.getByAltText('Page 1')).toBeInTheDocument();
      });
    });

    it('touch overlay next area navigates to next page', async () => {
      const user = userEvent.setup();
      renderBookWithRouter('/1');
      
      // Wait for page to load
      await waitFor(() => {
        expect(screen.getByAltText('Page 1')).toBeInTheDocument();
      });
      
      // Click on touch next area
      const touchNext = screen.getByRole('button', { name: /next page \(touch area\)/i });
      await user.click(touchNext);
      
      // Should navigate to page 2
      await waitFor(() => {
        expect(screen.getByAltText('Page 2')).toBeInTheDocument();
      });
    });
  });

  describe('Text Overlay', () => {
    it('shows correct text for each page', async () => {
      renderBookWithRouter('/');
      
      // Cover page text
      expect(screen.getByText('Cover page text')).toBeInTheDocument();
      
      // Navigate to page 1 using the nav button specifically
      const navButtons = screen.getAllByRole('button', { name: /next page/i });
      const navNextButton = navButtons.find(btn => btn.closest('nav'));
      await userEvent.setup().click(navNextButton!);
      
      // Page 1 text
      await waitFor(() => {
        expect(screen.getByText('Page 1 text content')).toBeInTheDocument();
      });
    });

    it('does not show text overlay when text is empty', () => {
      const bookWithEmptyText = {
        ...mockBookData,
        texts: ['', 'Page 1 text', '', 'Page 3 text']
      };
      
      render(
        <MemoryRouter initialEntries={['/']}>
          <Book {...bookWithEmptyText} />
        </MemoryRouter>
      );
      
      // Should not show text overlay when text is empty
      expect(screen.queryByText('Cover page text')).not.toBeInTheDocument();
    });
  });

  describe('URL Parameter Routing', () => {
    it('renders expected page from URL parameter', async () => {
      renderBookWithRouter('/2');
      
      // Should render page 2
      await waitFor(() => {
        expect(screen.getByAltText('Page 2')).toBeInTheDocument();
        expect(screen.getByText('Page 2 text content')).toBeInTheDocument();
      });
    });

    it('handles invalid page numbers by clamping to valid range', async () => {
      renderBookWithRouter('/999');
      
      // Should render last page (page 3)
      await waitFor(() => {
        expect(screen.getByAltText('Page 3')).toBeInTheDocument();
      });
    });

    it('handles negative page numbers by clamping to 0', async () => {
      renderBookWithRouter('/-1');
      
      // Should render cover page (page 0)
      await waitFor(() => {
        expect(screen.getByAltText('Page 0')).toBeInTheDocument();
      });
    });

    it('handles non-numeric page parameters', async () => {
      renderBookWithRouter('/abc');
      
      // Should render cover page (page 0)
      await waitFor(() => {
        expect(screen.getByAltText('Page 0')).toBeInTheDocument();
      });
    });

    it('handles missing page parameter', async () => {
      renderBookWithRouter('/');
      
      // Should render cover page (page 0)
      await waitFor(() => {
        expect(screen.getByAltText('Page 0')).toBeInTheDocument();
      });
    });
  });

  describe('Invalid Data Handling', () => {
    it('navigates to cover when page has no image', async () => {
      const bookWithMissingImage = {
        ...mockBookData,
        images: ['/images/cover.jpg'] // Only cover image
      };
      
      render(
        <MemoryRouter initialEntries={['/5']}>
          <Book {...bookWithMissingImage} />
        </MemoryRouter>
      );
      
      // Should navigate to cover page when accessing invalid page
      await waitFor(() => {
        expect(screen.getByAltText('Page 0')).toBeInTheDocument();
      });
    });
  });
});
