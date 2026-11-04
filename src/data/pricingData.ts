import type { SerieAluminio, ColorAluminio, QuoteConfig, QuoteBreakdown } from '../types/pricing';
import { MATRIZ_SERIE_20_BASE, type MatrizSerie20Data } from './matrizSerie20';

export interface ProductoCatalogo {
  id: string;
  nombre: string;
  categoria: string;
  esPorM2?: boolean;
  precioBase: number | null;
  precioTexto: string;
  activo: boolean;
  nota?: string;
}

// Producto Real Oficial de CD Aluminio
export const PRODUCTO_VENTANA_SERIE_20: ProductoCatalogo = {
  id: 'V-CORR-S20',
  nombre: 'Ventana Corrediza Serie 20',
  categoria: 'Ventanas',
  precioBase: 3920,
  precioTexto: '$ 3.920 UYU (mínimo 60x40 cm)',
  activo: true,
  nota: 'Precios oficiales de taller según matriz de dimensiones estándar.',
};

export const PRODUCTO_EJEMPLO_TEST = PRODUCTO_VENTANA_SERIE_20;

// SERIE OFICIAL
export const FACTORES_SERIE: Record<SerieAluminio, { nombre: string; desc: string }> = {
  S20: { nombre: 'Serie 20', desc: 'Línea oficial de taller en perfiles de aluminio' },
};

// COLORES OFICIALES
export const COLORES: Record<ColorAluminio, { nombre: string; hex: string; desc: string }> = {
  natural: { nombre: 'Anodizado Natural', hex: '#CBD5E1', desc: 'Terminación plata mate tradicional anticorrosión' },
  blanco: { nombre: 'Blanco', hex: '#FFFFFF', desc: 'Pintura electrostática blanca horneada' },
  negro: { nombre: 'Negro', hex: '#1E293B', desc: 'Pintura electrostática microtexturada negra' },
  anolok: { nombre: 'Anolock', hex: '#451a03', desc: 'Anodizado color marrón / bronce oscuro' },
  electrostatica: { nombre: 'Pintura electrostática', hex: '#71717A', desc: 'Consultar gama y catálogo de colores a elección' },
};

// CRISTAL OFICIAL FIJO SEGÚN INFORMACIÓN REAL DE TALLER
export const CRISTAL_OFICIAL = 'Incoloro 4mm';

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

export interface MatrizLookupResult {
  precio: number | null;
  anchoStd: number;
  altoStd: number;
  esExacto: boolean;
  fueraDeRango: boolean;
  mensajeRango?: string;
}

