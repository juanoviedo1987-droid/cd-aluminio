import type { MedidaEstandar, SerieAluminio, ColorAluminio, TipoVidrio, QuoteConfig, QuoteBreakdown } from '../types/pricing';

export interface ProductoCatalogo {
  id: string;
  nombre: string;
  categoria: 'ventanas' | 'puertas' | 'mamparas' | 'sistemas' | 'especiales';
  seriesCompatibles: SerieAluminio[];
  nota?: string;
}

// 26 PRODUCTOS OFICIALES DEL EXCEL DEL CLIENTE CON SUS SERIES COMPATIBLES
export const CATALOGO_PRODUCTOS: ProductoCatalogo[] = [
  // Ventanas Corredizas
  { id: 'ventana-corrediza-2h', nombre: 'Ventana Corrediza (2 Hojas)', categoria: 'ventanas', seriesCompatibles: ['S20', 'S25', 'A82', 'PROBBA', 'GALA_CR'] },
  { id: 'ventana-corrediza-3h', nombre: 'Ventana Corrediza (3 Hojas)', categoria: 'ventanas', seriesCompatibles: ['S25', 'A82', 'PROBBA', 'GALA_CR'] },
  { id: 'ventana-corrediza-4h', nombre: 'Ventana Corrediza (4 Hojas)', categoria: 'ventanas', seriesCompatibles: ['S25', 'A82', 'PROBBA', 'GALA_CR'] },
  
  // Aberturas Batientes, Paños Fijos y Proyectantes
  { id: 'pano-fijo', nombre: 'Paño Fijo', categoria: 'ventanas', seriesCompatibles: ['S30', 'A82', 'PROBBA', 'GALA_CR'] },
  { id: 'ventana-batiente', nombre: 'Ventana Batiente', categoria: 'ventanas', seriesCompatibles: ['S30'] },
  { id: 'ventana-tabaquera', nombre: 'Ventana Tabaquera', categoria: 'ventanas', seriesCompatibles: ['S30'] },
  { id: 'ventana-proyectante', nombre: 'Ventana Proyectante', categoria: 'ventanas', seriesCompatibles: ['S30', 'PROBBA', 'GALA_CR'] },
  { id: 'ventana-guillotina', nombre: 'Ventana Guillotina', categoria: 'ventanas', seriesCompatibles: ['A82', 'PROBBA', 'GALA_CR'] },
  
  // Bajo Mesadas
  { id: 'bajo-mesada-batiente', nombre: 'Bajo Mesada (Batiente)', categoria: 'especiales', seriesCompatibles: ['S30'] },
  { id: 'bajo-mesada-corredizo', nombre: 'Bajo Mesada (Corredizo)', categoria: 'especiales', seriesCompatibles: ['S20'] },
  
  // Puertas (Serie 30 según Excel)
  { id: 'puerta-mitad-vidrio', nombre: 'Puerta Mitad Aluminio y Mitad Cristal', categoria: 'puertas', seriesCompatibles: ['S30'] },
  { id: 'puerta-ciega', nombre: 'Puerta Toda Ciega en Aluminio', categoria: 'puertas', seriesCompatibles: ['S30'] },
  { id: 'puerta-cristal', nombre: 'Puerta en Cristal Templado', categoria: 'puertas', seriesCompatibles: ['S30'] },
  { id: 'puerta-granero', nombre: 'Puerta Estilo Granero (Interior)', categoria: 'puertas', seriesCompatibles: ['S30'] },
  
  // Sistemas Monoblock
  { id: 'monoblock-pvc', nombre: 'Sistema Monoblock (Cortina PVC)', categoria: 'sistemas', seriesCompatibles: ['S20', 'S25', 'A82', 'PROBBA', 'GALA_CR'] },
  { id: 'monoblock-aluminio', nombre: 'Sistema Monoblock (Cortina Aluminio)', categoria: 'sistemas', seriesCompatibles: ['S20', 'S25', 'A82', 'PROBBA', 'GALA_CR'] },
  
  // Mamparas, Barandas y Rollers
  { id: 'mampara-cristal', nombre: 'Mampara de Cristal de Baño', categoria: 'mamparas', seriesCompatibles: ['S30'] },
  { id: 'mampara-acrilico', nombre: 'Mampara de Acrílico', categoria: 'mamparas', seriesCompatibles: ['S20'] },
  { id: 'baranda-aluminio', nombre: 'Baranda de Balcón / Escalera', categoria: 'especiales', seriesCompatibles: ['S30'] },
  { id: 'cortina-roller', nombre: 'Cortinas Rollers', categoria: 'sistemas', seriesCompatibles: ['S20'] },
  
  // Estructuras y Techos a Medida
  { id: 'techo-fijo', nombre: 'Techo Fijo (Policarbonato / Vidrio)', categoria: 'especiales', seriesCompatibles: ['S30'] },
  { id: 'techo-automatizado', nombre: 'Techo Automatizado Corredizo', categoria: 'especiales', seriesCompatibles: ['S30'] },
  { id: 'herreria-diseno', nombre: 'Herrería de Diseño en Aluminio', categoria: 'especiales', seriesCompatibles: ['S30'] },
];

