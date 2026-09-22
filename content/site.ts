/**
 * Reference content for the pages that are not event-driven.
 *
 * These live in git rather than the CMS on purpose. They are prose and curated
 * lists that change when someone decides something, not rows that change with
 * an event — a mission statement or a governance address should move through a
 * diff, not a form. Anything with a date or a count belongs in Supabase instead.
 *
 * Ported from the static site at commit 85cd3f6, which is where the original
 * markup lives if a wording question comes up.
 */

export interface Bilingual {
  es: string;
  en: string;
}

// ── about ───────────────────────────────────────────────────────────────────

/**
 * The four things we actually do, in the order they happen.
 *
 * The previous four were categories rather than activities — "Innovación
 * tecnológica", "Impacto regional" — the kind of heading that could sit on any
 * organisation's page without changing a word. These name the work: someone
 * learns, then digs into something nobody has written up, then ships it, and
 * the community is what carries them through all three.
 */
export const MISSION: readonly { title: Bilingual; detail: Bilingual }[] = [
  {
    title: { es: 'Educación', en: 'Education' },
    detail: {
      es: 'Enseñamos Ethereum desde cero, en universidades y en meetups abiertos. El conocimiento se comparte, no se acumula.',
      en: 'We teach Ethereum from zero, in universities and in open meetups. Knowledge is shared, not hoarded.',
    },
  },
  {
    title: { es: 'Investigación', en: 'Research' },
    detail: {
      es: 'Probamos lo que todavía no tiene manual — L2s, identidad, pagos con stablecoins — y publicamos lo que encontramos.',
      en: 'We test what has no manual yet — L2s, identity, stablecoin payments — and publish what we find.',
    },
  },
  {
    title: { es: 'Construcción', en: 'Building' },
    detail: {
      es: 'Hackathons, contratos desplegados y aplicaciones que corren. Lo que sale de aquí se puede abrir y usar.',
      en: 'Hackathons, deployed contracts and applications that run. What comes out of here can be opened and used.',
    },
  },
  {
    title: { es: 'Comunidad', en: 'Community' },
    detail: {
      es: 'Nada de lo anterior lo hace una persona sola. Cali y el Pacífico construyendo juntos, con la puerta abierta.',
      en: 'None of the above is done alone. Cali and the Pacific building together, with the door open.',
    },
  },
];

// ── impact ──────────────────────────────────────────────────────────────────

/**
 * What five years added up to, and where to check it.
 *
 * These three cannot be derived from Supabase — the events table knows how many
 * meetups we ran, not how many people left one with a wallet — so they are
 * counted by hand and carry the date they were counted. That date is the whole
 * point of the field: an approximate number with a date is a snapshot, and the
 * same number without one reads as live and is quietly wrong forever. The site
 * already prints its own live counts in the home page hero; these sit beside
 * them and are labelled differently on purpose.
 *
 * Last taken from the static site at commit 85cd3f6 (31 August 2026).
 *
 * The Dune dashboard is the onchain half and is linked rather than embedded.
 * Worth knowing before trusting it: as of this writing its eleven widgets all
 * render "Click Run to get results" for a logged-out visitor, so someone
 * following the link sees an empty dashboard until the queries are made to run
 * publicly on Dune's side.
 */
export const IMPACT = {
  dashboardUrl: 'https://dune.com/ethcali/onchain-metrics-by-users-onboarded-by-ethcali',
  countedOn: { es: 'agosto de 2026', en: 'August 2026' } as Bilingual,
  since: { es: 'Desde Devcon VI, en 2022.', en: 'Since Devcon VI, in 2022.' } as Bilingual,
  metrics: [
    {
      value: '400+',
      label: { es: 'Personas onboardeadas', en: 'People onboarded' } as Bilingual,
    },
    {
      value: '100+',
      label: { es: 'Developers Web2 alcanzados', en: 'Web2 developers reached' } as Bilingual,
    },
    {
      value: '10+',
      label: { es: 'ETH transados en EVM', en: 'ETH transacted on EVM' } as Bilingual,
    },
  ],
  note: {
    es: 'Cifras aproximadas, contadas a mano en agosto de 2026. Las métricas onchain en vivo están en Dune.',
    en: 'Approximate figures, counted by hand in August 2026. The live onchain metrics are on Dune.',
  } as Bilingual,
  cta: { es: 'Ver las métricas onchain en Dune', en: 'See the onchain metrics on Dune' } as Bilingual,
  title: { es: 'Lo que hemos construido', en: 'What we have built' } as Bilingual,
  eyebrow: { es: 'Impacto', en: 'Impact' } as Bilingual,
} as const;

