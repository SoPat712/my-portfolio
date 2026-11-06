<script lang="ts">
  import { BUFFERS, type BufferId } from "./vfs";

  // A read-only nvim buffer. Lines are rendered here so they are in the page without JavaScript;
  // the engine adds the moving cursor line, relative numbers and the status line.
  let { id }: { id: BufferId } = $props();
  const buf = $derived(BUFFERS[id]);
</script>

<div class="win-body bufwrap" tabindex="-1" data-buf={id}>
  <div class="buf">
    {#each buf.lines as line, i (i)}
      {@const r = buf.hl(line, i)}
      <div class={["ln", i === 0 && "cur"]} data-i={i}>
        <span class="gut" aria-hidden="true">{i === 0 ? 1 : i}</span><span
          class={["tx", r.cls]}
          role={r.role ? "heading" : undefined}
          aria-level={r.role}>{@html r.html}</span
        >
      </div>
    {/each}
    <div class="buf-fill" aria-hidden="true"></div>
  </div>
</div>
<div class="buf-status" aria-hidden="true"></div>
