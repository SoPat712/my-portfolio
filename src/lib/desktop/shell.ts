// The shell behind the terminal window and the `:` command line: commands, manual pages and tab completion, plus
// the terminal's readline keys, history and reverse search. It reaches the window manager only through ShellHost.
import { FORTUNES, PROFILE, PROJECTS, bySlug, sortProjects, type Project } from "$lib/content";
import { ROOT_LS, VFS, esc } from "./vfs";
import {
  $,
  LAYOUTS,
  RICES,
  SYM,
  WIN_ALIAS,
  WS_ALIAS,
  WS_NAMES,
  later,
  pad2,
  type Commit,
  type IO,
  type Layout,
  type Rice,
  type Seg,
  type Win,
  type WsState,
} from "./shared";

export type ShellHost = {
  WIN: Record<string, Win>;
  WS: Record<number, WsState>;
  commits: Commit[];
  cur(): number;
  rice(): Rice;
  desk(): boolean;
  isOpen(id: string): boolean;
  launch(id: string): boolean;
  closeWin(id: string, o?: { dom?: boolean }): boolean;
  openProject(slug: string): boolean;
  switchWs(n: number, o?: { focus?: boolean }): void;
  openKeys(topic?: string | null): void;
  openRofi(): void;
  runBoot(kind: "reboot" | "logout" | "lock"): void;
  cycleLayout(): void;
  setLayout(name: string): boolean;
  applyRice(name: string, announce: boolean): boolean;
  openResume(): void;
  copyEmail(): Promise<boolean>;
};

type Command = (args: string[], io: IO) => void;

const bare = (url: string) => url.replace(/^https:\/\/(www\.)?/, "");
const RESUME_FILE = PROFILE.resume.split("/").pop()!;
const NEOFETCH_ART = "     _ ____\n    | |  _ \\\n _  | | |_) |\n| |_| |  __/\n \\___/|_|";
const ALIASES: Record<string, string> = {
  ll: "ls -la",
  vi: "nvim",
  vim: "nvim",
  email: "contact",
  mail: "contact",
  neofetch: "fetch",
  less: "cat",
  more: "cat",
  rofi: "launcher",
  theme: "wal",
};
const BUILTINS = ["cd", "alias", "echo", "pwd", "history", "help", "exit", "which", "clear"];
// The directory a bare `ls` lists from each workspace's prompt.
const LS_DIR: Record<string, string> = { projects: "projects", education: "rutgers" };
const MAN: Record<string, [string, string, ...[string, string][]]> = {
  patra: [
    "PATRA(1)",
    `patra - ${PROFILE.name}'s portfolio, run as a tiling desktop`,
    ["SYNOPSIS", "workspaces 1-5 · / find · : command · f hints · ? keys"],
    [
      "DESCRIPTION",
      "Five workspaces hold the sections: 1 home, 2 projects, 3 experience, 4 education, 5 contact. The bar at the top switches between them; every window has a close button and can be reopened from the launcher (run, / or CTRL-K).",
    ],
    [
      "KEYS",
      "With vim keys on, h j k l move between windows, w is the window prefix, <Space> is the leader, f shows link hints and : opens a command line. :set novim turns single-key shortcuts off. ? shows them all.",
    ],
    [
      "FILES",
      "~/projects/<name>/README.md, experience.md, skills.toml, achievements.log, rutgers/courses, contact, resume.pdf",
    ],
    ["SEE ALSO", "help, vimtutor, ls(1), grep(1), open(1)"],
  ],
  ls: [
    "LS(1)",
    "ls - list directory contents",
    ["SYNOPSIS", "ls [-la] [projects|rutgers]"],
    [
      "DESCRIPTION",
      "Lists the home directory, a project, or rutgers/. -l prints permissions and owner; -a includes . and ..; ll is ls -la.",
    ],
  ],
  cd: [
    "CD(1)",
    "cd - change workspace",
    ["SYNOPSIS", "cd <1-5|home|projects|experience|education|contact>"],
    ["DESCRIPTION", "Switches the desktop to that workspace and updates the prompt."],
  ],
  open: [
    "OPEN(1)",
    "open - open a window or project",
    ["SYNOPSIS", "open <window|project|resume.pdf>"],
    [
      "DESCRIPTION",
      "Windows: fetch, terminal, now, files, experience.md, skills.toml, education, achievements.log, github, contact, compose, keys. Projects open in a window on workspace 2.",
    ],
  ],
  cat: [
    "CAT(1)",
    "cat - print a file",
    ["SYNOPSIS", "cat <file|project>"],
    ["DESCRIPTION", "Prints a file from the home directory. cat <project> prints that project's README."],
  ],
  grep: [
    "GREP(1)",
    "grep - search every file",
    ["SYNOPSIS", "grep <term>"],
    [
      "DESCRIPTION",
      "Case-insensitive search through project READMEs (names, descriptions, features, stacks), skills.toml, rutgers/courses, experience.md and achievements.log. Prints file:line: text. Click a project path to open it.",
    ],
  ],
  ps: [
    "PS(1)",
    "ps - list open windows",
    ["SYNOPSIS", "ps"],
    ["DESCRIPTION", "Shows each open window with its id and workspace. R+ marks the focused window."],
  ],
  kill: [
    "KILL(1)",
    "kill - close a window",
    ["SYNOPSIS", "kill <id|name>"],
    [
      "DESCRIPTION",
      "Closes a window by the id from ps or by name, e.g. kill now or kill allstarr. Reopen it with open.",
    ],
  ],
  man: [
    "MAN(1)",
    "man - show a manual page",
    ["SYNOPSIS", "man <command>"],
    [
      "DESCRIPTION",
      "Pages exist for patra, ls, cd, open, cat, grep, ps, kill, man, wal, layout, git, vim, cal, uptime, fortune and tree.",
    ],
  ],
  wal: [
    "WAL(1)",
    "wal - change the colorscheme",
    ["SYNOPSIS", "wal [oxide|paper|sodium]"],
    [
      "DESCRIPTION",
      "oxide is the default, paper is light, sodium is a blue night with an amber accent. Also :colorscheme <name> and <Space>c.",
    ],
  ],
  layout: [
    "LAYOUT(1)",
    "layout - tile, monocle or float",
    ["SYNOPSIS", "layout [tile|monocle|float]"],
    [
      "DESCRIPTION",
      "tile []= puts one master window on the left and stacks the rest. monocle [M] shows one window with a tab strip. float ><> lets you drag and resize windows.",
    ],
  ],
  git: [
    "GIT(1)",
    "git - read-only history",
    ["SYNOPSIS", "git log --oneline"],
    [
      "DESCRIPTION",
      `Prints a snapshot of the recent commits in ${PROFILE.githubUser}/my-portfolio, taken when this page was built.`,
    ],
  ],
  vim: [
    "NVIM(1)",
    "nvim - focus a file's window",
    ["SYNOPSIS", "vim <file>"],
    [
      "DESCRIPTION",
      "Opens or focuses the window for experience.md, skills.toml, achievements.log, contact, rutgers/courses or a project README. Buffers are read-only; j k move the cursor line.",
    ],
  ],
  cal: [
    "CAL(1)",
    "cal - show this month",
    ["SYNOPSIS", "cal"],
    ["DESCRIPTION", "Prints the current month with today highlighted."],
  ],
  uptime: [
    "UPTIME(1)",
    "uptime - time since this page loaded",
    ["SYNOPSIS", "uptime"],
    ["DESCRIPTION", "Prints the clock time and how long this tab has been open."],
  ],
  fortune: [
    "FORTUNE(6)",
    "fortune - print a quotation",
    ["SYNOPSIS", "fortune"],
    ["DESCRIPTION", "Prints one of a few attributed quotations about programs and philosophy."],
  ],
  tree: [
    "TREE(1)",
    "tree - list the home directory as a tree",
    ["SYNOPSIS", "tree"],
    ["DESCRIPTION", "Prints every directory and file, ASCII style."],
  ],
};
MAN.nvim = MAN.vi = MAN.vim;
MAN.close = MAN.kill;
MAN.theme = MAN.wal;
MAN.ll = MAN.ls;

