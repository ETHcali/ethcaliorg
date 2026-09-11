/**
 * Ethereum Builders Tour: Cali, Colombia — 19–20 September 2026.
 *
 * Source of truth for this file is the shared planning doc (Google Doc
 * 18TftMuDpdiE-Q8t-maGrpJCFTZaMV9eEqh1nf0LHPTk). It lives in the repo rather
 * than the CMS on purpose: this is a campaign page with a fixed date that goes
 * out on paid Facebook traffic, so every change should be reviewed in a diff,
 * not typed into a form at midnight.
 *
 * Bilingual inline. The page is Spanish-first because the ad spend is
 * Colombian, but the tracks and prizes come from EAG and HSK Chain in English
 * and are left as written — renaming a sponsor's track in translation would
 * make it unsearchable against their own materials.
 */

export interface Bilingual {
  es: string;
  en: string;
}

export const TOUR = {
  slug: 'builders-tour',

  title: 'Ethereum Builders Tour: Cali, Colombia',

  /** ISO dates. Saturday and Sunday. */
  startsOn: '2026-09-19',
  endsOn: '2026-09-20',

  tagline: {
    es:
      'Dos días para construir aplicaciones con inteligencia artificial, criptografía y ' +
      'robótica. Además, la posibilidad de participar en una misión de innovación ' +
      'avanzada en Shenzhen, Hong Kong y Mumbai desde el 15 de octubre.',
    en:
      'Two days building applications with artificial intelligence, cryptography and ' +
      'robotics. Plus a shot at joining an advanced innovation mission across Shenzhen, ' +
      'Hong Kong and Mumbai from 15 October.',
  } as Bilingual,

  intro: {
    es:
      'La infraestructura de Ethereum ya maduró. La siguiente ola de innovación está ' +
      'en la capa de aplicación — y va a salir de las regiones que hoy están construyendo.\n\n' +
      'Junto a ETH Cali y con el patrocinio de HashKey Chain, el Ethereum Applications ' +
      'Guild trae a Cali dos días de talleres técnicos, charlas, sesiones de hacking y ' +
      'networking, para desarrolladores, fundadores, investigadores y estudiantes.',
    en:
      "Ethereum's infrastructure has matured. The next wave of innovation is emerging at " +
      'the application layer — and it will come from the regions building right now.\n\n' +
      'Together with ETH Cali and sponsored by HashKey Chain, the Ethereum Applications ' +
      'Guild brings two days of technical workshops, talks, collaborative hacking sessions ' +
      'and networking to Cali, for developers, founders, researchers and students.',
  } as Bilingual,

  /** Both registrations are required to compete for every prize. */
  registration: {
    luma: {
      url: 'https://luma.com/khnpkikn',
      label: { es: 'Regístrate al evento en Cali', en: 'Register for the Cali event' } as Bilingual,
      note: {
        es: 'Presencial en Cali. Cupos limitados.',
        en: 'In person in Cali. Limited places.',
      } as Bilingual,
    },
    devfolio: {
      url: 'https://eag-global-buildathon.devfolio.co',
      label: { es: 'Inscribe tu proyecto en Devfolio', en: 'Submit your project on Devfolio' } as Bilingual,
      note: {
        es: 'El EAG Global Buildathon. Aquí es donde se entrega y se juzga tu proyecto.',
        en: 'The EAG Global Buildathon. This is where your project is submitted and judged.',
      } as Bilingual,
    },
    telegram: {
      url: 'https://t.me/+QfakRR2_LwxkNzM1',
      label: { es: 'Grupo de Telegram', en: 'Telegram group' } as Bilingual,
    },
  },

  /**
   * The city, and only the city.
   *
   * The page used to name a specific venue and pin it on a map. It now says
   * Cali, Colombia everywhere — in the hero fact, in the Luma note and in the
   * section below — so there is one answer to "where", and it is the same one
   * in all three places.
   */
  place: {
    label: { es: 'Cali, Colombia', en: 'Cali, Colombia' } as Bilingual,
  },
} as const;

// ── the city ────────────────────────────────────────────────────────────────

export interface CaliPhoto {
  src: string;
  /** Bilingual, because it is read as a caption and not only by a screen reader. */
  caption: Bilingual;
}

