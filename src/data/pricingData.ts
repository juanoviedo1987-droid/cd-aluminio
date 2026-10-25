import type { SerieAluminio, ColorAluminio, TipoVidrio, QuoteConfig, QuoteBreakdown } from '../types/pricing';

export interface ProductoCatalogo {
  id: string;
  nombre: string;
  categoria: 'ventanas' | 'puertas' | 'mamparas' | 'sistemas' | 'especiales';
  seriesCompatibles: SerieAluminio[];
  cristalesCompatibles: TipoVidrio[];
  nota?: string;
}

// 26 PRODUCTOS OFICIALES DEL EXCEL CON SUS COMPATIBILIDADES EXACTAS
export const CATALOGO_PRODUCTOS: ProductoCatalogo[] = [
  // Ventanas Corredizas
  {
    id: 'ventana-corrediza-2h',
    nombre: 'Ventana Corrediza (2 Hojas)',
    categoria: 'ventanas',
    seriesCompatibles: ['S20', 'S25', 'A82', 'PROBBA', 'GALA_CR'],
    cristalesCompatibles: ['c4mm', 'c5mm', 'polic_alveolar', 'polic_compacto']
  },
  {
    id: 'ventana-corrediza-3h',
    nombre: 'Ventana Corrediza (3 Hojas)',
    categoria: 'ventanas',
    seriesCompatibles: ['S25', 'A82', 'PROBBA', 'GALA_CR'],
    cristalesCompatibles: ['c4mm', 'c5mm', 'c6mm', 'c8mm', 'dvh', 'polic_alveolar', 'polic_compacto']
  },
  {
    id: 'ventana-corrediza-4h',
    nombre: 'Ventana Corrediza (4 Hojas)',
    categoria: 'ventanas',
    seriesCompatibles: ['S25', 'A82', 'PROBBA', 'GALA_CR'],
    cristalesCompatibles: ['c4mm', 'c5mm', 'c6mm', 'c8mm', 'dvh', 'polic_alveolar', 'polic_compacto']
  },

  // Paños Fijos, Batientes y Proyectantes
  {
    id: 'pano-fijo',
    nombre: 'Paño Fijo',
    categoria: 'ventanas',
    seriesCompatibles: ['S30', 'A82', 'PROBBA', 'GALA_CR'],
    cristalesCompatibles: ['c4mm', 'c5mm', 'c6mm', 'dvh', 'polic_alveolar', 'polic_compacto']
  },
  {
    id: 'ventana-batiente',
    nombre: 'Ventana Batiente',
    categoria: 'ventanas',
    seriesCompatibles: ['S30'],
    cristalesCompatibles: ['c4mm', 'c5mm', 'c6mm', 'dvh', 'polic_alveolar', 'polic_compacto']
  },
  {
    id: 'ventana-tabaquera',
    nombre: 'Ventana Tabaquera',
    categoria: 'ventanas',
    seriesCompatibles: ['S30'],
    cristalesCompatibles: ['c4mm', 'c5mm', 'c6mm', 'c8mm', 'dvh', 'polic_alveolar', 'polic_compacto']
  },
  {
    id: 'ventana-proyectante',
    nombre: 'Ventana Proyectante',
    categoria: 'ventanas',
    seriesCompatibles: ['S30', 'PROBBA', 'GALA_CR'],
    cristalesCompatibles: ['c4mm', 'c5mm', 'c6mm', 'c8mm', 'dvh', 'polic_alveolar', 'polic_compacto']
  },
  {
    id: 'ventana-guillotina',
    nombre: 'Ventana Guillotina',
    categoria: 'ventanas',
    seriesCompatibles: ['A82', 'PROBBA', 'GALA_CR'],
    cristalesCompatibles: ['c4mm', 'c5mm', 'c6mm', 'c8mm', 'dvh', 'polic_alveolar', 'polic_compacto']
  },

  // Bajo Mesadas
  {
    id: 'bajo-mesada-batiente',
    nombre: 'Bajo Mesada (Batiente)',
    categoria: 'especiales',
    seriesCompatibles: ['S30'],
    cristalesCompatibles: ['c4mm', 'polic_alveolar', 'polic_compacto']
  },
  {
    id: 'bajo-mesada-corredizo',
    nombre: 'Bajo Mesada (Corredizo)',
    categoria: 'especiales',
    seriesCompatibles: ['S20'],
    cristalesCompatibles: ['c4mm', 'polic_alveolar', 'polic_compacto']
  },

  // Puertas
  {
    id: 'puerta-mitad-vidrio',
    nombre: 'Puerta Mitad Aluminio y Mitad Cristal',
    categoria: 'puertas',
    seriesCompatibles: ['S30'],
    cristalesCompatibles: ['c4mm', 'c5mm', 'c6mm', 'dvh', 'polic_alveolar', 'polic_compacto']
  },
  {
    id: 'puerta-ciega',
    nombre: 'Puerta Toda Ciega en Aluminio',
    categoria: 'puertas',
    seriesCompatibles: ['S30'],
    cristalesCompatibles: ['ninguno']
  },
  {
    id: 'puerta-cristal',
    nombre: 'Puerta en Cristal',
    categoria: 'puertas',
    seriesCompatibles: ['S30'],
    cristalesCompatibles: ['c4mm', 'c5mm', 'c6mm', 'dvh', 'polic_alveolar', 'polic_compacto']
  },
  {
    id: 'puerta-granero',
    nombre: 'Puerta Estilo Granero (Interior)',
    categoria: 'puertas',
    seriesCompatibles: ['S30'],
    cristalesCompatibles: ['c4mm', 'c5mm', 'c6mm', 'dvh', 'polic_alveolar', 'polic_compacto']
  },

  // Sistemas Monoblock
  {
    id: 'monoblock-pvc',
    nombre: 'Sistema Monoblock (Cortina PVC)',
    categoria: 'sistemas',
    seriesCompatibles: ['S20', 'S25', 'A82', 'PROBBA', 'GALA_CR'],
    cristalesCompatibles: ['c4mm', 'c5mm', 'c6mm', 'dvh', 'polic_alveolar', 'polic_compacto']
  },
  {
    id: 'monoblock-aluminio',
    nombre: 'Sistema Monoblock (Cortina Aluminio)',
    categoria: 'sistemas',
    seriesCompatibles: ['S20', 'S25', 'A82', 'PROBBA', 'GALA_CR'],
    cristalesCompatibles: ['c4mm', 'c5mm', 'c6mm', 'dvh', 'polic_alveolar', 'polic_compacto']
  },

  // Mamparas, Barandas y Rollers
  {
    id: 'mampara-cristal',
    nombre: 'Mampara de Cristal',
    categoria: 'mamparas',
    seriesCompatibles: ['S30', 'ESPECIAL'],
    cristalesCompatibles: ['c4mm', 'c6mm', 'c8mm', 'polic_alveolar', 'polic_compacto']
  },
  {
    id: 'mampara-acrilico',
    nombre: 'Mampara de Acrílico',
    categoria: 'mamparas',
    seriesCompatibles: ['S20', 'ESPECIAL'],
    cristalesCompatibles: ['ninguno']
  },
  {
    id: 'baranda-aluminio',
    nombre: 'Baranda',
    categoria: 'especiales',
    seriesCompatibles: ['S30', 'ESPECIAL'],
    cristalesCompatibles: ['c6mm', 'c8mm', 'polic_alveolar', 'polic_compacto']
  },
  {
    id: 'cortina-roller',
    nombre: 'Cortina Rollers',
    categoria: 'sistemas',
    seriesCompatibles: ['ESPECIAL'],
    cristalesCompatibles: ['ninguno']
  },

  // Estructuras y Techos a Medida
  {
    id: 'techo-fijo',
    nombre: 'Techo Fijo',
    categoria: 'especiales',
    seriesCompatibles: ['S30', 'ESPECIAL'],
    cristalesCompatibles: ['polic_alveolar', 'polic_compacto', 'c8mm']
  },
  {
    id: 'techo-automatizado',
    nombre: 'Techo Automatizado',
    categoria: 'especiales',
    seriesCompatibles: ['S30', 'ESPECIAL'],
    cristalesCompatibles: ['polic_alveolar', 'polic_compacto', 'c8mm']
  },
  {
    id: 'herreria-diseno',
    nombre: 'Herrería de Diseño',
    categoria: 'especiales',
    seriesCompatibles: ['S30', 'ESPECIAL'],
    cristalesCompatibles: ['ninguno', 'polic_alveolar', 'polic_compacto']
  },
];

