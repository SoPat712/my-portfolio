<script lang="ts">
  import { COURSES, PROFILE, PROJECTS } from "$lib/content";
  import { bootLines, bootSchedule } from "./boot";

  // Boot log, tuigreet greeter and i3lock-style lock screen. The boot log and greeter play from CSS as soon as the
  // page paints (see boot.ts); the engine takes over for skipping, logging out, locking and rebooting.
  let { commits }: { commits: number } = $props();

  const lines = $derived(bootLines({ projects: PROJECTS.length, courses: COURSES.length, commits, githubUser: PROFILE.githubUser }));
  const s = $derived(bootSchedule(lines.length));
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
        {#if line.ok}{"[  "}<span class="ok">OK</span>{"  ] "}{:else}{" ".repeat(9)}{/if}{line.text}{#if line.rice}<span class="boot-rice"></span>.{/if}
      </div>
    {/each}
  </div>
  <div class="greeter" id="greeter" hidden>
    <div class="gr-box">
      <p class="gr-tl">tuigreet</p>
      <p class="gr-clock" id="grClock"></p>
      <p class="gr-date" id="grDate"></p>
      <p class="gr-wel">Welcome back</p>
      <div class="gr-fields">
        <p><span class="gk">Username:</span><span><span class="gr-user">guest</span><span class="gr-caret"></span></span></p>
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