/**
 * What Cali is, for a reader who has never been.
 *
 * A builder deciding whether to fly in is choosing a city, not a room, so this
 * shows the city. The three photographs are the ones anyone from here would
 * pick: the valley from the western hills, Cristo Rey over it, and the cat on
 * the river bank.
 */
export const CALI = {
  blurb: {
    es:
      'Cali es la tercera ciudad de Colombia y la capital del Valle del Cauca, en el ' +
      'suroccidente del país. Está a mil metros sobre el nivel del mar, entre la cordillera ' +
      'Occidental y el valle del río Cauca, y hace unos 30 °C casi todos los días del año.',
    en:
      'Cali is Colombia\'s third city and the capital of Valle del Cauca, in the south-west ' +
      'of the country. It sits a thousand metres up between the Western Andes and the Cauca ' +
      'valley, at around 30 °C almost every day of the year.',
  } as Bilingual,
  photos: [
    {
      src: '/cali/cali-desde-los-cerros.jpg',
      caption: {
        es: 'La ciudad y el valle, vistos desde los cerros del occidente',
        en: 'The city and the valley, seen from the western hills',
      },
    },
    {
      src: '/cali/cristo-rey.jpg',
      caption: {
        es: 'Cristo Rey, sobre el cerro de los Cristales',
        en: 'Cristo Rey, above Cerro de los Cristales',
      },
    },
    {
      src: '/cali/gato-del-rio.jpg',
      caption: {
        es: 'El Gato del Río, de Hernando Tejada, a orillas del río Cali',
        en: "Hernando Tejada's Gato del Río, on the bank of the Cali river",
      },
    },
  ] as readonly CaliPhoto[],
} as const;

// ── tracks ──────────────────────────────────────────────────────────────────

export interface Track {
  name: string;
  detail: Bilingual;
}

/** Six EAG tracks. Names left in English to match EAG's own materials. */
export const EAG_TRACKS: readonly Track[] = [
  {
    name: 'AI x Ethereum & Agent Economy',
    detail: {
      es: 'Agentes de IA, billeteras y pagos para agentes, coordinación entre agentes, y aplicaciones de IA nativas de Ethereum.',
      en: 'AI agents, agent wallets, agent payments, agent-to-agent coordination and Ethereum-native AI applications.',
    },
  },
  {
    name: 'Local AI, Private AI & User-Owned Data',
    detail: {
      es: 'IA que respeta la privacidad, datasets propiedad del usuario, credenciales privadas y divulgación selectiva.',
      en: 'Privacy-first AI applications, user-owned datasets, private credentials and selective disclosure.',
    },
  },
  {
    name: 'Smart Devices, Open Hardware & Privacy Hardware',
    detail: {
      es: 'Hardware abierto, identidad de dispositivos, dispositivos con cripto integrada y Ethereum en entornos reales.',
      en: 'Open hardware, device identity, crypto-integrated devices, secure hardware and Ethereum in real-world environments.',
    },
  },
  {
    name: 'Application Middleware & Open-Source Tooling',
    detail: {
      es: 'SDKs, herramientas de billetera, account abstraction, APIs para desarrolladores, monitoreo e infraestructura reutilizable.',
      en: 'SDKs, wallet tooling, account abstraction, developer APIs, privacy SDKs, monitoring tools and reusable infrastructure.',
    },
  },
  {
    name: 'AI-Native Creator Economy & Digital Rights',
    detail: {
      es: 'Procedencia de contenido, atribución, licenciamiento programable, pagos a creadores y propiedad en la era de la IA.',
      en: 'Content provenance, attribution, programmable licensing, creator payments, digital rights and ownership in the age of AI.',
    },
  },
  {
    name: 'Real-World Ethereum Applications',
    detail: {
      es: 'Pagos con stablecoins, coordinación comunitaria, educación, bienes públicos, reputación, comercio local y aplicaciones para regiones emergentes.',
      en: 'Stablecoin payments, community coordination, education tools, public goods funding, reputation systems, local commerce and applications for emerging regions.',
    },
  },
];

/** HSK Chain publishes these as a plain list, without per-track detail. */
export const HSK_TRACKS: readonly string[] = [
  'AI Agents',
  'AI × Web3',
  'DeFi',
  'Stablecoins',
  'Payments',
  'RWA',
  'Blockchain Infrastructure',
];

