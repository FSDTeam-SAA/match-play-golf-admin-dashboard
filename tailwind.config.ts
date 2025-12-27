import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'
import tailwindcssAnimate from 'tailwindcss-animate'

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [tailwindcssAnimate],
}
export default config
