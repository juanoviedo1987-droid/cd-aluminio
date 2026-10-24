const fs = require('fs');

// CSV 0: Instructivo
const csv0 = [
  'Paso / Sección,Instrucción para el Personal de CD Aluminio,Impacto Automático en la Web App',
  '"1. Carga de Precios Base","En la pestaña ""1. Catálogo y Precios Base"", ingresar el valor en pesos uruguayos ($ UYU) en la columna ""Precio Base Taller"". Si un producto es sobre diseño, dejar vacío o poner ""A convenir"".","La Web App toma este precio como punto de partida oficial para cotizar en tiempo real a clientes y vendedores."',
  '"2. Activar o Pausar Productos","En la columna ""Estado en App"", colocar ""ACTIVO"" para que se vea en el cotizador, o ""PAUSADO"" si temporalmente no hay stock de perfilería o herrajes para esa abertura.","Los productos pausados se ocultan automáticamente del cotizador web sin borrar sus datos ni su historial."',
  '"3. Factores y Recargos","En la pestaña ""2. Recargos y Factores"", ajustar los porcentajes de incremento según la serie (S20 económica, S30 reforzada, A82, Probba, Gala CR), los colores de pintura o el vidrio.","Al seleccionar una serie o terminación especial en la web, el sistema calcula el recargo automáticamente con la fórmula del taller."',
  '"4. Historial de Cotizaciones","En la pestaña ""3. Historial de Cotizaciones"", revisar los presupuestos generados desde la web. Quedan asentados con fecha, cliente, medidas exactas y detalle de materiales.","Funciona como libro de pedidos y seguimiento comercial para que el taller no pierda ninguna cotización emitida."',
  '"5. Soporte y Asistencia","Cualquier duda o ajuste técnico en el sistema, contactar al equipo de soporte de AGN / Antigravity.","Garantía y mantenimiento continuo bajo el abono mensual activo."'
].join('\n');
fs.writeFileSync('sheet0_instructivo.csv', csv0);

