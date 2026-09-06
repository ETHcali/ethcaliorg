# ethcali.org

The ETH Cali community site. Next.js, bilingual, content from Supabase.

Deploys to the Vercel project `ethcaliorg` → https://www.ethcali.org

## Run it

```bash
npm install
cp .env.example .env.local   # fill in the Supabase URL and anon key
npm run dev
```

| Command | Does |
|---|---|
| `npm run dev` | Local dev server |
| `npm run build` | Production build — generates every event page for both locales |
| `npm run typecheck` | `tsc --noEmit`, strict |
| `npm run check` | Date and locale helper assertions |

## How it is put together

**Content lives in Supabase**, not in this repo. Events, venues, team and partners
are read at build time with the anon key and re-fetched every 60s via ISR, so an
edit in the CMS appears without a deploy.

There is **no service-role key here and no write path**. Every content table grants
`anon` SELECT on published rows and nothing else. Editing happens in the wallet app
at `/admin/content`, behind a check of `ADMIN_ROLE` on chain.

**The design system is `@ethcali/design-tokens`** (github.com/ETHcali/design-tokens,
pinned `#v1`), shared with the wallet app. `tokens.css` is imported once in
`pages/_app.tsx`; `tailwind.config.js` loads the preset and extends nothing. Never
put a raw hex or a stock Tailwind colour in a component.

**Spanish is the default locale and carries no URL prefix** — `/events` is the
Spanish page, `/en/events` the English one. That keeps every URL the old site
published working. A missing English string falls back to Spanish rather than
rendering blank.

```
content/     Reference data that belongs in git, not the CMS: the Builders Tour
             campaign, the hardware inventory
lib/         Supabase client (anon only), content queries, i18n helpers
pages/       Routes. [slug] pages are SSG with fallback:'blocking'
public/      Posters, team photos, branding, sponsor logos
databases/   The original CSVs. No longer read at runtime — kept as the
             provenance for the one-time Supabase import
```

## Things that will bite you

- **Slugs are permanent.** They are the URL and they go in `og:url`. Change one in
  the CMS only if you accept that every shared link to it breaks.
- **Dates are formatted in UTC from a bare `YYYY-MM-DD`.** Parsing as UTC then
  formatting in local time slides an event back a day anywhere west of Greenwich,
  which is every reader in Colombia. `npm run check` covers it.
- **Hackathons live at `/hackathons/<slug>`, not `/events/<slug>`.** The events
  route excludes them and 308s any that arrive, so one event never has two
  canonical URLs.
- **Do not add a redirect in `next.config.js` for a page that does not exist yet.**
  A 308 to a 404 is worse than the URL it replaced.

## Still to port from the old static site

`/dao`, `/about`, `/education`, `/swag`, `/technical-infra`, `/brand-guidelines`.
They are deliberately absent from the nav and from the redirect list until they
exist. The old markup is in this repo's history if you need the copy.
