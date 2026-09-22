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

/**
 * The four fields the work sits between.
 *
 * `MISSION` says what we do — teach, research, build, gather. This says where.
 * They are deliberately one section on the page rather than two: the four
 * activities happen at this crossing, and split apart they read as two
 * unrelated lists of four.
 *
 * Stated as an intersection and not as a menu. Any one of these on its own is
 * somebody else's field with a far bigger community than ours; what is actually
 * ours is the seam where they meet — which is also, precisely, what came out of
 * the Builders Tour weekend.
 */
export const INTERSECTION = {
  title: { es: 'Dónde se cruzan', en: 'Where they meet' } as Bilingual,
  lead: {
    es:
      'Las cuatro cosas de arriba ocurren en un mismo cruce. Ninguno de estos campos nos interesa ' +
      'por separado — cada uno tiene comunidades mucho más grandes que la nuestra. Lo nuestro es la costura.',
    en:
      'The four things above happen at one crossing. None of these fields interests us on its own — ' +
      'each has communities far larger than ours. What is ours is the seam.',
  } as Bilingual,
  fields: [
    {
      name: { es: 'Criptografía', en: 'Cryptography' } as Bilingual,
      detail: {
        es: 'Pruebas, firmas y divulgación selectiva: cómo demostrar algo sin entregarlo todo.',
        en: 'Proofs, signatures and selective disclosure: how to prove something without handing over everything.',
      } as Bilingual,
    },
    {
      name: { es: 'Blockchain', en: 'Blockchain' } as Bilingual,
      detail: {
        es: 'Ethereum y sus L2. Donde el registro es público y cualquiera puede verificarlo por su cuenta.',
        en: 'Ethereum and its L2s. Where the record is public and anyone can check it for themselves.',
      } as Bilingual,
    },
    {
      name: { es: 'Inteligencia artificial', en: 'Artificial intelligence' } as Bilingual,
      detail: {
        es: 'Agentes que actúan y pagan, con topes que impone un contrato y no una instrucción en un prompt.',
        en: 'Agents that act and pay, with limits a contract enforces rather than a line in a prompt.',
      } as Bilingual,
    },
    {
      name: { es: 'Software de código abierto', en: 'Open-source software' } as Bilingual,
      detail: {
        es: 'Si no se puede leer, no se puede auditar. Lo que se construye aquí se publica.',
        en: 'If it cannot be read, it cannot be audited. What gets built here gets published.',
      } as Bilingual,
    },
  ],
} as const;

// ── impact ──────────────────────────────────────────────────────────────────

/**
 * What five years added up to, and where to check it.
 *
 * Two of the three now come from the Dune dashboard rather than from memory.
 * The hand-counted "400+ personas onboardeadas" that stood here was low: Dune's
 * own counter says 441. The figure it replaced had no date on it either, which
 * is the failure mode this block exists to avoid — an approximate number with a
 * date is a snapshot, the same number without one reads as live and is quietly
 * wrong forever.
 *
 * `source` marks which is which, and the note under the cards says so in prose.
 * Mixing a measured number and a guessed one without distinguishing them makes
 * the guess look measured.
 */
