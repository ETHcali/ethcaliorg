import { formatDate, formatDateRange, translator, asLocale } from '../lib/i18n';
import { localized } from '../types/content';

let fail = 0;
const eq = (label: string, got: unknown, want: unknown) => {
  const ok = got === want;
  if (!ok) fail++;
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${label}\n       got  ${JSON.stringify(got)}\n       want ${JSON.stringify(want)}`);
};

// The timezone trap: a bare date parsed as UTC then formatted in local time
// (America/Bogota, UTC-5) slides back a day. Hackathon WEB3 Cali is 13 June.
eq('date does not shift a day west of GMT', formatDate('2025-06-13', 'es'), '13 de junio de 2025');
eq('date in English', formatDate('2025-06-13', 'en'), '13 June 2025');
eq('range collapses when end equals start', formatDateRange('2025-06-13', '2025-06-13', 'es'), '13 de junio de 2025');
eq('range with no end', formatDateRange('2025-06-13', null, 'es'), '13 de junio de 2025');
// Same month collapses; a machine writes "13 June - 15 June 2025", a person does not.
eq('same-month range collapses', formatDateRange('2025-06-13', '2025-06-15', 'en'), '13 – 15 June 2025');
eq('same-month range, Spanish', formatDateRange('2026-09-19', '2026-09-20', 'es'), '19 – 20 de septiembre de 2026');
// Crossing a month must keep both month names, or the range becomes unreadable.
eq('cross-month range keeps both months', formatDateRange('2026-10-15', '2026-11-10', 'en'), '15 October – 10 November 2026');
// Both years, or the start reads as belonging to the end's year.
eq('cross-year range keeps both years', formatDateRange('2025-12-30', '2026-01-02', 'en'), '30 December 2025 – 2 January 2026');

// English falls back to Spanish, never to blank.
eq('EN missing falls back to ES', localized({ name_es: 'Hackathon WEB3 Cali', name_en: null }, 'name', 'en'), 'Hackathon WEB3 Cali');
eq('EN present wins', localized({ name_es: 'Hackathon WEB3 Cali', name_en: 'WEB3 Cali Hackathon' }, 'name', 'en'), 'WEB3 Cali Hackathon');
eq('empty EN string is not a translation', localized({ name_es: 'Papayogin', name_en: '   ' }, 'name', 'en'), 'Papayogin');
eq('both missing is null', localized({ name_es: null, name_en: null }, 'name', 'en'), null);

const tEn = translator('en');
const tEs = translator('es');
eq('translates', tEn('hackathons.prizePool'), 'Prize pool');
eq('unknown key returns the key, not blank', tEs('does.not.exist'), 'does.not.exist');
eq('asLocale rejects junk', asLocale('fr'), 'es');
eq('asLocale passes en', asLocale('en'), 'en');

console.log(fail ? `\n${fail} FAILED` : '\nall passed');
process.exit(fail ? 1 : 0);
