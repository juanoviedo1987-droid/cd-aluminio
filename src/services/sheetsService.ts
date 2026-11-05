import type { ProductoCatalogo } from '../data/pricingData';
import { PRODUCTO_VENTANA_SERIE_20 } from '../data/pricingData';
import { MATRIZ_SERIE_20_BASE, type MatrizSerie20Data } from '../data/matrizSerie20';

export const SHEET_CATALOGO_CSV_URL =
  'https://docs.google.com/spreadsheets/d/1CwBvdnMt_JMOejCKHwH0PKnMOaRHw3c4cKXxEDaHgWQ/export?format=csv&gid=480036493';

export const SHEET_FACTORES_CSV_URL =
  'https://docs.google.com/spreadsheets/d/1CwBvdnMt_JMOejCKHwH0PKnMOaRHw3c4cKXxEDaHgWQ/export?format=csv&gid=1358754395';

export interface FactoresTaller {
  recargosSerie: Record<string, number>;
  recargosColor: Record<string, number>;
  motorizacion: number;
}

export const FACTORES_POR_DEFECTO: FactoresTaller = {
  recargosSerie: {
    S20: 0,
    S25: 0.40,
    A82: 0.35,
    PROBBA: 0.45,
    GALA_CR: 0.65,
    ESPECIAL: 0,
  },
  recargosColor: {
    natural: 0,
    blanco: 0,
    negro: 0,
    anolok: 0.20,
    electrostatica: 0.20,
  },
  motorizacion: 12800,
};

function parsearCSVLineas(textoCSV: string): string[][] {
  const lineas: string[][] = [];
  const filas = textoCSV.split(/\r?\n/);
  if (filas.length === 0) return lineas;

  const primeraFila = filas[0] || '';
  const cantComas = (primeraFila.match(/,/g) || []).length;
  const cantPuntosComa = (primeraFila.match(/;/g) || []).length;
  const separador = cantPuntosComa > cantComas ? ';' : ',';

  for (const fila of filas) {
    if (!fila.trim()) continue;
    const columnas: string[] = [];
    let valorActual = '';
    let dentroDeComillas = false;

    for (let i = 0; i < fila.length; i++) {
      const char = fila[i];
      if (char === '"') {
        if (dentroDeComillas && fila[i + 1] === '"') {
          valorActual += '"';
          i++;
        } else {
          dentroDeComillas = !dentroDeComillas;
        }
      } else if (char === separador && !dentroDeComillas) {
        columnas.push(valorActual.trim());
        valorActual = '';
      } else {
        valorActual += char;
      }
    }
    columnas.push(valorActual.trim());
    lineas.push(columnas);
  }

  return lineas;
}

function parseCurrencyString(val: string): number {
  if (!val) return 0;
  let s = val.replace(/[$ ]/g, '').trim();
  if (/\.\d{2}$/.test(s) || /,\d{2}$/.test(s)) {
    s = s.slice(0, -3);
  }
  const num = parseInt(s.replace(/[^\d]/g, ''), 10);
  return isNaN(num) ? 0 : num;
}

/**
 * Parsea el Catálogo y Precios tanto en formato Tabular (Lista vertical) como en Matriz Doble Entrada
 */