export const IMPACT = {
  dashboardUrl: 'https://dune.com/ethcali/onchain-metrics-by-users-onboarded-by-ethcali',
  /**
   * The Dune counters behind the two onchain figures, as query/visualization
   * ids. `scripts/dune.mts` reads the last saved result of each through Dune's
   * official API and rewrites `metrics` below; without a DUNE_API_KEY it leaves
   * the committed values alone.
   *
   * These ids were taken off the dashboard's own widget links. The dashboard
   * page itself renders "Click Run to get results" to a logged-out visitor, but
   * the saved results are real and current — dune.com/embeds/<q>/<v> shows them.
   */
  queries: {
    usersOnboarded: { query: 6627839, visualization: 10454384 },
    feesPaidUsd: { query: 6633618, visualization: 10462106 },
  },
  countedOn: { es: 'septiembre de 2026', en: 'September 2026' } as Bilingual,
  since: { es: 'Desde Devcon VI, en 2022.', en: 'Since Devcon VI, in 2022.' } as Bilingual,
  metrics: [
    {
      /** Dune: "Users onboarded". Was published as "400+" from a hand count. */
      value: '441',
      label: { es: 'Personas onboardeadas', en: 'People onboarded' } as Bilingual,
      source: 'dune' as const,
    },
    {
      /** Dune: "Total transaction fees paid by users (usd)". */
      value: '38.888',
      label: { es: 'USD en comisiones pagadas', en: 'USD paid in transaction fees' } as Bilingual,
      source: 'dune' as const,
    },
    {
      /**
       * Not on Dune and not derivable from it: the chain knows what a wallet
       * did, not whether the person holding it writes Java for a living.
       * Counted by hand, and labelled as such.
       */
      value: '100+',
      label: { es: 'Developers Web2 alcanzados', en: 'Web2 developers reached' } as Bilingual,
      source: 'hand' as const,
    },
  ],
  note: {
    es:
      'Las dos primeras salen del tablero de Dune, del último cálculo guardado. La tercera se cuenta a ' +
      'mano — la cadena sabe qué hizo una billetera, no a qué se dedica quien la usa.',
    en:
      'The first two come from the Dune dashboard, from its last saved run. The third is counted by ' +
      'hand — the chain knows what a wallet did, not what the person holding it does for a living.',
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
  /** Site-relative path, or null for something that exists but is not photographed yet. */
  image: string | null;
  tags: readonly Bilingual[];
}

export interface SwagGroup {
  id: string;
  name: Bilingual;
  items: readonly SwagItem[];
  /** Set when the group has nothing to show yet. Said, not hidden. */
  pending?: Bilingual;
}

/**
 * The merch, by what it is.
 *
 * It used to be one flat grid of seven — two hoodies, four caps and a third
 * hoodie in the middle — which made it impossible to see at a glance that there
 * are caps at all. Grouping is the whole improvement: someone who wants a mug
 * should not have to read seven captions to find out we make them.
 *
 * Six of the seven old images 404'd on the live site: the artwork was replaced
 * and the paths in this file were not, so /swag was a page of broken frames.
 *
 * Aspect ratios differ by group and sometimes within one — the caps are 9:16
 * product shots except the Privacy collection, which is a landscape pair
 * showing front and back, and the Uniswap × Cali tee is 4470×3238 against the
 * others' 1024. The page contains rather than crops, so a cap is never beheaded
 * to fit a square and a wide shot is never cut in half.
 */
export const SWAG_GROUPS: readonly SwagGroup[] = [
  {
    id: 'caps',
    name: { es: 'Gorras', en: 'Caps' },
    items: [
      {
        name: { es: 'Gorra Privacy is Freedom', en: 'Privacy is Freedom cap' },
        detail: {
          es: 'La colección Valle del Cauca: el octaedro al frente, la frase atrás. Edición limitada.',
          en: 'The Valle del Cauca collection: the octahedron on the front, the line on the back. Limited edition.',
        },
        image: '/swags/cap-privacy-is-freedom.png',
        tags: [{ es: 'Edición limitada', en: 'Limited edition' }, { es: 'Frente y espalda', en: 'Front and back' }],
      },
      {
        // The same two caps as above, photographed with the plinths swapped —
        // octahedron to the front, the line to the back. Kept as its own card
        // at the user's request after the difference was pointed out.
        //
        // Worth knowing if this is ever reprinted: the engraved plaque in this
        // shot reads "Privacy IN Freedom Cap Collection". The caps themselves
        // are correct in both, and the shot above has the plaque right.
        name: { es: 'Gorra Privacy is Freedom — colección', en: 'Privacy is Freedom cap — collection' },
        detail: {
          es: 'La misma colección desde el otro lado: el octaedro al frente, la frase en la espalda.',
          en: 'The same collection from the other side: the octahedron on the front, the line on the back.',
        },
        image: '/swags/cap-privacy-is-freedom-2.png',
        tags: [{ es: 'Edición limitada', en: 'Limited edition' }, { es: 'Frente y espalda', en: 'Front and back' }],
      },
      {
        name: { es: 'Gorra Ethereum', en: 'Ethereum cap' },
        detail: { es: 'El octaedro bordado. La que más se pide.', en: 'The embroidered octahedron. The one most asked for.' },
        image: '/swags/cap-ethereum.png',
        tags: [{ es: 'Bordada', en: 'Embroidered' }, { es: 'Ajustable', en: 'Adjustable' }],
      },
      {
        name: { es: 'Gorra OP Mainnet', en: 'OP Mainnet cap' },
        detail: { es: 'Con los colores de Optimism.', en: "In Optimism's colours." },
        image: '/swags/cap-optimism.png',
        tags: [{ es: 'Edición limitada', en: 'Limited edition' }],
      },
      {
        name: { es: 'Gorra Uniswap', en: 'Uniswap cap' },
        detail: { es: 'Para quienes viven en DeFi.', en: 'For the people who live in DeFi.' },
        image: '/swags/cap-uniswap.png',
        tags: [{ es: 'Edición limitada', en: 'Limited edition' }],
      },
      {
        name: { es: 'Gorra Pepe', en: 'Pepe cap' },
        detail: { es: 'Porque sí.', en: 'Because why not.' },
        image: '/swags/cap-pepe.png',
        tags: [{ es: 'Edición limitada', en: 'Limited edition' }],
      },
    ],
  },
  {
    id: 'mugs',
    name: { es: 'Mugs', en: 'Mugs' },
    items: [
      {
        name: { es: 'Mug Ethereans', en: 'Ethereans mug' },
        detail: {
          es: 'La escena del génesis de Ethereum, dibujada a mano y en acuarela.',
          en: "Ethereum's genesis scene, hand-drawn in watercolour.",
        },
        image: '/swags/mug-ethereans.png',
        tags: [{ es: 'Conmemorativo', en: 'Commemorative' }],
      },
      {
        name: { es: 'Mug Ethereum', en: 'Ethereum mug' },
        detail: { es: 'El octaedro, sin más.', en: 'The octahedron, nothing else.' },
        image: '/swags/mug-ethereum.png',
        tags: [{ es: 'Cerámica', en: 'Ceramic' }],
      },
      {
        name: { es: 'Mug ETHGlobal', en: 'ETHGlobal mug' },
        detail: {
          es: 'De los hackathons de ETHGlobal, con quienes organizamos.',
          en: 'From the ETHGlobal hackathons, one of the organisations we run things with.',
        },
        image: '/swags/mug-ethglobal.png',
        tags: [{ es: 'Cerámica', en: 'Ceramic' }],
      },
      {
        name: { es: 'Mug Cyber Doge', en: 'Cyber Doge mug' },
        detail: { es: 'El meme que sobrevivió a todos los ciclos.', en: 'The meme that outlived every cycle.' },
        image: '/swags/mug-cyber-doge.png',
        tags: [{ es: 'Edición limitada', en: 'Limited edition' }],
      },
    ],
  },
  {
    id: 'hoodies',
    name: { es: 'Hoodies', en: 'Hoodies' },
    items: [
      {
        name: { es: 'Hoodie Colombian Collaborative', en: 'Colombian Collaborative hoodie' },
        detail: {
          es: 'Crudo, con el lockup al pecho y las manos sosteniendo el octaedro a la espalda. Hecho con artesanos del Valle.',
          en: 'Undyed, the lockup on the chest and hands holding the octahedron on the back. Made with artisans from the Valle.',
        },
        image: '/swags/hoodie-cream.png',
        tags: [{ es: 'Artesanal', en: 'Artisanal' }, { es: 'Frente y espalda', en: 'Front and back' }],
      },
      {
        name: { es: 'Hoodie negro', en: 'Black hoodie' },
        detail: { es: 'La versión oscura, con los detalles en ultramarino.', en: 'The dark version, details picked out in ultramarine.' },
        image: '/swags/hoodie-black.png',
        tags: [{ es: 'Algodón premium', en: 'Premium cotton' }],
      },
      {
        name: { es: 'Hoodie Community Edition', en: 'Community Edition hoodie' },
        detail: { es: 'Edición especial que celebra a la comunidad.', en: 'A special edition celebrating the community.' },
        image: '/swags/hoodie-community.jpg',
        tags: [{ es: 'Edición limitada', en: 'Limited edition' }],
      },
    ],
  },
  {
    id: 'tshirts',
    name: { es: 'Camisetas', en: 'T-shirts' },
    items: [
      {
        // The only one that is about Cali rather than about Ethereum, and the
        // only black one, so it leads.
        name: { es: 'Camiseta Uniswap × Cali', en: 'Uniswap × Cali t-shirt' },
        detail: {
          es: 'El unicornio al pecho y Cali a la espalda: el Gato del Río, Cristo Rey, las iglesias y el río, en una línea rosada.',
          en: 'The unicorn on the chest and Cali on the back: the Gato del Río, Cristo Rey, the churches and the river, in one pink line.',
        },
        image: '/swags/tshirt-uniswap-cali.png',
        tags: [{ es: 'Oversized', en: 'Oversized' }, { es: 'Frente y espalda', en: 'Front and back' }],
      },
      {
        name: { es: 'Camiseta Impacto', en: 'Impact t-shirt' },
        detail: {
          es: 'El octaedro al pecho y las manos sosteniéndolo a la espalda — la misma ilustración del hoodie crudo.',
          en: 'The octahedron on the chest and the hands holding it on the back — the same illustration as the undyed hoodie.',
        },
        image: '/swags/tshirt-impact.png',
        tags: [{ es: 'Frente y espalda', en: 'Front and back' }],
      },
      {
        name: { es: 'Camiseta Robot', en: 'Robot t-shirt' },
        detail: {
          es: 'Un robot armado con bloques, a la espalda. Para el track de smart devices y hardware abierto.',
          en: 'A robot built out of blocks, on the back. For the smart devices and open hardware track.',
        },
        image: '/swags/tshirt-robot.png',
        tags: [{ es: 'Frente y espalda', en: 'Front and back' }],
      },
      {
        name: { es: 'Camiseta Doge — Merkle Collection', en: 'Doge t-shirt — Merkle Collection' },
        detail: { es: 'El doge en su escritorio. Edición global limitada.', en: 'The doge at his desk. Limited global release.' },
        image: '/swags/tshirt-doge-merkle.png',
        tags: [{ es: 'Edición limitada', en: 'Limited edition' }, { es: 'Frente y espalda', en: 'Front and back' }],
      },
    ],
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
