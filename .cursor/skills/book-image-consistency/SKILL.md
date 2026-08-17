---
name: book-image-consistency
description: >-
  Runs bible-gated image generation and vision consistency checks (including
  cross-page outfit/hair continuity) for Bowie books. Use when the user wants
  consistent illustrations, to check existing pages against the character bible,
  or to regenerate pages that drifted between scenes.
---

# Book image consistency

## Prerequisites

1. Character bible must be ready:

```bash
npm run check:book-bible -- --book <bookKey>
```

If not ready, follow the `book-bible-completeness` skill first.

2. `OPENAI_API_KEY` in `.env` (vision + optional image generation).

## Check existing images (no regenerate)

```bash
npm run check:book-images -- --book <bookKey> --pages 6,7
```

Compares each page to the bible and to earlier sibling pages that share the same
character+variant (e.g. page 7 vs page 6 for `human-beach`).

## Generate with consistency loop

Requires an image-gen manifest under `scripts/image-gen/books/`.

```bash
npm run generate:book-images:consistent -- --book <bookKey> [--only 6,7] [--max-attempts 3]
```

Flow per page: generate → vision check (bible + anchors) → rewrite prompt → retry
until pass or attempts exhausted. Run logs land in `scripts/image-gen/.runs/<bookKey>/`.

Check-only (rewrite prompts in the log, do not call the image API):

```bash
npm run generate:book-images:consistent -- --book <bookKey> --check-only --only 7
```

## Interpreting failures

- `kind: bible` — contradicts locked traits in the bible
- `kind: cross_page` — differs from an anchor page (`comparedToPage`)
- `kind: scene` — misses `sceneGoal`

On exhausted attempts, the last image remains on disk and the run log records
verdicts; do not treat it as accepted.

## Notes

- First appearance of a variant uses bible (+ optional refs) only; later pages
  use accepted earlier frames as anchors.
- Intentional wardrobe/form changes must be different `variantId`s in the bible.
