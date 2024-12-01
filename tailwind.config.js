const {nextui} = require("@nextui-org/react");

/** 
 * @type {import('tailwindcss').Config}
 * 
 * Tailwind CSS config with specified them, content file paths, dark mode settings and nextui plugin.
 */
module.exports = {
  content: [
    './ui/**/*.{js,jsx,ts,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    nextui(),
  ],
}

