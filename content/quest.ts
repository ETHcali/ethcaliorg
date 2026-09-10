/**
 * ShanHaiWoo quests — a business delegates a mission to be run on the ground.
 *
 * The proposition is unusual enough that the page has to explain it before it
 * asks for anything: your company needs something done in Shenzhen, Hong Kong or
 * Mumbai, and rather than flying someone out, you hand it to builders who are
 * already there for a month.
 */
import type { Bilingual } from './builders-tour';

export const QUEST = {
  /** The window the popup city runs, and therefore when a quest can be executed. */
  window: {
    es: '15 de octubre – 10 de noviembre de 2026',
    en: '15 October – 10 November 2026',
  } as Bilingual,
  postedValueUsd: 1000,
} as const;

export interface QuestCity {
  id: 'shenzhen' | 'hong-kong' | 'mumbai';
  name: string;
  dates: Bilingual;
  known: Bilingual;
  examples: readonly Bilingual[];
  /** Site-relative artwork, null where we do not have a licensed image yet. */
  image: string | null;
}

export const QUEST_CITIES: readonly QuestCity[] = [
  {
    id: 'shenzhen',
    name: 'Shenzhen',
    dates: { es: '15–31 de octubre', en: '15–31 October' },
    known: {
      es: 'El centro global de manufactura electrónica. De un boceto a un prototipo en la mano, en días.',
      en: 'The global centre of electronics manufacturing. Sketch to prototype in your hand, in days.',
    },
    examples: [
      { es: 'Hablar con un proveedor y traerte una cotización real', en: 'Meet a supplier and bring back a real quote' },
      { es: 'Verificar una fábrica antes de que le gires dinero', en: 'Vet a factory before you wire anyone money' },
      { es: 'Conseguir muestras de un componente que no encuentras acá', en: 'Source samples of a component you cannot find here' },
    ],
    image: null,
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    dates: { es: '1–6 de noviembre', en: '1–6 November' },
    known: {
      es: 'Durante Devcon: la semana en la que está en la ciudad medio ecosistema Ethereum.',
      en: 'During Devcon: the week half the Ethereum ecosystem is in the city.',
    },
    examples: [
      { es: 'Presentar tu proyecto a los equipos que construyen el protocolo', en: 'Put your project in front of the teams building the protocol' },
      { es: 'Buscar socios técnicos o un partner de distribución', en: 'Find technical partners or a distribution partner' },
      { es: 'Cerrar una conversación que por correo lleva meses', en: 'Close a conversation that takes months over email' },
    ],
    image: '/tour/devcon-mumbai.webp',
  },
  {
    id: 'hong-kong',
    name: 'Hong Kong',
    dates: { es: '6–10 de noviembre', en: '6–10 November' },
    known: {
      es: 'Capital, mercados internacionales y la puerta de entrada a Asia para una empresa latinoamericana.',
      en: 'Capital, international markets, and the way into Asia for a Latin American company.',
    },
    examples: [
      { es: 'Explorar rutas de financiación o inversores', en: 'Explore funding routes or investors' },
      { es: 'Entender qué implica exportar o importar desde allá', en: 'Understand what exporting or importing from there involves' },
      { es: 'Contactar una contraparte y sentarte con ella', en: 'Reach a counterpart and actually sit down with them' },
    ],
    image: null,
  },
];

/** What kind of thing is being delegated. Mirrors the DB check constraint. */
export const QUEST_KINDS: readonly { id: string; label: Bilingual }[] = [
  { id: 'vendor', label: { es: 'Encontrar un proveedor', en: 'Find a vendor' } },
  { id: 'product', label: { es: 'Encontrar un producto o componente', en: 'Find a product or component' } },
  { id: 'counterpart', label: { es: 'Negociar con una contraparte', en: 'Deal with a counterpart' } },
  { id: 'connections', label: { es: 'Abrir conexiones para mi negocio', en: 'Open connections for my business' } },
  { id: 'other', label: { es: 'Otra cosa', en: 'Something else' } },
];

export const QUEST_CITY_OPTIONS: readonly { id: string; label: Bilingual }[] = [
  { id: 'shenzhen', label: { es: 'Shenzhen', en: 'Shenzhen' } },
  { id: 'hong-kong', label: { es: 'Hong Kong', en: 'Hong Kong' } },
  { id: 'mumbai', label: { es: 'Mumbai', en: 'Mumbai' } },
  { id: 'any', label: { es: 'Cualquiera / no estoy seguro', en: 'Any / not sure' } },
];

export const QUEST_COPY = {
  eyebrow: { es: 'Para empresas', en: 'For businesses' } as Bilingual,
  title: { es: 'Delega una misión en Asia', en: 'Delegate a mission in Asia' } as Bilingual,
  lead: {
    es:
      'Tu empresa necesita algo resuelto en Shenzhen, Hong Kong o Mumbai. En vez de comprar ' +
      'un tiquete, se lo encargas a builders que ya van a estar allá durante un mes.',
    en:
      'Your company needs something done in Shenzhen, Hong Kong or Mumbai. Instead of buying ' +
      'a plane ticket, you hand it to builders who will already be there for a month.',
  } as Bilingual,
  howTitle: { es: 'Cómo funciona', en: 'How it works' } as Bilingual,
  citiesTitle: { es: 'Dónde se ejecuta', en: 'Where it gets done' } as Bilingual,
  formTitle: { es: 'Propón tu misión', en: 'Propose your mission' } as Bilingual,
  formLead: {
    es: 'Entre más concreto seas, más útil te va a resultar. Respondemos a cada propuesta.',
    en: 'The more concrete you are, the more useful this will be. We reply to every proposal.',
  } as Bilingual,
} as const;

export const QUEST_STEPS: readonly { n: string; title: Bilingual; detail: Bilingual }[] = [
  {
    n: '01',
    title: { es: 'Describes la misión', en: 'You describe the mission' },
    detail: {
      es: 'Qué necesitas, en cuál ciudad, y qué contaría como haberlo logrado.',
      en: 'What you need, in which city, and what would count as having done it.',
    },
  },
  {
    n: '02',
    title: { es: 'Acordamos alcance y valor', en: 'We agree scope and value' },
    detail: {
      es: 'El valor de referencia es 1.000 USD por misión. Si tu caso vale otra cosa, lo dices en el formulario.',
      en: 'The reference value is 1,000 USD per mission. If yours is worth something else, say so in the form.',
    },
  },
  {
    n: '03',
    title: { es: 'Se ejecuta en terreno', en: 'It gets done on the ground' },
    detail: {
      es: 'Un builder de ETH Cali la ejecuta durante la popup city y te reporta con evidencia.',
      en: 'An ETH Cali builder runs it during the popup city and reports back with evidence.',
    },
  },
];
