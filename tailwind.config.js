/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{njk,html,js}"],
  theme: {
    extend: {
      colors: {
        ground:    "#F7F3EE",
        charcoal:  "#1E1C1A",
        cedar:     "#7A4B2A",
        ash:       "#C8C1B8",
        blackwood: "#2C2520",
        paper:     "#EDE8DF",
      },
      fontFamily: {
        display: ["Cormorant Garamond", "Georgia", "serif"],
        body:    ["Lora", "Georgia", "serif"],
        ui:      ["Jost", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: []
};
