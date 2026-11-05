const fs = require('fs');

function parsearCSVLineas(textoCSV) {
  const lineas = [];
  const filas = textoCSV.split(/\r?\n/);
  if (filas.length === 0) return lineas;

  const primeraFila = filas[0] || '';
  const cantComas = (primeraFila.match(/,/g) || []).length;
  const cantPuntosComa = (primeraFila.match(/;/g) || []).length;
  const separador = cantPuntosComa > cantComas ? ';' : ',';

  for (const fila of filas) {
    if (!fila.trim()) continue;
    const columnas = [];
    let valorActual = '';
    let dentroDeComillas = false;

    for (let i = 0; i < fila.length; i++) {
      const char = fila[i];
      if (char === '"') {
        if (dentroDeComillas && fila[i + 1] === '"') {
          valorActual += '"';
          i++;
        } else {
          dentroDeComillas = !dentroDeComillas;
        }
      } else if (char === separador && !dentroDeComillas) {
        columnas.push(valorActual.trim());
        valorActual = '';
      } else {
        valorActual += char;
      }
    }
    columnas.push(valorActual.trim());
    lineas.push(columnas);
  }

  return lineas;
}

function parseCurrencyString(val) {
  if (!val) return 0;
  let s = val.replace(/[$ ]/g, '').trim();
  if (/\.\d{2}$/.test(s) || /,\d{2}$/.test(s)) {
    s = s.slice(0, -3);
  }
  const num = parseInt(s.replace(/[^\d]/g, ''), 10);
  return isNaN(num) ? 0 : num;
}

function parsearMatrizSerie20CSV(textoCSV) {
  const filas = parsearCSVLineas(textoCSV);
  if (filas.length < 2) return null;

  const filaEncabezados = filas[0];

  const idxAncho = filaEncabezados.findIndex(h => h.toLowerCase().includes('ancho'));
  const idxAlto = filaEncabezados.findIndex(h => h.toLowerCase().includes('alto'));
  const idxPrecio = filaEncabezados.findIndex(h => h.toLowerCase().includes('precio'));
  const idxEstado = filaEncabezados.findIndex(h => h.toLowerCase().includes('estado'));

  if (idxAncho >= 0 && idxAlto >= 0 && idxPrecio >= 0) {
    const anchosSet = new Set();
    const altosSet = new Set();
    const precios = {};

    for (let f = 1; f < filas.length; f++) {
      const fila = filas[f];
      if (!fila || fila.length <= Math.max(idxAncho, idxAlto, idxPrecio)) continue;

      const estado = idxEstado >= 0 ? (fila[idxEstado] || '').toUpperCase() : 'ACTIVO';
      if (estado === 'PAUSADO' || estado === 'INACTIVO' || estado === 'NO') continue;

      let anchoNum = parseInt((fila[idxAncho] || '').replace(/[^\d]/g, ''), 10);
      let altoNum = parseInt((fila[idxAlto] || '').replace(/[^\d]/g, ''), 10);
      const precioNum = parseCurrencyString(fila[idxPrecio]);

      if (!isNaN(anchoNum) && !isNaN(altoNum) && !isNaN(precioNum) && precioNum > 0) {
        if (anchoNum < 300) anchoNum = anchoNum * 10;
        if (altoNum < 300) altoNum = altoNum * 10;
        anchosSet.add(anchoNum);
        altosSet.add(altoNum);
        precios[`${anchoNum}x${altoNum}`] = precioNum;
      }
    }

    return {
      anchosCount: anchosSet.size,
      altosCount: altosSet.size,
      preciosCount: Object.keys(precios).length,
      sample1200x1000: precios['1200x1000'],
      sample600x400: precios['600x400'],
      sample2500x1600: precios['2500x1600'],
    };
  }
  return null;
}

const url = 'https://docs.google.com/spreadsheets/d/1CwBvdnMt_JMOejCKHwH0PKnMOaRHw3c4cKXxEDaHgWQ/export?format=csv&gid=480036493';
fetch(url)
  .then(r => r.text())
  .then(csv => {
    console.log('Result:', parsearMatrizSerie20CSV(csv));
  });