// ── DAO ─────────────────────────────────────────────────────────────────────

export interface EnsName {
  name: string;
  status: Bilingual;
  detail: Bilingual;
  address: string;
  /** Chains the address is used on, when it is not just mainnet. */
  chains?: readonly string[];
}

/**
 * Addresses are rendered with an explorer link, always. The reader verifying one
 * for themselves is the whole point of putting them on a governance page.
 *
 * ethcali.eth is a Safe v1.4.1, 3-of-5, at the same address on every chain we
 * deploy to. It has no reverse record, so the name resolves forward only.
 */
export const ENS_NAMES: readonly EnsName[] = [
  {
    name: 'ethcali.eth',
    status: { es: 'Vigente', en: 'Current' },
    detail: {
      es: 'Dominio principal. Resuelve a la tesorería multifirma actual — un Safe 3-de-5, con la misma dirección en todas las cadenas donde desplegamos.',
      en: 'Primary domain. Resolves to the current multisig treasury — a 3-of-5 Safe, at the same address on every chain we deploy to.',
    },
    address: '0xB6BDe4fB6dFBad5488Fa31Edf0F3730D9D86da64',
  },
  {
    name: 'ethereumcali.eth',
    status: { es: 'Histórico', en: 'Historical' },
    detail: {
      es: 'Dominio histórico, ligado a las multifirmas antiguas gestionadas con Aragon.',
      en: 'Historical domain, tied to the older multisigs managed through Aragon.',
    },
    address: '0x35b0c64CeDC2fD1a7298984CBa5C7E402970BC6B',
    chains: ['OP Mainnet', 'Arbitrum', 'Base', 'Polygon', 'Gnosis'],
  },
];

export const GOVERNANCE: readonly { title: string; detail: Bilingual; url: string; cta: Bilingual }[] = [
  {
    title: 'Snapshot',
    detail: {
      es: 'Votación transparente para las decisiones de la comunidad.',
      en: 'Transparent voting on community decisions.',
    },
    url: 'https://snapshot.box/#/s:ethereumcali.eth',
    cta: { es: 'Ir a Snapshot', en: 'Open Snapshot' },
  },
  {
    title: 'Community Covenant',
    detail: {
      es: 'Las reglas de gobernanza, escritas y públicas.',
      en: 'The governance rules, written down and public.',
    },
    url: 'https://docs.google.com/document/d/12bMgtTRQklg08t2Ju_CkMJHBQCgf7CbgqzczRi8qAjw/edit',
    cta: { es: 'Leer el covenant', en: 'Read the covenant' },
  },
  {
    title: 'Core NFT',
    detail: {
      es: 'Derechos de voto basados en un NFT, en OP Mainnet.',
      en: 'Voting rights carried by an NFT, on OP Mainnet.',
    },
    url: 'https://opensea.io/collection/eth-cali-core',
    cta: { es: 'Ver la colección', en: 'View the collection' },
  },
];

// ── education ───────────────────────────────────────────────────────────────

export interface Resource {
  name: string;
  detail: Bilingual;
  url: string;
}

export interface LearningStep {
  step: number;
  title: Bilingual;
  lead: Bilingual;
  resources: readonly Resource[];
}

