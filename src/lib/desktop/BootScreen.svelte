<script lang="ts">
  import { COURSES, PROFILE, PROJECTS } from "$lib/content";
  import { bootLines, bootSchedule, fetchRows, type BuildInfo } from "./boot";
  import { LOGO, SWATCHES } from "./shared";

  // Boot log, tuigreet greeter and i3lock-style lock screen. The boot log and greeter play from CSS as soon as the
  // page paints (see boot.ts); the engine takes over for skipping, logging out, locking and rebooting.
  let { commits, build }: { commits: number; build: BuildInfo } = $props();

  const lines = $derived(
    bootLines({ projects: PROJECTS.length, courses: COURSES.length, commits, githubUser: PROFILE.githubUser }),
  );
  const s = $derived(bootSchedule(lines.length));
  const rows = $derived(fetchRows({ build, projects: PROJECTS.length, courses: COURSES.length }));
</script>

<div
  class="boot"
  id="boot"
  aria-hidden="true"
  hidden
  style:--greet="{s.greet}ms"
  style:--type="{s.type}ms"
  style:--type-step="{s.typeStep}ms"
  style:--auth="{s.auth}ms"
  style:--end="{s.end}ms"
>
  <div class="boot-log" id="bootLog">
    {#each lines as line, i (i)}
      <!-- The spacing is in expressions so whitespace collapsing can't touch it; .boot-log is pre-wrap. -->
      <div style:--at="{s.at[i]}ms">
        {#if line.ok}{"[  "}<span class="ok">OK</span>{"  ] "}{:else}{" ".repeat(9)}{/if}{line.text}{#if line.rice}<span
            class="boot-rice"
          ></span>.{/if}
      </div>
    {/each}
  </div>
  <div class="greeter" id="greeter" hidden>
    <div class="gr-box">
      <p class="gr-tl">tuigreet</p>
      <p class="gr-clock" id="grClock"></p>
      <p class="gr-date" id="grDate"></p>
      <!-- A fetch, the way tuigreet shows /etc/issue. Its lines print in turn (--i); the engine fills in [data-fill]. -->
      <div class="gr-fetch">
        <pre class="gr-logo" aria-hidden="true">{LOGO}</pre>
        <div class="gr-info">
          <p class="gr-who" style:--i="0"><b>guest</b>@<b>patra</b></p>
          <p class="gr-rule" style:--i="1">{"-".repeat(11)}</p>
          {#each rows as r, i (r.k)}
            <p class:opt={r.opt} style:--i={i + 2}>
              <span class="gk">{r.k}</span>{#if r.fill}<span data-fill={r.fill}>…</span>{:else if r.rice}<span
                  class="boot-rice"
                ></span>{:else}<span>{r.v}</span>{/if}
            </p>
          {/each}
          <p class="gr-swatches" aria-hidden="true" style:--i={rows.length + 2}>
            {#each SWATCHES as c (c)}<i style:--c="var({c})"></i>{/each}
          </p>
        </div>
      </div>
      <p class="gr-wel">Welcome back</p>
      <div class="gr-fields">
        <p>
          <span class="gk">Username:</span><span><span class="gr-user">guest</span><span class="gr-caret"></span></span>
        </p>
        <p><span class="gk">Session:</span><span>tiling</span></p>
      </div>
      <p class="gr-status"><span class="gr-auth">Authenticating…</span><span id="grStatus"></span></p>
    </div>
  </div>
  <div class="lockscr" id="lockscr" hidden>
    <p class="lk-clock" id="lkClock"></p>
    <p class="lk-date" id="lkDate"></p>
    <div class="lk-ring" id="lkRing"></div>
    <p class="lk-hint">type anything to unlock</p>
  </div>
  <button class="boot-skip" id="bootSkip" type="button" tabindex="-1">skip ›</button>
</div>