// ── prizes ──────────────────────────────────────────────────────────────────

export interface PrizeTier {
  place: string;
  prize: Bilingual;
}

export interface PrizeTrack {
  sponsor: string;
  tiers: readonly PrizeTier[];
  /** Site-relative image that gives the prize a face rather than a number. */
  image: string;
  /**
   * Which part of the image to keep when it is cropped to the card's 16:9 box.
   *
   * All three cards crop identically so they read as one row — a contained
   * image on its own plate looked larger and heavier than its neighbours. EAG's
   * banner is 3:1 with the lockup at 65-95% of its width, so a centred crop
   * would cut the brand off; anchoring right keeps it whole.
   */
  focus?: 'center' | 'right';
  blurb: Bilingual;
}

/**
 * The two tracks are judged separately and the prizes stack. One project can
 * take the mission place AND the USDT — worth saying out loud, because a builder
 * who assumes the tracks are exclusive picks one and aims lower.
 */
/** Stated next to every amount, so nobody turns up expecting a different asset. */
export const PAYOUT: {
  token: string;
  chain: Bilingual;
  logo: string;
  note: Bilingual;
  noWallet: { title: Bilingual; body: Bilingual; cta: Bilingual };
} = {
  token: 'USDT',
  chain: { es: 'Ethereum mainnet', en: 'Ethereum mainnet' },
  logo: '/tour/usdt.png',
  note: {
    es: 'Todos los premios en efectivo se pagan en USDT sobre Ethereum mainnet.',
    en: 'Every cash prize is paid in USDT on Ethereum mainnet.',
  },
  /**
   * Most first-time hackers in Cali arrive without a wallet, and "we will pay you
   * in USDT on mainnet" is meaningless if you have nowhere to receive it. The
   * answer is a wallet we already run, so the page can hand them one.
   */
  noWallet: {
    title: { es: '¿No tienes wallet?', en: 'No wallet?' } as Bilingual,
    body: {
      es:
        'Usa la nuestra. Se crea con tu correo, no tienes que anotar una frase semilla, ' +
        'y las llaves son tuyas. Ábrela antes del evento y llegas listo para recibir el premio.',
      en:
        'Use ours. It is created from your email, there is no seed phrase to write down, ' +
        'and the keys are yours. Open it before the event and you arrive ready to be paid.',
    } as Bilingual,
    cta: { es: 'Abrir una wallet', en: 'Open a wallet' } as Bilingual,
  },
};

export const PRIZES_ARE_CUMULATIVE: Bilingual = {
  es:
    'Los premios se acumulan. Cada premiación se juzga por separado, así que un mismo ' +
    'proyecto puede llevarse un premio de EAG, una entrada a Devcon y el premio de ' +
    'HashKey Chain. No tienes que elegir.',
  en:
    'Prizes stack. Each is judged separately, so a single project can take a place on the ' +
    'EAG prize, a Devcon ticket and the HashKey Chain prize. You do not have to choose.',
};

export const DEVCON = {
  name: 'Devcon VIII',
  banner: '/tour/devcon-banner.jpg',
  /** The Road to Devcon programme's own mark — this is the programme giving the tickets. */
  programme: '/tour/road-to-devcon.jpg',
  x: 'https://x.com/efdevcon',
  place: { es: 'Mumbai, India', en: 'Mumbai, India' } as Bilingual,
  dates: { es: '1–6 de noviembre de 2026', en: '1–6 November 2026' } as Bilingual,
  url: 'https://devcon.org/en/',
  logo: '/tour/devcon-viii.webp',
  ticketValueUsd: 499,
  title: { es: 'Entradas a Devcon', en: 'Devcon tickets' } as Bilingual,
  blurb: {
    es:
      'La Ethereum Foundation aporta entradas a Devcon para los ganadores, a través del ' +
      'programa Road to Devcon. Cada entrada está valorada en 499 USD.',
    en:
      'The Ethereum Foundation is contributing Devcon tickets for winners, through the ' +
      'Road to Devcon programme. Each ticket is valued at 499 USD.',
  } as Bilingual,
  /** What the ticket actually buys, beyond entry. */
  facts: [
    {
      label: { es: 'Qué es', en: 'What it is' } as Bilingual,
      value: {
        es: 'La conferencia de la Ethereum Foundation. Una semana con los equipos que construyen el protocolo.',
        en: "The Ethereum Foundation's own conference. A week with the teams building the protocol.",
      } as Bilingual,
    },
    {
      label: { es: 'Dónde', en: 'Where' } as Bilingual,
      value: {
        es: 'Mumbai, India — la última parada del Ethereum Builders Tour es esa misma semana.',
        en: 'Mumbai, India — the final Ethereum Builders Tour stop lands that same week.',
      } as Bilingual,
    },
    {
      label: { es: 'Cómo se gana', en: 'How you get one' } as Bilingual,
      value: {
        es: 'Ganando en Cali. Las entradas las aporta la Ethereum Foundation vía Road to Devcon.',
        en: 'By winning in Cali. Tickets come from the Ethereum Foundation through Road to Devcon.',
      } as Bilingual,
    },
  ],
} as const;

