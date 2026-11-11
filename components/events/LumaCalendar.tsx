/**
 * The ETH Cali calendar on Luma, embedded.
 *
 * Upcoming events live on Luma first: that is where people register. Embedding
 * the calendar means a new event shows here the moment it is created, with no
 * row to enter in the CMS. Past events are a different thing — our own record,
 * with posters, recaps and photos — and stay in Supabase.
 *
 * The embed URL is Luma's own (`/embed/calendar/<id>/events`); the plain
 * calendar page refuses to be framed. `lt=dark` matches the site, which has no
 * light theme. A fixed height, like every other third-party frame here: the
 * content has no intrinsic ratio and Luma scrolls inside it.
 *
 * Apple Pay does not work inside a Luma embed, so the link out is not optional.
 */
const CALENDAR_ID = 'cal-SHi9BvGf1wYr6eK';

export const LUMA_CALENDAR_URL = 'https://luma.com/ethcali';
const EMBED_URL = `https://luma.com/embed/calendar/${CALENDAR_ID}/events?lt=dark`;

interface Props {
  /** Accessible name for the frame. */
  title: string;
  /** Label for the link that opens the calendar on Luma. */
  openLabel: string;
}

export default function LumaCalendar({ title, openLabel }: Props) {
  return (
    <div>
      <iframe
        src={EMBED_URL}
        title={title}
        loading="lazy"
        allowFullScreen
        className="h-[380px] w-full rounded-card border border-line-hairline bg-surface-inset"
      />
      <a
        href={LUMA_CALENDAR_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-eth-blue-text underline-offset-4 hover:underline"
      >
        {openLabel} →
      </a>
    </div>
  );
}
