const { execSync } = require('child_process');
const fs = require('fs');

const SPREADSHEET_ID = '1CwBvdnMt_JMOejCKHwH0PKnMOaRHw3c4cKXxEDaHgWQ';
const gsheetsCmd = 'C:\\Users\\juano\\.gemini\\config\\plugins\\gsheets\\skills\\gsheets\\scripts\\gsheets.cmd';
const SHEET_ID = 480036493;

const rawBatch = {
  requests: [
    // 1. Remove data validation everywhere
    {
      setDataValidation: {
        range: {
          sheetId: SHEET_ID,
          startRowIndex: 0,
          endRowIndex: 300,
          startColumnIndex: 0,
          endColumnIndex: 20
        },
        rule: null
      }
    },
    // 2. Clear formats on columns F to Z (old columns)
    {
      repeatCell: {
        range: {
          sheetId: SHEET_ID,
          startRowIndex: 0,
          endRowIndex: 300,
          startColumnIndex: 5,
          endColumnIndex: 20
        },
        cell: {
          userEnteredFormat: {
            backgroundColor: { red: 1, green: 1, blue: 1 },
            textFormat: { foregroundColor: { red: 0, green: 0, blue: 0 }, bold: false },
            borders: {
              top: { style: 'NONE' },
              bottom: { style: 'NONE' },
              left: { style: 'NONE' },
              right: { style: 'NONE' }
            }
          }
        },
        fields: 'userEnteredFormat(backgroundColor,textFormat,borders)'
      }
    },
    // 3. Format Header (Row 0, Cols 0-4)
    {
      repeatCell: {
        range: {
          sheetId: SHEET_ID,
          startRowIndex: 0,
          endRowIndex: 1,
          startColumnIndex: 0,
          endColumnIndex: 5
        },
        cell: {
          userEnteredFormat: {
            backgroundColor: { red: 0.094, green: 0.094, blue: 0.106 }, // #18181B dark graphite
            horizontalAlignment: 'CENTER',
            verticalAlignment: 'MIDDLE',
            textFormat: {
              foregroundColor: { red: 1, green: 1, blue: 1 },
              bold: true,
              fontSize: 10
            },
            borders: {
              bottom: { style: 'SOLID_MEDIUM', color: { red: 0.2, green: 0.2, blue: 0.2 } }
            }
          }
        },
        fields: 'userEnteredFormat(backgroundColor,horizontalAlignment,verticalAlignment,textFormat,borders)'
      }
    },
    // 4. Format Data rows (Col 0: Producto)
    {
      repeatCell: {
        range: {
          sheetId: SHEET_ID,
          startRowIndex: 1,
          endRowIndex: 226,
          startColumnIndex: 0,
          endColumnIndex: 1
        },
        cell: {
          userEnteredFormat: {
            backgroundColor: { red: 1, green: 1, blue: 1 },
            horizontalAlignment: 'LEFT',
            verticalAlignment: 'MIDDLE',
            textFormat: {
              foregroundColor: { red: 0.1, green: 0.1, blue: 0.1 },
              bold: false,
              fontSize: 10
            }
          }
        },
        fields: 'userEnteredFormat(backgroundColor,horizontalAlignment,verticalAlignment,textFormat)'
      }
    },
    // 5. Format Col 1: Serie
    {
      repeatCell: {
        range: {
          sheetId: SHEET_ID,
          startRowIndex: 1,
          endRowIndex: 226,
          startColumnIndex: 1,
          endColumnIndex: 2
        },
        cell: {
          userEnteredFormat: {
            backgroundColor: { red: 1, green: 1, blue: 1 },
            horizontalAlignment: 'CENTER',
            verticalAlignment: 'MIDDLE',
            textFormat: {
              foregroundColor: { red: 0.3, green: 0.3, blue: 0.3 },
              bold: false,
              fontSize: 10
            }
          }
        },
        fields: 'userEnteredFormat(backgroundColor,horizontalAlignment,verticalAlignment,textFormat)'
      }
    },
    // 6. Format Col 2 & 3: Ancho (cm), Alto (cm)
    {
      repeatCell: {
        range: {
          sheetId: SHEET_ID,
          startRowIndex: 1,
          endRowIndex: 226,
          startColumnIndex: 2,
          endColumnIndex: 4
        },
        cell: {
          userEnteredFormat: {
            backgroundColor: { red: 1, green: 1, blue: 1 },
            horizontalAlignment: 'RIGHT',
            verticalAlignment: 'MIDDLE',
            numberFormat: {
              type: 'NUMBER',
              pattern: '0'
            },
            textFormat: {
              foregroundColor: { red: 0.1, green: 0.1, blue: 0.1 },
              bold: false,
              fontSize: 10
            }
          }
        },
        fields: 'userEnteredFormat(backgroundColor,horizontalAlignment,verticalAlignment,numberFormat,textFormat)'
      }
    },
    // 7. Format Col 4: Precio ($ UYU)
    {
      repeatCell: {
        range: {
          sheetId: SHEET_ID,
          startRowIndex: 1,
          endRowIndex: 226,
          startColumnIndex: 4,
          endColumnIndex: 5
        },
        cell: {
          userEnteredFormat: {
            backgroundColor: { red: 1, green: 1, blue: 1 },
            horizontalAlignment: 'RIGHT',
            verticalAlignment: 'MIDDLE',
            numberFormat: {
              type: 'CURRENCY',
              pattern: '$#,##0'
            },
            textFormat: {
              foregroundColor: { red: 0.02, green: 0.45, blue: 0.3 }, // deep emerald
              bold: true,
              fontSize: 10
            }
          }
        },
        fields: 'userEnteredFormat(backgroundColor,horizontalAlignment,verticalAlignment,numberFormat,textFormat)'
      }
    },
    // 8. Add subtle light gray borders to data cells (Cols 0-4, Rows 1-225)
    {
      updateBorders: {
        range: {
          sheetId: SHEET_ID,
          startRowIndex: 1,
          endRowIndex: 226,
          startColumnIndex: 0,
          endColumnIndex: 5
        },
        top: { style: 'SOLID', color: { red: 0.9, green: 0.9, blue: 0.9 } },
        bottom: { style: 'SOLID', color: { red: 0.9, green: 0.9, blue: 0.9 } },
        left: { style: 'SOLID', color: { red: 0.9, green: 0.9, blue: 0.9 } },
        right: { style: 'SOLID', color: { red: 0.9, green: 0.9, blue: 0.9 } },
        innerHorizontal: { style: 'SOLID', color: { red: 0.93, green: 0.93, blue: 0.93 } },
        innerVertical: { style: 'SOLID', color: { red: 0.93, green: 0.93, blue: 0.93 } }
      }
    },
    // 9. Freeze Row 1
    {
      updateSheetProperties: {
        properties: {
          sheetId: SHEET_ID,
          gridProperties: {
            frozenRowCount: 1
          }
        },
        fields: 'gridProperties.frozenRowCount'
      }
    },
    // 10. Explicit Column Widths for a clean professional look
    {
      updateDimensionProperties: {
        range: {
          sheetId: SHEET_ID,
          dimension: 'COLUMNS',
          startIndex: 0,
          endIndex: 1
        },
        properties: { pixelSize: 180 },
        fields: 'pixelSize'
      }
    },
    {
      updateDimensionProperties: {
        range: {
          sheetId: SHEET_ID,
          dimension: 'COLUMNS',
          startIndex: 1,
          endIndex: 2
        },
        properties: { pixelSize: 110 },
        fields: 'pixelSize'
      }
    },
    {
      updateDimensionProperties: {
        range: {
          sheetId: SHEET_ID,
          dimension: 'COLUMNS',
          startIndex: 2,
          endIndex: 3
        },
        properties: { pixelSize: 110 },
        fields: 'pixelSize'
      }
    },
    {
      updateDimensionProperties: {
        range: {
          sheetId: SHEET_ID,
          dimension: 'COLUMNS',
          startIndex: 3,
          endIndex: 4
        },
        properties: { pixelSize: 110 },
        fields: 'pixelSize'
      }
    },
    {
      updateDimensionProperties: {
        range: {
          sheetId: SHEET_ID,
          dimension: 'COLUMNS',
          startIndex: 4,
          endIndex: 5
        },
        properties: { pixelSize: 140 },
        fields: 'pixelSize'
      }
    }
  ]
};

const payloadPath = 'scripts/format_5_columns.json';
fs.writeFileSync(payloadPath, JSON.stringify(rawBatch, null, 2), 'utf8');

try {
  const result = execSync(`"${gsheetsCmd}" mutate raw-batch ${SPREADSHEET_ID} -f ${payloadPath}`, { encoding: 'utf8' });
  console.log('Success:', result);
} catch (e) {
  console.error('Error applying batch:', e.stdout || e.message);
}
