import type { ProductoCatalogo } from '../data/pricingData';
import { PRODUCTO_EJEMPLO_TEST } from '../data/pricingData';

export const SHEET_CATALOGO_CSV_URL =
  'https://docs.google.com/spreadsheets/d/1CwBvdnMt_JMOejCKHwH0PKnMOaRHw3c4cKXxEDaHgWQ/export?format=csv&gid=480036493';

export const SHEET_FACTORES_CSV_URL =
  'https://docs.google.com/spreadsheets/d/1CwBvdnMt_JMOejCKHwH0PKnMOaRHw3c4cKXxEDaHgWQ/export?format=csv&gid=1358754395';

export interface FactoresTaller {
  recargosSerie: Record<string, number>; // Ej: { 'S25': 0.40, 'A82': 0.35, 'PROBBA': 0.45, 'GALA_CR': 0.65 }
  recargosColor: Record<string, number>; // Ej: { 'anolok': 0.20, 'electrostatica': 0.20 }
  motorizacion: number; // 12800
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

export async function cargarCatalogoDesdeGoogleSheets(): Promise<ProductoCatalogo[]> {
  try {
    const url = `${SHEET_CATALOGO_CSV_URL}&_t=${Date.now()}`;
    const res = await fetch(url, { cache: 'no-cache' });

    if (!res.ok) return [PRODUCTO_EJEMPLO_TEST];

    const csvText = await res.text();
    const filas = parsearCSVLineas(csvText);

    if (filas.length < 2) return [PRODUCTO_EJEMPLO_TEST];

    const productos: ProductoCatalogo[] = [];

    // Encabezados: [0] ID, [1] Producto, [2] Categoría, [3] Tipo Cálculo (Unidad/m2), [4] Precio Base, [5] Estado, [6] Notas
    for (let i = 1; i < filas.length; i++) {
      const col = filas[i];
      if (!col || col.length < 2) continue;

      const rawId = col[0]?.trim() || `prod-${i}`;
      const nombre = col[1]?.trim();
      if (!nombre) continue;

      const categoria = col[2]?.trim() || 'General';
      const esPorM2 = (col[3]?.trim().toLowerCase() === 'm2');

      const precioRaw = col[4] ? col[4].replace(/[$. ,]/g, '').trim() : '';
      const precioNum = precioRaw && !isNaN(Number(precioRaw)) ? Number(precioRaw) : null;

      const estado = col[5] ? col[5].toUpperCase().trim() : 'ACTIVO';
      const activo = estado !== 'PAUSADO' && estado !== 'INACTIVO' && estado !== 'NO';
      const nota = col[6]?.trim() || '';

      let precioTexto = 'A Convenir / Consultar';
      if (precioNum !== null && precioNum > 0) {
        precioTexto = esPorM2 ? `$ ${precioNum.toLocaleString('es-UY')} UYU / m²` : `$ ${precioNum.toLocaleString('es-UY')} UYU`;
      }

      productos.push({
        id: rawId,
        nombre,
        categoria,
        esPorM2,
        precioBase: precioNum,
        precioTexto,
        activo,
        nota: nota || undefined,
      });
    }

    return productos.length > 0 ? productos : [PRODUCTO_EJEMPLO_TEST];
  } catch (error) {
    console.warn('[Google Sheets] Error al cargar catálogo:', error);
    return [PRODUCTO_EJEMPLO_TEST];
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
