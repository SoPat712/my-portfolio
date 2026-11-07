// The desktop's behaviour: tiling window manager, focus and workspaces, the vim layer, launcher, link hints, and the
// boot, logout and lock screens. Desktop.svelte renders the markup; startDesktop wires it up and returns a cleanup.
// The shell (shell.ts), compose form (compose.ts) and portrait dither (dither.ts) live in their own modules.
import { replaceState } from "$app/navigation";
import { PROFILE, PROJECTS, SORTED_PROJECTS, bySlug, sortProjects, type Category, type Project } from "$lib/content";
import { setupCompose } from "./compose";
import { drawDither } from "./dither";
import { fuzzy, highlight, type Match } from "./fuzzy";
import {
  $,
  $$,
  LAYOUTS,
  RICES,
  SYM,
  WS_NAMES,
  WS_ALIAS,
  clamp,
  ensureVisible,
  isLayout,
  isRice,
  later,
  openLink,
  pad2,
  session,
  store,
  type Commit,
  type Rect,
  type Rice,
  type Win,
  type WsState,
} from "./shared";
import { msgIO, setupShell } from "./shell";
import { BUFFERS, esc, type BufferId } from "./vfs";

export type DesktopOptions = { commits: Commit[] };

type RofiEntry = { label: string; tag: string; run: () => unknown };
type Hint = { el: HTMLElement; r: DOMRect; label: string; marker?: HTMLElement };

