// @ts-check

/** @type {import('lint-staged').Config} */
const config = {
  '*.{js,ts,jsx,tsx}': 'prettier --write',
  'src/frontend/**/*.{ts,tsx}': 'npm run extract-messages',
};

module.exports = config;
