import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#F97316',
        },
        dark: {
          bg: '#13111E',
          card: '#1E1C2E',
          border: '#2E2B3F',
          text: '#F8F8F8',
          muted: '#8B8AA0',
        },
        light: {
          bg: '#F5F4FA',
          card: '#FFFFFF',
          border: '#E4E2F0',
          text: '#13111E',
          muted: '#6B697E',
        },
      },
    },
  },
  plugins: [],
}
export default config
