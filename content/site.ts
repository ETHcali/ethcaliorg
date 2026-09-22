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

// ── about ───────────────────────────────────────────────────────────────────

/**
 * What ETH Cali is and what it has done.
 *
 * /about used to be the team page: a route called "Nosotros" that opened on
 * twenty portraits and never once said what the organisation had built. The
 * people moved to /team and this took the name it already had.
 *
 * Every number on the page is counted from Supabase at build time rather than
 * written here — 47 events, 19 venues, 6 universities are facts the CMS already
 * holds, and a second copy in prose is a copy that goes stale. The prose is what
 * cannot be counted.
 */
export const ABOUT = {
  eyebrow: { es: 'Nosotros', en: 'About us' } as Bilingual,
  title: { es: 'Qué es ETH Cali', en: 'What ETH Cali is' } as Bilingual,
  lead: {
    es:
      'La comunidad Ethereum de Cali y el Pacífico colombiano. Una fundación sin ánimo de lucro que ' +
      'enseña, investiga y construye con Ethereum — y que presta los equipos para que otros hagan lo mismo.',
    en:
      'The Ethereum community of Cali and the Colombian Pacific. A non-profit foundation that teaches, ' +
      'researches and builds with Ethereum — and lends out the hardware so other people can do the same.',
  } as Bilingual,

  origin: {
    title: { es: 'Cómo empezó', en: 'How it started' } as Bilingual,
    body: {
      es:
        'Empezó en 2022, después de Devcon VI, con dos eventos y la sospecha de que en Cali había gente ' +
        'suficiente para sostener una comunidad Ethereum. En 2023 fueron veinticinco.\n\n' +
        'No empezó con una oficina ni con financiación. Empezó en bares, cafés y salones prestados — el ' +
        'mapa de lugares de esta misma web sigue siendo esa lista — y con universidades que abrieron sus ' +
        'auditorios antes de que existiera un motivo obvio para hacerlo.\n\n' +
        'La Fundación Innovación del Pacífico es la figura legal que sostiene todo eso. Lo que se decide, ' +
        'se decide en cadena.',
      en:
        'It started in 2022, after Devcon VI, with two events and a suspicion that Cali had enough people ' +
        'to hold an Ethereum community together. In 2023 there were twenty-five.\n\n' +
        'It did not start with an office or with funding. It started in bars, cafés and borrowed lecture ' +
        'halls — the venue map on this site is still that list — and with universities that opened their ' +
        'auditoriums before there was an obvious reason to.\n\n' +
        'Fundación Innovación del Pacífico is the legal shape that holds it. What gets decided, gets ' +
        'decided on chain.',
    } as Bilingual,
  },

  numbers: {
    title: { es: 'Lo que llevamos', en: 'What it adds up to' } as Bilingual,
    lead: {
      es: 'Contado desde el CMS, no de memoria: cada cifra sale de las mismas filas que arman las páginas de eventos.',
      en: 'Counted from the CMS rather than from memory: every figure comes from the same rows that build the events pages.',
    } as Bilingual,
  },

  /** What we do, stated as work rather than as values. Links out to the proof. */
  doing: {
    title: { es: 'Qué hacemos', en: 'What we do' } as Bilingual,
    lead: {
      es: 'Cuatro cosas, y cada una tiene una página donde se puede verificar.',
      en: 'Four things, and each one has a page where you can check it.',
    } as Bilingual,
    items: [
      {
        title: { es: 'Enseñamos', en: 'We teach' } as Bilingual,
        body: {
          es: 'Meetups abiertos y workshops en seis universidades de la ciudad. Gratis, siempre, y sin pedir que sepas nada antes de llegar.',
          en: 'Open meetups and workshops across six universities in the city. Free, always, and with nothing you need to know before you arrive.',
        } as Bilingual,
        href: '/education',
        cta: { es: 'La ruta de aprendizaje', en: 'The learning path' } as Bilingual,
      },
      {
        title: { es: 'Organizamos hackathons', en: 'We run hackathons' } as Bilingual,
        body: {
          es: 'Con EAG, HashKey Chain, Base, Uniswap y ETHGlobal. Lo último fue el Ethereum Builders Tour, con más de 25 hackers en menos de 48 horas.',
          en: 'With EAG, HashKey Chain, Base, Uniswap and ETHGlobal. The latest was the Ethereum Builders Tour: 25+ hackers in under 48 hours.',
        } as Bilingual,
        href: '/hackathons',
        cta: { es: 'Todos los hackathons', en: 'Every hackathon' } as Bilingual,
      },
      {
        title: { es: 'Prestamos los equipos', en: 'We lend the hardware' } as Bilingual,
        body: {
          es: 'Proyectores, sonido, cámaras y sillas. Gratis, y no hace falta ser de ETH Cali para pedirlos — para eso los compramos.',
          en: 'Projectors, sound, cameras and chairs. Free, and you do not have to be part of ETH Cali to ask — that is what we bought them for.',
        } as Bilingual,
        href: '/technical-infra',
        cta: { es: 'Ver el inventario', en: 'See the inventory' } as Bilingual,
      },
      {
        title: { es: 'Nos gobernamos en cadena', en: 'We govern on chain' } as Bilingual,
        body: {
          es: 'La tesorería es un Safe 3-de-5 en cinco cadenas, las decisiones se votan en Snapshot y cada dirección de esta web enlaza a su explorador.',
          en: 'The treasury is a 3-of-5 Safe on five chains, decisions are voted on Snapshot, and every address on this site links to its explorer.',
        } as Bilingual,
        href: '/dao',
        cta: { es: 'Cómo se decide', en: 'How decisions are made' } as Bilingual,
      },
    ],
  },

  team: {
    title: { es: 'Quiénes lo hacen', en: 'Who does it' } as Bilingual,
    body: {
      es: 'Veinte personas entre fundadores, core, elite, contribuidores y voluntarios. Todos empezaron como alguien que llegó a un meetup.',
      en: 'Twenty people across founders, core, elite, contributors and volunteers. Every one of them started as someone who turned up to a meetup.',
    } as Bilingual,
    cta: { es: 'Conocer al equipo', en: 'Meet the team' } as Bilingual,
  },

  labels: {
    events: { es: 'Eventos', en: 'Events' } as Bilingual,
    meetups: { es: 'Meetups', en: 'Meetups' } as Bilingual,
    workshops: { es: 'Workshops', en: 'Workshops' } as Bilingual,
    hackathons: { es: 'Hackathons', en: 'Hackathons' } as Bilingual,
    hosted: { es: 'Organizados por nosotros', en: 'Run by us' } as Bilingual,
    venues: { es: 'Lugares', en: 'Venues' } as Bilingual,
    universities: { es: 'Universidades', en: 'Universities' } as Bilingual,
    years: { es: 'Años', en: 'Years' } as Bilingual,
  },
} as const;

