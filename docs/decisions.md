# Decisions log

Calls made while porting the approved desktop prototype into SvelteKit, newest last. Anything Josh asked for directly is marked **asked**; everything else is a judgment call that can be undone as described.

## 2026-11-06

**10:00 · Saved the uncommitted Mission-Control redesign on `wip/mission-control` (70227d8).**
Why: the desktop replaces it, but that work (page, styles, DESIGN.md, PRODUCT.md, fonts, tooling folders) shouldn't be lost.
Undo: `git switch wip/mission-control`.

**10:16 · Boot log and greeter play on every load, including reloads and deep links like `#allstarr` (a9e3efa). Asked.**
The prototype played it once per browser session and skipped it for links. Reduced motion still skips it, and any key or click skips it.
Undo: in `engine.ts`, gate `runBoot("boot")` on `sessionStorage` again.

**10:16 · Boot is slower: about 3 s instead of 1.6 s (a9e3efa). Asked.**
Log lines arrive at uneven 55–127 ms steps, then the greeter types `guest` and authenticates.
Undo: change the step and greeter timings in `runBoot` and `showGreeter`.

**10:16 · Cover the desktop until the boot starts (a9e3efa).**
Why: the page is prerendered, so without this the finished desktop flashes for a moment before the boot log. `app.html` sets `data-booting` before first paint; it is skipped for reduced motion and cleared after 10 s if scripts never load.
Undo: remove the script block in `app.html` and the `data-booting` rules in `desktop.css`.

**10:16 · Prerender all content (a9e3efa).**
Why: the prototype filled the file list, buffers and course table from JavaScript. Rendering them in Svelte puts every project, job and course in the HTML for search engines and no-JS visitors; the engine only adds behaviour.
Undo: not recommended.

**10:16 · The GitHub window loads repos live (a9e3efa).**
It shows the four most recently pushed repos that aren't forks or archived, like `gh repo list`. The old site sorted by stars and showed six. If the API fails or is rate-limited, the saved list stays.
Undo: change the query or filter in `src/lib/desktop/github.ts`, or drop the `loadRepos` call in `Desktop.svelte`.

**10:16 · `git log --oneline` in the terminal shows the real last five commits, read at build time (a9e3efa).**
Why: the prototype had a hand-copied snapshot that would go stale. If the build machine has no git, the terminal says no history was recorded.
Undo: delete `src/routes/+page.server.ts` and pass `commits={[]}`.

**10:16 · Added `@types/node` (a9e3efa).**
Why: the build-time `git log` reader runs in Node and needs its types for `svelte-check`.

**10:16 · Page title is "Josh Patra" (a9e3efa).**
It was "Josh's Portfolio". A plain name reads better in tabs and search results.
Undo: edit `<title>` in `src/routes/+page.svelte`.

**10:16 · Fonts load from Google Fonts (a9e3efa).**
Fragment Mono and Martian Mono, the same as the prototype. Self-hosting them in `static/fonts` would remove the third-party request.

**10:16 · Removed Tailwind (18436aa).**
Why: nothing uses it now, and its reset would change the design.
Undo: `git revert 18436aa`.

## Left alone, worth a look

- The "Terminal Portfolio" project still lists Tailwind CSS in its stack. That describes the old site; this rebuild doesn't use it.
- `static/Josh_Patra_Resume.pdf` says "Expected May 2026" and GPA 3.7; the site says 3.75.
- Unused PNG copies of the project images (and `headshot.JPG`, `headshot_square.jpg`) are still in `static/` and ship with the build.
