const { execSync } = require('child_process');

const SPREADSHEET_ID = '1CwBvdnMt_JMOejCKHwH0PKnMOaRHw3c4cKXxEDaHgWQ';
const gsheetsCmd = 'C:\\Users\\juano\\.gemini\\config\\plugins\\gsheets\\skills\\gsheets\\scripts\\gsheets.cmd';

const sheets = [
  { id: 0, title: '0. Instructivo de Uso', cols: 3, rows: 6 },
  { id: 480036493, title: '1. Catálogo y Precios Base', cols: 11, rows: 24 },
  { id: 1358754395, title: '2. Recargos y Factores', cols: 6, rows: 21 },
  { id: 1172107161, title: '3. Historial de Cotizaciones', cols: 11, rows: 2 }
];

console.log('--- APLICANDO FORMATO PREMIUM CD ALUMINIO EN LA NUBE ---');

sheets.forEach(s => {
  console.log(`Formateando hoja: ${s.title}...`);

  // 1. Encabezados: Fondo Negro #18181B, Texto Blanco Bold, Centrado
  const formatHeaderCmd = `"${gsheetsCmd}" mutate format ${SPREADSHEET_ID} --sheet-id ${s.id} --start-row 0 --end-row 1 --start-col 0 --end-col ${s.cols} --bg-color "#18181B" --fg-color "#FFFFFF" --bold --align CENTER`;
  try {
    execSync(formatHeaderCmd);
  } catch (e) {
    console.error(`Error en encabezado ${s.title}:`, e.message);
  }

  // 2. Inmovilizar fila 1
  const freezeCmd = `"${gsheetsCmd}" mutate freeze ${SPREADSHEET_ID} --sheet-id ${s.id} --rows 1`;
  try {
    execSync(freezeCmd);
  } catch (e) {
    console.error(`Error en freeze ${s.title}:`, e.message);
  }

  // 3. Auto-ajustar ancho de columnas
  const autosizeCmd = `"${gsheetsCmd}" mutate autosize ${SPREADSHEET_ID} --sheet-id ${s.id} --start-col 0 --end-col ${s.cols}`;
  try {
    execSync(autosizeCmd);
  } catch (e) {
    console.error(`Error en autosize ${s.title}:`, e.message);
  }
});

// Resaltar en Naranja la columna de Precios (columna F / índice 5) en la hoja de Catálogo
console.log('Resaltando columna de precios para el cliente...');
try {
  // Fondo suave para la columna de precios que el cliente debe completar
  execSync(`"${gsheetsCmd}" mutate format ${SPREADSHEET_ID} --sheet-id 480036493 --start-row 1 --end-row 24 --start-col 5 --end-col 6 --bg-color "#FFF7ED" --align RIGHT`);
} catch (e) {
  console.error('Error resaltando columna precios:', e.message);
}

console.log('🎉 Hoja de Google Sheets formateada con éxito total en la nube.');
