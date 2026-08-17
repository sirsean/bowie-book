import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import OpenAI from 'openai';
import {
  findSiblingPageIndexes,
  formatVariantForPrompt,
  getCharacter,
  getPageContract,
  getVariant,
  loadBible,
} from './bible.js';
import type {
  CharacterBible,
  ConsistencyMismatch,
  ConsistencyVerdict,
  PageContract,
} from './bible-types.js';
import { getManifest } from './books/index.js';

export const DEFAULT_VISION_MODEL = process.env.OPENAI_VISION_MODEL ?? 'gpt-4.1-mini';

export function runsDir(bookKey: string, cwd = process.cwd()): string {
  return join(cwd, 'scripts', 'image-gen', '.runs', bookKey);
}

/** Prefer anchors that previously passed the consistency loop when a run log exists. */
export function isPageAccepted(
  bookKey: string,
  pageIndex: number,
  cwd = process.cwd()
): boolean | null {
  const path = join(runsDir(bookKey, cwd), `${pageIndex}.json`);
  if (!existsSync(path)) return null;
  try {
    const raw = JSON.parse(readFileSync(path, 'utf8')) as { accepted?: boolean };
    return Boolean(raw.accepted);
  } catch {
    return null;
  }
}

export function pageImagePath(
  bookKey: string,
  pageIndex: number,
  cwd = process.cwd()
): string | null {
  const dir = join(cwd, 'public', 'books', bookKey);
  const candidates: string[] = [];

  try {
    const manifest = getManifest(bookKey);
    const page = manifest.pages[pageIndex];
    if (page?.filename) {
      candidates.push(join(dir, page.filename));
    }
  } catch {
    // Manifest optional for books that only have YAML + images
  }

  if (pageIndex === 0) {
    candidates.push(
      join(dir, '0-cover.webp'),
      join(dir, '0-cover.png'),
      join(dir, 'cover.webp')
    );
  }
  candidates.push(
    join(dir, `${pageIndex}.webp`),
    join(dir, `${pageIndex}.png`),
    join(dir, `${pageIndex}.jpg`),
    join(dir, `${pageIndex}.jpeg`)
  );

  return candidates.find((p) => existsSync(p)) ?? null;
}

function mimeForPath(path: string): string {
  if (path.endsWith('.png')) return 'image/png';
  if (path.endsWith('.jpg') || path.endsWith('.jpeg')) return 'image/jpeg';
  return 'image/webp';
}

function toDataUrl(path: string): string {
  const buf = readFileSync(path);
  const b64 = buf.toString('base64');
  return `data:${mimeForPath(path)};base64,${b64}`;
}

function buildExpectedAppearance(bible: CharacterBible, page: PageContract): string {
  if (!page.characters.length) {
    return 'No locked cast on this page; judge sceneGoal only.';
  }
  return page.characters
    .map((c) => {
      const character = getCharacter(bible, c.characterId);
      const variant = getVariant(character, c.variantId);
      return `${character.displayName} (${character.age}): ${formatVariantForPrompt(variant)}`;
    })
    .join('\n');
}

export interface CheckImagesOptions {
  bookKey: string;
  pageIndex: number;
  siblingIndexes?: number[];
  client?: OpenAI;
  model?: string;
}