export function buscarPrecioEnMatriz(
  anchoCm: number,
  altoCm: number,
  matriz: MatrizSerie20Data = MATRIZ_SERIE_20_BASE
): MatrizLookupResult {
  const anchoMm = Math.round(anchoCm * 10);
  const altoMm = Math.round(altoCm * 10);

  const minAncho = matriz.anchos[0] || 600;
  const maxAncho = matriz.anchos[matriz.anchos.length - 1] || 2500;
  const minAlto = matriz.altos[0] || 400;
  const maxAlto = matriz.altos[matriz.altos.length - 1] || 1600;

  if (anchoMm > maxAncho || altoMm > maxAlto) {
    return {
      precio: null,
      anchoStd: anchoMm,
      altoStd: altoMm,
      esExacto: false,
      fueraDeRango: true,
      mensajeRango: `Medida (${anchoCm}x${altoCm} cm) excede el máximo estándar Serie 20 (${maxAncho / 10}x${maxAlto / 10} cm).`,
    };
  }

  if (anchoMm < minAncho || altoMm < minAlto) {
    return {
      precio: null,
      anchoStd: anchoMm,
      altoStd: altoMm,
      esExacto: false,
      fueraDeRango: true,
      mensajeRango: `Medida (${anchoCm}x${altoCm} cm) es inferior al mínimo estándar Serie 20 (${minAncho / 10}x${minAlto / 10} cm).`,
    };
  }

  // 1. Redondeo estándar al módulo superior más próximo
  let anchoStd = matriz.anchos.find((a) => a >= anchoMm) || maxAncho;
  let altoStd = matriz.altos.find((h) => h >= altoMm) || maxAlto;

  let key = `${anchoStd}x${altoStd}`;
  let precio = matriz.precios[key] || null;

  // 2. Si esa combinación exacta no estaba en la tabla original, buscar el módulo válido más próximo
  if (precio === null) {
    // Si la altura es menor a la mínima de ese ancho (ej. 1400x400), buscar altura válida más próxima
    for (const h of matriz.altos) {
      if (h >= altoStd && matriz.precios[`${anchoStd}x${h}`]) {
        altoStd = h;
        precio = matriz.precios[`${anchoStd}x${h}`];
        break;
      }
    }
    // Si la altura excedía el máximo de ese ancho (ej. 600x1200), buscar el ancho siguiente que sí tenga esa altura
    if (precio === null) {
      for (const w of matriz.anchos) {
        if (w >= anchoStd && matriz.precios[`${w}x${altoStd}`]) {
          anchoStd = w;
          precio = matriz.precios[`${w}x${altoStd}`];
          break;
        }
      }
    }
  }

  const esExacto = anchoMm === anchoStd && altoMm === altoStd;

  return {
    precio,
    anchoStd,
    altoStd,
    esExacto,
    fueraDeRango: precio === null,
  };
}

export function calcularPresupuesto(
  config: QuoteConfig,
  _prodActual?: ProductoCatalogo | null,
  matriz: MatrizSerie20Data = MATRIZ_SERIE_20_BASE
): QuoteBreakdown {
  const infoColor = COLORES[config.color] || COLORES['natural'];

  const anchoNum = parseFloat(config.ancho);
  const altoNum = parseFloat(config.alto);
  const tieneAncho = !isNaN(anchoNum) && anchoNum > 0;
  const tieneAlto = !isNaN(altoNum) && altoNum > 0;

  let costoColocacionTexto = 'Retiro en taller (Gral. Flores 2979)';
  if (config.conColocacion) {
    costoColocacionTexto = 'A coordinar en obra en Montevideo';
  }

  let medidaTexto = 'A convenir / Medidas a definir';
  let moduloEstandarTexto: string | undefined = undefined;
  let fueraDeRango = false;

  let precioCalculadoTexto = '$ 3.920 UYU (mínimo 60x40 cm)';
  let precioListaTexto = '';
  let tieneDescuento = false;
  let descuentoPorcentaje = 0;
  let descuentoMontoTexto = '';

  if (tieneAncho && tieneAlto) {
    const lookup = buscarPrecioEnMatriz(anchoNum, altoNum, matriz);

    if (lookup.fueraDeRango || lookup.precio === null) {
      fueraDeRango = true;
      medidaTexto = `${config.ancho.trim()} cm Ancho x ${config.alto.trim()} cm Alto (Medida Especial)`;
      moduloEstandarTexto = lookup.mensajeRango || 'Combinación fuera de estándar Serie 20';
      precioCalculadoTexto = 'A convenir / Consultar taller';
    } else {
      if (lookup.esExacto) {
        medidaTexto = `${config.ancho.trim()} cm Ancho x ${config.alto.trim()} cm Alto`;
        moduloEstandarTexto = `Módulo estándar ${lookup.anchoStd}x${lookup.altoStd} mm`;
      } else {
        medidaTexto = `${config.ancho.trim()} cm Ancho x ${config.alto.trim()} cm Alto`;
        moduloEstandarTexto = `Cotizado según módulo estándar más próximo: ${lookup.anchoStd / 10}x${lookup.altoStd / 10} cm (${lookup.anchoStd}x${lookup.altoStd} mm)`;
      }

      let subtotal = lookup.precio;
      const subtotalLista = subtotal;
      precioListaTexto = `$ ${subtotalLista.toLocaleString('es-UY')} UYU`;

      // Evaluar bonificación manual (%)
      const descInput = parseFloat((config.descuento || '').replace(/[^0-9.]/g, ''));
      if (!isNaN(descInput) && descInput > 0 && descInput <= 100) {
        tieneDescuento = true;
        descuentoPorcentaje = descInput;
        const montoDescuento = Math.round(subtotalLista * (descInput / 100));
        subtotal = subtotalLista - montoDescuento;
        descuentoMontoTexto = `-$ ${montoDescuento.toLocaleString('es-UY')} UYU`;
      }

      precioCalculadoTexto = tieneDescuento
        ? `Desde $ ${subtotal.toLocaleString('es-UY')} UYU (Bonif.)`
        : `Desde $ ${subtotal.toLocaleString('es-UY')} UYU (Lista)`;
    }
  } else if (tieneAncho) {
    medidaTexto = `${config.ancho.trim()} cm Ancho (Alto a definir)`;
    precioCalculadoTexto = 'A definir según altura';
  } else if (tieneAlto) {
    medidaTexto = `${config.alto.trim()} cm Alto (Ancho a definir)`;
    precioCalculadoTexto = 'A definir según ancho';
  } else {
    medidaTexto = 'Medidas estándar de catálogo (A convenir)';
    precioCalculadoTexto = '$ 3.920 UYU (Base mín. 60x40 cm)';
  }

  return {
    medidaTexto,
    moduloEstandarTexto,
    fueraDeRango,
    ancho: config.ancho,
    alto: config.alto,
    serieNombre: 'Serie 20',
    colorNombre: infoColor.nombre,
    vidrioNombre: CRISTAL_OFICIAL,
    conColocacion: config.conColocacion,
    costoColocacionTexto,
    precioTexto: precioCalculadoTexto,
    tieneDescuento,
    descuentoPorcentaje,
    descuentoMontoTexto,
    precioListaTexto,
    vigenciaDias: DATOS_EMPRESA.vigenciaDias,
  };
}

