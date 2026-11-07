// Fuzzy matching for the launcher, in the style of rofi and fzf.
import { esc } from "./vfs";

export type Match = { score: number; idx: number[] };

/**
 * Matches the lowercase query `q` against `s` as a subsequence. Consecutive characters and word starts score higher,
 * and earlier, shorter matches win ties. Returns null if `q` isn't a subsequence of `s`.
 */
export function fuzzy(q: string, s: string): Match | null {
  const t = s.toLowerCase();
  let qi = 0,
    score = 0,
    last = -2;
  const idx: number[] = [];
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] !== q[qi]) continue;
    idx.push(i);
    score += i === last + 1 ? 5 : 1;
    if (i === 0 || /[\s\-_./:]/.test(t[i - 1])) score += 3;
    last = i;
    qi++;
  }
  if (qi < q.length) return null;
  return { score: score - idx[0] * 0.05 - t.length * 0.01, idx };
}

/** `s` as HTML with the matched characters wrapped in <mark>. */
export function highlight(s: string, idx: number[]) {
  const set = new Set(idx);
  let out = "";
  for (let i = 0; i < s.length; i++) out += set.has(i) ? `<mark>${esc(s[i])}</mark>` : esc(s[i]);
  return out;
}
