import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import yaml from 'js-yaml';
import { BookData } from '../types/book';

/**
 * YAML Book Files Validation Tests
 *
 * These tests ensure all book YAML files in public/books/ are valid
 * and contain the required structure for the application.
 */

describe('Book YAML Files Validation', () => {
  // Get all YAML files from public/books directory
  const booksDir = join(process.cwd(), 'public', 'books');
  const yamlFiles = readdirSync(booksDir).filter(
    (file) => file.endsWith('.yaml') || file.endsWith('.yml')
  );

  describe('YAML Syntax Validation', () => {
    yamlFiles.forEach((fileName) => {
      it(`should have valid YAML syntax: ${fileName}`, () => {
        const filePath = join(booksDir, fileName);
        const fileContent = readFileSync(filePath, 'utf8');

        // This should not throw an error for valid YAML
        expect(() => {
          yaml.load(fileContent);
        }).not.toThrow();
      });
    });
  });

  describe('Book Data Structure Validation', () => {
    yamlFiles.forEach((fileName) => {
      it(`should have required book properties: ${fileName}`, () => {
        const filePath = join(booksDir, fileName);
        const fileContent = readFileSync(filePath, 'utf8');
        const bookData = yaml.load(fileContent) as BookData;

        // Validate required top-level properties
        expect(bookData).toHaveProperty('bookKey');
        expect(bookData).toHaveProperty('title');
        expect(bookData).toHaveProperty('pages');

        // Validate property types
        expect(typeof bookData.bookKey).toBe('string');
        expect(typeof bookData.title).toBe('string');
        expect(Array.isArray(bookData.pages)).toBe(true);

        // Validate bookKey is not empty
        expect(bookData.bookKey.trim()).not.toBe('');
        expect(bookData.title.trim()).not.toBe('');
        expect(bookData.pages.length).toBeGreaterThan(0);
      });

      it(`should have valid page structure: ${fileName}`, () => {
        const filePath = join(booksDir, fileName);
        const fileContent = readFileSync(filePath, 'utf8');
        const bookData = yaml.load(fileContent) as BookData;

        // Validate each page has required properties
        bookData.pages.forEach((page) => {
          expect(page).toHaveProperty('image');
          expect(page).toHaveProperty('text');

          expect(typeof page.image).toBe('string');
          expect(typeof page.text).toBe('string');

          // Image should not be empty
          expect(page.image.trim()).not.toBe('');

          // Text can be empty (for cover pages or image-only pages)
          expect(typeof page.text).toBe('string');
        });
      });

      it(`should have consistent bookKey with filename: ${fileName}`, () => {
        const filePath = join(booksDir, fileName);
        const fileContent = readFileSync(filePath, 'utf8');
        const bookData = yaml.load(fileContent) as BookData;

        // Extract expected bookKey from filename (remove .yaml/.yml extension)
        const expectedBookKey = fileName.replace(/\.(yaml|yml)$/, '');

        expect(bookData.bookKey).toBe(expectedBookKey);
      });

      it(`should have valid image paths: ${fileName}`, () => {
        const filePath = join(booksDir, fileName);
        const fileContent = readFileSync(filePath, 'utf8');
        const bookData = yaml.load(fileContent) as BookData;

        bookData.pages.forEach((page, index) => {
          // Image paths should start with /books/
          expect(page.image, `Page ${index} image path should start with /books/`).toMatch(
            /^\/books\//
          );

          // Image path should contain the book key
          expect(
            page.image,
            `Page ${index} image path should contain book key "${bookData.bookKey}"`
          ).toContain(bookData.bookKey);
        });
      });
    });
  });

  describe('Content Quality Validation', () => {
    yamlFiles.forEach((fileName) => {
      it(`should have reasonable content lengths: ${fileName}`, () => {
        const filePath = join(booksDir, fileName);
        const fileContent = readFileSync(filePath, 'utf8');
        const bookData = yaml.load(fileContent) as BookData;

        // Title should be reasonable length
        expect(bookData.title.length).toBeGreaterThan(0);
        expect(bookData.title.length).toBeLessThan(100);

        // Each page text should be reasonable (if not empty)
        bookData.pages.forEach((page, index) => {
          if (page.text.trim() !== '') {
            expect(
              page.text.length,
              `Page ${index} text should be less than 1000 characters for readability`
            ).toBeLessThan(1000);
          }
        });
      });

      it(`should have at least a cover page: ${fileName}`, () => {
        const filePath = join(booksDir, fileName);
        const fileContent = readFileSync(filePath, 'utf8');
        const bookData = yaml.load(fileContent) as BookData;

        // Should have at least one page
        expect(bookData.pages.length).toBeGreaterThanOrEqual(1);

        // First page is typically the cover
        const coverPage = bookData.pages[0];
        expect(coverPage.image, 'First page should typically be a cover page').toMatch(/cover|0/i);
      });
    });
  });

  describe('File Coverage', () => {
    it('should find YAML files in the books directory', () => {
      expect(yamlFiles.length).toBeGreaterThan(0);
      console.log(`Found ${yamlFiles.length} YAML book files:`, yamlFiles);
    });

    it('should validate all expected book files exist', () => {
      const expectedBooks = [
        'bonne-adventure.yaml',
        'dragon-fighter.yaml',
        'skyward-bound.yaml',
        'super-bowie.yaml',
        'superkitty-saves-bunnytown.yaml',
        'ziggy-the-bunny.yaml',
      ];

      expectedBooks.forEach((expectedFile) => {
        expect(yamlFiles).toContain(expectedFile);
      });
    });
  });
});
