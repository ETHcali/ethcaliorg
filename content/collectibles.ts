import type { Bilingual } from './site';

/**
 * Every POAP and every Unlock Protocol NFT ETH Cali has issued.
 *
 * Transcribed from the two registries the community keeps by hand — the NFT
 * sheet and the master event sheet — and then checked against the chain. The
 * sheets are the record of intent; the chain is the record of fact, and where
 * they disagreed the chain won:
 *
 * - `0x19f7b283…` on Base is one Unlock lock reused for all three Base
 *   Community Meetups. The sheet lists it three times, once per event. It is
 *   one collectible here, with the three events named on it, because three
 *   cards pointing at one contract claim three things that do not exist.
 * - The sheet dates the Drumcode locks "6/21/0204". They are June 2024.
 * - "Open House USB" is listed twice in the NFT sheet with identical values;
 *   the master sheet shows it deployed two locks, which is what is recorded.
 * - Hackathon USC is in both sheets and is not here. It was planned, an Unlock
 *   lock was deployed for it, and the event never happened.
 *
 * POAPs live at one contract per chain — every drop on Gnosis is
 * `0x22c1f605…` — so a POAP is identified by its drop id and an Unlock NFT by
 * its own contract address. That is why the two carry different fields.
 *
 * `holders` is the count the organisers recorded at the time. It is not
 * re-read from the chain on build: a POAP drop's collector count is not in any
 * Dune table, and half of these would go blank. Where a figure was never
 * recorded the field is absent and the card simply does not claim one.
 */
export type Protocol = 'poap' | 'unlock';

export interface Collectible {
  /** As the organisers named it, which is the event name. Not translated. */
  name: string;
  /** ISO. The day it was handed out, not the day the contract was deployed. */
  date: string;
  protocol: Protocol;
  /** Lowercase, as Dune and the design tokens spell it. */
  chain: string;
  /** Where the thing itself lives — poap.gallery, or the block explorer. */
  url: string;
  /** Unlock only. Several where one event deployed more than one lock. */
  contracts?: readonly string[];
  /** How many people took one, where it was recorded. */
  holders?: number;
  /** A second event that handed out this same collectible. */
  alsoUsedFor?: readonly string[];
  /** Instagram, X or YouTube — the proof it happened, next to the proof of who came. */
  post?: string;
}

