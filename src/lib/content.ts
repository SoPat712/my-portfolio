// Everything the desktop says about Josh. The windows, terminal, launcher and grep all read from here.

export type Category = "Systems" | "Mobile" | "Web" | "Open Source";

export type Project = {
  slug: string;
  name: string;
  link: string;
  cats: Category[];
  featured: boolean;
  /** Path under static/. */
  img: string;
  /** Tile background behind the image. */
  tile: string;
  fit: "contain" | "cover";
  /** Inset for "contain" images. */
  pad?: string;
  description: string;
  stack: string[];
  highlights: string[];
};

export const PROFILE = {
  name: "Josh Patra",
  role: "Computer Science & Philosophy student at Rutgers",
  study: "B.A. Computer Science and Philosophy, Rutgers–New Brunswick",
  gpa: "3.75 / 4.0, Dean’s List",
  focus: "Systems, infrastructure, self-hosting, open source",
  languages: "Python, C/C++, JavaScript/TypeScript, Java, SQL, Rust, Go, Dart, Swift/iOS",
  spoken: "English, Bengali",
  bio: "I work on system architecture, IT infrastructure, and low-level programming in UNIX/Linux environments. My projects also cover backend, frontend, and mobile development. At Rutgers, I study Computer Science and Philosophy with coursework in systems and security.",
  photo: "/headshot_square.webp",
  email: "joshpatra12@gmail.com",
  github: "https://github.com/SoPat712",
  githubUser: "SoPat712",
  linkedin: "https://www.linkedin.com/in/joshpatra",
  linkedinUser: "joshpatra",
  resume: "/Josh_Patra_Resume.pdf",
};