// CSV 1: Catálogo
const csv1 = [
  'ID Producto,Nombre del Producto / Abertura,Categoría,Series Compatibles (Excel),Cristales Compatibles,Precio Base Taller ($ UYU),Unidad de Cotización,Plazo Estimado (Días),Requiere Medición en Obra,Estado en App,Notas Técnicas de Taller',
  'V-CORR-2H,Ventana Corrediza (2 Hojas),Ventanas,"S20, S25, A82, Probba, Gala CR","4mm, 5mm, Policarbonatos",,Unidad,7 a 10 días,Recomendable,ACTIVO,Línea estándar tradicional más vendida',
  'V-CORR-3H,Ventana Corrediza (3 Hojas),Ventanas,"S25, A82, Probba, Gala CR","4mm a 8mm, DVH, Policarbonatos",,Unidad,10 a 12 días,Recomendable,ACTIVO,Guía de 3 vías reforzada',
  'V-CORR-4H,Ventana Corrediza (4 Hojas),Ventanas,"S25, A82, Probba, Gala CR","4mm a 8mm, DVH, Policarbonatos",,Unidad,10 a 14 días,Recomendable,ACTIVO,Cierre central y lateral',
  'V-PANO-FIJO,Paño Fijo,Ventanas,"S30, A82, Probba, Gala CR","4mm, 5mm, 6mm, DVH, Policarbonatos",,m²,7 a 10 días,Obligatoria,ACTIVO,Serie 30 reforzada',
  'V-BATIENTE,Ventana Batiente,Ventanas,S30,"4mm, 5mm, 6mm, DVH, Policarbonatos",,Unidad,10 a 12 días,Recomendable,ACTIVO,Hermética con burlete perimetral',
  'V-TABAQUERA,Ventana Tabaquera,Ventanas,S30,"4mm, 5mm, 6mm, 8mm, DVH, Policarbonatos",,Unidad,7 a 10 días,Recomendable,ACTIVO,Apertura superior basculante',
  'V-PROYECTANTE,Ventana Proyectante,Ventanas,"S30, Probba, Gala CR","4mm a 8mm, DVH, Policarbonatos",,Unidad,10 a 12 días,Recomendable,ACTIVO,Brazos de fricción de acero inox',
  'V-GUILLOTINA,Ventana Guillotina,Ventanas,"A82, Probba, Gala CR","4mm a 8mm, DVH, Policarbonatos",,Unidad,12 a 15 días,Obligatoria,ACTIVO,Sistema contrapesado vertical',
  'ESP-BAJO-BAT,Bajo Mesada (Batiente),Especiales,S30,"4mm, Policarbonatos",,Metro lineal,10 a 15 días,Obligatoria,ACTIVO,Mueble en aluminio con puertas batientes',
  'ESP-BAJO-CORR,Bajo Mesada (Corredizo),Especiales,S20,"4mm, Policarbonatos",,Metro lineal,10 a 15 días,Obligatoria,ACTIVO,Guías corredizas embutidas',
  'P-MITAD-VIDRIO,Puerta Mitad Aluminio y Mitad Cristal,Puertas,S30,"4mm, 5mm, 6mm, DVH, Policarbonatos",,Unidad,10 a 14 días,Obligatoria,ACTIVO,Puerta mixta residencial / taller',
  'P-CIEGA,Puerta Toda Ciega en Aluminio,Puertas,S30,Sin Cristal / No Aplica,,Unidad,10 a 14 días,Obligatoria,ACTIVO,Tubular machihembrado reforzado',
  'P-CRISTAL,Puerta en Cristal,Puertas,S30,"4mm, 5mm, 6mm, DVH, Policarbonatos",,Unidad,12 a 15 días,Obligatoria,ACTIVO,Herrajes pesados y manijón',
  'P-GRANERO,Puerta Estilo Granero (Interior),Puertas,S30,"4mm, 5mm, 6mm, DVH, Policarbonatos",,Unidad,12 a 15 días,Obligatoria,ACTIVO,Guía aérea suspendida de diseño negro',
  'SIS-MONO-PVC,Sistema Monoblock (Cortina PVC),Sistemas,"S20, S25, A82, Probba, Gala CR","4mm, 5mm, 6mm, DVH, Policarbonatos",,Unidad,10 a 14 días,Obligatoria,ACTIVO,Cajón compacto exterior/interior',
  'SIS-MONO-ALU,Sistema Monoblock (Cortina Aluminio),Sistemas,"S20, S25, A82, Probba, Gala CR","4mm, 5mm, 6mm, DVH, Policarbonatos",,Unidad,12 a 15 días,Obligatoria,ACTIVO,Lamas de aluminio rellenas con poliuretano',
  'MAMP-CRISTAL,Mampara de Cristal,Mamparas,"S30, Especial","4mm, 6mm, 8mm, Policarbonatos",,Unidad,10 a 12 días,Obligatoria,ACTIVO,Cristal templado para baño',
  'MAMP-ACRILICO,Mampara de Acrílico,Mamparas,"S20, Especial",Sin Cristal / No Aplica,,Unidad,7 a 10 días,Recomendable,ACTIVO,Placas de acrílico translúcido',
  'ESP-BARANDA,Baranda,Especiales,"S30, Especial","6mm, 8mm, Policarbonatos",,Metro lineal,12 a 18 días,Obligatoria,ACTIVO,Pasamanos tubular y cristal de seguridad',
  'SIS-ROLLERS,Cortina Rollers,Sistemas,Especial,Sin Cristal / No Aplica,,m²,7 a 10 días,Recomendable,ACTIVO,Blackout o Sunscreen con comando',
  'ESP-TECHO-FIJO,Techo Fijo,Especiales,"S30, Especial","Policarbonatos, 8mm",,m²,15 a 20 días,Obligatoria,ACTIVO,Estructura autoportante de aluminio',
  'ESP-TECHO-AUTO,Techo Automatizado,Especiales,"S30, Especial","Policarbonatos, 8mm",,m²,18 a 25 días,Obligatoria,ACTIVO,Apertura con motorización remota',
  'ESP-HERRERIA,Herrería de Diseño,Especiales,"S30, Especial",Opcional / A definir,,A convenir,A convenir,Obligatoria,ACTIVO,Portones, rejas y cerramientos especiales'
].join('\n');
fs.writeFileSync('sheet1_catalogo.csv', csv1);

