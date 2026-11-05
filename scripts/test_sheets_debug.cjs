const url = 'https://docs.google.com/spreadsheets/d/1CwBvdnMt_JMOejCKHwH0PKnMOaRHw3c4cKXxEDaHgWQ/export?format=csv&gid=480036493';

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

fetch(url)
  .then(r => r.text())
  .then(csv => {
    const filas = parsearCSVLineas(csv);
    console.log('Total filas:', filas.length);
    const filaEncabezados = filas[0];
    console.log('Encabezados:', filaEncabezados);
    const idxAncho = filaEncabezados.findIndex(h => h.toLowerCase().includes('ancho'));
    const idxAlto = filaEncabezados.findIndex(h => h.toLowerCase().includes('alto'));
    const idxPrecio = filaEncabezados.findIndex(h => h.toLowerCase().includes('precio'));
    console.log({ idxAncho, idxAlto, idxPrecio });
    const precios = {};
    for (let f = 1; f < filas.length; f++) {
      const fila = filas[f];
      const anchoNum = parseInt((fila[idxAncho] || '').replace(/[^\d]/g, ''), 10);
      const altoNum = parseInt((fila[idxAlto] || '').replace(/[^\d]/g, ''), 10);
      const precioNum = parseCurrencyString(fila[idxPrecio] || '');
      if (!isNaN(anchoNum) && !isNaN(altoNum) && !isNaN(precioNum) && precioNum > 0) {
        precios[anchoNum + 'x' + altoNum] = precioNum;
      }
    }
    console.log('Total precios parsed:', Object.keys(precios).length);
    console.log('1200x1000:', precios['1200x1000']);
    console.log('600x400:', precios['600x400']);
  });
