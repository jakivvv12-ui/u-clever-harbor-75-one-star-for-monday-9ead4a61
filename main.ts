import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// One-star review of Monday, as if Monday were a restaurant.
// Table, dish and bill all went wrong — and the joke only works on a Monday:
// Friday's leftovers, and a tab that runs for the whole week ahead.
const LINE =
  "One star: waited an hour for a table, got Friday's leftovers, and Monday charged me for the whole week.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  throw new Error("MAKEFUN_OUTPUT_DIR is not set");
}

// Validate before writing: 1-180 characters, not only whitespace,
// at most 25 words, exactly one line.
if (LINE.length < 1 || LINE.length > 180) {
  throw new Error(`entry must be 1-180 characters, got ${LINE.length}`);
}
if (!LINE.trim()) {
  throw new Error("entry must not be only whitespace");
}
const words = LINE.trim().split(/\s+/);
if (words.length > 25) {
  throw new Error(`entry must be at most 25 words, got ${words.length}`);
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  throw new Error("entry must be a single line");
}
if (LINE !== LINE.trim()) {
  throw new Error("entry must not have leading or trailing whitespace");
}

mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");

// Round-trip check: what landed on disk must be exactly the line.
const back = readFileSync(outPath, "utf8");
if (back !== LINE) {
  throw new Error("round-trip check failed: entry.txt does not match the entry");
}
