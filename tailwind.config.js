/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class", // หรือ 'media'
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  variants: {
    extend: {
      display: ['hover', 'group-hover'], // ต้องมี
    },
  },
  safelist: [
    ...["red", "orange", "amber", "yellow", "lime", "green", "emerald", "teal", "blue", "light-blue", 
        "cyan", "pink", "purple", "deep-purple", "indigo", "light-green", "deep-orange", "brown", 
        "gray", "blue-gray"].flatMap((color) =>
        ["100","200","300","400", "500", "600", "700", "800", "900"].map((weight) => `bg-${color}-${weight}`)
    ),
  ],
  
  plugins: [],
};
