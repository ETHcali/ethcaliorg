import { STREAMS, RESULTS_COPY, youtubeEmbedUrl } from '../../content/results';
import type { Bilingual } from '../../content/builders-tour';

/**
 * The recordings of the Builders Tour weekend, on both pages that want them.
 *
 * Deliberately not wrapped in a `Section`: the winners page and the home page
 * introduce it differently, so each supplies its own heading and this supplies
 * the player.
 *
 * The iframe is the first third-party video on the site, and it follows the
 * reasoning `TourMap` already wrote down about Luma — a third-party frame is a
 * third-party page load, so it is `loading="lazy"` and sits below the fold on
 * both pages. It uses the repo's canonical 16:9 box rather than the fixed pixel
 * height the Luma and Maps embeds take, because a video has an aspect ratio and
 * those two do not.
 */
export default function Streams({
  locale,
  className = '',
}: {
  locale: 'es' | 'en';
  className?: string;
}) {
  const t = (b: Bilingual) => b[locale];

  return (
    <div className={className}>
      <div className="relative aspect-[16/9] w-full max-w-3xl overflow-hidden rounded-card border border-line-hairline bg-surface-inset">
        <iframe
          src={youtubeEmbedUrl(STREAMS.youtube.videoId)}
          title="Ethereum Builders Tour: Cali — EAG Global Buildathon"
          loading="lazy"
          // The player needs these to go fullscreen and to hand off to picture
          // in picture; nothing else on the site has ever asked for them.
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>

      {/* X will not frame a broadcast — it refuses with X-Frame-Options, the same
          way the plain lu.ma page does — so the second stream is a link out
          rather than a second player. */}
      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href={STREAMS.youtube.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-tap items-center rounded-chip border border-line-hairline px-4 text-sm font-semibold text-content-secondary transition-colors hover:border-line-brand hover:text-content-primary"
        >
          {t(RESULTS_COPY.streamOnYoutube)} →
        </a>
        <a
          href={STREAMS.x.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-tap items-center rounded-chip border border-line-hairline px-4 text-sm font-semibold text-content-secondary transition-colors hover:border-line-brand hover:text-content-primary"
        >
          {t(RESULTS_COPY.streamOnX)} →
        </a>
      </div>
    </div>
  );
}
