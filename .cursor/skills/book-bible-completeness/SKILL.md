---
name: book-bible-completeness
description: >-
  Validates and completes character bibles for Bowie book image generation.
  Use when creating or editing scripts/image-gen/bibles/*.json, when the user
  mentions character bible completeness, underspecified cast/outfits/variants,
  or before the first consistent image generation pass.
---

# Book bible completeness

## Goal

Ensure `scripts/image-gen/bibles/<bookKey>.json` is specified enough that vision
checks can fail pages for concrete trait mismatches (outfit, hair, age, form).

## Workflow

1. Run:

```bash
npm run check:book-bible -- --book <bookKey>
```

For machine-readable gaps:

```bash
npm run check:book-bible -- --book <bookKey> --json
```

2. If exit code is non-zero / `ready: false`:
   - Collect **blocking** gaps (and optionally `needsConfirmation` assumptions).
   - Ask the user **one batch** of clarifying questions (use each gap's `suggestedQuestion`).
   - Do **not** invent missing outfit colors or accessories silently.
   - Write answers into `scripts/image-gen/bibles/<bookKey>.json`.
   - Re-run the check until `ready: true`.

3. When ready, tell the user they can run image consistency:

```bash
npm run check:book-images -- --book <bookKey> --pages <indices>
# or
npm run generate:book-images:consistent -- --book <bookKey>
```

## Bible shape (summary)

- `characters[]` with `age`, `defaultVariantId`, and `variants[]`
- Each variant: `hair`, `eyes`, `outfit` (top+bottom or onePiece, shoes, optional hairAccessory)
- `pages[]` with `pageIndex`, `sceneGoal`, and `characters[{ characterId, variantId }]`
- Story-driven look changes use **different variant ids** (e.g. `human-beach` vs `mermaid-transformed`)

## Notes

- Page contracts should cover every page in `public/books/<bookKey>.yaml`.
- Optional `referenceImage` paths are checked under `public/`.
