---
paths:
  - "content/builders-tour.ts"
  - "content/quest.ts"
  - "pages/builders-tour.tsx"
  - "pages/builders-tour/**"
  - "components/tour/**"
---

# Builders Tour campaign

- **"Where" has two answers and each is in all of its places.** `TOUR.venue` is the Auditorio
  SIDOC at Universidad Icesi: the hero fact, the Luma note and the `#venue` section.
  `TOUR.place` is Cali, Colombia, and carries the `#cali` section — a builder weighing a flight
  is choosing a city, not a room. All-or-nothing per answer: never name a venue in one place
  only. The location is written once, in `TOUR.venue.query`; the Maps link and the embedded map
  derive from it (no lat/lng, no separate `mapsUrl`).
- **Frontier Cities is `/builders-tour/frontier-cities-quest`**, 308 from the published `/quest`.
  The name is the offer; a *quest* is still the unit of work inside it, which is why the form,
  the symbols in `content/quest.ts` and the `quest_requests` table keep that name.
- **The sponsor wall is tiered** — `title`, then `partner` — and every tile states what the
  sponsor contributes and links to the section that proves it. Adding a sponsor means `tier`,
  `gives` and ideally `proof`; a claim with no section behind it does not go on the wall.
