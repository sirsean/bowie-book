import { mkdirSync, writeFileSync } from 'fs';
import { dirname, join, resolve } from 'path';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { getManifest, listBookKeys } from './books/index.js';

dotenv.config({ path: resolve(process.cwd(), '.env') });

function parseArgs(argv: string[]): {
  book: string | null;
  dryRun: boolean;
  only: Set<number> | null;
} {
  let book: string | null = null;
  let dryRun = false;
  let only: Set<number> | null = null;

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
    } else if (a === '--help' || a === '-h') {
      printHelp();
      process.exit(0);
    }
  }

  return { book, dryRun, only };
}

function printHelp(): void {
  console.log(`Usage: npm run generate:book-images -- --book <bookKey> [options]

Generate illustration files for a book using OpenAI Image API (default model per manifest).

Options:
  --book <bookKey>   Required unless OPENAI_BOOK_KEY is set. Example: princess-bowie-fights-evil-santa
  --dry-run          Print planned outputs without calling the API
  --only <indices>   Comma-separated zero-based page indices (e.g. 0,2,5)
  -h, --help         Show this message

Environment:
  OPENAI_API_KEY     Required for real runs (from project .env)
  OPENAI_BOOK_KEY    Default for --book when omitted

Known book keys:
  ${listBookKeys().join('\n  ')}
`);
}

async function main(): Promise<void> {
  const { book: bookArg, dryRun, only } = parseArgs(process.argv);
  const bookKey = bookArg ?? process.env.OPENAI_BOOK_KEY ?? null;

  if (!bookKey) {
    printHelp();
    process.stderr.write('Error: pass --book <bookKey> or set OPENAI_BOOK_KEY.\n');
    process.exit(1);
  }

  const manifest = getManifest(bookKey);
  const outDir = join(process.cwd(), 'public', 'books', manifest.bookKey);
  const apiKey = process.env.OPENAI_API_KEY;

  if (!dryRun && !apiKey) {
    process.stderr.write(
      'Error: OPENAI_API_KEY is missing. Add it to the project .env file.\n'
    );
    process.exit(1);
  }

  const client = apiKey ? new OpenAI({ apiKey }) : null;

  mkdirSync(outDir, { recursive: true });

  const defaults = manifest.defaults ?? {};

  for (let i = 0; i < manifest.pages.length; i++) {
    if (only && !only.has(i)) continue;

    const page = manifest.pages[i];
    const prefix = page.stylePrefix ?? manifest.stylePrefix;
    const fullPrompt = `${prefix}${page.prompt}`.trim();
    const dest = join(outDir, page.filename);

    console.log(`[${i}] → ${dest}`);

    if (dryRun) {
      console.log(`    prompt (${fullPrompt.length} chars): ${fullPrompt.slice(0, 200)}…`);
      continue;
    }

    if (!client) throw new Error('Client not initialized');

    const result = await client.images.generate({
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
      console.error('Unexpected response:', JSON.stringify(result, null, 2));
      throw new Error('No b64_json in image response');
    }

    const buf = Buffer.from(b64, 'base64');
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, buf);
    console.log(`    wrote ${buf.length} bytes`);
  }

  console.log(dryRun ? 'Dry run complete.' : 'Done.');
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
