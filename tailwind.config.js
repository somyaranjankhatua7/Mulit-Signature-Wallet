/** @type {import('tailwindcss').Config} */
const {nextui} = require("@nextui-org/react");

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'hero': "url('../public/assets/bg-2.jpg')",
        'back': "url('https://img.freepik.com/free-vector/seamless-gold-rhombus-grid-pattern-black-background_53876-97589.jpg?w=826&t=st=1692612661~exp=1692613261~hmac=a3a34465d3fda42029e835372d1e4e65a247687cd0122d820b765821fc491fea')",
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui(),
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],

}