// LAS 6 SERIES OFICIALES DEL EXCEL (+ ESPECIAL)
export const FACTORES_SERIE: Record<SerieAluminio, { nombre: string; desc: string }> = {
  S20: { nombre: 'Serie 20', desc: 'Línea económica residencial liviana' },
  S25: { nombre: 'Serie 25', desc: 'Línea estándar tradicional de mayor salida' },
  S30: { nombre: 'Serie 30', desc: 'Línea reforzada para puertas, paños fijos y batientes' },
  A82: { nombre: 'Línea A82 (Alta Prestación)', desc: 'Aislación superior y hermeticidad perimetral' },
  PROBBA: { nombre: 'Línea Probba (Alta Prestación)', desc: 'Perfilería de alta prestación y grandes luces' },
  GALA_CR: { nombre: 'Línea Gala CR (Alta Prestación)', desc: 'Máxima gama arquitectónica con rotura de puente térmico' },
  ESPECIAL: { nombre: 'Línea Especial / A Medida', desc: 'Perfilería y herrajes específicos de diseño' },
};

// LOS 5 COLORES OFICIALES DEL EXCEL
export const COLORES: Record<ColorAluminio, { nombre: string; hex: string; desc: string }> = {
  natural: { nombre: 'Anodizado Natural', hex: '#CBD5E1', desc: 'Terminación plata mate tradicional anticorrosión' },
  blanco: { nombre: 'Blanco', hex: '#FFFFFF', desc: 'Pintura electrostática blanca horneada' },
  negro: { nombre: 'Negro', hex: '#1E293B', desc: 'Pintura electrostática microtexturada negra' },
  anolok: { nombre: 'Anolock', hex: '#451a03', desc: 'Anodizado color marrón / bronce oscuro' },
  electrostatica: { nombre: 'Pintura electrostática', hex: '#71717A', desc: 'Consultar gama y catálogo de colores a elección' },
};

