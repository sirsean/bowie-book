# Adding a New Book

This guide provides step-by-step instructions for adding a new book/story to the Bowie Book application.

## Overview

The Bowie Book application follows a consistent structure for organizing books. Each book consists of:
- Optimized images stored in the public directory
- A YAML file that defines the book's content and metadata (including a required **`bookKey`**)
- Route configuration in the main App component
- A preview entry on the home page
- Updates to automated tests so CI stays green (see [Update automated tests](#update-automated-tests))

## Book identifier (`bookKey`)

Use one **slug** everywhere (kebab-case recommended), for example `my-new-story`:

| Place | Must match slug |
|--------|------------------|
| Image folder | `public/books/<slug>/` |
| YAML file name | `public/books/<slug>.yaml` |
| YAML field `bookKey` | Exactly `<slug>` (unit tests require it to match the filename without `.yaml` / `.yml`) |
| `App.tsx` route | `path="/<slug>/*"` |
| `Home.tsx` `id` | `'<slug>'` (used in links as `/<slug>`) |
| Every `pages[].image` path | Should be under `/books/<slug>/...` (CI checks paths start with `/books/` and contain `bookKey`) |

The reader navigates with URLs like `/<slug>`, `/<slug>/1`, … using this `bookKey`. If `bookKey` disagrees with the filename or routes, the app or tests will break.

**Cover image path (CI):** The first page is treated as the cover in `src/tests/yaml-validation.test.ts`. Its `image` path should include `cover` or `0` (case-insensitive), for example `0-cover.webp` or `0.webp`.

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

#### 2.1 Define book route and lazy loader

In `src/App.tsx`, follow the same pattern as existing books: add a lazy component with `lazyYamlBook` and a route with a trailing `/*` (required for nested routes inside `Book`).

```typescript
const MyNewStory = lazyYamlBook('my-new-story.yaml');

// Inside <Routes>:
<Route path="/my-new-story/*" element={<MyNewStory />} />
```

#### 2.2 Update Home component

Add a new entry to the `books` array in `src/components/Home/Home.tsx`:

```typescript
const books: BookPreview[] = [
  // ... existing books
  {
    id: 'my-new-story',
    title: 'Book Title',
    coverImage: '/books/my-new-story/0-cover.webp',
  },
];
```

`id` must match **`bookKey`** and the route segment (`/<id>`).

### Step 3: Creating the book data (YAML)

#### 3.1 Create book YAML file

Create `public/books/<book-id>.yaml` (same `<book-id>` as the folder and `bookKey`).

```yaml
# public/books/<book-id>.yaml
bookKey: '<book-id>'
title: 'Book Title'
pages:
  - image: '/books/<book-id>/0-cover.webp'
    text: 'Book Title'
  - image: '/books/<book-id>/1-opening.webp'
    text: 'Once upon a time...'
  - image: '/books/<book-id>/2-adventure.webp'
    text: 'The adventure begins...'
  - image: '/books/<book-id>/3-climax.webp'
    text: 'The exciting climax...'
  - image: '/books/<book-id>/4-ending.webp'
    text: 'The happy ending...'
```

In YAML strings, escape a single quote inside text by doubling it (e.g. `don''t`), matching existing books.

#### 3.2 YAML template

```yaml
bookKey: '[BOOK_ID]'
title: '[BOOK_TITLE]'
pages:
  - image: '/books/[BOOK_ID]/0-cover.[ext]'
    text: '[BOOK_TITLE]'
  - image: '/books/[BOOK_ID]/1.[ext]'
    text: '[PAGE_TEXT]'
  # Add more pages as needed
```

Required fields are validated in `src/tests/yaml-validation.test.ts`: `bookKey`, `title`, and `pages` with `image` and `text` on every page.

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
├── src/components/Home/Home.tsx (updated)
├── src/tests/yaml-validation.test.ts (expected book list)
├── src/components/Home/Home.test.tsx (cover count and expected books)
└── tests/e2e/home.spec.ts (cover count and expected titles)
```

## Update automated tests

CI validates every `*.yaml` / `*.yml` under `public/books/` and expects a fixed list of book files. After adding a new YAML book, update the following so `npm run test:unit` and `npm run e2e:ci` pass.

| File | What to change |
|------|----------------|
| `src/tests/yaml-validation.test.ts` | Add `'<book-id>.yaml'` to the `expectedBooks` array in the test *“should validate all expected book files exist”*. |
| `src/components/Home/Home.test.tsx` | Increase the expected number of cover images (e.g. `toHaveLength(6)` → `7`) and add the new book to the `expectedBooks` array (`title` + `coverImage`). |
| `tests/e2e/home.spec.ts` | Bump `toHaveCount(N)` for book covers, add the new title to `expectedBooks`, and adjust the book link `href` assertion if you use characters outside `[a-z-]` in ids. |

Other E2E specs (for example `tests/e2e/book-navigation.spec.ts`) hard-code page counts or flows for specific books. Update those only if you change those books or add new scenarios there.

If `Home.tsx` layout or copy changes snapshots, run `npm run test:update-snapshots` and review the diff.

## Checklist

Before deploying your new book, verify:

- [ ] Images are optimized and properly named
- [ ] Images are placed in correct directory: `public/books/<book-id>/`
- [ ] YAML file is created with proper structure
- [ ] **`bookKey` is set and matches the YAML filename** (without `.yaml` / `.yml`)
- [ ] `title` field matches the book's display title
- [ ] `pages` array has correct image paths and order
- [ ] Each page object has both `image` and `text` properties
- [ ] First page `image` path suggests a cover (`cover` or `0` in the filename) for validation tests
- [ ] All `image` paths start with `/books/` and include `bookKey`
- [ ] Route and lazy loader are added to `App.tsx`
- [ ] Preview entry is added to `Home.tsx` with `id` equal to `bookKey`
- [ ] **Unit and E2E tests updated** (see [Update automated tests](#update-automated-tests))
- [ ] All paths use consistent `book-id`
- [ ] Application builds without errors (`npm run build`)
- [ ] Book displays correctly in browser
- [ ] Navigation works between pages
- [ ] Home page shows new book preview

## Common pitfalls to avoid

1. **Missing or mismatched `bookKey`:** It must be present and equal to the YAML basename; otherwise `yaml-validation.test.ts` fails and URLs will not match `Home` links.
2. **Missing properties:** Ensure each page object has both `image` and `text` properties (`text` may be empty).
3. **Incorrect paths:** Double-check all image paths start with `/books/` and include the same slug as `bookKey`.
4. **Route conflicts:** Ensure `book-id` is unique across all books.
5. **YAML syntax:** Use correct indentation; escape `'` inside single-quoted strings as `''`.
6. **Case sensitivity:** Be consistent with file and directory naming.
7. **Image optimization:** Large images will slow down the application.
8. **Forgotten test updates:** Adding `public/books/new.yaml` without updating `expectedBooks` in `yaml-validation.test.ts` breaks CI.

## Testing your new book

1. **Unit tests:** `npm run test:unit` (includes YAML structure checks for all books in `public/books/`).
2. **Build:** `npm run build` for TypeScript and Vite.
3. **E2E:** `npm run e2e` or `npm run e2e:ci` (install browsers once: `npx playwright install --with-deps`).
4. **Full suite:** `npm run test` or `npm run ci:test` to mirror CI more closely.
5. **Local manual check:** `npm run dev` — navigation, keyboard, and touch areas.
6. **Responsive and performance:** Check key breakpoints and image load times.

See [Testing Guidelines](./TESTING_GUIDELINES.md) for more detail.

## Additional resources

- **[AGENTS.md](../AGENTS.md)** — Agent-oriented overview of the repo and the same book workflow
- **React Router documentation:** For advanced routing needs
- **Image Optimization Tools:** Consider using tools like ImageOptim or online WebP converters
- **Accessibility Guidelines:** Follow WCAG guidelines for alt text and navigation
- **TypeScript Documentation:** For type safety and component interfaces

---

*This guide ensures consistency and maintainability across all books in the Bowie Book application.*
