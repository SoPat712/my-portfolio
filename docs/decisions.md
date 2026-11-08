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
Undo: `git revert 18436aa`, then `npm install` to put it back in the lockfile.

**11:33 · Synced `package-lock.json` (a18a512).**
The Tailwind removal and `@types/node` only changed `package.json`, so `npm ci` refused to install. The lockfile now drops Tailwind's packages and adds `@types/node`; nothing else moved.

**11:33 · The URL hash goes through SvelteKit's `replaceState` (33c36e1).**
Why: the engine called `history.replaceState` directly, which wiped the router's state from the history entry and printed a warning in dev. Back, forward and typing a hash in the address bar still work the same.
Undo: `git revert 33c36e1`.

## 2026-11-07

**The login screen says "Welcome back" (148d3a5). Asked.**
It said "Welcome to patra".

**Deleted unused images (8d98d2c). Asked.**
The PNG and JPG copies of project images, the unused BeReal and Jellyfin variants, and the original headshots: 5 MB of the 6.5 MB build. Speeder now uses its WebP icon, which matches the PNG. `favicon.ico` stays because browsers request it on their own.
Undo: `git revert 8d98d2c`.

**The Terminal Portfolio entry describes this site (fd66ff1). Asked.**
It described the old Tailwind terminal site. Name, slug and link are unchanged.

**The layout button shows its name: `[]= tile` (94a681e). Asked.**
The bare dwm symbol meant nothing to anyone who hasn't used dwm.

**Link previews (2b8ef1b). Asked.**
Open Graph and Twitter card tags, a canonical link, and `static/og.png`, a 1200×630 screenshot of workspace 1 in oxide. The absolute URL comes from Netlify's `URL` build variable (the custom domain, if one is set) and falls back to `https://joshpatraportfolio.netlify.app`. Retake the screenshot when workspace 1 changes.

**Pushed `main` to fa45b4e. Asked.**
A fast-forward of the twelve redesign commits; Netlify deploys from `main`. The work below is on `perf-cleanup`.

**Speed: "fast to load into the boot page", and the boot "maybe even longer". Asked.**
Measured on a simulated phone over 4G (150 ms round trips, 1.6 Mbps, CPU slowed 4×), median of several loads:

| | Before | After |
| --- | --- | --- |
| First paint | 0.57 s | 0.35 s |
| First boot line | 2.3 s | 0.42 s |
| Desktop, after the whole boot | 5.6 s | 4.5 s |
| Downloaded | 714 KB | 282 KB |

**The boot plays from CSS (1c5f864).**
Why: the log was printed by JavaScript, so nothing showed until the whole app had loaded. The lines are now prerendered and revealed by a CSS timeline under `:root[data-booting]`, which `app.html` sets before the first paint. The app takes over when it loads (it sets `data-booting="boot"`), and the greeter holds on "Authenticating…" if the app isn't ready. A key or click skips even before the app loads. `reboot` replays the same timeline.
Undo: `git revert 1c5f864`.

**The boot is about 3.9 s with 17 lines (1c5f864).**
New lines report real things: the course count, the git history, the GitHub sync and the nvim buffers. The log starts with the first paint instead of 120 ms after it.
Undo: the lines are in `bootLines` and the timings in `bootSchedule`, both in `src/lib/desktop/boot.ts`.

**Self-hosted fonts and an inlined stylesheet (7014636).**
Fragment Mono (regular and italic) and Martian Mono (variable weight and width) ship as Latin subsets with their OFL licenses, and the two upright faces are preloaded. Google Fonts was a render-blocking stylesheet on another origin. Glyphs outside Latin fall back to the system monospace font.
Undo: `git revert 7014636`.

**Images resized and stripped (b560b4c).**
Thumbnails are 256 px (they display at 40 to 84 px), the portrait 512 px. The BeReal logo carried a 102 KB monitor color profile; it was converted to sRGB before stripping so colors don't shift. 520 KB to 88 KB. The originals are in git history.

**Hashed build files are cached for a year (715ce01).**
`static/_headers` tells Netlify that `/_app/immutable/*` never changes, so repeat visits only fetch the page.

**Snappier motion (75caa77).**
Tiling 0.38 to 0.26 s, workspace slides 0.5 to 0.34 s, spawn-in 0.55 to 0.42 s with a 60 ms stagger.
Undo: `--dur` and the `.ws` transition in `desktop.css`.

## Clean-up

**The engine is split into modules (1a8c9f0).**
`shell.ts` (terminal and command line), `compose.ts`, `dither.ts`, `fuzzy.ts` and `shared.ts` came out of the 2,000-line `engine.ts`, which keeps the window manager and the vim layer; those share too much state to split cleanly. The shell reaches the window manager only through a typed `ShellHost`. The email address, links and fetch facts come from `PROFILE` instead of being repeated. `noUnusedLocals` is on, so dead code fails `npm run check`.

**Prettier at 120 columns (cc1457f).**
The code was written at about 120 columns, so `.prettierrc` says so. `KeysHelp.svelte` is in `.prettierignore` because its `<dt>` text is `white-space: pre` and Prettier collapses the spacing. `desktop.css` keeps one rule per line and wasn't formatted. The prerendered page was compared before and after: the only change is whitespace between grid and flex items.
Undo: `git revert cc1457f`.

**README rewritten (9e3ef28).**
It described the old Tailwind terminal site.

## Vim keys