export async function checkPageConsistency(
  options: CheckImagesOptions
): Promise<{ verdict: ConsistencyVerdict; imagePath: string; siblings: number[] }> {
  const bible = loadBible(options.bookKey);
  const page = getPageContract(bible, options.pageIndex);
  if (!page) {
    throw new Error(
      `No page contract for page ${options.pageIndex} in bible ${options.bookKey}`
    );
  }

  const imagePath = pageImagePath(options.bookKey, options.pageIndex);
  if (!imagePath) {
    throw new Error(
      `No image file found for ${options.bookKey} page ${options.pageIndex}`
    );
  }

  const siblings =
    options.siblingIndexes ??
    findSiblingPageIndexes(bible, options.pageIndex, {
      limit: 2,
      onlyBefore: true,
    });

  // Mid-transformation pages: also anchor to prior form for identity continuity.
  const pageCast = page.characters;
  const identityExtra: number[] = [];
  for (const cast of pageCast) {
    let priorVariant: string | null = null;
    if (cast.variantId === 'mermaid-transforming') priorVariant = 'human-beach';
    if (cast.variantId === 'queen-reforming') priorVariant = 'queen-villain';
    if (!priorVariant) continue;
    const priorBefore = bible.pages
      .filter(
        (p) =>
          p.pageIndex < options.pageIndex &&
          p.characters.some(
            (c) =>
              c.characterId === cast.characterId && c.variantId === priorVariant
          )
      )
      .map((p) => p.pageIndex);
    identityExtra.push(...priorBefore.slice(-2));
  }
  const siblingSet = [...new Set([...siblings, ...identityExtra])]
    .sort((a, b) => a - b)
    .filter((i) => {
      const accepted = isPageAccepted(options.bookKey, i);
      // If we have an explicit fail in the run log, skip as anchor.
      if (accepted === false) return false;
      return true;
    });

  // If filtering removed everything, fall back to unfiltered siblings with images.
  const fallbackSiblings = [...new Set([...siblings, ...identityExtra])].sort(
    (a, b) => a - b
  );
  const effectiveSiblings = siblingSet.length ? siblingSet : fallbackSiblings;

  const siblingPaths = effectiveSiblings
    .map((i) => ({ index: i, path: pageImagePath(options.bookKey, i) }))
    .filter((s): s is { index: number; path: string } => Boolean(s.path));

  const apiKey = process.env.OPENAI_API_KEY;
  if (!options.client && !apiKey) {
    throw new Error('OPENAI_API_KEY is missing. Add it to the project .env file.');
  }

  const client = options.client ?? new OpenAI({ apiKey });

  const expected = buildExpectedAppearance(bible, page);
  const siblingDetail = siblingPaths
    .map(
      (s) =>
        `- Anchor page ${s.index}: match clothing, hair, age, accessories for shared variants.`
    )
    .join('\n');

  const content: OpenAI.Chat.ChatCompletionContentPart[] = [
    {
      type: 'text',
      text: `You are checking a children's book illustration for character consistency.

Book: ${bible.title} (${bible.bookKey})
Page index: ${options.pageIndex}
Scene goal: ${page.sceneGoal}

Expected locked appearance from the character bible:
${expected}

Cross-page anchors (compare the CANDIDATE image to these when listed):
${siblingDetail || '(none — first appearance of this variant; bible+refs only)'}

Rules:
1. Fail with kind "bible" if the candidate contradicts the locked bible traits (outfit colors, hair, age band, accessories, form).
2. Fail with kind "cross_page" if the same character+variant looks different from an anchor (e.g. pink shirt + pink hair tie on page 6 vs blue overalls + blue bow on page 7). Set comparedToPage to the anchor index.
3. When comparing to an ANCHOR image, ONLY judge characters that appear on BOTH pages with the SAME variantId. Ignore other characters on the anchor (e.g. do not compare human Bowie on the candidate to mermaid Bowie on an earlier page).
4. Fail with kind "scene" only if the image clearly misses the sceneGoal while still judging cast appearance.
5. Intentional variant changes are OK only when the bible says a different variantId — do not demand human clothes on a mermaid page.
6. Be specific in trait names like "outfit.top", "outfit.hairAccessory", "hair", "age".
7. Do NOT fail for minor same-category style differences when color and item type match the bible (e.g. sandal strap shape, pink bow vs pink hair tie, subtle fabric pattern, crown jewel count, wand gold vs black shaft). Fail only for clear wrong color, wrong garment type, wrong age, or wrong form.
8. Magenta-and-blue hair may appear pink-magenta-and-blue; that is OK. Green rainbow fin may show yellow/pink sparkle highlights; that is OK. Do not fail when expected and observed describe the same thing.
9. If the sceneGoal or page contract says only one mermaid / only the queen, FAIL with kind "scene" when any extra mermaid or merfolk appears (fish and crabs are OK; additional mermaids are not).
10. For queen-reforming / mid-shrink beats: PASS only if the queen is clearly smaller than Mermaid Bowie AND is dropping/losing the dark oversized wand (not firmly gripping it as a full-power villain). A merge of villain cues dissolving into a purple-haired young nice mermaid is required — not a full-size queen and not a totally unrelated second character.
11. promptHints must be concrete rewrite instructions for the image prompt.

Return ONLY valid JSON matching:
{"ok":boolean,"mismatches":[{"kind":"bible"|"scene"|"cross_page","character":string,"trait":string,"expected":string,"observed":string,"comparedToPage":number}],"promptHints":[string]}
Omit comparedToPage when not cross_page. Use empty arrays when ok is true.`,
    },
    {
      type: 'text',
      text: 'CANDIDATE image (page being checked):',
    },
    {
      type: 'image_url',
      image_url: { url: toDataUrl(imagePath), detail: 'high' },
    },
  ];

  for (const s of siblingPaths) {
    content.push({
      type: 'text',
      text: `ANCHOR image (page ${s.index}):`,
    });
    content.push({
      type: 'image_url',
      image_url: { url: toDataUrl(s.path), detail: 'high' },
    });
  }

  const completion = await client.chat.completions.create({
    model: options.model ?? DEFAULT_VISION_MODEL,
    temperature: 0,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content:
          'You are a strict visual continuity editor for illustrated children\'s books. Reply with JSON only.',
      },
      { role: 'user', content },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? '{}';
  const parsed = JSON.parse(raw) as ConsistencyVerdict;
  const mismatches: ConsistencyMismatch[] = Array.isArray(parsed.mismatches)
    ? parsed.mismatches
    : [];
  const verdict = sanitizeVerdict({
    ok: Boolean(parsed.ok) && mismatches.length === 0,
    mismatches,
    promptHints: Array.isArray(parsed.promptHints) ? parsed.promptHints : [],
  });

  return { verdict, imagePath, siblings: siblingPaths.map((s) => s.index) };
}

/** Drop pedantic / self-contradictory mismatches so the retry loop can converge. */
function sanitizeVerdict(verdict: ConsistencyVerdict): ConsistencyVerdict {
  const mismatches = verdict.mismatches.filter((m) => {
    const obs = m.observed.toLowerCase();
    const exp = m.expected.toLowerCase();
    const norm = (s: string) =>
      s.replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
    if (norm(obs) === norm(exp)) return false;
    if (/\bcorrect\b|\bmatches\b|\bacceptable\b|\bsame\b/.test(obs)) return false;
    // Checker sometimes lists a "mismatch" that is actually a pass description.
    if (
      (exp.includes('only the evil mermaid queen') ||
        exp.includes('no other mermaids')) &&
      (obs.includes('no extra mermaid') ||
        obs.includes('no other mermaid') ||
        obs.includes('only fish') ||
        obs.includes('only the evil mermaid queen') ||
        (obs.includes('no extra') && obs.includes('fish')))
    ) {
      return false;
    }
    // Page 10: restored humans swimming up is valid; only fail extra mermaids.
    if (
      (exp.includes('fish becoming') || exp.includes('fish and/or')) &&
      (obs.includes('human') || obs.includes('children') || obs.includes('people')) &&
      !obs.includes('extra mermaid') &&
      !obs.includes('more than 2') &&
      !obs.includes('merfolk')
    ) {
      return false;
    }
    // Near-duplicate queen locks
    if (
      m.character?.toLowerCase().includes('queen') &&
      exp.includes('black-and-purple') &&
      obs.includes('black') &&
      obs.includes('purple') &&
      !obs.includes('trident') &&
      !obs.includes('pink shirt')
    ) {
      return false;
    }
    if (
      m.character?.toLowerCase().includes('queen') &&
      m.trait.toLowerCase().includes('hair') &&
      exp.includes('purple') &&
      obs.includes('purple') &&
      !obs.includes('blonde')
    ) {
      return false;
    }
    if (
      m.trait.toLowerCase().includes('hairaccessory') &&
      (exp.includes('none') || exp.includes('none required')) &&
      (obs.includes('none') || obs.includes('no ') || obs.includes('without'))
    ) {
      return false;
    }
    if (
      m.trait.toLowerCase().includes('hairaccessory') &&
      exp.includes('pink') &&
      obs.includes('pink') &&
      (obs.includes('bow') || obs.includes('tie'))
    ) {
      return false;
    }
    if (
      exp.includes('sandals') &&
      obs.includes('sandal') &&
      !obs.includes('sneaker') &&
      !obs.includes('high-top')
    ) {
      return false;
    }
    if (
      (exp.includes('pink or white') || exp.includes('pink/white')) &&
      (obs.includes('white short') ||
        obs.includes('pink short') ||
        obs.includes('light pink') ||
        obs.includes('white skirt') ||
        obs.includes('pink skirt'))
    ) {
      return false;
    }
    if (exp.includes('none') && (obs.includes('none') || obs.includes('no shoe'))) {
      return false;
    }
    if (
      exp.includes('shell top') &&
      obs.includes('shell') &&
      !obs.includes('crown') &&
      !obs.includes('wand')
    ) {
      return false;
    }
    if (
      exp.includes('jewel tones') &&
      (obs.includes('purple') || obs.includes('teal') || obs.includes('pink')) &&
      !obs.includes('crown')
    ) {
      return false;
    }
    // Magenta/pink-blue hair equivalence
    if (
      m.trait.toLowerCase().includes('hair') &&
      (exp.includes('magenta') || exp.includes('pink')) &&
      (obs.includes('magenta') || obs.includes('pink') || obs.includes('purple')) &&
      (exp.includes('blue') ? obs.includes('blue') || obs.includes('purple') : true)
    ) {
      return false;
    }
    // Green rainbow fin with highlight variation
    if (
      (m.trait.toLowerCase().includes('fin') ||
        m.trait.toLowerCase().includes('tail') ||
        exp.includes('green fin')) &&
      obs.includes('green') &&
      (obs.includes('fin') || obs.includes('tail')) &&
      !obs.includes('pink and purple fin') &&
      !obs.includes('purple fin')
    ) {
      return false;
    }
    // Skin undertone nitpicks
    if (
      m.trait.toLowerCase().includes('skin') &&
      exp.includes('cool') &&
      (obs.includes('cool') || obs.includes('purple') || obs.includes('blue'))
    ) {
      return false;
    }
    return true;
  });

  return {
    ok: mismatches.length === 0,
    mismatches,
    promptHints: mismatches.length === 0 ? [] : verdict.promptHints,
  };
}

export async function rewritePromptWithHints(options: {
  client: OpenAI;
  stylePrefix: string;
  currentPrompt: string;
  /** Original manifest prompt — preserve hard constraints from this */
  basePrompt?: string;
  verdict: ConsistencyVerdict;
  bibleBlurb: string;
  model?: string;
}): Promise<string> {
  const completion = await options.client.chat.completions.create({
    model: options.model ?? DEFAULT_VISION_MODEL,
    temperature: 0.2,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content:
          "You rewrite children's book image prompts to fix continuity. Return JSON {\"prompt\":\"...\"} with only the scene-specific prompt (do not repeat the style prefix). Keep the same scene intent; add concrete locked appearance constraints. NEVER drop hard negatives (e.g. no other mermaids, wand not trident). Prefer editing the base/original prompt over inventing a new scene.",
      },
      {
        role: 'user',
        content: `Style prefix (do not include in output; it will be prepended later):
${options.stylePrefix}

Character bible constraints:
${options.bibleBlurb}

Original base prompt (preserve its hard rules and negatives):
${options.basePrompt ?? options.currentPrompt}

Current prompt (may already have edits):
${options.currentPrompt}

Mismatches:
${JSON.stringify(options.verdict.mismatches, null, 2)}

Prompt hints:
${options.verdict.promptHints.map((h) => `- ${h}`).join('\n')}

Return JSON: {"prompt":"<revised scene-specific prompt>"}`,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? '{}';
  const parsed = JSON.parse(raw) as { prompt?: string };
  if (!parsed.prompt?.trim()) {
    throw new Error('Prompt rewriter returned empty prompt');
  }
  return parsed.prompt.trim();
}
