const { execSync } = require('child_process');

const SPREADSHEET_ID = '1CwBvdnMt_JMOejCKHwH0PKnMOaRHw3c4cKXxEDaHgWQ';
const gsheetsCmd = 'C:\\Users\\juano\\.gemini\\config\\plugins\\gsheets\\skills\\gsheets\\scripts\\gsheets.cmd';

console.log('=== APLICANDO PULIDO VISUAL DE ALTA GAMA EN GOOGLE SHEETS ===');

function run(cmd, desc) {
  try {
    execSync(cmd);
    if (desc) console.log('✓ ' + desc);
  } catch (err) {
    console.error('✗ Error en ' + desc + ':', err.message);
  }
}

// ----------------------------------------------------
// HOJA 0: 0. Instructivo de Uso (ID: 0)
// ----------------------------------------------------
console.log('\n--- 1. Pulido de Hoja 0 (Instructivo de Uso) ---');
// Anchos de columna cómodos para lectura
run(`"${gsheetsCmd}" mutate set-col-width ${SPREADSHEET_ID} --sheet-id 0 --start-col 0 --end-col 1 --pixels 200`, 'Columna A (Paso): 200px');
run(`"${gsheetsCmd}" mutate set-col-width ${SPREADSHEET_ID} --sheet-id 0 --start-col 1 --end-col 2 --pixels 480`, 'Columna B (Instrucción): 480px');
run(`"${gsheetsCmd}" mutate set-col-width ${SPREADSHEET_ID} --sheet-id 0 --start-col 2 --end-col 3 --pixels 420`, 'Columna C (Impacto): 420px');

// Ajuste de texto (Wrap) en todo el instructivo
run(`"${gsheetsCmd}" mutate format ${SPREADSHEET_ID} --sheet-id 0 --start-row 1 --end-row 7 --start-col 0 --end-col 3 --wrap --align LEFT`, 'Ajuste de texto automático (Wrap)');
// Bordes sutiles
run(`"${gsheetsCmd}" mutate borders ${SPREADSHEET_ID} --sheet-id 0 --start-row 0 --end-row 7 --start-col 0 --end-col 3 --color "0.85,0.85,0.85"`, 'Bordes de celdas instructivo');

// ----------------------------------------------------
// HOJA 1: 1. Catálogo y Precios Base (ID: 480036493)
// ----------------------------------------------------
console.log('\n--- 2. Pulido de Hoja 1 (Catálogo y Precios) ---');
const colWidthsSheet1 = [
  { col: 0, px: 130, name: 'ID Producto' },
  { col: 1, px: 300, name: 'Nombre Producto' },
  { col: 2, px: 120, name: 'Categoría' },
  { col: 3, px: 250, name: 'Series Compatibles' },
  { col: 4, px: 260, name: 'Cristales Compatibles' },
  { col: 5, px: 210, name: 'Precio Base Taller ($ UYU)' }, // Columna Clave
  { col: 6, px: 130, name: 'Unidad' },
  { col: 7, px: 140, name: 'Plazo Estimado' },
  { col: 8, px: 150, name: 'Medición en Obra' },
  { col: 9, px: 110, name: 'Estado' },
  { col: 10, px: 320, name: 'Notas de Taller' },
];

colWidthsSheet1.forEach(c => {
  run(`"${gsheetsCmd}" mutate set-col-width ${SPREADSHEET_ID} --sheet-id 480036493 --start-col ${c.col} --end-col ${c.col + 1} --pixels ${c.px}`, `Ancho ${c.name}: ${c.px}px`);
});

// Ajuste de texto en columnas largas
run(`"${gsheetsCmd}" mutate format ${SPREADSHEET_ID} --sheet-id 480036493 --start-row 1 --end-row 25 --start-col 0 --end-col 11 --wrap`, 'Wrap de texto en catálogo');
// Bordes generales en catálogo
run(`"${gsheetsCmd}" mutate borders ${SPREADSHEET_ID} --sheet-id 480036493 --start-row 0 --end-row 25 --start-col 0 --end-col 11 --color "0.88,0.88,0.88"`, 'Bordes en catálogo');

// Resaltado llamativo para la Columna F (Precio Base Taller) que el cliente debe llenar
// Fondo suave anaranjado (#FFF7ED) con alineación derecha
run(`"${gsheetsCmd}" mutate format ${SPREADSHEET_ID} --sheet-id 480036493 --start-row 1 --end-row 25 --start-col 5 --end-col 6 --bg-color "#FFF7ED" --fg-color "#9A3412" --bold --align RIGHT`, 'Columna F (Precio Base) destacada en Naranja suave para el cliente');