**Windows move with CTRL-h j k l on a Mac and Alt-h j k l on Windows and Linux (d438a21). Asked.**
Like vim-tmux-navigator. On Windows and Linux the browser owns CTRL-H (history), CTRL-J (downloads) and CTRL-L (address bar), and CTRL-K is the launcher, so those use Alt. The platform comes from the user agent. They work with vim keys off too, but not inside text fields, where CTRL-K and CTRL-L keep their shell meanings; press Esc first. `w h j k l` still works.
Undo: the `only(KEYS.mac ? "ctrlKey" : "altKey")` branch in the keydown handler in `engine.ts`, and `platformKeys` in `shared.ts`.

**The launcher is on ⌘K on a Mac and CTRL-K elsewhere (d438a21). Asked.**
It took either modifier on every platform. `/` still opens it. Inside the launcher, CTRL-J and CTRL-K move the selection, fzf-style, so CTRL-K doesn't close it on Windows; Esc does.

**h j k l move item by item inside each window (d438a21, 826eba2).**
A cursor moves through the window's links, buttons, course rows and form fields by position, as in vim: j and k go to the line below or above and the closest column on it, h and l along a line, like the fetch window's row of links. o or Enter does what a click would, or starts typing in a field. l used to open the item too; Josh asked for it to move right instead. When the next item is out of view, j and k scroll a step instead, so text between items stays readable. The files list keeps its row cursor and the nvim buffers their line cursor. The cursor only appears once a key puts it there, so mouse visitors never see it. Links and buttons take focus as the cursor reaches them, and Space still opens the leader from there.
Undo: the item cursor section in `engine.ts` and `.vsel` in `desktop.css`.

**h j k l stay inside the window (d438a21).**
h and l used to jump to the neighbouring window, and j and k did too at the top or bottom of a window, so holding j to read overshot into the next window. Now only the window keys leave. Two file-manager habits stayed at first: l in files opened the selected project, and h at the left edge of a project window went back to the list (dropped below).

**Pushed `main` with the speed work, the clean-up and the vim keys. Asked.**
A fast-forward of `perf-cleanup` and `vim-keys`.

**The launcher is modal with vim keys on. Asked.**
Like telescope.nvim: it opens in insert mode, Esc stops typing, then j and k move, gg and G jump to the ends, CTRL-D and CTRL-U move half a page, o or Enter runs, i or a types again, and Esc or q closes. The mode pill says NORMAL while it is browsing. Clicking the query goes back to typing. With vim keys off, Esc still closes it at once.
Undo: `rofiMode` and `rofiNormalKey` in `engine.ts`, and the `rNormal` branch in `escapeChain`.

**h and l no longer open a project or go back to the list.**
Josh noticed that in the projects workspace they looked like moving between windows without CTRL: l in files opened the project and h at the left edge of a project window focused the list. Now nothing but the window keys leaves a window. Enter or o opens a project from files, and `-` goes back to the list from a project window, like vim-vinegar.

**The command line completes as you type. Asked.**
A popup menu, like nvim's `wildoptions=pum`, opens above the word being typed: ex and shell commands with a note on what each does, then that command's arguments (windows and projects for `:e`, colorschemes, layouts, help topics, open windows for `:b`, `vim` and `novim` for `:set`). Tab and Shift-Tab, or CTRL-N and CTRL-P while it is open, put each match in the line, and one past the last brings back what was typed. Enter runs the line as it stands, and clicking a match fills it in. It used to complete like bash, printing the matches as a message. The terminal still does.
Undo: the completion section in `engine.ts`, `#cmdPum` in `Desktop.svelte` and `.cmd-pum` in `desktop.css`.

**Pushed `main` with the modal launcher, the h and l fix and the completion menu. Asked.**
A fast-forward of `launcher-vim` and `cmdline-complete`.

**The boot is slower again: about 5.8 s instead of 3.9 s. Asked.**
Josh asked for the intro and the login to be a little slower, since any key or click skips them. Log lines arrive every 90 to 210 ms instead of 70 to 150, the greeter waits 900 ms before typing `guest` and types it at 140 ms a letter, and "Authenticating…" shows for 900 ms. Logging in after `logout` takes 600 ms instead of 320.
Undo: the timings in `bootSchedule` in `boot.ts`, and `login` in `engine.ts`.

**The greeter shows a fetch. Asked.**
Josh suggested a neofetch or system information on the login screen. It sits in the tuigreet box the way tuigreet shows `/etc/issue`. patra runs inside the visitor's browser, so the fetch describes that machine: the build date and commit, the SvelteKit and Svelte versions, the project and course counts, the window manager, theme and fonts, then the visitor's browser and OS, screen, CPU threads and locale, and an uptime counted from page load. The browser values are read on the page and never sent anywhere. Its lines print in turn as the greeter appears. Phones drop the logo, and short screens drop the Kernel, Font and Locale rows. The terminal's `neofetch` and the fetch window now share the logo and palette with it.
Undo: `fetchRows` and `clientInfo` in `boot.ts`, `.gr-fetch` in `BootScreen.svelte` and `desktop.css`, and `build` in `+page.server.ts`.

## Left alone, worth a look

- `static/Josh_Patra_Resume.pdf` says "Expected May 2026" and GPA 3.7; the site says 3.75. Josh is updating it.
- `svelte.config.js` sets `precompress: true`, which writes `.gz` and `.br` copies. Netlify compresses on its own and ignores them, so they only add to the upload.