export const PROJECTS: Project[] = [
  {
    slug: "allstarr",
    name: "Allstarr",
    link: "https://github.com/SoPat712/allstarr",
    cats: ["Systems", "Open Source"],
    featured: true,
    img: "/jellyfin.svg",
    tile: "#0e1820",
    fit: "contain",
    pad: "27%",
    description:
      "An open-source C# and .NET API proxy that connects external music providers to Jellyfin. It handles playlist imports and provider compatibility for Spotify, Tidal, Qobuz, and Deezer.",
    stack: ["C#", ".NET 8", "Self-Hosting", "Jellyfin API", "Spotify API"],
    highlights: [
      "Built with C# and .NET 8",
      "Connects external music providers with Jellyfin libraries",
      "Supports importing playlists from Spotify and other providers",
      "Custom web interface for browsing and handling music, configuration, and imports",
      "Open source and designed for self-hosting on personal servers",
    ],
  },
  {
    slug: "degoog-toolkit",
    name: "degoog-toolkit",
    link: "https://github.com/SoPat712/degoog-toolkit",
    cats: ["Web", "Systems"],
    featured: true,
    img: "/degoog-toolkit.svg",
    tile: "#0f1b15",
    fit: "contain",
    pad: "17%",
    description:
      "A degoog store repository for SearXNG engines, search-result plugins, and themes. It lets degoog users connect self-hosted SearXNG instances, add rich result panels, and install privacy-focused search tooling from one repo.",
    stack: ["JavaScript", "CSS", "HTML", "SearXNG", "degoog"],
    highlights: [
      "Ships SearXNG engines for web, images, videos, news, and files",
      "Includes plugins for sports results, weather, currency conversion, TMDB panels, speed tests, search history, unit conversion, countdowns, and maps",
      "Adds configurable SearXNG URL, category, engine, and safe-search settings",
      "Provides a Google-like degoog theme with above-results plugin slots",
      "Designed as an installable degoog store repository for privacy-oriented search workflows",
    ],
  },
  {
    slug: "ruswipeshare",
    name: "RUSwipeShare",
    link: "https://github.com/SoPat712/RUSwipeShare",
    cats: ["Mobile", "Systems"],
    featured: true,
    img: "/RuSwipeShare.webp",
    tile: "#cc0a1e",
    fit: "cover",
    description: "A Flutter college meal-swipe trading app for students.",
    stack: ["Flutter", "Python/Flask", "Stripe API", "Firebase"],
    highlights: [
      "User authentication and authorization with Firebase",
      "Backend server communicating with Stripe API for in-app payments",
      "Real-time updates and notifications",
      "Meal-swipe listing and trading interface built with Flutter",
    ],
  },
  {
    slug: "trackcovid19",
    name: "TrackCovid19",
    link: "https://github.com/SoPat712/TrackCovid19",
    cats: ["Mobile"],
    featured: false,
    img: "/TrackCovid19.webp",
    tile: "#ecebe8",
    fit: "contain",
    pad: "6%",
    description:
      "An Android app that displays global COVID-19 data from public APIs with charts and country-level views.",
    stack: ["Java", "XML", "Public APIs"],
    highlights: [
      "Built for Android with Java and XML",
      "Real-time COVID-19 statistics from public APIs",
      "APK available for direct download and installation",
      "Android Studio project with source available on GitHub",
      "CI integrations for code quality and Gradle builds",
    ],
  },
  {
    slug: "bluebubbles",
    name: "BlueBubbles Contribution",
    link: "https://github.com/BlueBubblesApp/bluebubbles-app",
    cats: ["Mobile", "Open Source"],
    featured: true,
    img: "/BlueBubbles.webp",
    tile: "#e5edf7",
    fit: "contain",
    pad: "17%",
    description:
      "Contributions to the BlueBubbles open-source app across mobile and desktop UI, infrastructure, and its MongoDB migration.",
    stack: ["Android", "Dart/Flutter", "MongoDB"],
    highlights: [
      "Led front-end UI improvements across mobile and desktop platforms",
      "Contributed to the server migration to MongoDB",
      "Collaborated closely with the open-source community",
      "Assisted in the deployment of a major desktop app release",
    ],
  },
  {
    slug: "terminal-portfolio",
    name: "Terminal Portfolio",
    link: "https://github.com/SoPat712/my-portfolio",
    cats: ["Web"],
    featured: false,
    img: "/favicon.png",
    tile: "#1b1d1e",
    fit: "contain",
    pad: "14%",
    description:
      "This site: a SvelteKit and TypeScript portfolio built as a tiling window manager desktop. Workspaces hold the sections, with a working terminal, a launcher, and Vim keybindings on top of fully prerendered content.",
    stack: ["SvelteKit", "Svelte 5", "TypeScript", "CSS"],
    highlights: [
      "Tiling window manager with tile, monocle, and float layouts across five workspaces",
      "Terminal, fuzzy launcher, and read-only nvim buffers that all read from one content file",
      "Vim keybindings with a leader key, which-key popup, and link hints, and a setting to turn them off",
      "Prerendered for search engines and no-JS visitors, with a phone layout and reduced-motion support",
    ],
  },
  {
    slug: "speeder",
    name: "Speeder",
    link: "https://github.com/SoPat712/Speeder",
    cats: ["Web", "Open Source"],
    featured: true,
    img: "/VideoSpeed.webp",
    tile: "#f2eeec",
    fit: "contain",
    pad: "25%",
    description:
      "A Firefox WebExtension for controlling HTML5 video playback speed with an on-page controller, keyboard shortcuts, rewind and advance controls, and preferred-speed presets.",
    stack: ["JavaScript", "WebExtensions", "HTML5 Video API", "CSS"],
    highlights: [
      "Published as a Firefox add-on for HTML5 video speed control",
      "Keyboard shortcuts for speed changes, reset, rewind, advance, preferred speed, and controller visibility",
      "Configurable shortcut bindings and multiple preferred speed presets",
      "Adds a visible speed indicator and hover controls to supported videos",
      "GPLv3 licensed continuation of the Video Speed Controller lineage",
    ],
  },
  {
    slug: "maisie-heardle",
    name: "Maisie Heardle",
    link: "https://github.com/SoPat712/maisie-heardle",
    cats: ["Web"],
    featured: true,
    img: "/MaisieHeardle.webp",
    tile: "#ffffff",
    fit: "cover",
    description:
      "A daily music guessing game built with SvelteKit and the SoundCloud Widget API, configured for Maisie Peters songs.",
    stack: ["SvelteKit", "Tailwind CSS", "SoundCloud Widget API", "Moment.js", "Svelte Hero Icons"],
    highlights: [
      "Daily rotating track using deterministic date-based selection",
      "Progressive snippet unlocking with skips and wrong guesses",
      "Dark mode with auto-detection and manual toggle",
      "Deployed on Netlify with zero data collection",
      "Track list can be replaced to use another artist",
    ],
  },
  {
    slug: "fair-housing-map",
    name: "Fair Housing Map",
    link: "https://github.com/SoPat712/fair-housing-map",
    cats: ["Web"],
    featured: false,
    img: "/FairHousingMap.webp",
    tile: "#e9eee4",
    fit: "cover",
    description:
      "An interactive web map visualizing Raritan Township’s 2025 FAIR Housing Plan overlay districts. Created to improve community understanding of affordable housing developments.",
    stack: ["HTML5", "CSS3", "JavaScript (ES6+)", "Leaflet.js"],
    highlights: [
      "Interactive Leaflet.js map of proposed housing zones",
      "6 overlay districts with color-coded visualization",
      "Detailed parcel popups with block, lot, and owner info",
      "Dynamic legend with zoom-to-overlay functionality",
      "Responsive single-file implementation",
    ],
  },
  {
    slug: "bereal-export-manager",
    name: "BeReal Export Manager",
    link: "https://github.com/SoPat712/BeReal-Export-Manager",
    cats: ["Systems"],
    featured: true,
    img: "/bereal.webp",
    tile: "#000000",
    fit: "cover",
    description:
      "A Python utility that processes BeReal data exports, adding metadata and properly tagging exported photos, videos, and realmojis with timestamps and location info.",
    stack: ["Python", "ExifTool", "JSON"],
    highlights: [
      "Parses BeReal export data including photos, BTS videos, and realmojis",
      "Adds metadata such as original capture date and location",
      "Supports custom output paths and timespan/year filters",
      "Fixes inconsistent BeReal timestamps using default timezone settings",
      "Flexible command-line options with ExifTool integration",
    ],
  },
];

