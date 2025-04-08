/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"], // ✅ Good glob
  theme: {
    extend: {
      fontFamily: {
        sans: ['"JetBrains Mono"', "ui-monospace", "monospace"], // ✅ JetBrains Mono, clean terminal look
      },
    },
  },
  darkMode: "class", // ✅ Great for manual dark mode toggling
  plugins: [],
};
