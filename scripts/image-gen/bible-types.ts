/** Character bible + page contracts for consistent book illustration. */

export interface OutfitSpec {
  /** e.g. "pink short-sleeve shirt" */
  top?: string;
  /** e.g. "blue shorts" — omit when onePiece is set */
  bottom?: string;
  /** e.g. "rainbow dress" — use instead of top+bottom when applicable */
  onePiece?: string;
  shoes?: string;
  /** Hair ties, bows, clips, etc. */
  hairAccessory?: string;
  /** Extra locked accessories (wand, necklace, …) */
  extras?: string[];
}

export interface CharacterVariant {
  id: string;
  /** Short label for prompts and reports */
  label: string;
  /** Form notes: human, mermaid, greyscale world, etc. */
  form?: string;
  hair?: string;
  eyes?: string;
  skin?: string;
  outfit: OutfitSpec;
  /** Traits that must never appear for this variant */
  forbidden?: string[];
  /** Optional path under public/, e.g. /books/<key>/_refs/bowie-human.webp */
  referenceImage?: string;
}

export interface CharacterSpec {
  id: string;
  displayName: string;
  /** Age band, e.g. "7-year-old school-age girl" */
  age: string;
  /** Default look when a page does not override */
  defaultVariantId: string;
  variants: CharacterVariant[];
  /** Traits that must never appear for this character in any variant */
  forbidden?: string[];
}

export interface PageCharacterContract {
  characterId: string;
  variantId: string;
}

export interface PageContract {
  /** Zero-based page index matching YAML / image filenames */
  pageIndex: number;
  /** Scene goal in one sentence (not a full image prompt) */
  sceneGoal: string;
  characters: PageCharacterContract[];
}

export interface CharacterBible {
  bookKey: string;
  title: string;
  /** Optional notes for authors / agents */
  notes?: string;
  characters: CharacterSpec[];
  pages: PageContract[];
}

export interface CompletenessGap {
  path: string;
  reason: string;
  suggestedQuestion: string;
  blocking: boolean;
}

export interface CompletenessAssumption {
  path: string;
  value: string;
  needsConfirmation: boolean;
}

export interface CompletenessReport {
  bookKey: string;
  ready: boolean;
  gaps: CompletenessGap[];
  assumptions: CompletenessAssumption[];
}

export type MismatchKind = 'bible' | 'scene' | 'cross_page';

export interface ConsistencyMismatch {
  kind: MismatchKind;
  character?: string;
  trait: string;
  expected: string;
  observed: string;
  comparedToPage?: number;
}

export interface ConsistencyVerdict {
  ok: boolean;
  mismatches: ConsistencyMismatch[];
  promptHints: string[];
}
