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

export function parsearMatrizSerie20CSV(textoCSV: string): MatrizSerie20Data | null {
  try {
    const filas = parsearCSVLineas(textoCSV);
    if (filas.length < 2) return null;

    const filaEncabezados = filas[0];
    const anchos: number[] = [];
    const anchosIndex: { colIndex: number; ancho: number }[] = [];

    // Encabezados: [0] es "Alto (mm) / Ancho (mm)", de [1] en adelante son "600 mm", "700 mm", etc.
    for (let col = 1; col < filaEncabezados.length; col++) {
      const raw = filaEncabezados[col] || '';
      const num = parseInt(raw.replace(/[^\d]/g, ''), 10);
      if (!isNaN(num) && num > 0) {
        anchos.push(num);
        anchosIndex.push({ colIndex: col, ancho: num });
      }
    }

    if (anchos.length === 0) return null;

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

    if (Object.keys(precios).length === 0) return null;

    return {
      anchos: anchos.sort((a, b) => a - b),
      altos: altos.sort((a, b) => a - b),
      precios,
    };
  } catch (err) {
    console.warn('[Google Sheets] Error al procesar matriz Serie 20 CSV:', err);
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
  // Enfocado exclusivamente en el producto real: Ventana Corrediza Serie 20
  return [PRODUCTO_VENTANA_SERIE_20];
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
