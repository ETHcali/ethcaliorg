/**
 * EAG Global Buildathon — the Colombia track, judged in Cali on 20 September 2026.
 *
 * The results of the campaign in `content/builders-tour.ts`, and they live beside
 * it for the same reason: a fixed-date campaign whose every change should be
 * reviewed in a diff. This one has a second reason. These are other people's
 * names, other people's work and a ranking, and none of those are things anyone
 * should be able to alter through a form at midnight.
 *
 * Every project here was submitted to Devfolio and every field below is taken
 * from that submission — the tagline, the blurb, the team, the tracks, the links.
 * Devfolio is the record; this page is a mirror of it, so `devfolio` is on every
 * card and a reader can check us.
 */
import type { Bilingual } from './builders-tour';

export const RESULTS = {
  /**
   * Nested under the campaign, the way Frontier Cities is. The buildathon is not
   * a standing programme — it is what happened at the Builders Tour stop, and
   * the URL says so.
   */
  path: '/builders-tour/winners',

  hackathon: 'EAG Global Buildathon',
  /** The track the Cali room competed in. Left in English, as EAG publishes it. */
  track: 'Colombia Hackathon',
  devfolioUrl: 'https://eag-global-buildathon.devfolio.co',
  judgedOn: '2026-09-20',

  /**
   * What the room actually was, for the hero.
   *
   * `hackers` is the count of people in the room over the two days, and it is
   * deliberately NOT derived from `PROJECTS`. Adding up the team arrays gives 24,
   * because that counts names credited on a Devfolio submission — not everyone
   * who built, mentored or stayed up, and not the ones whose teammate filled the
   * form in without listing them. The room was more than 25. Do not "fix" this
   * against the team arrays; they are answering a different question.
   *
   * `hours` is the gap between the opening at 09:00 Saturday and the winner
   * announcement at 17:30 Sunday, stated as the ceiling rather than the figure —
   * "under 48 hours" is the claim, and it is true with room to spare.
   */
  hackers: 25,
  hours: 48,

  /**
   * Two prize sets, judged separately, and the page must not conflate them.
   *
   * EAG picks five projects at 200 USDT each. HashKey Chain picks three more on
   * its own track at 500 / 300 / 200 — eight places in total across the weekend,
   * not five. Saying "five took a prize" undersells the room by three and tells
   * the HashKey entrants their result already happened without them.
   *
   * The HashKey places and the Devcon tickets have not been awarded yet; the page
   * holds them open rather than leaving them off.
   */
  prize: { each: 200, token: 'USDT', winners: 5 },
} as const;

export interface Member {
  name: string;
  /** Devfolio handle, without the @. Shown as the credit, linked to the profile. */
  handle?: string;
}

export interface ProjectLinks {
  github?: string;
  demo?: string;
  video?: string;
}

export interface Project {
  /** As the team wrote it on Devfolio. */
  name: string;
  /** The Devfolio slug — the URL and the identifier, both. */
  slug: string;
  /** 1–5 for the five EAG winners, absent for everything else. */
  place?: 1 | 2 | 3 | 4 | 5;
  /** The team's own one-liner, translated where it was written in one language. */
  tagline: Bilingual;
  blurb: Bilingual;
  team: readonly Member[];
  /** EAG and HashKey tracks, as published. Colombia Hackathon is on all of them
   *  and is therefore stated once on the page rather than 13 times. */
  tracks: readonly string[];
  links: ProjectLinks;
  /** Photograph from the demo showcase. Only the winners have one. */
  photo?: string;
}

/**
 * Thirteen projects, winners first.
 *
 * The order is the ranking for the first five and submission order after that —
 * a hackathon page that ranks everyone invents nine places nobody was given.
 */
