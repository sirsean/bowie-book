import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';

const renderWithRouter = (initialEntries: string[] = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Home />
    </MemoryRouter>
  );
};

describe('Home Component', () => {
  describe('Book Cards Rendering', () => {
    it('renders 6 book cards with correct cover images and alt text', () => {
      renderWithRouter();

      // Check that 6 book covers are rendered
      const bookCovers = screen.getAllByRole('img');
      expect(bookCovers).toHaveLength(6);

      // Verify each book cover has correct src and alt text
      const expectedBooks = [
        { title: 'Bonne Adventure', coverImage: '/books/bonne-adventure/0-cover.webp' },
        { title: 'Dragon Fighter', coverImage: '/books/dragon-fighter/0-cover.webp' },
        { title: 'Skyward Bound', coverImage: '/books/skyward-bound/0.webp' },
        { title: 'Ziggy the Bunny', coverImage: '/books/ziggy-the-bunny/0-cover.webp' },
        { title: 'Super Bowie', coverImage: '/books/super-bowie/0-cover.jpg' },
        {
          title: 'Superkitty Saves Bunnytown',
          coverImage: '/books/superkitty-saves-bunnytown/superkitty-cover.png',
        },
      ];

      expectedBooks.forEach((book, index) => {
        const bookCover = bookCovers[index];
        expect(bookCover).toHaveAttribute('src', book.coverImage);
        expect(bookCover).toHaveAttribute('alt', `${book.title} Cover`);
      });
    });

    it('renders book titles under each image', () => {
      renderWithRouter();

      // Check that all book titles are rendered
      const expectedTitles = [
        'Bonne Adventure',
        'Dragon Fighter',
        'Skyward Bound',
        'Ziggy the Bunny',
        'Super Bowie',
        'Superkitty Saves Bunnytown',
      ];

      expectedTitles.forEach((title) => {
        expect(screen.getByText(title)).toBeInTheDocument();
      });
    });

    it('renders main title "Bowie\'s Books!"', () => {
      renderWithRouter();

      expect(screen.getByText("Bowie's Books!")).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('clicking on a book cover navigates to the correct book page', async () => {
      const user = userEvent.setup();
      renderWithRouter();

      // Test clicking on the first book (Bonne Adventure)
      const bonneAdventureLink = screen.getByRole('link', {
        name: /bonne adventure cover bonne adventure/i,
      });
      await user.click(bonneAdventureLink);

      // Check that the link has the correct href
      expect(bonneAdventureLink).toHaveAttribute('href', '/bonne-adventure');
    });

    it('clicking on Dragon Fighter cover navigates to dragon-fighter page', async () => {
      const user = userEvent.setup();
      renderWithRouter();

      const dragonFighterLink = screen.getByRole('link', {
        name: /dragon fighter cover dragon fighter/i,
      });
      await user.click(dragonFighterLink);

      expect(dragonFighterLink).toHaveAttribute('href', '/dragon-fighter');
    });

    it('clicking on Skyward Bound cover navigates to skyward-bound page', async () => {
      const user = userEvent.setup();
      renderWithRouter();

      const skywardBoundLink = screen.getByRole('link', {
        name: /skyward bound cover skyward bound/i,
      });
      await user.click(skywardBoundLink);

      expect(skywardBoundLink).toHaveAttribute('href', '/skyward-bound');
    });

    it('clicking on Ziggy the Bunny cover navigates to ziggy-the-bunny page', async () => {
      const user = userEvent.setup();
      renderWithRouter();

      const ziggyLink = screen.getByRole('link', {
        name: /ziggy the bunny cover ziggy the bunny/i,
      });
      await user.click(ziggyLink);

      expect(ziggyLink).toHaveAttribute('href', '/ziggy-the-bunny');
    });

    it('clicking on Super Bowie cover navigates to super-bowie page', async () => {
      const user = userEvent.setup();
      renderWithRouter();

      const superBowieLink = screen.getByRole('link', { name: /super bowie cover super bowie/i });
      await user.click(superBowieLink);

      expect(superBowieLink).toHaveAttribute('href', '/super-bowie');
    });

    it('clicking on Superkitty Saves Bunnytown cover navigates to superkitty-saves-bunnytown page', async () => {
      const user = userEvent.setup();
      renderWithRouter();

      const superkittyLink = screen.getByRole('link', {
        name: /superkitty saves bunnytown cover superkitty saves bunnytown/i,
      });
      await user.click(superkittyLink);

      expect(superkittyLink).toHaveAttribute('href', '/superkitty-saves-bunnytown');
    });
  });

  describe('Accessibility', () => {
    it('all book covers have proper alt text for screen readers', () => {
      renderWithRouter();

      const expectedAltTexts = [
        'Bonne Adventure Cover',
        'Dragon Fighter Cover',
        'Skyward Bound Cover',
        'Ziggy the Bunny Cover',
        'Super Bowie Cover',
        'Superkitty Saves Bunnytown Cover',
      ];

      expectedAltTexts.forEach((altText) => {
        expect(screen.getByAltText(altText)).toBeInTheDocument();
      });
    });

    it('all book links are keyboard accessible', async () => {
      renderWithRouter();

      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(6);

      links.forEach((link) => {
        expect(link).toHaveAttribute('href');
        expect(link.getAttribute('href')).toMatch(/^\/[a-z-]+$/);
      });
    });
  });

  describe('Image Loading', () => {
    it('sets lazy loading on all book cover images', () => {
      renderWithRouter();

      const bookCovers = screen.getAllByRole('img');
      bookCovers.forEach((cover) => {
        expect(cover).toHaveAttribute('loading', 'lazy');
      });
    });
  });

  describe('Grid Layout', () => {
    it('renders books in a grid container', () => {
      const { container } = renderWithRouter();

      // Check that the grid structure is present
      const gridContainer = container.querySelector('[class*="container"]');
      expect(gridContainer).toBeInTheDocument();

      // Check that the image grid is present
      const imageGrid = container.querySelector('[class*="imageGrid"]');
      expect(imageGrid).toBeInTheDocument();

      // Check that grid items are present (only direct children of imageGrid)
      const gridItems = imageGrid?.children;
      expect(gridItems).toHaveLength(6);
    });

    it('matches grid layout snapshot', () => {
      const { container } = renderWithRouter();

      // Optional snapshot test for grid layout
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('Book Data Structure', () => {
    it('each book has required properties', () => {
      renderWithRouter();

      // Verify that each book link contains both image and title
      const links = screen.getAllByRole('link');

      links.forEach((link) => {
        // Each link should contain an image
        const image = link.querySelector('img');
        expect(image).toBeInTheDocument();

        // Each link should contain a title div
        const titleDiv = link.querySelector('div');
        expect(titleDiv).toBeInTheDocument();
        expect(titleDiv?.textContent).toBeTruthy();
      });
    });
  });
});
