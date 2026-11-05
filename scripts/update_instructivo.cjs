const { execSync } = require('child_process');
const fs = require('fs');

const SPREADSHEET_ID = '1CwBvdnMt_JMOejCKHwH0PKnMOaRHw3c4cKXxEDaHgWQ';
const gsheetsCmd = 'C:\\Users\\juano\\.gemini\\config\\plugins\\gsheets\\skills\\gsheets\\scripts\\gsheets.cmd';
const SHEET_ID = 0; // 0. Instructivo de Uso

const instructivoRows = [
  ['GUÍA RÁPIDA DE USO', 'INSTRUCCIONES PARA CD ALUMINIO', 'DETALLE OPERATIVO'],
  ['1. Modificar Precios', 'En la pestaña "1. Catálogo y Precios", busca el ancho y alto deseado y modifica directamente el monto en la columna E (Precio).', 'El cambio impacta en la web automáticamente.'],
  ['2. Agregar Nuevas Medidas o Productos', 'Simplemente agrega una nueva fila al final de la tabla en la pestaña "1. Catálogo y Precios" completando: Producto, Serie, Ancho (cm), Alto (cm) y Precio.', 'No necesitas crear pestañas nuevas. Todo queda ordenado en una única lista.'],
  ['3. Sincronización Inmediata en la Web', 'Al cambiar un precio en esta planilla, la aplicación web lo toma automáticamente. También cuentas con el botón "Sincronizar" en la web para forzar la actualización instantánea.', 'Sin demoras ni intermediarios.'],
  ['4. Historial de Cotizaciones', 'Cada presupuesto que guardes o envíes por WhatsApp queda registrado con fecha, cliente y detalle en la pestaña "2. Historial de Cotizaciones".', 'Registro automático y seguro.']
];

const csvContent = instructivoRows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n');
fs.writeFileSync('scripts/instructivo.csv', csvContent, 'utf8');

// 1. Clear Sheet 0
execSync(`"${gsheetsCmd}" mutate clear ${SPREADSHEET_ID} "'0. Instructivo de Uso'!A1:Z50"`, { encoding: 'utf8' });

// 2. Import CSV
execSync(`"${gsheetsCmd}" mutate import-csv ${SPREADSHEET_ID} scripts/instructivo.csv --sheet "0. Instructivo de Uso"`, { encoding: 'utf8' });

// 3. Format Sheet 0
const formatBatch = {
  requests: [
    // Header
    {
      repeatCell: {
        range: {
          sheetId: SHEET_ID,
          startRowIndex: 0,
          endRowIndex: 1,
          startColumnIndex: 0,
          endColumnIndex: 3
        },
        cell: {
          userEnteredFormat: {
            backgroundColor: { red: 0.094, green: 0.094, blue: 0.106 },
            horizontalAlignment: 'CENTER',
            verticalAlignment: 'MIDDLE',
            textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 }, bold: true, fontSize: 10 }
          }
        },
        fields: 'userEnteredFormat(backgroundColor,horizontalAlignment,verticalAlignment,textFormat)'
      }
    },
    // Data rows
    {
      repeatCell: {
        range: {
          sheetId: SHEET_ID,
          startRowIndex: 1,
          endRowIndex: 5,
          startColumnIndex: 0,
          endColumnIndex: 3
        },
        cell: {
          userEnteredFormat: {
            backgroundColor: { red: 1, green: 1, blue: 1 },
            verticalAlignment: 'MIDDLE',
            wrapStrategy: 'WRAP',
            textFormat: { foregroundColor: { red: 0.1, green: 0.1, blue: 0.1 }, fontSize: 10 }
          }
        },
        fields: 'userEnteredFormat(backgroundColor,verticalAlignment,wrapStrategy,textFormat)'
      }
    },
    // Col 0 bold
    {
      repeatCell: {
        range: {
          sheetId: SHEET_ID,
          startRowIndex: 1,
          endRowIndex: 5,
          startColumnIndex: 0,
          endColumnIndex: 1
        },
        cell: {
          userEnteredFormat: {
            textFormat: { foregroundColor: { red: 0.094, green: 0.094, blue: 0.106 }, bold: true }
          }
        },
        fields: 'userEnteredFormat(textFormat)'
      }
    },
    // Borders
    {
      updateBorders: {
        range: {
          sheetId: SHEET_ID,
          startRowIndex: 1,
          endRowIndex: 5,
          startColumnIndex: 0,
          endColumnIndex: 3
        },
        top: { style: 'SOLID', color: { red: 0.9, green: 0.9, blue: 0.9 } },
        bottom: { style: 'SOLID', color: { red: 0.9, green: 0.9, blue: 0.9 } },
        left: { style: 'SOLID', color: { red: 0.9, green: 0.9, blue: 0.9 } },
        right: { style: 'SOLID', color: { red: 0.9, green: 0.9, blue: 0.9 } },
        innerHorizontal: { style: 'SOLID', color: { red: 0.93, green: 0.93, blue: 0.93 } },
        innerVertical: { style: 'SOLID', color: { red: 0.93, green: 0.93, blue: 0.93 } }
      }
    },
    // Widths
    {
      updateDimensionProperties: {
        range: { sheetId: SHEET_ID, dimension: 'COLUMNS', startIndex: 0, endIndex: 1 },
        properties: { pixelSize: 220 },
        fields: 'pixelSize'
      }
    },
    {
      updateDimensionProperties: {
        range: { sheetId: SHEET_ID, dimension: 'COLUMNS', startIndex: 1, endIndex: 2 },
        properties: { pixelSize: 450 },
        fields: 'pixelSize'
      }
    },
    {
      updateDimensionProperties: {
        range: { sheetId: SHEET_ID, dimension: 'COLUMNS', startIndex: 2, endIndex: 3 },
        properties: { pixelSize: 280 },
        fields: 'pixelSize'
      }
    }
  ]
};

fs.writeFileSync('scripts/format_instructivo.json', JSON.stringify(formatBatch, null, 2), 'utf8');
execSync(`"${gsheetsCmd}" mutate raw-batch ${SPREADSHEET_ID} -f scripts/format_instructivo.json`, { encoding: 'utf8' });
console.log('Sheet 0 updated and formatted successfully!');