export const PROJECTS: readonly Project[] = [
  {
    name: 'AdAura',
    slug: 'darwin-agents-bb77',
    place: 1,
    photo: '/winnerseagglobalhackathon/ads.jpg',
    tagline: {
      es: 'Agentes de marketing que evolucionan, con el techo de gasto en cadena',
      en: 'Marketing agents that evolve, capped on-chain',
    },
    blurb: {
      es:
        'Das un producto y un presupuesto. El sistema crea una población de agentes, cada uno con ' +
        'una estrategia distinta y su propia billetera con tope de gasto. Los que pierden plata se ' +
        'eliminan; los rentables se reproducen con mutaciones y le pasan el presupuesto que no ' +
        'gastaron a sus descendientes. El tope no es una instrucción en un prompt: lo impone el ' +
        'contrato.',
      en:
        'You give it a product and a budget. The system creates a population of agents, each with a ' +
        'different strategy and its own wallet with an enforced spending cap. The ones that lose ' +
        'money are eliminated; the profitable ones reproduce with mutations and pass their unspent ' +
        'budget to their offspring. The cap is not a line in a prompt — the contract enforces it.',
    },
    team: [{ name: 'Juan Collazos', handle: 'jucollas' }],
    tracks: ['AI x Ethereum & Agent Economy', 'HSK Chain'],
    links: {
      github: 'https://github.com/jucollas/darwin-agents',
      demo: 'https://darwin-agents-xi.vercel.app/',
    },
  },
  {
    name: 'Aureo',
    slug: 'aureo-f338',
    place: 2,
    photo: '/winnerseagglobalhackathon/aureo.jpg',
    tagline: {
      es: 'Middleware de Ethereum para riesgo, cumplimiento y billeteras',
      en: 'Ethereum middleware for risk, compliance and wallets',
    },
    blurb: {
      es:
        'Middleware de código abierto que observa transferencias corporativas registradas en cadena ' +
        'y las evalúa en tiempo real con reglas deterministas de velocidad y volumen. Entrega un ' +
        'veredicto de riesgo — alto, medio, bajo — por CLI, API y WebSocket, con la evidencia ' +
        'auditable detrás.',
      en:
        'Open-source middleware that watches corporate transfers registered on-chain and scores them ' +
        'in real time against deterministic velocity and volume rules. It returns a risk verdict — ' +
        'alto, medio, bajo — over CLI, API and WebSocket, with the auditable evidence behind it.',
    },
    team: [{ name: 'Andrei Sherikhov', handle: 'Sherikhov' }],
    tracks: ['Application Middleware & Open-Source Tooling'],
    links: { github: 'https://github.com/Sherikxd/aureo' },
  },
  {
    name: 'PITCH402',
    slug: 'alis-8bf0',
    place: 3,
    photo: '/winnerseagglobalhackathon/pitcx402.jpg',
    tagline: {
      es: 'Pitch de playlists, hecho por agentes',
      en: 'Agentic playlist pitching',
    },
    blurb: {
      es:
        'Un estante que se paga. Un curador abre su playlist con precios por posición — el puesto 1 ' +
        'cuesta 10 USDC y va bajando hasta 1 — y los agentes consultan qué hay libre, proponen un ' +
        'tema y reciben recibo a través de un cobro HTTP 402 en Base Sepolia. Resuelve la última ' +
        'milla entre un tema terminado y que alguien lo escuche.',
      en:
        'A shelf that charges. A curator opens a playlist priced by position — spot 1 costs 10 USDC, ' +
        'sliding down to 1 — and agents query what is free, submit a track and get a receipt through ' +
        'an HTTP 402 payment challenge on Base Sepolia. It is the last mile between a finished track ' +
        'and anyone hearing it.',
    },
    team: [{ name: 'Yoshiro Mare', handle: 'YoshiroMare' }],
    tracks: ['AI x Ethereum & Agent Economy', 'AI-Native Creator Economy & Digital Rights', 'HSK Chain'],
    links: {
      github: 'https://github.com/yoshiro-mare/pitch402-hackathon',
      demo: 'https://pitch402-hackathon.vercel.app/',
    },
  },
  {
    name: 'Minga Grid',
    slug: 'minganature-29f0',
    place: 4,
    photo: '/winnerseagglobalhackathon/Minga.jpg',
    tagline: {
      es: 'Te pagan por la electricidad que no gastas cuando la red la necesita',
      en: "You get paid for the electricity you don't use when the grid needs it",
    },
    blurb: {
      es:
        'Entre 6 y 9 de la noche la energía mayorista en Colombia cuesta entre 1,5 y 1,8 veces el ' +
        'promedio del día. Minga Grid deja que un negocio pequeño se comprometa a bajar su consumo ' +
        'en esa franja, verifica el resultado contra su línea base con lecturas firmadas del medidor ' +
        'y liquida el pago solo. La fricción operativa era lo que dejaba a los pequeños por fuera.',
      en:
        'Between 6 and 9 in the evening, wholesale power in Colombia costs 1.5 to 1.8 times the daily ' +
        'average. Minga Grid lets a small business commit to cutting its consumption in that window, ' +
        'verifies the result against its baseline using signed smart-meter readings, and settles the ' +
        'payment by itself. Operational friction was what kept small participants out.',
    },
    team: [{ name: 'Jhon Tejada', handle: '0xjh0n' }],
    tracks: ['AI x Ethereum & Agent Economy', 'Real-World Ethereum Applications', 'HSK Chain'],
    links: {
      github: 'https://github.com/jhontejada95/minga-grid',
      demo: 'https://minga-grid.vercel.app/',
      video: 'https://youtu.be/WyTGGTUWhT4',
    },
  },
  {
    name: 'TrazaMed',
    slug: 'trazamed-5a33',
    place: 5,
    photo: '/winnerseagglobalhackathon/trazamed.jpg',
    tagline: {
      es: 'Trazabilidad y pago verificado de medicamentos',
      en: 'Traceability and verified payment for medicines',
    },
    blurb: {
      es:
        'Un ESP32 con sensores de temperatura, aceleración y movimiento viaja con el lote. Las ' +
        'lecturas pasan por una pasarela que las firma antes de escribirlas en un contrato en HashKey ' +
        'Chain Testnet, que guarda la historia del lote y libera el pago en depósito únicamente si el ' +
        'envío llegó en condiciones. Si la cadena de frío se rompió, el dinero no se mueve.',
      en:
        'An ESP32 carrying temperature, acceleration and motion sensors travels with the batch. The ' +
        'readings pass through a gateway that signs them before writing them to a contract on HashKey ' +
        'Chain Testnet, which keeps the batch history and releases the escrowed payment only if the ' +
        'shipment arrived in condition. If the cold chain broke, the money does not move.',
    },
    team: [
      { name: 'William Andrés Ortiz Estrada', handle: 'leonidas4525' },
      { name: 'Herlyn Echeverry', handle: 'Jwasson' },
      { name: 'Kevin Díaz', handle: 'Kevin_Diaz' },
      { name: 'Luisa Cáceres', handle: 'Catalina' },
    ],
    tracks: ['Smart Devices, Open Hardware & Privacy Hardware', 'HSK Chain'],
    links: {
      github: 'https://github.com/helynecheverry/trazabilidad-medicamentos',
      demo: 'https://helynecheverry.github.io/trazabilidad-medicamentos/TrazaMed-ES.html',
    },
  },

  // ── the rest of the room ──────────────────────────────────────────────────

  {
    name: 'PayAgent HSK',
    slug: 'payagenthsk-6cb5',
    tagline: {
      es: 'Economía de agentes autónomos, pagos máquina a máquina con x402',
      en: 'Autonomous agent economy, x402 machine payments',
    },
    blurb: {
      es:
        'Infraestructura de pago para agentes sobre HashKey Chain: micropagos negociados y liquidados ' +
        'por máquinas con HTTP 402, divulgación selectiva de credenciales con pruebas de conocimiento ' +
        'cero, y verificación de entrega física anclada en hardware. Tokeniza microlotes de café ' +
        'colombiano de origen como el activo real del otro lado.',
      en:
        'Payment infrastructure for agents on HashKey Chain: micropayments negotiated and settled ' +
        'machine to machine over HTTP 402, selective credential disclosure with zero-knowledge proofs, ' +
        'and hardware-anchored delivery verification. It tokenises specialty Colombian coffee ' +
        'micro-lots as the real asset on the other end.',
    },
    team: [
      { name: 'Marco Polo', handle: 'mapoca12' },
      { name: 'Alejandro Paredes', handle: 'alejandro0405' },
    ],
    tracks: [
      'AI x Ethereum & Agent Economy',
      'Local AI, Private AI & User-Owned Data',
      'Application Middleware & Open-Source Tooling',
      'Smart Devices, Open Hardware & Privacy Hardware',
      'Real-World Ethereum Applications',
      'HSK Chain',
    ],
    links: {
      github: 'https://github.com/mapoca1219/-payagent-hsk',
      demo: 'https://payagent-hsk.vercel.app/',
      video: 'https://youtu.be/FcMVaqFYvvk',
    },
  },
  {
    name: 'VeriPass',
    slug: 'veripass-b315',
    tagline: {
      es: 'Boletería sin fraude ni reventa',
      en: 'Ticketing without fraud or scalping',
    },
    blurb: {
      es:
        'La boleta es un QR criptográfico que se genera desde la billetera del asistente y caduca en ' +
        'segundos, así que una captura de pantalla no vale nada. La reventa pasa por un contrato con ' +
        'tope de precio y regalías automáticas para el organizador, y el asistente no tiene que ' +
        'entender nada de la cadena para usarla.',
      en:
        'The ticket is a cryptographic QR generated from the attendee wallet that expires in seconds, ' +
        'so a screenshot is worth nothing. Resale runs through a contract with a price cap and ' +
        'automatic royalties to the organiser, and the attendee never has to understand the chain to ' +
        'use it.',
    },
    team: [
      { name: 'Miguel Carmona', handle: 'miguelACM' },
      { name: 'Samuel Ortiz', handle: 'Samuelsa' },
      { name: 'Luisa Restrepo', handle: 'luisas' },
    ],
    tracks: ['Real-World Ethereum Applications'],
    links: {
      github: 'https://github.com/Samuel88q/VeriPass',
      demo: 'https://veripassfrontend.vercel.app/',
      video: 'https://www.youtube.com/watch?v=qo8o40BAbL0',
    },
  },
  {
    name: 'Claudio',
    slug: 'claudio-9ed6',
    tagline: {
      es: 'Se paga solo el agua que demostró cumplir la norma',
      en: 'Paid only for water that verifiably met the law',
    },
    blurb: {
      es:
        'Tratamiento de aguas residuales con microalgas, donde quien produce la evidencia de ' +
        'cumplimiento es el mismo que cobra por ella. El contrato no recibe porcentajes de remoción: ' +
        'recibe las lecturas crudas de entrada y salida y calcula la eficiencia él mismo, aplica el ' +
        'umbral regulatorio y libera el pago con el cumplimiento. Un lote que falla queda registrado ' +
        'como fallido, para siempre.',
      en:
        'Microalgae wastewater treatment, where whoever produces the compliance evidence is also the ' +
        'one paid for it. The contract does not accept removal percentages: it takes the raw influent ' +
        'and effluent readings and derives the efficiency itself, applies the regulatory threshold and ' +
        'releases payment with compliance. A batch that fails is recorded as failed, permanently.',
    },
    team: [{ name: 'Susan Taborda', handle: 'susantaborda' }],
    tracks: ['AI x Ethereum & Agent Economy', 'Real-World Ethereum Applications'],
    links: {},
  },
  {
    name: 'BlockByBlock',
    slug: 'blockbyblock-811f',
    tagline: {
      es: 'Donaciones directas, sin intermediario que custodie',
      en: 'Direct donations, with no intermediary holding the money',
    },
    blurb: {
      es:
        'El donante manda USDT directo a una causa verificada, sin que ninguna plataforma tenga la ' +
        'custodia ni cobre comisión. Un agente evalúa la evidencia de la causa y firma la ' +
        'verificación en cadena solo si su confianza supera 0,80; todo queda anclado en HSK Chain ' +
        'testnet para que se pueda auditar.',
      en:
        'The donor sends USDT straight to a verified cause, with no platform taking custody or a cut. ' +
        'An agent evaluates the evidence behind the cause and signs the verification on-chain only if ' +
        'its confidence clears 0.80; all of it is anchored on HSK Chain testnet so it can be audited.',
    },
    team: [
      { name: 'Miguel Uribe', handle: 'mauribe' },
      { name: 'Andres Uribe', handle: 'devcarlosauribe' },
    ],
    tracks: ['AI x Ethereum & Agent Economy', 'Real-World Ethereum Applications'],
    links: {
      github: 'https://github.com/mauc-agentic/block-by-block',
      demo: 'https://block-by-block-olive.vercel.app/',
    },
  },
  {
    name: 'X-Mate',
    slug: 'x-mate-127f',
    tagline: {
      es: 'Cobra fácil. Tus llaves siguen siendo tuyas.',
      en: 'Pay simple. Stay in control.',
    },
    blurb: {
      es:
        'El comerciante escribe el cobro como lo diría: «cóbrale a Ana 15 dólares por la camisa ' +
        'azul». El agente lo interpreta, genera el QR y vigila la confirmación en la cadena. La ' +
        'billetera no es custodiada — las llaves nunca salen del teléfono.',
      en:
        'The merchant writes the charge the way they would say it: "charge Ana $15 for the blue ' +
        'shirt". The agent reads it, generates the QR and watches for confirmation on chain. The ' +
        'wallet is non-custodial — the keys never leave the phone.',
    },
    team: [
      { name: 'Emmanuel Buendía' },
      { name: 'Juan Borrero', handle: 'juanjosbg' },
    ],
    tracks: ['Real-World Ethereum Applications'],
    links: { github: 'https://github.com/EmanuelDesarrollo/ethereum-app-transaction' },
  },
  {
    name: 'Nature Intelligence',
    slug: 'nature-intelligence-0e1a',
    tagline: { es: 'Observación satelital del territorio', en: 'Satellite observation of territory' },
    blurb: {
      es:
        'Cruza el polígono oficial del Parque Tayrona con observaciones Sentinel-2 y NDVI para marcar ' +
        'cambios posibles en la cobertura vegetal. No presenta la señal satelital como conclusión: la ' +
        'convierte en un flujo que una persona puede leer y validar — territorio, observación, ' +
        'alerta, validación, evidencia.',
      en:
        'It crosses the official Parque Tayrona polygon with Sentinel-2 and NDVI observations to flag ' +
        'possible changes in land cover. It does not present the satellite signal as a conclusion: it ' +
        'turns it into a workflow a person can read and validate — territory, observation, alert, ' +
        'validation, evidence.',
    },
    team: [{ name: 'Alejandro Realpe', handle: 'aleph1' }],
    tracks: ['Real-World Ethereum Applications'],
    links: { github: 'https://github.com/symmetrysolutions1/Symmetry/tree/main/NatureIntelligence' },
  },
  {
    name: 'Bootsstraps',
    slug: 'bootsstraps-1d03',
    tagline: {
      es: 'Ayuda a que las ideas se vuelvan realidad',
      en: 'Helps ideas become real',
    },
    blurb: {
      es:
        'Un agente que convierte una idea en un proyecto financiable y verificable: encuentra los ' +
        'fondos y las convocatorias que le sirven, y prueba criptográficamente lo que el proyecto ' +
        'afirma sin exponer los datos detrás. El agente propone; autorizar un pago no está entre sus ' +
        'permisos.',
      en:
        'An agent that turns an idea into a fundable, verifiable project: it finds the grants and ' +
        'investors that fit, and proves what the project claims cryptographically without exposing the ' +
        'data behind it. The agent proposes; authorising a payment is not among its permissions.',
    },
    team: [
      { name: 'Santiago Campo', handle: 'santicamp' },
      { name: 'Jose Oñate', handle: 'Onatejose' },
      { name: 'Juan Mancilla', handle: 'Juan_Mancilla' },
    ],
    tracks: ['AI x Ethereum & Agent Economy'],
    links: { demo: 'https://bootstraphackaton.vercel.app/' },
  },
  {
    name: 'HashPool',
    slug: 'mining-pools-840c',
    tagline: { es: 'Pools de minería pequeños, repartidos con justicia', en: 'Micro mining pools, split fairly' },
    blurb: {
      es:
        'Reparte ingresos y costos entre socios de un pool pequeño pesando hashrate efectivo por ' +
        'tiempo en línea, no el hardware que cada uno dice tener. El contrato liquida y los fondos ' +
        'viven en un Safe multifirma, así que ningún socio puede vaciar la caja. Vive en HSK Chain ' +
        'Testnet con 93 pruebas de contrato y 142 del motor de cálculo.',
      en:
        'It splits revenue and costs between the partners in a small pool by weighing effective ' +
        'hashrate against uptime, not the hardware anyone claims to have. The contract settles and the ' +
        'funds sit in a multisig Safe, so no partner can drain the pot. Live on HSK Chain Testnet with ' +
        '93 contract tests and 142 engine tests.',
    },
    team: [
      { name: 'Jhonn Torres', handle: '0xalxeth' },
      { name: 'Juan Vallejo', handle: 'Juanvallejo01' },
    ],
    tracks: ['Real-World Ethereum Applications'],
    links: {
      github: 'https://github.com/DevJhonnTorres/EAG-hack',
      demo: 'https://hashpool-jhonns-projects-665cb796.vercel.app/',
    },
  },
];

