// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // OKLCHを使わないRGB指定
        primary: "rgb(59, 130, 246)",    // 青
        secondary: "rgb(16, 185, 129)",  // 緑
      },
    },
  },
  plugins: [],
};
