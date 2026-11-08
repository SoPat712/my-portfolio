// The boot log and greeter run as a CSS timeline (BootScreen.svelte, desktop.css), so they start with the first
// paint instead of waiting for JavaScript. This module holds the lines, the greeter's fetch and the schedule; the
// engine only takes over at the end, or when a key or click skips ahead.

export type BootLine = { ok: boolean; text: string; rice?: true };

export function bootLines(o: { projects: number; courses: number; commits: number; githubUser: string }): BootLine[] {
  const ok = (text: string): BootLine => ({ ok: true, text });
  return [
    ok("Started Journal Service."),
    ok("Mounted /home/guest."),
    ok("Reached target Local File Systems."),
    ok("Loaded fonts: Fragment Mono, Martian Mono."),
    ok("Started Clock (status bar)."),
    // The colorscheme name comes from CSS, so it matches the saved rice before any script runs.
    { ok: true, text: "Applied colorscheme ", rice: true },
    ok(`Mounted ~/projects (${o.projects} entries).`),
    ok(`Mounted ~/rutgers (${o.courses} courses).`),
    ok(o.commits ? `Loaded git history (${o.commits} commits).` : "Loaded git history."),
    ok(`Started GitHub sync for ${o.githubUser}.`),
    ok("Started patra-wm, a tiling window manager."),
    ok("Started Notification Daemon (dunst)."),
    ok("Started Application Launcher (rofi)."),
    ok("Started nvim: experience.md, skills.toml, achievements.log."),
    ok("Started Terminal on workspace 1."),
    ok("Reached target Graphical Interface."),
    { ok: false, text: "Starting Greeter (tuigreet)..." },
  ];
}

/** What the build knows about itself, read when the page is prerendered. */
export type BuildInfo = { date: string; hash: string; kit: string; svelte: string };
export type ClientKey = "host" | "uptime" | "res" | "cpu" | "locale";
/** A row of the greeter's fetch: a fixed value, one read from the browser (`fill`), or the colorscheme. */
export type FetchRow = { k: string; v?: string; fill?: ClientKey; rice?: true; opt?: true };

/**
 * The greeter's fetch, shown the way tuigreet shows /etc/issue. patra runs inside the visitor's browser, so it
 * describes that machine: the build, plus the browser, screen and locale it is running on. `opt` rows are dropped
 * on short screens.
 */
export function fetchRows(o: { build: BuildInfo; projects: number; courses: number }): FetchRow[] {
  return [
    { k: "OS", v: `patra ${o.build.date}${o.build.hash ? ` (${o.build.hash})` : ""}` },
    { k: "Host", fill: "host" },
    { k: "Kernel", v: `SvelteKit ${o.build.kit}, Svelte ${o.build.svelte}`, opt: true },
    { k: "Uptime", fill: "uptime" },
    { k: "Packages", v: `${o.projects} projects, ${o.courses} courses` },
    { k: "Resolution", fill: "res" },
    { k: "WM", v: "patra-wm (tiling)" },
    { k: "Theme", rice: true },
    { k: "Font", v: "Fragment Mono, Martian Mono", opt: true },
    { k: "CPU", fill: "cpu" },
    { k: "Locale", fill: "locale", opt: true },
  ];
}

/** Time since the page started loading, as neofetch prints uptime. */
export function uptimeText() {
  const s = Math.floor(performance.now() / 1000),
    m = Math.floor(s / 60),
    plural = (n: number, unit: string) => `${n} ${unit}${n === 1 ? "" : "s"}`;
  if (s < 60) return plural(s, "sec");
  if (m < 60) return plural(m, "min");
  return `${plural(Math.floor(m / 60), "hour")}, ${plural(m % 60, "min")}`;
}

/** The fetch rows read from the visitor's browser. They are only shown on the page; nothing is sent anywhere. */
export function clientInfo(): Record<ClientKey, string> {
  const ua = navigator.userAgent;
  // The first match in each table wins; a captured version is appended to the name.
  const find = (table: [RegExp, string][]) => {
    for (const [re, name] of table) {
      const m = re.exec(ua);
      if (m) return m[1] ? `${name} ${m[1]}` : name;
    }
    return "";
  };
  const browser =
    find([
      [/Edg(?:A|iOS)?\/(\d+)/, "Edge"],
      [/OPR\/(\d+)/, "Opera"],
      [/(?:Firefox|FxiOS)\/(\d+)/, "Firefox"],
      [/(?:Chrome|CriOS)\/(\d+)/, "Chrome"],
      [/Version\/(\d+(?:\.\d+)?).*Safari/, "Safari"],
    ]) || "a web browser";
  const os = find([
    [/iPhone|iPad|iPod/, "iOS"],
    [/Android/, "Android"],
    [/CrOS/, "ChromeOS"],
    [/Mac/, "macOS"],
    [/Windows/, "Windows"],
    [/Linux/, "Linux"],
  ]);
  const dpr = Math.round(devicePixelRatio * 100) / 100;
  return {
    host: os ? `${browser} on ${os}` : browser,
    uptime: uptimeText(),
    res: `${screen.width}x${screen.height}${dpr === 1 ? "" : ` @${dpr}x`}`,
    cpu: navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} threads` : "unknown",
    locale: [navigator.language, Intl.DateTimeFormat().resolvedOptions().timeZone].filter(Boolean).join(", "),
  };
}

/** Milliseconds from first paint: when each log line appears, when the greeter types `guest`, and when it ends. */
export function bootSchedule(lineCount: number) {
  // Uneven steps of 90 to 210 ms, so the log reads like a real boot rather than a ticker.
  const at: number[] = [];
  let t = 0;
  for (let i = 0; i < lineCount; i++) {
    t += 90 + ((i * 2) % 5) * 30;
    at.push(t);
  }
  const greet = t + 500;
  const type = greet + 900;
  const typeStep = 140;
  const auth = type + 5 * typeStep + 350;
  const end = auth + 900;
  return { at, greet, type, typeStep, auth, end };
}