/** Renders output segments as one line (a div) of terminal or command-line output. */
function segsToNode(segs: Seg[]) {
  const d = document.createElement("div");
  for (const s of segs) {
    if (s == null) continue;
    if (typeof s === "string") {
      d.append(s);
    } else if ("node" in s) {
      d.append(s.node);
    } else if ("html" in s) {
      const sp = document.createElement("span");
      sp.innerHTML = s.html;
      d.append(sp);
    } else if (s.href) {
      const a = document.createElement("a");
      a.href = s.href;
      a.textContent = s.t;
      if (/^https?:|\.pdf$/.test(s.href)) {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
      }
      if (/\.pdf$/.test(s.href)) a.dataset.resume = "";
      d.append(a);
    } else if (s.act) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "tlink";
      b.textContent = s.t;
      b.addEventListener("click", s.act);
      d.append(b);
    } else {
      const sp = document.createElement("span");
      sp.className = s.c || "";
      sp.textContent = s.t;
      d.append(sp);
    }
  }
  return d;
}

/** Output for the command line: collects lines for the caller to show as a message. */
export function msgIO() {
  const lines: HTMLElement[] = [];
  const io: IO = { kind: "ex", out: (...s) => void lines.push(segsToNode(s)), clear: () => {} };
  return { ...io, lines };
}