export const CATEGORIES: ("All" | Category)[] = ["All", "Systems", "Mobile", "Web", "Open Source"];

export const bySlug: Record<string, Project> = Object.fromEntries(PROJECTS.map((p) => [p.slug, p]));

/** Featured first, then the order above. This is the order of the file list, the launcher and n / N. */
export const sortProjects = (list: Project[]) =>
  list.slice().sort((a, b) => Number(b.featured) - Number(a.featured) || PROJECTS.indexOf(a) - PROJECTS.indexOf(b));

export const SORTED_PROJECTS = sortProjects(PROJECTS);

/** The first sentence of the description, for the file list. */
export const summaryOf = (p: Project) => p.description.split(/(?<=\.)\s/)[0];

export const NOW = [
  {
    live: true,
    status: "in progress",
    title: "degoog-toolkit",
    slug: "degoog-toolkit",
    text: "Adding extensions, search workflows, result panels, and self-hosted SearXNG integrations to degoog-toolkit.",
  },
  {
    live: true,
    status: "in progress",
    title: "Allstarr provider integrations",
    slug: "allstarr",
    text: "Expanding playlist imports, provider compatibility, and Jellyfin-centered self-hosted music workflows.",
  },
  {
    live: false,
    status: "active",
    title: "Speeder",
    slug: "speeder",
    text: "Maintaining the Firefox extension’s shortcuts, preferred-speed presets, and playback controls.",
  },
];

export const EXPERIENCE = [
  {
    role: "Data Analysis / Quality Compliance Intern",
    org: "Bergen’s Promise",
    place: "Hackensack, NJ",
    dates: "Jun – Aug 2024",
    bullets: [
      "Analyzed large healthcare datasets using SQL and Python",
      "Identified and documented patterns in patient care data",
      "Interacted with patients and families to gather quality-of-care feedback",
      "Provided data-driven insights to help improve community services",
    ],
  },
];

