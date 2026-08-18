import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join, resolve } from 'path';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import yaml from 'js-yaml';
import {
  checkBibleCompleteness,
  formatVariantForPrompt,
  getCharacter,
  getPageContract,
  getVariant,
  loadBible,
  tryLoadBible,
} from './bible.js';
import type { ConsistencyVerdict } from './bible-types.js';
import { getManifest, listBookKeys } from './books/index.js';
import {
  checkPageConsistency,
  pageImagePath,
  rewritePromptWithHints,
  runsDir,
} from './consistency.js';

dotenv.config({ path: resolve(process.cwd(), '.env') });

function parseArgs(argv: string[]): {
  book: string | null;
  dryRun: boolean;
  only: Set<number> | null;
  maxAttempts: number;
  skipGenerate: boolean;
} {
  let book: string | null = null;
  let dryRun = false;
  let only: Set<number> | null = null;
  let maxAttempts = 3;
  let skipGenerate = false;

  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--book' && argv[i + 1]) {
      book = argv[++i];
    } else if (a === '--dry-run') {
      dryRun = true;
    } else if (a === '--only' && argv[i + 1]) {
      only = new Set(
        argv[++i]
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
          .map((s) => Number.parseInt(s, 10))
          .filter((n) => !Number.isNaN(n))
      );
    } else if (a === '--max-attempts' && argv[i + 1]) {
      maxAttempts = Number.parseInt(argv[++i], 10);
    } else if (a === '--check-only') {
      skipGenerate = true;
    } else if (a === '--help' || a === '-h') {
      printHelp();
      process.exit(0);
    }
  }

  return { book, dryRun, only, maxAttempts, skipGenerate };
}

function printHelp(): void {
  console.log(`Usage: npm run generate:book-images:consistent -- --book <bookKey> [options]

Require a ready character bible, then generate (optional) and vision-check each page
with cross-page anchors. On failure, rewrite the page prompt and regenerate until
pass or --max-attempts.

Options:
  --book <bookKey>       Required (or OPENAI_BOOK_KEY)
  --only <indices>       Comma-separated page indexes
  --max-attempts <n>     Default 3
  --check-only           Skip generation; check existing images and rewrite prompts in the run log only
  --dry-run              Print plan without API calls
  -h, --help

Known generate manifests:
  ${listBookKeys().join('\n  ')}
`);
}

function storyPageCount(bookKey: string): number | null {
  const yamlPath = join(process.cwd(), 'public', 'books', `${bookKey}.yaml`);
  const ymlPath = join(process.cwd(), 'public', 'books', `${bookKey}.yml`);
  const path = existsSync(yamlPath) ? yamlPath : existsSync(ymlPath) ? ymlPath : null;
  if (!path) return null;
  const doc = yaml.load(readFileSync(path, 'utf8')) as { pages?: unknown[] };
  return Array.isArray(doc.pages) ? doc.pages.length : null;
}

function bibleBlurbForPage(bookKey: string, pageIndex: number): string {
  const bible = loadBible(bookKey);
  const page = getPageContract(bible, pageIndex);
  if (!page) return '';
  return page.characters
    .map((c) => {
      const character = getCharacter(bible, c.characterId);
      const variant = getVariant(character, c.variantId);
      return `${character.displayName}: ${formatVariantForPrompt(variant)}`;
    })
    .join('\n');
}

async function generateOnePage(options: {
  client: OpenAI;
  bookKey: string;
  pageIndex: number;
  prompt: string;
  dryRun: boolean;
}): Promise<string> {
  const manifest = getManifest(options.bookKey);
  const page = manifest.pages[options.pageIndex];
  if (!page) {
    throw new Error(`No manifest page at index ${options.pageIndex}`);
  }

  const prefix = page.stylePrefix ?? manifest.stylePrefix;
  const fullPrompt = `${prefix}${options.prompt}`.trim();
  const dest = join(
    process.cwd(),
    'public',
    'books',
    manifest.bookKey,
    page.filename
  );
  const defaults = manifest.defaults ?? {};

  console.log(`[${options.pageIndex}] generate → ${dest}`);
  if (options.dryRun) {
    console.log(`    prompt (${fullPrompt.length} chars): ${fullPrompt.slice(0, 180)}…`);
    return dest;
  }

  const result = await options.client.images.generate({
    model: manifest.model,
    prompt: fullPrompt,
    n: 1,
    size: defaults.size ?? '1024x1536',
    quality: defaults.quality ?? 'high',
    output_format: defaults.output_format ?? 'webp',
    output_compression: defaults.output_compression ?? undefined,
    moderation: defaults.moderation ?? 'auto',
  });

  const item = result.data?.[0];
  const b64 = item?.b64_json;
  if (!b64) {
    throw new Error('No b64_json in image response');
  }

  const buf = Buffer.from(b64, 'base64');
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, buf);
  console.log(`    wrote ${buf.length} bytes`);
  return dest;
}

function writeRunLog(
  bookKey: string,
  pageIndex: number,
  payload: unknown
): void {
  const dir = runsDir(bookKey);
  mkdirSync(dir, { recursive: true });
  const path = join(dir, `${pageIndex}.json`);
  writeFileSync(path, JSON.stringify(payload, null, 2));
  console.log(`    run log → ${path}`);
}

