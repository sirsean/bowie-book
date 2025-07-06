# Adding a New Book

This guide provides step-by-step instructions for adding a new book/story to the Bowie Book application.

## Overview

The Bowie Book application follows a consistent structure for organizing books. Each book consists of:
- Optimized images stored in the public directory
- A React component that defines the book's content
- Route configuration in the main App component
- A preview entry on the home page

## Step-by-Step Guide

### Step 1: Optimize & Place Images

#### 1.1 Create Image Directory
Create a new directory under `public/books/` using the book's unique identifier:
```
public/books/<book-id>/
```

#### 1.2 Naming Conventions
Follow these naming patterns for consistency:

**Cover Image:**
- `0-cover.webp` (preferred) or `0-cover.jpg/png`
- Always start with `0-` to ensure it's the first image

**Page Images:**
- Number sequentially: `1.webp`, `2.webp`, `3.webp`, etc.
- Or use descriptive names: `1-garden.webp`, `2-castle.webp`, etc.

**Supported Formats:**
- `.webp` (preferred for smaller file sizes)
- `.jpg` (for photographs)
- `.png` (for images with transparency)

#### 1.3 Image Optimization Tips
- **Resolution:** Optimize for web viewing (typically 1200px width max)
- **Compression:** Balance quality vs file size
- **WebP Format:** Use WebP when possible for better compression
- **File Size:** Aim for under 500KB per image for faster loading

#### 1.4 Example Directory Structure
```
public/books/my-new-book/
├── 0-cover.webp
├── 1-opening.webp
├── 2-adventure.webp
├── 3-climax.webp
└── 4-ending.webp
```

### Step 2: Create Book Component

#### 2.1 Create Book Directory
Create a new directory under `src/books/` using the same book identifier:
```
src/books/<book-id>/
```

#### 2.2 Create Book Component File
Create `<BookName>.tsx` in the book directory (use PascalCase for the filename):

```typescript
import Book from '../../components/Book/Book';

/**
 * [BookName] book component
 *
 * [Brief description of the book's story and theme]
 */
export default function BookName(): JSX.Element {
  const bookKey = 'book-id'; // Must match the directory name

  const images = [
    '/books/book-id/0-cover.webp',
    '/books/book-id/1-opening.webp',
    '/books/book-id/2-adventure.webp',
    '/books/book-id/3-climax.webp',
    '/books/book-id/4-ending.webp',
  ];

  const texts = [
    'Book Title', // Cover page text
    'Once upon a time...', // Page 1 text
    'The adventure begins...', // Page 2 text
    'The exciting climax...', // Page 3 text
    'The happy ending...', // Page 4 text
  ];

  return <Book bookKey={bookKey} images={images} texts={texts} />;
}
```

#### 2.3 Component Template
```typescript
import Book from '../../components/Book/Book';

/**
 * [BOOK_NAME] book component
 *
 * [DESCRIPTION: Brief description of the book's story, characters, and themes]
 */
export default function [COMPONENT_NAME](): JSX.Element {
  const bookKey = '[BOOK_ID]'; // URL-friendly identifier

  const images = [
    // Array of image paths starting with cover (index 0)
    '/books/[BOOK_ID]/0-cover.[ext]',
    // Add subsequent pages...
  ];

  const texts = [
    // Array of text for each page (same length as images)
    '[BOOK_TITLE]', // Cover page
    // Add page text...
  ];

  return <Book bookKey={bookKey} images={images} texts={texts} />;
}
```

#### 2.4 Naming Conventions
- **Component Name:** Use PascalCase (e.g., `MyNewBook`)
- **File Name:** Match component name (e.g., `MyNewBook.tsx`)
- **Book Key:** Use kebab-case matching directory name (e.g., `my-new-book`)

### Step 3: Add Route in App.tsx

#### 3.1 Import the Component
Add the import statement at the top of `src/App.tsx`:
```typescript
import BookName from './books/book-id/BookName';
```

#### 3.2 Add Route
Add the route inside the `<Routes>` component:
```typescript
<Route path="/book-id/*" element={<BookName />} />
```

