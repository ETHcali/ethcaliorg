/**
 * The brand kit — every asset in `public/branding`, as data.
 *
 * One list, read twice: `/brand-guidelines` renders it as a download page, and
 * `scripts/brand-kit.mts` reads the same array to build the ZIPs. An asset that
 * is not in here is in neither, which is the point — a folder and a page that
 * are maintained separately drift, and the way you find out is that someone
 * downloads a logo we stopped using.
 *
 * The rules in `GUIDE` are BRAND.md, which lives in `branding_repo` and is the
 * source of truth. If the two ever disagree, BRAND.md wins and this is the file
 * that is wrong.
 */
import type { Bilingual } from './builders-tour';

export interface BrandFile {
  /** Site-relative path. This is the href, and the path inside the ZIP. */
  path: string;
  /** What the browser saves it as. The files keep the names the design studio
   *  gave them, so the clean name is applied at the download instead. */
  download: string;
  format: 'SVG' | 'PNG' | 'PDF' | 'JPG' | 'WOFF2' | 'TTF';
  /** Pixel dimensions, where it is a raster and the number is the reason to
   *  pick this file over its neighbour. */
  dimensions?: string;
  /** What tells this file apart from the one beside it, when the format does
   *  not. Two buttons both reading "SVG" are a coin toss. */
  note?: Bilingual;
}

export interface BrandAsset {
  id: string;
  name: Bilingual;
  detail: Bilingual;
  /** Raster preview. Vector-only assets preview from a PNG sibling. */
  preview: string;
  previewWidth: number;
  previewHeight: number;
  /**
   * The artwork is drawn for a white ground, so it previews on a white plate
   * rather than on `--surface-slab`, where black lettering disappears. The same
   * rule the Builders Tour sponsor wall uses for Icesi and Devcon.
   */
  plate?: boolean;
  files: readonly BrandFile[];
}