// Centrar columnas clave de catálogo (ID, Categoría, Unidad, Plazo, Medición, Estado)
run(`"${gsheetsCmd}" mutate format ${SPREADSHEET_ID} --sheet-id 480036493 --start-row 1 --end-row 25 --start-col 0 --end-col 1 --align CENTER`, 'Centrar ID Producto');
run(`"${gsheetsCmd}" mutate format ${SPREADSHEET_ID} --sheet-id 480036493 --start-row 1 --end-row 25 --start-col 2 --end-col 3 --align CENTER`, 'Centrar Categoría');
run(`"${gsheetsCmd}" mutate format ${SPREADSHEET_ID} --sheet-id 480036493 --start-row 1 --end-row 25 --start-col 6 --end-col 10 --align CENTER`, 'Centrar Unidad, Plazo, Medición y Estado');

// ----------------------------------------------------
// HOJA 2: 2. Recargos y Factores (ID: 1358754395)
// ----------------------------------------------------
console.log('\n--- 3. Pulido de Hoja 2 (Recargos y Factores) ---');
const colWidthsSheet2 = [
  { col: 0, px: 170, name: 'Tipo Parámetro' },
  { col: 1, px: 260, name: 'Nombre Parámetro' },
  { col: 2, px: 180, name: 'Tipo Ajuste' },
  { col: 3, px: 170, name: 'Valor / Porcentaje' },
  { col: 4, px: 380, name: 'Descripción' },
  { col: 5, px: 110, name: 'Activo' },
];

colWidthsSheet2.forEach(c => {
  run(`"${gsheetsCmd}" mutate set-col-width ${SPREADSHEET_ID} --sheet-id 1358754395 --start-col ${c.col} --end-col ${c.col + 1} --pixels ${c.px}`, `Ancho ${c.name}: ${c.px}px`);
});

run(`"${gsheetsCmd}" mutate format ${SPREADSHEET_ID} --sheet-id 1358754395 --start-row 1 --end-row 22 --start-col 0 --end-col 6 --wrap`, 'Wrap en recargos');
run(`"${gsheetsCmd}" mutate borders ${SPREADSHEET_ID} --sheet-id 1358754395 --start-row 0 --end-row 22 --start-col 0 --end-col 6 --color "0.88,0.88,0.88"`, 'Bordes en recargos');
run(`"${gsheetsCmd}" mutate format ${SPREADSHEET_ID} --sheet-id 1358754395 --start-row 1 --end-row 22 --start-col 3 --end-col 4 --align CENTER --bold`, 'Centrar valores de recargo');
run(`"${gsheetsCmd}" mutate format ${SPREADSHEET_ID} --sheet-id 1358754395 --start-row 1 --end-row 22 --start-col 5 --end-col 6 --align CENTER`, 'Centrar estado Activo');

// ----------------------------------------------------
// HOJA 3: 3. Historial de Cotizaciones (ID: 1172107161)
// ----------------------------------------------------
console.log('\n--- 4. Pulido de Hoja 3 (Historial de Cotizaciones) ---');
const colWidthsSheet3 = [
  { col: 0, px: 140, name: 'Nº Presupuesto' },
  { col: 1, px: 160, name: 'Fecha y Hora' },
  { col: 2, px: 180, name: 'Cliente / Contacto' },
  { col: 3, px: 250, name: 'Producto' },
  { col: 4, px: 200, name: 'Línea / Serie' },
  { col: 5, px: 140, name: 'Color' },
  { col: 6, px: 190, name: 'Medidas' },
  { col: 7, px: 220, name: 'Cristal' },
  { col: 8, px: 190, name: 'Colocación' },
  { col: 9, px: 160, name: 'Estado' },
  { col: 10, px: 140, name: 'Total ($ UYU)' },
];

colWidthsSheet3.forEach(c => {
  run(`"${gsheetsCmd}" mutate set-col-width ${SPREADSHEET_ID} --sheet-id 1172107161 --start-col ${c.col} --end-col ${c.col + 1} --pixels ${c.px}`, `Ancho ${c.name}: ${c.px}px`);
});

run(`"${gsheetsCmd}" mutate format ${SPREADSHEET_ID} --sheet-id 1172107161 --start-row 1 --end-row 10 --start-col 0 --end-col 11 --wrap --align CENTER`, 'Alineación y wrap historial');
run(`"${gsheetsCmd}" mutate borders ${SPREADSHEET_ID} --sheet-id 1172107161 --start-row 0 --end-row 10 --start-col 0 --end-col 11 --color "0.88,0.88,0.88"`, 'Bordes historial');

console.log('\n✨ ¡PULIDO VISUAL COMPLETADO CON ÉXITO EN TODAS LAS HOJAS!');