export const COLLECTIBLES: readonly Collectible[] = [
  // ——— 2022 ———
  {
    name: 'ETH Cali Opening',
    date: '2022-12-26',
    protocol: 'poap',
    chain: 'gnosis',
    url: 'https://poap.gallery/drops/93758',
    holders: 0,
    post: 'https://www.instagram.com/p/CmxVlz6J9Go/',
  },

  // ——— 2023 ———
  {
    name: 'Ethereum Birthday 2023 — Empresarios Web3',
    date: '2023-08-16',
    protocol: 'poap',
    chain: 'gnosis',
    url: 'https://poap.gallery/drops/147806',
    holders: 13,
    post: 'https://www.instagram.com/p/Cv_LFbMN56U/',
  },
  {
    name: 'Set-up en EVM: una wallet, un token y un NFT',
    date: '2023-08-19',
    protocol: 'poap',
    chain: 'gnosis',
    url: 'https://poap.gallery/drops/147944',
    holders: 20,
    post: 'https://www.instagram.com/p/Cwz6uP9u8kS/',
  },
  {
    name: 'Ethereum Starter Pack — Ethereum 101',
    date: '2023-09-07',
    protocol: 'unlock',
    chain: 'polygon',
    url: 'https://polygonscan.com/address/0xadc3d1f73d2fa9aee898fae36c8d95a9d756b680',
    contracts: ['0xadc3d1f73d2fa9aee898fae36c8d95a9d756b680'],
    holders: 0,
  },
  {
    name: 'Ethereum Starter Pack — DeFi',
    date: '2023-09-14',
    protocol: 'unlock',
    chain: 'polygon',
    url: 'https://polygonscan.com/token/0x70bd76e89478400d9ee4c0f1200e53e751610ecf',
    contracts: ['0x70bd76e89478400d9ee4c0f1200e53e751610ecf'],
    holders: 4,
  },
  {
    name: 'Ethereum Starter Pack — NFT 101',
    date: '2023-09-21',
    protocol: 'poap',
    chain: 'gnosis',
    url: 'https://poap.gallery/drops/150539',
    holders: 6,
  },
  {
    name: 'Ethereum Starter Pack — NFT 101',
    date: '2023-09-21',
    protocol: 'unlock',
    chain: 'polygon',
    url: 'https://polygonscan.com/token/0xD8b6092d2DB8E71eb7753d0F5Ad13B5C0cD59457',
    contracts: ['0xD8b6092d2DB8E71eb7753d0F5Ad13B5C0cD59457'],
    holders: 2,
  },
  {
    name: 'Ethereum Starter Pack — Seguridad en Web3',
    date: '2023-10-12',
    protocol: 'unlock',
    chain: 'optimism',
    url: 'https://optimistic.etherscan.io/token/0xfcf03741a264a00fda35a5814e669968cab95204',
    contracts: ['0xfcf03741a264a00fda35a5814e669968cab95204'],
    holders: 4,
  },
  {
    name: 'Data Day UAO',
    date: '2023-11-03',
    protocol: 'poap',
    chain: 'gnosis',
    url: 'https://poap.gallery/drops/157654',
    holders: 3,
    post: 'https://www.instagram.com/p/CzG11AwulFX/',
  },
  {
    name: 'Inauguración Ramada Café',
    date: '2023-11-04',
    protocol: 'unlock',
    chain: 'polygon',
    url: 'https://polygonscan.com/token/0xc67db733d754753ca19a3502f36756e9e4141cbd',
    contracts: ['0xc67db733d754753ca19a3502f36756e9e4141cbd'],
    holders: 15,
    post: 'https://www.instagram.com/p/Czg86JCgC67/',
  },
  {
    name: 'Taller de contratos inteligentes con Solidity — ICESI',
    date: '2023-11-18',
    protocol: 'unlock',
    chain: 'polygon',
    url: 'https://polygonscan.com/token/0x2296e9d389a8c7dc2598d197e9fe43ea12052883',
    contracts: ['0x2296e9d389a8c7dc2598d197e9fe43ea12052883'],
    holders: 22,
    post: 'https://www.instagram.com/p/Cz16mJrA9Jx/',
  },
  {
    name: 'Taller de contratos inteligentes con Solidity — ICESI',
    date: '2023-11-18',
    protocol: 'poap',
    chain: 'gnosis',
    url: 'https://poap.gallery/drops/159246',
    holders: 16,
  },
  {
    name: 'Proof-of-Stake en Ramada Café',
    date: '2023-12-16',
    protocol: 'unlock',
    chain: 'optimism',
    url: 'https://optimistic.etherscan.io/token/0x9eb1dc77ac01b823f94c25ea054650930a3b7050',
    contracts: ['0x9eb1dc77ac01b823f94c25ea054650930a3b7050'],
    holders: 7,
    post: 'https://x.com/ethereum_cali/status/1736768163197370438',
  },

  // ——— 2024 ———
  {
    name: 'QF ETHColombia Meetup Cali',
    date: '2024-03-09',
    protocol: 'unlock',
    chain: 'optimism',
    url: 'https://optimistic.etherscan.io/token/0xfc78b9ee7348d4184f85ba8a3a0350216ae950b0',
    contracts: ['0xfc78b9ee7348d4184f85ba8a3a0350216ae950b0'],
    holders: 1,
    post: 'https://www.instagram.com/p/C4OIs15uahf/',
  },
  {
    name: 'Road to Drumcode — Discoteca 1060',
    date: '2024-05-25',
    protocol: 'unlock',
    chain: 'base',
    url: 'https://basescan.org/token/0x8dB8003c692d68dD20722EDA6FC4de8708Cd5ED6',
    contracts: ['0x8dB8003c692d68dD20722EDA6FC4de8708Cd5ED6'],
    holders: 12,
    post: 'https://www.instagram.com/p/C7XKBCoAbJI/',
  },
  {
    // Four tiers for one night — general, anytime, VIP and backstage — which is
    // why this is one card with four contracts rather than four events.
    name: 'Drumcode Cali',
    date: '2024-06-21',
    protocol: 'unlock',
    chain: 'base',
    url: 'https://basescan.org/address/0x1337722f177E99c8Cd490F432A319d8c7a003Ea8',
    contracts: [
      '0x1337722f177E99c8Cd490F432A319d8c7a003Ea8',
      '0x0ecEAa7c20bEcAF159F362B48B19B3BCB44780Bd',
      '0x114F67F5CA3656618dd5648D31E50ac8C0DAC046',
      '0xeeb48f34E083D1c0069593424Dc0dD6055fD04e8',
      '0x9368cFbcb6beE198e191eb2cccB521a2aEBd03fe',
    ],
    holders: 39,
    post: 'https://www.instagram.com/p/C7zag1hvZ_e/',
  },
  {
    // One lock, three meetups. The sheet lists it once per event; the chain has
    // one contract, so this is one collectible that three nights share.
    name: 'BASE Community Meetup',
    date: '2024-07-28',
    protocol: 'unlock',
    chain: 'base',
    url: 'https://basescan.org/token/0x19f7b2834ca07ececefc21202714b3c667588aa9',
    contracts: ['0x19f7b2834ca07ececefc21202714b3c667588aa9'],
    holders: 76,
    alsoUsedFor: [
      'Base Community Meetup #2 — Onchain Education con ICESI (2024)',
      'Base Community Meetup #3 — Digital Portfolios con DeFi (2025)',
    ],
    post: 'https://x.com/ethereum_cali/status/1817944044107940245',
  },
  {
    name: 'Financiando tus bienes públicos con Giveth',
    date: '2024-09-20',
    protocol: 'unlock',
    chain: 'optimism',
    url: 'https://optimistic.etherscan.io/token/0x62a2c557092eafe5c24151ed8e52ecaba6ac44a7',
    contracts: ['0x62a2c557092eafe5c24151ed8e52ecaba6ac44a7'],
    holders: 51,
    post: 'https://x.com/ethereum_cali/status/1837170007458918652',
  },

  // ——— 2025 ———
  {
    name: 'Open House USB',
    date: '2025-05-17',
    protocol: 'unlock',
    chain: 'base',
    url: 'https://basescan.org/address/0x7082f47ca600240f41a2fbee26a894d875a63b2f',
    contracts: [
      '0x7082f47ca600240f41a2fbee26a894d875a63b2f',
      '0x5da697a6898f5ee8b258d38891c1a86e8bd9e4fb',
    ],
    holders: 91,
    post: 'https://x.com/ethereum_cali/status/1923851977596994032',
  },
  {
    name: 'Global Pizza Party 2025',
    date: '2025-05-22',
    protocol: 'unlock',
    chain: 'base',
    url: 'https://basescan.org/token/0x95cDEA5535E8b601a4B588dF8F19bb02C618f0e1',
    contracts: ['0x95cDEA5535E8b601a4B588dF8F19bb02C618f0e1'],
    holders: 70,
    post: 'https://x.com/ethereum_cali/status/1926393378444341576',
  },
  {
    name: 'Papayogin',
    date: '2025-06-08',
    protocol: 'unlock',
    chain: 'optimism',
    url: 'https://optimistic.etherscan.io/token/0xce984f9e6335198fff193cc0596489dc9e570f3f',
    contracts: ['0xce984f9e6335198fff193cc0596489dc9e570f3f'],
    holders: 63,
    post: 'https://x.com/ethereum_cali/status/1934763004903510431',
  },
  {
    name: 'Hackathon Web3 Cali',
    date: '2025-06-13',
    protocol: 'unlock',
    chain: 'base',
    url: 'https://opensea.io/item/base/0x2744a0d99fc319c37d72ae9e98cba1b351bc37d5/2',
    contracts: ['0x2744a0d99fc319c37d72ae9e98cba1b351bc37d5'],
    holders: 42,
    post: 'https://x.com/ethereum_cali/status/1938020882028368119',
  },
  {
    name: 'Destino Devconnect — La Sucursal del Cielo + Ethereum Birthday 10Y',
    date: '2025-08-09',
    protocol: 'poap',
    chain: 'base',
    url: 'https://poap.gallery/drops/195225',
    holders: 9,
    post: 'https://www.youtube.com/watch?v=rzQNoONVrIE',
  },
  {
    name: 'Curso DeFi USB — Infraestructura Web3',
    date: '2025-08-22',
    protocol: 'poap',
    chain: 'base',
    url: 'https://console.poap.xyz/drops/197326',
  },
  {
    name: 'Curso DeFi USB — Un mundo tokenizado',
    date: '2025-08-23',
    protocol: 'poap',
    chain: 'base',
    url: 'https://console.poap.xyz/drops/197331',
  },
  {
    name: 'Curso DeFi USB — Apps y protocolos DeFi',
    date: '2025-08-29',
    protocol: 'poap',
    chain: 'base',
    url: 'https://console.poap.xyz/drops/198655',
  },
  {
    name: 'Curso DeFi USB — TradFi vs DeFi, riesgos y regulación',
    date: '2025-08-30',
    protocol: 'poap',
    chain: 'base',
    url: 'https://console.poap.xyz/drops/198658',
  },
  {
    name: 'Curso DeFi USB — DAOs y gobernanza',
    date: '2025-09-05',
    protocol: 'poap',
    chain: 'base',
    url: 'https://console.poap.xyz/drops/201984',
  },
  {
    name: 'Curso DeFi USB — Web3 Funding',
    date: '2025-09-06',
    protocol: 'poap',
    chain: 'base',
    url: 'https://console.poap.xyz/drops/202090',
  },
  {
    name: 'Curso DeFi USB — Web3 Funding II',
    date: '2025-09-12',
    protocol: 'poap',
    chain: 'base',
    url: 'https://console.poap.xyz/drops/205678',
  },
  {
    name: 'Curso DeFi USB — Mercados con IA',
    date: '2025-09-13',
    protocol: 'poap',
    chain: 'base',
    url: 'https://console.poap.xyz/drops/205884',
  },
  {
    name: 'Crea tu app en Ethereum',
    date: '2025-10-07',
    protocol: 'poap',
    chain: 'base',
    url: 'https://poap.gallery/drops/209387',
    post: 'https://www.instagram.com/p/DPeo1csiYpQ/',
  },
  {
    name: 'Coworking ETHGlobal x ETH Cali — Cali 2025',
    date: '2025-10-25',
    protocol: 'poap',
    chain: 'base',
    url: 'https://poap.gallery/drops/211588',
  },
  {
    name: 'Get ready with ETH Cali for HackMoney 2026',
    date: '2025-10-25',
    protocol: 'poap',
    chain: 'base',
    url: 'https://poap.gallery/drops/224092',
  },
  {
    name: 'Uniswap Day',
    date: '2025-12-20',
    protocol: 'poap',
    chain: 'unichain',
    url: 'https://poap.gallery/drops/218106',
  },
];

