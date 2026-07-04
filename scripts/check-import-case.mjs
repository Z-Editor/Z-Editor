// Catches relative imports whose case doesn't match the real filename.
// macOS/Windows resolve these anyway; case-sensitive CI (Linux) fails at build.
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve, relative, sep } from 'node:path';

const ROOT = resolve('src');
const EXTS = ['', '.ts', '.tsx', '.js', '.jsx', '.css', '.svg', '.json', '/index.ts', '/index.tsx', '/index.js'];
const IMPORT_RE = /(?:from\s*|import\s*)['"](\.[^'"]+)['"]/g;

const problems = [];

function exactCase(abs) {
  const parts = relative(process.cwd(), abs).split(sep);
  let cur = process.cwd();
  for (const seg of parts) {
    let entries;
    try {
      entries = readdirSync(cur);
    } catch {
      return false;
    }
    if (!entries.includes(seg)) return false;
    cur = join(cur, seg);
  }
  return true;
}

function check(file) {
  const src = readFileSync(file, 'utf8');
  for (const [, spec] of src.matchAll(IMPORT_RE)) {
    const base = dirname(file);
    const hit = EXTS.map((e) => resolve(base, spec + e)).find(existsSync);
    if (!hit) problems.push(`${file}: unresolved import '${spec}'`);
    else if (!exactCase(hit)) problems.push(`${file}: case mismatch '${spec}' -> ${relative(process.cwd(), hit)}`);
  }
}

function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(tsx?|jsx?)$/.test(e.name)) check(p);
  }
}

walk(ROOT);

if (problems.length) {
  console.error('Import case/resolution errors:\n' + problems.map((p) => '  - ' + p).join('\n'));
  process.exit(1);
}
console.log('Import case check passed.');