export const PRIZES: readonly PrizeTrack[] = [
  {
    sponsor: 'EAG',
    image: '/tour/eag-banner.jpg',
    focus: 'right',
    blurb: {
      es: 'Un mes construyendo con la comunidad global de Ethereum, en tres ciudades.',
      en: 'A month building with the global Ethereum community, across three cities.',
    },
    tiers: [
      {
        place: '5 × 200',
        prize: {
          es: 'USDT — cinco proyectos ganadores, 200 USDT cada uno',
          en: 'USDT — five winning projects, 200 USDT each',
        },
      },
    ],
  },
  {
    sponsor: 'Ethereum Foundation',
    // Road to Devcon's own mark. The ticket comes from that programme, so the
    // card shows the programme rather than a Devcon venue illustration.
    image: '/tour/road-to-devcon.jpg',
    blurb: {
      es: 'Entradas a Devcon para los ganadores, vía el programa Road to Devcon.',
      en: 'Devcon tickets for winners, through the Road to Devcon programme.',
    },
    tiers: [
      {
        place: '499',
        prize: {
          es: 'USD el valor de cada entrada a Devcon, aportadas por la Ethereum Foundation',
          en: 'USD the value of each Devcon ticket, contributed by the Ethereum Foundation',
        },
      },
    ],
  },
  {
    sponsor: 'HashKey Chain',
    image: '/tour/hashkey-chain.jpg',
    blurb: {
      es: 'Premio en USDT para los mejores proyectos del track de HashKey Chain.',
      en: 'A USDT prize for the strongest projects on the HashKey Chain track.',
    },
    tiers: [
      { place: '1º', prize: { es: '500 USDT', en: '500 USDT' } },
      { place: '2º', prize: { es: '300 USDT', en: '300 USDT' } },
      { place: '3º', prize: { es: '200 USDT', en: '200 USDT' } },
    ],
  },
];

// ── schedule ────────────────────────────────────────────────────────────────

export interface Slot {
  start: string;
  /** Absent for a moment rather than a block — a submission deadline, a result. */
  end?: string;
  kind: 'opening' | 'talk' | 'workshop' | 'hackathon' | 'break' | 'demo' | 'judgement' | 'winner';
  activity: Bilingual;
  who?: { name: string; role: Bilingual };
  /** Set when the slot is the headline moment of its part of the day. */
  highlight?: boolean;
}

export interface Day {
  label: Bilingual;
  date: string;
  slots: readonly Slot[];
}