export function startDesktop(opts: DesktopOptions): () => void {
  const ac = new AbortController();
  const signal = ac.signal;
  const onDoc = <K extends keyof DocumentEventMap>(type: K, fn: (e: DocumentEventMap[K]) => void) =>
    document.addEventListener(type, fn, { signal });
  const onWin = <K extends keyof WindowEventMap>(type: K, fn: (e: WindowEventMap[K]) => void) =>
    window.addEventListener(type, fn, { signal });
  const every = (fn: () => void, ms: number) => {
    const id = window.setInterval(fn, ms);
    signal.addEventListener("abort", () => clearInterval(id));
  };
  const root = document.documentElement;
  const reduceMQ = matchMedia("(prefers-reduced-motion: reduce)");
  const deskMQ = matchMedia("(min-width: 960px)");
  const reduced = () => reduceMQ.matches;
  const desk = () => deskMQ.matches;
  const MFACT: Record<number, number> = { 1: 0.56, 2: 0.5, 3: 0.54, 4: 0.5, 5: 0.46 };

  // ---------- notifications ----------
  const notes = $("#notes");
  function notify(app: string, summary: string, body = "") {
    const n = document.createElement("div");
    n.className = "note-card";
    n.innerHTML = `<p class="note-app">${esc(app)}</p><p class="note-sum">${esc(summary)}</p>${body ? `<p class="note-body">${esc(body)}</p>` : ""}`;
    notes.prepend(n);
    $$(".note-card", notes)
      .slice(4)
      .forEach((x) => x.remove());
    let timer = 0;
    const dismiss = () => {
      clearTimeout(timer);
      if (reduced()) {
        n.remove();
        return;
      }
      n.classList.add("out");
      later(() => n.remove(), 200);
    };
    const arm = (ms: number) => {
      clearTimeout(timer);
      timer = later(dismiss, ms);
    };
    n.addEventListener("click", dismiss);
    n.addEventListener("mouseenter", () => clearTimeout(timer));
    n.addEventListener("mouseleave", () => arm(2500));
    arm(5000);
  }
  function openResume() {
    $("#resumeLink").click();
  }
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      notify("clipboard", `Copied ${PROFILE.email}`);
      return true;
    } catch {
      const r = document.createRange();
      r.selectNodeContents($("#mailAddr"));
      const s = getSelection()!;
      s.removeAllRanges();
      s.addRange(r);
      notify("clipboard", "Selected the address", "Press ⌘C or Ctrl+C to copy it.");
      return false;
    }
  }

  // ---------- rice ----------
  let rice: Rice = isRice(root.dataset.rice) ? root.dataset.rice : "oxide";
  const riceBtn = $("#riceBtn");
  function applyRice(name: string, announce: boolean) {
    if (!isRice(name)) return false;
    rice = name;
    root.dataset.rice = name;
    store.set("patra-rice", name);
    const cs = getComputedStyle(root);
    const a = cs.getPropertyValue("--wall-a").trim(),
      b = cs.getPropertyValue("--wall-b").trim();
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='4' height='4'><rect width='1' height='1' fill='${a}'/><rect x='2' y='2' width='1' height='1' fill='${b}'/></svg>`;
    root.style.setProperty("--wall-img", `url("data:image/svg+xml,${encodeURIComponent(svg)}")`);
    riceBtn.setAttribute("aria-label", `Color scheme: ${name}. Change color scheme`);
    riceBtn.title = `colorscheme: ${name}`;
    redrawPortrait();
    if (announce)
      notify(
        "wal",
        `Colorscheme: ${name}`,
        name === "paper" ? "A light rice. :colorscheme oxide returns to the default." : "",
      );
    return true;
  }
  const cycleRice = () => applyRice(RICES[(RICES.indexOf(rice) + 1) % RICES.length], true);
  riceBtn.addEventListener("click", cycleRice);

  // ---------- clock ----------
  const clockEl = $<HTMLTimeElement>("#clock");
  function tickClock() {
    const d = new Date();
    clockEl.textContent = `${d.toLocaleDateString("en-US", { weekday: "short" })} ${pad2(d.getDate())} ${d.toLocaleDateString("en-US", { month: "short" })}  ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
    clockEl.dateTime = d.toISOString();
  }
  tickClock();
  every(tickClock, 10000);

  // ---------- dithered portrait ----------
  const pf = $("#pf"),
    photo = $<HTMLImageElement>("#photo"),
    dither = $<HTMLCanvasElement>("#dither");
  function redrawPortrait() {
    const w = pf.getBoundingClientRect().width;
    if (!photo.naturalWidth || w < 10) return;
    const ink = getComputedStyle(root).getPropertyValue("--fg") || "#dcd8cb";
    if (!drawDither(dither, photo, Math.max(48, Math.round(w / 2)), ink, rice === "paper")) {
      pf.classList.add("plain");
      dither.hidden = true;
    }
  }
  pf.addEventListener("click", () => {
    const on = pf.getAttribute("aria-pressed") !== "true";
    pf.setAttribute("aria-pressed", on ? "true" : "false");
    pf.setAttribute(
      "aria-label",
      on
        ? "Photo of Josh Patra. Press to show the dithered portrait."
        : "Portrait of Josh Patra, dithered. Press to show the photo.",
    );
  });

  // ---------- window registry ----------
  const stage = $("#stage");
  const wsEls: Record<number, HTMLElement> = {},
    WS: Record<number, WsState> = {},
    DEFAULT: Record<number, string[]> = {},
    WIN: Record<string, Win> = {};
  let bufSeq = 0,
    zTop = 10,
    cur = 1;
  $$(".ws", stage).forEach((el) => {
    const n = Number(el.dataset.n!);
    wsEls[n] = el;
    const ids = $$(":scope > .win", el).map((w) => w.dataset.win!);
    DEFAULT[n] = ids.slice();
    WS[n] = { order: ids.slice(), layout: "tile", prev: "tile", mfact: MFACT[n], focus: ids[0] || null, float: {} };
  });
  $$(".ws > .win", stage).forEach((el) => {
    WIN[el.dataset.win!] = {
      id: el.dataset.win!,
      el,
      ws: Number(el.dataset.ws!),
      kind: "core",
      nr: ++bufSeq,
      label: el.dataset.label!,
    };
  });
  const CORE_IDS = Object.keys(WIN);
  const isOpen = (id: string) => !!WIN[id] && WS[WIN[id].ws].order.includes(id);
  const focusedId = () => WS[cur].focus;
  const focusedWin = () => {
    const id = focusedId();
    return id ? WIN[id] : null;
  };
  function appOf(w: Win | null | undefined) {
    if (!w) return "none";
    if (w.kind === "project") return "project";
    if (w.id === "files") return "files";
    if (BUFS[w.id]) return "buffer";
    if (w.id === "term") return "term";
    if (w.id === "compose") return "compose";
    return "generic";
  }
  const bodyOf = (w: Win | null | undefined) => (w ? w.el.querySelector<HTMLElement>(".win-body") : null);

  // ---------- layout engine ----------
  const barTitle = $("#barTitle"),
    layBtn = $("#layBtn");
  function areaOf(n: number): Rect {
    const el = wsEls[n],
      cs = getComputedStyle(el);
    const pl = parseFloat(cs.paddingLeft),
      pr = parseFloat(cs.paddingRight),
      pt = parseFloat(cs.paddingTop),
      pb = parseFloat(cs.paddingBottom);
    return { x: pl, y: pt, w: Math.max(200, el.clientWidth - pl - pr), h: Math.max(160, el.clientHeight - pt - pb) };
  }
  const GAP = 10;
  function cascade(A: Rect, i: number): Rect {
    const w = Math.min(Math.round(A.w * 0.58), 820),
      h = Math.min(Math.round(A.h * 0.74), 660);
    return { x: A.x + 24 + i * 40, y: A.y + 12 + i * 34, w, h };
  }
  function clampRect(r: Rect, A: Rect): Rect {
    const w = clamp(r.w, 280, A.w),
      h = clamp(r.h, 160, A.h);
    return { x: clamp(r.x, A.x, A.x + A.w - w), y: clamp(r.y, A.y, A.y + A.h - h), w, h };
  }
  function relayout(n: number, animate = true) {
    const st = WS[n],
      wsEl = wsEls[n];
    const ids = st.order;
    const empty = $(".ws-empty", wsEl),
      tabs = $(".tabs", wsEl),
      div = $(".mdiv", wsEl);
    empty.hidden = ids.length > 0;
    if (st.focus && !ids.includes(st.focus)) st.focus = ids[0] || null;
    if (!st.focus && ids.length) st.focus = ids[0];
    if (!desk()) {
      tabs.hidden = true;
      div.hidden = true;
      return;
    }
    const instant = !animate || reduced();
    if (instant) wsEl.classList.add("instant");
    const A = areaOf(n);
    const rects: Record<string, Rect> = {};
    tabs.hidden = !(st.layout === "monocle" && ids.length > 0);
    div.hidden = !(st.layout === "tile" && ids.length > 1);
    if (st.layout === "tile") {
      if (ids.length === 1) rects[ids[0]] = A;
      else if (ids.length > 1) {
        const mw = Math.round((A.w - GAP) * st.mfact);
        rects[ids[0]] = { x: A.x, y: A.y, w: mw, h: A.h };
        const k = ids.length - 1,
          sx = A.x + mw + GAP,
          sw = A.w - mw - GAP,
          sh = (A.h - GAP * (k - 1)) / k;
        ids.slice(1).forEach((id, i) => {
          rects[id] = { x: sx, y: A.y + i * (sh + GAP), w: sw, h: sh };
        });
        div.style.left = `${A.x + mw + GAP / 2 - 5}px`;
        div.style.top = `${A.y}px`;
        div.style.height = `${A.h}px`;
        div.setAttribute("aria-valuenow", String(Math.round(st.mfact * 100)));
      }
    } else if (st.layout === "monocle") {
      const TH = 28;
      tabs.style.left = `${A.x}px`;
      tabs.style.top = `${A.y}px`;
      tabs.style.width = `${A.w}px`;
      tabs.innerHTML = ids
        .map(
          (id) =>
            `<button type="button" data-tab="${esc(id)}" aria-pressed="${id === st.focus}">${esc(WIN[id].label)}</button>`,
        )
        .join("");
      const r = { x: A.x, y: A.y + TH + 6, w: A.w, h: A.h - TH - 6 };
      ids.forEach((id) => {
        rects[id] = r;
      });
    } else {
      ids.forEach((id, i) => {
        if (!st.float[id]) st.float[id] = cascade(A, i);
        st.float[id] = clampRect(st.float[id], A);
        rects[id] = st.float[id];
      });
    }
    ids.forEach((id) => {
      const w = WIN[id],
        el = w.el,
        r = rects[id];
      el.style.left = `${r.x}px`;
      el.style.top = `${r.y}px`;
      el.style.width = `${r.w}px`;
      el.style.height = `${r.h}px`;
      const buried = st.layout === "monocle" && id !== st.focus;
      el.classList.toggle("buried", buried);
      el.inert = buried;
      if (st.layout !== "float") el.style.zIndex = "";
    });
    wsEl.dataset.layout = st.layout;
    if (instant) {
      void wsEl.offsetWidth;
      wsEl.classList.remove("instant");
    }
  }
  const relayoutAll = (animate: boolean) => {
    for (let n = 1; n <= 5; n++) relayout(n, animate);
  };
  function syncLayBtn() {
    const l = WS[cur].layout;
    $(".lay-sym", layBtn).textContent = SYM[l];
    $(".lay-name", layBtn).textContent = l;
    layBtn.setAttribute("aria-label", `Layout: ${l}. Change layout`);
    layBtn.title = `layout: ${l}`;
  }
  function setLayout(name: string, n = cur) {
    if (!isLayout(name)) return false;
    const st = WS[n];
    if (st.layout !== "monocle") st.prev = st.layout;
    st.layout = name;
    relayout(n, true);
    if (n === cur) {
      syncLayBtn();
      refreshFocusRing();
    }
    return true;
  }
  const cycleLayout = () => setLayout(LAYOUTS[(LAYOUTS.indexOf(WS[cur].layout) + 1) % LAYOUTS.length]);
  function toggleMonocle() {
    const st = WS[cur];
    if (st.layout === "monocle") setLayout(st.prev === "monocle" ? "tile" : st.prev);
    else setLayout("monocle");
  }
  layBtn.addEventListener("click", cycleLayout);
  function nudge(d: number) {
    const st = WS[cur];
    if (st.layout !== "tile") {
      message("mfact only applies to the tile layout ([]=)");
      return;
    }
    st.mfact = clamp(st.mfact + d, 0.2, 0.8);
    relayout(cur, true);
  }
  function resetMfact() {
    WS[cur].mfact = MFACT[cur];
    relayout(cur, true);
  }
  function updateOcc() {
    $$(".ws-nav button").forEach((b) => b.classList.toggle("occ", WS[Number(b.dataset.ws!)].order.length > 0));
  }
  function spawnStagger(n: number) {
    WS[n].order.forEach((id, i) => WIN[id].el.style.setProperty("--i", String(i)));
  }

  // divider drag + keys
  $$(".mdiv").forEach((div) => {
    const n = Number(div.closest<HTMLElement>(".ws")!.dataset.n);
    div.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      div.setPointerCapture(e.pointerId);
      div.classList.add("active");
      wsEls[n].classList.add("dragging");
      const move = (ev: PointerEvent) => {
        const A = areaOf(n),
          rect = wsEls[n].getBoundingClientRect();
        WS[n].mfact = clamp((ev.clientX - rect.left - A.x - GAP / 2) / (A.w - GAP), 0.2, 0.8);
        relayout(n, false);
      };
      const up = () => {
        div.classList.remove("active");
        wsEls[n].classList.remove("dragging");
        div.removeEventListener("pointermove", move);
        div.removeEventListener("pointerup", up);
        div.removeEventListener("pointercancel", up);
      };
      div.addEventListener("pointermove", move);
      div.addEventListener("pointerup", up);
      div.addEventListener("pointercancel", up);
    });
    div.addEventListener("keydown", (e) => {
      const d = ({ ArrowLeft: -0.02, ArrowRight: 0.02, Home: -1, End: 1 } as Record<string, number>)[e.key];
      if (d === undefined) return;
      e.preventDefault();
      WS[n].mfact = clamp(Math.abs(d) === 1 ? (d < 0 ? 0.2 : 0.8) : WS[n].mfact + d, 0.2, 0.8);
      relayout(n, true);
    });
  });

  // float: drag by title bar, resize by grip
  stage.addEventListener("pointerdown", (e) => {
    const winEl = (e.target as HTMLElement).closest<HTMLElement>(".ws > .win");
    if (!winEl) return;
    const w = WIN[winEl.dataset.win!];
    if (!w) return;
    focusWin(w.id, { raise: true });
    const st = WS[w.ws];
    if (!desk() || st.layout !== "float" || e.button !== 0) return;
    const grip = (e.target as HTMLElement).closest<HTMLElement>(".grip");
    const bar = (e.target as HTMLElement).closest<HTMLElement>(".win-bar");
    if (!grip && (!bar || (e.target as HTMLElement).closest<HTMLElement>("button, a"))) return;
    e.preventDefault();
    const A = areaOf(w.ws);
    const start = { ...(st.float[w.id] || cascade(A, 0)) },
      sx = e.clientX,
      sy = e.clientY;
    wsEls[w.ws].classList.add("dragging");
    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - sx,
        dy = ev.clientY - sy;
      const r = grip ? { ...start, w: start.w + dx, h: start.h + dy } : { ...start, x: start.x + dx, y: start.y + dy };
      st.float[w.id] = clampRect(r, A);
      const c = st.float[w.id];
      winEl.style.left = `${c.x}px`;
      winEl.style.top = `${c.y}px`;
      winEl.style.width = `${c.w}px`;
      winEl.style.height = `${c.h}px`;
    };
    const up = () => {
      wsEls[w.ws].classList.remove("dragging");
      removeEventListener("pointermove", move);
      removeEventListener("pointerup", up);
      removeEventListener("pointercancel", up);
    };
    addEventListener("pointermove", move);
    addEventListener("pointerup", up);
    addEventListener("pointercancel", up);
  });
  stage.addEventListener("click", (e) => {
    const t = (e.target as HTMLElement).closest<HTMLElement>("[data-tab]");
    if (t) focusWin(t.dataset.tab!, { dom: true });
  });

  // ---------- focus ----------
  function refreshFocusRing() {
    $$(".win.focused").forEach((x) => x.classList.remove("focused"));
    const w = focusedWin();
    if (w) w.el.classList.add("focused");
    barTitle.textContent = w ? w.el.dataset.title! || w.label : "";
    updateAllStatus();
    markRows();
  }
  function focusWin(id: string, o: { dom?: boolean; raise?: boolean; target?: HTMLElement | null } = {}) {
    const w = WIN[id];
    if (!w) return;
    const st = WS[w.ws];
    const changed = st.focus !== id;
    st.focus = id;
    if (w.ws !== cur) return;
    if (changed || !w.el.classList.contains("focused")) refreshFocusRing();
    if (st.layout === "monocle" && changed) relayout(w.ws, true);
    if (st.layout === "float" && (o.raise || changed)) w.el.style.zIndex = String(++zTop);
    if (w.kind === "project") setHash(w.slug!);
    else if (w.ws === 2 && changed) setHash("projects");
    if (o.dom) {
      const target = o.target || bodyOf(w);
      target && target.focus({ preventScroll: true });
    }
  }
  stage.addEventListener("pointerover", (e) => {
    if (e.pointerType !== "mouse") return;
    const winEl = (e.target as HTMLElement).closest<HTMLElement>(".ws > .win");
    if (!winEl || WS[cur].layout === "float") return;
    const id = winEl.dataset.win!;
    if (WS[cur].focus !== id) focusWin(id);
  });
  stage.addEventListener("focusin", (e) => {
    const winEl = (e.target as HTMLElement).closest<HTMLElement>(".ws > .win");
    if (winEl && WS[cur].focus !== winEl.dataset.win!) focusWin(winEl.dataset.win!);
  });
  function moveFocus(dir: string) {
    const st = WS[cur],
      ids = st.order;
    if (!ids.length) return;
    if (!st.focus) {
      focusWin(ids[0], { dom: true });
      return;
    }
    if (st.layout === "monocle") {
      const i = ids.indexOf(st.focus),
        d = dir === "l" || dir === "j" ? 1 : -1;
      focusWin(ids[(i + d + ids.length) % ids.length], { dom: true });
      return;
    }
    const from = WIN[st.focus].el.getBoundingClientRect();
    const cx = from.left + from.width / 2,
      cy = from.top + from.height / 2;
    let best: string | null = null,
      bestD = Infinity;
    ids.forEach((id) => {
      if (id === st.focus) return;
      const r = WIN[id].el.getBoundingClientRect();
      const dx = r.left + r.width / 2 - cx,
        dy = r.top + r.height / 2 - cy;
      const ok = dir === "h" ? dx < -4 : dir === "l" ? dx > 4 : dir === "k" ? dy < -4 : dy > 4;
      if (!ok) return;
      const d = dir === "h" || dir === "l" ? Math.abs(dx) + Math.abs(dy) * 1.5 : Math.abs(dy) + Math.abs(dx) * 1.5;
      if (d < bestD) {
        bestD = d;
        best = id;
      }
    });
    if (best) focusWin(best, { dom: true, raise: true });
  }
  function cycleWin(d: number) {
    const ids = WS[cur].order;
    if (!ids.length) return;
    const i = Math.max(0, ids.indexOf(WS[cur].focus ?? ""));
    focusWin(ids[(i + d + ids.length) % ids.length], { dom: true, raise: true });
  }
  function swapMaster(which: "H" | "L") {
    const st = WS[cur],
      o = st.order;
    if (o.length < 2 || !st.focus) return;
    const i = o.indexOf(st.focus);
    if (which === "H" && i > 0) [o[0], o[i]] = [o[i], o[0]];
    else if (which === "L" && i === 0) [o[0], o[1]] = [o[1], o[0]];
    else return;
    relayout(cur, true);
  }

  // ---------- open / close ----------
  function insertDefault(n: number, id: string) {
    const o = WS[n].order,
      def = DEFAULT[n];
    const di = def.indexOf(id);
    if (di < 0) {
      o.push(id);
      return;
    }
    let at = o.length;
    for (let i = 0; i < o.length; i++) {
      const dj = def.indexOf(o[i]);
      if (dj < 0 || dj > di) {
        at = i;
        break;
      }
    }
    o.splice(at, 0, id);
  }
  function showNew(el: HTMLElement, n: number) {
    el.hidden = false;
    el.inert = false;
    if (desk() && !reduced()) el.classList.add("fresh", "spawning");
    relayout(n, true);
    if (el.classList.contains("fresh"))
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.remove("fresh", "spawning")));
    updateOcc();
  }
  function launch(id: string, o: { dom?: boolean; target?: HTMLElement | null } = {}) {
    if (id === "keys") {
      openKeys();
      return true;
    }
    const w = WIN[id];
    if (!w) return false;
    if (cur !== w.ws) switchWs(w.ws);
    if (!isOpen(id)) {
      insertDefault(w.ws, id);
      showNew(w.el, w.ws);
      if (id === "exp" || id === "skills" || id === "ach") later(() => updateStatus(BUFS[id]), 50);
    }
    focusWin(id, { dom: o.dom !== false, raise: true, target: o.target });
    return true;
  }
  function closeWin(id: string, o: { instant?: boolean; dom?: boolean; focusRow?: string } = {}) {
    const w = WIN[id];
    if (!w) return false;
    const n = w.ws,
      st = WS[n],
      i = st.order.indexOf(id);
    if (i < 0) return false;
    const hadFocus = w.el.contains(document.activeElement);
    st.order.splice(i, 1);
    delete st.float[id];
    if (st.focus === id) st.focus = st.order[Math.min(i, st.order.length - 1)] || null;
    const el = w.el;
    const finish = () => {
      el.hidden = true;
      el.classList.remove("closing");
      if (w.kind === "project") el.remove();
    };
    el.inert = true;
    if (desk() && !reduced() && !o.instant) {
      el.classList.add("closing");
      later(finish, 200);
    } else finish();
    if (w.kind === "project") {
      delete WIN[id];
      const k = pOpen.indexOf(w.slug!);
      if (k >= 0) pOpen.splice(k, 1);
      if (!pOpen.length) document.body.classList.remove("locked");
    }
    relayout(n, true);
    updateOcc();
    if (n === cur) {
      refreshFocusRing();
      if (w.kind === "project")
        setHash(st.focus && WIN[st.focus] && WIN[st.focus].kind === "project" ? WIN[st.focus].slug! : "projects");
      if (hadFocus || o.dom) {
        if (o.focusRow) {
          const row = fmList.querySelector<HTMLElement>(`.row[data-slug="${o.focusRow}"]`);
          if (row && isOpen("files")) {
            focusWin("files");
            row.focus({ preventScroll: true });
            ensureVisible(bodyOf(WIN.files), row, 40);
            return true;
          }
        }
        const nw = focusedWin();
        if (nw) focusWin(nw.id, { dom: true });
        else document.body.focus();
      }
    }
    return true;
  }
  function closeAllInWs() {
    const ids = WS[cur].order.slice();
    ids.forEach((id) => closeWin(id, { instant: ids.length > 4 }));
  }
  stage.addEventListener("click", (e) => {
    const x = (e.target as HTMLElement).closest<HTMLElement>("[data-close]");
    if (x) {
      const winEl = x.closest<HTMLElement>(".win");
      if (winEl) closeWin(winEl.dataset.win!, { dom: true });
    }
  });

  // ---------- workspaces ----------
  const wsBtns = $$(".ws-nav button");
  let leaveTimer = 0;
  // SvelteKit keeps its router state in history entries, so the hash goes through its replaceState.
  function setHash(name: string) {
    try {
      replaceState(`#${name}`, {});
    } catch {}
  }
  function switchWs(target: number | string, o: { focus?: boolean; instant?: boolean } = {}) {
    const n = Number(target);
    if (!wsEls[n]) return;
    if (n === cur) {
      if (o.focus) {
        const w = focusedWin();
        if (w) focusWin(w.id, { dom: true });
      }
      return;
    }
    const from = wsEls[cur],
      to = wsEls[n],
      dir = n > cur ? 1 : -1;
    const hadFocusInside = from.contains(document.activeElement);
    clearTimeout(leaveTimer);
    $$(".ws.leaving").forEach((w) => {
      w.classList.remove("leaving", "active");
      w.style.transform = "";
      w.style.transition = "";
    });
    relayout(n, false);
    if (!desk() || reduced() || o.instant) {
      from.classList.remove("active");
      to.classList.add("active");
      if (!desk() && !o.instant) window.scrollTo(0, 0);
    } else {
      to.style.transition = "none";
      to.style.transform = `translateX(${dir * 100}%)`;
      to.classList.add("active");
      void to.offsetWidth;
      to.style.transition = "";
      to.style.transform = "";
      from.classList.add("leaving");
      from.style.transform = `translateX(${-dir * 100}%)`;
      leaveTimer = later(() => {
        from.classList.remove("leaving", "active");
        from.style.transform = "";
      }, 360);
    }
    from.inert = true;
    to.inert = false;
    cur = n;
    wsBtns.forEach((b) => b.setAttribute("aria-current", Number(b.dataset.ws!) === n ? "true" : "false"));
    syncLayBtn();
    refreshFocusRing();
    const w = focusedWin();
    if (w && (o.focus || hadFocusInside)) focusWin(w.id, { dom: true });
    else if (hadFocusInside) document.body.focus();
    if (n === 2 && w && w.kind === "project") setHash(w.slug!);
    else setHash(WS_NAMES[n]);
    if (!desk())
      wsBtns[n - 1].scrollIntoView({ block: "nearest", inline: "nearest", behavior: reduced() ? "auto" : "smooth" });
  }
  const wsStep = (d: number) => switchWs(((cur - 1 + d + 5) % 5) + 1, { focus: true });
  wsBtns.forEach((b) => b.addEventListener("click", () => switchWs(b.dataset.ws!)));
  onDoc("click", (e) => {
    const g = (e.target as HTMLElement).closest<HTMLElement>("[data-go]");
    if (g) {
      switchWs(g.dataset.go!, { focus: true });
      return;
    }
    const o = (e.target as HTMLElement).closest<HTMLElement>("[data-open]");
    if (o) openProject(o.dataset.open!);
  });

  // ---------- file manager ----------
  const fmList = $("#fmList"),
    filtersEl = $("#filters"),
    fmCount = $("#fmCount"),
    fmPath = $("#fmPath");
  let filter: "All" | Category = "All",
    fmSel = 0;
  const matches = (p: Project) => filter === "All" || (p.cats as string[]).includes(filter);
  const visible = () => SORTED_PROJECTS.filter(matches);
  const allRows = () => $$(".row", fmList);
  const visRows = () => allRows().filter((r) => !r.parentElement!.hidden);
  function renderFilters() {
    $$("button[data-cat]", filtersEl).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.cat === filter)));
  }
  function renderList() {
    allRows().forEach((r) => {
      r.parentElement!.hidden = !matches(bySlug[r.dataset.slug!]);
    });
    const rows = visRows();
    fmSel = clamp(fmSel, 0, Math.max(0, rows.length - 1));
    rows.forEach((r, j) => {
      r.classList.toggle("sel", j === fmSel);
      r.tabIndex = j === fmSel ? 0 : -1;
    });
    fmCount.textContent = `${rows.length} item${rows.length === 1 ? "" : "s"}${filter !== "All" ? `, filter: ${filter.toLowerCase()}` : ""}`;
    markRows();
  }
  function markRows() {
    const fid = focusedId();
    visRows().forEach((r) => {
      const s = r.dataset.slug!;
      r.classList.toggle("is-open", !!WIN[`p:${s}`]);
      r.setAttribute("aria-current", fid === `p:${s}` ? "true" : "false");
    });
  }
  function fmSelect(i: number, focus = true) {
    const rows = visRows();
    if (!rows.length) return;
    fmSel = clamp(i, 0, rows.length - 1);
    rows.forEach((r, j) => {
      r.classList.toggle("sel", j === fmSel);
      r.tabIndex = j === fmSel ? 0 : -1;
    });
    const row = rows[fmSel];
    fmPath.textContent = `~/projects/${row.dataset.slug!}`;
    if (focus) {
      row.focus({ preventScroll: true });
      ensureVisible(bodyOf(WIN.files), row, 50);
    }
  }
  const fmStep = (d: number) => fmSelect(fmSel + d);
  function fmOpenSel() {
    const r = visRows()[fmSel];
    if (r) openProject(r.dataset.slug!);
  }
  filtersEl.addEventListener("click", (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>("button[data-cat]");
    if (!b || b.dataset.cat! === filter) return;
    filter = b.dataset.cat as "All" | Category;
    fmSel = 0;
    renderFilters();
    renderList();
  });
  fmList.addEventListener("click", (e) => {
    const r = (e.target as HTMLElement).closest<HTMLElement>(".row");
    if (!r) return;
    fmSelect(visRows().indexOf(r), false);
    openProject(r.dataset.slug!);
  });
  fmList.addEventListener("keydown", (e) => {
    const rows = visRows(),
      i = rows.indexOf(document.activeElement as HTMLElement);
    if (i < 0) return;
    const j = ({ ArrowDown: i + 1, ArrowUp: i - 1, Home: 0, End: rows.length - 1 } as Record<string, number>)[e.key];
    if (j !== undefined) {
      e.preventDefault();
      fmSelect(j);
      return;
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      fmSelect(i, false);
      fmOpenSel();
    }
  });
  fmList.addEventListener("focusin", (e) => {
    const r = (e.target as HTMLElement).closest<HTMLElement>(".row");
    if (r) {
      const rows = visRows();
      if (rows.indexOf(r) !== fmSel) fmSelect(rows.indexOf(r), false);
      fmPath.textContent = `~/projects/${r.dataset.slug!}`;
    }
  });
  renderFilters();
  renderList();

  // ---------- project windows ----------
  const pOpen: string[] = [];
  let pwSeq = 0;
  function fillProject(el: HTMLElement, p: Project) {
    const tile = $(".d-tile", el);
    tile.className = "tile d-tile" + (p.fit === "contain" ? " contain" : "");
    tile.style.setProperty("--tile", p.tile);
    tile.style.setProperty("--pad", p.pad || "20%");
    $<HTMLImageElement>("img", tile).src = p.img;
    $(".d-title", el).textContent = p.name;
    $(".d-cats", el).textContent = p.cats.map((c) => c.toLowerCase()).join(" / ");
    $(".d-desc", el).textContent = p.description;
    $(".d-high", el).innerHTML = p.highlights.map((h) => `<li>${esc(h)}</li>`).join("");
    $(".d-stack", el).innerHTML = p.stack.map((s) => `<li>${esc(s)}</li>`).join("");
    $<HTMLAnchorElement>(".d-repo", el).href = p.link;
    $(".d-url", el).textContent = p.link.replace(/^https:\/\//, "");
    $(".win-t", el).textContent = p.slug;
    $(".x", el).setAttribute("aria-label", `Close ${p.name} window`);
    el.dataset.title = `${p.slug}: ~/projects`;
    el.dataset.win = `p:${p.slug}`;
    const list = visible().some((x) => x.slug === p.slug) ? visible() : sortProjects(PROJECTS);
    const i = list.findIndex((x) => x.slug === p.slug);
    const prev = list[(i - 1 + list.length) % list.length],
      next = list[(i + 1) % list.length];
    const dp = $(".d-prev", el),
      dn = $(".d-next", el);
    dp.textContent = `← ${prev.slug}`;
    dp.dataset.slug = prev.slug;
    dn.textContent = `${next.slug} →`;
    dn.dataset.slug = next.slug;
    $(".win-body", el).scrollTop = 0;
  }
  function createProjectWin(p: Project) {
    const el = document.createElement("article");
    const tid = `pw-${++pwSeq}`;
    el.className = "win pwin";
    el.dataset.ws = "2";
    el.setAttribute("aria-labelledby", tid);
    el.innerHTML = `
      <div class="win-bar"><span class="win-t"></span><span class="win-i">~/projects</span><button class="x" type="button" data-close>×</button></div>
      <div class="win-body" tabindex="-1"><div class="d-in">
        <div class="d-head"><div class="tile d-tile"><img alt=""></div><div><h2 class="d-title" id="${tid}"></h2><p class="d-cats"></p></div></div>
        <p class="d-desc"></p>
        <h3 class="sub"><span aria-hidden="true">## </span>features</h3><ul class="ticks d-high"></ul>
        <h3 class="sub"><span aria-hidden="true">## </span>stack</h3><ul class="chips d-stack"></ul>
        <div class="d-cta"><a class="btn d-repo" href="#" target="_blank" rel="noopener noreferrer">view repository ↗</a><span class="d-url"></span></div>
        <div class="d-nav"><button type="button" class="d-prev"></button><button type="button" class="d-next"></button></div>
      </div></div>
      <span class="grip" aria-hidden="true"></span>`;
    fillProject(el, p);
    el.addEventListener("click", (e) => {
      const b = (e.target as HTMLElement).closest<HTMLElement>(".d-prev, .d-next");
      if (b) swapProject(el, b.dataset.slug!);
    });
    return el;
  }
  function openProject(slug: string, o: { instant?: boolean } = {}) {
    const p = bySlug[slug];
    if (!p) return false;
    if (cur !== 2) switchWs(2, { instant: !!o.instant });
    const id = `p:${slug}`;
    if (WIN[id]) {
      focusWin(id, { dom: true, raise: true });
      return true;
    }
    if (!desk()) pOpen.slice().forEach((s) => closeWin(`p:${s}`, { instant: true }));
    else if (pOpen.length >= 3) {
      const old = pOpen[0];
      closeWin(`p:${old}`);
      notify(
        "patra-wm",
        `Closed ${bySlug[old].name}`,
        "Up to three project windows stay open, so the oldest one closed.",
      );
    }
    const el = createProjectWin(p);
    wsEls[2].appendChild(el);
    WIN[id] = { id, el, ws: 2, kind: "project", slug, nr: ++bufSeq, label: slug };
    pOpen.push(slug);
    WS[2].order.push(id);
    showNew(el, 2);
    if (!desk()) document.body.classList.add("locked");
    focusWin(id, { dom: !o.instant, raise: true });
    markRows();
    return true;
  }
  function swapProject(el: HTMLElement, toSlug: string) {
    const oldId = el.dataset.win!;
    if (WIN[`p:${toSlug}`]) {
      focusWin(`p:${toSlug}`, { dom: true, raise: true });
      return;
    }
    const w = WIN[oldId],
      nid = `p:${toSlug}`,
      st = WS[2];
    delete WIN[oldId];
    WIN[nid] = w;
    w.id = nid;
    w.slug = toSlug;
    w.label = toSlug;
    st.order[st.order.indexOf(oldId)] = nid;
    if (st.float[oldId]) {
      st.float[nid] = st.float[oldId];
      delete st.float[oldId];
    }
    if (st.focus === oldId) st.focus = nid;
    const k = pOpen.indexOf(oldId.slice(2));
    if (k >= 0) pOpen[k] = toSlug;
    fillProject(el, bySlug[toSlug]);
    const dIn = $(".d-in", el);
    if (!reduced()) {
      dIn.classList.remove("swap");
      void dIn.offsetWidth;
      dIn.classList.add("swap");
    }
    if (st.layout === "monocle") relayout(2, false);
    refreshFocusRing();
    setHash(toSlug);
  }
  function stepProject(w: Win, d: number) {
    const list = visible().some((x) => x.slug === w.slug) ? visible() : sortProjects(PROJECTS);
    const i = list.findIndex((x) => x.slug === w.slug);
    swapProject(w.el, list[(i + d + list.length) % list.length].slug);
  }
  function backToList(w: Win) {
    if (!isOpen("files")) {
      launch("files");
    }
    const rows = visRows(),
      i = rows.findIndex((r) => r.dataset.slug! === w.slug);
    focusWin("files");
    fmSelect(i >= 0 ? i : fmSel);
  }

  // ---------- nvim-style buffers ----------
  type Buf = { id: string; name: string; body: HTMLElement; status: HTMLElement; lines: HTMLElement[]; cur: number };
  const BUFS: Record<string, Buf> = {};
  function makeBuffer(id: BufferId) {
    const w = WIN[id],
      body = bodyOf(w)!;
    const B: Buf = { id, name: BUFFERS[id].name, body, status: $(".buf-status", w.el), lines: $$(".ln", body), cur: 0 };
    BUFS[id] = B;
    body.addEventListener("click", (e) => {
      const t = e.target as HTMLElement,
        ln = t.closest<HTMLElement>(".ln");
      if (ln && !t.closest("button, a")) setCur(B, Number(ln.dataset.i), false);
    });
    body.addEventListener("scroll", () => updateStatus(B), { passive: true });
    renderGutter(B);
    updateStatus(B);
  }
  function renderGutter(B: Buf) {
    B.lines.forEach((ln, i) => {
      ln.firstElementChild!.textContent = i === B.cur ? String(i + 1) : String(Math.abs(i - B.cur));
      ln.classList.toggle("cur", i === B.cur);
    });
  }
  function updateStatus(B: Buf | undefined) {
    if (!B) return;
    const w = WIN[B.id];
    const active = w.ws === cur && WS[cur].focus === B.id;
    const b = B.body,
      max = b.scrollHeight - b.clientHeight;
    const pct =
      max <= 1
        ? "All"
        : b.scrollTop <= 1
          ? "Top"
          : b.scrollTop >= max - 1
            ? "Bot"
            : `${Math.round((b.scrollTop / max) * 100)}%`;
    B.status.classList.toggle("active", active);
    B.status.dataset.mode = mode.toLowerCase();
    B.status.innerHTML = `<span class="bs-mode">${esc(vimOn ? mode : "NORMAL")}</span><span class="bs-file">${esc(B.name)} <span class="ro">[RO]</span></span><span class="bs-sp"></span><span class="bs-pos">${B.cur + 1}:1</span><span class="bs-pct">${pct}</span>`;
  }
  const updateAllStatus = () => Object.values(BUFS).forEach(updateStatus);
  function setCur(B: Buf, i: number, scroll = true) {
    B.cur = clamp(i, 0, B.lines.length - 1);
    renderGutter(B);
    if (scroll) ensureVisible(B.body, B.lines[B.cur], 28);
    updateStatus(B);
  }
  function bufHalf(B: Buf, d: number) {
    const lh = B.lines[0].getBoundingClientRect().height || 22;
    const n = Math.max(1, Math.floor(B.body.clientHeight / lh / 2));
    B.body.scrollTop += d * n * lh;
    setCur(B, B.cur + d * n);
  }

  // ---------- generic window motions ----------
  const canScroll = (b: HTMLElement | null, d: number): b is HTMLElement =>
    !!b && (d > 0 ? b.scrollTop < b.scrollHeight - b.clientHeight - 1 : b.scrollTop > 0);
  function goEdge(w: Win | null, top: boolean) {
    if (!w) return;
    const app = appOf(w);
    if (app === "files") {
      fmSelect(top ? 0 : PROJECTS.length);
      return;
    }
    if (app === "buffer") {
      setCur(BUFS[w.id], top ? 0 : Infinity);
      return;
    }
    const b = bodyOf(w);
    if (b) b.scrollTo({ top: top ? 0 : b.scrollHeight, behavior: reduced() ? "auto" : "smooth" });
  }
  function halfPage(d: number) {
    const w = focusedWin();
    if (!w) return;
    const app = appOf(w);
    if (app === "buffer") {
      bufHalf(BUFS[w.id], d);
      return;
    }
    if (app === "files") {
      fmStep(d * 5);
      return;
    }
    const b = bodyOf(w);
    if (b) b.scrollBy({ top: d * b.clientHeight * 0.5, behavior: reduced() ? "auto" : "smooth" });
  }
  function hjkl(k: string, w: Win | null) {
    const app = appOf(w);
    if (app === "files" && (k === "j" || k === "k")) {
      fmStep(k === "j" ? 1 : -1);
      return;
    }
    if (app === "files" && k === "l") {
      fmOpenSel();
      return;
    }
    if (app === "project" && k === "h") {
      backToList(w!);
      return;
    }
    if (app === "buffer" && (k === "j" || k === "k")) {
      const B = BUFS[w!.id];
      setCur(B, B.cur + (k === "j" ? 1 : -1));
      return;
    }
    if ((k === "j" || k === "k") && w) {
      const b = bodyOf(w),
        d = k === "j" ? 1 : -1;
      if (canScroll(b, d)) {
        b.scrollBy({ top: d * 66 });
        return;
      }
    }
    moveFocus(k);
  }
  function focusInput(w: Win) {
    const app = appOf(w);
    if (app === "term") {
      shell.termIn.focus({ preventScroll: true });
      return;
    }
    if (app === "compose") {
      const f =
        ["f-name", "f-email", "f-msg"]
          .map((x) => document.getElementById(x) as HTMLInputElement)
          .find((el) => !el.value.trim()) || $("#f-name");
      f.focus({ preventScroll: true });
      return;
    }
    if (app === "buffer") {
      message("E21: Cannot make changes, 'modifiable' is off", "err");
      return;
    }
    if (app === "files") {
      message("files has no text input; j k move, l opens");
      return;
    }
    const alt = WS[cur].order.map((id) => WIN[id]).find((x) => x && (appOf(x) === "term" || appOf(x) === "compose"));
    if (alt) {
      focusWin(alt.id, { dom: true });
      focusInput(alt);
      return;
    }
    message("no text input on this workspace; press : for the command line");
  }

  // ---------- shell (terminal window and the : command line's fallback) ----------
  // Wrapped in arrows so the host can be built here, before the const functions further down are initialised.
  const shell = setupShell({
    WIN,
    WS,
    commits: opts.commits,
    cur: () => cur,
    rice: () => rice,
    desk,
    isOpen: (id) => isOpen(id),
    launch: (id) => launch(id),
    closeWin: (id, o) => closeWin(id, o),
    openProject: (slug) => openProject(slug),
    switchWs: (n, o) => switchWs(n, o),
    openKeys: (topic) => openKeys(topic),
    openRofi: () => openRofi(),
    runBoot: (kind) => runBoot(kind),
    cycleLayout: () => cycleLayout(),
    setLayout: (name) => setLayout(name),
    applyRice: (name, announce) => applyRice(name, announce),
    openResume: () => openResume(),
    copyEmail: () => copyEmail(),
  });

  // ---------- command-line messages (shared by :, i, and errors) ----------
  const cmdl = $("#cmdl"),
    cmdMsg = $("#cmdMsg"),
    cmdForm = $("#cmdForm"),
    cmdIn = $<HTMLInputElement>("#cmdIn");
  let msgTimer = 0,
    msgSticky = false;
  function message(text: string, kind?: "err") {
    clearTimeout(msgTimer);
    cmdMsg.className = `cmd-msg${kind === "err" ? " err" : ""}`;
    cmdMsg.textContent = text;
    cmdMsg.hidden = false;
    cmdl.hidden = false;
    msgSticky = false;
    if (cmdForm.hidden) msgTimer = later(hideMessage, 4200);
  }
  function messageLines(nodes: HTMLElement[]) {
    clearTimeout(msgTimer);
    cmdMsg.className = "cmd-msg";
    cmdMsg.textContent = "";
    nodes.forEach((n) => cmdMsg.append(n));
    if (nodes.length > 1) {
      const more = document.createElement("div");
      more.className = "more";
      more.textContent = "Press any key to continue";
      cmdMsg.append(more);
      msgSticky = true;
    } else {
      msgSticky = false;
      msgTimer = later(hideMessage, 4200);
    }
    cmdMsg.hidden = false;
    cmdl.hidden = false;
  }
  function hideMessage() {
    clearTimeout(msgTimer);
    cmdMsg.hidden = true;
    msgSticky = false;
    if (cmdForm.hidden) cmdl.hidden = true;
  }
  const msgVisible = () => !cmdMsg.hidden;
  cmdMsg.addEventListener("click", hideMessage);
  onDoc("pointerdown", (e) => {
    if (msgSticky && !(e.target as HTMLElement).closest<HTMLElement>("#cmdl")) hideMessage();
  });

  // ---------- ex command line ----------
  const exHist: string[] = [];
  let exPos = -1,
    cmdReturn: Element | null = null;
  const cmdOpen = () => !cmdForm.hidden;
  function openCmd(prefill = "") {
    if (cmdOpen()) {
      cmdIn.focus();
      return;
    }
    cmdReturn = document.activeElement;
    hideMessage();
    cmdl.hidden = false;
    cmdForm.hidden = false;
    cmdIn.value = prefill;
    exPos = -1;
    cmdIn.focus({ preventScroll: true });
    syncMode();
  }
  function restoreFocus(el: Element | null) {
    if (
      el instanceof HTMLElement &&
      el !== document.body &&
      document.contains(el) &&
      !el.closest("[hidden], [inert]")
    ) {
      el.focus({ preventScroll: true });
      return;
    }
    const w = focusedWin();
    if (w) focusWin(w.id, { dom: true });
    else document.body.focus();
  }
  function closeCmd(restore = true) {
    if (!cmdOpen()) return;
    cmdForm.hidden = true;
    if (cmdMsg.hidden) cmdl.hidden = true;
    if (restore) restoreFocus(cmdReturn);
    syncMode();
  }
  function writeCompose(andClose: boolean) {
    if (!isOpen("compose")) {
      message("E32: No file name", "err");
      return;
    }
    const res = submitCompose(false);
    if (res !== true) {
      message(`E212: Can't write "compose": ${res}`, "err");
      return;
    }
    message(`"compose" handed to your mail app as a draft${andClose ? "; window closed" : ""}`);
    if (andClose) closeWin("compose");
  }
  const EX_CMDS = [
    "q",
    "q!",
    "qa",
    "w",
    "wq",
    "x",
    "e",
    "edit",
    "colorscheme",
    "layout",
    "help",
    "ls",
    "buffers",
    "b",
    "tabn",
    "tabp",
    "Ex",
    "terminal",
    "set",
    "1",
    "2",
    "3",
    "4",
    "5",
  ];
  function exec(line: string) {
    const s = line.trim().replace(/^:+/, "");
    if (!s) return;
    const [c, ...args] = s.split(/\s+/);
    const arg = args.join(" ");
    if (/^[1-5]$/.test(c)) {
      switchWs(Number(c), { focus: true });
      return;
    }
    switch (c) {
      case "q":
      case "q!":
      case "quit":
      case "clo":
      case "close": {
        const w = focusedWin();
        if (!w) {
          message("E444: Cannot close last window", "err");
          return;
        }
        closeWin(w.id, { dom: true });
        return;
      }
      case "qa":
      case "qa!":
      case "qall":
      case "qall!":
      case "only":
        closeAllInWs();
        return;
      case "w":
      case "write":
        writeCompose(false);
        return;
      case "wq":
      case "x":
      case "xit":
      case "wq!":
        writeCompose(true);
        return;
      case "e":
      case "edit":
      case "o":
      case "open":
        if (!arg) {
          message("E32: No file name", "err");
          return;
        }
        {
          const io = msgIO();
          shell.openFile(arg, io);
          if (io.lines.length) messageLines(io.lines);
        }
        return;
      case "colorscheme":
      case "colo":
        if (!arg) {
          message(rice);
          return;
        }
        if (!applyRice(arg.toLowerCase(), true)) message(`E185: Cannot find color scheme '${arg}'`, "err");
        return;
      case "layout":
        if (!arg) {
          message(`${WS[cur].layout} ${SYM[WS[cur].layout]}`);
          return;
        }
        if (!setLayout(arg)) message(`E474: Invalid argument: ${arg}`, "err");
        return;
      case "h":
      case "help":
        openKeys(arg || null);
        return;
      case "ls":
      case "buffers":
      case "files": {
        const io = msgIO();
        for (let n = 1; n <= 5; n++)
          WS[n].order.forEach((id) => {
            const w = WIN[id],
              flag = n === cur && WS[n].focus === id ? "%a" : n === cur ? " a" : " h";
            const name = w.kind === "project" ? `projects/${w.slug}` : w.label;
            io.out(`${String(w.nr).padStart(3)} ${flag}   "${name}"`.padEnd(42), { t: `workspace ${n}`, c: "dim" });
          });
        if (!io.lines.length) io.out("no open windows");
        messageLines(io.lines);
        return;
      }
      case "b":
      case "buffer":
      case "bu": {
        const w = Object.values(WIN).find((x) => String(x.nr) === arg && isOpen(x.id));
        if (!w) {
          message(`E86: Buffer ${arg || "?"} does not exist`, "err");
          return;
        }
        switchWs(w.ws);
        focusWin(w.id, { dom: true, raise: true });
        return;
      }
      case "tabn":
      case "tabnext":
        wsStep(1);
        return;
      case "tabp":
      case "tabprevious":
      case "tabN":
        wsStep(-1);
        return;
      case "Ex":
      case "Explore":
      case "Sex":
      case "Vex":
        launch("files");
        return;
      case "terminal":
      case "term":
        launch("term", { target: shell.termIn });
        return;
      case "set":
      case "se": {
        const o = arg.trim();
        if (o === "vim") {
          setVim(true);
          message("vim keys on");
        } else if (o === "novim") {
          setVim(false);
          message("vim keys off; :set vim turns them back on");
        } else if (o === "vim?" || o === "") message(vimOn ? "  vim" : "novim");
        else message(`E518: Unknown option: ${o}`, "err");
        return;
      }
      default: {
        const io = msgIO();
        if (c !== "clear" && shell.interpret(s, io)) {
          if (io.lines.length) messageLines(io.lines);
          return;
        }
        message(`E492: Not an editor command: ${s}`, "err");
      }
    }
  }
  cmdForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const v = cmdIn.value;
    if (v.trim() && exHist[0] !== v.trim()) exHist.unshift(v.trim());
    closeCmd(true);
    exec(v);
  });
  cmdIn.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      shell.complete(cmdIn, (s) => message(s), EX_CMDS);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (exPos < exHist.length - 1) {
        exPos++;
        cmdIn.value = exHist[exPos];
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (exPos > 0) {
        exPos--;
        cmdIn.value = exHist[exPos];
      } else {
        exPos = -1;
        cmdIn.value = "";
      }
    } else if (e.key === "Backspace" && !cmdIn.value) {
      e.preventDefault();
      closeCmd(true);
    }
  });

  // ---------- launcher (rofi) ----------
  const rofi = $("#rofi"),
    rIn = $<HTMLInputElement>("#rofiIn"),
    rList = $("#rofiList"),
    rCount = $("#rofiCount");
  let rItems: { e: RofiEntry; m: Match }[] = [],
    rActive = 0,
    rReturn: Element | null = null;
  const rofiOpen = () => !rofi.hidden;
  function entries() {
    const list: RofiEntry[] = [];
    for (let n = 1; n <= 5; n++)
      list.push({ label: `${n} ${WS_NAMES[n]}`, tag: "workspace", run: () => switchWs(n, { focus: true }) });
    sortProjects(PROJECTS).forEach((p) =>
      list.push({
        label: p.name,
        tag: WIN[`p:${p.slug}`] ? "project · open" : "project",
        run: () => openProject(p.slug),
      }),
    );
    list.push(
      { label: "resume.pdf", tag: "link", run: openResume },
      { label: PROFILE.github.replace(/^https:\/\/(www\.)?/, ""), tag: "link", run: () => openLink(PROFILE.github) },
      {
        label: PROFILE.linkedin.replace(/^https:\/\/(www\.)?/, ""),
        tag: "link",
        run: () => openLink(PROFILE.linkedin),
      },
      { label: "copy email address", tag: "action", run: () => copyEmail() },
    );
    CORE_IDS.forEach((id) =>
      list.push({ label: WIN[id].label, tag: isOpen(id) ? "window" : "window · closed", run: () => launch(id) }),
    );
    RICES.forEach((r) =>
      list.push({
        label: `colorscheme ${r}`,
        tag: r === rice ? "rice · current" : "rice",
        run: () => applyRice(r, true),
      }),
    );
    LAYOUTS.forEach((l) =>
      list.push({
        label: `layout ${l} ${SYM[l]}`,
        tag: l === WS[cur].layout ? "layout · current" : "layout",
        run: () => setLayout(l),
      }),
    );
    list.push(
      { label: "keybindings", tag: "help", run: () => openKeys() },
      { label: "command line :", tag: "action", run: () => later(() => openCmd(), 0) },
      { label: vimOn ? "vim keys off" : "vim keys on", tag: "setting", run: () => setVim(!vimOn) },
    );
    return list;
  }
  function renderRofi() {
    const q = rIn.value.trim().toLowerCase();
    const all = entries();
    rItems = q
      ? all
          .flatMap((e) => {
            const m = fuzzy(q, e.label) || (fuzzy(q, e.tag) ? { score: -1, idx: [] } : null);
            return m ? [{ e, m }] : [];
          })
          .sort((a, b) => b.m.score - a.m.score)
      : all.map((e) => ({ e, m: { score: 0, idx: [] } }));
    rActive = 0;
    rList.innerHTML = rItems.length
      ? rItems
          .map(
            (x, i) =>
              `<li role="option" id="ro-${i}" data-i="${i}" aria-selected="${i === 0}"><span class="ro-l">${highlight(x.e.label, x.m.idx)}</span><span class="ro-t">${esc(x.e.tag)}</span></li>`,
          )
          .join("")
      : `<li class="ro-empty" role="option" aria-disabled="true" aria-selected="false">no matches</li>`;
    rIn.setAttribute("aria-activedescendant", rItems.length ? "ro-0" : "");
    rCount.textContent = `${rItems.length}/${all.length}`;
    rList.scrollTop = 0;
  }
  function rofiSet(i: number) {
    if (!rItems.length) return;
    rActive = (i + rItems.length) % rItems.length;
    $$("li[role=option]", rList).forEach((li, j) => li.setAttribute("aria-selected", j === rActive ? "true" : "false"));
    rIn.setAttribute("aria-activedescendant", `ro-${rActive}`);
    ensureVisible(rList, $(`#ro-${rActive}`), 6);
  }
  function openRofi() {
    if (rofiOpen()) {
      rIn.focus();
      return;
    }
    closeCmd(false);
    clearPending();
    rReturn = document.activeElement;
    rofi.hidden = false;
    rIn.value = "";
    renderRofi();
    rIn.focus({ preventScroll: true });
    syncMode();
  }
  function closeRofi(restore = true) {
    if (!rofiOpen()) return;
    rofi.hidden = true;
    if (restore) restoreFocus(rReturn);
    syncMode();
  }
  function rofiRun(i: number) {
    const x = rItems[i];
    if (!x) return;
    closeRofi(true);
    x.e.run();
  }
  rIn.addEventListener("input", renderRofi);
  rIn.addEventListener("keydown", (e) => {
    const k = e.key,
      ctrl = e.ctrlKey && !e.metaKey;
    if (
      k === "ArrowDown" ||
      (k === "Tab" && !e.shiftKey) ||
      (ctrl && k.toLowerCase() === "j") ||
      (ctrl && k.toLowerCase() === "n")
    ) {
      e.preventDefault();
      rofiSet(rActive + 1);
    } else if (
      k === "ArrowUp" ||
      (k === "Tab" && e.shiftKey) ||
      (ctrl && k.toLowerCase() === "k") ||
      (ctrl && k.toLowerCase() === "p")
    ) {
      e.preventDefault();
      rofiSet(rActive - 1);
    } else if (k === "Enter") {
      e.preventDefault();
      rofiRun(rActive);
    } else if (k === "PageDown") {
      e.preventDefault();
      rofiSet(Math.min(rItems.length - 1, rActive + 8));
    } else if (k === "PageUp") {
      e.preventDefault();
      rofiSet(Math.max(0, rActive - 8));
    }
  });
  rList.addEventListener("pointermove", (e) => {
    const li = (e.target as HTMLElement).closest<HTMLElement>("li[data-i]");
    if (li && Number(li.dataset.i!) !== rActive) rofiSet(Number(li.dataset.i!));
  });
  rList.addEventListener("click", (e) => {
    const li = (e.target as HTMLElement).closest<HTMLElement>("li[data-i]");
    if (li) rofiRun(Number(li.dataset.i!));
  });
  $(".rofi-scrim").addEventListener("click", () => closeRofi(true));
  $("#runBtn").addEventListener("click", openRofi);

  // ---------- keybindings sheet ----------
  const kwin = $("#keys"),
    keysBody = $("#keysBody");
  let kReturn: Element | null = null;
  function openKeys(topic?: string | null) {
    if (kwin.hidden) {
      kReturn = document.activeElement;
      kwin.hidden = false;
    }
    const t =
      topic &&
      document.getElementById(
        `help-${String(topic)
          .toLowerCase()
          .replace(/^patra-/, "")}`,
      );
    keysBody.scrollTop = t
      ? t.getBoundingClientRect().top - keysBody.getBoundingClientRect().top + keysBody.scrollTop - 10
      : 0;
    if (topic && !t) message(`E149: Sorry, no help for ${topic}`, "err");
    keysBody.focus({ preventScroll: true });
  }
  function closeKeys() {
    if (kwin.hidden) return;
    kwin.hidden = true;
    restoreFocus(kReturn);
  }
  $("#keysClose").addEventListener("click", closeKeys);
  $("#keysBtn").addEventListener("click", () => (kwin.hidden ? openKeys() : closeKeys()));

  // ---------- vim layer: mode, pending prefixes, which-key ----------
  const modeEl = $("#mode"),
    modeName = $("#modeName"),
    modePend = $("#modePend"),
    conky = $("#conky");
  let mode = "NORMAL",
    pending = "";
  let vimOn = store.get("patra-vim") !== "off";
  const isText = (el: unknown): boolean =>
    el instanceof HTMLElement &&
    (el.matches("textarea, select, [contenteditable=''], [contenteditable=true]") ||
      (el instanceof HTMLInputElement && !/^(button|submit|checkbox|radio|reset|range|color|file)$/.test(el.type)));
  function syncMode() {
    const a = document.activeElement;
    const m = hints.on ? "HINT" : rofiOpen() ? "SEARCH" : cmdOpen() ? "COMMAND" : isText(a) ? "INSERT" : "NORMAL";
    if (m !== mode) {
      mode = m;
      modeEl.dataset.mode = m.toLowerCase();
      modeName.textContent = m;
      updateAllStatus();
    }
  }
  onDoc("focusin", syncMode);
  onDoc("focusout", () => later(syncMode, 0));
  function setVim(on: boolean) {
    vimOn = on;
    store.set("patra-vim", on ? "on" : "off");
    modeEl.hidden = !on;
    const tog = $("#vimTog");
    tog.setAttribute("aria-pressed", on ? "true" : "false");
    $("#vimTogSw").textContent = on ? "on" : "off";
    conky.innerHTML = on
      ? `<span><kbd>f</kbd>hints</span><span><kbd>/</kbd>find</span><span><kbd>:</kbd>command</span><span><kbd>space</kbd>leader</span><span><kbd>1–5</kbd>workspaces</span><span><kbd>?</kbd>keys</span>`
      : `<span><kbd>ctrl k</kbd>find</span><span>vim keys off · turn them on in <kbd>?</kbd> keybindings</span>`;
    if (!on) clearPending();
    updateAllStatus();
  }
  $("#vimTog").addEventListener("click", () => setVim(!vimOn));
  const WK: Record<string, { title: string; items: [string, string][] }> = {
    " ": {
      title: "<Space>  leader",
      items: [
        ["f", "find (launcher)"],
        ["e", "explorer (files)"],
        ["c", "cycle colorscheme"],
        ["l", "cycle layout"],
        ["r", "open résumé"],
        ["m", "compose mail"],
        ["?", "keybindings"],
      ],
    },
    w: {
      title: "w  window",
      items: [
        ["h j k l", "focus left / down / up / right"],
        ["w  W", "next / previous window"],
        ["q", "close window"],
        ["o", "toggle monocle"],
        ["=", "reset split"],
        ["<  >", "shrink / grow master"],
        ["H  L", "make master / send to stack"],
      ],
    },
    g: {
      title: "g  go",
      items: [
        ["g", "top of window"],
        ["t", "next workspace"],
        ["T", "previous workspace"],
      ],
    },
  };
  const wk = $("#wk");
  function setPending(p: string) {
    pending = p;
    modePend.textContent = p === " " ? "<Space>" : p;
    $("#wkH").textContent = WK[p].title;
    $("#wkList").innerHTML = WK[p].items.map(([k, d]) => `<dt>${esc(k)}</dt><dd>${esc(d)}</dd>`).join("");
    wk.hidden = false;
  }
  function clearPending() {
    pending = "";
    modePend.textContent = "";
    wk.hidden = true;
  }
  function prefixed(p: string, k: string) {
    if (p === " ") {
      const act = (
        {
          f: openRofi,
          e: () => {
            launch("files", { dom: false });
            fmSelect(fmSel);
          },
          c: cycleRice,
          l: cycleLayout,
          r: openResume,
          m: () => {
            launch("compose", { dom: false });
            focusInput(WIN.compose);
          },
          "?": () => openKeys(),
        } as Record<string, () => unknown>
      )[k];
      act ? act() : message(`<Space>${k} is not mapped; <Space> then wait shows the list`);
      return;
    }
    if (p === "w") {
      const act = (
        {
          h: () => moveFocus("h"),
          j: () => moveFocus("j"),
          k: () => moveFocus("k"),
          l: () => moveFocus("l"),
          w: () => cycleWin(1),
          W: () => cycleWin(-1),
          q: () => {
            const w = focusedWin();
            if (w) closeWin(w.id, { dom: true });
          },
          o: toggleMonocle,
          "=": resetMfact,
          "<": () => nudge(-0.05),
          ">": () => nudge(0.05),
          H: () => swapMaster("H"),
          L: () => swapMaster("L"),
        } as Record<string, () => unknown>
      )[k];
      act ? act() : message(`w${k} is not mapped`);
      return;
    }
    if (p === "g") {
      const act = (
        { g: () => goEdge(focusedWin(), true), t: () => wsStep(1), T: () => wsStep(-1) } as Record<
          string,
          () => unknown
        >
      )[k];
      act ? act() : message(`g${k} is not mapped`);
    }
  }

  // ---------- link hints ----------
  const hintsEl = $("#hints");
  const hints: { on: boolean; newTab: boolean; typed: string; items: Hint[] } = {
    on: false,
    newTab: false,
    typed: "",
    items: [],
  };
  const HINT_CHARS = "asdfghjkl";
  function hintTargets() {
    const sel =
      'a[href], button:not([disabled]), input:not([type=hidden]), textarea, select, [role="option"], [tabindex="0"]';
    const scopes = [$("#bar"), wsEls[cur]];
    if (!kwin.hidden) scopes.push(kwin);
    const out: { el: HTMLElement; r: DOMRect }[] = [];
    scopes.forEach((s) =>
      $$(sel, s).forEach((el) => {
        if (el.closest("[inert], [hidden], .buried, .closing") || el.classList.contains("mdiv")) return;
        const r = el.getBoundingClientRect();
        if (r.width < 2 || r.height < 2 || r.bottom < 0 || r.right < 0 || r.top > innerHeight || r.left > innerWidth)
          return;
        const clip = el.closest(".win-body");
        if (clip) {
          const c = clip.getBoundingClientRect();
          if (r.bottom < c.top + 2 || r.top > c.bottom - 2) return;
        }
        if (getComputedStyle(el).visibility === "hidden") return;
        out.push({ el, r });
      }),
    );
    return out;
  }
  function labelsFor(n: number) {
    const C = HINT_CHARS,
      L = n <= C.length ? 1 : n <= C.length * C.length ? 2 : 3,
      out: string[] = [];
    for (let i = 0; out.length < n; i++) {
      let s = "",
        x = i;
      for (let j = 0; j < L; j++) {
        s = C[x % C.length] + s;
        x = Math.floor(x / C.length);
      }
      out.push(s);
    }
    return out;
  }
  function startHints(newTab: boolean) {
    const t = hintTargets();
    if (!t.length) {
      message("no clickable elements in view");
      return;
    }
    const labels = labelsFor(t.length);
    hints.items = t.map((x, i) => ({ ...x, label: labels[i] }));
    hints.on = true;
    hints.newTab = newTab;
    hints.typed = "";
    hintsEl.innerHTML = "";
    hints.items.forEach((h) => {
      const m = document.createElement("span");
      m.className = "hint";
      m.style.left = `${Math.max(0, Math.min(innerWidth - 30, h.r.left - 2))}px`;
      m.style.top = `${Math.max(0, Math.min(innerHeight - 18, h.r.top - 2))}px`;
      h.marker = m;
      hintsEl.append(m);
    });
    renderHints();
    hintsEl.hidden = false;
    clearPending();
    syncMode();
    modePend.textContent = newTab ? "new tab" : "";
  }
  function renderHints() {
    hints.items.forEach((h) => {
      const match = h.label.startsWith(hints.typed);
      h.marker!.hidden = !match;
      if (match)
        h.marker!.innerHTML = `<span class="typed">${esc(hints.typed)}</span>${esc(h.label.slice(hints.typed.length))}`;
    });
  }
  function stopHints() {
    hints.on = false;
    hints.items = [];
    hintsEl.hidden = true;
    hintsEl.innerHTML = "";
    modePend.textContent = "";
    syncMode();
  }
  function activateHint(el: HTMLElement) {
    const newTab = hints.newTab;
    stopHints();
    if (isText(el)) {
      el.focus();
      return;
    }
    if (newTab && el instanceof HTMLAnchorElement) {
      openLink(el.href);
      return;
    }
    el.focus({ preventScroll: true });
    el.click();
  }
  function hintKey(e: KeyboardEvent) {
    e.preventDefault();
    const k = e.key;
    if (k === "Escape") {
      stopHints();
      return;
    }
    if (k === "Backspace") {
      hints.typed = hints.typed.slice(0, -1);
      renderHints();
      return;
    }
    const c = k.toLowerCase();
    if (c.length !== 1 || !HINT_CHARS.includes(c)) return;
    hints.typed += c;
    const left = hints.items.filter((h) => h.label.startsWith(hints.typed));
    if (left.length === 1 && left[0].label === hints.typed) {
      activateHint(left[0].el);
      return;
    }
    if (!left.length) {
      hints.typed = hints.typed.slice(0, -1);
      return;
    }
    renderHints();
  }

  // ---------- keyboard dispatch ----------
  function escapeChain(e: KeyboardEvent) {
    if (shell.searching()) return;
    if (rofiOpen()) {
      e.preventDefault();
      closeRofi(true);
      return;
    }
    if (cmdOpen()) {
      e.preventDefault();
      closeCmd(true);
      return;
    }
    if (pending) {
      e.preventDefault();
      clearPending();
      return;
    }
    if (msgVisible()) {
      e.preventDefault();
      hideMessage();
      return;
    }
    if (!kwin.hidden && (kwin.contains(document.activeElement) || document.activeElement === document.body)) {
      e.preventDefault();
      closeKeys();
      return;
    }
    const a = document.activeElement;
    if (vimOn && desk() && isText(a)) {
      e.preventDefault();
      (a as HTMLElement).blur();
      const w = focusedWin();
      if (w) focusWin(w.id, { dom: true });
      syncMode();
      return;
    }
    if (!kwin.hidden) {
      e.preventDefault();
      closeKeys();
      return;
    }
    const w = focusedWin();
    if (w && w.kind === "project") {
      e.preventDefault();
      closeWin(w.id, { dom: true, focusRow: w.slug });
    }
  }
  function normal(e: KeyboardEvent) {
    const k = e.key;
    if (k.length > 1 && k !== "Enter") return;
    const t = e.target;
    const onCtl =
      t instanceof Element &&
      !!t.closest("button, a[href], summary, select, [role=button], [role=separator], [role=option]");
    if ((k === " " || k === "Enter") && onCtl && !pending) return;
    if (pending) {
      e.preventDefault();
      const p = pending;
      clearPending();
      prefixed(p, k);
      return;
    }
    const w = focusedWin(),
      app = appOf(w);
    let handled = true;
    switch (k) {
      case " ":
        setPending(" ");
        break;
      case "w":
        setPending("w");
        break;
      case "g":
        setPending("g");
        break;
      case "f":
        startHints(false);
        break;
      case "F":
        startHints(true);
        break;
      case "/":
        openRofi();
        break;
      case ":":
        openCmd();
        break;
      case "?":
        kwin.hidden ? openKeys() : closeKeys();
        break;
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
        switchWs(Number(k), { focus: true });
        break;
      case "i":
      case "a":
        if (w) focusInput(w);
        break;
      case "n":
      case "N":
        if (app === "project") stepProject(w!, k === "n" ? 1 : -1);
        else handled = false;
        break;
      case "h":
      case "j":
      case "k":
      case "l":
        hjkl(k, w);
        break;
      case "G":
        if (w) goEdge(w, false);
        break;
      case "d":
        halfPage(1);
        break;
      case "u":
        halfPage(-1);
        break;
      case "o":
      case "Enter":
        if (app === "files") fmOpenSel();
        else handled = false;
        break;
      default:
        handled = false;
    }
    if (handled) e.preventDefault();
  }
  onWin("keydown", (e) => {
    if (boot.active) {
      bootKey(e);
      return;
    }
    if (e.defaultPrevented) return;
    const k = e.key,
      mod = e.metaKey || e.ctrlKey;
    if (mod && !e.altKey && !e.shiftKey && k.toLowerCase() === "k") {
      e.preventDefault();
      rofiOpen() ? closeRofi(true) : openRofi();
      return;
    }
    if (hints.on) {
      hintKey(e);
      return;
    }
    if (k === "Escape") {
      escapeChain(e);
      return;
    }
    if (
      (msgSticky && !mod && !isText(e.target) && !rofiOpen() && !cmdOpen() && k.length === 1) ||
      (msgSticky && k === "Enter" && !isText(e.target))
    ) {
      e.preventDefault();
      hideMessage();
      return;
    }
    if (!vimOn || !desk()) return;
    if (isText(e.target) || rofiOpen() || cmdOpen()) return;
    if (e.altKey) return;
    if (mod) {
      if (e.ctrlKey && !e.metaKey && (k === "d" || k === "u")) {
        e.preventDefault();
        halfPage(k === "d" ? 1 : -1);
      }
      return;
    }
    normal(e);
  });

  // ---------- compose ----------
  const submitCompose = setupCompose();
  $$("[data-copy]").forEach((b) =>
    b.addEventListener("click", async () => {
      const label = b.textContent;
      b.textContent = (await copyEmail()) ? "copied" : "selected, press ⌘C";
      later(() => {
        b.textContent = label;
      }, 1800);
    }),
  );
  onDoc("click", (e) => {
    if ((e.target as HTMLElement).closest<HTMLElement>("[data-resume], #resumeLink"))
      notify("xdg-open", "Opening resume.pdf", `${PROFILE.resume.split("/").pop()} opens in a new tab.`);
  });

  // ---------- boot, greeter, lock ----------
  // The boot log and greeter are a CSS timeline that starts with the first paint (boot.ts, BootScreen.svelte), so they
  // play while this script loads. The desktop takes it over: it ends the boot when the timeline ends or on a key or
  // click, and replays it for reboot. Logout and lock are driven from here.
  const bootEl = $("#boot"),
    bootLog = $("#bootLog"),
    greeter = $("#greeter"),
    lockscr = $("#lockscr"),
    grStatus = $("#grStatus");
  const boot = { active: false, kind: "", phase: "", timers: [] as number[], run: 0 };
  const bt = (fn: () => void, ms: number) => boot.timers.push(later(fn, ms));
  function clearBootTimers() {
    boot.timers.forEach(clearTimeout);
    boot.timers = [];
  }
  function greeterClock() {
    const d = new Date();
    $("#grClock").textContent = `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
    $("#grDate").textContent = d.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    $("#lkClock").textContent = `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
    $("#lkDate").textContent = $("#grDate").textContent;
  }
  function showOverlay(kind: string) {
    clearBootTimers();
    boot.active = true;
    boot.kind = kind;
    clearPending();
    closeRofi(false);
    closeCmd(false);
    if (hints.on) stopHints();
    bootEl.hidden = false;
    bootEl.classList.remove("fade");
    bootLog.hidden = kind !== "boot" && kind !== "reboot";
    greeter.hidden = true;
    lockscr.hidden = true;
    $("#bootSkip").hidden = kind === "lock";
    grStatus.textContent = "";
    greeterClock();
  }
  // Setting data-booting starts the timeline (or, for the first boot, marks it as taken over from app.html).
  // The boot finishes when its boot-end animation does, at once if that has already happened.
  function playTimeline(kind: string) {
    if (kind !== "boot") {
      delete root.dataset.booting;
      void bootEl.offsetWidth;
    }
    root.dataset.booting = kind;
    boot.phase = "log";
    const run = ++boot.run;
    const end = bootEl.getAnimations().find((a) => a instanceof CSSAnimation && a.animationName === "boot-end");
    (end ? end.finished : Promise.resolve()).then(
      () => {
        if (run === boot.run) finishBoot();
      },
      () => {
        /* cancelled: a newer boot or a skip took over */
      },
    );
  }
  function runBoot(kind: "boot" | "reboot" | "logout" | "lock") {
    showOverlay(kind);
    if (kind === "lock") {
      boot.phase = "lock";
      lockscr.hidden = false;
      $("#lkRing").classList.remove("verifying");
      return;
    }
    if (kind === "logout") {
      boot.phase = "greeter";
      bootLog.hidden = true;
      greeter.hidden = false;
      grStatus.textContent = "Press Enter, or click, to log in as guest";
      return;
    }
    playTimeline(kind);
  }
  function finishBoot() {
    if (!boot.active) return;
    clearBootTimers();
    boot.run++;
    boot.active = false;
    boot.phase = "";
    // data-booting stays until the fade ends, so the greeter doesn't flick back to the log while it fades.
    const done = () => {
      if (boot.active) return;
      bootEl.hidden = true;
      bootEl.classList.remove("fade");
      delete root.dataset.booting;
    };
    if (reduced()) done();
    else {
      bootEl.classList.add("fade");
      later(done, 260);
    }
    spawnStagger(cur);
    if (!reduced()) {
      document.body.classList.add("spawn-in");
      later(() => document.body.classList.remove("spawn-in"), 1000);
    }
    welcome();
  }
  function login() {
    if (boot.phase !== "greeter") return;
    grStatus.textContent = "Authenticating…";
    boot.phase = "auth";
    bt(finishBoot, 320);
  }
  function unlock() {
    if (boot.phase !== "lock") return;
    boot.phase = "verify";
    $("#lkRing").classList.add("verifying");
    bt(finishBoot, 260);
  }
  function bootKey(e: KeyboardEvent) {
    if (["Shift", "Control", "Alt", "Meta", "CapsLock"].includes(e.key)) return;
    e.preventDefault();
    if (boot.kind === "lock") {
      unlock();
      return;
    }
    if (boot.kind === "logout") {
      if (e.key === "Enter") login();
      return;
    }
    finishBoot();
  }
  bootEl.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    if (boot.kind === "lock") unlock();
    else if (boot.kind === "logout") login();
    else finishBoot();
  });
  every(() => {
    if (boot.active) greeterClock();
  }, 5000);
  function welcome() {
    if (session.get("patra-welcomed")) return;
    session.set("patra-welcomed", "1");
    later(
      () =>
        notify(
          "patra-wm",
          "Welcome",
          desk()
            ? "Workspaces 1–5 are the sections. Press / to search, ? for keys."
            : "The workspaces in the bar are the sections. Tap run to search.",
        ),
      450,
    );
  }

  // ---------- breakpoint + resize ----------
  deskMQ.addEventListener("change", onBreakpoint, { signal });
  function onBreakpoint() {
    clearPending();
    if (hints.on) stopHints();
    if (desk()) {
      $$(".ws").forEach((w) => {
        w.style.transform = "";
        w.style.transition = "";
        w.classList.remove("leaving");
        if (w !== wsEls[cur]) w.classList.remove("active");
      });
      document.body.classList.remove("locked");
      relayoutAll(false);
    } else {
      $$(".ws > .win").forEach((el) => {
        ["left", "top", "width", "height", "z-index"].forEach((p) => el.style.removeProperty(p));
        el.classList.remove("buried");
        el.inert = false;
      });
      while (pOpen.length > 1) closeWin(`p:${pOpen[0]}`, { instant: true });
      if (pOpen.length) document.body.classList.add("locked");
      relayoutAll(false);
    }
  }
  let resizeRaf = 0;
  onWin("resize", () => {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(() => {
      if (desk()) relayoutAll(false);
      updateAllStatus();
    });
  });
  onWin("hashchange", () => {
    const h = location.hash.slice(1).toLowerCase();
    if (bySlug[h]) {
      if (!WIN[`p:${h}`] || focusedId() !== `p:${h}`) openProject(h);
    } else if (/^[1-5]$/.test(h) || WS_ALIAS[h]) {
      const n = /^[1-5]$/.test(h) ? Number(h) : WS_ALIAS[h];
      if (n !== cur) switchWs(n);
    }
  });

  // ---------- init ----------
  makeBuffer("exp");
  makeBuffer("skills");
  makeBuffer("ach");
  applyRice(rice, false);
  setVim(vimOn);
  relayoutAll(false);
  syncLayBtn();
  updateOcc();
  refreshFocusRing();
  (async () => {
    try {
      await photo.decode();
    } catch {}
    redrawPortrait();
    let lastW = 0;
    if (signal.aborted) return;
    const ro = new ResizeObserver(() => {
      const w = pf.getBoundingClientRect().width;
      if (Math.abs(w - lastW) > 1) {
        lastW = w;
        redrawPortrait();
      }
    });
    ro.observe(pf);
    signal.addEventListener("abort", () => ro.disconnect());
  })();
  const startHash = location.hash.slice(1).toLowerCase();
  const deep = !!startHash && startHash !== "home" && startHash !== "1";
  if (bySlug[startHash]) openProject(startHash, { instant: true });
  else if (deep) {
    const n = /^[1-5]$/.test(startHash) ? Number(startHash) : WS_ALIAS[startHash];
    if (n) switchWs(n, { instant: true });
  }
  // app.html starts the boot on every load unless motion is reduced; take it over if it is still running.
  if ("booting" in root.dataset) {
    showOverlay("boot");
    playTimeline("boot");
  } else {
    spawnStagger(cur);
    welcome();
  }

  return () => {
    ac.abort();
    clearBootTimers();
  };
}
