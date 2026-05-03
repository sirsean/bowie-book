# Agent guide: Bowie’s Books

This repository is a small **React + TypeScript** children’s book reader: a rainbow-themed home grid links into per-book readers with page-by-page navigation (buttons, keyboard, and touch zones).

Use this document to orient yourself quickly and to add a new book without breaking CI.

## Stack and layout

| Area | Notes |
|------|--------|
| Build | [Vite](https://vitejs.dev/) (`vite.config.ts`) |
| UI | [React 18](https://react.dev/), [React Router v6](https://reactrouter.com/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) (`tailwind.config.ts`, `src/index.css` with `@theme`) |
| Book content | [js-yaml](https://github.com/nodeca/js-yaml) loads **YAML** from `public/books/` at runtime (`fetch`) |
| Unit tests | [Vitest](https://vitest.dev/) + Testing Library (`vitest.config.ts`) |
| E2E | [Playwright](https://playwright.dev/) (`playwright.config.ts`, `tests/e2e/`) |
| CI | `.github/workflows/ci.yml` — align local checks with `npm run ci:test` when possible |

Important paths:

- `src/App.tsx` — top-level routes; each book is a **lazy** wrapper around `YamlBookWrapper`.
- `src/components/YamlBookWrapper.tsx` — loads YAML via `useBookData`, then renders `Book`.
- `src/components/Book/Book.tsx` — nested routes for cover vs numbered pages; navigation URLs use **`bookKey`** from YAML.
- `src/components/Home/Home.tsx` — static list of cover cards linking to `/${id}`.
- `src/hooks/useBookData.ts` — `GET /books/<yamlFileName>` (files live under `public/books/`).
- `src/types/book.ts` — `BookData` / `Page` shapes.
- `src/tests/yaml-validation.test.ts` — **validates every `*.yaml` / `*.yml` in `public/books/`** and asserts a fixed list of expected filenames.
- `docs/ADDING_NEW_BOOK.md` — detailed human guide for images, copy, and pitfalls (supplement this file).

## URLs and routing

- Home: `/`
- Book cover (page 0): `/<bookKey>` or `/<bookKey>/0` (both work with React Router and tests).
- Story pages: `/<bookKey>/<n>` where `n` is the zero-based page index.
- `bookKey` in YAML **must** match the URL segment and is used in `navigate(\`/${bookKey}/${page}\`)` inside `Book.tsx`.

Each book’s top-level route in `App.tsx` uses a trailing `/*` so nested routes inside `Book` match.

## Book data contract (`BookData`)

YAML files under `public/books/` are parsed into `BookData`:

- **`bookKey`** (string, required): Must equal the YAML **filename without** `.yaml` / `.yml`. CI enforces this in `yaml-validation.test.ts`.
- **`title`** (string, required): Display title; also used in error UI when load fails.
- **`pages`** (array, required): Each item has **`image`** and **`text`** (both strings). `text` may be empty; `image` must be non-empty.
- **Image paths**: Must start with `/books/` and **contain** `bookKey` (enforced by tests).

First page is treated as the cover in content-quality tests: its `image` path should match `cover` or `0` (regex in tests).

## Commands (daily work)

```bash
npm install
npm run dev          # http://localhost:5173 (default Vite port)
npm run build
npm run lint
npm run typecheck
npm run format:check # Prettier: src/**/*.{js,jsx,ts,tsx,css,md} only
npm run test:unit
npm run e2e          # needs playwright browsers: npx playwright install --with-deps
npm run test         # unit (vitest) then e2e
npm run ci:test      # coverage + e2e with CI-style reporter
```

After changing `Home.tsx` markup or book list, update unit snapshots if needed: `npm run test:update-snapshots` (review diff carefully).

## How to add a new book

Pick a single **slug** (kebab-case), e.g. `my-new-story`. Use it **consistently** everywhere: folder name, YAML basename, `bookKey`, route path, and Home `id`.

### 1. Assets

1. Create `public/books/<slug>/` and add images (WebP preferred). Cover naming conventions and optimization tips are in `docs/ADDING_NEW_BOOK.md`.
2. Ensure the first page image path will satisfy the YAML test’s cover heuristic (`cover` or `0` in the filename).

### 2. YAML

Create `public/books/<slug>.yaml`:

```yaml
bookKey: '<slug>'   # MUST match filename: <slug>.yaml → bookKey <slug>
title: 'Display Title'
pages:
  - image: '/books/<slug>/0-cover.webp'
    text: 'Display Title'
  - image: '/books/<slug>/1.webp'
    text: 'Page one copy…'
  # …
```

Use straight quotes; escape apostrophes in text as in existing books (e.g. `don''t`).

### 3. Routing

In `src/App.tsx`:

1. Add `const MyNewStory = lazyYamlBook('<slug>.yaml');` next to the other books.
2. Add `<Route path="/<slug>/*" element={<MyNewStory />} />` inside `Routes`.

Pattern to copy: existing `lazyYamlBook` + `Route` entries in `App.tsx`.

### 4. Home grid

In `src/components/Home/Home.tsx`, append to the `books` array:

```typescript
{ id: '<slug>', title: 'Display Title', coverImage: '/books/<slug>/0-cover.webp' }
```

`id` must match the route (`to={\`/${book.id}\`}`) and **`bookKey`**.

### 5. Tests (required for green CI)

When you add `public/books/<slug>.yaml`, update **all** of the following that apply:

| File | What to update |
|------|----------------|
| `src/tests/yaml-validation.test.ts` | Add `'<slug>.yaml'` to the `expectedBooks` array in the “validate all expected book files exist” test. |
| `src/components/Home/Home.test.tsx` | Bump expected cover **count** and extend `expectedBooks` with `title` + `coverImage` for the new card. |
| `tests/e2e/home.spec.ts` | Bump `toHaveCount(N)` for covers, extend `expectedBooks` titles, and fix the `href` regex if you ever use non–kebab-case IDs (currently `[a-z-]+`). |

E2E specs such as `tests/e2e/book-navigation.spec.ts` hard-code **page counts** for specific books (e.g. Super Bowie). Only change those if you alter that book’s length or behavior; new books do not require edits there unless you add scenarios for them.

Run at minimum:

```bash
npm run test:unit
npm run build
npm run e2e:ci
```

## Conventions for agents

- Prefer **small, focused diffs**: touch `App.tsx`, `Home.tsx`, `public/books/`, and tests together when adding a book.
- Do not rely on `docs/ADDING_NEW_BOOK.md` alone for **`bookKey`** — that field is **mandatory** and tied to the filename in CI.
- Image and routing details: see `docs/ADDING_NEW_BOOK.md` and `docs/TESTING_GUIDELINES.md`.
- Deployment (e.g. Cloudflare Pages): see root `README.md`.
