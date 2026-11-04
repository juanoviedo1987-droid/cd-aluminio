const data = require('../matriz_serie20.json');
const fs = require('fs');
const content = `// Matriz Oficial de Precios CD Aluminio - Ventana Corrediza Serie 20
// Precios reales de taller en Pesos Uruguayos ($ UYU)

export interface MatrizSerie20Data {
  anchos: number[];
  altos: number[];
  precios: Record<string, number>;
}

export const MATRIZ_SERIE_20_BASE: MatrizSerie20Data = ${JSON.stringify({ anchos: data.anchos, altos: data.altos, precios: data.priceMap }, null, 2)};
`;
fs.writeFileSync('src/data/matrizSerie20.ts', content, 'utf8');
console.log('src/data/matrizSerie20.ts written!');
