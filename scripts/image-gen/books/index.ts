import type { BookImageManifest } from '../types.js';
import { princessBowieFightsEvilSanta } from './princess-bowie-fights-evil-santa.js';
import { rainbowie } from './rainbowie.js';

const byKey: Record<string, BookImageManifest> = {
  'princess-bowie-fights-evil-santa': princessBowieFightsEvilSanta,
  rainbowie,
};

export function getManifest(bookKey: string): BookImageManifest {
  const manifest = byKey[bookKey];
  if (!manifest) {
    throw new Error(
      `Unknown book "${bookKey}". Known keys: ${Object.keys(byKey).sort().join(', ')}`
    );
  }
  return manifest;
}

export function listBookKeys(): string[] {
  return Object.keys(byKey).sort();
}