export const LOGOS: readonly BrandAsset[] = [
  {
    id: 'glyph',
    name: { es: 'El símbolo', en: 'The glyph' },
    detail: {
      es: 'El doble diamante solo, sin letras. Es la respuesta cuando el lockup no alcanza los 32px — el favicon, un avatar, la barra de navegación de este sitio.',
      en: 'The double diamond on its own, no lettering. This is the answer when the lockup cannot reach 32px — a favicon, an avatar, the nav bar of this site.',
    },
    preview: '/branding/logoethcali.png',
    previewWidth: 170,
    previewHeight: 266,
    files: [
      { path: '/branding/favicon.svg', download: 'ethcali-glyph.svg', format: 'SVG' },
      { path: '/branding/logoethcali.png', download: 'ethcali-glyph.png', format: 'PNG', dimensions: '170 × 266' },
      { path: '/branding/faviconethcali38x38.png', download: 'ethcali-favicon-38.png', format: 'PNG', dimensions: '38 × 60' },
      { path: '/branding/faviconethcali16x16.png', download: 'ethcali-favicon-16.png', format: 'PNG', dimensions: '16 × 26' },
    ],
  },
  {
    id: 'horizontal-dark',
    name: { es: 'Lockup horizontal — sobre oscuro', en: 'Horizontal lockup — on dark' },
    detail: {
      es: 'El primario, invertido. Es el que usan la cabecera, el pie y las tarjetas de compartir de este sitio, y el que va sobre cualquier fondo oscuro.',
      en: 'The primary lockup, reversed. It is what this site uses in the header, the footer and its share cards, and what goes on any dark ground.',
    },
    preview: '/branding/ethcali-horizontal-light.png',
    previewWidth: 334,
    previewHeight: 227,
    files: [
      { path: '/branding/ethcali-horizontal-light.png', download: 'ethcali-horizontal-on-dark.png', format: 'PNG', dimensions: '334 × 227' },
    ],
  },
  {
    id: 'horizontal-light',
    name: { es: 'Lockup horizontal — sobre claro', en: 'Horizontal lockup — on light' },
    detail: {
      es: 'El primario. Barras de navegación, cabeceras y pies sobre fondo blanco. La versión compacta lleva menos aire alrededor del símbolo.',
      en: 'The primary lockup. Nav bars, headers and footers on a white ground. The compact version carries less air around the glyph.',
    },
    preview: '/branding/Logo_Nodo_CLO_ETH_CO-01.png',
    previewWidth: 1154,
    previewHeight: 668,
    plate: true,
    files: [
      { path: '/branding/Logo_Nodo_CLO_ETH_CO-01.png', download: 'ethcali-horizontal-on-light.png', format: 'PNG', dimensions: '1154 × 668' },
      { path: '/branding/ethcali-horizontal-compact-on-light.png', download: 'ethcali-horizontal-compact-on-light.png', format: 'PNG', dimensions: '393 × 266' },
    ],
  },
  {
    id: 'vertical',
    name: { es: 'Lockup vertical', en: 'Vertical lockup' },
    detail: {
      es: 'Para afiches, merch y cualquier sitio donde haya más alto que ancho. Va en las dos versiones: sobre blanco y sobre negro.',
      en: 'For posters, merch and anywhere there is more height than width. Both grounds are here: on white and on black.',
    },
    preview: '/branding/Logo_Nodo_CLO_ETH_CO-02.png',
    previewWidth: 709,
    previewHeight: 934,
    plate: true,
    files: [
      { path: '/branding/Logo_Nodo_CLO_ETH_CO-02.png', download: 'ethcali-vertical-on-light.png', format: 'PNG', dimensions: '709 × 934' },
      { path: '/branding/ethcali-vertical-on-light.png', download: 'ethcali-vertical-compact-on-light.png', format: 'PNG', dimensions: '209 × 364' },
      { path: '/branding/ethcali-vertical-on-dark.png', download: 'ethcali-vertical-on-dark.png', format: 'PNG', dimensions: '209 × 363' },
    ],
  },
  {
    id: 'simplified',
    name: { es: 'Lockup simplificado', en: 'Simplified lockup' },
    detail: {
      es: 'Sin la filigrana: solo el octaedro y el arco. Para impresión pequeña, bordado y serigrafía, donde la línea fina del símbolo se cierra y se convierte en una mancha.',
      en: 'Without the filigree: just the octahedron and the arc. For small print, embroidery and screen printing, where the fine line of the glyph fills in and becomes a smudge.',
    },
    preview: '/branding/Logo_Nodo_CLO_ETH_CO-03.png',
    previewWidth: 1134,
    previewHeight: 470,
    plate: true,
    files: [
      { path: '/branding/Logo_Nodo_CLO_ETH_CO-03.png', download: 'ethcali-horizontal-simple-on-light.png', format: 'PNG', dimensions: '1134 × 470' },
    ],
  },
  {
    id: 'sheet',
    name: { es: 'Hoja completa — vector', en: 'Full sheet — vector' },
    detail: {
      es: 'Todos los lockups en un archivo vectorial, escalable a cualquier tamaño sin perder nada. Si vas a imprimir, empieza aquí y no por un PNG.',
      en: 'Every lockup in one vector file, scalable to any size without losing anything. If you are going to print, start here rather than from a PNG.',
    },
    // Rendered from the sheet itself rather than borrowing the horizontal
    // lockup's preview: the card is offering six variants in one file, and a
    // thumbnail showing one of them says the opposite.
    preview: '/branding/ethcali-logo-sheet-preview.png',
    previewWidth: 1000,
    previewHeight: 1000,
    plate: true,
    files: [
      {
        path: '/branding/Logo_Nodo_CLO_ETH_CO-sheet.svg',
        download: 'ethcali-logo-sheet.svg',
        format: 'SVG',
        note: { es: 'ligero', en: 'lightweight' },
      },
      {
        path: '/branding/Logo_Nodo_CLO_ETH_CO.svg',
        download: 'ethcali-logo-sheet-full.svg',
        format: 'SVG',
        // Six times the weight of the one above and draws the same six
        // lockups. It is here because it is the studio's own Illustrator
        // export and keeps every layer and name the studio gave it.
        note: { es: 'export de Illustrator', en: 'Illustrator export' },
      },
      {
        path: '/branding/Logo_Nodo_CLO_ETH_CO.pdf',
        download: 'ethcali-logo-sheet.pdf',
        format: 'PDF',
        note: { es: 'para imprenta', en: 'for print' },
      },
    ],
  },
];