export const SCHEDULE: readonly Day[] = [
  {
    date: '2026-09-19',
    label: { es: 'Día 1 · sábado', en: 'Day 1 · Saturday' },
    slots: [
      {
        start: '09:00', end: '10:00', kind: 'opening', highlight: true,
        activity: { es: 'Apertura y bienvenida — registro y entrega de swag', en: 'Opening and welcome — registration and swag claim' },
      },
      {
        start: '10:00', end: '10:10', kind: 'talk',
        activity: { es: 'Discurso de apertura', en: 'Opening speech' },
        who: { name: 'Audrey Tang', role: { es: 'Directora Ejecutiva, EAG', en: 'Executive Director, EAG' } },
      },
      {
        start: '10:10', end: '10:30', kind: 'talk',
        activity: { es: 'EAG 2026 Global Application & Builder Initiatives', en: 'EAG 2026 Global Application & Builder Initiatives' },
        who: { name: 'Jiang', role: { es: 'Líder Técnico, EAG', en: 'Technical Lead, EAG' } },
      },
      { start: '10:30', end: '11:00', kind: 'workshop', activity: { es: 'Tracks de EAG', en: 'EAG tracks' } },
      { start: '11:00', end: '12:00', kind: 'workshop', activity: { es: 'Tracks de HashKey Chain', en: 'HashKey Chain tracks' } },
      {
        start: '12:00', end: '12:15', kind: 'talk',
        activity: { es: '¿Qué es ETH Cali?', en: 'What is ETH Cali?' },
        who: { name: 'María del Mar', role: { es: 'Core, ETH Cali', en: 'Core member, ETH Cali' } },
      },
      { start: '12:15', end: '13:00', kind: 'workshop', activity: { es: '¿Qué es Ethereum?', en: 'What is Ethereum?' } },
      { start: '13:00', end: '14:00', kind: 'break', activity: { es: 'Almuerzo', en: 'Lunch' } },
      {
        start: '14:00', end: '16:00', kind: 'workshop', highlight: true,
        activity: { es: 'Scaffold apps en Ethereum con IA', en: 'Scaffold apps in Ethereum with AI' },
        who: { name: 'William Martínez', role: { es: 'Fundador, Ekinoxis Labs', en: 'Founder, Ekinoxis Labs' } },
      },
      { start: '16:00', end: '19:00', kind: 'hackathon', activity: { es: 'Lluvia de ideas y armado de equipos', en: 'Brainstorming and team setup' } },
      { start: '19:00', end: '20:00', kind: 'break', activity: { es: 'Cena', en: 'Dinner' } },
      { start: '20:00', end: '00:00', kind: 'hackathon', activity: { es: 'Build, build, build', en: 'Build, build, build' } },
    ],
  },
  {
    date: '2026-09-20',
    label: { es: 'Día 2 · domingo', en: 'Day 2 · Sunday' },
    slots: [
      { start: '00:00', end: '10:00', kind: 'hackathon', activity: { es: 'Mentorías y feedback de los mentores', en: 'Mentorships and feedback from mentors' } },
      { start: '10:00', end: '10:30', kind: 'break', activity: { es: 'Desayuno', en: 'Breakfast' } },
      { start: '10:30', end: '13:30', kind: 'hackathon', activity: { es: 'Build, build, build', en: 'Build, build, build' } },
      {
        start: '13:30', kind: 'hackathon', highlight: true,
        activity: { es: 'Cierre de entregas', en: 'Hackathon submission ends' },
      },
      { start: '13:30', end: '14:00', kind: 'break', activity: { es: 'Almuerzo', en: 'Lunch' } },
      {
        start: '14:00', end: '17:30', kind: 'demo', highlight: true,
        activity: { es: 'Demo Showcase — 5 min por proyecto (3 min demo + 2 min preguntas)', en: 'Demo showcase — 5 min per project (3 min demo + 2 min Q&A)' },
      },
      { start: '17:00', end: '17:30', kind: 'judgement', activity: { es: 'Deliberación del jurado', en: 'Judging' } },
      { start: '17:30', kind: 'winner', highlight: true, activity: { es: 'Anuncio de ganadores', en: 'Winner announcement' } },
    ],
  },
];

// ── sponsors ────────────────────────────────────────────────────────────────

export interface Sponsor {
  name: string;
  role: Bilingual;
  url: string;
  /**
   * What this sponsor is to the event, which decides how much room the mark
   * gets. A wall where the title sponsor and a workshop partner render at the
   * same size tells a reader nothing and undersells the one paying for the
   * prizes.
   */
  tier: 'title' | 'partner';
  /**
   * The contribution in one line. Every one of these is stated elsewhere on the
   * page — the prize cards, the Devcon section, the schedule — so the wall
   * summarises rather than claims anything new.
   */
  gives: Bilingual;
  /** Anchor to the section that backs `gives` up, where there is one. */
  proof?: string;
  /** Where they post. Shown as a second link on the sponsor tile. */
  x?: string;
  /**
   * Site-relative path under /tour. Null renders a typographic wordmark instead
   * — deliberate, so a missing asset reads as a design choice rather than as a
   * broken image on a page that paid traffic is landing on.
   */
  logo: string | null;
  /** Wider logos need more room in the row. */
  wide?: boolean;
  /**
   * Render on a light plate instead of the dark card.
   *
   * For a mark whose colour IS the brand — Devcon's deep blue — recolouring it
   * to sit on our ground would misrepresent it. EF's wordmark was neutral navy,
   * which reverses to white the way any monochrome wordmark does; this is the
   * other case, and it gets --surface-paper underneath instead.
   */
  plate?: boolean;
}

