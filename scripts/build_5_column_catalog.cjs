const fs = require('fs');
const path = require('path');
const data = require(path.join(__dirname, '../matriz_serie20.json'));

const headers = [
  'Producto',
  'Serie',
  'Ancho (cm)',
  'Alto (cm)',
  'Precio ($ UYU)'
];

const rows = [headers];

// Sort by ancho then alto
const keys = Object.keys(data.priceMap).sort((k1, k2) => {
  const [w1, h1] = k1.split('x').map(Number);
  const [w2, h2] = k2.split('x').map(Number);
  if (w1 !== w2) return w1 - w2;
  return h1 - h2;
});

for (const key of keys) {
  const [anchoMm, altoMm] = key.split('x').map(Number);
  const precio = data.priceMap[key];
  const anchoCm = anchoMm / 10;
  const altoCm = altoMm / 10;
  rows.push([
    'Ventana Corrediza',
    'Serie 20',
    anchoCm.toString(),
    altoCm.toString(),
    precio.toString()
  ]);
}

const csvContent = rows.map(r => r.join(',')).join('\n');
fs.writeFileSync('catalogo_5_columnas.csv', csvContent, 'utf8');
console.log(`Wrote ${rows.length - 1} rows to catalogo_5_columnas.csv`);
