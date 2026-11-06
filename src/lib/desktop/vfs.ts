// The guest's home directory: plain-text views of the content, shared by the nvim buffers, cat, grep and tree.
import { ACHIEVEMENTS, COURSES, EDUCATION, EXPERIENCE, PROFILE, PROJECTS, SKILLS, type Project } from "$lib/content";

export const esc = (s: unknown) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

export const EXP_LINES = [
  "# Experience",
  "",
  ...EXPERIENCE.flatMap((x) => [`## ${x.role}`, `${x.org} · ${x.place} · ${x.dates}`, "", ...x.bullets.map((b) => `- ${b}`), ""]),
  "<!-- Open-source work and side projects live on workspace 2. -->",
];

export const SKILL_LINES = [
  "# ~/.config/skills.toml",
  "",
  ...SKILLS.flatMap(([k, list], i) => [`[${k}]`, `items = [${list.map((s) => `"${s}"`).join(", ")}]`, ...(i < SKILLS.length - 1 ? [""] : [])]),
];

export const ACH_LINES = ACHIEVEMENTS.flatMap(([d, t, x], i) => [`[${d}] ${t}`, `  ${x}`, ...(i < ACHIEVEMENTS.length - 1 ? [""] : [])]);

export const README = (p: Project) => [
  `# ${p.name}`,
  "",
  p.description,
  "",
  "## Features",
  ...p.highlights.map((h) => `- ${h}`),
  "",
  "## Stack",
  p.stack.join(", "),
  "",
  "## Repository",
  p.link,
];

export const VFS: Record<string, string[]> = {
  "achievements.log": ACH_LINES,
  contact: [`email     ${PROFILE.email}`, `github    github.com/${PROFILE.githubUser}`, `linkedin  linkedin.com/in/${PROFILE.linkedinUser}`],
  "experience.md": EXP_LINES,
  motd: ["Welcome to Josh Patra’s desktop.", "Type help for commands, press / to find anything, ? for keys."],
  "rutgers/degree": [EDUCATION.school, EDUCATION.degree, `GPA ${EDUCATION.gpa} / 4.0 · Dean’s List, every semester`],
  "rutgers/courses": COURSES.map(([c, n]) => `${c}  ${n}`),
  "skills.toml": SKILL_LINES,
  ...Object.fromEntries(PROJECTS.map((p) => [`projects/${p.slug}/README.md`, README(p)])),
};

export const ROOT_LS = ["achievements.log", "contact", "experience.md", "motd", "projects/", "resume.pdf", "rutgers/", "skills.toml"];

// ---------- syntax highlighting for the read-only buffers ----------
export type HlLine = { html: string; cls?: string; role?: 1 | 2 };
export type Highlighter = (line: string, i: number) => HlLine;

const hlMd: Highlighter = (l) => {
  if (l.startsWith("## ")) return { cls: "h2", html: `<span class="mk">## </span>${esc(l.slice(3))}`, role: 2 };
  if (l.startsWith("# ")) return { cls: "h1", html: `<span class="mk"># </span>${esc(l.slice(2))}`, role: 1 };
  if (l.startsWith("- ")) return { html: `<span class="mk">- </span><span class="ttl">${esc(l.slice(2))}</span>` };
  if (l.startsWith("<!--")) return { html: `<span class="cm">${esc(l)}</span> <button class="lnk" type="button" data-go="2">open projects →</button>` };
  if (l.includes(" · ")) return { html: `<span class="meta">${esc(l)}</span>` };
  return { html: esc(l) };
};

const hlToml: Highlighter = (l) => {
  if (l.startsWith("#")) return { html: `<span class="cm">${esc(l)}</span>` };
  if (/^\[.*\]$/.test(l)) return { html: `<span class="tb">${esc(l)}</span>` };
  const m = l.match(/^(\w+) = \[(.*)\]$/);
  if (m) return { html: `<span class="ky">${m[1]}</span> = [${m[2].split(", ").map((s) => `<span class="sv">${esc(s)}</span>`).join(", ")}]` };
  return { html: esc(l) };
};

const hlLog: Highlighter = (l) => {
  const m = l.match(/^\[(.+?)\] (.*)$/);
  if (m) return { html: `<span class="ts">[${esc(m[1])}]</span> <span class="ttl">${esc(m[2])}</span>` };
  return { html: esc(l) };
};

export const BUFFERS = {
  exp: { name: "experience.md", lines: EXP_LINES, hl: hlMd },
  skills: { name: "skills.toml", lines: SKILL_LINES, hl: hlToml },
  ach: { name: "achievements.log", lines: ACH_LINES, hl: hlLog },
} satisfies Record<string, { name: string; lines: string[]; hl: Highlighter }>;

export type BufferId = keyof typeof BUFFERS;