export const SPONSORS: readonly Sponsor[] = [
  {
    name: 'Ethereum Applications Guild',
    x: 'https://x.com/EthAppsGuild',
    role: { es: 'Organiza', en: 'Organiser' },
    tier: 'partner',
    gives: {
      es: 'La gira, los seis tracks y 5 × 200 USDT en premios',
      en: 'The tour itself, the six tracks and 5 × 200 USDT in prizes',
    },
    proof: '#prizes',
    url: 'https://ethappsguild.org',
    logo: '/tour/eag.png',
    wide: true,
  },
  {
    name: 'Ethereum Foundation',
    x: 'https://x.com/ethereumfndn',
    role: { es: 'Entradas a Devcon', en: 'Devcon tickets' },
    tier: 'partner',
    gives: {
      es: 'Entradas a Devcon VIII para los ganadores, de 499 USD cada una',
      en: 'Devcon VIII tickets for the winners, 499 USD each',
    },
    proof: '#devcon',
    url: 'https://ethereum.foundation',
    logo: '/tour/ef-logo.png',
    wide: true,
  },
  {
    name: 'HashKey Chain',
    x: 'https://x.com/HSKChain',
    role: { es: 'Patrocinador principal', en: 'Title sponsor' },
    tier: 'title',
    gives: {
      es: '1.000 USDT en premios y un track propio: 500, 300 y 200 USDT',
      en: '1,000 USDT in prizes and a track of its own: 500, 300 and 200 USDT',
    },
    proof: '#prizes',
    url: 'https://hsk.xyz',
    logo: '/tour/hashkey-chain.jpg',
  },
  {
    name: 'ETH Cali',
    x: 'https://x.com/ethcali_org',
    role: { es: 'Anfitrión local', en: 'Local host' },
    tier: 'partner',
    gives: {
      es: 'La organización en tierra y la comunidad que llega a la sala',
      en: 'The organising on the ground, and the community that fills the room',
    },
    url: 'https://ethcali.org',
    // The reversed lockup. Logo_Nodo_CLO_ETH_CO-01 is dark navy artwork drawn
    // for a white ground and disappears on --surface-slab.
    logo: '/branding/ethcali-horizontal-light.png',
  },
  {
    name: 'Ekinoxis Labs',
    x: 'https://x.com/ekinoxis_xyz',
    role: { es: 'Talleres y mentoría', en: 'Workshops and mentoring' },
    tier: 'partner',
    gives: {
      es: 'Los talleres técnicos de los dos días y mentoría durante el hackathon',
      en: 'The technical workshops across both days, and mentoring through the hackathon',
    },
    proof: '#schedule',
    url: 'https://www.ekinoxis.xyz',
    logo: '/tour/ekinoxis.png',
  },
];

// ── the global tour ─────────────────────────────────────────────────────────

export interface TourStop {
  city: string;
  country: Bilingual;
  /**
   * Null where the exact date is not confirmed. The Luma embed carries the
   * authoritative date once a stop is opened, so a vague "August" on the card is
   * worth less than showing nothing and letting the embed answer.
   */
  dates: Bilingual | null;
  lat: number;
  lng: number;
  lumaUrl: string | null;
  /**
   * Luma's embeddable id. The plain lu.ma page sends X-Frame-Options sameorigin
   * and refuses to frame; /embed/event/<api_id>/simple does not. The id is not
   * derivable from the slug and CORS blocks reading it at runtime, so it is
   * resolved once and committed.
   */
  lumaEmbedId: string | null;
  /** Site-relative artwork, where that stop published one. */
  image: string | null;
  /** The stop that has not happened yet — ours. */
  upcoming?: boolean;
  /** A destination on the innovation mission rather than a tour stop. */
  isMission?: boolean;
  /** The local community that co-hosted it. */
  host?: string | null;
  /**
   * Which side of the dot the label sits on. Accra and Lagos are ~350 km apart
   * and their labels overlap into an unreadable smear at this scale, so one of
   * them goes below. Set only where geography forces it.
   */
  labelBelow?: boolean;
}

