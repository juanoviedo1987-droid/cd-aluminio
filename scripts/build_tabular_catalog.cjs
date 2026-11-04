const fs = require('fs');
const data = require('../matriz_serie20.json');

const headers = [
  'ID Producto',
  'Producto',
  'Línea / Serie',
  'Ancho (mm)',
  'Alto (mm)',
  'Medida (cm)',
  'Precio Base ($ UYU)',
  'Estado en Web',
  'Notas / Aviso Taller'
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
  const [ancho, alto] = key.split('x').map(Number);
  const precio = data.priceMap[key];
  const id = `V-S20-${ancho}x${alto}`;
  const anchoCm = ancho / 10;
  const altoCm = alto / 10;
  rows.push([
    id,
    'Ventana Corrediza',
    'Serie 20',
    ancho.toString(),
    alto.toString(),
    `${anchoCm} x ${altoCm} cm`,
    precio.toString(),
    'ACTIVO',
    'Lista oficial taller'
  ]);
}

const csvContent = rows.map(r => r.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');
fs.writeFileSync('catalogo_unificado_serie20.csv', csvContent, 'utf8');
console.log(`Wrote ${rows.length - 1} rows to catalogo_unificado_serie20.csv`);
