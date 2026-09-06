/** @type {import('tailwindcss').Config} */
module.exports = {
  // tokens.css must be imported globally (pages/_app.tsx) or every class from
  // this preset resolves to a colour with no channels and paints nothing.
  presets: [require('@ethcali/design-tokens/tailwind-preset')],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
};
