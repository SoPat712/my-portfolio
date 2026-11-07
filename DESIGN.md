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
- **Vim keys are a layer, not a requirement.** NORMAL / INSERT / COMMAND / SEARCH / HINT modes, `w` window commands, a `<Space>` leader with which-key, `f` link hints and a `:` command line. `:set novim` turns single-key shortcuts off (WCAG 2.1.4); CTRL-K and Esc always work.
- **Effects come from the setting, not decoration.** Windows slide into new tiles, workspaces slide sideways, and the portrait is ordered-dithered in the theme's ink. There are no gradients, glows or glass.

## Look

- **Type:** Fragment Mono for text, Martian Mono (variable width) for names and headings.
- **Colorschemes (rices):** oxide (default; wet concrete, rust, moss), paper (light), sodium (blue night, amber). Tokens are CSS custom properties on `:root[data-rice]` in `desktop.css`; `:colorscheme`, `wal` or the bar swatch switch them, and the choice is saved.
- **Wallpaper:** a 4px two-tone checker generated from the current rice, showing in the gaps between windows.
- **Phones (under 960px):** windows stack in one column, a project opens as a full sheet, and vim keys are off.

## Code map

- `src/lib/content.ts`: profile, projects, experience, skills, courses, achievements, saved repos.
- `src/lib/desktop/Desktop.svelte`: the markup, prerendered from content. `Window.svelte` is the window chrome; `Buffer.svelte` renders an nvim buffer.
- `src/lib/desktop/engine.ts`: behaviour (layout engine, focus, vim layer, terminal, launcher, boot). `startDesktop()` runs on mount and returns a cleanup function.
- `src/lib/desktop/vfs.ts`: the guest's home directory as text, shared by `cat`, `grep`, `tree` and the buffers.
- `src/routes/+page.server.ts`: reads the last five commits at build time for `git log`, and the site's address for link previews.
- `static/og.png`: the link-preview image, a 1200×630 screenshot of workspace 1. Retake it when workspace 1 changes.

Decisions made while building this, with how to undo each one, are in `docs/decisions.md`.
