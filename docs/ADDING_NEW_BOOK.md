# Adding a New Book

This guide provides step-by-step instructions for adding a new book/story to the Bowie Book application.

## Overview

The Bowie Book application follows a consistent structure for organizing books. Each book consists of:
- Optimized images stored in the public directory
- A YAML file that defines the book's content and metadata
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

### Step 2: Add Book Route and Preview

#### 2.1 Define Book Route

Add the route configuration in the `App.tsx` using the unique book identifier:

```typescript
<Route path="/<book-id>/*" element={<LazyYamlBookWrapper yamlFileName='<book-id>.yaml' />} />;
```

#### 2.2 Update Home Component

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

### Step 3: Creating the Book Data (YAML)

#### 3.1 Create Book YAML File
Create a YAML file in the `public/books/` directory with the same book identifier:

```yaml
# public/books/<book-id>.yaml
title: "Book Title"
pages:
  - image: "/books/<book-id>/0-cover.webp"
    text: "Book Title"
  - image: "/books/<book-id>/1-opening.webp"
    text: "Once upon a time..."
  - image: "/books/<book-id>/2-adventure.webp"
    text: "The adventure begins..."
  - image: "/books/<book-id>/3-climax.webp"
    text: "The exciting climax..."
  - image: "/books/<book-id>/4-ending.webp"
    text: "The happy ending..."
```

#### 3.2 YAML Template
```yaml
title: "[BOOK_TITLE]"
pages:
  - image: "/books/[BOOK_ID]/0-cover.[ext]"
    text: "[BOOK_TITLE]"
  - image: "/books/[BOOK_ID]/1.[ext]"
    text: "[PAGE_TEXT]"
  # Add more pages as needed
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
const pages = [
  {
    image: '/books/amazing-adventure/0-cover.webp',
    text: 'My Amazing Adventure',
  },
  {
    image: '/books/amazing-adventure/1-setup.webp',
    text: 'Once upon a time, there was a brave little girl named Luna.',
  },
  {
    image: '/books/amazing-adventure/2-character.webp',
    text: 'Luna loved to explore the enchanted forest behind her house.',
  },
  {
    image: '/books/amazing-adventure/3-incident.webp',
    text: 'One day, she discovered a hidden path she had never seen before.',
  },
  {
    image: '/books/amazing-adventure/4-discovery.webp',
    text: 'The path led to a magical garden full of talking flowers!',
  },
  {
    image: '/books/amazing-adventure/5-development.webp',
    text: 'Luna made friends with the flowers and learned their secret.',
  },
  {
    image: '/books/amazing-adventure/6-resolution.webp',
    text: 'She promised to visit them every day and keep their secret safe.',
  },
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
├── public/books/book-id.yaml
├── src/App.tsx (updated)
└── src/components/Home/Home.tsx (updated)
```

## Checklist

Before deploying your new book, verify:

- [ ] Images are optimized and properly named
- [ ] Images are placed in correct directory: `public/books/<book-id>/`
- [ ] YAML file is created with proper structure
- [ ] `title` field matches the book's display title
- [ ] `pages` array has correct image paths and order
- [ ] Each page object has both `image` and `text` properties
- [ ] Route is added to `App.tsx`
- [ ] Preview entry is added to `Home.tsx`
- [ ] All paths use consistent `book-id`
- [ ] Application builds without errors
- [ ] Book displays correctly in browser
- [ ] Navigation works between pages
- [ ] Home page shows new book preview

## Common Pitfalls to Avoid

1. **Missing Properties:** Ensure each page object has both `image` and `text` properties
2. **Incorrect Paths:** Double-check all image paths start with `/books/`
3. **Route Conflicts:** Ensure `book-id` is unique across all books
4. **YAML Syntax:** Ensure proper YAML formatting with correct indentation
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