async function main(): Promise<void> {
  const { book: bookArg, dryRun, only, maxAttempts, skipGenerate } = parseArgs(
    process.argv
  );
  const bookKey = bookArg ?? process.env.OPENAI_BOOK_KEY ?? null;
  if (!bookKey) {
    printHelp();
    process.stderr.write('Error: pass --book <bookKey> or set OPENAI_BOOK_KEY.\n');
    process.exit(1);
  }

  const bibleFile = tryLoadBible(bookKey);
  if (!bibleFile) {
    console.error(
      `No character bible at scripts/image-gen/bibles/${bookKey}.json. Create it (see book-bible-completeness skill), then re-run.`
    );
    process.exit(1);
  }
  const bible = bibleFile;
  const completeness = checkBibleCompleteness(bible, {
    storyPageCount: storyPageCount(bookKey),
  });
  if (!completeness.ready) {
    console.error('Character bible is not ready. Run: npm run check:book-bible -- --book', bookKey);
    for (const g of completeness.gaps.filter((x) => x.blocking)) {
      console.error(`  - [${g.path}] ${g.reason}`);
      console.error(`    Ask: ${g.suggestedQuestion}`);
    }
    process.exit(1);
  }

  let manifestPages: import('./types.js').BookImagePageSpec[] | null = null;
  try {
    manifestPages = getManifest(bookKey).pages;
  } catch {
    if (!skipGenerate) {
      console.error(
        `No image-gen manifest for "${bookKey}". Add scripts/image-gen/books/${bookKey}.ts or pass --check-only.`
      );
      process.exit(1);
    }
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!dryRun && !apiKey) {
    process.stderr.write('Error: OPENAI_API_KEY is missing.\n');
    process.exit(1);
  }

  const client = apiKey ? new OpenAI({ apiKey }) : null;
  const pageIndexes = bible.pages
    .map((p) => p.pageIndex)
    .filter((i) => !only || only.has(i))
    .sort((a, b) => a - b);

  let failures = 0;

  for (const pageIndex of pageIndexes) {
    const attempts: Array<{
      attempt: number;
      prompt: string;
      verdict: ConsistencyVerdict | null;
    }> = [];

    let prompt =
      manifestPages?.[pageIndex]?.prompt ??
      getPageContract(bible, pageIndex)?.sceneGoal ??
      '';

    let accepted = false;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      if (!skipGenerate && manifestPages) {
        if (!client && !dryRun) throw new Error('OpenAI client missing');
        await generateOnePage({
          client: client!,
          bookKey,
          pageIndex,
          prompt,
          dryRun,
        });
      } else if (!pageImagePath(bookKey, pageIndex) && !dryRun) {
        console.error(`[${pageIndex}] no image on disk and --check-only set`);
        failures++;
        break;
      }

      if (dryRun) {
        console.log(`[${pageIndex}] dry-run skip vision check`);
        accepted = true;
        break;
      }

      if (!client) throw new Error('OpenAI client missing');

      console.log(`[${pageIndex}] consistency check (attempt ${attempt})…`);
      const { verdict, imagePath, siblings } = await checkPageConsistency({
        bookKey,
        pageIndex,
        client,
        // Mermaid Queen only: page 4 vs cover; page 10 vs 9+4; page 12 vs 10+9.
        siblingIndexes:
          bookKey === 'the-evil-mermaid-queen'
            ? pageIndex === 4
              ? [0]
              : pageIndex === 10
                ? [9, 4]
                : pageIndex === 12
                  ? [10, 9]
                  : undefined
            : undefined,
      });

      attempts.push({ attempt, prompt, verdict });

      console.log(
        `    ${verdict.ok ? 'PASS' : 'FAIL'}  ${imagePath}  anchors=[${siblings.join(',')}]`
      );
      for (const m of verdict.mismatches) {
        console.log(
          `    ${m.kind}: ${m.character ?? '?'} ${m.trait}: expected "${m.expected}" vs observed "${m.observed}"${
            m.comparedToPage != null ? ` (vs page ${m.comparedToPage})` : ''
          }`
        );
      }

      if (verdict.ok) {
        // FUTURE: optional human approval before first variant frame becomes a cross-page anchor
        accepted = true;
        break;
      }

      if (attempt >= maxAttempts) {
        break;
      }

      if (skipGenerate) {
        console.log(
          `    --check-only: rewriting prompt in run log only (no regenerate)`
        );
      }

      prompt = await rewritePromptWithHints({
        client,
        stylePrefix: manifestPages
          ? (manifestPages[pageIndex]?.stylePrefix ??
            getManifest(bookKey).stylePrefix)
          : '',
        currentPrompt: prompt,
        basePrompt: manifestPages?.[pageIndex]?.prompt,
        verdict,
        bibleBlurb: bibleBlurbForPage(bookKey, pageIndex),
      });
      console.log(`    rewritten prompt (${prompt.length} chars)`);
    }

    writeRunLog(bookKey, pageIndex, {
      bookKey,
      pageIndex,
      accepted,
      finalPrompt: prompt,
      attempts,
    });

    if (!accepted) {
      failures++;
      console.error(
        `[${pageIndex}] exhausted attempts — left last image + run log; not accepted.`
      );
    }
  }

  if (failures > 0) {
    console.error(`Done with ${failures} page failure(s).`);
    process.exit(1);
  }
  console.log('Done. All selected pages accepted.');
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