// MEDIDAS ESTÁNDAR (SIN PRECIOS HARDCODEADOS, TAL COMO INDICÓ EL USUARIO)
export const MEDIDAS_ESTANDAR: MedidaEstandar[] = [
  { id: '1000x1000', ancho: 1000, alto: 1000, label: '1000 x 1000 mm (1.00 m Ancho x 1.00 m Alto)' },
  { id: '1000x1200', ancho: 1000, alto: 1200, label: '1000 x 1200 mm (1.00 m Ancho x 1.20 m Alto)' },
  { id: '1000x1500', ancho: 1000, alto: 1500, label: '1000 x 1500 mm (1.00 m Ancho x 1.50 m Alto)' },
  { id: '1200x1200', ancho: 1200, alto: 1200, label: '1200 x 1200 mm (1.20 m Ancho x 1.20 m Alto)' },
  { id: '1500x1200', ancho: 1500, alto: 1200, label: '1500 x 1200 mm (1.50 m Ancho x 1.20 m Alto)' },
  { id: '2000x1200', ancho: 2000, alto: 1200, label: '2000 x 1200 mm (2.00 m Ancho x 1.20 m Alto)' },
  { id: '2000x2000', ancho: 2000, alto: 2000, label: '2000 x 2000 mm (2.00 m Ancho x 2.00 m Alto - Balcón)' },
];

// LAS 6 SERIES OFICIALES DEL EXCEL
export const FACTORES_SERIE: Record<SerieAluminio, { nombre: string; desc: string }> = {
  S20: { nombre: 'Serie 20', desc: 'Línea económica residencial liviana' },
  S25: { nombre: 'Serie 25', desc: 'Línea estándar tradicional de mayor salida' },
  S30: { nombre: 'Serie 30', desc: 'Línea reforzada para puertas, paños fijos y batientes' },
  A82: { nombre: 'Línea A82 (Alta Prestación)', desc: 'Aislación superior y hermeticidad perimetral' },
  PROBBA: { nombre: 'Línea Probba (Alta Prestación)', desc: 'Perfilería de alta prestación y grandes luces' },
  GALA_CR: { nombre: 'Línea Gala CR (Alta Prestación)', desc: 'Máxima gama arquitectónica con rotura de puente térmico' },
};

// LOS 5 COLORES OFICIALES DEL EXCEL
export const COLORES: Record<ColorAluminio, { nombre: string; hex: string; desc: string }> = {
  natural: { nombre: 'Anodizado Natural', hex: '#CBD5E1', desc: 'Terminación plata mate tradicional anticorrosión' },
  blanco: { nombre: 'Blanco', hex: '#FFFFFF', desc: 'Pintura electrostática blanca horneada' },
  negro: { nombre: 'Negro', hex: '#1E293B', desc: 'Pintura electrostática microtexturada negra' },
  anolok: { nombre: 'Anolock', hex: '#451a03', desc: 'Anodizado color marrón / bronce oscuro' },
  electrostatica: { nombre: 'Pintura electrostática', hex: '#71717A', desc: 'Consultar gama y catálogo de colores a elección' },
};

// LOS 7 CRISTALES / VIDRIOS OFICIALES DEL EXCEL
export const VIDRIOS: Record<TipoVidrio, { nombre: string; desc: string }> = {
  c4mm: { nombre: 'Cristal 4mm', desc: 'Cristal flotado incoloro estándar 4 mm' },
  c5mm: { nombre: 'Cristal 5mm', desc: 'Cristal flotado incoloro 5 mm' },
  c6mm: { nombre: 'Cristal 6mm', desc: 'Cristal templado o flotado 6 mm de mayor rigidez' },
  c8mm: { nombre: 'Cristal 8mm', desc: 'Cristal laminado o templado 8 mm para seguridad' },
  dvh: { nombre: 'DVH (Doble Vidriado Hermético)', desc: 'Doble vidrio con cámara aislante termo-acústica' },
  polic_alveolar: { nombre: 'Policarbonato alveolar', desc: 'Placa alveolar translúcida y liviana para techos y cerramientos' },
  polic_compacto: { nombre: 'Policarbonato compacto', desc: 'Placa compacta ultra resistente al impacto' },
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
  const infoVidrio = VIDRIOS[config.vidrio] || VIDRIOS['c4mm'];

  return {
    medida,
    serieNombre: infoSerie.nombre,
    colorNombre: infoColor.nombre,
    vidrioNombre: infoVidrio.nombre,
    conColocacion: config.conColocacion,
    costoColocacionTexto: config.conColocacion ? 'A coordinar en obra (Montevideo)' : 'Retiro en taller (Sin costo)',
    precioTexto: 'A Convenir / Consultar',
    vigenciaDias: DATOS_EMPRESA.vigenciaDias,
  };
}

export function generarTextoWhatsApp(breakdown: QuoteBreakdown, productoNombre?: string): string {
  const nombreAbertura = productoNombre || 'Ventana Corrediza (2 Hojas)';

  const lineasConsulta = [
    `*CONSULTA DE COTIZACIÓN - CD ALUMINIO*`,
    `Gral. Flores 2979, Montevideo`,
    `----------------------------------------`,
    `*Producto Solicitado:* ${nombreAbertura}`,
    `*Línea / Serie:* ${breakdown.serieNombre}`,
    `*Color / Terminación:* ${breakdown.colorNombre}`,
    `*Medida (Ancho x Alto):* ${breakdown.medida.label}`,
    `*Tipo de Vidrio:* ${breakdown.vidrioNombre}`,
    `*Servicio de Instalación:* ${breakdown.conColocacion ? 'Con colocación en obra' : 'Retiro en taller'}`,
    `*Estado de Precio:* ${breakdown.precioTexto}`,
    `----------------------------------------`,
    `Hola CD Aluminio, les envío esta configuración para coordinar presupuesto formal y cotización. Aguardo su respuesta.`
  ];

  return encodeURIComponent(lineasConsulta.join('\n'));
}
