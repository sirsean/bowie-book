import { existsSync, readFileSync } from 'fs';
import { join, resolve } from 'path';
import type {
  CharacterBible,
  CharacterSpec,
  CharacterVariant,
  CompletenessAssumption,
  CompletenessGap,
  CompletenessReport,
  OutfitSpec,
  PageContract,
} from './bible-types.js';

export function biblePath(bookKey: string, cwd = process.cwd()): string {
  return join(cwd, 'scripts', 'image-gen', 'bibles', `${bookKey}.json`);
}

export function loadBible(bookKey: string, cwd = process.cwd()): CharacterBible {
  const path = biblePath(bookKey, cwd);
  if (!existsSync(path)) {
    throw new Error(
      `No character bible at ${path}. Create scripts/image-gen/bibles/${bookKey}.json first.`
    );
  }
  const raw = JSON.parse(readFileSync(path, 'utf8')) as CharacterBible;
  if (raw.bookKey !== bookKey) {
    throw new Error(
      `Bible bookKey "${raw.bookKey}" does not match filename key "${bookKey}".`
    );
  }
  return raw;
}

export function tryLoadBible(
  bookKey: string,
  cwd = process.cwd()
): CharacterBible | null {
  const path = biblePath(bookKey, cwd);
  if (!existsSync(path)) return null;
  return loadBible(bookKey, cwd);
}

function outfitHasColorfulSpec(outfit: OutfitSpec): boolean {
  const parts = [
    outfit.top,
    outfit.bottom,
    outfit.onePiece,
    outfit.shoes,
    outfit.hairAccessory,
    ...(outfit.extras ?? []),
  ].filter(Boolean) as string[];
  return parts.length > 0;
}

function outfitIsSpecified(outfit: OutfitSpec): { ok: boolean; missing: string[] } {
  const missing: string[] = [];
  const hasOnePiece = Boolean(outfit.onePiece?.trim());
  const hasTop = Boolean(outfit.top?.trim());
  const hasBottom = Boolean(outfit.bottom?.trim());

  if (!hasOnePiece && !hasTop && !hasBottom) {
    missing.push('outfit.top or outfit.onePiece (and bottom when not one-piece)');
  } else if (!hasOnePiece && hasTop && !hasBottom) {
    missing.push('outfit.bottom (or use outfit.onePiece)');
  } else if (!hasOnePiece && !hasTop && hasBottom) {
    missing.push('outfit.top (or use outfit.onePiece)');
  }

  if (!outfit.shoes?.trim()) {
    missing.push('outfit.shoes');
  }

  return { ok: missing.length === 0, missing };
}

function findVariant(
  character: CharacterSpec,
  variantId: string
): CharacterVariant | undefined {
  return character.variants.find((v) => v.id === variantId);
}

