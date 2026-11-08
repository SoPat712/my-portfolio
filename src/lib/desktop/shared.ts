// Types, names and small DOM helpers shared by the desktop's modules. Nothing here touches the page at import time,
// so the modules can be imported during prerendering.

export type Rice = "oxide" | "paper" | "sodium";
export type Layout = "tile" | "monocle" | "float";
export type Rect = { x: number; y: number; w: number; h: number };
export type Win = {
  id: string;
  el: HTMLElement;
  ws: number;
  kind: "core" | "project";
  nr: number;
  label: string;
  slug?: string;
};
export type WsState = {
  order: string[];
  layout: Layout;
  prev: Layout;
  mfact: number;
  focus: string | null;
  float: Record<string, Rect>;
};
/** One piece of a terminal or command-line line: text, a node, raw HTML, a styled span, a link or a button. */
export type Seg =
  | string
  | null
  | undefined
  | { node: Node }
  | { html: string }
  | { t: string; c?: string; href?: string; act?: () => void };
/** A commit shown by `git log`, read when the page is built. */
export type Commit = { hash: string; subject: string };
/** Where command output goes: the terminal window, or the command line's message area. */
export type IO = { kind: "term" | "ex"; out: (...s: Seg[]) => void; clear: () => void };

export const RICES: Rice[] = ["oxide", "paper", "sodium"];
export const LAYOUTS: Layout[] = ["tile", "monocle", "float"];
export const isRice = (s: unknown): s is Rice => RICES.includes(s as Rice);
export const isLayout = (s: unknown): s is Layout => LAYOUTS.includes(s as Layout);
export const SYM: Record<Layout, string> = { tile: "[]=", monocle: "[M]", float: "><>" };

export const WS_NAMES: Record<number, string> = {
  1: "home",
  2: "projects",
  3: "experience",
  4: "education",
  5: "contact",
};
export const WS_ALIAS: Record<string, number> = {
  home: 1,
  "~": 1,
  now: 1,
  about: 1,
  projects: 2,
  work: 2,
  experience: 3,
  skills: 3,
  education: 4,
  rutgers: 4,
  achievements: 4,
  github: 4,
  contact: 5,
  email: 5,
};
/** Names a visitor might type for each core window, mapped to its id. */
export const WIN_ALIAS: Record<string, string> = {
  fetch: "fetch",
  neofetch: "fetch",
  about: "fetch",
  terminal: "term",
  term: "term",
  shell: "term",
  now: "now",
  files: "files",
  projects: "files",
  fm: "files",
  explorer: "files",
  experience: "exp",
  "experience.md": "exp",
  skills: "skills",
  "skills.toml": "skills",
  education: "edu",
  rutgers: "edu",
  courses: "edu",
  degree: "edu",
  "rutgers/degree": "edu",
  "rutgers/courses": "edu",
  achievements: "ach",
  "achievements.log": "ach",
  github: "gh",
  repos: "gh",
  contact: "contact",
  compose: "compose",
  mail: "compose",
};

export const $ = <T extends HTMLElement = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector(s) as T;
export const $$ = <T extends HTMLElement = HTMLElement>(s: string, r: ParentNode = document) =>
  Array.from(r.querySelectorAll<T>(s));
export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
export const pad2 = (n: number) => String(n).padStart(2, "0");
export const later = (fn: () => void, ms: number) => window.setTimeout(fn, ms);

/** Web storage that fails quietly when it is blocked (private windows, strict cookie settings). */
const quietStorage = (area: () => Storage) => ({
  get(k: string) {
    try {
      return area().getItem(k);
    } catch {
      return null;
    }
  },
  set(k: string, v: string) {
    try {
      area().setItem(k, v);
    } catch {
      /* storage blocked */
    }
  },
});
export const store = quietStorage(() => localStorage);
export const session = quietStorage(() => sessionStorage);

/**
 * The modifier keys for this platform. Macs keep ⌘K for the launcher and leave CTRL free for moving between windows.
 * Elsewhere CTRL-K is the launcher and the browser owns CTRL-H, CTRL-J and CTRL-L, so the window keys use Alt.
 */
export function platformKeys() {
  const mac = /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
  return { mac, find: mac ? "⌘K" : "CTRL-K", nav: mac ? "CTRL" : "ALT" };
}

export function openLink(href: string) {
  const a = document.createElement("a");
  a.href = href;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.append(a);
  a.click();
  a.remove();
}

/** Scrolls `container` just enough to bring `el` inside it, keeping `padding` px clear of the edges. */
export function ensureVisible(container: HTMLElement | null, el: HTMLElement | null, padding = 20) {
  if (!container || !el) return;
  const cr = container.getBoundingClientRect(),
    er = el.getBoundingClientRect();
  if (er.top < cr.top + padding) container.scrollTop -= cr.top + padding - er.top;
  else if (er.bottom > cr.bottom - padding) container.scrollTop += er.bottom - (cr.bottom - padding);
}
