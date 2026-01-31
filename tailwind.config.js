/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        "admin-bg": "#020617",
        "admin-card": "#0b1120",
        "admin-sidebar": "#020617",
        "admin-primary": "#3b82f6", // Indigo/Blue from images
        "admin-accent": "#f59e0b", // Amber/Gold
        "accent-gold": "#D4AF37",
        "admin-border": "rgba(255, 255, 255, 0.05)",
      },
      fontFamily: {
        "sans": ["Inter", "Manrope", "sans-serif"],
      },
      boxShadow: {
        'blue-glow': '0 0 20px rgba(59, 130, 246, 0.15)',
      }
    },
  },
  plugins: [],
}