/**
 * Where the Ethereum Builders Tour has actually landed.
 *
 * Every stop links to its own Luma page, so the map is not a decoration — it is
 * a set of live doors. Coordinates are city centres; at this projection nothing
 * finer than a city is legible anyway.
 */
export const TOUR_STOPS: readonly TourStop[] = [
  {
    city: 'Ciudad de México', country: { es: 'México', en: 'Mexico' },
    dates: { es: '8–13 de julio', en: '8–13 July' },
    lat: 19.4326, lng: -99.1332,
    host: '@ETHCincoDeMayo',
    lumaUrl: 'https://luma.com/46e9cc6o', lumaEmbedId: 'evt-RugYnVJ61jfk1Ug',
    image: '/tour/stop-mexico.jpg',
  },
  {
    city: 'Accra', country: { es: 'Ghana', en: 'Ghana' },
    dates: { es: '3–4 de agosto', en: '3–4 August' },
    lat: 5.6037, lng: -0.187,
    host: '@betechconnected',
    lumaUrl: 'https://luma.com/1icr5z0o', lumaEmbedId: 'evt-OLpUWV8IJyHlqIG',
    image: '/tour/stop-ghana.jpg',
  },
  {
    city: 'Florianópolis', country: { es: 'Brasil', en: 'Brazil' },
    dates: { es: '18–19 de agosto', en: '18–19 August' },
    lat: -27.5954, lng: -48.548,
    host: '@eth_floripa',
    lumaUrl: 'https://luma.com/aat5db4e', lumaEmbedId: 'evt-cylpB1ibiMIoaHI',
    image: '/tour/stop-brazil.jpg',
  },
  {
    city: 'Lagos', country: { es: 'Nigeria', en: 'Nigeria' },
    dates: { es: '26–27 de agosto', en: '26–27 August' },
    lat: 6.5244, lng: 3.3792,
    host: '@Web3Bridge',
    lumaUrl: 'https://luma.com/t6gj441t', lumaEmbedId: 'evt-avmSR5CidWujpsh',
    image: null, labelBelow: true,
  },
  {
    // EAG's tour announcement listed Cali as Sep 5-6. That date moved; 19-20 is
    // final and is what every ETH Cali surface says.
    city: 'Cali', country: { es: 'Colombia', en: 'Colombia' },
    dates: { es: '19–20 de septiembre', en: '19–20 September' },
    lat: 3.4516, lng: -76.532,
    host: '@ethcali_org',
    lumaUrl: 'https://luma.com/khnpkikn', lumaEmbedId: 'evt-cxkPn1L26KCjbD3',
    image: null, upcoming: true,
  },
  {
    city: 'Nairobi', country: { es: 'Kenia', en: 'Kenya' },
    dates: { es: '7–8 de septiembre', en: '7–8 September' },
    lat: -1.2864, lng: 36.8172,
    host: '@ETHSafari',
    lumaUrl: null, lumaEmbedId: null, image: null, labelBelow: true,
  },
  {
    city: 'Cochabamba', country: { es: 'Bolivia', en: 'Bolivia' },
    dates: { es: '11–13 de septiembre', en: '11–13 September' },
    lat: -17.3895, lng: -66.1568,
    host: '@EthereumBo',
    lumaUrl: null, lumaEmbedId: null, image: null,
  },
  {
    city: 'Sydney', country: { es: 'Australia', en: 'Australia' },
    dates: { es: '27–29 de septiembre', en: '27–29 September' },
    lat: -33.8688, lng: 151.2093,
    host: null,
    lumaUrl: null, lumaEmbedId: null, image: null,
  },
  {
    // The tour's last stop and the mission's Devcon leg are the same week in the
    // same city. That is the whole shape of the programme in one line.
    city: 'Mumbai', country: { es: 'India', en: 'India' },
    dates: { es: '1–6 de noviembre', en: '1–6 November' },
    lat: 19.076, lng: 72.8777,
    host: null,
    lumaUrl: null, lumaEmbedId: null, image: null, isMission: true,
  },
];