export function parsearMatrizSerie20CSV(textoCSV: string): MatrizSerie20Data | null {
  try {
    const filas = parsearCSVLineas(textoCSV);
    if (filas.length < 2) return null;

    const filaEncabezados = filas[0];

    // FORMATO A: Tabular Lista (ID, Producto, Serie, Ancho, Alto, Medida, Precio, Estado, Notas)
    const idxAncho = filaEncabezados.findIndex(h => h.toLowerCase().includes('ancho'));
    const idxAlto = filaEncabezados.findIndex(h => h.toLowerCase().includes('alto'));
    const idxPrecio = filaEncabezados.findIndex(h => h.toLowerCase().includes('precio'));
    const idxEstado = filaEncabezados.findIndex(h => h.toLowerCase().includes('estado'));

    if (idxAncho >= 0 && idxAlto >= 0 && idxPrecio >= 0) {
      const anchosSet = new Set<number>();
      const altosSet = new Set<number>();
      const precios: Record<string, number> = {};

      for (let f = 1; f < filas.length; f++) {
        const fila = filas[f];
        if (!fila || fila.length <= Math.max(idxAncho, idxAlto, idxPrecio)) continue;

        const estado = idxEstado >= 0 ? (fila[idxEstado] || '').toUpperCase() : 'ACTIVO';
        if (estado === 'PAUSADO' || estado === 'INACTIVO' || estado === 'NO') continue;

        let anchoNum = parseInt((fila[idxAncho] || '').replace(/[^\d]/g, ''), 10);
        let altoNum = parseInt((fila[idxAlto] || '').replace(/[^\d]/g, ''), 10);
        const precioNum = parseCurrencyString(fila[idxPrecio] || '');

        if (!isNaN(anchoNum) && !isNaN(altoNum) && !isNaN(precioNum) && precioNum > 0) {
          // Si están en cm (< 300), convertimos a mm para el motor interno de la app
          if (anchoNum < 300) anchoNum = anchoNum * 10;
          if (altoNum < 300) altoNum = altoNum * 10;

          anchosSet.add(anchoNum);
          altosSet.add(altoNum);
          precios[`${anchoNum}x${altoNum}`] = precioNum;
        }
      }

      if (Object.keys(precios).length > 0) {
        return {
          anchos: Array.from(anchosSet).sort((a, b) => a - b),
          altos: Array.from(altosSet).sort((a, b) => a - b),
          precios,
        };
      }
    }

    // FORMATO B: Matriz Cruzada (Alto en col 0, Anchos en encabezados)
    const anchos: number[] = [];
    const anchosIndex: { colIndex: number; ancho: number }[] = [];

    for (let col = 1; col < filaEncabezados.length; col++) {
      const raw = filaEncabezados[col] || '';
      const num = parseInt(raw.replace(/[^\d]/g, ''), 10);
      if (!isNaN(num) && num > 0) {
        anchos.push(num);
        anchosIndex.push({ colIndex: col, ancho: num });
      }
    }

    if (anchos.length > 0) {
      const altos: number[] = [];
      const precios: Record<string, number> = {};

      for (let f = 1; f < filas.length; f++) {
        const fila = filas[f];
        if (!fila || fila.length === 0) continue;

        const rawAlto = fila[0] || '';
        const altoNum = parseInt(rawAlto.replace(/[^\d]/g, ''), 10);
        if (isNaN(altoNum) || altoNum <= 0) continue;

        altos.push(altoNum);

        for (const item of anchosIndex) {
          const rawPrecio = fila[item.colIndex] || '';
          const precioLimpio = parseInt(rawPrecio.replace(/[^\d]/g, ''), 10);
          if (!isNaN(precioLimpio) && precioLimpio > 0) {
            precios[`${item.ancho}x${altoNum}`] = precioLimpio;
          }
        }
      }

      if (Object.keys(precios).length > 0) {
        return {
          anchos: anchos.sort((a, b) => a - b),
          altos: altos.sort((a, b) => a - b),
          precios,
        };
      }
    }

    return null;
  } catch (err) {
    console.warn('[Google Sheets] Error al procesar catálogo/matriz CSV:', err);
    return null;
  }
}

export async function cargarMatrizSerie20DesdeGoogleSheets(): Promise<MatrizSerie20Data> {
  try {
    const url = `${SHEET_CATALOGO_CSV_URL}&_t=${Date.now()}`;
    const res = await fetch(url, { cache: 'no-cache' });
    if (!res.ok) return MATRIZ_SERIE_20_BASE;

    const csvText = await res.text();
    const matrizParseada = parsearMatrizSerie20CSV(csvText);

    return matrizParseada || MATRIZ_SERIE_20_BASE;
  } catch (error) {
    console.warn('[Google Sheets] Error al cargar matriz desde Sheet, usando local:', error);
    return MATRIZ_SERIE_20_BASE;
  }
}

