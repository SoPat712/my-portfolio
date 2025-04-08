<script>
  const name = "Josh";
  const role = "Computer Science Student";
  const projects = [
    {
      name: "DNS Resolver",
      link: "https://github.com/yourhandle/dns-resolver",
      description: "Built a recursive DNS resolver in C using sockets and caching."
    },
    {
      name: "Nextcloud + OnlyOffice Setup",
      link: "https://github.com/yourhandle/cloud-setup",
      description: "Docker-compose setup of Nextcloud with MariaDB and OnlyOffice integration."
    },
    {
      name: "Terminal Portfolio",
      link: "https://github.com/yourhandle/terminal-portfolio",
      description: "This portfolio, designed like a terminal and built with SvelteKit + Tailwind CSS v4."
    }
  ];
</script>

<main class="p-8 max-w-3xl mx-auto animate-fade-in">
  <h1 class="text-3xl sm:text-5xl font-semibold mb-6">
    ❯ Hello, I'm <span class="text-green-400">{name}</span>
  </h1>
  <p class="text-lg text-gray-400 mb-8">
    └─ a {role} building full-stack apps, server infra, and cool terminal UIs.
  </p>

  <section class="mb-10">
    <h2 class="text-2xl mb-4 border-b border-gray-600 pb-1">Projects</h2>
    <ul class="space-y-6">
      {#each projects as { name, link, description }}
        <li>
          <a href={link} class="text-xl text-blue-400 hover:underline">
            ❯ {name}
          </a>
          <p class="ml-4 text-gray-400">└─ {description}</p>
        </li>
      {/each}
    </ul>
  </section>

  <section>
    <h2 class="text-2xl mb-4 border-b border-gray-600 pb-1">Contact</h2>
    <p class="text-gray-400">
      ❯ Email: <a class="text-blue-400 hover:underline" href="mailto:josh@example.com">josh@example.com</a><br/>
      ❯ GitHub: <a class="text-blue-400 hover:underline" href="https://github.com/yourhandle">@yourhandle</a>
    </p>
  </section>
</main>

<style>
  main {
    font-family: 'JetBrains Mono', monospace;
  }
  @keyframes fade-in {
    0% { opacity: 0; transform: translateY(10px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fade-in 0.5s ease-out;
  }
</style>

