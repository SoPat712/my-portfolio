<script lang="ts">
  import { onMount } from "svelte";

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
      image: "/BeRealExportManager.webp",
    },
  ];

  // Education Info
  const education = {
    university: "Rutgers, The State University of New Jersey - New Brunswick",
    degree: "Bachelor of Arts in Computer Science and Philosophy",
    graduation: "Expected May 2026",
    gpa: "3.7/4.0",
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

  // Active section for navigation
  let activeSection: string = "home";
  function navigateTo(section: string) {
    activeSection = section;
    const el = document.getElementById(section);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }

  // Terminal
  let terminalHistory: Array<{ command: string; output: string }> = [
    { command: "whoami", output: profile.name },
    {
      command: "ls -la",
      output: "projects  education  achievements  experience  skills  contact",
    },
  ];
  let currentCommand: string = "";
  let terminalContainer: HTMLDivElement | null = null;
  let terminalInput: HTMLInputElement | null = null;

  // Variables for typewriter effect
  let typedName: string = "";
  let typedRole: string = "";
  let bioVisible: boolean = false;

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

  onMount(async () => {
    if (terminalInput) {
      terminalInput.focus();
    }
    // Type the name
    await typeWriter(
      profile.name,
      (val: string) => {
        typedName = val;
      },
      150,
    );
    // Type the role
    await typeWriter(
      profile.role,
      (val: string) => {
        typedRole = val;
      },
      50,
    );
    // Once typing is done, show the bio
    bioVisible = true;
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
- cat [section]: View section (projects, education, achievements, experience, skills)
- contact: Display contact info`;
    } else if (cmd === "clear") {
      terminalHistory = [];
      currentCommand = "";
      return;
    } else if (cmd === "whoami") {
      output = profile.name;
    } else if (cmd === "ls" || cmd === "ls -la") {
      output = "projects  education  achievements  experience  skills  contact";
    } else if (cmd.startsWith("cat ")) {
      const section = cmd.substring(4);
      if (section === "projects") {
        navigateTo("projects");
        output = "Navigating to projects section...";
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
  function sendMail() {
    const subject = `Portfolio Contact from ${userName}`;
    const body = `Name: ${userName}, Email: ${userEmail}\n\n${userMessage}`;
    const mailtoUrl = `mailto:joshpatra12@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
    userName = "";
    userEmail = "";
    userMessage = "";
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
        <ul class="flex flex-wrap md:space-x-6">
          <li class="mr-6">
            <button
              class="text-blue-400 hover:underline"
              on:click={() => navigateTo("home")}
            >
              home
            </button>
          </li>
          <li class="mr-6">
            <button
              class="text-blue-400 hover:underline"
              on:click={() => navigateTo("projects")}
            >
              projects
            </button>
          </li>
          <li class="mr-6">
            <button
              class="text-blue-400 hover:underline"
              on:click={() => navigateTo("education")}
            >
              education
            </button>
          </li>
          <li class="mr-6">
            <button
              class="text-blue-400 hover:underline"
              on:click={() => navigateTo("achievements")}
            >
              achievements
            </button>
          </li>
          <li class="mr-6">
            <button
              class="text-blue-400 hover:underline"
              on:click={() => navigateTo("experience")}
            >
              experience
            </button>
          </li>
          <li class="mr-6">
            <button
              class="text-blue-400 hover:underline"
              on:click={() => navigateTo("skills")}
            >
              skills
            </button>
          </li>
          <li>
            <button
              class="text-blue-400 hover:underline"
              on:click={() => navigateTo("contact")}
            >
              contact
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
    <section id="home" class="py-16 border-b border-gray-800">
      <div class="flex flex-col md:flex-row gap-8 items-center">
        <div class="md:w-1/3">
          <img
            src={profile.avatar}
            alt={profile.name}
            class="rounded-lg w-64 h-64 object-cover mx-auto border-2 border-green-500"
          />
        </div>
        <div class="md:w-2/3">
          <!-- Typewriter effect for Name and Role -->
          <h1 class="text-4xl md:text-5xl font-bold mb-4">
            <span class="text-green-400">❯ {typedName}</span>
          </h1>
          <h2 class="text-xl md:text-2xl text-gray-400 mb-6">
            {typedRole}
          </h2>
          <!-- Static bio (no fade in effect) -->
          <p class="text-gray-300 leading-relaxed mb-8">
            {profile.bio}
          </p>
          <div class="flex flex-wrap gap-4">
            <a
              href="https://cloud.joshpatra.me/s/qTfJcm3Q7cCnaYy/download"
              target="_blank"
              rel="noopener noreferrer"
              class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition"
            >
              View Resume
            </a>
            <button
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
              on:click={() => navigateTo("projects")}
            >
              View Projects
            </button>
            <button
              class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition"
              on:click={() => navigateTo("contact")}
            >
              Contact Me
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Projects Section -->
    <section id="projects" class="py-16 border-b border-gray-800 scroll-mt-16">
      <h2 class="text-3xl font-bold mb-8 text-green-400">❯ Projects</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        {#each projects as project}
          <div
            class="project-card bg-gray-900 rounded-lg overflow-hidden border border-gray-700 transition-all duration-300"
          >
            <div class="h-full flex flex-col">
              <div class="h-48">
                <img
                  src={project.image}
                  alt={project.name}
                  class="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div class="p-6 flex flex-col flex-grow">
                <h3 class="text-2xl font-semibold mb-2">
                  <a
                    href={project.link}
                    target="_blank"
                    class="text-blue-400 hover:underline"
                  >
                    {project.name}
                  </a>
                </h3>
                <p class="text-gray-400 mb-4 flex-grow">
                  {project.description}
                </p>
                <div class="mb-4">
                  <h4 class="text-green-400 mb-2">Tech Stack:</h4>
                  <div class="flex flex-wrap gap-2">
                    {#each project.techStack as tech}
                      <span class="bg-gray-800 text-xs px-2 py-1 rounded"
                        >{tech}</span
                      >
                    {/each}
                  </div>
                </div>
                <div>
                  <h4 class="text-green-400 mb-2">Key Features:</h4>
                  <ul class="list-disc pl-5 text-gray-300">
                    {#each project.highlights as highlight}
                      <li>{highlight}</li>
                    {/each}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </section>

    <!-- Education Section -->
    <section id="education" class="py-16 border-b border-gray-800 scroll-mt-16">
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
      class="py-16 border-b border-gray-800 scroll-mt-16"
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
      class="py-16 border-b border-gray-800 scroll-mt-16"
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
    <section id="skills" class="py-16 border-b border-gray-800 scroll-mt-16">
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
    <section id="contact" class="py-16 scroll-mt-16">
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
            <form class="space-y-4" on:submit|preventDefault={sendMail}>
              <div>
                <label for="name" class="block text-gray-400 mb-1">Name</label>
                <input
                  type="text"
                  id="name"
                  class="w-full bg-gray-800 border border-gray-700 text-white p-2 rounded-md focus:outline-none focus:border-green-500"
                  placeholder="Your name"
                  bind:value={userName}
                />
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
              </div>
              <button
                type="submit"
                class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>

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

  .project-card:hover {
    transform: translateY(-10px) scale(1.03);
    box-shadow:
      0 0 15px rgba(52, 211, 153, 0.3),
      0 0 30px rgba(52, 211, 153, 0.2);
    border-color: rgba(52, 211, 153, 0.5);
  }
</style>
