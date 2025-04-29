# Terminal-Style SvelteKit Portfolio

[![Netlify Status](https://api.netlify.com/api/v1/badges/aa175fb6-e9e2-411b-9dec-a2f764b0b10d/deploy-status)](https://app.netlify.com/sites/joshpatraportfolio/deploys)

This is a terminal-inspired portfolio built with SvelteKit and Tailwind CSS, showcasing my projects, education, skills, and more. It includes an interactive “terminal” at the top of the page that lets users type commands like help, ls, or cat [section] to navigate through different sections of the site.
## Features

  * Terminal simulation: Visitors can type commands to navigate sections (e.g., cat projects, cat skills, cat education).

  * Responsive design: Built with Tailwind CSS, so it looks great on all screen sizes.

  * Smooth scrolling: Clicking navigation items (or typing commands) scrolls to the relevant section.

  * Dynamic data: Sections (Projects, Education, etc.) are driven by JavaScript objects that you can easily modify.

  * Mailto Form: The “Send a Message” form opens a user’s default email client with a prefilled message.

## Getting Started
### Prerequisites

    Node.js (v14 or above recommended)

    npm (comes with Node) or pnpm / yarn, whichever you prefer.

### Installation

1. Clone this repository or download the source code:

`git clone https://github.com/SoPat712/my-portfolio.git`

2. Navigate into the project folder:

`cd my-portfolio`

3. Install dependencies:

`npm install`


## Running the Development Server

Start a local dev server:

`npm run dev -- --open`

Open your browser and visit http://localhost:5173 (port may vary) to see the portfolio.

### Building for Production

To create an optimized production build:

`npm run build`

Then preview the production build:

`npm run preview`

## Customizing

### Update Profile and Data:

  In src/routes/+page.svelte (or the main Svelte file where your data lives), find the profile, projects, education, etc. objects.

  Modify them with your own information (e.g., name, role, courses, achievements, etc.).

### Change the Terminal Commands:

  Look for the executeCommand() function. You can add more commands or alter existing ones (like cat [section]) to do different things or show more data.

### Tailwind Configuration:

  If you need to change colors, spacing, or fonts, edit your tailwind.config.cjs (or tailwind.config.js) file.

### Default Email:

  The “Send a Message” form is configured to open the user’s mail client with a prefilled message. Modify it in the <script> block (the sendMail function) if you want a different email address or subject.

## Terminal Commands

    help: Shows available commands

    clear: Clears the terminal output

    whoami: Displays your name

    ls or ls -la: Lists all sections (projects, education, achievements, experience, skills, contact)

    cat [section]: Scrolls to a given section (e.g., cat projects → show projects)

    contact: Scrolls to the contact section
