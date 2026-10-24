const ExcelJS = require('exceljs');
const path = require('path');

async function createStyledWorkbook() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'CD Aluminio - Sistema de Cotización';
  workbook.lastModifiedBy = 'CD Aluminio';
  workbook.created = new Date();
  workbook.modified = new Date();

  // ----------------------------------------------------
  // HOJA 0: INSTRUCTIVO DE USO PARA EL TALLER / CLIENTE
  // ----------------------------------------------------
  const sheetInst = workbook.addWorksheet('0. Instructivo de Uso', {
    views: [{ showGridLines: true }]
  });

  sheetInst.columns = [
    { header: 'Paso / Sección', key: 'paso', width: 24 },
    { header: 'Instrucción para el Personal de CD Aluminio', key: 'instruccion', width: 48 },
    { header: 'Impacto Automático en la Web App', key: 'impacto', width: 44 }
  ];

  const instructivo = [
    {
      paso: '1. Carga de Precios Base',
      instruccion: 'En la pestaña "1. Catálogo y Precios Base", ingresar el valor en pesos uruguayos ($ UYU) en la columna "Precio Base Taller". Si un producto es sobre diseño, dejar vacío o poner "A convenir".',
      impacto: 'La Web App toma este precio como punto de partida oficial para cotizar en tiempo real a clientes y vendedores.'
    },
    {
      paso: '2. Activar o Pausar Productos',
      instruccion: 'En la columna "Estado en App", colocar "ACTIVO" para que se vea en el cotizador, o "PAUSADO" si temporalmente no hay stock de perfilería o herrajes para esa abertura.',
      impacto: 'Los productos pausados se ocultan automáticamente del cotizador web sin borrar sus datos ni su historial.'
    },
    {
      paso: '3. Factores y Recargos',
      instruccion: 'En la pestaña "2. Recargos y Factores", ajustar los porcentajes de incremento según la serie (S20 económica, S30 reforzada, A82, Probba, Gala CR), los colores de pintura o el vidrio.',
      impacto: 'Al seleccionar una serie o terminación especial en la web, el sistema calcula el recargo automáticamente con la fórmula del taller.'
    },
    {
      paso: '4. Historial de Cotizaciones',
      instruccion: 'En la pestaña "3. Historial de Cotizaciones", revisar los presupuestos generados desde la web. Quedan asentados con fecha, cliente, medidas exactas y detalle de materiales.',
      impacto: 'Funciona como libro de pedidos y seguimiento comercial para que el taller no pierda ninguna cotización emitida.'
    },
    {
      paso: '5. Soporte y Asistencia',
      instruccion: 'Cualquier duda o ajuste técnico en el sistema, contactar al equipo de soporte de AGN / Antigravity.',
      impacto: 'Garantía y mantenimiento continuo bajo el abono mensual activo.'
    }
  ];

  instructivo.forEach(item => sheetInst.addRow(item));

  // ----------------------------------------------------
  // HOJA 1: CATÁLOGO DE PRODUCTOS Y PRECIOS
  // ----------------------------------------------------
  const sheetProd = workbook.addWorksheet('1. Catálogo y Precios Base', {
    views: [{ showGridLines: true }]
  });

  sheetProd.columns = [
    { header: 'ID Producto', key: 'id', width: 22 },
    { header: 'Nombre del Producto / Abertura', key: 'nombre', width: 36 },
    { header: 'Categoría', key: 'categoria', width: 16 },
    { header: 'Series Compatibles (Excel)', key: 'series', width: 32 },
    { header: 'Cristales Compatibles', key: 'cristales', width: 34 },
    { header: 'Precio Base Taller ($ UYU)', key: 'precioBase', width: 25 },
    { header: 'Unidad de Cotización', key: 'unidad', width: 20 },
    { header: 'Plazo Estimado (Días)', key: 'plazo', width: 20 },
    { header: 'Requiere Medición en Obra', key: 'medicion', width: 24 },
    { header: 'Estado en App', key: 'estado', width: 16 },
    { header: 'Notas Técnicas de Taller', key: 'notas', width: 38 },
  ];

  const productos = [
    { id: 'V-CORR-2H', nombre: 'Ventana Corrediza (2 Hojas)', categoria: 'Ventanas', series: 'S20, S25, A82, Probba, Gala CR', cristales: '4mm, 5mm, Policarbonatos', precioBase: null, unidad: 'Unidad', plazo: '7 a 10 días', medicion: 'Recomendable', estado: 'ACTIVO', notas: 'Línea estándar tradicional más vendida' },
    { id: 'V-CORR-3H', nombre: 'Ventana Corrediza (3 Hojas)', categoria: 'Ventanas', series: 'S25, A82, Probba, Gala CR', cristales: '4mm a 8mm, DVH, Policarbonatos', precioBase: null, unidad: 'Unidad', plazo: '10 a 12 días', medicion: 'Recomendable', estado: 'ACTIVO', notas: 'Guía de 3 vías reforzada' },
    { id: 'V-CORR-4H', nombre: 'Ventana Corrediza (4 Hojas)', categoria: 'Ventanas', series: 'S25, A82, Probba, Gala CR', cristales: '4mm a 8mm, DVH, Policarbonatos', precioBase: null, unidad: 'Unidad', plazo: '10 a 14 días', medicion: 'Recomendable', estado: 'ACTIVO', notas: 'Cierre central y lateral' },
    { id: 'V-PANO-FIJO', nombre: 'Paño Fijo', categoria: 'Ventanas', series: 'S30, A82, Probba, Gala CR', cristales: '4mm, 5mm, 6mm, DVH, Policarbonatos', precioBase: null, unidad: 'm²', plazo: '7 a 10 días', medicion: 'Obligatoria', estado: 'ACTIVO', notas: 'Serie 30 reforzada' },
    { id: 'V-BATIENTE', nombre: 'Ventana Batiente', categoria: 'Ventanas', series: 'S30', cristales: '4mm, 5mm, 6mm, DVH, Policarbonatos', precioBase: null, unidad: 'Unidad', plazo: '10 a 12 días', medicion: 'Recomendable', estado: 'ACTIVO', notas: 'Hermética con burlete perimetral' },
    { id: 'V-TABAQUERA', nombre: 'Ventana Tabaquera', categoria: 'Ventanas', series: 'S30', cristales: '4mm, 5mm, 6mm, 8mm, DVH, Policarbonatos', precioBase: null, unidad: 'Unidad', plazo: '7 a 10 días', medicion: 'Recomendable', estado: 'ACTIVO', notas: 'Apertura superior basculante' },
    { id: 'V-PROYECTANTE', nombre: 'Ventana Proyectante', categoria: 'Ventanas', series: 'S30, Probba, Gala CR', cristales: '4mm a 8mm, DVH, Policarbonatos', precioBase: null, unidad: 'Unidad', plazo: '10 a 12 días', medicion: 'Recomendable', estado: 'ACTIVO', notas: 'Brazos de fricción de acero inox' },
    { id: 'V-GUILLOTINA', nombre: 'Ventana Guillotina', categoria: 'Ventanas', series: 'A82, Probba, Gala CR', cristales: '4mm a 8mm, DVH, Policarbonatos', precioBase: null, unidad: 'Unidad', plazo: '12 a 15 días', medicion: 'Obligatoria', estado: 'ACTIVO', notas: 'Sistema contrapesado vertical' },
    { id: 'ESP-BAJO-BAT', nombre: 'Bajo Mesada (Batiente)', categoria: 'Especiales', series: 'S30', cristales: '4mm, Policarbonatos', precioBase: null, unidad: 'Metro lineal', plazo: '10 a 15 días', medicion: 'Obligatoria', estado: 'ACTIVO', notas: 'Mueble en aluminio con puertas batientes' },
    { id: 'ESP-BAJO-CORR', nombre: 'Bajo Mesada (Corredizo)', categoria: 'Especiales', series: 'S20', cristales: '4mm, Policarbonatos', precioBase: null, unidad: 'Metro lineal', plazo: '10 a 15 días', medicion: 'Obligatoria', estado: 'ACTIVO', notas: 'Guías corredizas embutidas' },
    { id: 'P-MITAD-VIDRIO', nombre: 'Puerta Mitad Aluminio y Mitad Cristal', categoria: 'Puertas', series: 'S30', cristales: '4mm, 5mm, 6mm, DVH, Policarbonatos', precioBase: null, unidad: 'Unidad', plazo: '10 a 14 días', medicion: 'Obligatoria', estado: 'ACTIVO', notas: 'Puerta mixta residencial / taller' },
    { id: 'P-CIEGA', nombre: 'Puerta Toda Ciega en Aluminio', categoria: 'Puertas', series: 'S30', cristales: 'Sin Cristal / No Aplica', precioBase: null, unidad: 'Unidad', plazo: '10 a 14 días', medicion: 'Obligatoria', estado: 'ACTIVO', notas: 'Tubular machihembrado reforzado' },
    { id: 'P-CRISTAL', nombre: 'Puerta en Cristal', categoria: 'Puertas', series: 'S30', cristales: '4mm, 5mm, 6mm, DVH, Policarbonatos', precioBase: null, unidad: 'Unidad', plazo: '12 a 15 días', medicion: 'Obligatoria', estado: 'ACTIVO', notas: 'Herrajes pesados y manijón' },
    { id: 'P-GRANERO', nombre: 'Puerta Estilo Granero (Interior)', categoria: 'Puertas', series: 'S30', cristales: '4mm, 5mm, 6mm, DVH, Policarbonatos', precioBase: null, unidad: 'Unidad', plazo: '12 a 15 días', medicion: 'Obligatoria', estado: 'ACTIVO', notas: 'Guía aérea suspendida de diseño negro' },
    { id: 'SIS-MONO-PVC', nombre: 'Sistema Monoblock (Cortina PVC)', categoria: 'Sistemas', series: 'S20, S25, A82, Probba, Gala CR', cristales: '4mm, 5mm, 6mm, DVH, Policarbonatos', precioBase: null, unidad: 'Unidad', plazo: '10 a 14 días', medicion: 'Obligatoria', estado: 'ACTIVO', notas: 'Cajón compacto exterior/interior' },
    { id: 'SIS-MONO-ALU', nombre: 'Sistema Monoblock (Cortina Aluminio)', categoria: 'Sistemas', series: 'S20, S25, A82, Probba, Gala CR', cristales: '4mm, 5mm, 6mm, DVH, Policarbonatos', precioBase: null, unidad: 'Unidad', plazo: '12 a 15 días', medicion: 'Obligatoria', estado: 'ACTIVO', notas: 'Lamas de aluminio rellenas con poliuretano' },
    { id: 'MAMP-CRISTAL', nombre: 'Mampara de Cristal', categoria: 'Mamparas', series: 'S30, Especial', cristales: '4mm, 6mm, 8mm, Policarbonatos', precioBase: null, unidad: 'Unidad', plazo: '10 a 12 días', medicion: 'Obligatoria', estado: 'ACTIVO', notas: 'Cristal templado para baño' },
    { id: 'MAMP-ACRILICO', nombre: 'Mampara de Acrílico', categoria: 'Mamparas', series: 'S20, Especial', cristales: 'Sin Cristal / No Aplica', precioBase: null, unidad: 'Unidad', plazo: '7 a 10 días', medicion: 'Recomendable', estado: 'ACTIVO', notas: 'Placas de acrílico translúcido' },
    { id: 'ESP-BARANDA', nombre: 'Baranda', categoria: 'Especiales', series: 'S30, Especial', cristales: '6mm, 8mm, Policarbonatos', precioBase: null, unidad: 'Metro lineal', plazo: '12 a 18 días', medicion: 'Obligatoria', estado: 'ACTIVO', notas: 'Pasamanos tubular y cristal de seguridad' },
    { id: 'SIS-ROLLERS', nombre: 'Cortina Rollers', categoria: 'Sistemas', series: 'Especial', cristales: 'Sin Cristal / No Aplica', precioBase: null, unidad: 'm²', plazo: '7 a 10 días', medicion: 'Recomendable', estado: 'ACTIVO', notas: 'Blackout o Sunscreen con comando' },
    { id: 'ESP-TECHO-FIJO', nombre: 'Techo Fijo', categoria: 'Especiales', series: 'S30, Especial', cristales: 'Policarbonatos, 8mm', precioBase: null, unidad: 'm²', plazo: '15 a 20 días', medicion: 'Obligatoria', estado: 'ACTIVO', notas: 'Estructura autoportante de aluminio' },
    { id: 'ESP-TECHO-AUTO', nombre: 'Techo Automatizado', categoria: 'Especiales', series: 'S30, Especial', cristales: 'Policarbonatos, 8mm', precioBase: null, unidad: 'm²', plazo: '18 a 25 días', medicion: 'Obligatoria', estado: 'ACTIVO', notas: 'Apertura con motorización remota' },
    { id: 'ESP-HERRERIA', nombre: 'Herrería de Diseño', categoria: 'Especiales', series: 'S30, Especial', cristales: 'Opcional / A definir', precioBase: null, unidad: 'A convenir', plazo: 'A convenir', medicion: 'Obligatoria', estado: 'ACTIVO', notas: 'Portones, rejas y cerramientos especiales' }
  ];

  productos.forEach(p => sheetProd.addRow(p));

  // ----------------------------------------------------
  // HOJA 2: RECARGOS Y FACTORES (SERIES, COLORES, VIDRIOS)
  // ----------------------------------------------------
  const sheetRec = workbook.addWorksheet('2. Recargos y Factores', {
    views: [{ showGridLines: true }]
  });

  sheetRec.columns = [
    { header: 'Tipo de Parámetro', key: 'tipo', width: 22 },
    { header: 'Nombre del Parámetro', key: 'nombre', width: 34 },
    { header: 'Tipo de Ajuste', key: 'tipoAjuste', width: 20 },
    { header: 'Valor / Porcentaje', key: 'valor', width: 22 },
    { header: 'Descripción para el Cliente', key: 'desc', width: 44 },
    { header: 'Activo en App', key: 'activo', width: 16 }
  ];

  const recargos = [
    // Series
    { tipo: 'Línea / Serie', nombre: 'Serie 20', tipoAjuste: 'Factor Multiplicador', valor: '-15% (Económica)', desc: 'Línea residencial liviana', activo: 'SI' },
    { tipo: 'Línea / Serie', nombre: 'Serie 25', tipoAjuste: 'Base de Cálculo', valor: '0% (Base)', desc: 'Línea tradicional de mayor salida', activo: 'SI' },
    { tipo: 'Línea / Serie', nombre: 'Serie 30', tipoAjuste: 'Factor Multiplicador', valor: '+30% (Reforzada)', desc: 'Perfilería robusta para puertas y batientes', activo: 'SI' },
    { tipo: 'Línea / Serie', nombre: 'Línea A82 (Alta Prestación)', tipoAjuste: 'Factor Multiplicador', valor: '+45%', desc: 'Aislación superior y hermeticidad', activo: 'SI' },
    { tipo: 'Línea / Serie', nombre: 'Línea Probba (Alta Prestación)', tipoAjuste: 'Factor Multiplicador', valor: '+60%', desc: 'Grandes luces y resistencia al viento', activo: 'SI' },
    { tipo: 'Línea / Serie', nombre: 'Línea Gala CR (Alta Prestación)', tipoAjuste: 'Factor Multiplicador', valor: '+75%', desc: 'Máxima aislación con rotura puente térmico', activo: 'SI' },
    
    // Colores
    { tipo: 'Color / Terminación', nombre: 'Anodizado Natural', tipoAjuste: 'Color Base', valor: '0%', desc: 'Plata mate anticorrosión tradicional', activo: 'SI' },
    { tipo: 'Color / Terminación', nombre: 'Blanco', tipoAjuste: 'Pintura Horneada', valor: 'Consultar taller', desc: 'Pintura electrostática blanca', activo: 'SI' },
    { tipo: 'Color / Terminación', nombre: 'Negro', tipoAjuste: 'Pintura Horneada', valor: 'Consultar taller', desc: 'Pintura electrostática microtexturada', activo: 'SI' },
    { tipo: 'Color / Terminación', nombre: 'Anolock', tipoAjuste: 'Anodizado Oscuro', valor: '+10% est.', desc: 'Anodizado marrón bronce oscuro', activo: 'SI' },
    { tipo: 'Color / Terminación', nombre: 'Pintura electrostática', tipoAjuste: 'Color Especial', valor: 'Consultar carta RAL', desc: 'Carta de colores especiales a elección', activo: 'SI' },

    // Cristales
    { tipo: 'Cristal / Vidrio', nombre: 'Cristal 4mm', tipoAjuste: 'Cristal Base', valor: 'Base', desc: 'Cristal flotado incoloro estándar 4 mm', activo: 'SI' },
    { tipo: 'Cristal / Vidrio', nombre: 'Cristal 5mm', tipoAjuste: 'Cristal Flotado', valor: 'A convenir', desc: 'Cristal flotado incoloro 5 mm', activo: 'SI' },
    { tipo: 'Cristal / Vidrio', nombre: 'Cristal 6mm', tipoAjuste: 'Cristal Templado/Flotado', valor: 'A convenir', desc: 'Mayor rigidez y resistencia', activo: 'SI' },
    { tipo: 'Cristal / Vidrio', nombre: 'Cristal 8mm', tipoAjuste: 'Cristal de Seguridad', valor: 'A convenir', desc: 'Templado o laminado de seguridad', activo: 'SI' },
    { tipo: 'Cristal / Vidrio', nombre: 'DVH (Doble Vidriado Hermético)', tipoAjuste: 'Cámara Aislante', valor: '+25% est.', desc: 'Doble vidrio con cámara termoacústica', activo: 'SI' },
    { tipo: 'Cristal / Vidrio', nombre: 'Policarbonato alveolar', tipoAjuste: 'Placa Liviana', valor: 'A convenir', desc: 'Placa alveolar para techos', activo: 'SI' },
    { tipo: 'Cristal / Vidrio', nombre: 'Policarbonato compacto', tipoAjuste: 'Placa Antivandálica', valor: 'A convenir', desc: 'Ultra resistente al impacto', activo: 'SI' },

    // Colocación
    { tipo: 'Servicio en Obra', nombre: 'Colocación en Obra (Montevideo)', tipoAjuste: 'Mano de Obra', valor: 'A coordinar', desc: 'Instalación y ajuste en obra con foto previa', activo: 'SI' },
    { tipo: 'Servicio en Obra', nombre: 'Retiro en Taller', tipoAjuste: 'Sin Costo', valor: '$ 0', desc: 'Retiro en taller oficial Gral. Flores 2979', activo: 'SI' },
  ];

  recargos.forEach(r => sheetRec.addRow(r));

  // ----------------------------------------------------
  // HOJA 3: HISTORIAL DE COTIZACIONES
  // ----------------------------------------------------
  const sheetHist = workbook.addWorksheet('3. Historial de Cotizaciones', {
    views: [{ showGridLines: true }]
  });

  sheetHist.columns = [
    { header: 'Nº Presupuesto', key: 'id', width: 18 },
    { header: 'Fecha y Hora', key: 'fecha', width: 20 },
    { header: 'Cliente / Contacto', key: 'cliente', width: 24 },
    { header: 'Producto Solicitado', key: 'producto', width: 32 },
    { header: 'Línea / Serie', key: 'serie', width: 24 },
    { header: 'Color', key: 'color', width: 18 },
    { header: 'Medidas (Ancho x Alto)', key: 'medida', width: 26 },
    { header: 'Cristal', key: 'cristal', width: 28 },
    { header: 'Colocación', key: 'colocacion', width: 24 },
    { header: 'Estado', key: 'estado', width: 18 },
    { header: 'Total ($ UYU)', key: 'total', width: 18 }
  ];

  sheetHist.addRow({
    id: 'CD-2026-001',
    fecha: '24/10/2026 15:40',
    cliente: 'Consulta WhatsApp',
    producto: 'Ventana Corrediza (3 Hojas)',
    serie: 'Línea A82 (Alta Prestación)',
    color: 'Anolock',
    medida: '150 cm x 120 cm',
    cristal: 'DVH (Doble Vidriado Hermético)',
    colocacion: 'Con colocación en obra',
    estado: 'Enviado por WhatsApp',
    total: 'A Convenir'
  });

  // ----------------------------------------------------
  // ESTILOS VISUALES CORPORATIVOS CD ALUMINIO
  // ----------------------------------------------------
  [sheetInst, sheetProd, sheetRec, sheetHist].forEach(sheet => {
    // Encabezado
    const headerRow = sheet.getRow(1);
    headerRow.height = 32;
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF18181B' } // Negro carbón oficial
      };
      cell.font = {
        name: 'Segoe UI',
        size: 11,
        bold: true,
        color: { argb: 'FFFFFFFF' } // Blanco
      };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true
      };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFD4D4D8' } },
        bottom: { style: 'medium', color: { argb: 'FFE85D04' } }, // Naranja CD Aluminio
        left: { style: 'thin', color: { argb: 'FF3F3F46' } },
        right: { style: 'thin', color: { argb: 'FF3F3F46' } }
      };
    });

    // Filas de datos
    for (let r = 2; r <= sheet.rowCount; r++) {
      const row = sheet.getRow(r);
      row.height = 26;
      const isEven = r % 2 === 0;
      row.eachCell({ includeEmpty: true }, (cell) => {
        cell.font = {
          name: 'Segoe UI',
          size: 10,
          color: { argb: 'FF18181B' }
        };
        cell.alignment = {
          vertical: 'middle',
          horizontal: 'left',
          wrapText: true
        };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFE4E4E7' } },
          bottom: { style: 'thin', color: { argb: 'FFE4E4E7' } },
          left: { style: 'thin', color: { argb: 'FFE4E4E7' } },
          right: { style: 'thin', color: { argb: 'FFE4E4E7' } }
        };
        if (!isEven) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF9FAFB' }
          };
        }
      });
    }
  });

  const targetPath = path.resolve('CD_Aluminio_Maestro_Precios_Drive.xlsx');
  await workbook.xlsx.writeFile(targetPath);
  console.log(`Excel oficial CD Aluminio generado con éxito con Hoja de Instrucciones en: ${targetPath}`);
}

createStyledWorkbook().catch(err => {
  console.error('Error generando Excel:', err);
  process.exit(1);
});
