import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'bg-gold-bg', 'border-gold-border', 'text-gold-DEFAULT',
    'text-gaudia-text', 'text-gaudia-text2', 'text-gaudia-text3',
    'hover:bg-cream-2', 'hover:text-gaudia-text',
    'bg-cream-2', 'rounded-full', 'px-3', 'py-1.5',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#FAF7F2',
          2: '#F3EFE8',
          3: '#EDE8DF',
        },
        gold: {
          DEFAULT: '#B8860B',
          2: '#9A7009',
          light: '#F5E6B8',
          bg: '#FDF8EC',
          border: '#DFC06A',
        },
        gaudia: {
          red: '#B83232',
          green: '#2A7A52',
          blue: '#2A5FA8',
          text: '#1C1712',
          text2: '#5A5248',
          text3: '#8A8078',
        },
      },
      fontFamily: {
        sans: ['Noto Sans KR', 'sans-serif'],
        serif: ['Cormorant Garamond', 'serif'],
        mono: ['DM Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config