// tailwind.config.js
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',  // Adjust based on file types in your project
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
