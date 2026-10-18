import type { MedidaEstandar, SerieAluminio, ColorAluminio, TipoVidrio, QuoteConfig, QuoteBreakdown } from '../types/pricing';

export const MEDIDAS_ESTANDAR: MedidaEstandar[] = [
  { id: '1000x1000', ancho: 1000, alto: 1000, label: '1000 x 1000 mm', precioBaseNatural: 8500, precioBaseAnolok: 9800 },
  { id: '1000x1200', ancho: 1000, alto: 1200, label: '1000 x 1200 mm', precioBaseNatural: 9500, precioBaseAnolok: 11000 },
  { id: '1000x1500', ancho: 1000, alto: 1500, label: '1000 x 1500 mm', precioBaseNatural: 10800, precioBaseAnolok: 12900 },
  { id: '1200x1200', ancho: 1200, alto: 1200, label: '1200 x 1200 mm', precioBaseNatural: 11200, precioBaseAnolok: 13400 },
  { id: '1500x1200', ancho: 1500, alto: 1200, label: '1500 x 1200 mm', precioBaseNatural: 12800, precioBaseAnolok: 15200 },
  { id: '2000x1200', ancho: 2000, alto: 1200, label: '2000 x 1200 mm', precioBaseNatural: 15900, precioBaseAnolok: 18800 },
  { id: '2000x2000', ancho: 2000, alto: 2000, label: '2000 x 2000 mm (Puerta)', precioBaseNatural: 21500, precioBaseAnolok: 25600 },
];

export const FACTORES_SERIE: Record<SerieAluminio, { factor: number; nombre: string; desc: string }> = {
  S20: { factor: 0.85, nombre: 'Serie 20', desc: 'Línea Económica / Residencial liviana' },
  S25: { factor: 1.0,  nombre: 'Serie 25', desc: 'Línea Estándar Comercial (Más vendida)' },
  S30: { factor: 1.30, nombre: 'Serie 30', desc: 'Alta Gama / Reforzada hermética' },
};

export const COLORES: Record<ColorAluminio, { nombre: string; hex: string; desc: string }> = {
  natural: { nombre: 'Natural (Aluminio)', hex: '#CBD5E1', desc: 'Anodizado plata mate tradicional' },
  anolok:  { nombre: 'Anolok (Bronce / Marrón)', hex: '#583624', desc: 'Terminación anodizada oscura de diseño' },
};

export const VIDRIOS: Record<TipoVidrio, { nombre: string; desc: string; recargoPorcentaje: number }> = {
  simple: { nombre: 'Vidrio Simple 4mm', desc: 'Cristal transparente estándar', recargoPorcentaje: 0 },
  dvh:    { nombre: 'DVH Térmico y Acústico', desc: 'Doble Vidriado Hermético (+25%)', recargoPorcentaje: 0.25 },
};

export const COSTO_COLOCACION_MONTEVIDEO = 2500;

export const DATOS_EMPRESA = {
  nombre: 'CD Aluminio',
  subtitulo: 'Carpintería de Aluminio & Vidriería',
  direccion: 'Gral. Flores 2979, Montevideo, Uruguay',
  whatsappNumero: '59895262858',
  whatsappDisplay: '095 262 858',
  email: 'info@cdaluminio.uy',
  web: 'www.cdaluminio.uy',
  logoUrl: 'https://www.cdaluminio.uy/wp-content/uploads/LOGO-CD-ALUMINIO-horizontal-sin-fondo.png',
  logoOrangeUrl: 'https://www.cdaluminio.uy/wp-content/uploads/LOGO-CD-ALUMINIO-fondo-naranja-png.png',
  vigenciaDias: 15,
  condicionesPago: '50% seña al encargo, 50% saldo contra entrega / colocación',
};

export function calcularPresupuesto(config: QuoteConfig): QuoteBreakdown {
  const medida = MEDIDAS_ESTANDAR.find(m => m.id === config.medidaId) || MEDIDAS_ESTANDAR[0];
  const infoSerie = FACTORES_SERIE[config.serie];
  const infoColor = COLORES[config.color];
  const infoVidrio = VIDRIOS[config.vidrio];

  // 1. Precio base de Serie 25 según color
  const baseS25 = config.color === 'natural' ? medida.precioBaseNatural : medida.precioBaseAnolok;

  // 2. Aplicar multiplicador de serie
  const subtotalPerfileria = Math.round(baseS25 * infoSerie.factor);
  const adicionalSerie = subtotalPerfileria - baseS25;

  // 3. Aplicar recargo de vidrio DVH si corresponde
  const adicionalVidrioDVH = Math.round(subtotalPerfileria * infoVidrio.recargoPorcentaje);
  const subtotalAbertura = subtotalPerfileria + adicionalVidrioDVH;

  // 4. Colocación
  const costoColocacion = config.conColocacion ? COSTO_COLOCACION_MONTEVIDEO : 0;

  // 5. Total
  const totalFinal = subtotalAbertura + costoColocacion;

  return {
    medida,
    serieNombre: infoSerie.nombre,
    colorNombre: infoColor.nombre,
    vidrioNombre: infoVidrio.nombre,
    precioBaseS25: baseS25,
    adicionalSerie,
    subtotalPerfileria,
    adicionalVidrioDVH,
    subtotalAbertura,
    costoColocacion,
    totalFinal,
    vigenciaDias: DATOS_EMPRESA.vigenciaDias,
  };
}

export function formatearMoneda(monto: number): string {
  return '$ ' + monto.toLocaleString('es-UY');
}

export function generarTextoWhatsApp(breakdown: QuoteBreakdown, config: QuoteConfig): string {
  const lineas = [
    `*PRESUPUESTO CD ALUMINIO*`,
    `Gral. Flores 2979, Montevideo`,
    `----------------------------------------`,
    `*Producto:* Ventana Corrediza 2 Hojas`,
    `*Línea:* ${breakdown.serieNombre}`,
    `*Terminación:* ${breakdown.colorNombre}`,
    `*Medidas:* ${breakdown.medida.ancho} x ${breakdown.medida.alto} mm`,
    `*Cristal:* ${breakdown.vidrioNombre}`,
    `*Colocación:* ${config.conColocacion ? 'Sí, en Montevideo incluida' : 'Sin colocación (Retiro en Taller)'}`,
    `----------------------------------------`,
    `*TOTAL: ${formatearMoneda(breakdown.totalFinal)} UYU*`,
    `----------------------------------------`,
    `• Validez: ${breakdown.vigenciaDias} días`,
    `• Forma de pago: 50% seña, saldo contra entrega`,
    `• WhatsApp oficial: 095 262 858`,
    `\n_Generado desde Cotizador Móvil CD Aluminio_`
  ];
  return encodeURIComponent(lineas.join('\n'));
}
