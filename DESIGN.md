# Design: the desktop

The portfolio is a customized Linux desktop running a tiling window manager. The status bar's five workspaces are the sections, and each window is a small app that holds one kind of content.

| Workspace | Windows |
| --- | --- |
| 1 home | fetch (name, portrait, summary), terminal, now |
| 2 projects | files (all projects, filterable); each project opens in its own window, up to three |
| 3 experience | experience.md and skills.toml as read-only nvim buffers |
| 4 education | education (degree, courses), achievements.log, github (live repos) |
| 5 contact | contact (email, links, résumé), compose (opens a mail draft) |

## Principles

- **Real content only.** Everything comes from `src/lib/content.ts`. The terminal, grep, the launcher and the buffers are views of the same data, so nothing is invented for effect.
- **The bit never blocks the visitor.** `resume.pdf` is always in the bar, every window has a close button, and everything works with a mouse or a phone. The boot can be skipped with any key and doesn't play at all with reduced motion.
- **Vim keys are a layer, not a requirement.** NORMAL / INSERT / COMMAND / SEARCH / HINT modes, an item cursor that `h j k l` move through each window, `w` window commands and CTRL-hjkl (ALT on Windows and Linux) to move between them, a `<Space>` leader with which-key, `f` link hints and a `:` command line. `:set novim` turns single-key shortcuts off (WCAG 2.1.4); the launcher (⌘K, or CTRL-K off a Mac), the window keys and Esc always work.
- **Fast to get into.** The boot log and greeter are prerendered and played by a CSS timeline, so they start with the first paint instead of waiting for JavaScript. The app loads behind them and takes over; if it isn't ready when the timeline ends, the greeter holds on "Authenticating…". The stylesheet is inlined, the fonts are self-hosted and preloaded, and images are sized for how they're shown.
- **Effects come from the setting, not decoration.** Windows slide into new tiles, workspaces slide sideways, and the portrait is ordered-dithered in the theme's ink. There are no gradients, glows or glass.

## Look

- **Type:** Fragment Mono for text, Martian Mono (variable width) for names and headings. Both are self-hosted Latin subsets in `src/lib/fonts`.
- **Colorschemes (rices):** oxide (default; wet concrete, rust, moss), paper (light), sodium (blue night, amber). Tokens are CSS custom properties on `:root[data-rice]` in `desktop.css`; `:colorscheme`, `wal` or the bar swatch switch them, and the choice is saved.
- **Wallpaper:** a 4px two-tone checker generated from the current rice, showing in the gaps between windows.
- **Phones (under 960px):** windows stack in one column, a project opens as a full sheet, and vim keys are off.

## Code map

- `src/lib/content.ts`: profile, projects, experience, skills, courses, achievements, saved repos.
- `src/lib/desktop/Desktop.svelte`: the markup, prerendered from content. `Window.svelte` is the window chrome; `Buffer.svelte` renders an nvim buffer; `BootScreen.svelte` is the boot log, greeter and lock screen.
- `src/lib/desktop/engine.ts`: the window manager. Layout, focus, workspaces, files and project windows, buffers, the vim layer, launcher, link hints, and taking over the boot. `startDesktop()` runs on mount and returns a cleanup function.
- `src/lib/desktop/shell.ts`: the terminal and the command line's commands, man pages, completion and readline keys. It reaches the window manager only through `ShellHost`.
- `src/lib/desktop/boot.ts`: the boot log's lines and schedule. `desktop.css` plays them as a timeline under `:root[data-booting]`, which `app.html` sets before the first paint.
- `src/lib/desktop/compose.ts`, `dither.ts`, `fuzzy.ts`, `github.ts`: the compose form, the portrait dither, launcher matching, and the live repo list.
- `src/lib/desktop/shared.ts`: types, names and small DOM helpers used across the modules.
- `src/lib/desktop/vfs.ts`: the guest's home directory as text, shared by `cat`, `grep`, `tree` and the buffers.
- `src/routes/+page.server.ts`: reads the last five commits at build time for `git log`, and the site's address for link previews.
- `static/og.png`: the link-preview image, a 1200×630 screenshot of workspace 1. Retake it when workspace 1 changes.

Decisions made while building this, with how to undo each one, are in `docs/decisions.md`.
