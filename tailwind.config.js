/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0b0f14",
        panel: "#11161c",
        border: "#1f2933",
        text: "#e6edf3",
        muted: "#8b949e",
        accent: "#3b82f6",
      }
    },
  },
  plugins: [],
}

