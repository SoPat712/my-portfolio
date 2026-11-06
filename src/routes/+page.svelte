<script lang="ts">
  import Desktop from "$lib/desktop/Desktop.svelte";

  let { data } = $props();
</script>

<svelte:head>
  <title>Josh Patra</title>
  <meta
    name="description"
    content="Josh Patra, Computer Science and Philosophy student at Rutgers. A portfolio run as a tiling window manager: projects, experience, education and contact across five workspaces."
  />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Fragment+Mono:ital@0;1&family=Martian+Mono:wdth,wght@75..112.5,300..800&display=swap"
  />
</svelte:head>

<Desktop commits={data.commits} />