/**
 * Where the winning projects go. Not tour stops — destinations, drawn differently
 * so the map reads as a journey with an end rather than a scatter of dots.
 */
export const MISSION_STOPS: readonly TourStop[] = [
  {
    city: 'Shenzhen', country: { es: 'China', en: 'China' },
    dates: { es: '15–31 de octubre', en: '15–31 October' },
    lat: 22.5431, lng: 114.0579,
    host: null, lumaUrl: null, lumaEmbedId: null, image: null, isMission: true,
  },
  {
    city: 'Hong Kong', country: { es: 'Hong Kong', en: 'Hong Kong' },
    dates: { es: '6–10 de noviembre', en: '6–10 November' },
    lat: 22.3193, lng: 114.1694,
    host: null, lumaUrl: null, lumaEmbedId: null, image: null,
    isMission: true, labelBelow: true,
  },
];

export const TOUR_MAP_COPY = {
  eyebrow: { es: 'La gira', en: 'The tour' } as Bilingual,
  title: { es: 'Dónde ha estado', en: 'Where it has been' } as Bilingual,
  lead: {
    es: 'El Ethereum Builders Tour recorre el mundo activando builders. Toca un punto para ver la parada. Los puntos en ámbar son el destino: la misión de innovación.',
    en: 'The Ethereum Builders Tour travels the world activating builders. Tap a point to open a stop. The amber points are the destination: the innovation mission.',
  } as Bilingual,
  next: { es: 'Próxima parada', en: 'Next stop' } as Bilingual,
  done: { es: 'Ya ocurrió', en: 'Already happened' } as Bilingual,
  openLuma: { es: 'Ver en Luma', en: 'Open on Luma' } as Bilingual,
  back: { es: 'Ver todo el mapa', en: 'See the whole map' } as Bilingual,
  mission: { es: 'Misión de innovación', en: 'Innovation mission' } as Bilingual,
  cohost: { es: 'Con', en: 'With' } as Bilingual,
};

// ── ShanHaiWoo ──────────────────────────────────────────────────────────────

export const SHANHAIWOO = {
  name: 'ShanHaiWoo 山海坞',
  site: 'https://www.shanhaiwoo.com/',
  x: 'https://x.com/shanhaiwoo',
  editionLabel: '4ª edición',
  dates: { es: '15 oct – 10 nov 2026', en: '15 Oct – 10 Nov 2026' } as Bilingual,
  cities: ['Shenzhen', 'Mumbai', 'Hong Kong'],
  poster: '/tour/shanhaiwoo-2026.png',
  postUrl: 'https://x.com/shanhaiwoo/status/2095007170115121388',
  blurb: {
    es:
      'El primer premio del track de EAG es una beca para ShanHaiWoo: una popup city ' +
      'de un mes que recorre tres ciudades. No es un viaje turístico — es un mes ' +
      'construyendo junto a la comunidad global de Ethereum.',
    en:
      "First prize on the EAG track is a scholarship to ShanHaiWoo: a month-long popup " +
      'city across three cities. Not a sightseeing trip — a month building alongside the ' +
      'global Ethereum community.',
  } as Bilingual,
  /** The post the legs below are taken from, so a reader can check the source. */
  journeyPost: 'https://x.com/shanhaiwoo/status/2095007170115121388',
  legs: [
    {
      city: 'Shenzhen',
      dates: '15–31 oct',
      focus: {
        es: 'IA, hardware, cadenas de suministro y manufactura: del prototipo a producción.',
        en: 'AI, hardware, supply chains and manufacturing: prototype to production.',
      } as Bilingual,
    },
    {
      city: 'Mumbai',
      dates: '1–6 nov',
      // The tour's final stop and this leg are the same week in the same city.
      devcon: true,
      focus: {
        es: 'Conexión con las comunidades globales de Ethereum y open source durante Devcon.',
        en: 'Connecting with the global Ethereum and open-source communities during Devcon.',
      } as Bilingual,
    },
    {
      city: 'Hong Kong',
      dates: '6–10 nov',
      focus: {
        es: 'Capital, mercados internacionales y el resto del mundo.',
        en: 'Capital, international markets and the wider world.',
      } as Bilingual,
    },
  ],
} as const;
