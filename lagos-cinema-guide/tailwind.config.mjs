/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#1a1a2e',
        secondary: '#16213e',
        accent: '#e94560',
      },
    },
  },
  plugins: [],
};
