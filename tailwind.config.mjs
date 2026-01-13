/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f172a',
        foreground: '#f1f5f9',
        accent: '#3b82f6',
        'accent-dark': '#1e40af',
        'accent-light': '#60a5fa',
      },
    },
  },
  plugins: [],
};