/**
 * The HashKey Chain track, held open.
 *
 * Three places, 1,000 USDT between them, judged separately from the EAG prize
 * and not awarded yet. The slots exist now with `slug: null` rather than being
 * added to the page when the result lands, for two reasons: a builder who
 * competed for this can see that their result is still coming, and filling it in
 * afterwards is one line per place rather than a new section written under time
 * pressure on the day it is announced.
 *
 * To announce a winner, put its Devfolio slug in `slug`. The card then renders
 * that project from `PROJECTS` — name, tagline, team, links — and the page copy
 * switches from "to be announced" on its own. Nothing else to change.
 */
export interface HskSlot {
  place: 1 | 2 | 3;
  /** USDT. The amounts HashKey Chain published for its own track. */
  prize: number;
  /** The winning project's Devfolio slug, once there is one. */
  slug: string | null;
}

export const HSK = {
  sponsor: 'HashKey Chain',
  url: 'https://hsk.xyz',
  x: 'https://x.com/HSKChain',
  logo: '/tour/hashkey-chain.jpg',
  token: 'USDT',
  /** The name of the track exactly as it appears on each project's chips. */
  trackTag: 'HSK Chain',
  slots: [
    { place: 1, prize: 500, slug: null },
    { place: 2, prize: 300, slug: null },
    { place: 3, prize: 200, slug: null },
  ] as readonly HskSlot[],
} as const;