/** Ready-made artwork at the sizes each platform actually crops to. */
export const SOCIAL_ART: readonly BrandAsset[] = [
  {
    id: 'avatar',
    name: { es: 'Foto de perfil', en: 'Profile picture' },
    detail: {
      es: 'Cuadrada, 1280 × 1280. Para el avatar de cualquier red — se recorta en círculo en casi todas, y el símbolo queda centrado.',
      en: 'Square, 1280 × 1280. For the avatar on any network — almost all of them crop to a circle, and the glyph stays centred.',
    },
    preview: '/branding/Perfil.jpg',
    previewWidth: 1280,
    previewHeight: 1280,
    files: [{ path: '/branding/Perfil.jpg', download: 'ethcali-avatar-1280.jpg', format: 'JPG', dimensions: '1280 × 1280' }],
  },
  {
    id: 'banner',
    name: { es: 'Banner', en: 'Banner' },
    detail: {
      es: 'Para la cabecera de un perfil y para la tarjeta de compartir. El PNG de 1200 × 400 es el que este sitio pone en og:image.',
      en: 'For a profile header and for a share card. The 1200 × 400 PNG is the one this site puts in og:image.',
    },
    preview: '/branding/Banner1200x400.png',
    previewWidth: 1200,
    previewHeight: 399,
    files: [
      { path: '/branding/Banner1200x400.png', download: 'ethcali-banner-1200x400.png', format: 'PNG', dimensions: '1200 × 399' },
      { path: '/branding/Banner.jpg', download: 'ethcali-banner-1280x426.jpg', format: 'JPG', dimensions: '1280 × 426' },
    ],
  },
  {
    id: 'collection',
    name: { es: 'Arte de colección', en: 'Collection art' },
    detail: {
      es: '2000 × 2000, el tamaño que pide OpenSea para la portada de una colección.',
      en: '2000 × 2000, the size OpenSea asks for as a collection cover.',
    },
    preview: '/branding/ethcali-opensea-2000.png',
    previewWidth: 2000,
    previewHeight: 2000,
    files: [{ path: '/branding/ethcali-opensea-2000.png', download: 'ethcali-collection-2000.png', format: 'PNG', dimensions: '2000 × 2000' }],
  },
];

/**
 * The web weights — the five files this site itself loads.
 *
 * WOFF2 and not TTF because a browser should never be handed a 300 KB TTF for a
 * weight it renders at 16px; these are a quarter of the size and every browser
 * that matters has read the format for a decade.
 */
export const WEB_FONTS: readonly BrandFile[] = [
  { path: '/branding/fonts/web/SarunPro-Black.woff2', download: 'SarunPro-Black.woff2', format: 'WOFF2' },
  { path: '/branding/fonts/web/SarunPro-Bold.woff2', download: 'SarunPro-Bold.woff2', format: 'WOFF2' },
  { path: '/branding/fonts/web/SarunPro-Medium.woff2', download: 'SarunPro-Medium.woff2', format: 'WOFF2' },
  { path: '/branding/fonts/web/SarunPro-Regular.woff2', download: 'SarunPro-Regular.woff2', format: 'WOFF2' },
  { path: '/branding/fonts/web/SarunPro-Book.woff2', download: 'SarunPro-Book.woff2', format: 'WOFF2' },
];

/**
 * The two ZIPs, built by `scripts/brand-kit.mts` before every build.
 *
 * They are generated rather than committed: a ZIP in git is a binary that goes
 * stale the moment anyone adds a file to `public/branding`, and nothing would
 * tell you. `dir` is what the script walks; `exclude` keeps the 34 MB of desktop
 * fonts out of the kit most people want.
 */
export const KITS = {
  brand: {
    file: '/brand-kit/ethcali-brand-kit.zip',
    download: 'ethcali-brand-kit.zip',
    name: { es: 'Kit de marca', en: 'Brand kit' } as Bilingual,
    detail: {
      es: 'Todos los lockups, el símbolo, los favicons, el arte social y las fuentes web, con la guía adentro.',
      en: 'Every lockup, the glyph, the favicons, the social art and the web fonts, with the guide inside.',
    } as Bilingual,
  },
  fonts: {
    file: '/brand-kit/ethcali-sarun-pro.zip',
    download: 'ethcali-sarun-pro.zip',
    name: { es: 'Sarun Pro — familia completa', en: 'Sarun Pro — full family' } as Bilingual,
    detail: {
      es: 'Las 60 fuentes de escritorio: Pro, Condensed y Narrow, de Thin a Heavy, con itálicas.',
      en: 'All 60 desktop fonts: Pro, Condensed and Narrow, Thin through Heavy, italics included.',
    } as Bilingual,
  },
} as const;

