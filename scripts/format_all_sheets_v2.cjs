const { execSync } = require('child_process');
const fs = require('fs');

const SPREADSHEET_ID = '1CwBvdnMt_JMOejCKHwH0PKnMOaRHw3c4cKXxEDaHgWQ';
const gsheetsCmd = 'C:\\Users\\juano\\.gemini\\config\\plugins\\gsheets\\skills\\gsheets\\scripts\\gsheets.cmd';

function run(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8' });
  } catch (err) {
    console.error(`Error running: ${cmd}\n`, err.message);
  }
}

console.log('=== 1. FORMATEANDO Y ACTUALIZANDO HOJA 1: CATÁLOGO Y PRECIOS ===');
// Renombrar a 1. Catálogo y Precios
run(`"${gsheetsCmd}" mutate rename-sheet ${SPREADSHEET_ID} --sheet-id 480036493 --title "1. Catálogo y Precios"`);

// Limpiar valores previos
run(`"${gsheetsCmd}" mutate clear ${SPREADSHEET_ID} "'1. Catálogo y Precios'!A1:Z500"`);

// Importar el catálogo tabular unificado
run(`"${gsheetsCmd}" mutate import-csv ${SPREADSHEET_ID} catalogo_unificado_serie20.csv --sheet "1. Catálogo y Precios"`);

// Formato encabezado hoja 1
run(`"${gsheetsCmd}" mutate format ${SPREADSHEET_ID} --sheet-id 480036493 --start-row 0 --end-row 1 --start-col 0 --end-col 9 --bg-color "#18181B" --fg-color "#FFFFFF" --bold --align CENTER`);

// Resaltar columna de Precios (columna G / índice 6)
run(`"${gsheetsCmd}" mutate format ${SPREADSHEET_ID} --sheet-id 480036493 --start-row 1 --end-row 225 --start-col 6 --end-col 7 --bg-color "#FFF7ED" --fg-color "#C2410C" --bold --align RIGHT`);

// Inmovilizar fila 1 y congelar columna 0 y 1
run(`"${gsheetsCmd}" mutate freeze ${SPREADSHEET_ID} --sheet-id 480036493 --rows 1 --cols 2`);
run(`"${gsheetsCmd}" mutate autosize ${SPREADSHEET_ID} --sheet-id 480036493 --start-col 0 --end-col 9`);


console.log('=== 2. LIMPIANDO Y FORMATEANDO HOJA 2: RECARGOS Y FACTORES ===');
// CSV limpio para Factores (sin mamparas ni sobrantes)
const factoresRows = [
  ['CATEGORÍA', 'ELEMENTO / OPCIÓN', 'TIPO DE AJUSTE', 'VALOR (%)', 'DESCRIPCIÓN COMERCIAL'],
  ['Línea de Perfilería', 'Serie 20', 'Base Estándar', '0', 'Línea oficial de taller (100% lista matriz)'],
  ['Línea de Perfilería', 'Serie 25', 'Recargo % sobre S20', '40', 'Línea estándar reforzada (+40% sobre S20)'],
  ['Línea de Perfilería', 'Línea A82 (Alta Prestación)', 'Recargo % sobre S25', '35', 'Hermética alta prestación (+35% sobre S25)'],
  ['Línea de Perfilería', 'Línea Probba (Alta Prestación)', 'Recargo % sobre S25', '45', 'Perfilería pesada grandes luces (+45% sobre S25)'],
  ['Línea de Perfilería', 'Línea Gala CR (Alta Prestación)', 'Recargo % sobre Probba', '65', 'Gama arquitectónica con RPT (+65% sobre Probba)'],
  ['Línea de Perfilería', 'Línea Especial / A Medida', 'A Consultar', '0', 'Perfiles y herrajes específicos de diseño'],
  ['Color / Terminación', 'Anodizado Natural', 'Color Base', '0', 'Terminación plata mate tradicional'],
  ['Color / Terminación', 'Blanco', 'Color de Lista', '0', 'Pintura electrostática blanca horneada'],
  ['Color / Terminación', 'Negro', 'Color de Lista', '0', 'Pintura microtexturada negra'],
  ['Color / Terminación', 'Anolock', 'Anodizado Especial', '20', 'Anodizado bronce oscuro (+20%)'],
  ['Color / Terminación', 'Pintura electrostática', 'Color Especial', '20', 'Gama especial a elección (+20%)'],
  ['Colocación en Obra', 'Retiro en Taller', 'Sin Costo', '0', 'Retiro en taller en Gral. Flores 2979'],
  ['Colocación en Obra', 'Colocación en Montevideo', 'A Coordinar', '0', 'Sujeto a validación y rectificación en obra']
];

const factoresCSV = factoresRows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
fs.writeFileSync('factores_limpios.csv', factoresCSV, 'utf8');

