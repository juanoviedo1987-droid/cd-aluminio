const { execSync } = require('child_process');
const fs = require('fs');

const SPREADSHEET_ID = '1CwBvdnMt_JMOejCKHwH0PKnMOaRHw3c4cKXxEDaHgWQ';
const gsheetsCmd = 'C:\\Users\\juano\\.gemini\\config\\plugins\\gsheets\\skills\\gsheets\\scripts\\gsheets.cmd';

// Google Sheets API batchUpdate request to:
// 1. Remove all DataValidation from sheet 480036493 (removes the red warning triangles)
// 2. Clear all background colors and set plain white
// 3. Clear text colors and set standard dark text
// 4. Set clean borders and alignments

const rawBatch = {
  requests: [
    // 1. Clear data validation on sheet 1 (ID: 480036493)
    {
      setDataValidation: {
        range: {
          sheetId: 480036493,
          startRowIndex: 0,
          endRowIndex: 300,
          startColumnIndex: 0,
          endColumnIndex: 15
        },
        rule: null
      }
    },
    // 2. Reset userEnteredFormat for all data cells in sheet 1 (rows 1 to 230)
    {
      repeatCell: {
        range: {
          sheetId: 480036493,
          startRowIndex: 1,
          endRowIndex: 230,
          startColumnIndex: 0,
          endColumnIndex: 9
        },
        cell: {
          userEnteredFormat: {
            backgroundColor: { red: 1, green: 1, blue: 1 },
            textFormat: {
              foregroundColor: { red: 0.1, green: 0.1, blue: 0.1 },
              bold: false,
              fontSize: 10
            }
          }
        },
        fields: "userEnteredFormat.backgroundColor,userEnteredFormat.textFormat"
      }
    },
    // 3. Header row formatting: Black background, white bold text
    {
      repeatCell: {
        range: {
          sheetId: 480036493,
          startRowIndex: 0,
          endRowIndex: 1,
          startColumnIndex: 0,
          endColumnIndex: 9
        },
        cell: {
          userEnteredFormat: {
            backgroundColor: { red: 0.09, green: 0.09, blue: 0.11 }, // #18181B
            horizontalAlignment: "CENTER",
            verticalAlignment: "MIDDLE",
            textFormat: {
              foregroundColor: { red: 1, green: 1, blue: 1 },
              bold: true,
              fontSize: 10
            }
          }
        },
        fields: "userEnteredFormat.backgroundColor,userEnteredFormat.horizontalAlignment,userEnteredFormat.verticalAlignment,userEnteredFormat.textFormat"
      }
    },
    // 4. Alignments and Number Formats for Data Rows:
    // Col D & E: Ancho & Alto -> Number "0", Center
    {
      repeatCell: {
        range: {
          sheetId: 480036493,
          startRowIndex: 1,
          endRowIndex: 230,
          startColumnIndex: 3,
          endColumnIndex: 5
        },
        cell: {
          userEnteredFormat: {
            horizontalAlignment: "RIGHT",
            numberFormat: { type: "NUMBER", pattern: "0" }
          }
        },
        fields: "userEnteredFormat.horizontalAlignment,userEnteredFormat.numberFormat"
      }
    },
    // Col F: Medida (cm) -> Center
    {
      repeatCell: {
        range: {
          sheetId: 480036493,
          startRowIndex: 1,
          endRowIndex: 230,
          startColumnIndex: 5,
          endColumnIndex: 6
        },
        cell: {
          userEnteredFormat: {
            horizontalAlignment: "CENTER"
          }
        },
        fields: "userEnteredFormat.horizontalAlignment"
      }
    },
    // Col G: Precio Base -> Currency "$#,##0", Right, Bold
    {
      repeatCell: {
        range: {
          sheetId: 480036493,
          startRowIndex: 1,
          endRowIndex: 230,
          startColumnIndex: 6,
          endColumnIndex: 7
        },
        cell: {
          userEnteredFormat: {
            horizontalAlignment: "RIGHT",
            numberFormat: { type: "CURRENCY", pattern: "$#,##0" },
            textFormat: { bold: true, foregroundColor: { red: 0.09, green: 0.09, blue: 0.11 } }
          }
        },
        fields: "userEnteredFormat.horizontalAlignment,userEnteredFormat.numberFormat,userEnteredFormat.textFormat"
      }
    },
    // Col H: Estado -> Center
    {
      repeatCell: {
        range: {
          sheetId: 480036493,
          startRowIndex: 1,
          endRowIndex: 230,
          startColumnIndex: 7,
          endColumnIndex: 8
        },
        cell: {
          userEnteredFormat: {
            horizontalAlignment: "CENTER"
          }
        },
        fields: "userEnteredFormat.horizontalAlignment"
      }
    },
    // 5. Clean Sheet 0 (Instructivo de Uso): Remove all colors outside A1:C5
    {
      repeatCell: {
        range: {
          sheetId: 0,
          startRowIndex: 0,
          endRowIndex: 20,
          startColumnIndex: 0,
          endColumnIndex: 10
        },
        cell: {
          userEnteredFormat: {
            backgroundColor: { red: 1, green: 1, blue: 1 },
            textFormat: {
              foregroundColor: { red: 0.1, green: 0.1, blue: 0.1 },
              bold: false,
              fontSize: 10
            }
          }
        },
        fields: "userEnteredFormat.backgroundColor,userEnteredFormat.textFormat"
      }
    },
    // Header for sheet 0:
    {
      repeatCell: {
        range: {
          sheetId: 0,
          startRowIndex: 0,
          endRowIndex: 1,
          startColumnIndex: 0,
          endColumnIndex: 3
        },
        cell: {
          userEnteredFormat: {
            backgroundColor: { red: 0.09, green: 0.09, blue: 0.11 },
            horizontalAlignment: "CENTER",
            textFormat: {
              foregroundColor: { red: 1, green: 1, blue: 1 },
              bold: true,
              fontSize: 10
            }
          }
        },
        fields: "userEnteredFormat.backgroundColor,userEnteredFormat.horizontalAlignment,userEnteredFormat.textFormat"
      }
    }
  ]
};

fs.writeFileSync('scripts/clean_sheet_ui.json', JSON.stringify(rawBatch, null, 2), 'utf8');

try {
  console.log('Ejecutando limpieza total de interfaz en Google Sheets...');
  const res = execSync(`"${gsheetsCmd}" mutate raw-batch ${SPREADSHEET_ID} -f scripts/clean_sheet_ui.json`, { encoding: 'utf8' });
  console.log('Resultado:', res);
} catch (e) {
  console.error('Error:', e.message);
}
