<script lang="ts">
  import { onMount, tick } from "svelte";

  // Portfolio Data
  const profile = {
    name: "Josh Patra",
    role: "Computer Science & Philosophy Student",
    bio: "Passionate about tackling complex problems through thoughtful and efficient solutions. I specialize in system architecture, IT infrastructure, and low-level programming in UNIX/Linux environments, with a strong foundation in C and systems-level problem-solving. I'm also experienced in Java and JavaScript, bringing versatility across both backend and frontend development. Currently pursuing a BS in Computer Science and Philosophy with a focus on systems and security.",
    avatar: "/headshot_square.webp",
  };

  // Experience Data
  const experiences = [
    {
      company: "Bergen’s Promise",
      role: "Data Analysis/Quality Compliance Intern",
      location: "Hackensack, NJ",
      duration: "June 2024 – August 2024",
      responsibilities: [
        "Analyzed large healthcare datasets using SQL and Python",
        "Identified and documented patterns in patient care data",
        "Interacted with patients and families to gather quality-of-care feedback",
        "Provided data-driven insights to help improve community services",
      ],
    },
  ];

  // Projects with expanded info
  const projects = [
    {
      name: "Allstarr",
      link: "https://github.com/SoPat712/allstarr",
      description:
        "An open-source, self-hosted music streaming server that integrates with Jellyfin. Allstarr provides a sleek web interface for managing and streaming your music collection, with support for importing Playlists from Spotify, and streaming using external providers like Tidal, Qobuz, and Deezer",
      techStack: ["C#", ".NET 8", "Jellyfin API", "Spotify API"],
      highlights: [
        "Built with C# and .NET 8 for high performance and reliability",
        "Integrates with Jellyfin for seamless music library management",
        "Supports importing playlists from Spotify and other providers",
        "Custom web interface for browsing and handling music, configuration, and imports",
        "Open source and designed for self-hosting on personal servers",
      ],
      image: "/jellyfin.webp",
    },
    {
      name: "RUSwipeShare",
      link: "https://github.com/SoPat712/RUSwipeShare",
      description:
        "A Flutter-based college meal swipe trading app that facilitates secure and efficient exchange of meal swipes among students.",
      techStack: ["Flutter", "Python/Flask", "Stripe API", "Firebase"],
      highlights: [
        "User authentication and authorization with Firebase",
        "Backend server communicating with Stripe API for in-app payments",
        "Real-time updates and notifications",
        "Seamless meal-swipe trading experience with a responsive UI",
      ],
      image: "/RuSwipeShare.webp",
    },
    {
      name: "TrackCovid19",
      link: "https://github.com/SoPat712/TrackCovid19",
      description:
        "An Android app that helps users track the progress of COVID-19 around the world using real-time data and interactive visualizations.",
      techStack: ["Java", "XML", "Public APIs"],
      highlights: [
        "Built for Android with Java and XML",
        "Real-time COVID-19 statistics from public APIs",
        "APK available for direct download and installation",
        "Open source and easily editable in Android Studio",
        "CI integrations for code quality and Gradle builds",
      ],
      image: "/TrackCovid19.webp",
    },
    {
      name: "BlueBubbles Contribution",
      link: "https://github.com/BlueBubblesApp/bluebubbles-app",
      description:
        "Contributed to BlueBubbles, an open-source project bringing iMessage-like functionality to non-Apple platforms. Focused on UI development and infrastructure improvements.",
      techStack: ["Android", "Dart/Flutter", "MongoDB"],
      highlights: [
        "Led front-end UI improvements across mobile and desktop platforms",
        "Contributed to the server migration to MongoDB",
        "Collaborated closely with the open-source community",
        "Assisted in the deployment of a major desktop app release",
      ],
      image: "/BlueBubbles.webp",
    },
    {
      name: "Terminal Portfolio",
      link: "https://github.com/SoPat712/my-portfolio",
      description:
        "This portfolio, designed like a terminal, showcases my projects and skills using SvelteKit and Tailwind CSS.",
      techStack: ["SvelteKit", "Tailwind CSS", "TypeScript"],
      highlights: [
        "Innovative terminal-inspired UI design",
        "Responsive and accessible layout",
        "Smooth animations and interactive command-line experience",
        "Optimized performance with minimal JavaScript",
      ],
      image: "/favicon.png",
    },
    {
      name: "VideoSpeed Extension (Fork)",
      link: "https://github.com/SoPat712/videospeed",
      description:
        "A fork and continuation of igrigorik/videospeed that brings accelerated video playback controls to Firefox. Allows users to speed up, slow down, rewind, and configure custom shortcuts for any HTML5 video.",
      techStack: ["JavaScript", "HTML5 Video API", "Browser Extensions"],
      highlights: [
        "Ported the original Chrome add-on to Firefox",
        "Keyboard shortcuts for playback speed, rewind, and advance",
        "Configurable preferred speed toggles",
        "Extension settings allow full customization of controls",
        "GPLv3 licensed and actively maintained",
      ],
      image: "/VideoSpeed.webp",
    },
    {
      name: "Maisie Heardle",
      link: "https://github.com/SoPat712/maisie-heardle",
      description:
        "A daily Heardle-style music guessing game built with SvelteKit, Tailwind CSS, and the SoundCloud Widget API. Focused on Maisie Peters songs but fully customizable for any artist.",
      techStack: [
        "SvelteKit",
        "Tailwind CSS",
        "SoundCloud Widget API",
        "Moment.js",
        "Svelte Hero Icons",
      ],
      highlights: [
        "Daily rotating track using deterministic date-based selection",
        "Progressive snippet unlocking with skips and wrong guesses",
        "Dark mode with auto-detection and manual toggle",
        "Deployed on Netlify with zero data collection",
        "Built to be easily modifiable for any artist",
      ],
      image: "/MaisieHeardle.webp",
    },
    {
      name: "Fair Housing Map",
      link: "https://github.com/SoPat712/fair-housing-map",
      description:
        "An interactive web map visualizing Raritan Township's 2025 FAIR Housing Plan overlay districts. Created to improve community understanding of affordable housing developments.",
      techStack: ["HTML5", "CSS3", "JavaScript (ES6+)", "Leaflet.js"],
      highlights: [
        "Interactive Leaflet.js map of proposed housing zones",
        "6 overlay districts with color-coded visualization",
        "Detailed parcel popups with block, lot, and owner info",
        "Dynamic legend with zoom-to-overlay functionality",
        "Fully responsive single-file project for easy integration",
      ],
      image: "/FairHousingMap.webp",
    },
    {
      name: "BeReal Export Manager",
      link: "https://github.com/SoPat712/BeReal-Export-Manager",
      description:
        "A Python utility that processes BeReal data exports, adding metadata and properly tagging exported photos, videos, and realmojis with timestamps and location info.",
      techStack: ["Python", "ExifTool", "JSON"],
      highlights: [
        "Parses BeReal export data including photos, BTS videos, and realmojis",
        "Adds metadata such as original capture date and location",
        "Supports custom output paths and timespan/year filters",
        "Fixes inconsistent BeReal timestamps using default timezone settings",
        "Flexible command-line options with ExifTool integration",
      ],
      image: "/bereal.webp",
    },
  ];

  type Project = (typeof projects)[number];
  type ProjectCategory = "All" | "Systems" | "Mobile" | "Web" | "Open Source";
  type ProjectSort = "Featured" | "Newest";

  const projectCategories: ProjectCategory[] = [
    "All",
    "Systems",
    "Mobile",
    "Web",
    "Open Source",
  ];

  const featuredProjectNames = new Set<string>([
    "Allstarr",
    "RUSwipeShare",
    "BlueBubbles Contribution",
    "Maisie Heardle",
    "BeReal Export Manager",
  ]);

  const projectOrder = new Map(
    projects.map((project, index) => [project.name, index]),
  );

  function inferProjectCategories(project: Project): ProjectCategory[] {
    const categories = new Set<ProjectCategory>();
    const stack = project.techStack.map((tech) => tech.toLowerCase()).join(" ");
    const text = `${project.description.toLowerCase()} ${project.name.toLowerCase()}`;

    if (
      stack.includes("flutter") ||
      stack.includes("android") ||
      stack.includes("ios") ||
      text.includes("android")
    ) {
      categories.add("Mobile");
    }

    if (
      stack.includes("svelte") ||
      stack.includes("react") ||
      stack.includes("html") ||
      stack.includes("css") ||
      stack.includes("javascript") ||
      stack.includes("leaflet")
    ) {
      categories.add("Web");
    }

    if (
      stack.includes("c#") ||
      stack.includes(".net") ||
      stack.includes("python") ||
      stack.includes("rust") ||
      stack.includes("go") ||
      text.includes("server") ||
      text.includes("self-hosted") ||
      text.includes("utility")
    ) {
      categories.add("Systems");
    }

    if (
      text.includes("open-source") ||
      text.includes("open source") ||
      text.includes("fork") ||
      text.includes("contributed")
    ) {
      categories.add("Open Source");
    }

    if (categories.size === 0) {
      categories.add("Web");
    }

    return Array.from(categories);
  }

  const projectsWithMeta = projects.map((project) => ({
    ...project,
    categories: inferProjectCategories(project),
    featured: featuredProjectNames.has(project.name),
  }));

  const projectScreenshotMap: Record<string, string[]> = {
    Allstarr: ["/jellyfin.webp"],
    RUSwipeShare: ["/RuSwipeShare.webp", "/RuSwipeShare.png"],
    TrackCovid19: ["/TrackCovid19.webp", "/TrackCovid19.png"],
    "BlueBubbles Contribution": ["/BlueBubbles.webp", "/BlueBubbles.png"],
    "Terminal Portfolio": ["/favicon.png"],
    "VideoSpeed Extension (Fork)": ["/VideoSpeed.webp", "/VideoSpeed.png"],
    "Maisie Heardle": ["/MaisieHeardle.webp", "/MaisieHeardle.png"],
    "Fair Housing Map": ["/FairHousingMap.webp", "/FairHousingMap.png"],
    "BeReal Export Manager": ["/bereal.webp", "/BeRealExportManager.webp"],
  };

  function screenshotKey(path: string): string {
    const name = path.split("/").pop() ?? path;
    return name.replace(/\.[^/.]+$/, "").toLowerCase();
  }

  function uniqueScreenshots(paths: string[]): string[] {
    const seen = new Set<string>();
    const deduped: string[] = [];
    paths.forEach((path) => {
      const key = screenshotKey(path);
      if (seen.has(key)) return;
      seen.add(key);
      deduped.push(path);
    });
    return deduped;
  }

  const projectsWithCaseStudy = projectsWithMeta.map((project) => ({
    ...project,
    caseStudy: {
      problem: project.description,
      contribution: project.highlights.slice(0, 3),
      impactMetrics: [
        `${project.techStack.length}+ technologies integrated`,
        `${project.highlights.length} key capabilities shipped`,
        project.featured
          ? "Featured portfolio project with production-ready scope"
          : "Public repository with reproducible implementation",
      ],
      screenshots: uniqueScreenshots(
        projectScreenshotMap[project.name] ?? [project.image],
      ),
    },
  }));

  const bookCallUrl = "mailto:joshpatra12@gmail.com?subject=Book%20a%20Call";

  const nowBuilding = [
    {
      title: "Allstarr Provider Integrations",
      status: "In Progress",
      description:
        "Expanding playlist imports and provider compatibility for self-hosted music workflows.",
    },
    {
      title: "Portfolio v2 UX",
      status: "In Progress",
      description:
        "Adding case-study storytelling, command palette, and structured project deep-dives.",
    },
    {
      title: "Systems + Security Focus",
      status: "Active",
      description:
        "Applying Rutgers systems/security coursework directly into production and open-source projects.",
    },
  ];

  const testimonials = [
    {
      source: "Internship Reference",
      role: "Bergen's Promise",
      text: "Reference available on request. Focus areas included healthcare data analysis and quality compliance support.",
    },
    {
      source: "Open Source Collaboration",
      role: "Community Projects",
      text: "Reference available on request. Contributions emphasized UI polish, infrastructure migration, and release support.",
    },
    {
      source: "Academic Mentorship",
      role: "Rutgers CS / Philosophy",
      text: "Reference available on request. Emphasis on systems rigor, communication, and project delivery discipline.",
    },
  ];

  const devNotes = [
    {
      title: "Designing a Better Project Carousel",
      date: "February 2026",
      summary:
        "How I shifted from oversized cards to a compact track with smoother interaction and clearer hierarchy.",
      link: "#projects",
    },
    {
      title: "Lessons from Self-Hosted Music Infrastructure",
      date: "January 2026",
      summary:
        "Tradeoffs in API integration, metadata sync, and reliable playback architecture in Allstarr.",
      link: "https://github.com/SoPat712/allstarr",
    },
    {
      title: "Why Systems Thinking Improves Product UX",
      date: "December 2025",
      summary:
        "Applying low-level engineering constraints to create faster, more dependable user-facing experiences.",
      link: "https://github.com/SoPat712",
    },
  ];

  type NavSection = { id: string; label: string };
  const navSections: NavSection[] = [
    { id: "home", label: "home" },
    { id: "projects", label: "projects" },
    { id: "now", label: "now" },
    { id: "activity", label: "activity" },
    { id: "experience", label: "experience" },
    { id: "skills", label: "skills" },
    { id: "contact", label: "contact" },
  ];

  // Education Info
  const education = {
    university: "Rutgers, The State University of New Jersey - New Brunswick",
    degree: "Bachelor of Arts in Computer Science and Philosophy",
    graduation: "Expected May 2026",
    gpa: "3.75/4.0",
    courses: [
      {
        code: "01:198:428",
        name: "Intro to Computer Graphics",
        status: "In Progress",
      },
      { code: "01:198:419", name: "Computer Security", status: "Completed" },
      {
        code: "01:198:344",
        name: "Design & Analysis of Algorithms",
        status: "Completed",
      },
      { code: "01:198:214", name: "Systems Programming", status: "Completed" },
      { code: "01:198:352", name: "Internet Technology", status: "Completed" },
      {
        code: "01:198:211",
        name: "Computer Architecture",
        status: "Completed",
      },
      {
        code: "01:198:206",
        name: "Intr Discrete Strct II",
        status: "Completed",
      },
      {
        code: "01:198:205",
        name: "Intr Discrete Strct I",
        status: "Completed",
      },
      { code: "01:198:112", name: "Data Structures", status: "Completed" },
      {
        code: "01:198:111",
        name: "Intro to Computer Sci",
        status: "Completed",
      },
    ],
  };

  // Achievements
  const achievements = [
    {
      title: "Dean's List",
      date: "2021–Present",
      description: "Maintained Dean's List standing for all semesters.",
    },
    {
      title: "Open Source Contributor – 200+ Commits",
      date: "2022–Present",
      description:
        "Active contributor to widely-used open source projects, focusing on improving developer tooling and user experience.",
    },
    {
      title: "Volunteer Teacher – Code4Tomorrow",
      date: "2022",
      description:
        "Taught computer science fundamentals to underprivileged students through virtual workshops and hands-on exercises.",
    },
    {
      title: "Hackathon Runner-Up – RUHACK",
      date: "March 2023",
      description:
        "Runner-up at Rutgers' RUHACK for RUSwipeShare, a social app for sharing campus meal swipes using AI-driven matching.",
    },
  ];

  // Skills
  const skills = {
    languages: [
      "Python",
      "C/C++",
      "JavaScript/TypeScript",
      "Java",
      "SQL",
      "Rust",
      "Go",
      "Dart",
      "Swift/iOS",
    ],
    frontend: ["React", "Svelte", "Tailwind CSS", "HTML/CSS", "Flutter"],
    backend: ["Node.js", "Express", "Django", "Flask"],
    devops: [
      "Proxmox",
      "Docker",
      "Docker ESXi",
      "Microsoft Cloud Services",
      "Linux/Unix",
    ],
    databases: ["PostgreSQL", "MongoDB", "Redis", "MySQL", "SQLite"],
    tools: ["Git", "VSCode", "Neovim", "Jira"],
    spokenLanguages: ["English", "Bengali"],
  };

  const currentYear = new Date().getFullYear();
  const quickStats = [
    { label: "Years Coding", value: "10+" },
    { label: "Open-source Commits", value: "999+" },
    { label: "Languages Known", value: `${skills.languages.length}+` },
  ];

  // Active section for navigation
  let activeSection: string = "home";
  let sectionObserver: IntersectionObserver | null = null;

  function navigateTo(section: string) {
    activeSection = section;
    const el = document.getElementById(section);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }

  function initSectionObserver() {
    const sectionIds = navSections.map((item) => item.id);

    sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries[0]?.target.id) {
          activeSection = visibleEntries[0].target.id;
        }
      },
      {
        root: null,
        rootMargin: "-30% 0px -50% 0px",
        threshold: [0.25, 0.5, 0.75],
      },
    );

    sectionIds.forEach((id) => {
      const node = document.getElementById(id);
      if (node) {
        sectionObserver?.observe(node);
      }
    });
  }

  // Terminal
  let terminalHistory: Array<{ command: string; output: string }> = [
    { command: "whoami", output: profile.name },
    {
      command: "ls -la",
      output:
        "projects  now  activity  education  achievements  experience  skills  notes  contact",
    },
  ];
  let currentCommand: string = "";
  let terminalContainer: HTMLDivElement | null = null;
  let terminalInput: HTMLInputElement | null = null;

  // Variables for typewriter effect
  let typedName: string = "";
  let typedRole: string = "";
  let bioVisible: boolean = false;

  // Projects carousel state
  let selectedProjectCategory: ProjectCategory = "All";
  let projectSort: ProjectSort = "Featured";
  let currentProjectIndex = 0;
  let expandedProjectName: string | null = null;
  let touchStartX = 0;
  let touchEndX = 0;
  let carouselViewport: HTMLDivElement | null = null;
  let projectSlideElements: Array<HTMLElement | null> = [];
  let scrollRaf = 0;
  let scrollSettleTimer: ReturnType<typeof setTimeout> | null = null;
  let pendingProjectIndex = 0;
  let isProjectModalOpen = false;
  let selectedProject: (typeof projectsWithCaseStudy)[number] | null = null;

  // Command palette
  let isCommandPaletteOpen = false;
  let commandQuery = "";
  let commandPaletteIndex = 0;
  let commandPaletteInput: HTMLInputElement | null = null;

  type CommandPaletteItem = {
    id: string;
    label: string;
    description: string;
    type: "section" | "project" | "link";
    target: string;
  };

  const sectionCommandItems: CommandPaletteItem[] = navSections.map((item) => ({
    id: `section-${item.id}`,
    label: `Go to ${item.label}`,
    description: "Jump to section",
    type: "section",
    target: item.id,
  }));

  const projectCommandItems: CommandPaletteItem[] = projectsWithCaseStudy.map(
    (project) => ({
      id: `project-${project.name}`,
      label: project.name,
      description: "Open case study modal",
      type: "project",
      target: project.name,
    }),
  );

  const linkCommandItems: CommandPaletteItem[] = [
    {
      id: "link-resume",
      label: "Download Resume",
      description: "Open resume PDF",
      type: "link",
      target: "/Josh_Patra_Resume.pdf",
    },
    {
      id: "link-book-call",
      label: "Book a Call",
      description: "Open scheduling contact",
      type: "link",
      target: bookCallUrl,
    },
  ];

  $: commandPaletteItems = [
    ...sectionCommandItems,
    ...projectCommandItems,
    ...linkCommandItems,
  ];

  $: filteredCommandPaletteItems = commandPaletteItems.filter((item) => {
    const q = commandQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      item.label.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
    );
  });

  $: commandPaletteIndex = Math.min(
    commandPaletteIndex,
    Math.max(filteredCommandPaletteItems.length - 1, 0),
  );

  // GitHub snapshot
  type GithubRepo = {
    name: string;
    html_url: string;
    description: string | null;
    language: string | null;
    stargazers_count: number;
    updated_at: string;
  };

  const fallbackGithubRepos: GithubRepo[] = [
    {
      name: "allstarr",
      html_url: "https://github.com/SoPat712/allstarr",
      description:
        "Self-hosted music streaming server with Jellyfin integration",
      language: "C#",
      stargazers_count: 0,
      updated_at: new Date().toISOString(),
    },
    {
      name: "my-portfolio",
      html_url: "https://github.com/SoPat712/my-portfolio",
      description: "Terminal-inspired Svelte portfolio",
      language: "TypeScript",
      stargazers_count: 0,
      updated_at: new Date().toISOString(),
    },
  ];

  let githubRepos: GithubRepo[] = fallbackGithubRepos;
  let githubLoading = true;
  let githubError = "";

  const projectImageSourceSizes: Record<
    string,
    { width: number; height: number }
  > = {
    Allstarr: { width: 500, height: 500 },
    RUSwipeShare: { width: 1024, height: 1024 },
    TrackCovid19: { width: 500, height: 500 },
    "BlueBubbles Contribution": { width: 1024, height: 1024 },
    "Terminal Portfolio": { width: 512, height: 512 },
    "VideoSpeed Extension (Fork)": { width: 128, height: 128 },
    "Maisie Heardle": { width: 1500, height: 1500 },
    "Fair Housing Map": { width: 1500, height: 1500 },
    "BeReal Export Manager": { width: 249, height: 243 },
  };

  const knownProjectImageWidths = Object.values(projectImageSourceSizes).map(
    (size) => size.width,
  );
  const minKnownProjectImageWidth = Math.min(...knownProjectImageWidths);
  const maxKnownProjectImageWidth = Math.max(...knownProjectImageWidths);

  const swipeThreshold = 40;

  function sortedProjects<
    T extends Project & { categories: ProjectCategory[]; featured: boolean },
  >(list: T[]) {
    const copy = [...list];
    if (projectSort === "Featured") {
      return copy.sort((a, b) => {
        const featuredDiff = Number(b.featured) - Number(a.featured);
        if (featuredDiff !== 0) return featuredDiff;
        return (
          (projectOrder.get(a.name) ?? 0) - (projectOrder.get(b.name) ?? 0)
        );
      });
    }
    return copy.sort(
      (a, b) =>
        (projectOrder.get(a.name) ?? 0) - (projectOrder.get(b.name) ?? 0),
    );
  }

  $: filteredProjects =
    selectedProjectCategory === "All"
      ? projectsWithCaseStudy
      : projectsWithCaseStudy.filter((project) =>
          project.categories.includes(selectedProjectCategory),
        );

  $: carouselProjects = sortedProjects(filteredProjects);
  $: currentProject = carouselProjects[currentProjectIndex] ?? null;
  $: projectSlideElements = projectSlideElements.slice(
    0,
    carouselProjects.length,
  );

  $: if (currentProjectIndex > Math.max(carouselProjects.length - 1, 0)) {
    currentProjectIndex = 0;
  }

  function setProjectCategory(category: ProjectCategory) {
    selectedProjectCategory = category;
    currentProjectIndex = 0;
    expandedProjectName = null;
    void scrollToProject(0, "auto");
  }

  function setProjectSort(sort: ProjectSort) {
    projectSort = sort;
    currentProjectIndex = 0;
    expandedProjectName = null;
    void scrollToProject(0, "auto");
  }

  function previousCarouselProject() {
    if (carouselProjects.length < 2) return;
    currentProjectIndex =
      (currentProjectIndex - 1 + carouselProjects.length) %
      carouselProjects.length;
    expandedProjectName = null;
    void scrollToProject(currentProjectIndex);
  }

  function nextCarouselProject() {
    if (carouselProjects.length < 2) return;
    currentProjectIndex = (currentProjectIndex + 1) % carouselProjects.length;
    expandedProjectName = null;
    void scrollToProject(currentProjectIndex);
  }

  function jumpToProject(index: number) {
    currentProjectIndex = index;
    expandedProjectName = null;
    void scrollToProject(index);
  }

  function toggleProjectDetails(name: string) {
    expandedProjectName = expandedProjectName === name ? null : name;
  }

  function handleDetailsButtonClick(index: number, name: string) {
    if (currentProjectIndex !== index) {
      jumpToProject(index);
      return;
    }
    toggleProjectDetails(name);
  }

  function openProjectModal(project: (typeof projectsWithCaseStudy)[number]) {
    selectedProject = project;
    isProjectModalOpen = true;
  }

  function closeProjectModal() {
    isProjectModalOpen = false;
    selectedProject = null;
  }

  function handleProjectCardClick(index: number) {
    const project = carouselProjects[index];
    if (!project) return;
    if (currentProjectIndex !== index) {
      jumpToProject(index);
      return;
    }
    openProjectModal(project);
  }

  function openCommandPalette() {
    isCommandPaletteOpen = true;
    commandQuery = "";
    commandPaletteIndex = 0;
    void tick().then(() => {
      commandPaletteInput?.focus();
    });
  }

  function closeCommandPalette() {
    isCommandPaletteOpen = false;
    commandQuery = "";
    commandPaletteIndex = 0;
  }

  function executeCommandPaletteItem(item: CommandPaletteItem) {
    if (item.type === "section") {
      navigateTo(item.target);
    } else if (item.type === "project") {
      const project = projectsWithCaseStudy.find((p) => p.name === item.target);
      if (project) {
        openProjectModal(project);
      }
    } else if (item.type === "link") {
      window.open(item.target, "_blank", "noopener,noreferrer");
    }
    closeCommandPalette();
  }

  async function loadGithubSnapshot() {
    githubLoading = true;
    githubError = "";
    try {
      const perPage = 100;
      let page = 1;
      let allRepos: GithubRepo[] = [];

      while (true) {
        const response = await fetch(
          `https://api.github.com/users/SoPat712/repos?sort=updated&direction=desc&per_page=${perPage}&page=${page}`,
        );
        if (!response.ok) {
          throw new Error(`GitHub API returned ${response.status}`);
        }
        const reposPage = (await response.json()) as GithubRepo[];
        if (!reposPage.length) {
          break;
        }

        allRepos = [...allRepos, ...reposPage];

        if (reposPage.length < perPage || page > 25) {
          break;
        }
        page += 1;
      }

      githubRepos = allRepos
        .sort(
          (a, b) =>
            b.stargazers_count - a.stargazers_count ||
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
        )
        .slice(0, 6);
    } catch (error) {
      githubError =
        "Live GitHub data unavailable. Showing cached portfolio repos.";
      githubRepos = fallbackGithubRepos;
      console.error("GitHub snapshot load failed", error);
    } finally {
      githubLoading = false;
    }
  }

  function getProjectImageSourceSize(projectName: string) {
    return projectImageSourceSizes[projectName] ?? { width: 512, height: 512 };
  }

  function getProjectImagePaneWidth(projectName: string) {
    const { width } = getProjectImageSourceSize(projectName);
    if (maxKnownProjectImageWidth <= minKnownProjectImageWidth) return 220;
    const normalized =
      (width - minKnownProjectImageWidth) /
      (maxKnownProjectImageWidth - minKnownProjectImageWidth);
    // Keep card width stable, but bias more horizontal space to images.
    return Math.round(290 + normalized * 210);
  }

  function handleCarouselTouchStart(e: TouchEvent) {
    touchStartX = e.changedTouches[0]?.clientX ?? 0;
  }

  function handleCarouselTouchEnd(e: TouchEvent) {
    touchEndX = e.changedTouches[0]?.clientX ?? 0;
    if (Math.abs(touchStartX - touchEndX) < swipeThreshold) return;
    if (touchStartX > touchEndX) {
      nextCarouselProject();
      return;
    }
    previousCarouselProject();
  }

  async function scrollToProject(
    index: number,
    behavior: ScrollBehavior = "smooth",
  ) {
    await tick();
    const projectSlide = projectSlideElements[index];
    projectSlide?.scrollIntoView({
      behavior,
      block: "nearest",
      inline: "center",
    });
  }

  function handleCarouselScroll() {
    if (!carouselViewport || projectSlideElements.length === 0) return;
    if (scrollRaf) {
      cancelAnimationFrame(scrollRaf);
    }
    scrollRaf = requestAnimationFrame(() => {
      if (!carouselViewport) return;
      const viewportBounds = carouselViewport.getBoundingClientRect();
      const viewportCenter = viewportBounds.left + viewportBounds.width / 2;
      let bestIndex = currentProjectIndex;
      let minDistance = Number.POSITIVE_INFINITY;

      projectSlideElements.forEach((slide, index) => {
        if (!slide) return;
        const bounds = slide.getBoundingClientRect();
        const slideCenter = bounds.left + bounds.width / 2;
        const distance = Math.abs(slideCenter - viewportCenter);
        if (distance < minDistance) {
          minDistance = distance;
          bestIndex = index;
        }
      });

      pendingProjectIndex = bestIndex;
      if (scrollSettleTimer) {
        clearTimeout(scrollSettleTimer);
      }
      scrollSettleTimer = setTimeout(() => {
        currentProjectIndex = pendingProjectIndex;
      }, 120);
      scrollRaf = 0;
    });
  }

  function handleGlobalKeydown(e: KeyboardEvent) {
    const isMetaK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
    if (isMetaK) {
      e.preventDefault();
      if (isCommandPaletteOpen) {
        closeCommandPalette();
      } else {
        openCommandPalette();
      }
      return;
    }

    if (isCommandPaletteOpen) {
      if (e.key === "Escape") {
        closeCommandPalette();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        commandPaletteIndex = Math.min(
          commandPaletteIndex + 1,
          Math.max(filteredCommandPaletteItems.length - 1, 0),
        );
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        commandPaletteIndex = Math.max(commandPaletteIndex - 1, 0);
        return;
      }
      if (e.key === "Enter") {
        const item = filteredCommandPaletteItems[commandPaletteIndex];
        if (item) {
          e.preventDefault();
          executeCommandPaletteItem(item);
        }
        return;
      }
    }

    if (isProjectModalOpen && e.key === "Escape") {
      closeProjectModal();
      return;
    }
    if (isProjectModalOpen) {
      return;
    }

    const activeTag = (document.activeElement?.tagName || "").toLowerCase();
    if (
      activeTag === "input" ||
      activeTag === "textarea" ||
      activeTag === "select"
    )
      return;
    if (e.key === "ArrowLeft") {
      previousCarouselProject();
    } else if (e.key === "ArrowRight") {
      nextCarouselProject();
    }
  }

  function typeWriter(
    text: string,
    setter: (val: string) => void,
    delay: number,
  ): Promise<void> {
    return new Promise<void>((resolve: () => void) => {
      let i = 0;
      const interval = setInterval(() => {
        setter(text.slice(0, i + 1));
        i++;
        if (i >= text.length) {
          clearInterval(interval);
          resolve();
        }
      }, delay);
    });
  }

  onMount(() => {
    let isActive = true;
    window.addEventListener("keydown", handleGlobalKeydown);

    const startTypeAnimation = async () => {
      if (terminalInput) {
        terminalInput.focus();
      }
      await typeWriter(
        profile.name,
        (val: string) => {
          if (isActive) typedName = val;
        },
        150,
      );
      await typeWriter(
        profile.role,
        (val: string) => {
          if (isActive) typedRole = val;
        },
        50,
      );
      if (isActive) {
        bioVisible = true;
      }
    };

    startTypeAnimation();
    initSectionObserver();
    void loadGithubSnapshot();

    return () => {
      isActive = false;
      if (scrollRaf) {
        cancelAnimationFrame(scrollRaf);
      }
      if (scrollSettleTimer) {
        clearTimeout(scrollSettleTimer);
      }
      sectionObserver?.disconnect();
      window.removeEventListener("keydown", handleGlobalKeydown);
    };
  });

  function executeCommand() {
    if (!currentCommand.trim()) return;

    let output = "";
    const cmd = currentCommand.toLowerCase().trim();

    if (cmd === "help") {
      output = `Available commands:
- help: Show this help
- clear: Clear terminal
- whoami: Display name
- ls: List sections
- cat [section]: View section (projects, now, activity, education, achievements, experience, skills, notes)
- contact: Display contact info`;
    } else if (cmd === "clear") {
      terminalHistory = [];
      currentCommand = "";
      return;
    } else if (cmd === "whoami") {
      output = profile.name;
    } else if (cmd === "ls" || cmd === "ls -la") {
      output =
        "projects  now  activity  education  achievements  experience  skills  notes  contact";
    } else if (cmd.startsWith("cat ")) {
      const section = cmd.substring(4);
      if (section === "projects") {
        navigateTo("projects");
        output = "Navigating to projects section...";
      } else if (section === "now") {
        navigateTo("now");
        output = "Navigating to now section...";
      } else if (section === "activity") {
        navigateTo("activity");
        output = "Navigating to activity section...";
      } else if (section === "education") {
        navigateTo("education");
        output = "Navigating to education section...";
      } else if (section === "achievements") {
        navigateTo("achievements");
        output = "Navigating to achievements section...";
      } else if (section === "experience") {
        navigateTo("experience");
        output = "Navigating to experience section...";
      } else if (section === "skills") {
        navigateTo("skills");
        output = "Navigating to skills section...";
      } else if (section === "notes") {
        navigateTo("notes");
        output = "Navigating to notes section...";
      } else {
        output = `cat: ${section}: No such file or directory`;
      }
    } else if (cmd === "contact") {
      navigateTo("contact");
      output = "Navigating to contact section...";
    } else {
      output = `Command not found: ${currentCommand}. Type 'help' for available commands.`;
    }

    terminalHistory = [...terminalHistory, { command: currentCommand, output }];
    currentCommand = "";

    setTimeout(() => {
      if (terminalContainer) {
        terminalContainer.scrollTop = terminalContainer.scrollHeight;
      }
    }, 0);
  }

  function handleKeyPress(e: KeyboardEvent) {
    if (e.key === "Enter") {
      executeCommand();
    }
  }

  function bindTerminalContainer(node: HTMLDivElement) {
    terminalContainer = node;
    return {
      destroy() {
        terminalContainer = null;
      },
    };
  }

  // Store user input for contact form
  let userName: string = "";
  let userEmail: string = "";
  let userMessage: string = "";

  let contactErrors: { name: string; email: string; message: string } = {
    name: "",
    email: "",
    message: "",
  };

  function validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validateContactForm(): boolean {
    contactErrors = { name: "", email: "", message: "" };

    if (userName.trim().length < 2) {
      contactErrors.name = "Please enter your full name.";
    }
    if (!validateEmail(userEmail.trim())) {
      contactErrors.email = "Please enter a valid email address.";
    }
    if (userMessage.trim().length < 20) {
      contactErrors.message = "Message should be at least 20 characters.";
    }

    return (
      !contactErrors.name && !contactErrors.email && !contactErrors.message
    );
  }

  function submitContactForm() {
    if (!validateContactForm()) {
      return;
    }

    const trimmedName = userName.trim();
    const trimmedEmail = userEmail.trim();
    const trimmedMessage = userMessage.trim();
    const subject = `Portfolio Contact from ${trimmedName}`;
    const body = `Hi,\n\nI'm ${trimmedName}\n\nI'm reaching out about the below:\n\n${trimmedMessage}\n\nThanks,\n${trimmedName}\n${trimmedEmail}`;
    const mailtoUrl = `mailto:joshpatra12@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;

    userName = "";
    userEmail = "";
    userMessage = "";
    contactErrors = { name: "", email: "", message: "" };
  }
</script>

<svelte:head>
  <title>Josh's Portfolio</title>
</svelte:head>

<main class="min-h-screen bg-black text-gray-200 font-mono pb-20">
  <!-- Header with fixed terminal -->
  <header
    class="sticky top-0 z-10 bg-gray-900 border-b border-gray-700 px-4 py-3"
  >
    <div
      class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center"
    >
      <div class="flex items-center">
        <div class="flex h-3 space-x-1.5 mr-4">
          <div class="w-3 h-3 rounded-full bg-red-500"></div>
          <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div class="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <h1 class="text-xl font-bold text-green-400">joshp@portfolio:~$</h1>
      </div>
      <!-- Navigation -->
      <nav class="mt-3 md:mt-0 w-full md:w-auto">
        <ul class="flex flex-wrap items-center gap-2 md:gap-3">
          {#each navSections as section}
            <li>
              <button
                class={`px-2.5 py-1 rounded-md transition ${
                  activeSection === section.id
                    ? "text-green-300 bg-green-900/40 border border-green-700/60"
                    : "text-blue-300 hover:text-blue-200 border border-transparent hover:border-gray-700"
                }`}
                on:click={() => navigateTo(section.id)}
              >
                {section.label}
              </button>
            </li>
          {/each}
          <li>
            <button
              class="px-2.5 py-1 rounded-md text-gray-300 border border-gray-700 hover:border-green-600"
              on:click={openCommandPalette}
            >
              ⌘K
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </header>

  <!-- Interactive Terminal Section -->
  <section class="bg-gray-900 border-b border-gray-700">
    <div class="max-w-6xl mx-auto p-4">
      <div
        class="bg-black border border-gray-700 rounded-md p-3 font-mono text-sm"
      >
        <div class="h-48 overflow-y-auto" use:bindTerminalContainer>
          {#each terminalHistory as entry}
            <div class="mb-2">
              <div class="flex">
                <span class="text-green-400 mr-2">joshp@portfolio:~$</span>
                <span>{entry.command}</span>
              </div>
              <div class="whitespace-pre-wrap pl-4 text-gray-400">
                {entry.output}
              </div>
            </div>
          {/each}
          <div class="flex">
            <span class="text-green-400 mr-2">joshp@portfolio:~$</span>
            <input
              type="text"
              bind:value={currentCommand}
              on:keydown={handleKeyPress}
              bind:this={terminalInput}
              class="bg-transparent border-none outline-none flex-grow text-white"
              placeholder="Type 'help' for commands..."
            />
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Content Sections -->
  <div class="max-w-6xl mx-auto px-4">
    <!-- Home/About Section -->
    <section
      id="home"
      class="pt-6 md:pt-8 pb-20 border-b border-gray-800 scroll-mt-16"
    >
      <div class="grid lg:grid-cols-[1.35fr_0.9fr] gap-8">
        <div
          class="bg-gray-900/70 border border-gray-700 rounded-2xl p-6 md:p-8"
        >
          <p class="text-green-400 mb-3 text-sm md:text-base">
            joshp@portfolio:~$ intro --profile
          </p>
          <h1 class="text-4xl md:text-5xl font-bold mb-3 tracking-tight">
            <span class="text-green-300">❯ {typedName}</span>
          </h1>
          <h2 class="text-xl md:text-2xl text-gray-300 mb-5">{typedRole}</h2>
          <p class="text-gray-300 leading-relaxed mb-6 max-w-3xl">
            {profile.bio}
          </p>

          <div class="quick-stats-row mb-7">
            {#each quickStats as stat}
              <div class="stat-chip">
                <span class="stat-chip-label">{stat.label}</span>
                <span class="stat-chip-value">{stat.value}</span>
              </div>
            {/each}
          </div>

          <div class="flex flex-wrap gap-3">
            <button
              class="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md transition"
              on:click={() => navigateTo("projects")}
            >
              View Projects
            </button>
            <a
              href="/Josh_Patra_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              class="px-4 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-md transition"
            >
              Download Resume
            </a>
            <a
              href={bookCallUrl}
              class="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition border border-gray-600"
            >
              Book a Call
            </a>
          </div>
        </div>

        <aside class="bg-gray-900/70 border border-gray-700 rounded-2xl p-6">
          <img
            src={profile.avatar}
            alt={profile.name}
            class="rounded-xl w-full max-w-[340px] h-[340px] object-cover mx-auto border-2 border-green-500/70"
          />
          <div class="mt-5 space-y-3 text-sm">
            <div class="bg-gray-800/80 border border-gray-700 rounded-md p-3">
              <p class="text-green-300">status</p>
              <p class="text-gray-300">
                Building systems-focused products and open-source tools.
              </p>
            </div>
            <div class="bg-gray-800/80 border border-gray-700 rounded-md p-3">
              <p class="text-green-300">focus</p>
              <p class="text-gray-300">
                Architecture, infrastructure, and production UX quality.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </section>

    <!-- Projects Section -->
    <section id="projects" class="py-20 border-b border-gray-800 scroll-mt-16">
      <div class="flex flex-col gap-6 mb-8">
        <div
          class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6"
        >
          <div>
            <h2 class="text-3xl font-bold text-green-400">❯ Projects</h2>
          </div>
          <div class="flex flex-col sm:flex-row gap-3">
            <div class="flex flex-wrap gap-2">
              {#each projectCategories as category}
                <button
                  class={`px-3 py-1.5 rounded-full border text-sm transition ${
                    selectedProjectCategory === category
                      ? "bg-green-600/20 border-green-500 text-green-300"
                      : "bg-gray-900 border-gray-700 text-gray-300 hover:border-green-600"
                  }`}
                  on:click={() => setProjectCategory(category)}
                >
                  {category}
                </button>
              {/each}
            </div>
            <select
              class="bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200"
              bind:value={projectSort}
              on:change={(e) =>
                setProjectSort(
                  (e.currentTarget as HTMLSelectElement).value as ProjectSort,
                )}
            >
              <option value="Featured">Sort: Featured</option>
              <option value="Newest">Sort: Newest</option>
            </select>
          </div>
        </div>
      </div>

      {#if currentProject}
        <div class="relative">
          <button
            class="carousel-arrow left-0"
            on:click={previousCarouselProject}
            aria-label="Previous project"
          >
            &#8249;
          </button>
          <button
            class="carousel-arrow right-0"
            on:click={nextCarouselProject}
            aria-label="Next project"
          >
            &#8250;
          </button>

          <div
            class="carousel-viewport"
            bind:this={carouselViewport}
            on:touchstart={handleCarouselTouchStart}
            on:touchend={handleCarouselTouchEnd}
            on:scroll={handleCarouselScroll}
          >
            <div class="carousel-track">
              {#each carouselProjects as project, index (project.name)}
                <div
                  class={`carousel-project-card bg-gray-900/90 rounded-xl border overflow-hidden ${
                    currentProjectIndex === index
                      ? "is-active border-green-600/40"
                      : "is-inactive border-gray-700"
                  }`}
                  style={`--image-pane-width: ${getProjectImagePaneWidth(project.name)}px;`}
                  bind:this={projectSlideElements[index]}
                  on:click={() => handleProjectCardClick(index)}
                  on:keydown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleProjectCardClick(index);
                    }
                  }}
                  role="button"
                  tabindex="0"
                  aria-current={currentProjectIndex === index
                    ? "true"
                    : undefined}
                >
                  <div class="project-card-grid">
                    <div class="project-image-pane">
                      <img
                        src={project.image}
                        alt={project.name}
                        class="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div class="project-text-pane p-5 md:p-6">
                      <div class="project-text-content">
                        <div class="flex flex-wrap items-center gap-2 mb-3">
                          {#if project.featured}
                            <span
                              class="bg-green-600/20 text-green-300 border border-green-700 text-xs px-2 py-1 rounded"
                              >Featured</span
                            >
                          {/if}
                          {#each project.categories as category}
                            <span
                              class="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded"
                              >{category}</span
                            >
                          {/each}
                        </div>
                        <h3 class="text-2xl font-semibold mb-2">
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="text-blue-400 hover:underline"
                            on:click|stopPropagation
                          >
                            {project.name}
                          </a>
                        </h3>
                        <p
                          class="project-description text-gray-300 leading-relaxed"
                        >
                          {project.description}
                        </p>

                        <div class="mt-4 flex flex-wrap gap-2">
                          {#each project.techStack.slice(0, 4) as tech}
                            <span class="bg-gray-800 text-xs px-2 py-1 rounded"
                              >{tech}</span
                            >
                          {/each}
                          {#if project.techStack.length > 4}
                            <span class="bg-gray-800 text-xs px-2 py-1 rounded">
                              +{project.techStack.length - 4} more
                            </span>
                          {/if}
                        </div>

                        {#if expandedProjectName === project.name && currentProjectIndex === index}
                          <div
                            class="mt-5 pt-4 border-t border-gray-700 details-panel"
                          >
                            <h4 class="text-green-400 mb-2">Key Features</h4>
                            <ul class="list-disc pl-5 text-gray-300 space-y-1">
                              {#each project.highlights as highlight}
                                <li>{highlight}</li>
                              {/each}
                            </ul>
                          </div>
                        {/if}
                      </div>

                      <div
                        class="project-actions mt-4 pt-3 border-t border-gray-700/70"
                      >
                        <button
                          class="px-3 py-1.5 rounded-md border border-gray-600 hover:border-green-500 text-sm text-gray-200"
                          on:click|stopPropagation={() =>
                            handleDetailsButtonClick(index, project.name)}
                        >
                          {expandedProjectName === project.name &&
                          currentProjectIndex === index
                            ? "Hide details"
                            : "Show details"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </div>

        <div class="mt-5 flex justify-center gap-2 flex-wrap">
          {#each carouselProjects as project, index}
            <button
              class={`h-2 rounded-full transition-all ${
                currentProjectIndex === index
                  ? "w-8 bg-green-500"
                  : "w-2 bg-gray-600 hover:bg-gray-500"
              }`}
              on:click={() => jumpToProject(index)}
              aria-label={`Jump to ${project.name}`}
              title={project.name}
            ></button>
          {/each}
        </div>
      {:else}
        <div
          class="bg-gray-900 border border-gray-700 rounded-lg p-6 text-gray-400"
        >
          No projects found for this filter.
        </div>
      {/if}
    </section>

    <!-- Now / Currently Building -->
    <section id="now" class="py-20 border-b border-gray-800 scroll-mt-16">
      <h2 class="text-3xl font-bold mb-8 text-green-400">❯ Now / Currently Building</h2>
      <div class="grid md:grid-cols-3 gap-5">
        {#each nowBuilding as item}
          <article class="bg-gray-900 border border-gray-700 rounded-xl p-5">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-lg font-semibold text-blue-300">{item.title}</h3>
              <span class="text-xs px-2 py-1 rounded bg-green-900/50 text-green-300 border border-green-700/60">
                {item.status}
              </span>
            </div>
            <p class="text-gray-300">{item.description}</p>
          </article>
        {/each}
      </div>
    </section>

    <!-- GitHub Activity -->
    <section id="activity" class="py-20 border-b border-gray-800 scroll-mt-16">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-3xl font-bold text-green-400">
          ❯ GitHub Activity Snapshot
          {#if !githubLoading}
            <span class="text-base text-gray-400 ml-2">({githubRepos.length} repos)</span>
          {/if}
        </h2>
        <a
          href="https://github.com/SoPat712"
          target="_blank"
          rel="noopener noreferrer"
          class="text-sm text-blue-300 hover:underline"
        >
          View full profile
        </a>
      </div>
      {#if githubLoading}
        <div class="bg-gray-900 border border-gray-700 rounded-xl p-6 text-gray-400">
          Loading latest repositories...
        </div>
      {:else}
        {#if githubError}
          <p class="text-amber-300 text-sm mb-4">{githubError}</p>
        {/if}
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {#each githubRepos as repo}
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              class="bg-gray-900 border border-gray-700 rounded-xl p-5 hover:border-green-500/70 transition"
            >
              <h3 class="text-lg font-semibold text-blue-300 mb-2">{repo.name}</h3>
              <p class="text-gray-300 text-sm mb-4 repo-description-clamp">
                {repo.description || "No description provided."}
              </p>
              <div class="flex justify-between items-center text-xs text-gray-400">
                <span>{repo.language || "N/A"}</span>
                <span class="repo-stars">
                  <span class="repo-stars-icon" aria-hidden="true">★</span>
                  <span class="repo-stars-count">{repo.stargazers_count}</span>
                </span>
              </div>
            </a>
          {/each}
        </div>
      {/if}
    </section>

    <!-- Testimonials -->
    <section id="testimonials" class="py-20 border-b border-gray-800 scroll-mt-16">
      <h2 class="text-3xl font-bold mb-8 text-green-400">❯ References</h2>
      <div class="grid md:grid-cols-3 gap-5">
        {#each testimonials as testimonial}
          <article class="bg-gray-900 border border-gray-700 rounded-xl p-5">
            <p class="text-gray-300 leading-relaxed mb-4">{testimonial.text}</p>
            <p class="text-green-300 text-sm font-semibold">{testimonial.source}</p>
            <p class="text-gray-400 text-xs">{testimonial.role}</p>
          </article>
        {/each}
      </div>
    </section>

    <!-- Education Section -->
    <section id="education" class="py-20 border-b border-gray-800 scroll-mt-16">
      <h2 class="text-3xl font-bold mb-8 text-green-400">❯ Education</h2>
      <div
        class="bg-gray-900 rounded-lg overflow-hidden border border-gray-700 p-6"
      >
        <div class="flex flex-col md:flex-row justify-between mb-4">
          <div>
            <h3 class="text-2xl font-semibold">{education.university}</h3>
            <p class="text-gray-400">{education.degree}</p>
          </div>
          <div class="mt-2 md:mt-0 text-right">
            <p class="text-green-400">{education.graduation}</p>
            <p class="text-gray-400">GPA: {education.gpa}</p>
          </div>
        </div>
        <div class="mt-8">
          <h4 class="text-xl font-semibold mb-4 text-blue-400">
            Relevant Coursework
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {#each education.courses as course}
              <div class="bg-gray-800 p-4 rounded">
                <div class="flex justify-between">
                  <span>{course.code}</span>
                  <span class="text-green-400">{course.status}</span>
                </div>
                <p class="text-gray-300">{course.name}</p>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </section>

    <!-- Achievements Section -->
    <section
      id="achievements"
      class="py-20 border-b border-gray-800 scroll-mt-16"
    >
      <h2 class="text-3xl font-bold mb-8 text-green-400">❯ Achievements</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        {#each achievements as achievement}
          <div
            class="bg-gray-900 border border-gray-700 rounded-lg p-6 hover:border-green-500 transition duration-300"
          >
            <h3 class="text-xl font-semibold mb-2 text-blue-400">
              {achievement.title}
            </h3>
            <p class="text-green-400 text-sm mb-3">{achievement.date}</p>
            <p class="text-gray-300">{achievement.description}</p>
          </div>
        {/each}
      </div>
    </section>

    <!-- Experience Section -->
    <section
      id="experience"
      class="py-20 border-b border-gray-800 scroll-mt-16"
    >
      <h2 class="text-3xl font-bold mb-8 text-green-400">❯ Experience</h2>
      <div class="space-y-8">
        {#each experiences as exp}
          <div
            class="bg-gray-900 border border-gray-700 rounded-lg p-6 hover:border-green-500 transition duration-300"
          >
            <h3 class="text-xl font-semibold mb-2 text-blue-400">
              {exp.role} – {exp.company}
            </h3>
            <p class="text-green-400 text-sm mb-3">
              {exp.location} | {exp.duration}
            </p>
            <ul class="list-disc pl-5 text-gray-300">
              {#each exp.responsibilities as responsibility}
                <li>{responsibility}</li>
              {/each}
            </ul>
          </div>
        {/each}
      </div>
    </section>

    <!-- Skills Section -->
    <section id="skills" class="py-20 border-b border-gray-800 scroll-mt-16">
      <h2 class="text-3xl font-bold mb-8 text-green-400">❯ Skills</h2>
      <div class="space-y-8">
        <div>
          <h3 class="text-xl font-semibold mb-4 text-blue-400">
            Programming Languages
          </h3>
          <div class="flex flex-wrap gap-3">
            {#each skills.languages as skill}
              <span class="bg-gray-800 px-3 py-2 rounded-md">{skill}</span>
            {/each}
          </div>
        </div>
        <div>
          <h3 class="text-xl font-semibold mb-4 text-blue-400">
            Frontend Development
          </h3>
          <div class="flex flex-wrap gap-3">
            {#each skills.frontend as skill}
              <span class="bg-gray-800 px-3 py-2 rounded-md">{skill}</span>
            {/each}
          </div>
        </div>
        <div>
          <h3 class="text-xl font-semibold mb-4 text-blue-400">
            Backend Development
          </h3>
          <div class="flex flex-wrap gap-3">
            {#each skills.backend as skill}
              <span class="bg-gray-800 px-3 py-2 rounded-md">{skill}</span>
            {/each}
          </div>
        </div>
        <div>
          <h3 class="text-xl font-semibold mb-4 text-blue-400">
            DevOps & Infrastructure
          </h3>
          <div class="flex flex-wrap gap-3">
            {#each skills.devops as skill}
              <span class="bg-gray-800 px-3 py-2 rounded-md">{skill}</span>
            {/each}
          </div>
        </div>
        <div>
          <h3 class="text-xl font-semibold mb-4 text-blue-400">Databases</h3>
          <div class="flex flex-wrap gap-3">
            {#each skills.databases as skill}
              <span class="bg-gray-800 px-3 py-2 rounded-md">{skill}</span>
            {/each}
          </div>
        </div>
        <div>
          <h3 class="text-xl font-semibold mb-4 text-blue-400">Tools</h3>
          <div class="flex flex-wrap gap-3">
            {#each skills.tools as tool}
              <span class="bg-gray-800 px-3 py-2 rounded-md">{tool}</span>
            {/each}
          </div>
        </div>
        <div>
          <h3 class="text-xl font-semibold mb-4 text-blue-400">
            Spoken Languages
          </h3>
          <div class="flex flex-wrap gap-3">
            {#each skills.spokenLanguages as lang}
              <span class="bg-gray-800 px-3 py-2 rounded-md">{lang}</span>
            {/each}
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <!-- Dev Notes -->
    <section id="notes" class="py-20 border-b border-gray-800 scroll-mt-16">
      <h2 class="text-3xl font-bold mb-8 text-green-400">❯ Dev Notes</h2>
      <div class="grid md:grid-cols-3 gap-5">
        {#each devNotes as note}
          <a
            href={note.link}
            target={note.link.startsWith("#") ? undefined : "_blank"}
            rel={note.link.startsWith("#") ? undefined : "noopener noreferrer"}
            class="bg-gray-900 border border-gray-700 rounded-xl p-5 hover:border-green-500/70 transition"
          >
            <p class="text-xs uppercase tracking-wide text-gray-400 mb-2">{note.date}</p>
            <h3 class="text-lg font-semibold text-blue-300 mb-3">{note.title}</h3>
            <p class="text-gray-300 text-sm leading-relaxed">{note.summary}</p>
          </a>
        {/each}
      </div>
    </section>

    <section id="contact" class="py-20 scroll-mt-16">
      <h2 class="text-3xl font-bold mb-8 text-green-400">❯ Contact</h2>
      <div class="bg-gray-900 rounded-lg border border-gray-700 p-6">
        <div class="flex flex-col md:flex-row gap-8">
          <div class="md:w-1/2">
            <h3 class="text-xl font-semibold mb-4 text-blue-400">
              Get In Touch
            </h3>
            <div class="space-y-3">
              <p class="flex items-center">
                <span class="text-green-400 mr-2">❯</span>
                <span class="text-gray-400 mr-2">Email:</span>
                <a
                  href="mailto:joshpatra12@gmail.com"
                  class="text-blue-400 hover:underline"
                >
                  joshpatra12@gmail.com
                </a>
              </p>
              <p class="flex items-center">
                <span class="text-green-400 mr-2">❯</span>
                <span class="text-gray-400 mr-2">GitHub:</span>
                <a
                  href="https://github.com/SoPat712"
                  class="text-blue-400 hover:underline"
                >
                  SoPat712
                </a>
              </p>
              <p class="flex items-center">
                <span class="text-green-400 mr-2">❯</span>
                <span class="text-gray-400 mr-2">LinkedIn:</span>
                <a
                  href="https://www.linkedin.com/in/joshpatra"
                  class="text-blue-400 hover:underline"
                >
                  joshpatra
                </a>
              </p>
            </div>
          </div>
          <!-- Right side: Send a Message -->
          <div class="md:w-1/2">
            <h3 class="text-xl font-semibold mb-4 text-blue-400">
              Send a Message
            </h3>
            <form class="space-y-4" on:submit|preventDefault={submitContactForm}>
              <div>
                <label for="name" class="block text-gray-400 mb-1">Name</label>
                <input
                  type="text"
                  id="name"
                  class="w-full bg-gray-800 border border-gray-700 text-white p-2 rounded-md focus:outline-none focus:border-green-500"
                  placeholder="Your name"
                  bind:value={userName}
                />
                {#if contactErrors.name}
                  <p class="text-red-300 text-xs mt-1">{contactErrors.name}</p>
                {/if}
              </div>
              <div>
                <label for="email" class="block text-gray-400 mb-1">Email</label
                >
                <input
                  type="email"
                  id="email"
                  class="w-full bg-gray-800 border border-gray-700 text-white p-2 rounded-md focus:outline-none focus:border-green-500"
                  placeholder="Your email"
                  bind:value={userEmail}
                />
                {#if contactErrors.email}
                  <p class="text-red-300 text-xs mt-1">{contactErrors.email}</p>
                {/if}
              </div>
              <div>
                <label for="message" class="block text-gray-400 mb-1"
                  >Message</label
                >
                <textarea
                  id="message"
                  rows="4"
                  class="w-full bg-gray-800 border border-gray-700 text-white p-2 rounded-md focus:outline-none focus:border-green-500"
                  placeholder="Your message"
                  bind:value={userMessage}
                ></textarea>
                {#if contactErrors.message}
                  <p class="text-red-300 text-xs mt-1">{contactErrors.message}</p>
                {/if}
              </div>
              <button
                type="submit"
                class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition"
              >
                Open Email Draft
              </button>
            </form>
            <p class="text-xs text-gray-500 mt-3">
              Prefer direct scheduling?
              <a href={bookCallUrl} class="text-blue-300 hover:underline">Book a call</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>

  {#if isCommandPaletteOpen}
    <div class="overlay-shell">
      <button
        class="overlay-backdrop"
        aria-label="Close command palette"
        on:click={closeCommandPalette}
      ></button>
      <div class="overlay-panel command-panel">
        <div class="command-header">
          <input
            bind:this={commandPaletteInput}
            bind:value={commandQuery}
            class="command-input"
            placeholder="Type a command or search projects..."
          />
          <span class="text-xs text-gray-500">ESC to close</span>
        </div>
        <div class="command-results">
          {#if filteredCommandPaletteItems.length === 0}
            <p class="text-sm text-gray-400 p-3">No command matches your query.</p>
          {:else}
            {#each filteredCommandPaletteItems as item, index}
              <button
                class={`command-result-item ${index === commandPaletteIndex ? "is-active" : ""}`}
                on:click={() => executeCommandPaletteItem(item)}
              >
                <span class="command-result-label">{item.label}</span>
                <span class="command-result-description">{item.description}</span>
              </button>
            {/each}
          {/if}
        </div>
      </div>
    </div>
  {/if}

  {#if isProjectModalOpen && selectedProject}
    <div class="overlay-shell">
      <button
        class="overlay-backdrop"
        aria-label="Close case study modal"
        on:click={closeProjectModal}
      ></button>
      <article class="overlay-panel case-study-modal">
        <header class="flex items-start justify-between gap-4 mb-5">
          <div>
            <p class="text-xs uppercase tracking-wide text-green-300 mb-2">Case Study</p>
            <h3 class="text-2xl md:text-3xl font-bold text-blue-300">{selectedProject.name}</h3>
          </div>
          <button
            class="rounded-md border border-gray-600 px-3 py-1.5 text-gray-200 hover:border-green-500"
            on:click={closeProjectModal}
          >
            Close
          </button>
        </header>

        <div class="grid md:grid-cols-2 gap-4 mb-6">
          {#each selectedProject.caseStudy.screenshots as shot}
            <img
              src={shot}
              alt={`${selectedProject.name} screenshot`}
              class="w-full h-48 md:h-56 object-cover rounded-lg border border-gray-700"
              loading="lazy"
            />
          {/each}
        </div>

        <div class="space-y-6">
          <section>
            <h4 class="text-green-300 text-lg mb-2">Problem</h4>
            <p class="text-gray-300 leading-relaxed">{selectedProject.caseStudy.problem}</p>
          </section>
          <section>
            <h4 class="text-green-300 text-lg mb-2">Contribution</h4>
            <ul class="list-disc pl-5 text-gray-300 space-y-1">
              {#each selectedProject.caseStudy.contribution as item}
                <li>{item}</li>
              {/each}
            </ul>
          </section>
          <section>
            <h4 class="text-green-300 text-lg mb-2">Stack</h4>
            <div class="flex flex-wrap gap-2">
              {#each selectedProject.techStack as tech}
                <span class="bg-gray-800 text-xs px-2 py-1 rounded border border-gray-700">{tech}</span>
              {/each}
            </div>
          </section>
          <section>
            <h4 class="text-green-300 text-lg mb-2">Impact Metrics</h4>
            <ul class="list-disc pl-5 text-gray-300 space-y-1">
              {#each selectedProject.caseStudy.impactMetrics as metric}
                <li>{metric}</li>
              {/each}
            </ul>
          </section>
        </div>

        <footer class="mt-7 flex flex-wrap gap-3">
          <a
            href={selectedProject.link}
            target="_blank"
            rel="noopener noreferrer"
            class="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white"
          >
            View Repository
          </a>
          <button
            class="px-4 py-2 rounded-md border border-gray-600 hover:border-green-500 text-gray-200"
            on:click={closeProjectModal}
          >
            Back to Carousel
          </button>
        </footer>
      </article>
    </div>
  {/if}

  <!-- Footer -->
  <footer class="bg-gray-900 border-t border-gray-800 mt-16 py-8">
    <div class="max-w-6xl mx-auto px-4 text-center">
      <p class="text-gray-400">
        Built with 💚 using SvelteKit and Tailwind CSS
      </p>
      <p class="text-gray-500 text-sm mt-2">
        © {currentYear} Josh Patra - All Rights Reserved
      </p>
    </div>
  </footer>
</main>

<style lang="css">
  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #1f2937;
  }

  ::-webkit-scrollbar-thumb {
    background: #4b5563;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #6b7280;
  }

  /* Animation for page elements */
  section {
    animation: fade-in 0.5s ease-out;
  }

  @keyframes fade-in {
    0% {
      opacity: 0;
      transform: translateY(10px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Blinking cursor for terminal */
  input::after {
    content: "|";
    animation: blink 1s step-end infinite;
  }

  @keyframes blink {
    from,
    to {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }

  .stat-chip {
    display: inline-flex;
    flex-direction: column;
    gap: 0.2rem;
    background: rgba(31, 41, 55, 0.9);
    border: 1px solid rgba(55, 65, 81, 1);
    border-radius: 0.65rem;
    padding: 0.65rem 0.8rem;
    min-width: 0;
    width: 100%;
    padding: 0.7rem 0.95rem;
  }

  .quick-stats-row {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.75rem;
  }

  .stat-chip-label {
    color: #9ca3af;
    font-size: 0.74rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .stat-chip-value {
    color: #d1d5db;
    font-size: 1.03rem;
    font-weight: 600;
  }

  .overlay-shell {
    position: fixed;
    inset: 0;
    z-index: 60;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }

  .overlay-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(3, 7, 18, 0.82);
    border: 0;
  }

  .overlay-panel {
    position: relative;
    z-index: 1;
    width: min(920px, 96vw);
    max-height: min(88vh, 920px);
    overflow-y: auto;
    border: 1px solid #374151;
    border-radius: 1rem;
    background: #0b1224;
    box-shadow: 0 25px 80px rgba(0, 0, 0, 0.45);
  }

  .command-panel {
    width: min(760px, 96vw);
  }

  .command-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    border-bottom: 1px solid #1f2937;
    padding: 0.85rem;
  }

  .command-input {
    width: 100%;
    border: 1px solid #374151;
    border-radius: 0.6rem;
    background: #0f172a;
    color: #f3f4f6;
    padding: 0.65rem 0.75rem;
    outline: none;
  }

  .command-input:focus {
    border-color: #10b981;
  }

  .command-results {
    padding: 0.65rem;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .command-result-item {
    width: 100%;
    text-align: left;
    border: 1px solid #1f2937;
    border-radius: 0.6rem;
    padding: 0.7rem;
    background: transparent;
    color: #d1d5db;
    display: flex;
    justify-content: space-between;
    gap: 0.75rem;
  }

  .command-result-item:hover,
  .command-result-item.is-active {
    border-color: rgba(16, 185, 129, 0.7);
    background: rgba(17, 24, 39, 0.9);
  }

  .command-result-label {
    font-weight: 600;
    color: #c7d2fe;
  }

  .command-result-description {
    color: #9ca3af;
    font-size: 0.8rem;
  }

  .case-study-modal {
    padding: 1.1rem 1.1rem 1.3rem;
  }

  .repo-description-clamp {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    line-clamp: 3;
  }

  .repo-stars {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    color: #facc15;
    font-weight: 700;
  }

  .repo-stars-icon {
    font-size: 1.1rem;
    line-height: 1;
  }

  .repo-stars-count {
    font-size: 0.98rem;
    line-height: 1;
  }

  .carousel-viewport {
    overflow-x: auto;
    overflow-y: visible;
    padding: 0.5rem 14%;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .carousel-viewport::-webkit-scrollbar {
    display: none;
  }

  .carousel-track {
    display: flex;
    gap: 1rem;
    align-items: stretch;
    width: max-content;
  }

  .carousel-project-card {
    flex: 0 0 auto;
    width: min(92vw, 980px);
    scroll-snap-align: center;
    cursor: pointer;
    box-shadow:
      0 0 10px rgba(52, 211, 153, 0.08),
      0 0 30px rgba(34, 197, 94, 0.04);
    transition:
      transform 0.45s cubic-bezier(0.22, 0.61, 0.36, 1),
      opacity 0.45s cubic-bezier(0.22, 0.61, 0.36, 1),
      box-shadow 0.35s ease,
      border-color 0.35s ease;
  }

  .carousel-project-card.is-active {
    opacity: 1;
    transform: scale(1);
    box-shadow:
      0 0 20px rgba(52, 211, 153, 0.2),
      0 0 50px rgba(52, 211, 153, 0.12);
  }

  .carousel-project-card.is-inactive {
    opacity: 0.42;
    transform: scale(0.94);
  }

  .carousel-project-card.is-inactive:hover {
    opacity: 0.55;
    border-color: rgba(52, 211, 153, 0.5);
  }

  .project-card-grid {
    display: flex;
    align-items: stretch;
    height: 100%;
    gap: 0.9rem;
    padding-inline: 0.8rem;
    padding-block: 0.55rem;
  }

  .project-image-pane {
    flex: 0 0 var(--image-pane-width, 220px);
    overflow: hidden;
    position: relative;
    min-height: 100%;
    --image-inset: 0;
  }

  .project-image-pane img {
    position: absolute;
    inset: var(--image-inset);
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    border-radius: 0.45rem;
  }

  .project-text-pane {
    flex: 1 1 auto;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  .project-text-content {
    min-height: 0;
  }

  .project-actions {
    flex-shrink: 0;
  }

  .project-description {
    transition: color 0.25s ease;
  }

  .details-panel {
    max-height: none;
    overflow: visible;
  }

  .carousel-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    height: 2rem;
    width: 2rem;
    font-size: 1rem;
    line-height: 1;
    border-radius: 9999px;
    border: 1px solid #374151;
    background: rgba(17, 24, 39, 0.92);
    color: #e5e7eb;
    z-index: 3;
    transition:
      border-color 0.2s ease,
      transform 0.2s ease;
  }

  .carousel-arrow:hover {
    border-color: #10b981;
    transform: translateY(-50%) scale(1.04);
  }

  .carousel-arrow.left-0 {
    left: 0.5rem;
  }

  .carousel-arrow.right-0 {
    right: 0.5rem;
  }

  @media (min-width: 768px) {
    .carousel-arrow.left-0 {
      left: 1rem;
    }

    .carousel-arrow.right-0 {
      right: 1rem;
    }
  }

  @media (max-width: 1023px) {
    .carousel-viewport {
      padding-inline: 8%;
    }
  }

  @media (min-width: 768px) {
    .project-text-pane {
      height: auto;
      overflow: visible;
    }

    .project-text-content {
      overflow: visible;
    }
  }

  @media (max-width: 767px) {
    .carousel-viewport {
      padding-inline: 3%;
    }
    .project-card-grid {
      display: block;
      padding-inline: 0.45rem;
      padding-block: 0.45rem;
      gap: 0;
    }
    .project-image-pane {
      width: 100%;
      height: 12rem;
    }
    .project-text-pane {
      width: auto;
      height: auto;
    }
    .project-text-content {
      overflow: visible;
    }
    .carousel-arrow {
      display: none;
    }
  }
</style>