export function generarTextoWhatsApp(breakdown: QuoteBreakdown, productoNombre?: string): string {
  const nombreAbertura = productoNombre || 'Ventana Corrediza Serie 20';

  const lineasConsulta = [
    `*CONSULTA DE COTIZACIÓN - CD ALUMINIO*`,
    `Gral. Flores 2979, Montevideo`,
    `----------------------------------------`,
    `*Producto:* ${nombreAbertura}`,
    `*Línea / Serie:* Serie 20`,
    `*Color:* ${breakdown.colorNombre}`,
    `*Medidas:* ${breakdown.medidaTexto}`,
  ];

  if (breakdown.moduloEstandarTexto) {
    lineasConsulta.push(`*Módulo Taller:* ${breakdown.moduloEstandarTexto}`);
  }

  lineasConsulta.push(`*Cristal:* ${breakdown.vidrioNombre}`);
  lineasConsulta.push(`*Instalación:* ${breakdown.conColocacion ? 'Con colocación en obra' : 'Retiro en taller'}`);

  if (breakdown.tieneDescuento) {
    lineasConsulta.push(`*Precio de lista oficial:* ${breakdown.precioListaTexto}`);
    lineasConsulta.push(`*Bonificación especial de taller:* -${breakdown.descuentoPorcentaje}% (${breakdown.descuentoMontoTexto})`);
    lineasConsulta.push(`*Total bonificado:* ${breakdown.precioTexto}`);
  } else {
    lineasConsulta.push(`*Estimación oficial:* ${breakdown.precioTexto}`);
  }

  lineasConsulta.push(`----------------------------------------`);
  lineasConsulta.push(`_Nota: Presupuesto referencial de taller sujeto a validación técnica de escuadría en obra._`);
  lineasConsulta.push(`Hola CD Aluminio, les envío esta configuración para coordinar rectificación y presupuesto formal. Aguardo su respuesta.`);

  return encodeURIComponent(lineasConsulta.join('\n'));
}