run(`"${gsheetsCmd}" mutate clear ${SPREADSHEET_ID} "'2. Recargos y Factores'!A1:Z50"`);
run(`"${gsheetsCmd}" mutate import-csv ${SPREADSHEET_ID} factores_limpios.csv --sheet "2. Recargos y Factores"`);
run(`"${gsheetsCmd}" mutate format ${SPREADSHEET_ID} --sheet-id 1358754395 --start-row 0 --end-row 1 --start-col 0 --end-col 5 --bg-color "#18181B" --fg-color "#FFFFFF" --bold --align CENTER`);
run(`"${gsheetsCmd}" mutate freeze ${SPREADSHEET_ID} --sheet-id 1358754395 --rows 1`);
run(`"${gsheetsCmd}" mutate autosize ${SPREADSHEET_ID} --sheet-id 1358754395 --start-col 0 --end-col 5`);


console.log('=== 3. LIMPIANDO Y FORMATEANDO HOJA 3: HISTORIAL DE COTIZACIONES ===');
const historialRows = [
  ['Nº Presupuesto', 'Fecha y Hora', 'Cliente / Contacto', 'Producto Cotizado', 'Medidas (cm)', 'Línea y Vidrio', 'Precio Lista ($ UYU)', 'Bonificación (%)', 'Total Final ($ UYU)', 'Estado'],
  ['(Ejemplo)', '04/11/2026 15:30', 'Cliente Mostrador / WhatsApp', 'Ventana Corrediza Serie 20', '120 x 100 cm', 'Serie 20 / Cristal 4mm', '$ 8.260', '-20% (-$ 1.652)', '$ 6.608', 'Presupuestado']
];
const historialCSV = historialRows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
fs.writeFileSync('historial_limpio.csv', historialCSV, 'utf8');

run(`"${gsheetsCmd}" mutate clear ${SPREADSHEET_ID} "'3. Historial de Cotizaciones'!A1:Z50"`);
run(`"${gsheetsCmd}" mutate import-csv ${SPREADSHEET_ID} historial_limpio.csv --sheet "3. Historial de Cotizaciones"`);
run(`"${gsheetsCmd}" mutate format ${SPREADSHEET_ID} --sheet-id 1172107161 --start-row 0 --end-row 1 --start-col 0 --end-col 10 --bg-color "#18181B" --fg-color "#FFFFFF" --bold --align CENTER`);
run(`"${gsheetsCmd}" mutate freeze ${SPREADSHEET_ID} --sheet-id 1172107161 --rows 1`);
run(`"${gsheetsCmd}" mutate autosize ${SPREADSHEET_ID} --sheet-id 1172107161 --start-col 0 --end-col 10`);


console.log('=== 4. ACTUALIZANDO HOJA 0: INSTRUCTIVO DE USO ===');
const instructivoRows = [
  ['PASO / TEMA', 'CÓMO FUNCIONA EN CD ALUMINIO', 'RECOMENDACIÓN DEL TALLER'],
  ['1. Modificar Precios Existentes', 'En la pestaña "1. Catálogo y Precios", buscá la fila correspondiente y editá el valor en la columna G (Precio Base).', 'Modificable libremente.'],
  ['2. Agregar Productos Nuevos', 'En la misma pestaña "1. Catálogo y Precios", simplemente agregá nuevas filas abajo con su Producto, Serie, Medidas y Precio. ¡NO hace falta crear hojas nuevas!', 'Todo en una sola tabla unificada.'],
  ['3. Activar o Pausar Productos', 'En la columna H (Estado en Web), poné "ACTIVO" o "PAUSADO" si temporalmente no hay stock de perfiles o accesorios.', 'Control de stock inmediato.'],
  ['4. Ajustar Recargos y Factores', 'En la pestaña "2. Recargos y Factores", podés retocar los porcentajes de Serie 25, A82, Probba o Anolock.', 'Ajuste comercial ágil.'],
  ['5. Actualización en la Web', 'Al modificar la planilla, Google Sheets replica los cambios automáticamente en la aplicación web en unos minutos.', 'Sincronización en la nube.']
];
const instructivoCSV = instructivoRows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
fs.writeFileSync('instructivo_limpio.csv', instructivoCSV, 'utf8');

run(`"${gsheetsCmd}" mutate clear ${SPREADSHEET_ID} "'0. Instructivo de Uso'!A1:Z50"`);
run(`"${gsheetsCmd}" mutate import-csv ${SPREADSHEET_ID} instructivo_limpio.csv --sheet "0. Instructivo de Uso"`);
run(`"${gsheetsCmd}" mutate format ${SPREADSHEET_ID} --sheet-id 0 --start-row 0 --end-row 1 --start-col 0 --end-col 3 --bg-color "#18181B" --fg-color "#FFFFFF" --bold --align CENTER`);
run(`"${gsheetsCmd}" mutate freeze ${SPREADSHEET_ID} --sheet-id 0 --rows 1`);
run(`"${gsheetsCmd}" mutate autosize ${SPREADSHEET_ID} --sheet-id 0 --start-col 0 --end-col 3`);

console.log('🎉 ¡Todas las 4 hojas de la planilla fueron limpiadas y formateadas con éxito!');
