/**
 * Hardware ETH Cali owns and lends out, free, to anyone running a community
 * event — you do not have to be part of ETH Cali to borrow it.
 *
 * Generated from ethcaliorg/databases/infratech.csv. "Varios" in the brand
 * column means no single manufacturer and is stored as null rather than as the
 * word, which would otherwise render as a brand name.
 *
 * This is deliberately not in the CMS: it is an internal asset register that
 * changes when something is bought, not editorial copy that changes with a
 * campaign. A commit is the right audit trail for it.
 */
export interface InfraItem {
  name: string;
  kind: 'media' | 'tech';
  brand: string | null;
}

export const INFRA: readonly InfraItem[] = [
  { name: "Roll-up ETHColombia (incluye Stand, Armado e impresion)", kind: "media", brand: null },
  { name: "Roll-up ETHCali (incluye Stand, Armado e impresion)", kind: "media", brand: null },
  { name: "Roll-up Base x EthCali", kind: "media", brand: null },
  { name: "Extension Electrica 10 Metros", kind: "tech", brand: null },
  { name: "Extension Electrica 3 Metros", kind: "tech", brand: null },
  { name: "Torre de Sonido MX-T70", kind: "tech", brand: "Samsung" },
  { name: "Monitor 27\" IPS Full HD (1920 x 1080)", kind: "tech", brand: "LG" },
  { name: "Monitor Full HD de 22\" (1920 x 1080)", kind: "tech", brand: "PHILIPS" },
  { name: "Adaptador de video universal USB 3.0 a HDMI UHD dual", kind: "tech", brand: "WAVLINK" },
  { name: "Amazon Fire TV Stick 4K", kind: "tech", brand: "Amazon" },
  { name: "Cable HDMI", kind: "tech", brand: null },
  { name: "Cable HDMI DE 8 K, 48 Gbps, 2 metros", kind: "tech", brand: "Highwings" },
  { name: "Echo Show 5 (3.ª generación, modelo de 2023)", kind: "tech", brand: "Amazon" },
  { name: "Bombilla LED inteligente (A19)", kind: "tech", brand: "Sengled" },
  { name: "Paquete 4 Bombillas inteligentes", kind: "tech", brand: "Linkind" },
  { name: "Mini proyector con 5GWiFi y Bluetooth, 1080P proyector para exteriores, proyector de película portátil, pantalla de 300 pulgadas", kind: "tech", brand: "WiMiUS" },
  { name: "Tripode para camara", kind: "tech", brand: null },
];