#### 3.3 Complete Example
```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
// ... other imports
import MyNewBook from './books/my-new-book/MyNewBook';

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* ... other routes */}
        <Route path="/my-new-book/*" element={<MyNewBook />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Step 4: Add Preview Entry to Home Page

#### 4.1 Update Home Component
Add a new entry to the `books` array in `src/components/Home/Home.tsx`:

```typescript
const books: BookPreview[] = [
  // ... existing books
  {
    id: 'book-id',
    title: 'Book Title',
    coverImage: '/books/book-id/0-cover.webp'
  }
];
```

#### 4.2 Preview Entry Template
```typescript
{
  id: '[BOOK_ID]',           // Must match route and directory
  title: '[DISPLAY_TITLE]',  // User-friendly title for display
  coverImage: '[COVER_PATH]' // Path to cover image
}
```

## Alt Text Guidelines

### Image Alt Text Best Practices
- **Cover Images:** Use format: `"[Book Title] Cover"`
- **Page Images:** Use format: `"Page [number]"` or descriptive text
- **Descriptive Alt Text:** For accessibility, consider adding more descriptive alt text

### Example Alt Text Patterns
```typescript
// In Book component, images automatically get alt text as "Page {index}"
// For custom alt text, you would need to modify the Book component

// Cover image alt text example:
alt="My New Book Cover"

// Page alt text examples:
alt="Page 1"
alt="The hero begins their journey" // More descriptive
```

## Text Pagination Guidelines

### Text Length Recommendations
- **Cover Page:** Just the book title
- **Story Pages:** 1-3 sentences per page for young readers
- **Sentence Length:** Keep sentences short and simple
- **Reading Level:** Consider age-appropriate vocabulary

### Text Formatting Tips
- Use consistent narrative voice
- Break longer thoughts across multiple pages
- End pages with natural story beats
- Use engaging, descriptive language

### Example Text Pagination
```typescript
const texts = [
  'My Amazing Adventure',                           // Cover
  'Once upon a time, there was a brave little girl named Luna.',  // Setup
  'Luna loved to explore the enchanted forest behind her house.',  // Character intro
  'One day, she discovered a hidden path she had never seen before.', // Inciting incident
  'The path led to a magical garden full of talking flowers!',     // Discovery
  'Luna made friends with the flowers and learned their secret.',  // Development
  'She promised to visit them every day and keep their secret safe.', // Resolution
];
```

## File Structure Summary

After completing all steps, your new book should have this structure:

```
├── public/books/book-id/
│   ├── 0-cover.webp
│   ├── 1.webp
│   ├── 2.webp
│   └── ...
├── src/books/book-id/
│   └── BookName.tsx
├── src/App.tsx (updated)
└── src/components/Home/Home.tsx (updated)
```

## Checklist

Before deploying your new book, verify:

- [ ] Images are optimized and properly named
- [ ] Images are placed in correct directory: `public/books/<book-id>/`
- [ ] Book component is created with proper naming conventions
- [ ] `bookKey` matches directory name and route
- [ ] `images` array has correct paths and order
- [ ] `texts` array matches `images` array length
- [ ] Route is added to `App.tsx`
- [ ] Import statement is added to `App.tsx`
- [ ] Preview entry is added to `Home.tsx`
- [ ] All paths use consistent `book-id`
- [ ] Component builds without errors
- [ ] Book displays correctly in browser
- [ ] Navigation works between pages
- [ ] Home page shows new book preview

## Common Pitfalls to Avoid

1. **Mismatched Array Lengths:** Ensure `images` and `texts` arrays have the same length
2. **Incorrect Paths:** Double-check all image paths start with `/books/`
3. **Route Conflicts:** Ensure `book-id` is unique across all books
4. **Missing Imports:** Don't forget to import the component in `App.tsx`
5. **Case Sensitivity:** Be consistent with file and directory naming
6. **Image Optimization:** Large images will slow down the application

## Testing Your New Book

1. **Build Test:** Run `npm run build` to ensure no TypeScript errors
2. **Local Testing:** Run `npm run dev` and test in browser
3. **Navigation Test:** Verify all page navigation works correctly
4. **Responsive Test:** Check the book displays well on different screen sizes
5. **Performance Test:** Verify images load reasonably quickly

## Additional Resources

- **React Router Documentation:** For advanced routing needs
- **Image Optimization Tools:** Consider using tools like ImageOptim or online WebP converters
- **Accessibility Guidelines:** Follow WCAG guidelines for alt text and navigation
- **TypeScript Documentation:** For type safety and component interfaces

---

*This guide ensures consistency and maintainability across all books in the Bowie Book application.*
