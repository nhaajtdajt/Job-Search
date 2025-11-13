/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eaf1ff",
          100: "#c7d8ff",
          200: "#a3c0ff",
          300: "#76a0ff",
          400: "#4a82ff",
          500: "#1f63ff",
          600: "#174ddb",
          700: "#1039b2",
          800: "#0a277d",
          900: "#05164d",
          950: "#020b26"
        },
        accent: {
          50: "#fff4e6",
          100: "#ffe1bf",
          200: "#ffcd99",
          300: "#ffb066",
          400: "#ff9740",
          500: "#ff7a12",
          600: "#e66400",
          700: "#b94f00",
          800: "#8c3a00",
          900: "#632900"
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif']
      },
      boxShadow: {
        glow: "0 20px 45px -20px rgba(31, 99, 255, 0.45)",
        "glow-strong": "0 35px 60px -25px rgba(10, 39, 125, 0.6)"
      }
    }
  },
  plugins: []
}