/** One project by its slug, for a filled HSK slot. */
export const projectBySlug = (slug: string): Project | null =>
  PROJECTS.find((p) => p.slug === slug) ?? null;

/** Everything that entered the HashKey Chain track, read off the chips rather
 *  than listed a second time — a second list is a list that goes stale. */
export const HSK_ENTRANTS = PROJECTS.filter((p) => p.tracks.includes(HSK.trackTag));

/** True once any place has been filled in. Drives the page copy. */
export const HSK_ANNOUNCED = HSK.slots.some((s) => s.slug !== null);

/**
 * The lead, counted rather than typed.
 *
 * Every number in this sentence is read off the data beside it, so the prose
 * cannot end up disagreeing with the page under it. It was written out in full
 * once and already said "13 projects" in two languages next to an array whose
 * length is the real answer — two copies of a number is one copy too many.
 *
 * What happened, not who won: the lead used to open on "thirteen projects, five
 * took a prize", which counted only EAG's places and left HashKey Chain's three
 * out. The prizes have two sections of their own; this says what was built.
 */
export const resultsLead = (locale: 'es' | 'en'): string =>
  locale === 'en'
    ? `More than ${RESULTS.hackers} hackers and ${PROJECTS.length} projects in under ${RESULTS.hours} hours, ` +
      'building frontier applications with Ethereum, artificial intelligence, smart devices and ' +
      'open-source software.'
    : `Más de ${RESULTS.hackers} hackers y ${PROJECTS.length} proyectos en menos de ${RESULTS.hours} horas, ` +
      'construyendo aplicaciones de frontera con Ethereum, inteligencia artificial, smart devices y ' +
      'software de código abierto.';

