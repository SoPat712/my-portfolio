<script>
  // Portfolio Data
  const profile = {
    name: "Josh",
    role: "Computer Science Student",
    bio: "Passionate about solving complex problems with elegant code. Specializing in full-stack development, system architecture, and creating intuitive user interfaces. Currently pursuing a BS in Computer Science with a focus on distributed systems and security.",
    avatar: "/api/placeholder/300/300" // Placeholder for profile image
  };

  // Projects with expanded information
  const projects = [
    {
      name: "DNS Resolver",
      link: "https://github.com/yourhandle/dns-resolver",
      description: "Built a recursive DNS resolver in C using sockets and caching. Implemented RFC standards and optimized for performance.",
      techStack: ["C", "Networking", "Socket Programming", "Caching Algorithms"],
      highlights: [
        "Implemented RFC-compliant DNS message parsing",
        "Built LRU cache with configurable TTL",
        "Achieved 98% cache hit rate in testing",
        "Multi-threaded design for parallel resolution"
      ],
      image: "/api/placeholder/500/300"
    },
    {
      name: "Nextcloud + OnlyOffice Setup",
      link: "https://github.com/yourhandle/cloud-setup",
      description: "Docker-compose setup of Nextcloud with MariaDB and OnlyOffice integration. Designed for easy deployment and maintenance.",
      techStack: ["Docker", "Docker Compose", "Nginx", "MariaDB", "PHP"],
      highlights: [
        "Containerized architecture with automatic updates",
        "Integrated SSL with Let's Encrypt auto-renewal",
        "Custom Nginx configuration for optimal performance",
        "Data persistence with volume mappings"
      ],
      image: "/api/placeholder/500/300"
    },
    {
      name: "Terminal Portfolio",
      link: "https://github.com/yourhandle/terminal-portfolio",
      description: "This portfolio, designed like a terminal and built with SvelteKit + Tailwind CSS v4. Features responsive design and smooth animations.",
      techStack: ["SvelteKit", "Tailwind CSS", "TypeScript", "CSS Animations"],
      highlights: [
        "Terminal-inspired UI with authentic command-line aesthetics",
        "Responsive design for all device sizes",
        "Performance optimized with minimal JS footprint",
        "Custom animations and keyboard navigation"
      ],
      image: "/api/placeholder/500/300"
    }
  ];

  // Academic information
  const education = {
    university: "University of Computer Science",
    degree: "Bachelor of Science in Computer Science",
    graduation: "Expected May 2025",
    gpa: "3.95/4.0",
    courses: [
      { code: "CS301", name: "Advanced Data Structures", grade: "A" },
      { code: "CS405", name: "Algorithms Analysis", grade: "A" },
      { code: "CS407", name: "Operating Systems", grade: "A-" },
      { code: "CS410", name: "Database Systems", grade: "A" },
      { code: "CS415", name: "Computer Networks", grade: "A" },
      { code: "CS422", name: "Software Engineering", grade: "A" }
    ]
  };

  // Achievements
  const achievements = [
    {
      title: "ACM Programming Contest - 2nd Place",
      date: "November 2023",
      description: "Led university team to 2nd place in regional algorithmic competition"
    },
    {
      title: "Open Source Contributor - 200+ Commits",
      date: "2022-Present",
      description: "Active contributor to popular open source projects including TensorFlow and React"
    },
    {
      title: "Dean's List",
      date: "2021-Present",
      description: "Maintained Dean's List standing for all semesters"
    },
    {
      title: "Hackathon Winner",
      date: "March 2023",
      description: "First place in university hackathon for AI-powered accessibility tool"
    }
  ];

  // Skills organized by category
  const skills = {
    languages: ["Python", "C/C++", "JavaScript/TypeScript", "Java", "SQL", "Rust", "Go"],
    frontend: ["React", "Svelte", "Tailwind CSS", "HTML/CSS", "Redux", "Jest"],
    backend: ["Node.js", "Express", "Django", "Flask", "Spring Boot", "GraphQL"],
    devops: ["Docker", "Kubernetes", "AWS", "CI/CD", "Terraform", "Linux/Unix"],
    databases: ["PostgreSQL", "MongoDB", "Redis", "MySQL", "SQLite"]
  };

  // Active section for navigation
  let activeSection = "home";
  
  // Navigation handler
  function navigateTo(section) {
    activeSection = section;
    
    // Smooth scroll to section
    const el = document.getElementById(section);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }

  // Terminal command execution simulation
  let terminalHistory = [
    { command: "whoami", output: profile.name },
    { command: "ls -la", output: "projects  education  achievements  skills  contact" }
  ];
  let currentCommand = "";
  let terminalContainer;
  
  function executeCommand() {
    if (!currentCommand.trim()) return;
    
    let output = "";
    const cmd = currentCommand.toLowerCase().trim();
    
    if (cmd === "help") {
      output = `Available commands:\n- help: Show this help\n- clear: Clear terminal\n- whoami: Display name\n- ls: List sections\n- cat [section]: View section (projects, skills, education, achievements)\n- contact: Display contact info`;
    } else if (cmd === "clear") {
      terminalHistory = [];
      currentCommand = "";
      return;
    } else if (cmd === "whoami") {
      output = profile.name;
    } else if (cmd === "ls" || cmd === "ls -la") {
      output = "projects  education  achievements  skills  contact";
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
      } else if (section === "skills") {
        navigateTo("skills");
        output = "Navigating to skills section...";
      } else if (section === "contact") {
        navigateTo("contact");
        output = "Navigating to contact section...";
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
    
    // Scroll the terminal to bottom after command execution
    setTimeout(() => {
      if (terminalContainer) {
        terminalContainer.scrollTop = terminalContainer.scrollHeight;
      }
    }, 0);
  }

  // Handle key press in terminal
  function handleKeyPress(e) {
    if (e.key === "Enter") {
      executeCommand();
    }
  }
  
  // Function to bind terminal container reference
  function bindTerminalContainer(node) {
    terminalContainer = node;
    return {
      destroy() {
        terminalContainer = null;
      }
    };
  }
</script>

<main class="min-h-screen bg-black text-gray-200 font-mono pb-20">
  <!-- Header with fixed terminal -->
  <header class="sticky top-0 z-10 bg-gray-900 border-b border-gray-700 px-4 py-3">
    <div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center">
      <div class="flex items-center">
        <div class="flex h-3 space-x-1.5 mr-4">
          <div class="w-3 h-3 rounded-full bg-red-500"></div>
          <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div class="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <h1 class="text-xl font-bold text-green-400">josh@portfolio:~$</h1>
      </div>
      
      <!-- Navigation - Fixed spacing between items -->
      <nav class="mt-3 md:mt-0 w-full md:w-auto">
        <ul class="flex flex-wrap md:space-x-6">
          <li class="mr-6"><button class="text-blue-400 hover:underline" on:click={() => navigateTo('home')}>home</button></li>
          <li class="mr-6"><button class="text-blue-400 hover:underline" on:click={() => navigateTo('projects')}>projects</button></li>
          <li class="mr-6"><button class="text-blue-400 hover:underline" on:click={() => navigateTo('education')}>education</button></li>
          <li class="mr-6"><button class="text-blue-400 hover:underline" on:click={() => navigateTo('achievements')}>achievements</button></li>
          <li class="mr-6"><button class="text-blue-400 hover:underline" on:click={() => navigateTo('skills')}>skills</button></li>
          <li><button class="text-blue-400 hover:underline" on:click={() => navigateTo('contact')}>contact</button></li>
        </ul>
      </nav>
    </div>
  </header>

  <!-- Interactive Terminal Section -->
  <section class="bg-gray-900 border-b border-gray-700">
    <div class="max-w-6xl mx-auto p-4">
      <div class="bg-black border border-gray-700 rounded-md p-3 font-mono text-sm">
        <!-- Added the use:bindTerminalContainer directive to get a reference to this div -->
        <div class="h-48 overflow-y-auto" use:bindTerminalContainer>
          {#each terminalHistory as entry}
            <div class="mb-2">
              <div class="flex">
                <span class="text-green-400 mr-2">josh@portfolio:~$</span>
                <span>{entry.command}</span>
              </div>
              <div class="whitespace-pre-wrap pl-4 text-gray-400">{entry.output}</div>
            </div>
          {/each}
          <div class="flex">
            <span class="text-green-400 mr-2">josh@portfolio:~$</span>
            <input 
              type="text" 
              bind:value={currentCommand}
              on:keydown={handleKeyPress}
              class="bg-transparent border-none outline-none flex-grow text-white" 
              placeholder="Type 'help' for commands..."
              autofocus
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
          <img src={profile.avatar} alt={profile.name} class="rounded-lg w-64 h-64 object-cover mx-auto border-2 border-green-500" />
        </div>
        <div class="md:w-2/3">
          <h1 class="text-4xl md:text-5xl font-bold mb-4">
            <span class="text-green-400">❯ {profile.name}</span>
          </h1>
          <h2 class="text-xl md:text-2xl text-gray-400 mb-6">{profile.role}</h2>
          <p class="text-gray-300 leading-relaxed mb-8">{profile.bio}</p>
          <div class="flex flex-wrap gap-4">
            <button class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition" on:click={() => navigateTo('projects')}>View Projects</button>
            <button class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition" on:click={() => navigateTo('contact')}>Contact Me</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Projects Section -->
    <section id="projects" class="py-16 border-b border-gray-800 scroll-mt-16">
      <h2 class="text-3xl font-bold mb-8 text-green-400">❯ Projects</h2>
      
      <div class="space-y-16">
        {#each projects as project, index}
          <div class="bg-gray-900 rounded-lg overflow-hidden border border-gray-700 hover:border-green-500 transition duration-300">
            <div class="flex flex-col md:flex-row">
              <div class="md:w-2/5">
                <img src={project.image} alt={project.name} class="w-full h-64 object-cover" />
              </div>
              <div class="md:w-3/5 p-6">
                <h3 class="text-2xl font-semibold mb-2">
                  <a href={project.link} class="text-blue-400 hover:underline">{project.name}</a>
                </h3>
                <p class="text-gray-400 mb-4">{project.description}</p>
                
                <div class="mb-4">
                  <h4 class="text-green-400 mb-2">Tech Stack:</h4>
                  <div class="flex flex-wrap gap-2">
                    {#each project.techStack as tech}
                      <span class="bg-gray-800 text-xs px-2 py-1 rounded">{tech}</span>
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
      
      <div class="bg-gray-900 rounded-lg overflow-hidden border border-gray-700 p-6">
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
          <h4 class="text-xl font-semibold mb-4 text-blue-400">Relevant Coursework</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {#each education.courses as course}
              <div class="bg-gray-800 p-4 rounded">
                <div class="flex justify-between">
                  <span>{course.code}</span>
                  <span class="text-green-400">{course.grade}</span>
                </div>
                <p class="text-gray-300">{course.name}</p>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </section>

    <!-- Achievements Section -->
    <section id="achievements" class="py-16 border-b border-gray-800 scroll-mt-16">
      <h2 class="text-3xl font-bold mb-8 text-green-400">❯ Achievements</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        {#each achievements as achievement}
          <div class="bg-gray-900 border border-gray-700 rounded-lg p-6 hover:border-green-500 transition duration-300">
            <h3 class="text-xl font-semibold mb-2 text-blue-400">{achievement.title}</h3>
            <p class="text-green-400 text-sm mb-3">{achievement.date}</p>
            <p class="text-gray-300">{achievement.description}</p>
          </div>
        {/each}
      </div>
    </section>

    <!-- Skills Section -->
    <section id="skills" class="py-16 border-b border-gray-800 scroll-mt-16">
      <h2 class="text-3xl font-bold mb-8 text-green-400">❯ Skills</h2>
      
      <div class="space-y-8">
        <div>
          <h3 class="text-xl font-semibold mb-4 text-blue-400">Programming Languages</h3>
          <div class="flex flex-wrap gap-3">
            {#each skills.languages as skill}
              <span class="bg-gray-800 px-3 py-2 rounded-md">{skill}</span>
            {/each}
          </div>
        </div>
        
        <div>
          <h3 class="text-xl font-semibold mb-4 text-blue-400">Frontend Development</h3>
          <div class="flex flex-wrap gap-3">
            {#each skills.frontend as skill}
              <span class="bg-gray-800 px-3 py-2 rounded-md">{skill}</span>
            {/each}
          </div>
        </div>
        
        <div>
          <h3 class="text-xl font-semibold mb-4 text-blue-400">Backend Development</h3>
          <div class="flex flex-wrap gap-3">
            {#each skills.backend as skill}
              <span class="bg-gray-800 px-3 py-2 rounded-md">{skill}</span>
            {/each}
          </div>
        </div>
        
        <div>
          <h3 class="text-xl font-semibold mb-4 text-blue-400">DevOps & Infrastructure</h3>
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
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="py-16 scroll-mt-16">
      <h2 class="text-3xl font-bold mb-8 text-green-400">❯ Contact</h2>
      
      <div class="bg-gray-900 rounded-lg border border-gray-700 p-6">
        <div class="flex flex-col md:flex-row gap-8">
          <div class="md:w-1/2">
            <h3 class="text-xl font-semibold mb-4 text-blue-400">Get In Touch</h3>
            <div class="space-y-3">
              <p class="flex items-center">
                <span class="text-green-400 mr-2">❯</span>
                <span class="text-gray-400 mr-2">Email:</span>
                <a href="mailto:josh@example.com" class="text-blue-400 hover:underline">josh@example.com</a>
              </p>
              <p class="flex items-center">
                <span class="text-green-400 mr-2">❯</span>
                <span class="text-gray-400 mr-2">GitHub:</span>
                <a href="https://github.com/yourhandle" class="text-blue-400 hover:underline">@yourhandle</a>
              </p>
              <p class="flex items-center">
                <span class="text-green-400 mr-2">❯</span>
                <span class="text-gray-400 mr-2">LinkedIn:</span>
                <a href="https://linkedin.com/in/yourhandle" class="text-blue-400 hover:underline">josh-yourhandle</a>
              </p>
              <p class="flex items-center">
                <span class="text-green-400 mr-2">❯</span>
                <span class="text-gray-400 mr-2">Twitter:</span>
                <a href="https://twitter.com/yourhandle" class="text-blue-400 hover:underline">@josh_dev</a>
              </p>
            </div>
          </div>
          
          <div class="md:w-1/2">
            <h3 class="text-xl font-semibold mb-4 text-blue-400">Send a Message</h3>
            <form class="space-y-4">
              <div>
                <label for="name" class="block text-gray-400 mb-1">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  class="w-full bg-gray-800 border border-gray-700 text-white p-2 rounded-md focus:outline-none focus:border-green-500" 
                  placeholder="Your name"
                />
              </div>
              <div>
                <label for="email" class="block text-gray-400 mb-1">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  class="w-full bg-gray-800 border border-gray-700 text-white p-2 rounded-md focus:outline-none focus:border-green-500" 
                  placeholder="Your email"
                />
              </div>
              <div>
                <label for="message" class="block text-gray-400 mb-1">Message</label>
                <textarea 
                  id="message" 
                  rows="4" 
                  class="w-full bg-gray-800 border border-gray-700 text-white p-2 rounded-md focus:outline-none focus:border-green-500" 
                  placeholder="Your message"
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
      <p class="text-gray-400">Built with 💚 using SvelteKit and Tailwind CSS</p>
      <p class="text-gray-500 text-sm mt-2">© {new Date().getFullYear()} Josh - All Rights Reserved</p>
    </div>
  </footer>
</main>

<style>
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
    0% { opacity: 0; transform: translateY(10px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  
  /* Blinking cursor for terminal */
  input::after {
    content: '|';
    animation: blink 1s step-end infinite;
  }
  
  @keyframes blink {
    from, to { opacity: 1; }
    50% { opacity: 0; }
  }
</style>