export const LEARNING_PATH: readonly LearningStep[] = [
  {
    step: 1,
    title: { es: 'Programación básica', en: 'Programming basics' },
    lead: {
      es: 'Si nunca has programado, empieza aquí. Web3 es programación antes que blockchain.',
      en: 'If you have never programmed, start here. Web3 is programming before it is blockchain.',
    },
    resources: [
      {
        name: 'CS50 — Harvard',
        detail: {
          es: 'Introducción a las ciencias de la computación. El punto de partida si nunca has programado.',
          en: 'Introduction to computer science. The starting point if you have never written code.',
        },
        url: 'https://www.edx.org/course/introduction-computer-science-harvardx-cs50x',
      },
      {
        name: 'Platzi',
        detail: {
          es: 'Programación básica, en español y de principio a fin.',
          en: 'Programming fundamentals, in Spanish, start to finish.',
        },
        url: 'https://platzi.com/cursos/programacion-basica/',
      },
      {
        name: 'IBM Data Science',
        detail: {
          es: 'Certificación profesional en ciencia de datos.',
          en: 'Professional certificate in data science.',
        },
        url: 'https://coursera.org/professional-certificates/ibm-data-science',
      },
    ],
  },
  {
    step: 2,
    title: { es: 'Lenguajes', en: 'Languages' },
    lead: {
      es: 'Lo que necesitas saber antes de tocar un contrato.',
      en: 'What you need before you touch a contract.',
    },
    resources: [
      { name: 'HTML', detail: { es: 'Frontend', en: 'Frontend' }, url: 'https://html.com/' },
      { name: 'CSS', detail: { es: 'Frontend', en: 'Frontend' }, url: 'https://www.w3schools.com/css/' },
      { name: 'JavaScript', detail: { es: 'Frontend', en: 'Frontend' }, url: 'https://www.javascript.com/' },
      { name: 'React', detail: { es: 'Frontend', en: 'Frontend' }, url: 'http://react-tutorial.app/' },
      { name: 'Python', detail: { es: 'Backend', en: 'Backend' }, url: 'https://www.python.org/' },
      { name: 'Java', detail: { es: 'Backend', en: 'Backend' }, url: 'https://www.java.com/' },
      { name: 'C', detail: { es: 'Backend', en: 'Backend' }, url: 'https://www.cprogramming.com/' },
      { name: 'C++', detail: { es: 'Backend', en: 'Backend' }, url: 'https://www.cplusplus.com/' },
    ],
  },
  {
    step: 3,
    title: { es: 'Programación Web3', en: 'Web3 programming' },
    lead: {
      es: 'Solidity, contratos, seguridad y todo lo que viene después.',
      en: 'Solidity, contracts, security and everything after.',
    },
    resources: [
      {
        name: 'UseWeb3',
        detail: {
          es: 'Recursos de Web3 reunidos y curados en un solo lugar.',
          en: 'Web3 resources gathered and curated in one place.',
        },
        url: 'https://www.useweb3.xyz/',
      },
      {
        name: 'Cyfrin Updraft',
        detail: {
          es: 'Solidity y seguridad de contratos, gratis y a fondo.',
          en: 'Solidity and contract security, free and thorough.',
        },
        url: 'https://updraft.cyfrin.io/courses',
      },
      {
        name: 'Web3 Academy',
        detail: { es: 'Cursos estructurados de Web3.', en: 'Structured Web3 courses.' },
        url: 'https://academy.useweb3.xyz/',
      },
      {
        name: 'Alchemy University',
        detail: {
          es: 'Bootcamp gratuito de desarrollo en Ethereum.',
          en: 'Free Ethereum development bootcamp.',
        },
        url: 'https://university.alchemy.com/',
      },
      {
        name: 'Curso completo de blockchain',
        detail: { es: 'En YouTube, en español.', en: 'On YouTube, in Spanish.' },
        url: 'https://www.youtube.com/watch?v=gMTFa6HOOBc&list=PLCmkMtk-mm-fyCs8IiZ90hXyUm2lBXtuH',
      },
    ],
  },
];

// ── swag ────────────────────────────────────────────────────────────────────

export interface SwagItem {
  name: Bilingual;
  detail: Bilingual;
  image: string;
  tags: readonly Bilingual[];
}

