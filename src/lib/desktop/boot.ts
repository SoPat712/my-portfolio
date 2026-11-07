// The boot log and greeter run as a CSS timeline (BootScreen.svelte, desktop.css), so they start with the first
// paint instead of waiting for JavaScript. This module holds the lines and the schedule; the engine only takes over
// at the end, or when a key or click skips ahead.

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

/** Milliseconds from first paint: when each log line appears, when the greeter types `guest`, and when it ends. */
export function bootSchedule(lineCount: number) {
  // Uneven steps of 70 to 150 ms, so the log reads like a real boot rather than a ticker.
  const at: number[] = [];
  let t = 0;
  for (let i = 0; i < lineCount; i++) {
    t += 70 + ((i * 2) % 5) * 20;
    at.push(t);
  }
  const greet = t + 400;
  const type = greet + 300;
  const typeStep = 110;
  const auth = type + 5 * typeStep + 250;
  const end = auth + 550;
  return { at, greet, type, typeStep, auth, end };
}