export const SKILLS: [string, string[]][] = [
  ["languages", ["Python", "C/C++", "JavaScript/TypeScript", "Java", "SQL", "Rust", "Go", "Dart", "Swift/iOS"]],
  ["frontend", ["React", "Svelte", "Tailwind CSS", "HTML/CSS", "Flutter"]],
  ["backend", ["Node.js", "Express", "Django", "Flask"]],
  ["infrastructure", ["Proxmox", "Docker", "Docker ESXi", "Microsoft Cloud Services", "Linux/Unix"]],
  ["databases", ["PostgreSQL", "MongoDB", "Redis", "MySQL", "SQLite"]],
  ["tools", ["Git", "VS Code", "Neovim", "Jira"]],
  ["spoken", ["English", "Bengali"]],
];

export const EDUCATION = {
  school: "Rutgers, The State University of New Jersey",
  degree: "New Brunswick · Bachelor of Arts, Computer Science and Philosophy",
  gpa: "3.75",
  honors: "dean’s list, every semester",
};

export const COURSES: [code: string, name: string][] = [
  ["01:198:428", "Intro to Computer Graphics"],
  ["01:198:417", "Distributed Systems"],
  ["01:198:419", "Computer Security"],
  ["01:198:344", "Design and Analysis of Algorithms"],
  ["01:198:214", "Systems Programming"],
  ["01:198:352", "Internet Technology"],
  ["01:198:211", "Computer Architecture"],
  ["01:198:206", "Discrete Structures II"],
  ["01:198:205", "Discrete Structures I"],
  ["01:198:112", "Data Structures"],
  ["01:198:111", "Intro to Computer Science"],
];

export const ACHIEVEMENTS: [date: string, title: string, detail: string][] = [
  ["Mar 2023", "Runner-up, RUHACK", "Runner-up at Rutgers’ RUHACK with RUSwipeShare, a campus meal-swipe sharing app."],
  [
    "2022 – present",
    "Open-source contributor",
    "Contributed code to open-source projects in mobile UI, infrastructure, and developer tooling.",
  ],
  [
    "2022",
    "Volunteer teacher, Code4Tomorrow",
    "Taught computer science fundamentals through virtual workshops and hands-on exercises.",
  ],
  ["2021 – present", "Dean’s List", "Maintained Dean’s List standing for all semesters."],
];

export type Repo = { name: string; url: string; language: string | null; description: string | null };

/** Shown until the GitHub API answers, and if it never does. */
export const FALLBACK_REPOS: Repo[] = [
  {
    name: "allstarr",
    url: "https://github.com/SoPat712/allstarr",
    language: "C#",
    description: "Self-hosted music streaming server with Jellyfin integration",
  },
  {
    name: "degoog-toolkit",
    url: "https://github.com/SoPat712/degoog-toolkit",
    language: "JavaScript",
    description: "SearXNG engine and manager plugin for degoog, with access to 242+ search engines",
  },
  {
    name: "Speeder",
    url: "https://github.com/SoPat712/Speeder",
    language: "JavaScript",
    description: "HTML5 video speed controller for Firefox",
  },
  {
    name: "my-portfolio",
    url: "https://github.com/SoPat712/my-portfolio",
    language: "TypeScript",
    description: "This site. SvelteKit and TypeScript.",
  },
];

export const FORTUNES: [quote: string, source: string][] = [
  ["Simplicity is prerequisite for reliability.", "Edsger W. Dijkstra"],
  [
    "We should forget about small efficiencies, say about 97% of the time: premature optimization is the root of all evil.",
    "Donald Knuth, “Structured Programming with go to Statements” (1974)",
  ],
  ["Whereof one cannot speak, thereof one must be silent.", "Ludwig Wittgenstein, Tractatus Logico-Philosophicus, 7"],
  ["The unexamined life is not worth living.", "Socrates, in Plato’s Apology"],
  [
    "Programs must be written for people to read, and only incidentally for machines to execute.",
    "Abelson and Sussman, Structure and Interpretation of Computer Programs",
  ],
];