export const COLLECTIBLES_COPY = {
  eyebrow: { es: 'Coleccionables', en: 'Collectibles' } as Bilingual,
  title: { es: 'Todo lo que hemos emitido', en: 'Everything we have issued' } as Bilingual,
  lead: {
    es:
      'Cada evento de ETH Cali deja un registro onchain: un POAP para quien asistió o un NFT de ' +
      'Unlock Protocol para quien se inscribió. Esta es la lista completa, desde la apertura en ' +
      '2022. No se compran y no se venden — se recogen estando ahí.',
    en:
      'Every ETH Cali event leaves an onchain record: a POAP for whoever attended, or an Unlock ' +
      'Protocol NFT for whoever registered. This is the full list, from the opening in 2022. They ' +
      'are not bought and not sold — they are collected by turning up.',
  } as Bilingual,

  protocols: {
    poap: {
      name: 'POAP',
      detail: {
        es:
          'Proof of Attendance Protocol. Una insignia por haber estado. POAP cerró sus páginas ' +
          'públicas de cada drop, así que la insignia y el número de coleccionistas vienen de su ' +
          'API — son los suyos, no los nuestros.',
        en:
          'Proof of Attendance Protocol. A badge for having been there. POAP retired its public ' +
          'per-drop pages, so the badge and the collector count come from their API — they are ' +
          "POAP's figures, not ours.",
      } as Bilingual,
    },
    unlock: {
      name: 'Unlock Protocol',
      detail: {
        es: 'Una entrada onchain: el NFT es la inscripción al evento.',
        en: 'An onchain ticket: the NFT is the registration to the event.',
      } as Bilingual,
    },
  },

  stats: {
    total: { es: 'Coleccionables emitidos', en: 'Collectibles issued' } as Bilingual,
    poaps: { es: 'POAPs', en: 'POAPs' } as Bilingual,
    unlocks: { es: 'NFTs de Unlock', en: 'Unlock NFTs' } as Bilingual,
    chains: { es: 'Cadenas', en: 'Chains' } as Bilingual,
  },

  labels: {
    holders: { es: 'personas lo tienen', en: 'people hold it' } as Bilingual,
    view: { es: 'Ver onchain', en: 'View onchain' } as Bilingual,
    post: { es: 'Publicación', en: 'Post' } as Bilingual,
    alsoUsedFor: { es: 'También se usó en', en: 'Also used for' } as Bilingual,
    contracts: {
      es: '{n} contratos',
      en: '{n} contracts',
    } as Bilingual,
  },
} as const;