/**
 * The lead over the rest of the room.
 *
 * Two things it deliberately does not say. It does not claim a submission
 * order — the order these sit in is the order we were handed the links, and
 * Devfolio does not publish timestamps we read, so "in the order they were
 * submitted" was a fact we never had.
 *
 * And it does not call them losers. One of them is still on the HashKey Chain
 * track with three places undecided, and that count is computed rather than
 * written down so it corrects itself the moment a slot is filled in.
 */
export const othersLead = (locale: 'es' | 'en'): string => {
  const stillIn = OTHERS.filter((p) => p.tracks.includes(HSK.trackTag)).length;
  const open = HSK.slots.some((s) => s.slug === null);

  if (locale === 'en') {
    const base = `The other ${OTHERS.length} projects submitted from Cali, which are not among EAG's ${RESULTS.prize.winners}.`;
    return stillIn && open
      ? `${base} ${stillIn === 1 ? 'One of them is' : `${stillIn} of them are`} still in the running on the HashKey Chain track.`
      : base;
  }

  const base = `Los otros ${OTHERS.length} proyectos que se entregaron desde Cali, que no entraron en los ${RESULTS.prize.winners} de EAG.`;
  return stillIn && open
    ? `${base} ${stillIn === 1 ? 'Uno de ellos sigue' : `${stillIn} de ellos siguen`} en carrera por el track de HashKey Chain.`
    : base;
};