export function setupShell(host: ShellHost) {
  const { WIN, WS } = host;
  const loaded = Date.now();
  const termOut = $("#termOut"),
    termIn = $<HTMLInputElement>("#termIn"),
    termPrompt = $("#termPrompt");
  const termBody = $("#termBody"),
    rsPrev = $("#rsPrev");
  const termIO: IO = {
    kind: "term",
    out: (...s) => termOut.append(segsToNode(s)),
    clear: () => (termOut.textContent = ""),
  };

  let cwd = "~";
  const hist: string[] = [];
  let hPos = -1;
  const promptHTML = () => `<span class="pr">guest@patra</span>:<span class="path">${esc(cwd)}</span>$`;
  const setPrompt = () => (termPrompt.innerHTML = promptHTML());
  const scrollTerm = () => (termBody.scrollTop = termBody.scrollHeight);

  const findProject = (q: string | undefined): Project | null => {
    q = (q || "")
      .toLowerCase()
      .replace(/^~\//, "")
      .replace(/^projects\//, "")
      .replace(/\/(readme\.md)?$/, "");
    if (!q) return null;
    return bySlug[q] || PROJECTS.find((p) => p.slug.startsWith(q) || p.name.toLowerCase().startsWith(q)) || null;
  };
  // Resolves a file argument against the current directory.
  const normPath = (a: string | undefined) => {
    a = (a || "").replace(/^~\//, "").replace(/^\.\//, "").replace(/\/$/, "");
    if (cwd !== "~" && a && !a.includes("/")) {
      const dir = cwd.slice(2);
      if (VFS[`${dir}/${a}`]) return `${dir}/${a}`;
      if (dir === "projects" && bySlug[a]) return `projects/${a}`;
    }
    return a;
  };
  const uptime = () => {
    const m = Math.floor((Date.now() - loaded) / 60000);
    return m < 1 ? "less than a minute" : m < 60 ? `${m} min` : `${Math.floor(m / 60)}:${pad2(m % 60)}`;
  };

  function listing(dir: string): string[] | null {
    if (!dir || dir === "~" || dir === ".") return ROOT_LS;
    if (dir === "projects") return sortProjects(PROJECTS).map((p) => `${p.slug}/`);
    if (dir === "rutgers") return ["courses", "degree"];
    if (dir.startsWith("projects/") && bySlug[dir.slice(9)]) return ["README.md"];
    return null;
  }
  function lsLong(entries: string[], io: IO, dotdirs: boolean) {
    if (dotdirs) {
      io.out({ t: "drwxr-xr-x  josh  josh  ", c: "dim" }, { t: ".", c: "dir" });
      io.out({ t: "drwxr-xr-x  root  root  ", c: "dim" }, { t: "..", c: "dir" });
    }
    for (const e of entries) {
      const dir = e.endsWith("/");
      io.out({ t: `${dir ? "drwxr-xr-x" : "-r--r--r--"}  josh  josh  `, c: "dim" }, { t: e, c: dir ? "dir" : "hl" });
    }
  }
  function grepAll(term: string, io: IO) {
    const q = term.toLowerCase();
    let count = 0;
    // Project READMEs first, then the other files alphabetically.
    const files = Object.keys(VFS).sort(
      (a, b) => (a.startsWith("projects/") ? 0 : 1) - (b.startsWith("projects/") ? 0 : 1) || a.localeCompare(b),
    );
    for (const f of files) {
      VFS[f].forEach((line, i) => {
        if (!line.toLowerCase().includes(q)) return;
        if (++count > 60) return;
        const slug = f.startsWith("projects/") ? f.split("/")[1] : null;
        const path: Seg = slug
          ? { t: f, act: () => host.openProject(slug) }
          : WIN_ALIAS[f]
            ? { t: f, act: () => host.launch(WIN_ALIAS[f]) }
            : { t: f, c: "dir" };
        const parts: string[] = [];
        let rest = line,
          at = rest.toLowerCase().indexOf(q);
        while (at >= 0) {
          parts.push(esc(rest.slice(0, at)), `<mark>${esc(rest.slice(at, at + q.length))}</mark>`);
          rest = rest.slice(at + q.length);
          at = rest.toLowerCase().indexOf(q);
        }
        parts.push(esc(rest));
        io.out(path, { t: `:${i + 1}: `, c: "dim" }, { html: parts.join("") });
      });
    }
    if (!count) io.out({ t: `grep: no matches for '${term}'`, c: "dim" });
    else io.out({ t: `${count} match${count === 1 ? "" : "es"}${count > 60 ? ", first 60 shown" : ""}`, c: "dim" });
  }
  function tree(io: IO) {
    io.out({ t: "~", c: "dir" });
    let dirs = 0,
      files = 0;
    ROOT_LS.forEach((e, i) => {
      const last = i === ROOT_LS.length - 1,
        pre = last ? "`-- " : "|-- ",
        ind = last ? "    " : "|   ";
      const dir = e.endsWith("/");
      io.out({ t: pre, c: "dim" }, { t: e.replace(/\/$/, ""), c: dir ? "dir" : "hl" });
      if (!dir) {
        files++;
        return;
      }
      dirs++;
      const kids = listing(e.slice(0, -1)) || [];
      kids.forEach((k, j) => {
        const kl = j === kids.length - 1,
          kdir = k.endsWith("/");
        io.out({ t: ind + (kl ? "`-- " : "|-- "), c: "dim" }, { t: k.replace(/\/$/, ""), c: kdir ? "dir" : "hl" });
        files++;
        if (kdir) {
          dirs++;
          io.out({ t: `${ind}${kl ? "    " : "|   "}\`-- `, c: "dim" }, { t: "README.md", c: "hl" });
        }
      });
    });
    io.out("");
    io.out({ t: `${dirs} directories, ${files} files`, c: "dim" });
  }
  function cal(io: IO) {
    const d = new Date(),
      y = d.getFullYear(),
      m = d.getMonth(),
      today = d.getDate();
    const title = d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    io.out(" ".repeat(Math.max(0, Math.floor((20 - title.length) / 2))) + title);
    io.out({ t: "Su Mo Tu We Th Fr Sa", c: "dim" });
    const first = new Date(y, m, 1).getDay(),
      days = new Date(y, m + 1, 0).getDate();
    let row: (number | string)[] = Array(first).fill("  ");
    for (let day = 1; day <= days; day++) {
      row.push(day);
      if (row.length < 7 && day < days) continue;
      const segs: Seg[] = [];
      row.forEach((c, i) => {
        if (i) segs.push(" ");
        if (typeof c !== "number") segs.push(c);
        else segs.push(c === today ? { t: String(c).padStart(2), c: "today" } : String(c).padStart(2));
      });
      io.out(...segs);
      row = [];
    }
  }
  function neofetch(io: IO) {
    const pre = document.createElement("pre");
    pre.textContent = NEOFETCH_ART;
    pre.setAttribute("aria-hidden", "true");
    const kv = document.createElement("div");
    kv.className = "kvs";
    const rows = [
      ["", "guest@patra"],
      ["", "-----------"],
      ["Name", PROFILE.name],
      ["Study", PROFILE.study],
      ["GPA", PROFILE.gpa],
      ["Focus", PROFILE.focus],
      ["Languages", PROFILE.languages],
      ["Projects", `${PROJECTS.length}, on workspace 2`],
      ["WM", "patra-wm (tile, monocle, float)"],
      ["Theme", host.rice()],
      ["Uptime", uptime()],
    ];
    for (const [k, v] of rows) {
      const d = document.createElement("div");
      if (k) {
        const s = document.createElement("span");
        s.className = "k";
        s.textContent = `${k}: `;
        d.append(s);
      }
      d.append(v);
      kv.append(d);
    }
    const blocks = document.createElement("div");
    blocks.className = "blocks";
    blocks.setAttribute("aria-hidden", "true");
    for (const c of ["--win-3", "--rust", "--moss", "--ochre", "--slate", "--clay", "--sage", "--fg"]) {
      const i = document.createElement("i");
      i.style.setProperty("--c", `var(${c})`);
      blocks.append(i);
    }
    kv.append(blocks);
    const grid = document.createElement("div");
    grid.className = "nf";
    grid.append(pre, kv);
    io.out({ node: grid });
  }
  // A window id from a ps number, a window name or a project name.
  function windowIdFor(arg: string) {
    const a = (arg || "").toLowerCase().replace(/^~\//, "");
    if (!a) return null;
    if (/^\d+$/.test(a)) return Object.values(WIN).find((x) => x.nr === Number(a) && host.isOpen(x.id))?.id ?? null;
    if (WIN_ALIAS[a]) return WIN_ALIAS[a];
    const p = findProject(a);
    return p ? `p:${p.slug}` : null;
  }
  function openResume(io: IO) {
    io.out({ t: "opening ", c: "dim" }, { t: RESUME_FILE, href: PROFILE.resume });
    host.openResume();
  }
  /** Opens a window, project or the résumé by file name; shared by open, nvim and :edit. */
  function openFile(arg: string, io: IO) {
    const a = normPath(arg);
    if (!a) {
      host.launch("files");
      return;
    }
    if (/^resume(\.pdf)?$/.test(a)) {
      openResume(io);
      return;
    }
    if (a === "keys" || a === "keybinds" || a === "help") {
      host.openKeys();
      return;
    }
    const id = WIN_ALIAS[a];
    if (id) {
      host.launch(id);
      if (io.kind === "term") io.out({ t: `opened ${WIN[id].label} on workspace ${WIN[id].ws}`, c: "dim" });
      return;
    }
    const p = findProject(a);
    if (p) {
      if (io.kind === "term") io.out({ t: "opening ", c: "dim" }, { t: p.name, c: "hl" });
      later(() => host.openProject(p.slug), io.kind === "term" ? 120 : 0);
      return;
    }
    io.out({ t: `"${arg}" [New] E212: Can't open file for writing: read-only file system`, c: "er" });
  }
  function catFile(arg: string, io: IO) {
    const a = normPath(arg);
    if (!a) {
      io.out({ t: "cat: missing file operand", c: "er" });
      return;
    }
    if (/^resume(\.pdf)?$/.test(a)) {
      io.out({ t: "resume.pdf is a PDF; opening it instead", c: "dim" });
      host.openResume();
      return;
    }
    let p: Project | null = a.startsWith("projects/") ? bySlug[a.split("/")[1]] || null : null;
    if (!p && listing(a)) {
      io.out({ t: `cat: ${arg}: Is a directory`, c: "er" });
      return;
    }
    let lines = p ? VFS[`projects/${p.slug}/README.md`] : VFS[a];
    if (!lines) {
      p = findProject(a);
      if (p) lines = VFS[`projects/${p.slug}/README.md`];
    }
    if (!lines) {
      io.out({ t: `cat: ${arg}: No such file or directory`, c: "er" });
      return;
    }
    for (const l of lines) {
      if (l.startsWith("## ") || l.startsWith("# ")) io.out({ t: l, c: "acc" });
      else if (/^https:\/\//.test(l)) io.out({ t: bare(l), href: l });
      else io.out(l);
    }
    if (p) {
      const slug = p.slug;
      io.out({ t: "→ ", c: "dim" }, { t: `open ${slug}`, act: () => host.openProject(slug) });
    }
  }

  const COMMANDS: Record<string, Command> = {
    help(_, io) {
      const groups = [
        ["navigate", "cd ls ll tree open close kill ps"],
        ["read", "cat grep man vim"],
        ["desktop", "layout wal launcher keys lock logout reboot"],
        ["info", "neofetch whoami uptime date cal fortune git"],
        ["contact", "contact github linkedin resume"],
        ["shell", "alias which history clear echo pwd exit"],
      ];
      for (const [k, v] of groups) io.out({ t: `  ${k.padEnd(10)}`, c: "acc" }, { t: v, c: "hl" });
      io.out({ t: "  man <command> explains one; man patra explains the site; vimtutor is a short tour.", c: "dim" });
    },
    ls(args, io) {
      const flags = args.filter((a) => a.startsWith("-")).join(""),
        long = flags.includes("l"),
        all = flags.includes("a");
      let dir = (args.find((a) => !a.startsWith("-")) || "").replace(/^~\/?/, "").replace(/\/$/, "");
      if (!dir && cwd !== "~") dir = LS_DIR[cwd.slice(2)] ?? "";
      if (dir === "work") dir = "projects";
      const ents = listing(dir);
      if (!ents) {
        io.out({ t: `ls: cannot access '${dir}': No such file or directory`, c: "er" });
        return;
      }
      if (long) {
        lsLong(ents, io, all);
        return;
      }
      const segs: Seg[] = [];
      if (all) segs.push({ t: ".", c: "dir" }, "  ", { t: "..", c: "dir" }, "  ");
      ents.forEach((e, i) => {
        segs.push({ t: e, c: e.endsWith("/") ? "dir" : "hl" });
        if (i < ents.length - 1) segs.push("  ");
      });
      io.out(...segs);
    },
    ll: (args, io) => COMMANDS.ls(["-la", ...args], io),
    tree: (_, io) => tree(io),
    cd(args, io) {
      const raw = (args[0] || "~").replace(/\/$/, "").replace(/^~\//, "").toLowerCase();
      const home = raw === "" || raw === ".." || raw === "/" || raw === "~";
      const n = /^[1-5]$/.test(raw) ? Number(raw) : home ? 1 : WS_ALIAS[raw];
      if (!n) {
        io.out({ t: `cd: no such workspace: ${raw}`, c: "er" }, { t: "  (try 1-5, or ls)", c: "dim" });
        return;
      }
      cwd = n === 1 ? "~" : `~/${WS_NAMES[n]}`;
      setPrompt();
      if (io.kind === "term") io.out({ t: `workspace ${n}: ${WS_NAMES[n]}`, c: "dim" });
      later(() => host.switchWs(n, { focus: true }), io.kind === "term" ? 120 : 0);
    },
    open(args, io) {
      const a = args.join(" ");
      if (a) openFile(a, io);
      else io.out({ t: "open: which window or project? try ", c: "dim" }, { t: "ls projects", c: "hl" });
    },
    close(args, io) {
      const a = args.join(" ");
      if (!a) {
        io.out({ t: "usage: kill <id|name>   (ps lists open windows)", c: "dim" });
        return;
      }
      const id = windowIdFor(a);
      if (!id || !host.isOpen(id)) {
        io.out({ t: `kill: ${a}: no such window`, c: "er" }, { t: "  (try ps)", c: "dim" });
        return;
      }
      const label = WIN[id].label;
      host.closeWin(id);
      if (io.kind === "term" && id !== "term") io.out({ t: `closed ${label}`, c: "dim" });
    },
    ps(_, io) {
      io.out({ t: "  PID  WS  STAT  WINDOW", c: "dim" });
      for (let n = 1; n <= 5; n++) {
        for (const id of WS[n].order) {
          const w = WIN[id],
            f = n === host.cur() && WS[n].focus === id;
          const name = w.kind === "project" ? `projects/${w.slug}` : w.label;
          io.out(
            `  ${String(w.nr).padStart(3)}   ${n}  `,
            { t: f ? "R+  " : "S   ", c: f ? "ok" : "dim" },
            `  ${name}`,
          );
        }
      }
    },
    cat: (args, io) => catFile(args.join(" "), io),
    grep(args, io) {
      const term = args
        .filter((a) => !/^-[a-z]+$/i.test(a))
        .join(" ")
        .replace(/^["']|["']$/g, "");
      if (term) grepAll(term, io);
      else io.out({ t: "usage: grep <term>   e.g. grep flutter", c: "dim" });
    },
    man(args, io) {
      const k = (args[0] || "").toLowerCase();
      if (!k) {
        io.out({ t: "What manual page do you want? Try man patra.", c: "dim" });
        return;
      }
      const page = MAN[k];
      if (!page) {
        io.out({ t: `No manual entry for ${k}`, c: "er" });
        return;
      }
      const [hd, name, ...secs] = page;
      io.out({ t: hd.padEnd(40) + hd, c: "dim" });
      io.out({ t: "NAME", c: "acc" });
      io.out(`       ${name}`);
      for (const [h, body] of secs) {
        io.out({ t: h, c: "acc" });
        io.out(`       ${body}`);
      }
    },
    cal: (_, io) => cal(io),
    uptime(_, io) {
      const d = new Date();
      io.out(` ${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())} up ${uptime()},  1 user`);
    },
    fortune(_, io) {
      const [q, who] = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
      io.out({ t: q, c: "hl" });
      io.out({ t: `        — ${who}`, c: "dim" });
    },
    git(args, io) {
      if (args[0] !== "log") {
        io.out({ t: "git: this is a read-only snapshot; try git log --oneline", c: "dim" });
        return;
      }
      if (!host.commits.length) {
        io.out({ t: "git: no history was recorded when this page was built", c: "dim" });
        return;
      }
      io.out({ t: `# snapshot of ${PROFILE.githubUser}/my-portfolio when this page was built`, c: "dim" });
      for (const { hash, subject } of host.commits) io.out({ t: hash, c: "str" }, ` ${subject}`);
    },
    alias(_, io) {
      for (const [k, v] of Object.entries(ALIASES)) io.out({ t: "alias ", c: "dim" }, { t: k, c: "hl" }, `='${v}'`);
    },
    which(args, io) {
      if (!args[0]) io.out({ t: "usage: which <command>", c: "dim" });
      for (const c of args) {
        if (ALIASES[c]) io.out(`${c}: aliased to ${ALIASES[c]}`);
        else if (BUILTINS.includes(c)) io.out(`${c}: shell built-in command`);
        else if (COMMANDS[c]) io.out(`/usr/bin/${c}`);
        else io.out({ t: `${c} not found`, c: "er" });
      }
    },
    rm(args, io) {
      const target = args.filter((a) => !a.startsWith("-")).join(" ") || "…";
      io.out({ t: `rm: cannot remove '${target}': Read-only file system`, c: "er" });
    },
    vimtutor(_, io) {
      if (io.kind === "term") io.out({ t: "opening the tutor in the keybindings window", c: "dim" });
      host.openKeys("tutor");
    },
    nvim(args, io) {
      const a = args.join(" ");
      if (a) openFile(a, io);
      else host.launch("files");
    },
    whoami(_, io) {
      io.out("guest");
      io.out({ t: `this desktop belongs to ${PROFILE.name}; you’re welcome to look around.`, c: "dim" });
    },
    pwd: (_, io) => io.out(cwd.replace("~", "/home/guest")),
    date: (_, io) => io.out(new Date().toString()),
    echo: (args, io) => io.out(args.join(" ")),
    fetch: (_, io) => neofetch(io),
    history(_, io) {
      hist
        .slice()
        .reverse()
        .forEach((h, i) => io.out({ t: String(i + 1).padStart(4) + "  ", c: "dim" }, h));
    },
    clear: (_, io) => io.clear(),
    sudo: (_, io) => io.out({ t: "guest is not in the sudoers file. This incident will be reported.", c: "er" }),
    exit: () => void host.closeWin("term", { dom: true }),
    reboot(_, io) {
      if (io.kind === "term") io.out({ t: "rebooting…", c: "dim" });
      later(() => host.runBoot("reboot"), 150);
    },
    logout: () => void later(() => host.runBoot("logout"), 100),
    lock: () => void later(() => host.runBoot("lock"), 100),
    layout(args, io) {
      if (!args[0]) {
        host.cycleLayout();
        const l = WS[host.cur()].layout;
        io.out(`layout: ${l} ${SYM[l]}`);
      } else if (!host.setLayout(args[0])) {
        io.out({ t: `layout: unknown layout '${args[0]}' (tile, monocle, float)`, c: "er" });
      } else {
        io.out(
          `layout: ${args[0]} ${SYM[args[0] as Layout]}${host.desk() ? "" : "  (layouts apply on wider screens)"}`,
        );
      }
    },
    wal(args, io) {
      if (args[0]) {
        if (!host.applyRice(args[0].toLowerCase(), true))
          io.out({ t: `wal: unknown colorscheme '${args[0]}' (oxide, paper, sodium)`, c: "er" });
        return;
      }
      const sep = (i: number) => (i < RICES.length - 1 ? "  " : "");
      io.out(...RICES.map((r, i): Seg => (r === host.rice() ? { t: `${r}*${sep(i)}`, c: "acc" } : `${r}${sep(i)}`)));
    },
    launcher: () => void later(host.openRofi, 30),
    keys: () => host.openKeys(),
    contact(_, io) {
      io.out({ t: "email     ", c: "dim" }, { t: PROFILE.email, href: `mailto:${PROFILE.email}` }, "  ", {
        t: "copy",
        act: () => void host.copyEmail(),
      });
      io.out({ t: "github    ", c: "dim" }, { t: bare(PROFILE.github), href: PROFILE.github });
      io.out({ t: "linkedin  ", c: "dim" }, { t: bare(PROFILE.linkedin), href: PROFILE.linkedin });
    },
    github: (_, io) => io.out({ t: bare(PROFILE.github), href: PROFILE.github }),
    linkedin: (_, io) => io.out({ t: bare(PROFILE.linkedin), href: PROFILE.linkedin }),
    resume: (_, io) => openResume(io),
  };
  COMMANDS.kill = COMMANDS.close;
  COMMANDS.neofetch = COMMANDS.fetch;
  COMMANDS.vim = COMMANDS.vi = COMMANDS.nvim;
  COMMANDS.less = COMMANDS.more = COMMANDS.cat;
  COMMANDS.email = COMMANDS.mail = COMMANDS.contact;
  COMMANDS.rofi = COMMANDS.launcher;
  COMMANDS.theme = COMMANDS.wal;

  /** Runs a shell command line. False if the command doesn't exist. */
  function interpret(line: string, io: IO) {
    const [cmd, ...args] = line.trim().split(/\s+/);
    const fn = COMMANDS[cmd.toLowerCase()];
    if (!fn) return false;
    fn(args, io);
    return true;
  }

  // ---------- tab completion ----------
  const openable = () => [
    "fetch",
    "terminal",
    "now",
    "files",
    "experience.md",
    "skills.toml",
    "education",
    "achievements.log",
    "github",
    "contact",
    "compose",
    "keys",
    "resume.pdf",
    ...PROJECTS.map((p) => p.slug),
  ];
  const ARGS: Record<string, () => string[]> = {
    cd: () => ["home", "projects", "experience", "education", "contact", "1", "2", "3", "4", "5"],
    ls: () => ["projects", "rutgers", "-la", "-l", "-a"],
    open: openable,
    cat: () => [
      ...ROOT_LS.filter((e) => !e.endsWith("/")),
      "rutgers/degree",
      "rutgers/courses",
      ...PROJECTS.map((p) => p.slug),
    ],
    kill: () =>
      Object.values(WIN)
        .filter((w) => host.isOpen(w.id))
        .flatMap((w) => [w.kind === "project" ? w.slug! : w.label, String(w.nr)]),
    man: () => Object.keys(MAN),
    layout: () => LAYOUTS,
    wal: () => RICES,
    git: () => ["log --oneline"],
    which: () => Object.keys(COMMANDS),
  };
  ARGS.close = ARGS.kill;
  ARGS.less = ARGS.more = ARGS.cat;
  ARGS.vim = ARGS.vi = ARGS.nvim = ARGS.e = ARGS.edit = openable;
  ARGS.theme = ARGS.colorscheme = ARGS.colo = ARGS.wal;

  /**
   * Completes the command or argument in `input` like bash: a single match is filled in, several are narrowed to
   * their common prefix, and if that adds nothing the matches are passed to `show`. `extraCmds` adds command names
   * (the command line's ex commands).
   */
  function complete(input: HTMLInputElement, show: (s: string) => void, extraCmds: string[] = []) {
    const parts = input.value.split(/\s+/),
      first = parts.length <= 1;
    const prefix = first ? parts[0] || "" : parts.slice(1).join(" ").toLowerCase();
    const pool = first ? [...Object.keys(COMMANDS), ...extraCmds].sort() : (ARGS[parts[0].toLowerCase()]?.() ?? []);
    const hits = [...new Set(pool)].filter((x) => x.toLowerCase().startsWith(prefix.toLowerCase()));
    const setVal = (s: string) => (input.value = first ? s : `${parts[0]} ${s}`);
    if (hits.length === 1) {
      setVal(hits[0] + (first ? " " : ""));
    } else if (hits.length > 1) {
      let common = hits[0];
      for (const h of hits) while (!h.toLowerCase().startsWith(common.toLowerCase())) common = common.slice(0, -1);
      if (common.length > prefix.length) setVal(common);
      else show(hits.join("  "));
    }
  }

  // ---------- the terminal window: readline keys, history, reverse-i-search ----------
  function echo(line: string, suffix = "") {
    const d = document.createElement("div");
    d.innerHTML = `${promptHTML()} `;
    d.append(line, suffix);
    termOut.append(d);
  }
  function runTerm(raw: string, record = true) {
    const line = raw.trim();
    echo(line);
    if (line) {
      if (record && hist[0] !== line) hist.unshift(line);
      hPos = -1;
      if (!interpret(line, termIO))
        termIO.out({ t: `command not found: ${line.split(/\s+/)[0]}`, c: "er" }, { t: "  (type help)", c: "dim" });
    }
    scrollTerm();
  }
  const rs = { on: false, q: "", idx: -1, saved: "" };
  function rsFind(from: number) {
    for (let i = Math.max(0, from); i < hist.length; i++)
      if (hist[i].toLowerCase().includes(rs.q.toLowerCase())) return i;
    return -1;
  }
  function rsRender() {
    termPrompt.textContent = `(reverse-i-search)'${rs.q}':`;
    rsPrev.hidden = false;
    rsPrev.textContent = rs.idx >= 0 ? hist[rs.idx] : rs.q ? "no match" : "";
  }
  function rsStart() {
    Object.assign(rs, { on: true, q: "", idx: -1, saved: termIn.value });
    termIn.value = "";
    rsRender();
  }
  function rsEnd(value: string) {
    rs.on = false;
    rsPrev.hidden = true;
    setPrompt();
    termIn.value = value;
    termIn.setSelectionRange(value.length, value.length);
  }
  function historyStep(d: 1 | -1) {
    if (d > 0 && hPos < hist.length - 1) termIn.value = hist[++hPos];
    else if (d < 0 && hPos > 0) termIn.value = hist[--hPos];
    else if (d < 0) {
      hPos = -1;
      termIn.value = "";
    }
  }
  termIn.addEventListener("input", () => {
    if (!rs.on) return;
    rs.q = termIn.value;
    rs.idx = rsFind(0);
    rsRender();
  });
  termIn.addEventListener("keydown", (e) => {
    const k = e.key,
      ctrl = e.ctrlKey && !e.metaKey && !e.altKey,
      c = k.toLowerCase();
    if (rs.on) {
      if (ctrl && c === "r") {
        const n = rsFind(rs.idx + 1);
        if (n >= 0) rs.idx = n;
        rsRender();
      } else if (k === "Enter") {
        const v = rs.idx >= 0 ? hist[rs.idx] : rs.q;
        rsEnd("");
        runTerm(v);
      } else if (k === "Escape" || (ctrl && (c === "g" || c === "c"))) {
        rsEnd(rs.saved);
      } else if (k === "Tab" || k === "ArrowRight" || k === "ArrowLeft") {
        rsEnd(rs.idx >= 0 ? hist[rs.idx] : rs.q);
      } else {
        return;
      }
      e.preventDefault();
      return;
    }
    if (ctrl) {
      const pos = termIn.selectionStart ?? termIn.value.length,
        len = termIn.value.length;
      const act: Record<string, () => void> = {
        a: () => termIn.setSelectionRange(0, 0),
        e: () => termIn.setSelectionRange(len, len),
        u: () => {
          termIn.value = termIn.value.slice(pos);
          termIn.setSelectionRange(0, 0);
        },
        k: () => (termIn.value = termIn.value.slice(0, pos)),
        l: () => (termOut.textContent = ""),
        r: rsStart,
      };
      if (act[c]) {
        e.preventDefault();
        act[c]();
      } else if (c === "c" && termIn.selectionStart === termIn.selectionEnd && !String(getSelection())) {
        // CTRL-C with nothing selected cancels the line, like a shell; with a selection it copies.
        e.preventDefault();
        echo(termIn.value, "^C");
        termIn.value = "";
        hPos = -1;
        scrollTerm();
      }
      return;
    }
    if (k === "Tab" && termIn.value.trim()) {
      e.preventDefault();
      complete(termIn, (s) => {
        termIO.out({ t: s, c: "dim" });
        scrollTerm();
      });
    } else if (k === "ArrowUp" || k === "ArrowDown") {
      e.preventDefault();
      historyStep(k === "ArrowUp" ? 1 : -1);
    }
  });
  $("#termForm").addEventListener("submit", (e) => {
    e.preventDefault();
    if (rs.on) return;
    const v = termIn.value;
    termIn.value = "";
    runTerm(v);
  });
  termBody.addEventListener("click", (e) => {
    if (!String(getSelection()) && !(e.target as HTMLElement).closest("a, button"))
      termIn.focus({ preventScroll: true });
  });
  setPrompt();
  runTerm("cat motd", false);
  runTerm("ls", false);

  return {
    interpret,
    openFile,
    complete,
    termIn,
    /** True while reverse-i-search owns the terminal's keys. */
    searching: () => rs.on,
  };
}