// ── impact ──────────────────────────────────────────────────────────────────

/**
 * What five years added up to, and where to check it.
 *
 * The onchain figures come from `content/dune.generated.ts`, which
 * `scripts/dune.mts` writes from the Dune dashboard's saved runs on every build.
 * They used to be hand-counted and stale: "400+ personas onboardeadas" against
 * a real 441, and "10+ ETH transados" — a metric the dashboard does not even
 * produce, so it was never checkable.
 *
 * `source` marks measured against counted, and the note says so in prose.
 * A guess printed beside a measurement looks like a measurement.
 */

/**
 * Chain names as Dune stores them, for the ones where lowercasing the slug is
 * not the brand. Everything else is title-cased on the way out — `scroll`,
 * `linea`, `blast` and `taiko` all come out right that way.
 */
const CHAIN_NAMES: Record<string, string> = {
  bnb: 'BNB Chain',
  avalanche_c: 'Avalanche',
  zkevm: 'Polygon zkEVM',
  zksync: 'zkSync',
  opbnb: 'opBNB',
  xlayer: 'X Layer',
  hyperevm: 'HyperEVM',
  apechain: 'ApeChain',
  bob: 'BOB',
};

export const chainLabel = (name: string): string =>
  CHAIN_NAMES[name] ?? name.charAt(0).toUpperCase() + name.slice(1);