/**
 * Where the weekend was streamed.
 *
 * Both days went out live on two platforms at once. The YouTube recording can be
 * framed; an X broadcast cannot, so that one is a link. No view counts on the
 * page — they only go up, so any number written here is wrong by the time
 * someone reads it, and a recording is worth watching or it is not.
 *
 * `youtube-nocookie.com` rather than `youtube.com`: it is the same player
 * without the ad-tracking cookie dropped on a visitor who never pressed play.
 * This is the first iframe on the site that needed `allow` and `allowFullScreen`
 * — the Luma and Maps embeds take neither.
 */
export const STREAMS = {
  youtube: {
    url: 'https://www.youtube.com/watch?v=4E7bnnKVj-c',
    /** Split out because the embed path takes the bare id, not the watch URL. */
    videoId: '4E7bnnKVj-c',
  },
  x: {
    url: 'https://x.com/i/broadcasts/1nxnRBgeYaoxO',
  },
} as const;

export const youtubeEmbedUrl = (videoId: string) =>
  `https://www.youtube-nocookie.com/embed/${videoId}`;

/** `https://devfolio.co/projects/<slug>` — the record behind every card. */
export const devfolioUrl = (slug: string) => `https://devfolio.co/projects/${slug}`;

/** A Devfolio profile, for the credit under each project. */
export const devfolioProfile = (handle: string) => `https://devfolio.co/@${handle}`;

