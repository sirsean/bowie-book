import { resolve } from 'path';
import dotenv from 'dotenv';
import { loadBible } from './bible.js';
import { checkPageConsistency } from './consistency.js';
import { listBookKeys } from './books/index.js';

dotenv.config({ path: resolve(process.cwd(), '.env') });

function parseArgs(argv: string[]): {
  book: string | null;
  pages: number[] | null;
  json: boolean;
} {
  let book: string | null = null;
  let pages: number[] | null = null;
  let json = false;
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--book' && argv[i + 1]) {
      book = argv[++i];
    } else if (a === '--pages' && argv[i + 1]) {
      pages = argv[++i]
        .split(',')
        .map((s) => Number.parseInt(s.trim(), 10))
        .filter((n) => !Number.isNaN(n));
    } else if (a === '--json') {
      json = true;
    } else if (a === '--help' || a === '-h') {
      printHelp();
      process.exit(0);
    }
  }
  return { book, pages, json };
}

function printHelp(): void {
  console.log(`Usage: npm run check:book-images -- --book <bookKey> [--pages 6,7] [--json]

Vision-check generated images against the character bible and sibling anchors.

Options:
  --book <bookKey>     Required (or OPENAI_BOOK_KEY)
  --pages <indices>    Comma-separated page indexes (default: all bible pages with cast)
  --json               Machine-readable output
  -h, --help

Environment:
  OPENAI_API_KEY       Required
  OPENAI_VISION_MODEL  Default gpt-4.1-mini

Known image-gen books: ${listBookKeys().join(', ') || '(none)'}
`);
}

async function main(): Promise<void> {
  const { book: bookArg, pages: pagesArg, json } = parseArgs(process.argv);
  const bookKey = bookArg ?? process.env.OPENAI_BOOK_KEY ?? null;
  if (!bookKey) {
    printHelp();
    process.stderr.write('Error: pass --book <bookKey> or set OPENAI_BOOK_KEY.\n');
    process.exit(1);
  }

  const bible = loadBible(bookKey);
  const pages =
    pagesArg ??
    bible.pages.filter((p) => p.characters.length > 0).map((p) => p.pageIndex);

  let anyFail = false;
  const results = [];

  for (const pageIndex of pages) {
    console.error(`Checking ${bookKey} page ${pageIndex}…`);
    const { verdict, imagePath, siblings } = await checkPageConsistency({
      bookKey,
      pageIndex,
    });
    if (!verdict.ok) anyFail = true;
    results.push({ pageIndex, imagePath, siblings, verdict });
    if (!json) {
      console.log(
        `[${pageIndex}] ${verdict.ok ? 'PASS' : 'FAIL'}  ${imagePath}  anchors=[${siblings.join(',')}]`
      );
      for (const m of verdict.mismatches) {
        console.log(
          `    ${m.kind}: ${m.character ?? '?'} ${m.trait}: expected "${m.expected}" vs observed "${m.observed}"${
            m.comparedToPage != null ? ` (vs page ${m.comparedToPage})` : ''
          }`
        );
      }
      for (const h of verdict.promptHints) {
        console.log(`    hint: ${h}`);
      }
    }
  }

  if (json) {
    console.log(JSON.stringify({ bookKey, results }, null, 2));
  }

  process.exit(anyFail ? 1 : 0);
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
