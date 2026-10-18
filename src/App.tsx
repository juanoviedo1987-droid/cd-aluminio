import { useState } from 'react';
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
  X
} from './components/Icons';

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

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center text-slate-800 font-sans selection:bg-orange-500 selection:text-white">
      {/* Marco Mobile-First ejecutivo: Negro, Blanco y Naranja */}
      <div className="w-full max-w-md bg-white border-x border-slate-200 shadow-xl flex flex-col min-h-screen relative pb-28">

        {/* HEADER CORPORATIVO (Fondo Negro con Logo Oficial y Acento Naranja) */}
        <header className="bg-black text-white px-4 py-3 sticky top-0 z-30 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={DATOS_EMPRESA.logoLocal}
                alt="CD Aluminio"
                className="w-11 h-11 object-contain drop-shadow"
              />
              <div>
                <h1 className="text-base font-black tracking-tight leading-none text-white">
                  CD <span className="text-orange-500">ALUMINIO</span>
                </h1>
                <p className="text-[10px] text-slate-400 tracking-wider font-medium uppercase mt-0.5">
                  Carpintería en Aluminio
                </p>
              </div>
            </div>

            <a
              href={`https://wa.me/${DATOS_EMPRESA.whatsappNumero}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-full text-xs font-bold transition active:scale-95 shadow-sm"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>095 262 858</span>
            </a>
          </div>

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-800 text-[11px] text-neutral-400">
            <span className="flex items-center gap-1 truncate">
              <MapPin className="w-3 h-3 text-orange-500 shrink-0" />
              Gral. Flores 2979, Montevideo
            </span>
            <span className="text-orange-400 font-semibold">
              Cotizador Oficial
            </span>
          </div>
        </header>

        {/* CONTENIDO PRINCIPAL: FORMULARIO LIMPIO CON SELECTORES DESPLEGABLES */}
        <main className="p-4 space-y-3.5 flex-1">

          {/* 1. SELECTOR PRINCIPAL DE PRODUCTO (Desplegable escalable a 12 productos) */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 shadow-sm">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              1. Producto a Cotizar
            </label>
            <div className="relative">
              <select
                value={productoSeleccionado}
                onChange={(e) => setProductoSeleccionado(e.target.value)}
                className="w-full min-h-[48px] bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition shadow-inner"
              >
                {CATALOGO_PRODUCTOS.map((p) => (
                  <option key={p.id} value={p.id} disabled={!p.activo}>
                    {p.nombre} {!p.activo ? '(Próximamente)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 2. LÍNEA / SERIE DE PERFILERÍA */}
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              2. Línea / Serie de Perfiles
            </label>
            <select
              value={config.serie}
              onChange={(e) => setConfig({ ...config, serie: e.target.value as SerieAluminio })}
              className="w-full min-h-[48px] bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
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

          {/* 3. TERMINACIÓN / COLOR DEL ALUMINIO */}
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              3. Color / Terminación
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(COLORES) as ColorAluminio[]).map((key) => {
                const isSelected = config.color === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setConfig({ ...config, color: key })}
                    className={`min-h-[48px] px-3 py-2 rounded-lg border flex items-center gap-2.5 transition active:scale-95 text-left ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50/70 text-slate-900 ring-2 ring-orange-500/20 font-bold'
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

          {/* 4. MEDIDA ESTÁNDAR (ANCHO X ALTO) EN DESPLEGABLE COMPACTO */}
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                4. Medida Estándar (Ancho x Alto)
              </label>
              <span className="text-[11px] text-slate-500 font-medium">mm</span>
            </div>
            <select
              value={config.medidaId}
              onChange={(e) => setConfig({ ...config, medidaId: e.target.value })}
              className="w-full min-h-[48px] bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
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

          {/* 5. TIPO DE VIDRIO */}
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              5. Tipo de Vidrio
            </label>
            <select
              value={config.vidrio}
              onChange={(e) => setConfig({ ...config, vidrio: e.target.value as TipoVidrio })}
              className="w-full min-h-[48px] bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
            >
              {(Object.keys(VIDRIOS) as TipoVidrio[]).map((key) => (
                <option key={key} value={key}>
                  {VIDRIOS[key].nombre}
                </option>
              ))}
            </select>
          </div>

        </main>

        {/* BARRA INFERIOR FLOTANTE DE TOTAL (STICKY BOTTOM CON PULGAR) */}
        <footer className="fixed bottom-0 left-0 right-0 z-40 flex justify-center bg-white/95 backdrop-blur-md border-t border-slate-200 safe-bottom shadow-lg">
          <div className="w-full max-w-md px-4 py-3 flex items-center justify-between gap-3">
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
              className="min-h-[46px] px-5 py-2.5 bg-black hover:bg-neutral-800 text-white font-bold rounded-xl shadow-md flex items-center gap-2 transition active:scale-95 text-xs sm:text-sm border border-neutral-700"
            >
              <FileText className="w-4 h-4 text-orange-500" />
              <span>Ver Presupuesto</span>
            </button>
          </div>
        </footer>

        {/* MODAL DEL PRESUPUESTO FORMAL MEMBRETADO */}
        {mostrarModal && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="w-full max-w-md bg-white text-slate-900 rounded-t-3xl sm:rounded-2xl max-h-[92vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-200 overflow-hidden">
              
              {/* ENCABEZADO DEL MODAL */}
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

              {/* DETALLE FORMAL MEMBRETADO */}
              <div className="p-5 overflow-y-auto space-y-4 text-xs">
                
                {/* LOGO Y DATOS FISCALES */}
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

                {/* VIGENCIA Y EMISIÓN */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between items-center text-[11px]">
                  <div>
                    <span className="text-slate-500 block">Fecha de Emisión:</span>
                    <span className="font-bold text-slate-800">
                      {new Date().toLocaleDateString('es-UY', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 block">Validez Presupuesto:</span>
                    <span className="font-bold text-orange-600">
                      15 días corridos
                    </span>
                  </div>
                </div>

                {/* TABLA TÉCNICA */}
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
                  <p>• Retiro en taller en Gral. Flores 2979, Montevideo.</p>
                  <p>• Los presupuestos no incluyen flete ni colocación en obra salvo previa coordinación.</p>
                </div>

              </div>

              {/* BOTONES DE SALIDA (WHATSAPP + COPIAR TEXTO) */}
              <div className="p-4 border-t border-slate-200 bg-slate-50 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleCopiar}
                  className="min-h-[46px] px-3 py-2 border border-slate-300 hover:bg-slate-200 text-slate-800 font-bold rounded-xl flex items-center justify-center gap-1.5 transition active:scale-95 text-xs bg-white shadow-sm"
                >
                  {copiado ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiado ? '¡Copiado!' : 'Copiar Texto'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleWhatsApp}
                  className="min-h-[46px] px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/30 transition active:scale-95 text-xs"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar WhatsApp</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