function checkVariant(
  character: CharacterSpec,
  variant: CharacterVariant,
  gaps: CompletenessGap[]
): void {
  const base = `characters.${character.id}.variants.${variant.id}`;

  if (!variant.label?.trim()) {
    gaps.push({
      path: `${base}.label`,
      reason: 'Variant needs a short human-readable label.',
      suggestedQuestion: `What should we call the "${variant.id}" look for ${character.displayName}?`,
      blocking: true,
    });
  }

  if (!variant.hair?.trim()) {
    gaps.push({
      path: `${base}.hair`,
      reason: 'Hair (color, length, style) is unspecified.',
      suggestedQuestion: `Describe ${character.displayName}'s hair for variant "${variant.id}" (color, length, style).`,
      blocking: true,
    });
  }

  if (!variant.eyes?.trim()) {
    gaps.push({
      path: `${base}.eyes`,
      reason: 'Eye color/appearance is unspecified.',
      suggestedQuestion: `What color/appearance are ${character.displayName}'s eyes in variant "${variant.id}"?`,
      blocking: true,
    });
  }

  const outfitCheck = outfitIsSpecified(variant.outfit ?? {});
  if (!outfitCheck.ok) {
    for (const m of outfitCheck.missing) {
      gaps.push({
        path: `${base}.${m}`,
        reason: `Missing ${m}.`,
        suggestedQuestion: `Specify ${m} for ${character.displayName} variant "${variant.id}" (include colors).`,
        blocking: true,
      });
    }
  } else if (!outfitHasColorfulSpec(variant.outfit)) {
    gaps.push({
      path: `${base}.outfit`,
      reason: 'Outfit fields are empty.',
      suggestedQuestion: `Describe the full outfit (with colors) for ${character.displayName} variant "${variant.id}".`,
      blocking: true,
    });
  }

  if (variant.referenceImage) {
    const publicPath = resolve(
      process.cwd(),
      'public',
      variant.referenceImage.replace(/^\//, '')
    );
    if (!existsSync(publicPath)) {
      gaps.push({
        path: `${base}.referenceImage`,
        reason: `Reference image not found at public${variant.referenceImage}.`,
        suggestedQuestion: `Add the reference file or clear referenceImage for ${character.displayName} / ${variant.id}.`,
        blocking: false,
      });
    }
  }
}

function checkCharacter(
  character: CharacterSpec,
  gaps: CompletenessGap[]
): void {
  const base = `characters.${character.id}`;

  if (!character.displayName?.trim()) {
    gaps.push({
      path: `${base}.displayName`,
      reason: 'Missing display name.',
      suggestedQuestion: `What is the display name for character id "${character.id}"?`,
      blocking: true,
    });
  }

  if (!character.age?.trim()) {
    gaps.push({
      path: `${base}.age`,
      reason: 'Age band is unspecified.',
      suggestedQuestion: `How old should ${character.displayName || character.id} look (e.g. "7-year-old school-age girl")?`,
      blocking: true,
    });
  }

  if (!character.variants?.length) {
    gaps.push({
      path: `${base}.variants`,
      reason: 'No appearance variants defined.',
      suggestedQuestion: `List the distinct looks for ${character.displayName || character.id} (e.g. human-beach, mermaid-transformed).`,
      blocking: true,
    });
    return;
  }

  if (!character.defaultVariantId?.trim()) {
    gaps.push({
      path: `${base}.defaultVariantId`,
      reason: 'defaultVariantId is missing.',
      suggestedQuestion: `Which variant id is the default look for ${character.displayName || character.id}?`,
      blocking: true,
    });
  } else if (!findVariant(character, character.defaultVariantId)) {
    gaps.push({
      path: `${base}.defaultVariantId`,
      reason: `defaultVariantId "${character.defaultVariantId}" is not in variants.`,
      suggestedQuestion: `Pick a defaultVariantId that exists for ${character.displayName || character.id}.`,
      blocking: true,
    });
  }

  const seen = new Set<string>();
  for (const variant of character.variants) {
    if (seen.has(variant.id)) {
      gaps.push({
        path: `${base}.variants.${variant.id}`,
        reason: 'Duplicate variant id.',
        suggestedQuestion: `Rename the duplicate variant id "${variant.id}" for ${character.displayName}.`,
        blocking: true,
      });
    }
    seen.add(variant.id);
    checkVariant(character, variant, gaps);
  }
}

function checkPageContracts(
  bible: CharacterBible,
  gaps: CompletenessGap[],
  storyPageCount: number | null
): void {
  const byId = new Map(bible.characters.map((c) => [c.id, c]));
  const pageIndexes = new Set<number>();

  for (const page of bible.pages ?? []) {
    const base = `pages[${page.pageIndex}]`;

    if (pageIndexes.has(page.pageIndex)) {
      gaps.push({
        path: base,
        reason: 'Duplicate pageIndex in bible.pages.',
        suggestedQuestion: `Remove or renumber duplicate page contract for index ${page.pageIndex}.`,
        blocking: true,
      });
    }
    pageIndexes.add(page.pageIndex);

    if (!page.sceneGoal?.trim()) {
      gaps.push({
        path: `${base}.sceneGoal`,
        reason: 'sceneGoal is empty.',
        suggestedQuestion: `In one sentence, what should happen visually on page ${page.pageIndex}?`,
        blocking: true,
      });
    }

    if (!page.characters?.length) {
      // Cover/establishing shots may have no cast — non-blocking note via assumptions handled elsewhere
      continue;
    }

    for (const cast of page.characters) {
      const character = byId.get(cast.characterId);
      if (!character) {
        gaps.push({
          path: `${base}.characters.${cast.characterId}`,
          reason: `Unknown characterId "${cast.characterId}".`,
          suggestedQuestion: `Add character "${cast.characterId}" to the bible or fix page ${page.pageIndex}'s characterId.`,
          blocking: true,
        });
        continue;
      }
      if (!findVariant(character, cast.variantId)) {
        gaps.push({
          path: `${base}.characters.${cast.characterId}.variantId`,
          reason: `Unknown variantId "${cast.variantId}" for ${cast.characterId}.`,
          suggestedQuestion: `Which variant should ${character.displayName} use on page ${page.pageIndex}?`,
          blocking: true,
        });
      }
    }
  }

  if (storyPageCount != null && storyPageCount > 0) {
    for (let i = 0; i < storyPageCount; i++) {
      if (!pageIndexes.has(i)) {
        gaps.push({
          path: `pages[${i}]`,
          reason: `Story YAML has page ${i} but bible has no page contract.`,
          suggestedQuestion: `Add a page contract for page ${i} (sceneGoal + which characters/variants appear, or empty characters if none).`,
          blocking: true,
        });
      }
    }
  }
}

function collectAssumptions(bible: CharacterBible): CompletenessAssumption[] {
  const assumptions: CompletenessAssumption[] = [];
  for (const character of bible.characters) {
    for (const variant of character.variants) {
      if (!variant.hairAccessory && !variant.outfit.hairAccessory) {
        assumptions.push({
          path: `characters.${character.id}.variants.${variant.id}.outfit.hairAccessory`,
          value: 'none (no hair accessory specified)',
          needsConfirmation: false,
        });
      }
      if (!variant.skin?.trim()) {
        assumptions.push({
          path: `characters.${character.id}.variants.${variant.id}.skin`,
          value: 'unspecified — illustrator default',
          needsConfirmation: true,
        });
      }
    }
  }
  return assumptions;
}

export interface CompletenessOptions {
  /** Number of pages in public/books/<key>.yaml; when set, every index must have a contract */
  storyPageCount?: number | null;
}

/**
 * Structural completeness: ready only when every blocking gap is resolved.
 * Does not invent missing outfit colors — callers (skill) must ask the human.
 */
export function checkBibleCompleteness(
  bible: CharacterBible,
  options: CompletenessOptions = {}
): CompletenessReport {
  const gaps: CompletenessGap[] = [];

  if (!bible.characters?.length) {
    gaps.push({
      path: 'characters',
      reason: 'Bible has no characters.',
      suggestedQuestion: 'Who are the recurring characters in this book?',
      blocking: true,
    });
  } else {
    const ids = new Set<string>();
    for (const character of bible.characters) {
      if (ids.has(character.id)) {
        gaps.push({
          path: `characters.${character.id}`,
          reason: 'Duplicate character id.',
          suggestedQuestion: `Rename duplicate character id "${character.id}".`,
          blocking: true,
        });
      }
      ids.add(character.id);
      checkCharacter(character, gaps);
    }
  }

  checkPageContracts(bible, gaps, options.storyPageCount ?? null);

  const assumptions = collectAssumptions(bible);
  const blockingAssumptions = assumptions.filter((a) => a.needsConfirmation);
  // Skin confirmation is soft: report as assumption but do not block ready
  // (needsConfirmation: true is informational for the skill to optionally ask).

  const blockingGaps = gaps.filter((g) => g.blocking);
  void blockingAssumptions;

  return {
    bookKey: bible.bookKey,
    ready: blockingGaps.length === 0,
    gaps,
    assumptions,
  };
}

export function getPageContract(
  bible: CharacterBible,
  pageIndex: number
): PageContract | undefined {
  return bible.pages.find((p) => p.pageIndex === pageIndex);
}

export function getCharacter(bible: CharacterBible, characterId: string): CharacterSpec {
  const c = bible.characters.find((x) => x.id === characterId);
  if (!c) throw new Error(`Unknown character "${characterId}" in bible ${bible.bookKey}`);
  return c;
}

export function getVariant(
  character: CharacterSpec,
  variantId: string
): CharacterVariant {
  const v = findVariant(character, variantId);
  if (!v) {
    throw new Error(
      `Unknown variant "${variantId}" for character "${character.id}"`
    );
  }
  return v;
}

/** Pages that share any character+variant pair with the given page (excluding itself). */
export function findSiblingPageIndexes(
  bible: CharacterBible,
  pageIndex: number,
  options: { limit?: number; onlyBefore?: boolean } = {}
): number[] {
  const page = getPageContract(bible, pageIndex);
  if (!page?.characters.length) return [];

  const keys = new Set(
    page.characters.map((c) => `${c.characterId}::${c.variantId}`)
  );

  const siblings: number[] = [];
  const sorted = [...bible.pages].sort((a, b) => a.pageIndex - b.pageIndex);

  for (const other of sorted) {
    if (other.pageIndex === pageIndex) continue;
    if (options.onlyBefore && other.pageIndex >= pageIndex) continue;
    const overlap = other.characters.some((c) =>
      keys.has(`${c.characterId}::${c.variantId}`)
    );
    if (overlap) siblings.push(other.pageIndex);
  }

  const before = siblings.filter((i) => i < pageIndex);
  const preferred = before.length ? before : siblings;
  const limit = options.limit ?? 2;
  return preferred.slice(-limit);
}

export function formatVariantForPrompt(variant: CharacterVariant): string {
  const o = variant.outfit;
  const clothing = o.onePiece
    ? o.onePiece
    : [o.top, o.bottom].filter(Boolean).join(', ');
  const parts = [
    variant.form,
    variant.hair ? `hair: ${variant.hair}` : null,
    variant.eyes ? `eyes: ${variant.eyes}` : null,
    variant.skin ? `skin: ${variant.skin}` : null,
    clothing ? `outfit: ${clothing}` : null,
    o.shoes ? `shoes: ${o.shoes}` : null,
    o.hairAccessory ? `hair accessory: ${o.hairAccessory}` : null,
    o.extras?.length ? `extras: ${o.extras.join(', ')}` : null,
  ].filter(Boolean);
  return `${variant.label} (${variant.id}): ${parts.join('; ')}`;
}
