import type { MedidaEstandar, SerieAluminio, ColorAluminio, TipoVidrio, QuoteConfig, QuoteBreakdown } from '../types/pricing';

export interface ProductoCatalogo {
  id: string;
  nombre: string;
  descripcion: string;
  activo: boolean;
}

export const CATALOGO_PRODUCTOS: ProductoCatalogo[] = [
  { id: 'ventana-corrediza', nombre: 'Ventana Corrediza (2 Hojas)', descripcion: 'Abertura estándar corrediza', activo: true },
  { id: 'ventana-proyectante', nombre: 'Ventana Proyectante / Banderola', descripcion: 'Apertura hacia el exterior', activo: false },
  { id: 'puerta-batiente', nombre: 'Puerta Batiente en Aluminio', descripcion: 'Puerta de entrada o paso', activo: false },
  { id: 'mampara-bano', nombre: 'Mampara de Cristal / Baño', descripcion: 'Cristal templado con perfilería', activo: false },
  { id: 'monoblock-cortina', nombre: 'Monoblock Ventana + Cortina', descripcion: 'Sistema integral con cortina de enrollar', activo: false },
  { id: 'techo-policarbonato', nombre: 'Techo Fijo / Corredizo', descripcion: 'Estructuras vidriadas o policarbonato', activo: false },
];

export const MEDIDAS_ESTANDAR: MedidaEstandar[] = [
  { id: '1000x1000', ancho: 1000, alto: 1000, label: '1000 x 1000 mm (1.00 x 1.00 m)', precioBaseNatural: 8500, precioBaseAnolok: 9800 },
  { id: '1000x1200', ancho: 1000, alto: 1200, label: '1000 x 1200 mm (1.00 x 1.20 m)', precioBaseNatural: 9500, precioBaseAnolok: 11000 },
  { id: '1000x1500', ancho: 1000, alto: 1500, label: '1000 x 1500 mm (1.00 x 1.50 m)', precioBaseNatural: 10800, precioBaseAnolok: 12900 },
  { id: '1200x1200', ancho: 1200, alto: 1200, label: '1200 x 1200 mm (1.20 x 1.20 m)', precioBaseNatural: 11200, precioBaseAnolok: 13400 },
  { id: '1500x1200', ancho: 1500, alto: 1200, label: '1500 x 1200 mm (1.50 x 1.20 m)', precioBaseNatural: 12800, precioBaseAnolok: 15200 },
  { id: '2000x1200', ancho: 2000, alto: 1200, label: '2000 x 1200 mm (2.00 x 1.20 m)', precioBaseNatural: 15900, precioBaseAnolok: 18800 },
  { id: '2000x2000', ancho: 2000, alto: 2000, label: '2000 x 2000 mm (Puerta Balcón)', precioBaseNatural: 21500, precioBaseAnolok: 25600 },
];

export const FACTORES_SERIE: Record<SerieAluminio, { factor: number; nombre: string; desc: string }> = {
  S20: { factor: 0.85, nombre: 'Serie 20 (Económica -15%)', desc: 'Línea residencial liviana' },
  S25: { factor: 1.0,  nombre: 'Serie 25 (Estándar Comercial)', desc: 'Línea base más vendida' },
  S30: { factor: 1.30, nombre: 'Serie 30 (Alta Gama +30%)', desc: 'Perfiles reforzados y cierre hermético' },
};

export const COLORES: Record<ColorAluminio, { nombre: string; hex: string; desc: string }> = {
  natural: { nombre: 'Natural (Aluminio Plata)', hex: '#CBD5E1', desc: 'Anodizado mate' },
  anolok:  { nombre: 'Anolok (Bronce / Marrón)', hex: '#452613', desc: 'Terminación anodizada oscura' },
};

export const VIDRIOS: Record<TipoVidrio, { nombre: string; desc: string; recargoPorcentaje: number }> = {
  simple: { nombre: 'Vidrio Simple 4mm (Estándar incluido)', desc: 'Cristal transparente', recargoPorcentaje: 0 },
  dvh:    { nombre: 'Vidrio DVH Térmico / Acústico (+25%)', desc: 'Doble Vidriado Hermético', recargoPorcentaje: 0.25 },
};

export const DATOS_EMPRESA = {
  nombre: 'CD ALUMINIO',
  rubro: 'CARPINTERÍA EN ALUMINIO',
  direccion: 'Gral. Flores 2979, Montevideo',
  whatsappNumero: '59895262858',
  whatsappDisplay: '095 262 858',
  email: 'info@cdaluminio.uy',
  web: 'www.cdaluminio.uy',
  logoLocal: './logo-cd-aluminio.png',
  vigenciaDias: 15,
  condicionesPago: '50% seña para reserva de perfiles, 50% saldo contra entrega',
};

export function calcularPresupuesto(config: QuoteConfig): QuoteBreakdown {
  const medida = MEDIDAS_ESTANDAR.find(m => m.id === config.medidaId) || MEDIDAS_ESTANDAR[0];
  const infoSerie = FACTORES_SERIE[config.serie];
  const infoColor = COLORES[config.color];
  const infoVidrio = VIDRIOS[config.vidrio];

  // 1. Precio base de Serie 25 según color
  const baseS25 = config.color === 'natural' ? medida.precioBaseNatural : medida.precioBaseAnolok;

  // 2. Multiplicador de serie
  const subtotalPerfileria = Math.round(baseS25 * infoSerie.factor);
  const adicionalSerie = subtotalPerfileria - baseS25;

  // 3. Recargo de vidrio
  const adicionalVidrioDVH = Math.round(subtotalPerfileria * infoVidrio.recargoPorcentaje);
  const subtotalAbertura = subtotalPerfileria + adicionalVidrioDVH;

  return {
    medida,
    serieNombre: infoSerie.nombre.split(' (')[0],
    colorNombre: infoColor.nombre.split(' (')[0],
    vidrioNombre: infoVidrio.nombre.split(' (')[0],
    precioBaseS25: baseS25,
    adicionalSerie,
    subtotalPerfileria,
    adicionalVidrioDVH,
    subtotalAbertura,
    costoColocacion: 0,
    totalFinal: subtotalAbertura,
    vigenciaDias: DATOS_EMPRESA.vigenciaDias,
  };
}

export function formatearMoneda(monto: number): string {
  return '$ ' + monto.toLocaleString('es-UY');
}

export function generarTextoWhatsApp(breakdown: QuoteBreakdown): string {
  const lineas = [
    `*PRESUPUESTO CD ALUMINIO*`,
    `Gral. Flores 2979, Montevideo`,
    `----------------------------------------`,
    `*Producto:* Ventana Corrediza 2 Hojas`,
    `*Línea:* ${breakdown.serieNombre}`,
    `*Terminación:* ${breakdown.colorNombre}`,
    `*Medidas:* ${breakdown.medida.ancho} x ${breakdown.medida.alto} mm`,
    `*Cristal:* ${breakdown.vidrioNombre}`,
    `----------------------------------------`,
    `*TOTAL: ${formatearMoneda(breakdown.totalFinal)} UYU*`,
    `----------------------------------------`,
    `• Validez: ${breakdown.vigenciaDias} días`,
    `• Forma de pago: 50% seña, saldo contra entrega`,
    `• Retiro en taller sin costo (Gral. Flores 2979)`,
    `• WhatsApp oficial: 095 262 858`,
    `\n_Cotizado desde Web App Móvil CD Aluminio_`
  ];
  return encodeURIComponent(lineas.join('\n'));
}
