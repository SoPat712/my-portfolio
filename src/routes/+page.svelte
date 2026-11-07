<script lang="ts">
  import Desktop from "$lib/desktop/Desktop.svelte";

  let { data } = $props();

  const description =
    "Josh Patra, Computer Science and Philosophy student at Rutgers. A portfolio run as a tiling window manager: projects, experience, education and contact across five workspaces.";
</script>

<svelte:head>
  <title>Josh Patra</title>
  <meta name="description" content={description} />
  <link rel="canonical" href="{data.site}/" />
  <!-- Link previews (LinkedIn, iMessage, Slack, Discord). The image is a screenshot of workspace 1. -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="{data.site}/" />
  <meta property="og:title" content="Josh Patra" />
  <meta property="og:description" content={description} />
  <meta property="og:image" content="{data.site}/og.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="Josh Patra's portfolio: a tiling window manager desktop with the name, a dithered portrait, a terminal and current projects." />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Fragment+Mono:ital@0;1&family=Martian+Mono:wdth,wght@75..112.5,300..800&display=swap"
  />
</svelte:head>

<Desktop commits={data.commits} />
