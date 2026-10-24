import type { MedidaEstandar, SerieAluminio, ColorAluminio, TipoVidrio, QuoteConfig, QuoteBreakdown } from '../types/pricing';

export interface ProductoCatalogo {
  id: string;
  nombre: string;
  categoria: 'ventanas' | 'puertas' | 'mamparas' | 'sistemas' | 'especiales';
  seriesCompatibles: SerieAluminio[];
  permiteCotizacionAutomatica: boolean;
  nota?: string;
}

// 26 PRODUCTOS OFICIALES DEL EXCEL DEL CLIENTE CON SUS SERIES COMPATIBLES
export const CATALOGO_PRODUCTOS: ProductoCatalogo[] = [
  // Ventanas Corredizas
  { id: 'ventana-corrediza-2h', nombre: 'Ventana Corrediza (2 Hojas)', categoria: 'ventanas', seriesCompatibles: ['S20', 'S25'], permiteCotizacionAutomatica: true },
  { id: 'ventana-corrediza-3h', nombre: 'Ventana Corrediza (3 Hojas)', categoria: 'ventanas', seriesCompatibles: ['S25'], permiteCotizacionAutomatica: false, nota: 'Línea Serie 25 / Alta prestación' },
  { id: 'ventana-corrediza-4h', nombre: 'Ventana Corrediza (4 Hojas)', categoria: 'ventanas', seriesCompatibles: ['S25'], permiteCotizacionAutomatica: false, nota: 'Línea Serie 25 / Alta prestación' },
  
  // Aberturas Batientes, Paños Fijos y Proyectantes (Solo Serie 30 / Altas)
  { id: 'pano-fijo', nombre: 'Paño Fijo', categoria: 'ventanas', seriesCompatibles: ['S30'], permiteCotizacionAutomatica: false, nota: 'Serie 30 / Perfilería reforzada' },
  { id: 'ventana-batiente', nombre: 'Ventana Batiente', categoria: 'ventanas', seriesCompatibles: ['S30'], permiteCotizacionAutomatica: false, nota: 'Serie 30 hermética' },
  { id: 'ventana-tabaquera', nombre: 'Ventana Tabaquera', categoria: 'ventanas', seriesCompatibles: ['S30'], permiteCotizacionAutomatica: false, nota: 'Serie 30 / Apertura superior' },
  { id: 'ventana-proyectante', nombre: 'Ventana Proyectante', categoria: 'ventanas', seriesCompatibles: ['S30'], permiteCotizacionAutomatica: false, nota: 'Serie 30 / Fricción exterior' },
  { id: 'ventana-guillotina', nombre: 'Ventana Guillotina', categoria: 'ventanas', seriesCompatibles: ['S30'], permiteCotizacionAutomatica: false, nota: 'Sistema contrapesado vertical' },
  
  // Bajo Mesadas
  { id: 'bajo-mesada-batiente', nombre: 'Bajo Mesada (Batiente)', categoria: 'especiales', seriesCompatibles: ['S30'], permiteCotizacionAutomatica: false, nota: 'Mueble aluminio batiente' },
  { id: 'bajo-mesada-corredizo', nombre: 'Bajo Mesada (Corredizo)', categoria: 'especiales', seriesCompatibles: ['S20'], permiteCotizacionAutomatica: false, nota: 'Guías corredizas interiores' },
  
  // Puertas (Todas en Serie 30 según Excel)
  { id: 'puerta-mitad-vidrio', nombre: 'Puerta Mitad Aluminio y Mitad Cristal', categoria: 'puertas', seriesCompatibles: ['S30'], permiteCotizacionAutomatica: false, nota: 'Serie 30 / Puerta mixta' },
  { id: 'puerta-ciega', nombre: 'Puerta Toda Ciega en Aluminio', categoria: 'puertas', seriesCompatibles: ['S30'], permiteCotizacionAutomatica: false, nota: 'Serie 30 / Tubular machihembrado' },
  { id: 'puerta-cristal', nombre: 'Puerta en Cristal Templado', categoria: 'puertas', seriesCompatibles: ['S30'], permiteCotizacionAutomatica: false, nota: 'Herrajes y manijón de acero' },
  { id: 'puerta-granero', nombre: 'Puerta Estilo Granero (Interior)', categoria: 'puertas', seriesCompatibles: ['S30'], permiteCotizacionAutomatica: false, nota: 'Guía aérea suspendida de diseño' },
  
  // Sistemas Monoblock
  { id: 'monoblock-pvc', nombre: 'Sistema Monoblock (Cortina PVC)', categoria: 'sistemas', seriesCompatibles: ['S20', 'S25'], permiteCotizacionAutomatica: false, nota: 'Cajón compacto con cortina PVC' },
  { id: 'monoblock-aluminio', nombre: 'Sistema Monoblock (Cortina Aluminio Térmico)', categoria: 'sistemas', seriesCompatibles: ['S20', 'S25'], permiteCotizacionAutomatica: false, nota: 'Lamas de aluminio con poliuretano' },
  
  // Mamparas & Barandas
  { id: 'mampara-cristal', nombre: 'Mampara de Cristal de Baño', categoria: 'mamparas', seriesCompatibles: ['S30'], permiteCotizacionAutomatica: false, nota: 'Cristal templado 6/8mm a medida' },
  { id: 'mampara-acrilico', nombre: 'Mampara de Acrílico', categoria: 'mamparas', seriesCompatibles: ['S20'], permiteCotizacionAutomatica: false, nota: 'Perfilería liviana con acrílico' },
  { id: 'baranda-aluminio', nombre: 'Baranda de Balcón / Escalera', categoria: 'especiales', seriesCompatibles: ['S30'], permiteCotizacionAutomatica: false, nota: 'Pasamanos y cristal laminado' },
  { id: 'cortina-roller', nombre: 'Cortinas Rollers (Blackout / Sunscreen)', categoria: 'sistemas', seriesCompatibles: ['S20'], permiteCotizacionAutomatica: false, nota: 'Confección a medida con cadena' },
  
  // Estructuras y Techos a Medida
  { id: 'techo-fijo', nombre: 'Techo Fijo (Policarbonato / Vidrio)', categoria: 'especiales', seriesCompatibles: ['S30'], permiteCotizacionAutomatica: false, nota: 'Estructura autoportante a medida' },
  { id: 'techo-automatizado', nombre: 'Techo Automatizado Corredizo', categoria: 'especiales', seriesCompatibles: ['S30'], permiteCotizacionAutomatica: false, nota: 'Apertura con motor a control remoto' },
  { id: 'herreria-diseno', nombre: 'Herrería de Diseño en Aluminio', categoria: 'especiales', seriesCompatibles: ['S30'], permiteCotizacionAutomatica: false, nota: 'Portones, rejas y cerramientos' },
];

