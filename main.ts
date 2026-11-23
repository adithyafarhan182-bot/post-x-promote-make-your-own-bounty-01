// post-x-promote-make-your-own-bounty-01: the entry is the X post itself.
// This program hands its address to the gate: it reads POST.json from the
// repository root and writes it byte-identical to /output/POST.json.
// Node 22, standard library only. Deterministic: no network, no clock,
// no files outside the repository. Run locally with:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const raw = readFileSync(join(BOT_DIR, 'POST.json'), 'utf8');
const post = JSON.parse(raw) as { url?: unknown };
if (typeof post.url !== 'string' || !post.url.startsWith('https://')) {
  console.error('POST.json must name the post: {"url": "https://x.com/<handle>/status/<id>"}');
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(join(OUTPUT_DIR, 'POST.json'), raw);

// Verify the copy round-trips byte-identical before reporting success.
const written = readFileSync(join(OUTPUT_DIR, 'POST.json'), 'utf8');
if (written !== raw) {
  console.error('POST.json copy mismatch');
  process.exit(1);
}