export const IMPACT = {
  dashboardUrl: 'https://dune.com/ethcali/onchain-metrics-by-users-onboarded-by-ethcali',
  since: { es: 'Desde Devcon VI, en 2022.', en: 'Since Devcon VI, in 2022.' } as Bilingual,

  /** How many chains to name before collapsing the rest into a count. */
  topChains: 8,

  /**
   * Not on Dune and not derivable from it: the chain knows what a wallet did,
   * not whether the person holding it writes Java for a living.
   *
   * `foot` replaces the paragraph that used to sit under the whole block
   * explaining which figures were measured and which were not. One caveat
   * belonged to one number, so it says so on that number instead of asking the
   * reader to hold a footnote in their head while they look at the other five.
   */
  handCounted: {
    value: '100+',
    label: { es: 'Developers Web2 alcanzados', en: 'Web2 developers reached' } as Bilingual,
    foot: { es: 'Conteo manual', en: 'Counted by hand' } as Bilingual,
  },

  labels: {
    users: { es: 'Billeteras onboardeadas', en: 'Wallets onboarded' } as Bilingual,
    transactions: { es: 'Transacciones onchain', en: 'Onchain transactions' } as Bilingual,
    volume: { es: 'USD movidos en tokens', en: 'USD moved in tokens' } as Bilingual,
    fees: { es: 'USD en comisiones a la blockchain', en: 'USD in fees to the blockchain' } as Bilingual,
    chains: { es: 'Cadenas con actividad', en: 'Chains with activity' } as Bilingual,
    byChain: { es: 'Dónde ocurre', en: 'Where it happens' } as Bilingual,
    /** The bar chart ranks by transactions; this says so rather than leaving it guessed. */
    byChainUnit: { es: 'transacciones', en: 'transactions' } as Bilingual,
    others: { es: 'y {n} cadenas más', en: 'and {n} more chains' } as Bilingual,
  },

  /**
   * The small line under a figure, for the ones whose label leaves a real
   * question open.
   *
   * "USD en comisiones pagadas" did not say who was paid, and a number that
   * size sitting on an organisation's own page reads as income. It is not: it
   * is gas these wallets paid to the networks they transacted on, and ETH Cali
   * never touched it. The label now names the recipient and this names what it
   * is not, because the second half is the half a reader gets wrong.
   */
  feet: {
    fees: {
      es: 'Gas de red · no es ingreso de ETH Cali',
      en: 'Network gas · not ETH Cali revenue',
    } as Bilingual,
  },

  /**
   * Where the numbers come from, which is the question the figures raise.
   *
   * Every query on the dashboard filters on one uploaded Dune dataset,
   * `dune.ethcali.dataset_users_onboarded_eth_cali` — a single column of wallet
   * addresses and nothing else, so Dune itself cannot say how the list was
   * built. The description below is checked against the chain rather than
   * assumed: the contract the most of these wallets have minted from is POAP
   * (0x22c1f605…, 149 of them on Gnosis and 75 more on Base), and the next is
   * BASETHCALI "BASE COMMUNITY CO" (0x19f7b283… on Base, 78 of them) — ETH
   * Cali's own collectible. The list is the event attendance record.
   *
   * {n} is filled from the same figure the first stat shows, so the sentence
   * cannot disagree with the card above it.
   */
  source: {
    es:
      'Todas las cifras se calculan sobre la misma lista de {n} billeteras en Dune: las que ' +
      'recogieron un POAP o un NFT de ETH Cali en nuestros eventos.',
    en:
      'Every figure is computed over the same list of {n} wallets on Dune: the ones that picked ' +
      'up a POAP or an ETH Cali NFT at one of our events.',
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
