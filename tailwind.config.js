module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx,vue}"],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        gray: {
          50: '#f3f3f3',
          350: '#d0d0d0',
          450: '#bbc0c1',
          650: '#7886a2',
          850: '#273a63',
          'lightest': '#f6f6f6',
          'light': '#ddd',
          'medium': '#888',
          'dark': '#666',
          'darkest': '#333'
        },
        blue: {
          50: '#f8fbff',
          150: '#f2f8ff',
          250: '#e8eefd',
          350: '#9fceff',
          550: '#409eff',
          650: '#3185db',
          710: '#276aaf',
          850: '#2a4e7e',
          950: '#2b3a60'
        },
        red: {
          250: '#ffffff',
          450: '#ff7d7c'
        }
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
};
