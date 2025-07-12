import type { Config } from 'tailwindcss';

// Tailwind v4 - minimal config, most configuration is now in CSS
const config: Config = {
  // Content scanning for class detection
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],

  // Plugins can still be added here if needed
  safelist: ['animate-page-turn-3d', 'animate-page-turn', 'animate-page-turn-shadow'],
  plugins: [],
};

export default config;
