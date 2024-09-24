/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      backgroundImage: {
        "main-bg": "url(./assets/img/main_bg.jpg)",
      },
    },
  },
  plugins: [],
};