// LOS 7 CRISTALES / VIDRIOS OFICIALES DEL EXCEL (+ NINGUNO)
export const VIDRIOS: Record<TipoVidrio, { nombre: string; desc: string }> = {
  c4mm: { nombre: 'Cristal 4mm', desc: 'Cristal flotado incoloro estándar 4 mm' },
  c5mm: { nombre: 'Cristal 5mm', desc: 'Cristal flotado incoloro 5 mm' },
  c6mm: { nombre: 'Cristal 6mm', desc: 'Cristal templado o flotado 6 mm de mayor rigidez' },
  c8mm: { nombre: 'Cristal 8mm', desc: 'Cristal laminado o templado 8 mm para seguridad' },
  dvh: { nombre: 'DVH (Doble Vidriado Hermético)', desc: 'Doble vidrio con cámara aislante termo-acústica' },
  polic_alveolar: { nombre: 'Policarbonato alveolar', desc: 'Placa alveolar translúcida y liviana para techos y cerramientos' },
  polic_compacto: { nombre: 'Policarbonato compacto', desc: 'Placa compacta ultra resistente al impacto' },
  ninguno: { nombre: 'Sin Cristal / No Aplica', desc: 'Abertura ciega, tela roller o acrílico de taller' },
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

export function calcularPresupuesto(config: QuoteConfig, precioBaseTaller?: number | null, precioTextoPersonalizado?: string): QuoteBreakdown {
  const infoSerie = FACTORES_SERIE[config.serie] || FACTORES_SERIE['S25'];
  const infoColor = COLORES[config.color] || COLORES['natural'];
  const infoVidrio = VIDRIOS[config.vidrio] || VIDRIOS['c4mm'];

  const tieneAncho = config.ancho && config.ancho.trim() !== '';
  const tieneAlto = config.alto && config.alto.trim() !== '';

  let medidaTexto = 'A convenir / A coordinar en obra';
  if (tieneAncho && tieneAlto) {
    medidaTexto = `${config.ancho.trim()} cm Ancho x ${config.alto.trim()} cm Alto`;
  } else if (tieneAncho) {
    medidaTexto = `${config.ancho.trim()} cm Ancho (Alto a definir)`;
  } else if (tieneAlto) {
    medidaTexto = `${config.alto.trim()} cm Alto (Ancho a definir)`;
  }

  let precioCalculadoTexto = precioTextoPersonalizado || 'A Convenir / Consultar';
  if (precioBaseTaller && precioBaseTaller > 0) {
    if (tieneAncho || tieneAlto) {
      precioCalculadoTexto = `Desde $ ${precioBaseTaller.toLocaleString('es-UY')} UYU (Ref.)`;
    } else {
      precioCalculadoTexto = `$ ${precioBaseTaller.toLocaleString('es-UY')} UYU (Base)`;
    }
  }

  return {
    medidaTexto,
    ancho: config.ancho,
    alto: config.alto,
    serieNombre: infoSerie.nombre,
    colorNombre: infoColor.nombre,
    vidrioNombre: infoVidrio.nombre,
    conColocacion: config.conColocacion,
    costoColocacionTexto: config.conColocacion ? 'A coordinar en obra (Montevideo)' : 'Retiro en taller (Sin costo)',
    precioTexto: precioCalculadoTexto,
    vigenciaDias: DATOS_EMPRESA.vigenciaDias,
  };
}

export function generarTextoWhatsApp(breakdown: QuoteBreakdown, productoNombre?: string): string {
  const nombreAbertura = productoNombre || 'Ventana Corrediza (2 Hojas)';

  const lineasConsulta = [
    `*CONSULTA DE COTIZACIÓN - CD ALUMINIO*`,
    `Gral. Flores 2979, Montevideo`,
    `----------------------------------------`,
    `*Producto:* ${nombreAbertura}`,
    `*Línea / Serie:* ${breakdown.serieNombre}`,
    `*Color:* ${breakdown.colorNombre}`,
    `*Medidas:* ${breakdown.medidaTexto}`,
    `*Cristal:* ${breakdown.vidrioNombre}`,
    `*Instalación:* ${breakdown.conColocacion ? 'Con colocación en obra' : 'Retiro en taller'}`,
    `*Estimación:* ${breakdown.precioTexto}`,
    `----------------------------------------`,
    `_Nota: Presupuesto referencial sujeto a validación técnica de escuadría y vano en obra._`,
    `Hola CD Aluminio, les envío esta configuración para coordinar rectificación y presupuesto formal. Aguardo su respuesta.`
  ];

  return encodeURIComponent(lineasConsulta.join('\n'));
}
