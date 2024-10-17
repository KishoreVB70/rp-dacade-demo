// tailwind.config.js
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',  // Include this if you have files in the src folder
  ],
  theme: {
    extend: {
      colors: {
        orange: '#F15A24',
        dacblue: "#1B66F8",
      },
    },
  },
  plugins: [],
}
