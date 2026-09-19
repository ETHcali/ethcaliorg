/**
 * ESLint 9 flat config.
 *
 * `next lint` was removed in Next 16, so the `lint` script had simply been
 * failing with "Invalid project directory" — and the .eslintrc.json beside it
 * was an unwired stub demanding four-space indent and single quotes from a
 * two-space codebase, with eslint never installed at all. Both are replaced by
 * this, and `lint` now runs eslint directly, which is what the Next 16 upgrade
 * guide says to do.
 *
 * `eslint-config-next` v16 ships flat config natively — it is imported, not run
 * through FlatCompat, which cannot serialise it.
 *
 * Scope is deliberately narrow: core-web-vitals, which catches the things that
 * break a page rather than the things that merely look different. Nothing here
 * formats on commit, so style rules would only produce noise nobody acts on.
 */
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

const config = [
  {
    ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts'],
  },
  ...nextCoreWebVitals,
];

export default config;