export const SWAG: readonly SwagItem[] = [
  {
    name: { es: 'Hoodie blanco Ethereum', en: 'White Ethereum hoodie' },
    detail: {
      es: 'Hoodie premium con el logo de Ethereum y el branding de ETH Cali.',
      en: 'Premium hoodie with the Ethereum logo and ETH Cali branding.',
    },
    image: '/swags/hoodie_white_ether.jpg',
    tags: [{ es: 'Algodón premium', en: 'Premium cotton' }, { es: 'Logo Ethereum', en: 'Ethereum logo' }],
  },
  {
    name: { es: 'Hoodie negro Ethereum', en: 'Black Ethereum hoodie' },
    detail: {
      es: 'La versión oscura, con los detalles del logo en ultramarino.',
      en: 'The dark version, logo picked out in ultramarine.',
    },
    image: '/swags/hoodie_baclk_ether.jpg',
    tags: [{ es: 'Algodón premium', en: 'Premium cotton' }, { es: 'Logo Ethereum', en: 'Ethereum logo' }],
  },
  {
    name: { es: 'Hoodie Community Edition', en: 'Community Edition hoodie' },
    detail: {
      es: 'Edición especial que celebra a la comunidad.',
      en: 'A special edition celebrating the community.',
    },
    image: '/swags/hoodie_white_people.jpg',
    tags: [{ es: 'Edición limitada', en: 'Limited edition' }],
  },
  {
    name: { es: 'Gorra Ethereum', en: 'Ethereum cap' },
    detail: {
      es: 'Gorra ajustable con el logo de Ethereum bordado.',
      en: 'Adjustable cap with an embroidered Ethereum logo.',
    },
    image: '/swags/cap_eth.jpeg',
    tags: [{ es: 'Ajustable', en: 'Adjustable' }, { es: 'Bordado', en: 'Embroidered' }],
  },
  {
    name: { es: 'Gorra OP Mainnet', en: 'OP Mainnet cap' },
    detail: { es: 'Con los colores de Optimism.', en: "In Optimism's colours." },
    image: '/swags/cap_opmainnet.jpeg',
    tags: [{ es: 'Edición limitada', en: 'Limited edition' }],
  },
  {
    name: { es: 'Gorra Uniswap', en: 'Uniswap cap' },
    detail: { es: 'Para quienes viven en DeFi.', en: 'For the people who live in DeFi.' },
    image: '/swags/cap_uniswap.jpeg',
    tags: [{ es: 'Edición limitada', en: 'Limited edition' }],
  },
  {
    name: { es: 'Gorra Pepe × Ethereum', en: 'Pepe × Ethereum cap' },
    detail: { es: 'Porque sí.', en: 'Because why not.' },
    image: '/swags/cap_pepe.jpeg',
    tags: [{ es: 'Edición limitada', en: 'Limited edition' }],
  },
];

/** Swag is earned, never sold. These are the four ways. */
export const SWAG_WAYS: readonly { title: Bilingual; detail: Bilingual }[] = [
  {
    title: { es: 'Asiste a eventos', en: 'Show up' },
    detail: {
      es: 'Meetups, workshops y hackathons. La forma más directa.',
      en: 'Meetups, workshops and hackathons. The most direct route.',
    },
  },
  {
    title: { es: 'Contribuye', en: 'Contribute' },
    detail: {
      es: 'Código, diseño, logística, traducción. Todo cuenta.',
      en: 'Code, design, logistics, translation. All of it counts.',
    },
  },
  {
    title: { es: 'Gana competencias', en: 'Win something' },
    detail: {
      es: 'Hackathons y retos de la comunidad.',
      en: 'Hackathons and community challenges.',
    },
  },
  {
    title: { es: 'Voluntariado', en: 'Volunteer' },
    detail: {
      es: 'Ayuda a que los eventos ocurran.',
      en: 'Help make the events happen.',
    },
  },
];

// ── chains ──────────────────────────────────────────────────────────────────

/**
 * Where we deploy. Logos live in public/chains, all URL-safe filenames.
 * This is a reference list, not a registry — contract addresses belong in the
 * wallet app, verified on-chain, never in site copy.
 */
export const CHAINS: readonly { name: string; logo: string }[] = [
  { name: 'Ethereum', logo: '/chains/ethereum.png' },
  { name: 'Base', logo: '/chains/base.svg' },
  { name: 'Unichain', logo: '/chains/unichain.png' },
  { name: 'OP Mainnet', logo: '/chains/op-mainnet.png' },
  { name: 'Polygon', logo: '/chains/polygon.png' },
  { name: 'Gnosis', logo: '/chains/gnosis.png' },
];
