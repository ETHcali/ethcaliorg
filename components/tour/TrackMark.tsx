/**
 * A mark for each EAG track.
 *
 * Drawn rather than sourced. Six licensed photographs that all read as "AI" or
 * "hardware" would cost money, date badly, and none of them would look like they
 * belong to this site; these are built from the token palette and the same
 * geometry the rest of the page uses, so the row reads as one set.
 *
 * Every mark is the same 64x64 grid with the same stroke weight, so no track
 * looks more important than another.
 */
const S = 64;

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox={`0 0 ${S} ${S}`} className="h-12 w-12" fill="none" aria-hidden>
      {children}
    </svg>
  );
}

const brand = 'var(--eth-blue-text)';
const dim = 'var(--text-faint)';
const accent = 'var(--signal-confirmed)';

/** Agents talking to agents: nodes on a ring, one lit. */
function AgentEconomy() {
  const pts = [0, 1, 2, 3, 4, 5].map((i) => {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
    return [32 + 21 * Math.cos(a), 32 + 21 * Math.sin(a)] as const;
  });
  return (
    <Frame>
      <circle cx={32} cy={32} r={21} stroke={dim} strokeWidth={1.2} opacity={0.5} />
      {pts.map(([x, y], i) => (
        <g key={i}>
          <line x1={32} y1={32} x2={x} y2={y} stroke={dim} strokeWidth={1} opacity={0.45} />
          <circle cx={x} cy={y} r={i === 0 ? 5 : 3.4} fill={i === 0 ? accent : brand} />
        </g>
      ))}
      <circle cx={32} cy={32} r={5.5} fill="none" stroke={brand} strokeWidth={2} />
    </Frame>
  );
}

/** Private data: a shield whose contents stay inside it. */
function PrivateAI() {
  return (
    <Frame>
      <path
        d="M32 8 L52 16 V33c0 12-8 18-20 23-12-5-20-11-20-23V16Z"
        stroke={brand}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <circle cx={32} cy={30} r={5} stroke={accent} strokeWidth={2} />
      <path d="M27 38h10M25 44h14" stroke={dim} strokeWidth={2} strokeLinecap="round" />
    </Frame>
  );
}

/** Open hardware: a die with legs. */
function OpenHardware() {
  return (
    <Frame>
      <rect x={20} y={20} width={24} height={24} rx={3} stroke={brand} strokeWidth={2} />
      <rect x={28} y={28} width={8} height={8} rx={1.5} fill={accent} />
      {[24, 32, 40].map((v) => (
        <g key={v}>
          <line x1={v} y1={12} x2={v} y2={20} stroke={dim} strokeWidth={2} strokeLinecap="round" />
          <line x1={v} y1={44} x2={v} y2={52} stroke={dim} strokeWidth={2} strokeLinecap="round" />
          <line x1={12} y1={v} x2={20} y2={v} stroke={dim} strokeWidth={2} strokeLinecap="round" />
          <line x1={44} y1={v} x2={52} y2={v} stroke={dim} strokeWidth={2} strokeLinecap="round" />
        </g>
      ))}
    </Frame>
  );
}

/** Middleware: a layer that sits between two others. */
function Middleware() {
  return (
    <Frame>
      <rect x={12} y={12} width={40} height={11} rx={2.5} stroke={dim} strokeWidth={1.8} />
      <rect x={12} y={27} width={40} height={11} rx={2.5} stroke={brand} strokeWidth={2.4} fill="var(--eth-blue-wash)" />
      <rect x={12} y={42} width={40} height={11} rx={2.5} stroke={dim} strokeWidth={1.8} />
      <circle cx={20} cy={32.5} r={2.4} fill={accent} />
    </Frame>
  );
}

/** Provenance: a work with a signature attached to it. */
function CreatorEconomy() {
  return (
    <Frame>
      <rect x={13} y={14} width={30} height={36} rx={3} stroke={brand} strokeWidth={2} />
      <path d="M20 26h16M20 33h16M20 40h9" stroke={dim} strokeWidth={2} strokeLinecap="round" />
      <circle cx={45} cy={42} r={9} fill="var(--surface-slab)" stroke={accent} strokeWidth={2} />
      <path d="M41 42.5l2.8 2.8L49.5 39" stroke={accent} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </Frame>
  );
}

/** Real-world use: value moving between hands, on the ground. */
function RealWorld() {
  return (
    <Frame>
      <circle cx={32} cy={26} r={14} stroke={brand} strokeWidth={2} />
      <path d="M18 26h28M32 12c4 4 6 9 6 14s-2 10-6 14c-4-4-6-9-6-14s2-10 6-14Z" stroke={dim} strokeWidth={1.6} />
      <path d="M14 50h36" stroke={accent} strokeWidth={2.6} strokeLinecap="round" />
      <path d="M24 44v6M40 44v6" stroke={dim} strokeWidth={2} strokeLinecap="round" />
    </Frame>
  );
}

/** Keyed by the track name exactly as EAG publishes it. */
const MARKS: Record<string, () => JSX.Element> = {
  'AI x Ethereum & Agent Economy': AgentEconomy,
  'Local AI, Private AI & User-Owned Data': PrivateAI,
  'Smart Devices, Open Hardware & Privacy Hardware': OpenHardware,
  'Application Middleware & Open-Source Tooling': Middleware,
  'AI-Native Creator Economy & Digital Rights': CreatorEconomy,
  'Real-World Ethereum Applications': RealWorld,
};

export default function TrackMark({ track }: { track: string }) {
  const Mark = MARKS[track];
  // A track added in the CMS without a mark renders nothing rather than a
  // placeholder that looks like a loading failure.
  return Mark ? <Mark /> : null;
}