export const MEDIDAS_ESTANDAR: MedidaEstandar[] = [
  { id: '1000x1000', ancho: 1000, alto: 1000, label: '1000 x 1000 mm (1.00 m Ancho x 1.00 m Alto)', precioBaseNatural: 8500, precioBaseAnolok: 9800 },
  { id: '1000x1200', ancho: 1000, alto: 1200, label: '1000 x 1200 mm (1.00 m Ancho x 1.20 m Alto)', precioBaseNatural: 9500, precioBaseAnolok: 11000 },
  { id: '1000x1500', ancho: 1000, alto: 1500, label: '1000 x 1500 mm (1.00 m Ancho x 1.50 m Alto)', precioBaseNatural: 10800, precioBaseAnolok: 12900 },
  { id: '1200x1200', ancho: 1200, alto: 1200, label: '1200 x 1200 mm (1.20 m Ancho x 1.20 m Alto)', precioBaseNatural: 11200, precioBaseAnolok: 13400 },
  { id: '1500x1200', ancho: 1500, alto: 1200, label: '1500 x 1200 mm (1.50 m Ancho x 1.20 m Alto)', precioBaseNatural: 12800, precioBaseAnolok: 15200 },
  { id: '2000x1200', ancho: 2000, alto: 1200, label: '2000 x 1200 mm (2.00 m Ancho x 1.20 m Alto)', precioBaseNatural: 15900, precioBaseAnolok: 18800 },
  { id: '2000x2000', ancho: 2000, alto: 2000, label: '2000 x 2000 mm (2.00 m Ancho x 2.00 m Alto - Puerta Balcón)', precioBaseNatural: 21500, precioBaseAnolok: 25600 },
];

export const FACTORES_SERIE: Record<SerieAluminio, { factor: number; nombre: string; desc: string }> = {
  S20: { factor: 0.85, nombre: 'Serie 20 (Económica -15%)', desc: 'Línea residencial liviana para obras estándar' },
  S25: { factor: 1.0,  nombre: 'Serie 25 (Estándar Comercial)', desc: 'Línea tradicional de mayor venta' },
  S30: { factor: 1.30, nombre: 'Serie 30 (Reforzada / Hermética +30%)', desc: 'Perfiles robustos para puertas, paños fijos y batientes' },
};

export const COLORES: Record<ColorAluminio, { nombre: string; hex: string; desc: string }> = {
  natural: { nombre: 'Natural (Aluminio Plata Mate)', hex: '#CBD5E1', desc: 'Anodizado tradicional anticorrosión' },
  anolok:  { nombre: 'Anolok / Negro (Terminación Oscura)', hex: '#262626', desc: 'Anodizado oscuro o pintura electrostática microtexturada' },
};

