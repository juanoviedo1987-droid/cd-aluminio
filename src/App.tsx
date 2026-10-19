import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import {
  CATALOGO_PRODUCTOS,
  MEDIDAS_ESTANDAR,
  FACTORES_SERIE,
  COLORES,
  VIDRIOS,
  DATOS_EMPRESA,
  calcularPresupuesto,
  formatearMoneda,
  generarTextoWhatsApp,
} from './data/pricingData';
import type { QuoteConfig, SerieAluminio, ColorAluminio, TipoVidrio } from './types/pricing';
import {
  Phone,
  MapPin,
  Check,
  Send,
  FileText,
  ShieldCheck,
  Copy,
  X,
  ImageIcon,
  FileDown
} from './components/Icons';

const FECHA_EMISION_HOY = new Date().toLocaleDateString('es-UY', { day: '2-digit', month: '2-digit', year: 'numeric' });

export default function App() {
  const [productoSeleccionado, setProductoSeleccionado] = useState('ventana-corrediza');
  const [config, setConfig] = useState<QuoteConfig>({
    medidaId: '1000x1200',
    serie: 'S25',
    color: 'natural',
    vidrio: 'simple',
    conColocacion: false,
  });

  const [mostrarModal, setMostrarModal] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [generandoPDF, setGenerandoPDF] = useState(false);
  const [generandoImg, setGenerandoImg] = useState(false);

  const modalHojaRef = useRef<HTMLDivElement>(null);

  const breakdown = calcularPresupuesto(config);

  const handleCopiar = () => {
    const textoDecodificado = decodeURIComponent(generarTextoWhatsApp(breakdown));
    navigator.clipboard.writeText(textoDecodificado);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  };

  const handleWhatsApp = () => {
    const texto = generarTextoWhatsApp(breakdown);
    window.open(`https://wa.me/${DATOS_EMPRESA.whatsappNumero}?text=${texto}`, '_blank');
  };

  const handleDescargarImagen = async () => {
    if (!modalHojaRef.current) return;
    setGenerandoImg(true);
    try {
      const canvas = await html2canvas(modalHojaRef.current, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const link = document.createElement('a');
      link.download = `Presupuesto_CD_Aluminio_${breakdown.serieNombre}_${breakdown.medida.ancho}x${breakdown.medida.alto}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Error generando imagen:', err);
    } finally {
      setGenerandoImg(false);
    }
  };

  const handleDescargarPDF = async () => {
    if (!modalHojaRef.current) return;
    setGenerandoPDF(true);
    try {
      const canvas = await html2canvas(modalHojaRef.current, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/jpeg', 0.82);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      pdf.save(`Presupuesto_CD_Aluminio_${breakdown.serieNombre}_${breakdown.medida.ancho}x${breakdown.medida.alto}.pdf`);
    } catch (err) {
      console.error('Error generando PDF:', err);
    } finally {
      setGenerandoPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans selection:bg-orange-500 selection:text-white flex flex-col">
      
      {/* HEADER CORPORATIVO FULL-WIDTH CON CONTENIDO CENTRADO */}
      <header className="bg-black text-white px-4 lg:px-8 py-3 sticky top-0 z-30 shadow-md border-b border-neutral-800">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={DATOS_EMPRESA.logoLocal}
              alt="CD Aluminio"
              className="w-11 h-11 lg:w-12 lg:h-12 object-contain drop-shadow"
            />
            <div>
              <h1 className="text-base lg:text-lg font-black tracking-tight leading-none text-white">
                CD <span className="text-orange-500">ALUMINIO</span>
              </h1>
              <p className="text-[10px] lg:text-xs text-slate-400 tracking-wider font-medium uppercase mt-0.5">
                Carpintería en Aluminio &bull; Montevideo
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:flex items-center gap-1.5 text-xs text-neutral-300">
              <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
              Gral. Flores 2979, Montevideo
            </span>
            <a
              href={`https://wa.me/${DATOS_EMPRESA.whatsappNumero}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white px-3.5 py-1.5 rounded-full text-xs font-bold transition active:scale-95 shadow-sm"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>095 262 858</span>
            </a>
          </div>
        </div>
      </header>

      {/* CONTENEDOR PRINCIPAL: MOBILE-FIRST (1 COLUMNA) Y DESKTOP (2 COLUMNAS EJECUTIVAS) */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-6 lg:p-8 pb-32 md:pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* COLUMNA IZQUIERDA: CONFIGURADOR FORMULARIO */}
          <div className="md:col-span-7 lg:col-span-8 space-y-4">
            
            <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-sm font-bold text-black uppercase tracking-wider">
                  Configuración de Abertura
                </h2>
                <p className="text-xs text-slate-500">
                  Seleccione las especificaciones técnicas para cotizar en tiempo real.
                </p>
              </div>

              {/* 1. PRODUCTO */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  1. Producto a Cotizar
                </label>
                <select
                  value={productoSeleccionado}
                  onChange={(e) => setProductoSeleccionado(e.target.value)}
                  className="w-full min-h-[48px] bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                >
                  {CATALOGO_PRODUCTOS.map((p) => (
                    <option key={p.id} value={p.id} disabled={!p.activo}>
                      {p.nombre} {!p.activo ? '(Próximamente)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. LÍNEA / SERIE */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  2. Línea / Serie de Perfilería
                </label>
                <select
                  value={config.serie}
                  onChange={(e) => setConfig({ ...config, serie: e.target.value as SerieAluminio })}
                  className="w-full min-h-[48px] bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                >
                  {(Object.keys(FACTORES_SERIE) as SerieAluminio[]).map((key) => (
                    <option key={key} value={key}>
                      {FACTORES_SERIE[key].nombre}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-1 italic">
                  {FACTORES_SERIE[config.serie].desc}
                </p>
              </div>

              {/* 3. TERMINACIÓN / COLOR */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  3. Color / Terminación del Aluminio
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {(Object.keys(COLORES) as ColorAluminio[]).map((key) => {
                    const isSelected = config.color === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setConfig({ ...config, color: key })}
                        className={`min-h-[48px] px-3.5 py-2 rounded-xl border flex items-center gap-2.5 transition active:scale-95 text-left ${
                          isSelected
                            ? 'border-orange-500 bg-orange-50 text-slate-900 ring-2 ring-orange-500/20 font-bold'
                            : 'border-slate-300 bg-slate-50 text-slate-700 hover:border-slate-400'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-slate-400 shrink-0 shadow-sm"
                          style={{ backgroundColor: COLORES[key].hex }}
                        />
                        <span className="text-xs truncate">{COLORES[key].nombre.split(' (')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. MEDIDA ESTÁNDAR */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    4. Medida Estándar (Ancho x Alto)
                  </label>
                  <span className="text-[11px] text-slate-500 font-medium">mm</span>
                </div>
                <select
                  value={config.medidaId}
                  onChange={(e) => setConfig({ ...config, medidaId: e.target.value })}
                  className="w-full min-h-[48px] bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                >
                  {MEDIDAS_ESTANDAR.map((m) => {
                    const base = config.color === 'natural' ? m.precioBaseNatural : m.precioBaseAnolok;
                    return (
                      <option key={m.id} value={m.id}>
                        {m.label} — Base S25: {formatearMoneda(base)}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* 5. VIDRIO */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  5. Tipo de Vidrio
                </label>
                <select
                  value={config.vidrio}
                  onChange={(e) => setConfig({ ...config, vidrio: e.target.value as TipoVidrio })}
                  className="w-full min-h-[48px] bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                >
                  {(Object.keys(VIDRIOS) as TipoVidrio[]).map((key) => (
                    <option key={key} value={key}>
                      {VIDRIOS[key].nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* 6. SERVICIO DE COLOCACIÓN EN OBRA (SWITCH TÁCTIL ESTILO IOS) */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  6. Servicio de Colocación en Obra
                </label>

                <div 
                  onClick={() => setConfig(prev => ({ ...prev, conColocacion: !prev.conColocacion }))}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all cursor-pointer select-none min-h-[58px] ${
                    config.conColocacion 
                      ? 'bg-orange-50 border-orange-500 shadow-sm' 
                      : 'bg-slate-50 border-slate-300 hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base transition-colors ${
                      config.conColocacion ? 'bg-orange-500 text-white shadow-xs' : 'bg-slate-200 text-slate-500'
                    }`}>
                      🔧
                    </div>
                    <div className="text-xs">
                      <span className="font-extrabold text-slate-900 block text-sm">
                        {config.conColocacion ? 'Con Colocación (+ $ 1.800 UYU est.)' : 'Sin Colocación (Retiro en Taller)'}
                      </span>
                      <span className="text-slate-500 font-medium">
                        {config.conColocacion ? 'Instalación y ajuste en obra en Montevideo' : 'Retiro por taller en Gral. Flores 2979'}
                      </span>
                    </div>
                  </div>

                  {/* Switch iOS Táctil */}
                  <div className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 shrink-0 ${
                    config.conColocacion ? 'bg-orange-500' : 'bg-slate-300'
                  }`}>
                    <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center text-[10px] font-bold ${
                      config.conColocacion ? 'translate-x-6 text-orange-600' : 'translate-x-0 text-slate-400'
                    }`}>
                      {config.conColocacion ? 'SÍ' : 'NO'}
                    </div>
                  </div>
                </div>

                {/* Banner de Foto de Sustitución si hay Colocación */}
                {config.conColocacion && (
                  <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-3.5 flex items-start gap-2.5 text-amber-950 shadow-xs animate-in fade-in duration-200">
                    <span className="text-xl leading-none shrink-0">📸</span>
                    <div className="text-xs leading-snug">
                      <strong className="font-bold text-amber-900 block mb-0.5">Foto obligatoria para colocación:</strong>
                      <span>Al enviar el presupuesto por WhatsApp, el cliente debe adjuntar una foto del vano o abertura a sustituir para validar encastre y fijaciones.</span>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* COLUMNA DERECHA (DESKTOP): RESUMEN EJECUTIVO Y PRESUPUESTO EN VIVO */}
          <div className="md:col-span-5 lg:col-span-4 space-y-4">
            
            {/* PANEL LATERAL DE RESUMEN (VISIBLE EN PANTALLAS GRANDES) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 md:sticky md:top-24">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Resumen de Cotización
                </span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  En Tiempo Real
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Producto:</span>
                  <span className="font-semibold text-slate-900">Ventana Corrediza</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Línea:</span>
                  <span className="font-semibold text-slate-900">{breakdown.serieNombre}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Color:</span>
                  <span className="font-semibold text-slate-900">{breakdown.colorNombre}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Medida:</span>
                  <span className="font-semibold text-slate-900">{breakdown.medida.ancho} x {breakdown.medida.alto} mm</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Vidrio:</span>
                  <span className="font-semibold text-slate-900">{breakdown.vidrioNombre}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Colocación:</span>
                  <span className={`font-semibold ${breakdown.costoColocacion > 0 ? 'text-orange-600' : 'text-slate-900'}`}>
                    {breakdown.costoColocacion > 0 ? '+ $ 1.800 UYU (En obra)' : 'Sin colocación (Taller)'}
                  </span>
                </div>
              </div>

              {/* CAJA DE TOTAL */}
              <div className="bg-neutral-900 text-white rounded-xl p-4 shadow-md">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                  Total Estimado ($ UYU)
                </span>
                <div className="text-3xl font-black text-orange-400 leading-none">
                  {formatearMoneda(breakdown.totalFinal)}
                  <span className="text-xs font-bold text-neutral-300 ml-1">UYU</span>
                </div>
                <p className="text-[10px] text-neutral-400 mt-2">
                  Retiro sin costo en taller Gral. Flores 2979.
                </p>
              </div>

              {/* BOTÓN FORMAL DESKTOP */}
              <button
                type="button"
                onClick={() => setMostrarModal(true)}
                className="w-full min-h-[48px] bg-black hover:bg-neutral-800 text-white font-bold rounded-xl shadow flex items-center justify-center gap-2 transition active:scale-95 text-sm border border-neutral-700"
              >
                <FileText className="w-4 h-4 text-orange-500" />
                <span>Generar Presupuesto Formal</span>
              </button>

              <button
                type="button"
                onClick={handleWhatsApp}
                className="w-full min-h-[44px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-sm flex items-center justify-center gap-2 transition active:scale-95 text-xs"
              >
                <Send className="w-4 h-4" />
                <span>Enviar Directo por WhatsApp</span>
              </button>
            </div>

          </div>

        </div>
      </main>

      {/* FOOTER FLOTANTE SOLO EN MOBILE (OCULTO EN PANTALLAS MD/DESKTOP) */}
      <footer className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 safe-bottom shadow-lg px-4 py-3 flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">
            Total Estimado
          </span>
          <div className="text-2xl font-black text-black leading-none">
            {formatearMoneda(breakdown.totalFinal)}
            <span className="text-xs font-bold text-orange-600 ml-1">UYU</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMostrarModal(true)}
          className="min-h-[46px] px-4 py-2.5 bg-black hover:bg-neutral-800 text-white font-bold rounded-xl shadow-md flex items-center gap-2 transition active:scale-95 text-xs border border-neutral-700"
        >
          <FileText className="w-4 h-4 text-orange-500" />
          <span>Ver Presupuesto</span>
        </button>
      </footer>

      {/* MODAL DEL PRESUPUESTO FORMAL MEMBRETADO (RESPONSIVE EN MÓVIL Y PC) */}
      {mostrarModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-lg bg-white text-slate-900 rounded-t-3xl sm:rounded-2xl max-h-[92vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-200 overflow-hidden">
            
            {/* ENCABEZADO MODAL */}
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-black text-white">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-orange-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Presupuesto Oficial CD Aluminio
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMostrarModal(false)}
                className="w-8 h-8 rounded-full bg-neutral-800 text-neutral-300 hover:text-white flex items-center justify-center active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* CUERPO MODAL MEMBRETADO (IMPRIMIBLE / EXPORTABLE) */}
            <div ref={modalHojaRef} className="p-6 overflow-y-auto space-y-4 text-xs bg-white">
              
              {/* LOGO Y DATOS EMPRESA */}
              <div className="text-center pb-3 border-b border-slate-200">
                <img
                  src={DATOS_EMPRESA.logoLocal}
                  alt="CD Aluminio"
                  className="w-16 h-16 mx-auto object-contain mb-1 drop-shadow"
                />
                <h3 className="font-black text-base text-black tracking-tight">
                  CD <span className="text-orange-600">ALUMINIO</span>
                </h3>
                <div className="text-[11px] text-slate-600 font-medium">
                  {DATOS_EMPRESA.rubro}
                </div>
                <div className="text-[11px] text-slate-500">
                  {DATOS_EMPRESA.direccion} | WhatsApp: {DATOS_EMPRESA.whatsappDisplay}
                </div>
              </div>

              {/* FECHA Y VALIDEZ */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between items-center text-[11px]">
                <div>
                  <span className="text-slate-500 block">Fecha de Emisión:</span>
                  <span className="font-bold text-slate-800">
                    {FECHA_EMISION_HOY}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block">Validez Presupuesto:</span>
                  <span className="font-bold text-orange-600">
                    15 días corridos
                  </span>
                </div>
              </div>

              {/* DETALLE TÉCNICO */}
              <div>
                <h4 className="font-bold text-slate-700 uppercase text-[10px] tracking-wider mb-2">
                  Especificación de la Abertura
                </h4>
                <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden bg-white">
                  <div className="p-2.5 flex justify-between">
                    <span className="text-slate-500">Abertura:</span>
                    <span className="font-bold text-slate-900">Ventana Corrediza (2 Hojas)</span>
                  </div>
                  <div className="p-2.5 flex justify-between">
                    <span className="text-slate-500">Línea de Perfil:</span>
                    <span className="font-bold text-slate-900">{breakdown.serieNombre}</span>
                  </div>
                  <div className="p-2.5 flex justify-between">
                    <span className="text-slate-500">Terminación:</span>
                    <span className="font-bold text-slate-900">{breakdown.colorNombre}</span>
                  </div>
                  <div className="p-2.5 flex justify-between">
                    <span className="text-slate-500">Dimensiones:</span>
                    <span className="font-bold text-slate-900">{breakdown.medida.ancho} x {breakdown.medida.alto} mm</span>
                  </div>
                  <div className="p-2.5 flex justify-between">
                    <span className="text-slate-500">Cristal:</span>
                    <span className="font-bold text-slate-900">{breakdown.vidrioNombre}</span>
                  </div>
                  <div className="p-2.5 flex justify-between bg-slate-50/50">
                    <span className="text-slate-500">Colocación:</span>
                    <span className={`font-bold ${breakdown.costoColocacion > 0 ? 'text-orange-600' : 'text-slate-900'}`}>
                      {breakdown.costoColocacion > 0 ? '+ $ 1.800 UYU (En obra)' : 'Sin colocación (Retiro en taller)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* TOTAL */}
              <div className="bg-neutral-900 text-white p-3.5 rounded-xl flex items-center justify-between shadow-sm">
                <span className="font-bold text-sm tracking-wide">TOTAL COTIZADO:</span>
                <span className="text-xl font-black text-orange-400">
                  {formatearMoneda(breakdown.totalFinal)} <span className="text-xs text-white">UYU</span>
                </span>
              </div>

              {/* CONDICIONES */}
              <div className="text-[10px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1">
                <p className="font-bold text-slate-800">• Forma de Pago: {DATOS_EMPRESA.condicionesPago}.</p>
                <p>• {breakdown.costoColocacion > 0 ? 'Colocación en obra sujeta a validación técnica previa con foto del vano.' : 'Retiro en taller en Gral. Flores 2979, Montevideo.'}</p>
                <p>• Validez de la cotización: {breakdown.vigenciaDias} días corridos.</p>
              </div>

            </div>

            {/* BOTONES ACCIÓN MULTI-FORMATO (WHATSAPP, PDF, IMAGEN, COPIAR) */}
            <div className="p-3.5 sm:p-4 border-t border-slate-200 bg-slate-50 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleWhatsApp}
                className="min-h-[46px] px-3 py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition text-xs"
              >
                <Send className="w-4 h-4" />
                <span>WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleDescargarPDF}
                disabled={generandoPDF}
                className="min-h-[46px] px-3 py-2 bg-red-600 hover:bg-red-500 active:scale-95 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition text-xs disabled:opacity-50"
              >
                <FileDown className="w-4 h-4" />
                <span>{generandoPDF ? 'Generando...' : 'Descargar PDF'}</span>
              </button>

              <button
                type="button"
                onClick={handleDescargarImagen}
                disabled={generandoImg}
                className="min-h-[46px] px-3 py-2 bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition text-xs disabled:opacity-50"
              >
                <ImageIcon className="w-4 h-4" />
                <span>{generandoImg ? 'Generando...' : 'Guardar Imagen'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopiar}
                className="min-h-[46px] px-3 py-2 border border-slate-300 hover:bg-slate-200 active:scale-95 text-slate-800 font-bold rounded-xl flex items-center justify-center gap-1.5 transition text-xs bg-white shadow-sm"
              >
                {copiado ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiado ? '¡Copiado!' : 'Copiar Texto'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