export async function cargarCatalogoDesdeGoogleSheets(): Promise<ProductoCatalogo[]> {
  try {
    const url = `${SHEET_CATALOGO_CSV_URL}&_t=${Date.now()}`;
    const res = await fetch(url, { cache: 'no-cache' });
    if (!res.ok) return [PRODUCTO_VENTANA_SERIE_20];

    const csvText = await res.text();
    const filas = parsearCSVLineas(csvText);
    if (filas.length < 2) return [PRODUCTO_VENTANA_SERIE_20];

    const filaEncabezados = filas[0];
    const idxProducto = filaEncabezados.findIndex(h => h.toLowerCase() === 'producto');
    const idxSerie = filaEncabezados.findIndex(h => h.toLowerCase().includes('serie') || h.toLowerCase().includes('línea'));
    const idxPrecio = filaEncabezados.findIndex(h => h.toLowerCase().includes('precio'));
    const idxEstado = filaEncabezados.findIndex(h => h.toLowerCase().includes('estado'));

    if (idxProducto >= 0) {
      const productosMap = new Map<string, { nombre: string; serie?: string; precioMin: number }>();

      for (let f = 1; f < filas.length; f++) {
        const fila = filas[f];
        if (!fila) continue;

        const estado = idxEstado >= 0 ? (fila[idxEstado] || '').toUpperCase() : 'ACTIVO';
        if (estado === 'PAUSADO' || estado === 'INACTIVO' || estado === 'NO') continue;

        const prodNombre = fila[idxProducto]?.trim();
        if (!prodNombre) continue;

        const serie = idxSerie >= 0 ? fila[idxSerie]?.trim() : '';
        const clave = `${prodNombre}${serie ? ' ' + serie : ''}`;

        const precioNum = idxPrecio >= 0 ? parseCurrencyString(fila[idxPrecio] || '') : 0;

        if (!productosMap.has(clave)) {
          productosMap.set(clave, {
            nombre: clave,
            serie,
            precioMin: isNaN(precioNum) || precioNum <= 0 ? 3920 : precioNum,
          });
        } else if (!isNaN(precioNum) && precioNum > 0) {
          const actual = productosMap.get(clave)!;
          if (precioNum < actual.precioMin) {
            actual.precioMin = precioNum;
          }
        }
      }

      if (productosMap.size > 0) {
        const resultado: ProductoCatalogo[] = [];
        let index = 1;
        for (const [clave, item] of productosMap.entries()) {
          resultado.push({
            id: `prod-${index++}`,
            nombre: clave,
            categoria: 'Aberturas',
            precioBase: item.precioMin,
            precioTexto: `Desde $ ${item.precioMin.toLocaleString('es-UY')} UYU`,
            activo: true,
            nota: 'Precios oficiales de taller según medidas estándar',
          });
        }
        return resultado;
      }
    }

    return [PRODUCTO_VENTANA_SERIE_20];
  } catch {
    return [PRODUCTO_VENTANA_SERIE_20];
  }
}

export async function cargarFactoresDesdeGoogleSheets(): Promise<FactoresTaller> {
  try {
    const url = `${SHEET_FACTORES_CSV_URL}&_t=${Date.now()}`;
    const res = await fetch(url, { cache: 'no-cache' });

    if (!res.ok) return FACTORES_POR_DEFECTO;

    const csvText = await res.text();
    const filas = parsearCSVLineas(csvText);

    if (filas.length < 2) return FACTORES_POR_DEFECTO;

    const factores: FactoresTaller = {
      recargosSerie: { ...FACTORES_POR_DEFECTO.recargosSerie },
      recargosColor: { ...FACTORES_POR_DEFECTO.recargosColor },
      motorizacion: FACTORES_POR_DEFECTO.motorizacion,
    };

    // Fila: [0] Categoría, [1] Elemento, [2] Tipo, [3] Valor Numérico
    for (let i = 1; i < filas.length; i++) {
      const col = filas[i];
      const elemento = (col[1] || '').trim();
      const valorNum = parseFloat((col[3] || '0').replace(',', '.'));

      if (isNaN(valorNum)) continue;

      if (elemento.includes('Serie 25')) factores.recargosSerie['S25'] = valorNum / 100;
      else if (elemento.includes('A82')) factores.recargosSerie['A82'] = valorNum / 100;
      else if (elemento.includes('Probba')) factores.recargosSerie['PROBBA'] = valorNum / 100;
      else if (elemento.includes('Gala')) factores.recargosSerie['GALA_CR'] = valorNum / 100;
      else if (elemento.includes('Anolock')) factores.recargosColor['anolok'] = valorNum / 100;
      else if (elemento.includes('electrostática')) factores.recargosColor['electrostatica'] = valorNum / 100;
      else if (elemento.includes('Motorización')) factores.motorizacion = valorNum;
    }

    return factores;
  } catch (error) {
    console.warn('[Google Sheets] Error al cargar factores:', error);
    return FACTORES_POR_DEFECTO;
  }
}
