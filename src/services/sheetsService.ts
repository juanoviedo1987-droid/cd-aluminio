export interface PreciosEnVivo {
  [productId: string]: {
    precioBase: number | null;
    precioTexto: string;
    unidad: string;
    plazo: string;
    activo: boolean;
    notas: string;
  };
}

export const GOOGLE_SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/1CwBvdnMt_JMOejCKHwH0PKnMOaRHw3c4cKXxEDaHgWQ/export?format=csv&gid=480036493';

// Mapeo entre ID del Excel/Google Sheets y el id del frontend
export const MAPA_ID_EXCEL_A_APP: Record<string, string> = {
  'V-CORR-2H': 'ventana-corrediza-2h',
  'V-CORR-3H': 'ventana-corrediza-3h',
  'V-CORR-4H': 'ventana-corrediza-4h',
  'V-PANO-FIJO': 'pano-fijo',
  'V-BATIENTE': 'ventana-batiente',
  'V-TABAQUERA': 'ventana-tabaquera',
  'V-PROYECTANTE': 'ventana-proyectante',
  'V-GUILLOTINA': 'ventana-guillotina',
  'ESP-BAJO-BAT': 'bajo-mesada-batiente',
  'ESP-BAJO-CORR': 'bajo-mesada-corredizo',
  'P-MITAD-VIDRIO': 'puerta-mitad-vidrio',
  'P-CIEGA': 'puerta-ciega',
  'P-CRISTAL': 'puerta-cristal',
  'P-GRANERO': 'puerta-granero',
  'SIS-MONO-PVC': 'monoblock-pvc',
  'SIS-MONO-ALU': 'monoblock-aluminio',
  'MAMP-CRISTAL': 'mampara-cristal',
  'MAMP-ACRILICO': 'mampara-acrilico',
  'ESP-BARANDA': 'baranda-aluminio',
  'SIS-ROLLERS': 'cortina-roller',
  'ESP-TECHO-FIJO': 'techo-fijo',
  'ESP-TECHO-AUTO': 'techo-automatizado',
  'ESP-HERRERIA': 'herreria-diseno',
};

// Función robusta para parsear líneas de CSV respetando comillas y detectando delimitador (, o ;)
function parsearCSVLineas(textoCSV: string): string[][] {
  const lineas: string[][] = [];
  const filas = textoCSV.split(/\r?\n/);
  if (filas.length === 0) return lineas;

  // Detectar delimitador según la cabecera (, o ;)
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
          i++; // saltar comilla escapada
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

export async function sincronizarPreciosGoogleSheets(): Promise<PreciosEnVivo> {
  try {
    const res = await fetch(GOOGLE_SHEET_CSV_URL, {
      cache: 'no-cache',
    });

    if (!res.ok) {
      console.warn(`[Google Sheets] Respuesta HTTP no exitosa (${res.status}). Usando fallback local.`);
      return {};
    }

    const csvText = await res.text();
    const filas = parsearCSVLineas(csvText);

    if (filas.length < 2) return {};

    const mapaPrecios: PreciosEnVivo = {};

    // Fila 0 son encabezados:
    // [0] ID Producto, [1] Nombre, [2] Categoría, [3] Series, [4] Cristales,
    // [5] Precio Base Taller ($ UYU), [6] Unidad, [7] Plazo, [8] Requiere Medición, [9] Estado en App, [10] Notas
    for (let i = 1; i < filas.length; i++) {
      const col = filas[i];
      const excelId = col[0];
      const appId = MAPA_ID_EXCEL_A_APP[excelId] || excelId;

      const precioRaw = col[5] ? col[5].replace(/[$. ,]/g, '').trim() : '';
      const precioNum = precioRaw && !isNaN(Number(precioRaw)) ? Number(precioRaw) : null;
      const unidad = col[6] || 'Unidad';
      const plazo = col[7] || '7 a 10 días';
      const estado = col[9] ? col[9].toUpperCase().trim() : 'ACTIVO';
      const notas = col[10] || '';

      const activo = estado !== 'PAUSADO' && estado !== 'INACTIVO' && estado !== 'NO';

      let precioTexto = 'A Convenir / Consultar';
      if (precioNum !== null && precioNum > 0) {
        precioTexto = `$ ${precioNum.toLocaleString('es-UY')} UYU`;
      }

      mapaPrecios[appId] = {
        precioBase: precioNum,
        precioTexto,
        unidad,
        plazo,
        activo,
        notas,
      };
    }

    return mapaPrecios;
  } catch (error) {
    console.warn('[Google Sheets] Error al sincronizar catálogo en vivo:', error);
    return {};
  }
}
