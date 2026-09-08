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

export const MISSION: readonly { title: Bilingual; detail: Bilingual }[] = [
  {
    title: { es: 'Innovación tecnológica', en: 'Technical innovation' },
    detail: {
      es: 'Construimos con Ethereum en el Pacífico Colombiano, donde antes no había con qué.',
      en: 'We build with Ethereum in the Colombian Pacific, where there was nothing to build with before.',
    },
  },
  {
    title: { es: 'Comunidad', en: 'Community' },
    detail: {
      es: 'Construimos juntos. El conocimiento se comparte, no se acumula.',
      en: 'We build together. Knowledge is shared, not hoarded.',
    },
  },
  {
    title: { es: 'Educación Web3', en: 'Web3 education' },
    detail: {
      es: 'Democratizamos el acceso a las tecnologías descentralizadas.',
      en: 'We open up access to decentralised technology.',
    },
  },
  {
    title: { es: 'Impacto regional', en: 'Regional impact' },
    detail: {
      es: 'Que Cali y la región sean un hub tecnológico de referencia.',
      en: 'To make Cali and the region a technology hub that counts.',
    },
  },
];

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
