// tailwind.config.js
export default {
  content: [
    './src/index.html',
    './src/**/*.{js,ts,jsx,tsx}',  // Include this if you have files in the src folder
  ],
  theme: {
    extend: {
      colors: {
        orange: '#D4207B',
        dacblue: "#1B66F8",
      },
    },
  },
  plugins: [],
}
