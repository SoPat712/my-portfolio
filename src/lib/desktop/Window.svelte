<script lang="ts">
  import type { Snippet } from "svelte";

  // A tiled window: title bar, whatever the app puts in its body, and the float-mode resize grip.
  // The engine finds windows by data-win and positions them; data-title is what the bar shows when focused.
  let {
    id,
    ws,
    label,
    info,
    title,
    closeLabel,
    class: cls = "",
    children,
  }: {
    id: string;
    ws: number;
    label: string;
    info: string;
    title: string;
    closeLabel: string;
    class?: string;
    children: Snippet;
  } = $props();
</script>

<article class={["win", cls]} data-win={id} data-ws={ws} data-label={label} data-title={title} aria-labelledby="t-{id}">
  <div class="win-bar">
    <span class="win-t" id="t-{id}">{label}</span><span class="win-i">{info}</span><button
      class="x"
      type="button"
      data-close
      aria-label="Close {closeLabel} window">×</button
    >
  </div>
  {@render children()}
  <span class="grip" aria-hidden="true"></span>
</article>
