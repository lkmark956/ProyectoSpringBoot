/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores personalizados inspirados en Basic-Fit
        primary: {
          50: '#fef3e2',
          100: '#fde4c4',
          200: '#fbc88a',
          300: '#f8a94f',
          400: '#f58f1f',
          500: '#FF6600', // Naranja principal
          600: '#e65c00',
          700: '#bf4d00',
          800: '#993d00',
          900: '#7a3100',
        },
        secondary: {
          50: '#f3e8f7',
          100: '#e7d1ef',
          200: '#cfa3df',
          300: '#b775cf',
          400: '#9f47bf',
          500: '#5B2C6F', // Morado principal
          600: '#4a2359',
          700: '#391a43',
          800: '#28122e',
          900: '#170918',
        },
      },
    },
  },
  plugins: [],
}
