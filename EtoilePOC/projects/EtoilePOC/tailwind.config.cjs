/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        etoile: {
          green:  '#3FA76C',  // brand green
          pink:   '#F06AA1',  // callouts
          yellow: '#F6C443',  // spark accents
          cream:  '#FBF7F2',  // paper-like bg
          ink:    '#1E293B',  // dark text
        },
      },
      fontFamily: {
        display: ['Poppins', 'ui-sans-serif', 'system-ui'],
        body:    ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        card: '0 8px 30px rgba(0,0,0,0.06)',
      },
    },
  },
  daisyui: {
    themes: ['lofi'], // keep current DaisyUI theme
    logs: false,
  },
  plugins: [require('daisyui')],
}