// CSV 2: Recargos
const csv2 = [
  'Tipo de Parámetro,Nombre del Parámetro,Tipo de Ajuste,Valor / Porcentaje,Descripción para el Cliente,Activo en App',
  'Línea / Serie,Serie 20,Factor Multiplicador,-15% (Económica),Línea residencial liviana,SI',
  'Línea / Serie,Serie 25,Base de Cálculo,0% (Base),Línea tradicional de mayor salida,SI',
  'Línea / Serie,Serie 30,Factor Multiplicador,+30% (Reforzada),Perfilería robusta para puertas y batientes,SI',
  'Línea / Serie,Línea A82 (Alta Prestación),Factor Multiplicador,+45%,Aislación superior y hermeticidad,SI',
  'Línea / Serie,Línea Probba (Alta Prestación),Factor Multiplicador,+60%,Grandes luces y resistencia al viento,SI',
  'Línea / Serie,Línea Gala CR (Alta Prestación),Factor Multiplicador,+75%,Máxima aislación con rotura puente térmico,SI',
  'Color / Terminación,Anodizado Natural,Color Base,0%,Plata mate anticorrosión tradicional,SI',
  'Color / Terminación,Blanco,Pintura Horneada,Consultar taller,Pintura electrostática blanca,SI',
  'Color / Terminación,Negro,Pintura Horneada,Consultar taller,Pintura electrostática microtexturada,SI',
  'Color / Terminación,Anolock,Anodizado Oscuro,+10% est.,Anodizado marrón bronce oscuro,SI',
  'Color / Terminación,Pintura electrostática,Color Especial,Consultar carta RAL,Carta de colores especiales a elección,SI',
  'Cristal / Vidrio,Cristal 4mm,Cristal Base,Base,Cristal flotado incoloro estándar 4 mm,SI',
  'Cristal / Vidrio,Cristal 5mm,Cristal Flotado,A convenir,Cristal flotado incoloro 5 mm,SI',
  'Cristal / Vidrio,Cristal 6mm,Cristal Templado/Flotado,A convenir,Mayor rigidez y resistencia,SI',
  'Cristal / Vidrio,Cristal 8mm,Cristal de Seguridad,A convenir,Templado o laminado de seguridad,SI',
  'Cristal / Vidrio,DVH (Doble Vidriado Hermético),Cámara Aislante,+25% est.,Doble vidrio con cámara termoacústica,SI',
  'Cristal / Vidrio,Policarbonato alveolar,Placa Liviana,A convenir,Placa alveolar para techos,SI',
  'Cristal / Vidrio,Policarbonato compacto,Placa Antivandálica,A convenir,Ultra resistente al impacto,SI',
  'Servicio en Obra,Colocación en Obra (Montevideo),Mano de Obra,A coordinar,Instalación y ajuste en obra con foto previa,SI',
  'Servicio en Obra,Retiro en Taller,Sin Costo,$ 0,Retiro en taller oficial Gral. Flores 2979,SI'
].join('\n');
fs.writeFileSync('sheet2_recargos.csv', csv2);

// CSV 3: Historial
const csv3 = [
  'Nº Presupuesto,Fecha y Hora,Cliente / Contacto,Producto Solicitado,Línea / Serie,Color,Medidas (Ancho x Alto),Cristal,Colocación,Estado,Total ($ UYU)',
  'CD-2026-001,24/10/2026 15:40,Consulta WhatsApp,Ventana Corrediza (3 Hojas),Línea A82 (Alta Prestación),Anolock,150 cm x 120 cm,DVH (Doble Vidriado Hermético),Con colocación en obra,Enviado por WhatsApp,A Convenir'
].join('\n');
fs.writeFileSync('sheet3_historial.csv', csv3);

console.log('CSVs generados exitosamente.');