/**
 * The rules, from BRAND.md. Short enough that nobody has an excuse.
 *
 * These are the ones that get broken: the mark gets recoloured to match a
 * sponsor deck, or set at 14px in a footer where the filigree turns to mud.
 */
export const GUIDE = {
  clearSpace: {
    title: { es: 'Aire alrededor', en: 'Clear space' } as Bilingual,
    body: {
      es: 'X = la altura del diamante, por los cuatro lados. Nada entra en ese margen.',
      en: 'X = the height of the diamond, on all four sides. Nothing comes inside that margin.',
    } as Bilingual,
  },
  minimum: {
    title: { es: 'Tamaño mínimo', en: 'Minimum size' } as Bilingual,
    body: {
      es: '32px de alto en pantalla, 10mm impreso. Por debajo de eso va el símbolo solo, nunca el lockup encogido.',
      en: '32px tall on screen, 10mm in print. Below that use the glyph on its own, never a shrunken lockup.',
    } as Bilingual,
  },
  colour: {
    title: { es: 'Color de la línea', en: 'The line colour' } as Bilingual,
    body: {
      es: 'Ultramarino #2B23EF o blanco. Nada más — es el único color cromático de la marca y está muestreado del símbolo.',
      en: 'Ultramarine #2B23EF or white. Nothing else — it is the only chromatic colour in the brand, sampled from the mark.',
    } as Bilingual,
  },
  never: {
    title: { es: 'Nunca', en: 'Never' } as Bilingual,
    items: [
      { es: 'Recolorear la línea', en: 'Recolour the line' },
      { es: 'Estirar, condensar, rotar o curvar', en: 'Stretch, condense, rotate or arc it' },
      { es: 'Ponerlo sobre una foto cargada o un degradado', en: 'Place it on a busy photo or a gradient' },
      { es: 'Añadir brillo, relieve o sombra', en: 'Add glow, bevel or shadow' },
    ] as readonly Bilingual[],
  },
} as const;

export const BRAND_COPY = {
  downloadsTitle: { es: 'Descargas', en: 'Downloads' } as Bilingual,
  downloadsLead: {
    es: 'Todo el material de marca, listo para descargar. Si vas a usar el logo de ETH Cali en un afiche, una charla o un patrocinio, sácalo de aquí y no de una captura de pantalla.',
    en: 'All of the brand material, ready to download. If you are putting the ETH Cali mark on a poster, a talk or a sponsorship, take it from here rather than from a screenshot.',
  } as Bilingual,
  kitTitle: { es: 'Descarga todo', en: 'Download everything' } as Bilingual,
  logosTitle: { es: 'Logos', en: 'Logos' } as Bilingual,
  socialTitle: { es: 'Redes y compartir', en: 'Social and sharing' } as Bilingual,
  rulesTitle: { es: 'Cómo se usa', en: 'How to use it' } as Bilingual,
  rulesLead: {
    es: 'El símbolo es un doble diamante dibujado con una sola línea ultramarina — el octaedro de Ethereum rehecho como herrería en filigrana. Cuatro reglas lo protegen.',
    en: 'The mark is a double diamond drawn in one continuous ultramarine line — the Ethereum octahedron rebuilt as filigree ironwork. Four rules protect it.',
  } as Bilingual,
  webFontsTitle: { es: 'Sarun Pro — web', en: 'Sarun Pro — web' } as Bilingual,
  webFontsLead: {
    es: 'Los cinco pesos que este sitio carga, en WOFF2.',
    en: 'The five weights this site loads, in WOFF2.',
  } as Bilingual,
  monoNote: {
    es: 'JetBrains Mono es libre y con licencia Apache 2.0. No la redistribuimos: se carga desde Google Fonts.',
    en: 'JetBrains Mono is free and Apache 2.0 licensed. We do not redistribute it — it loads from Google Fonts.',
  } as Bilingual,
  licenceNote: {
    es: 'Sarun Pro es una tipografía comercial con licencia de su fundidora. Se publica aquí para el trabajo de ETH Cali y de sus comunidades aliadas; para cualquier otro uso, licénciala tú.',
    en: 'Sarun Pro is a commercial typeface licensed from its foundry. It is published here for ETH Cali work and that of its partner communities; for anything else, licence it yourself.',
  } as Bilingual,
} as const;
