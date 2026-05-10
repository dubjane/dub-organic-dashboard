import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        solaris: {
          50:  '#FFEBD9',
          100: '#FFD2B4',
          200: '#FFBA92',
          300: '#F8A172',
          400: '#F49462',
          500: '#F08752',
          600: '#E07139',
          700: '#D05A20',
          800: '#8B3A11',
        },
        neutral: {
          0:   '#FFFFFF',
          50:  '#F5F2EF',
          100: '#E0D6CD',
          200: '#BFB3A6',
          300: '#A4968B',
          400: '#8B7D75',
          500: '#6A5F5B',
          600: '#4E4540',
          700: '#3A322E',
          800: '#2A2725',
          900: '#1E1C1A',
        },
        cyan: {
          400: '#1BE7FF',
          500: '#00CDE6',
          700: '#008D9C',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      backgroundImage: {
        'solaris-gradient': 'linear-gradient(135deg, #F08752 0%, #FFD2B4 100%)',
      },
    },
  },
  plugins: [],
}
export default config
