import { useState } from 'react';
import {
  MEDIDAS_ESTANDAR,
  FACTORES_SERIE,
  COLORES,
  VIDRIOS,
  COSTO_COLOCACION_MONTEVIDEO,
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
  Sparkles,
  ShieldCheck,
  Layers,
  Maximize2,
  Copy,
  X
} from './components/Icons';

export default function App() {
  // Estado del configurador
  const [activeTab, setActiveTab] = useState<'ventanas' | 'mamparas' | 'monoblock'>('ventanas');
  const [config, setConfig] = useState<QuoteConfig>({
    medidaId: '1000x1200',
    serie: 'S25',
    color: 'natural',
    vidrio: 'simple',
    conColocacion: false,
  });

  // Modal de Presupuesto Formal
  const [mostrarModal, setMostrarModal] = useState(false);
  const [copiado, setCopiado] = useState(false);

  // Cálculo reactivo en tiempo real
  const breakdown = calcularPresupuesto(config);

  const handleCopiar = () => {
    const textoDecodificado = decodeURIComponent(generarTextoWhatsApp(breakdown, config));
    navigator.clipboard.writeText(textoDecodificado);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  };

  const handleWhatsApp = () => {
    const texto = generarTextoWhatsApp(breakdown, config);
    window.open(`https://wa.me/${DATOS_EMPRESA.whatsappNumero}?text=${texto}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex justify-center selection:bg-orange-500 selection:text-white">
      {/* Contenedor Mobile-First (Centrado y contenido en móvil 360-440px o PC ejecutivo) */}
      <div className="w-full max-w-md bg-slate-900 border-x border-slate-800 shadow-2xl flex flex-col min-h-screen relative pb-28">

        {/* HEADER CORPORATIVO OFICIAL */}
        <header className="bg-slate-950 border-b border-slate-800 px-4 py-3 sticky top-0 z-30 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={DATOS_EMPRESA.logoUrl}
                alt="CD Aluminio"
                className="h-9 w-auto object-contain brightness-110 drop-shadow-sm"
              />
            </div>
            <a
              href={`https://wa.me/${DATOS_EMPRESA.whatsappNumero}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30 px-2.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition active:scale-95"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>095 262 858</span>
            </a>
          </div>

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
            <span className="flex items-center gap-1 truncate">
              <MapPin className="w-3 h-3 text-orange-500 shrink-0" />
              Gral. Flores 2979, Mvdeo
            </span>
            <span className="inline-flex items-center gap-1 text-orange-400 font-medium">
              <Sparkles className="w-3 h-3" />
              Cotizador Beta
            </span>
          </div>
        </header>

        {/* SELECTOR DE PRODUCTOS (PILLS TÁCTILES) */}
        <div className="px-4 pt-3 pb-1">
          <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('ventanas')}
              className={`min-h-[44px] py-2 px-1 rounded-lg font-medium transition flex flex-col items-center justify-center gap-0.5 ${
                activeTab === 'ventanas'
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Ventana</span>
              <span className="text-[10px] opacity-90 font-normal">Corrediza</span>
            </button>

            <button
              disabled
              className="min-h-[44px] py-2 px-1 rounded-lg text-slate-500 flex flex-col items-center justify-center gap-0.5 opacity-60 cursor-not-allowed"
            >
              <span>Mamparas</span>
              <span className="text-[9px] bg-slate-800 text-amber-400/90 px-1.5 py-0.2 rounded-full border border-amber-500/20">
                Próximamente
              </span>
            </button>

            <button
              disabled
              className="min-h-[44px] py-2 px-1 rounded-lg text-slate-500 flex flex-col items-center justify-center gap-0.5 opacity-60 cursor-not-allowed"
            >
              <span>Monoblock</span>
              <span className="text-[9px] bg-slate-800 text-amber-400/90 px-1.5 py-0.2 rounded-full border border-amber-500/20">
                Próximamente
              </span>
            </button>
          </div>
        </div>

        {/* CUERPO DEL CONFIGURADOR */}
        <main className="px-4 py-3 space-y-4">

          {/* 1. LÍNEA / SERIE */}
          <section className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3.5 shadow-sm">
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-orange-500" />
                1. Línea / Serie de Perfiles
              </label>
              <span className="text-[11px] text-orange-400 font-medium">
                {FACTORES_SERIE[config.serie].nombre}
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(FACTORES_SERIE) as SerieAluminio[]).map((serieKey) => {
                const item = FACTORES_SERIE[serieKey];
                const isSelected = config.serie === serieKey;
                return (
                  <button
                    key={serieKey}
                    type="button"
                    onClick={() => setConfig({ ...config, serie: serieKey })}
                    className={`min-h-[50px] p-2 rounded-xl text-left border transition active:scale-95 flex flex-col justify-between ${
                      isSelected
                        ? 'border-orange-500 bg-orange-500/10 text-white shadow-sm ring-1 ring-orange-500/40'
                        : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-bold text-xs">{item.nombre}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-orange-500" />}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {serieKey === 'S25' ? 'Estándar' : serieKey === 'S20' ? '-15% Econ' : '+30% Alta'}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-400 mt-2 italic">
              {FACTORES_SERIE[config.serie].desc}
            </p>
          </section>

          {/* 2. COLOR / TERMINACIÓN */}
          <section className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3.5 shadow-sm">
            <label className="block text-xs font-semibold text-slate-300 mb-2.5">
              2. Color / Terminación del Aluminio
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(COLORES) as ColorAluminio[]).map((colKey) => {
                const col = COLORES[colKey];
                const isSelected = config.color === colKey;
                return (
                  <button
                    key={colKey}
                    type="button"
                    onClick={() => setConfig({ ...config, color: colKey })}
                    className={`min-h-[48px] px-3 py-2 rounded-xl border flex items-center gap-2.5 transition active:scale-95 ${
                      isSelected
                        ? 'border-orange-500 bg-orange-500/10 text-white ring-1 ring-orange-500/40'
                        : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-slate-600 shadow-inner shrink-0"
                      style={{ backgroundColor: col.hex }}
                    />
                    <div className="text-left truncate">
                      <div className="text-xs font-bold truncate">{col.nombre}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 3. MEDIDAS ESTÁNDAR (ANCHO X ALTO) */}
          <section className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3.5 shadow-sm">
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5 text-orange-500" />
                3. Medida Estándar (Ancho x Alto)
              </label>
              <span className="text-[11px] text-slate-400">En milímetros</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {MEDIDAS_ESTANDAR.map((m) => {
                const isSelected = config.medidaId === m.id;
                const base = config.color === 'natural' ? m.precioBaseNatural : m.precioBaseAnolok;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setConfig({ ...config, medidaId: m.id })}
                    className={`min-h-[50px] p-2.5 rounded-xl border text-left transition active:scale-95 flex flex-col justify-between ${
                      isSelected
                        ? 'border-orange-500 bg-orange-500/10 text-white ring-1 ring-orange-500/40'
                        : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">{m.ancho} x {m.alto}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-orange-500" />}
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Ref S25: {formatearMoneda(base)}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 4. TIPO DE VIDRIO */}
          <section className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3.5 shadow-sm">
            <label className="block text-xs font-semibold text-slate-300 mb-2.5">
              4. Vidrio / Cristal
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(VIDRIOS) as TipoVidrio[]).map((vidKey) => {
                const v = VIDRIOS[vidKey];
                const isSelected = config.vidrio === vidKey;
                return (
                  <button
                    key={vidKey}
                    type="button"
                    onClick={() => setConfig({ ...config, vidrio: vidKey })}
                    className={`min-h-[50px] p-2.5 rounded-xl border text-left transition active:scale-95 flex flex-col justify-between ${
                      isSelected
                        ? 'border-orange-500 bg-orange-500/10 text-white ring-1 ring-orange-500/40'
                        : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold">{v.nombre}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-orange-500" />}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {vidKey === 'dvh' ? '+25% Aislante' : 'Estándar incluido'}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 5. COLOCACIÓN EN MONTEVIDEO */}
          <section className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-200 block">
                  Colocación en Montevideo
                </span>
                <span className="text-[11px] text-slate-400">
                  Instalación en vano existente (+{formatearMoneda(COSTO_COLOCACION_MONTEVIDEO)})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setConfig({ ...config, conColocacion: !config.conColocacion })}
                className={`w-12 h-7 rounded-full transition-colors relative flex items-center p-1 cursor-pointer ${
                  config.conColocacion ? 'bg-orange-600' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                    config.conColocacion ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </section>

        </main>

        {/* BARRA INFERIOR FLOTANTE DE TOTAL (STICKY BOTTOM - ACCESIBLE CON PULGAR) */}
        <footer className="fixed bottom-0 left-0 right-0 z-40 flex justify-center bg-slate-950/95 backdrop-blur-md border-t border-slate-800 safe-bottom">
          <div className="w-full max-w-md px-4 py-3 flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                Total Estimado
              </span>
              <div className="text-2xl font-black text-orange-500 leading-none">
                {formatearMoneda(breakdown.totalFinal)}
                <span className="text-xs font-normal text-slate-400 ml-1">UYU</span>
              </div>
            </div>

            <button
              onClick={() => setMostrarModal(true)}
              className="min-h-[46px] px-4 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold rounded-xl shadow-lg shadow-orange-600/30 flex items-center gap-2 transition active:scale-95 text-xs sm:text-sm"
            >
              <FileText className="w-4 h-4" />
              <span>Ver Presupuesto</span>
            </button>
          </div>
        </footer>

        {/* MODAL DEL PRESUPUESTO FORMAL MEMBRETADO */}
        {mostrarModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="w-full max-w-md bg-white text-slate-900 rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-200 overflow-hidden">
              
              {/* HEADER DEL MODAL */}
              <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Presupuesto Oficial CD Aluminio
                  </span>
                </div>
                <button
                  onClick={() => setMostrarModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-200/80 text-slate-600 hover:bg-slate-300 flex items-center justify-center active:scale-95"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* CONTENIDO MEMBRETADO */}
              <div className="p-5 overflow-y-auto space-y-4 text-xs">
                
                {/* MEMBRETE */}
                <div className="text-center pb-3 border-b border-slate-200">
                  <img
                    src={DATOS_EMPRESA.logoOrangeUrl}
                    alt="CD Aluminio"
                    className="h-12 mx-auto object-contain mb-1"
                  />
                  <div className="text-[11px] text-slate-500 font-medium">
                    {DATOS_EMPRESA.direccion}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Tel / WhatsApp: {DATOS_EMPRESA.whatsappDisplay} | Web: {DATOS_EMPRESA.web}
                  </div>
                </div>

                {/* DATOS DE EMISIÓN */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between items-center text-[11px]">
                  <div>
                    <span className="text-slate-500 block">Fecha de Emisión:</span>
                    <span className="font-semibold text-slate-800">
                      {new Date().toLocaleDateString('es-UY', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 block">Validez Presupuesto:</span>
                    <span className="font-semibold text-orange-600">
                      15 días corridos
                    </span>
                  </div>
                </div>

                {/* DETALLE TÉCNICO */}
                <div>
                  <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-wider mb-2 text-slate-500">
                    Detalle de Fabricación
                  </h4>
                  <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden bg-white">
                    <div className="p-2.5 flex justify-between">
                      <span className="text-slate-600">Abertura:</span>
                      <span className="font-semibold text-slate-900">Ventana Corrediza (2 Hojas)</span>
                    </div>
                    <div className="p-2.5 flex justify-between">
                      <span className="text-slate-600">Línea de Perfil:</span>
                      <span className="font-semibold text-slate-900">{breakdown.serieNombre}</span>
                    </div>
                    <div className="p-2.5 flex justify-between">
                      <span className="text-slate-600">Terminación:</span>
                      <span className="font-semibold text-slate-900">{breakdown.colorNombre}</span>
                    </div>
                    <div className="p-2.5 flex justify-between">
                      <span className="text-slate-600">Dimensiones:</span>
                      <span className="font-semibold text-slate-900">{breakdown.medida.ancho} x {breakdown.medida.alto} mm</span>
                    </div>
                    <div className="p-2.5 flex justify-between">
                      <span className="text-slate-600">Vidrio:</span>
                      <span className="font-semibold text-slate-900">{breakdown.vidrioNombre}</span>
                    </div>
                    <div className="p-2.5 flex justify-between">
                      <span className="text-slate-600">Instalación en Obra:</span>
                      <span className="font-semibold text-slate-900">
                        {config.conColocacion ? `Incluida en Montevideo` : `No incluye (Retiro Taller)`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* TOTAL */}
                <div className="bg-orange-50 border border-orange-200 p-3.5 rounded-xl flex items-center justify-between">
                  <span className="font-bold text-orange-950 text-sm">TOTAL A PAGAR:</span>
                  <span className="text-xl font-black text-orange-600">
                    {formatearMoneda(breakdown.totalFinal)} <span className="text-xs">UYU</span>
                  </span>
                </div>

                {/* CONDICIONES */}
                <div className="text-[10px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1">
                  <p className="font-semibold text-slate-700">• Forma de Pago: {DATOS_EMPRESA.condicionesPago}.</p>
                  <p>• Los trabajos se agendan una vez recibida la seña correspondiente.</p>
                  <p>• Retiro en taller sin costo en Gral. Flores 2979.</p>
                </div>

              </div>

              {/* BOTONES DE ACCIÓN PARA WHATSAPP Y COPIAR */}
              <div className="p-4 border-t border-slate-200 bg-slate-50 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleCopiar}
                  className="min-h-[46px] px-3 py-2 border border-slate-300 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl flex items-center justify-center gap-1.5 transition active:scale-95 text-xs"
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
