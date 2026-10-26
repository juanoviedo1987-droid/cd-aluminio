import type { ProductoCatalogo } from '../data/pricingData';
import { PRODUCTO_EJEMPLO_TEST } from '../data/pricingData';

export const GOOGLE_SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/1CwBvdnMt_JMOejCKHwH0PKnMOaRHw3c4cKXxEDaHgWQ/export?format=csv&gid=480036493';

// Función robusta para parsear líneas de CSV respetando comillas y delimitador regional
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
    const urlConCacheBuster = `${GOOGLE_SHEET_CSV_URL}&_t=${Date.now()}`;
    const res = await fetch(urlConCacheBuster, {
      cache: 'no-cache',
    });

    if (!res.ok) {
      console.warn(`[Google Sheets] Respuesta HTTP (${res.status}). Usando producto test de fallback.`);
      return [PRODUCTO_EJEMPLO_TEST];
    }

    const csvText = await res.text();
    const filas = parsearCSVLineas(csvText);

    if (filas.length < 2) {
      return [PRODUCTO_EJEMPLO_TEST];
    }

    const productosCargados: ProductoCatalogo[] = [];

    // Fila 0 = Encabezados
    // Se mapea de forma flexible:
    // [0] ID (opcional o generado), [1] Nombre, [2] Categoría, [5 o siguiente] Precio, [9 o estado] Estado, [10 o notas] Nota
    for (let i = 1; i < filas.length; i++) {
      const col = filas[i];
      if (!col || col.length < 2) continue;

      const rawId = col[0]?.trim() || `prod-${i}`;
      const nombre = col[1]?.trim();
      if (!nombre) continue; // Si no tiene nombre de producto, ignorar fila

      const categoria = col[2]?.trim() || 'General';

      // Buscar columna de precio (si hay columna 5 o número en la fila)
      let precioRaw = col[5] ? col[5].replace(/[$. ,]/g, '').trim() : '';
      if (!precioRaw && col[2] && !isNaN(Number(col[2].replace(/[$. ,]/g, '').trim()))) {
        // En caso de que la planilla tenga solo [ID, Nombre, Precio]
        precioRaw = col[2].replace(/[$. ,]/g, '').trim();
      }
      const precioNum = precioRaw && !isNaN(Number(precioRaw)) ? Number(precioRaw) : null;

      // Buscar columna de estado (ACTIVO / PAUSADO)
      let estado = 'ACTIVO';
      for (const campo of col) {
        const campoUpper = (campo || '').toUpperCase().trim();
        if (campoUpper === 'PAUSADO' || campoUpper === 'INACTIVO' || campoUpper === 'NO') {
          estado = 'PAUSADO';
          break;
        }
      }

      const activo = estado !== 'PAUSADO';
      const nota = col[10]?.trim() || '';

      let precioTexto = 'A Convenir / Consultar';
      if (precioNum !== null && precioNum > 0) {
        precioTexto = `$ ${precioNum.toLocaleString('es-UY')} UYU`;
      }

      productosCargados.push({
        id: rawId,
        nombre,
        categoria,
        precioBase: precioNum,
        precioTexto,
        activo,
        nota: nota || undefined,
      });
    }

    return productosCargados.length > 0 ? productosCargados : [PRODUCTO_EJEMPLO_TEST];
  } catch (error) {
    console.warn('[Google Sheets] Error al cargar catálogo en vivo:', error);
    return [PRODUCTO_EJEMPLO_TEST];
  }
}
