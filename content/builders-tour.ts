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
    es: 'Dos días para construir la próxima ola de aplicaciones de Ethereum, en Cali.',
    en: 'Two days building the next wave of Ethereum applications, in Cali.',
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
        es: 'Presencial en Zonamerica. Cupos limitados.',
        en: 'In person at Zonamerica. Limited places.',
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

  venue: {
    name: 'Zonamerica — NIDO: Distrito de Innovación',
    city: 'Cali, Colombia',
    mapsUrl: 'https://maps.app.goo.gl/Mb1RVAhBoaWDVte96',
    siteUrl: 'https://web.zonamerica.com/colombia/',
    lat: 3.327976,
    lng: -76.521277,
  },
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
}

export const PRIZES: readonly PrizeTrack[] = [
  {
    sponsor: 'EAG',
    tiers: [
      {
        place: '1º',
        prize: {
          es: 'Beca ShanHaiWoo — un cupo para asistir a la popup city en China',
          en: 'ShanHaiWoo Scholarship — a place at the popup city in China',
        },
      },
    ],
  },
  {
    sponsor: 'HashKey Chain',
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
   * Site-relative path under /tour. Null renders a typographic wordmark instead
   * — deliberate, so a missing asset reads as a design choice rather than as a
   * broken image on a page that paid traffic is landing on.
   */
  logo: string | null;
  /** Wider logos need more room in the row. */
  wide?: boolean;
}

export const SPONSORS: readonly Sponsor[] = [
  {
    name: 'Ethereum Applications Guild',
    role: { es: 'Organiza', en: 'Organiser' },
    url: 'https://ethappsguild.org',
    logo: '/tour/eag.png',
    wide: true,
  },
  {
    name: 'HashKey Chain',
    role: { es: 'Patrocinador principal', en: 'Title sponsor' },
    url: 'https://hsk.xyz',
    logo: '/tour/hashkey-chain.jpg',
  },
  {
    name: 'HashKey Exchange',
    role: { es: 'Patrocinador', en: 'Sponsor' },
    url: 'https://www.hashkey.com',
    logo: null,
  },
  {
    name: 'ETH Cali',
    role: { es: 'Anfitrión local', en: 'Local host' },
    url: 'https://ethcali.org',
    logo: '/branding/Logo_Nodo_CLO_ETH_CO-01.png',
  },
  {
    name: 'Ekinoxis Labs',
    role: { es: 'Talleres y mentoría', en: 'Workshops and mentoring' },
    url: 'https://www.ekinoxis.xyz',
    logo: null,
  },
  {
    name: 'NIDO · Zonamerica',
    role: { es: 'Sede', en: 'Venue' },
    url: 'https://web.zonamerica.com/colombia/',
    logo: null,
  },
];

// ── ShanHaiWoo ──────────────────────────────────────────────────────────────

export const SHANHAIWOO = {
  name: 'ShanHaiWoo 山海坞',
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