export const VIDRIOS: Record<TipoVidrio, { nombre: string; desc: string; recargoPorcentaje: number }> = {
  simple: { nombre: 'Cristal Simple 4mm / 5mm (Estándar)', desc: 'Cristal flotado incoloro', recargoPorcentaje: 0 },
  dvh:    { nombre: 'Vidrio DVH Térmico y Acústico (+25%)', desc: 'Doble Vidriado Hermético con cámara aislante', recargoPorcentaje: 0.25 },
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
  condicionesPago: '50% seña para reserva de perfiles, 50% saldo contra entrega en taller',
};

export function calcularPresupuesto(config: QuoteConfig): QuoteBreakdown {
  const medida = MEDIDAS_ESTANDAR.find(m => m.id === config.medidaId) || MEDIDAS_ESTANDAR[0];
  const infoSerie = FACTORES_SERIE[config.serie] || FACTORES_SERIE['S25'];
  const infoColor = COLORES[config.color] || COLORES['natural'];
  const infoVidrio = VIDRIOS[config.vidrio] || VIDRIOS['simple'];

  // 1. Precio base de Serie 25 según color
  const baseS25 = config.color === 'natural' ? medida.precioBaseNatural : medida.precioBaseAnolok;

  // 2. Multiplicador de serie
  const subtotalPerfileria = Math.round(baseS25 * infoSerie.factor);
  const adicionalSerie = subtotalPerfileria - baseS25;

  // 3. Recargo de vidrio
  const adicionalVidrioDVH = Math.round(subtotalPerfileria * infoVidrio.recargoPorcentaje);
  const subtotalAbertura = subtotalPerfileria + adicionalVidrioDVH;

  // 4. Colocación en Montevideo
  const adicionalColocacion = config.conColocacion ? 1800 : 0;
  const totalFinal = subtotalAbertura + adicionalColocacion;

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
    costoColocacion: adicionalColocacion,
    totalFinal,
    vigenciaDias: DATOS_EMPRESA.vigenciaDias,
  };
}

export function formatearMoneda(monto: number): string {
  return '$ ' + monto.toLocaleString('es-UY');
}

export function generarTextoWhatsApp(breakdown: QuoteBreakdown, productoNombre?: string, requiereConsulta?: boolean): string {
  const nombreAbertura = productoNombre || 'Ventana Corrediza (2 Hojas)';

  if (requiereConsulta) {
    const lineasConsulta = [
      `*CONSULTA DE COTIZACIÓN - CD ALUMINIO*`,
      `Gral. Flores 2979, Montevideo`,
      `----------------------------------------`,
      `*Producto Solicitado:* ${nombreAbertura}`,
      `*Estado de Precio:* A convenir / A medida`,
      `*Detalle:* Deseo coordinar cotización formal o visita técnica.`,
      `----------------------------------------`,
      `• Taller y Ventas: Gral. Flores 2979`,
      `• WhatsApp Oficial: 095 262 858`,
      `\n_Enviado desde Cotizador Móvil Oficial CD Aluminio_`
    ];
    return encodeURIComponent(lineasConsulta.join('\n'));
  }

  const lineas = [
    `*PRESUPUESTO FORMAL CD ALUMINIO*`,
    `Gral. Flores 2979, Montevideo`,
    `----------------------------------------`,
    `*Producto:* ${nombreAbertura}`,
    `*Línea / Serie:* ${breakdown.serieNombre}`,
    `*Terminación:* ${breakdown.colorNombre}`,
    `*Dimensiones (Ancho x Alto):* ${breakdown.medida.ancho} mm x ${breakdown.medida.alto} mm`,
    `*Cristal:* ${breakdown.vidrioNombre}`,
    `*Instalación en Obra:* ${breakdown.costoColocacion > 0 ? 'Con Colocación en Montevideo (+$1.800 UYU)' : 'Sin colocación (Retiro en Taller)'}`,
    `----------------------------------------`,
    `*TOTAL COTIZADO: ${formatearMoneda(breakdown.totalFinal)} UYU*`,
    `----------------------------------------`,
    `• Validez: ${breakdown.vigenciaDias} días corridos`,
    `• Forma de pago: 50% seña para encargo, saldo contra entrega`,
    `• Retiro sin costo en taller Gral. Flores 2979`,
    ...(breakdown.costoColocacion > 0 ? [`⚠️ *IMPORTANTE:* Para validar colocación es obligatorio adjuntar foto del vano o abertura a sustituir.`] : []),
    `\n_Cotizado desde Web App Oficial CD Aluminio_`
  ];
  return encodeURIComponent(lineas.join('\n'));
}
