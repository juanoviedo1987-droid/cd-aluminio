const { MATRIZ_SERIE_20_BASE } = require('../matriz_serie20.json');
// Simple test of the lookup logic
const data = require('../matriz_serie20.json');

function buscarPrecioEnMatriz(anchoCm, altoCm) {
  const anchoMm = Math.round(anchoCm * 10);
  const altoMm = Math.round(altoCm * 10);

  const minAncho = data.anchos[0];
  const maxAncho = data.anchos[data.anchos.length - 1];
  const minAlto = data.altos[0];
  const maxAlto = data.altos[data.altos.length - 1];

  if (anchoMm > maxAncho || altoMm > maxAlto) {
    return { error: 'Fuera de rango max' };
  }
  if (anchoMm < minAncho || altoMm < minAlto) {
    return { error: 'Inferior a min' };
  }

  const anchoStd = data.anchos.find((a) => a >= anchoMm) || maxAncho;
  const altoStd = data.altos.find((h) => h >= altoMm) || maxAlto;

  const key = `${anchoStd}x${altoStd}`;
  const precio = data.priceMap[key];
  return { anchoStd, altoStd, precio, esExacto: anchoMm === anchoStd && altoMm === altoStd };
}

console.log('Test 1: 120x100 cm (1200x1000):', buscarPrecioEnMatriz(120, 100));
console.log('Test 2: 115x95 cm (non-standard, should round to 1200x1000):', buscarPrecioEnMatriz(115, 95));
console.log('Test 3: 60x40 cm (min):', buscarPrecioEnMatriz(60, 40));
console.log('Test 4: 250x160 cm (max):', buscarPrecioEnMatriz(250, 160));
console.log('Test 5: 300x200 cm (out of range):', buscarPrecioEnMatriz(300, 200));
