import { existsSync, readFileSync } from 'fs';
import { join, resolve } from 'path';
import yaml from 'js-yaml';
import dotenv from 'dotenv';
import {
  checkBibleCompleteness,
  loadBible,
  biblePath,
  tryLoadBible,
} from './bible.js';
import type { CompletenessReport } from './bible-types.js';

dotenv.config({ path: resolve(process.cwd(), '.env') });

function parseArgs(argv: string[]): { book: string | null; json: boolean } {
  let book: string | null = null;
  let json = false;
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--book' && argv[i + 1]) {
      book = argv[++i];
    } else if (a === '--json') {
      json = true;
    } else if (a === '--help' || a === '-h') {
      printHelp();
      process.exit(0);
    }
  }
  return { book, json };
}

function printHelp(): void {
  console.log(`Usage: npm run check:book-bible -- --book <bookKey> [--json]

Validate that scripts/image-gen/bibles/<bookKey>.json is specified enough
to run image generation + consistency checks.

Options:
  --book <bookKey>   Required (or set OPENAI_BOOK_KEY)
  --json             Print the CompletenessReport as JSON only
  -h, --help         Show this message

Exit codes:
  0  bible is ready (no blocking gaps)
  1  bible missing or not ready
`);
}

function loadStoryPageCount(bookKey: string): number | null {
  const yamlPath = join(process.cwd(), 'public', 'books', `${bookKey}.yaml`);
  const ymlPath = join(process.cwd(), 'public', 'books', `${bookKey}.yml`);
  const path = existsSync(yamlPath) ? yamlPath : existsSync(ymlPath) ? ymlPath : null;
  if (!path) return null;
  const doc = yaml.load(readFileSync(path, 'utf8')) as { pages?: unknown[] };
  return Array.isArray(doc.pages) ? doc.pages.length : null;
}

function printHuman(report: CompletenessReport, path: string): void {
  console.log(`Bible: ${path}`);
  console.log(`Ready: ${report.ready ? 'yes' : 'no'}`);
  console.log('');

  const blocking = report.gaps.filter((g) => g.blocking);
  const soft = report.gaps.filter((g) => !g.blocking);

  if (blocking.length) {
    console.log(`Blocking gaps (${blocking.length}):`);
    for (const g of blocking) {
      console.log(`  - [${g.path}] ${g.reason}`);
      console.log(`    Ask: ${g.suggestedQuestion}`);
    }
    console.log('');
  }

  if (soft.length) {
    console.log(`Non-blocking gaps (${soft.length}):`);
    for (const g of soft) {
      console.log(`  - [${g.path}] ${g.reason}`);
      console.log(`    Ask: ${g.suggestedQuestion}`);
    }
    console.log('');
  }

  const confirm = report.assumptions.filter((a) => a.needsConfirmation);
  if (confirm.length) {
    console.log(`Assumptions to confirm (${confirm.length}):`);
    for (const a of confirm) {
      console.log(`  - [${a.path}] ${a.value}`);
    }
    console.log('');
  }

  if (report.ready) {
    console.log('Bible is ready for the first generation pass.');
  } else {
    console.log(
      'Bible is not ready. Ask the user the questions above, update the JSON, and re-run.'
    );
  }
}

async function main(): Promise<void> {
  const { book: bookArg, json } = parseArgs(process.argv);
  const bookKey = bookArg ?? process.env.OPENAI_BOOK_KEY ?? null;
  if (!bookKey) {
    printHelp();
    process.stderr.write('Error: pass --book <bookKey> or set OPENAI_BOOK_KEY.\n');
    process.exit(1);
  }

  const path = biblePath(bookKey);
  if (!tryLoadBible(bookKey)) {
    const empty: CompletenessReport = {
      bookKey,
      ready: false,
      gaps: [
        {
          path: path,
          reason: 'Character bible file does not exist.',
          suggestedQuestion: `Create scripts/image-gen/bibles/${bookKey}.json with cast, variants, and page contracts.`,
          blocking: true,
        },
      ],
      assumptions: [],
    };
    if (json) {
      console.log(JSON.stringify(empty, null, 2));
    } else {
      printHuman(empty, path);
    }
    process.exit(1);
  }

  const bible = loadBible(bookKey);
  const storyPageCount = loadStoryPageCount(bookKey);
  const report = checkBibleCompleteness(bible, { storyPageCount });

  if (json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    printHuman(report, path);
  }

  process.exit(report.ready ? 0 : 1);
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