export const WINNERS = PROJECTS.filter((p) => p.place) as readonly (Project & { place: 1 | 2 | 3 | 4 | 5 })[];
export const OTHERS = PROJECTS.filter((p) => !p.place);

export const RESULTS_COPY = {
  eyebrow: { es: 'EAG Global Buildathon · Cali', en: 'EAG Global Buildathon · Cali' } as Bilingual,
  title: { es: 'Los ganadores', en: 'The winners' } as Bilingual,
  seoTitle: {
    es: 'Ganadores del EAG Global Buildathon en Cali',
    en: 'EAG Global Buildathon winners in Cali',
  } as Bilingual,
  // ── the HashKey Chain track ──────────────────────────────────────────────
  hskTitle: { es: 'El track de HashKey Chain', en: 'The HashKey Chain track' } as Bilingual,
  hskLeadPending: {
    es:
      'Patrocinador principal del fin de semana, con un track propio y 1.000 USDT repartidos en tres ' +
      'puestos. Se juzga aparte del premio de EAG y todavía no se anuncia — los tres puestos están ' +
      'aquí, reservados. Cuando se decidan, se llenan en esta misma página.',
    en:
      'Title sponsor of the weekend, with a track of its own and 1,000 USDT across three places. It is ' +
      'judged separately from the EAG prize and has not been announced yet — the three places are ' +
      'here, held open. When they are decided they will be filled in on this page.',
  } as Bilingual,
  hskLeadAnnounced: {
    es: 'Patrocinador principal del fin de semana, con un track propio y 1.000 USDT repartidos en tres puestos, juzgados aparte del premio de EAG.',
    en: 'Title sponsor of the weekend, with a track of its own and 1,000 USDT across three places, judged separately from the EAG prize.',
  } as Bilingual,
  /** In the empty slot. Short, because it is repeated three times. */
  hskAwaiting: { es: 'Por anunciar', en: 'To be announced' } as Bilingual,
  hskEntrants: {
    es: 'Compitieron en este track',
    en: 'Competed on this track',
  } as Bilingual,
  hskCumulative: {
    es: 'Los premios se acumulan: un proyecto que ya ganó arriba puede llevarse este también.',
    en: 'Prizes stack: a project that already won above can take this one too.',
  } as Bilingual,

  // ── Devcon ───────────────────────────────────────────────────────────────
  devconTitle: { es: 'Entradas a Devcon', en: 'Devcon tickets' } as Bilingual,
  devconPending: {
    es:
      'La Ethereum Foundation aporta entradas a Devcon VIII para los ganadores, a través del programa ' +
      'Road to Devcon, valoradas en 499 USD cada una. Todavía sin asignar; se publican aquí cuando lo estén.',
    en:
      'The Ethereum Foundation is contributing Devcon VIII tickets for winners through the Road to ' +
      'Devcon programme, valued at 499 USD each. Not yet allocated; they will be published here when they are.',
  } as Bilingual,
  placeLabel: { es: 'Puesto', en: 'Place' } as Bilingual,

  /**
   * "The podium" said podium of what, and the answer was five of eight places.
   * These are EAG's, and the section says so — HashKey Chain's three are a
   * section of their own and were never in the running for this heading.
   */
  winnersTitle: { es: 'Los ganadores de EAG', en: "EAG's winners" } as Bilingual,
  podiumLead: {
    es: 'Cinco proyectos, 200 USDT cada uno, pagados sobre Ethereum mainnet.',
    en: 'Five projects, 200 USDT each, paid on Ethereum mainnet.',
  } as Bilingual,
  /**
   * "Everything that shipped" over eight of thirteen was simply false — the
   * other five are in the EAG section above it. This is an invitation to the
   * rest of the room rather than a consolation bracket: they are worth looking
   * at, which is the reason they are on the page at all.
   */
  othersTitle: {
    es: '¡Conoce más proyectos participantes!',
    en: 'Meet more of the projects that took part',
  } as Bilingual,
  onDevfolio: { es: 'Ver en Devfolio', en: 'View on Devfolio' } as Bilingual,
  code: { es: 'Código', en: 'Code' } as Bilingual,
  demo: { es: 'Demo', en: 'Demo' } as Bilingual,
  video: { es: 'Video', en: 'Video' } as Bilingual,
  backToTour: { es: 'Volver al Builders Tour', en: 'Back to the Builders Tour' } as Bilingual,

  // ── the stream ───────────────────────────────────────────────────────────
  streamTitle: { es: 'Revive la transmisión', en: 'Watch it back' } as Bilingual,
  streamLead: {
    es: 'Los dos días salieron en vivo por YouTube y por X. Las grabaciones quedan.',
    en: 'Both days went out live on YouTube and on X. The recordings are here.',
  } as Bilingual,
  streamOnYoutube: { es: 'Ver en YouTube', en: 'Watch on YouTube' } as Bilingual,
  // Named as a broadcast rather than a video: X will not frame it, so this link
  // leaves the site, and the label should say where it is going.
  streamOnX: { es: 'Ver el directo en X', en: 'Watch the broadcast on X' } as Bilingual,
} as const;
