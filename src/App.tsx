import { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import {
  PRODUCTO_EJEMPLO_TEST,
  FACTORES_SERIE,
  COLORES,
  VIDRIOS,
  DATOS_EMPRESA,
  calcularPresupuesto,
  generarTextoWhatsApp,
} from './data/pricingData';
import type { ProductoCatalogo } from './data/pricingData';
import { cargarCatalogoDesdeGoogleSheets, cargarFactoresDesdeGoogleSheets } from './services/sheetsService';
import type { FactoresTaller } from './services/sheetsService';
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
  FileDown,
  Lock,
  KeyRound
} from './components/Icons';

const FECHA_EMISION_HOY = new Date().toLocaleDateString('es-UY', { day: '2-digit', month: '2-digit', year: 'numeric' });
const PIN_ACCESO_CORRECTO = '2979';

export default function App() {
  // Estado de acceso seguro por PIN
  const [estaAutenticado, setEstaAutenticado] = useState<boolean>(() => {
    return localStorage.getItem('cd_aluminio_auth') === 'true';
  });
  const [pinIngresado, setPinIngresado] = useState('');
  const [errorPin, setErrorPin] = useState(false);

  // Catálogo y Factores dinámicos 100% alimentados desde Google Sheets
  const [catalogo, setCatalogo] = useState<ProductoCatalogo[]>([PRODUCTO_EJEMPLO_TEST]);
  const [factoresTaller, setFactoresTaller] = useState<FactoresTaller | null>(null);
  const [sincronizandoSheets, setSincronizandoSheets] = useState(false);
  const [ultimaSincronizacion, setUltimaSincronizacion] = useState<Date | null>(null);

  useEffect(() => {
    let montado = true;
    async function cargar() {
      setSincronizandoSheets(true);
      const [listaProds, factores] = await Promise.all([
        cargarCatalogoDesdeGoogleSheets(),
        cargarFactoresDesdeGoogleSheets(),
      ]);

      if (montado && listaProds.length > 0) {
        setCatalogo(listaProds);
        setFactoresTaller(factores);
        setSincronizandoSheets(false);
        setUltimaSincronizacion(new Date());
        setProductoSeleccionado(prev => {
          const existe = listaProds.some(p => p.id === prev);
          return existe ? prev : listaProds[0].id;
        });
      }
    }
    cargar();
    return () => {
      montado = false;
    };
  }, []);

  const [productoSeleccionado, setProductoSeleccionado] = useState('prod-ejemplo-test');
  const [config, setConfig] = useState<QuoteConfig>({
    ancho: '',
    alto: '',
    serie: 'S25',
    color: 'natural',
    vidrio: 'c4mm',
    conColocacion: false,
  });

  const prodActual = catalogo.find(p => p.id === productoSeleccionado) || catalogo[0] || PRODUCTO_EJEMPLO_TEST;

  const [mostrarModal, setMostrarModal] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [generandoPDF, setGenerandoPDF] = useState(false);
  const [generandoImg, setGenerandoImg] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const modalHojaRef = useRef<HTMLDivElement>(null);

  const breakdown = calcularPresupuesto(
    config,
    prodActual,
    factoresTaller?.recargosSerie
  );

  // Generar QR dinámico para WhatsApp con el presupuesto configurado
  useEffect(() => {
    const textoWhatsApp = generarTextoWhatsApp(breakdown, prodActual.nombre);
    const whatsappUrl = `https://wa.me/${DATOS_EMPRESA.whatsappNumero}?text=${textoWhatsApp}`;
    QRCode.toDataURL(whatsappUrl, {
      width: 140,
      margin: 1,
      color: {
        dark: '#18181b',
        light: '#ffffff',
      },
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('Error generando QR:', err));
  }, [breakdown, prodActual.nombre]);

  const handleCopiar = () => {
    const textoDecodificado = decodeURIComponent(generarTextoWhatsApp(breakdown, prodActual.nombre));
    navigator.clipboard.writeText(textoDecodificado);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  };

  const handleWhatsApp = () => {
    const texto = generarTextoWhatsApp(breakdown, prodActual.nombre);
    window.open(`https://wa.me/${DATOS_EMPRESA.whatsappNumero}?text=${texto}`, '_blank');
  };

  const handleDescargarImagen = async () => {
    if (!modalHojaRef.current) return;
    setGenerandoImg(true);
    try {
      const canvas = await html2canvas(modalHojaRef.current, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const link = document.createElement('a');
      const medNombre = config.ancho && config.alto ? `${config.ancho}x${config.alto}cm` : 'a_medida';
      link.download = `Presupuesto_CD_Aluminio_${breakdown.serieNombre}_${medNombre}.png`;
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
      const medNombre = config.ancho && config.alto ? `${config.ancho}x${config.alto}cm` : 'a_medida';
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      pdf.save(`Presupuesto_CD_Aluminio_${breakdown.serieNombre}_${medNombre}.pdf`);
    } catch (err) {
      console.error('Error generando PDF:', err);
    } finally {
      setGenerandoPDF(false);
    }
  };

  const handleValidarPin = (pinAValidar: string) => {
    if (pinAValidar === PIN_ACCESO_CORRECTO) {
      setEstaAutenticado(true);
      localStorage.setItem('cd_aluminio_auth', 'true');
      setErrorPin(false);
    } else {
      setErrorPin(true);
      setTimeout(() => setErrorPin(false), 2000);
    }
  };

  const handleBotonTeclado = (digito: string) => {
    if (pinIngresado.length < 4) {
      setPinIngresado(prev => prev + digito);
    }
  };

  const handleBorrarPin = () => {
    setPinIngresado(prev => prev.slice(0, -1));
    setErrorPin(false);
  };

  const handleCerrarSesion = () => {
    localStorage.removeItem('cd_aluminio_auth');
    setEstaAutenticado(false);
    setPinIngresado('');
  };

  // PANTALLA DE BLOQUEO CON PIN
  if (!estaAutenticado) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4 selection:bg-orange-500 selection:text-white">
        <div className="w-full max-w-sm bg-black border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
          <div className="space-y-2">
            <img
              src={DATOS_EMPRESA.logoLocal}
              alt="CD Aluminio"
              className="w-32 h-32 mx-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform"
            />
            <div>
              <h1 className="text-xl font-black tracking-tight text-white uppercase">
                <span className="text-white">C</span><span className="text-orange-500">D</span> <span className="text-white">ALUMINIO</span>
              </h1>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className="text-xs text-neutral-400 font-medium">
                  Cotizador Oficial de Fábrica
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest bg-orange-500/20 text-orange-400 border border-orange-500/40 px-2 py-0.5 rounded-full">
                  Versión Beta
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center gap-3 py-2">
            {[0, 1, 2, 3].map((index) => {
              const tieneDigito = pinIngresado.length > index;
              return (
                <div
                  key={index}
                  className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                    errorPin
                      ? 'border-red-500 bg-red-500/20 animate-shake'
                      : tieneDigito
                      ? 'border-orange-500 bg-orange-500 scale-110 shadow-lg shadow-orange-500/50'
                      : 'border-neutral-700 bg-neutral-900'
                  }`}
                />
              );
            })}
          </div>

          {errorPin && (
            <p className="text-xs font-bold text-red-400 animate-fade-in">
              PIN incorrecto. Intente nuevamente.
            </p>
          )}

          <div className="space-y-1">
            <label className="text-[11px] text-neutral-400 uppercase tracking-wider block font-semibold">
              Ingresar PIN (Teclado o botones):
            </label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={pinIngresado}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                setPinIngresado(val);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleValidarPin(pinIngresado);
                }
              }}
              placeholder="••••"
              autoFocus
              className="w-full text-center tracking-[0.5em] text-xl font-bold bg-neutral-900 text-white border border-neutral-700 rounded-xl py-2.5 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 placeholder-neutral-600 transition"
            />
          </div>

          <div className="grid grid-cols-3 gap-2.5 pt-1">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleBotonTeclado(num)}
                className="min-h-[52px] bg-neutral-900 hover:bg-neutral-800 active:bg-neutral-700 border border-neutral-800 rounded-2xl text-lg font-bold text-white transition active:scale-95 shadow-sm"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={handleBorrarPin}
              className="min-h-[52px] bg-neutral-900/60 hover:bg-neutral-800 active:bg-neutral-700 border border-neutral-800 rounded-2xl text-xs font-bold text-neutral-400 transition active:scale-95 flex items-center justify-center"
            >
              Borrar
            </button>
            <button
              type="button"
              onClick={() => handleBotonTeclado('0')}
              className="min-h-[52px] bg-neutral-900 hover:bg-neutral-800 active:bg-neutral-700 border border-neutral-800 rounded-2xl text-lg font-bold text-white transition active:scale-95 shadow-sm"
            >
              0
            </button>
            <button
              type="button"
              onClick={() => handleValidarPin(pinIngresado)}
              className="min-h-[52px] bg-orange-600 hover:bg-orange-500 active:bg-orange-700 rounded-2xl text-xs font-bold text-white transition active:scale-95 flex items-center justify-center gap-1 shadow-md shadow-orange-600/30"
            >
              <KeyRound className="w-4 h-4" />
              <span>Entrar</span>
            </button>
          </div>

          <div className="text-[10px] text-neutral-500 pt-2 border-t border-neutral-900">
            Gral. Flores 2979 &bull; Montevideo
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans selection:bg-orange-500 selection:text-white flex flex-col">
      {/* HEADER CORPORATIVO */}
      <header className="bg-black text-white px-4 lg:px-8 py-3.5 sticky top-0 z-30 shadow-md border-b border-neutral-800">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src={DATOS_EMPRESA.logoLocal}
                alt="CD Aluminio"
                className="w-20 h-20 md:w-24 md:h-24 object-contain drop-shadow-xl hover:scale-105 transition-transform shrink-0"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base md:text-lg font-black tracking-tight uppercase block leading-tight">
                  <span className="text-white">C</span><span className="text-orange-500">D</span> <span className="text-white">ALUMINIO</span>
                </span>
                <span className="text-[9px] font-extrabold uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/40 px-2 py-0.5 rounded-full">
                  Beta
                </span>
              </div>
              <span className="text-xs text-neutral-400 font-medium block">
                Cotizador Oficial de Fábrica
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
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
            <button
              type="button"
              onClick={handleCerrarSesion}
              title="Bloquear acceso"
              className="flex items-center gap-1 text-[11px] bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white px-2.5 py-1.5 rounded-full border border-neutral-800 transition active:scale-95"
            >
              <Lock className="w-3 h-3 text-orange-500" />
              <span className="hidden sm:inline">Bloquear</span>
            </button>
          </div>
        </div>
      </header>

      {/* CONTENEDOR PRINCIPAL */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-6 lg:p-8 pb-32 md:pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* COLUMNA IZQUIERDA: CONFIGURADOR FORMULARIO */}
          <div className="md:col-span-7 lg:col-span-8 space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5 shadow-sm space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-sm font-bold text-black uppercase tracking-wider">
                  Configuración de Abertura
                </h2>
                <p className="text-xs text-slate-500">
                  Seleccione las especificaciones técnicas para generar la solicitud de cotización.
                </p>
              </div>

              {/* 1. PRODUCTO (26 PRODUCTOS EXCEL) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    1. Producto a Cotizar
                  </label>
                  {sincronizandoSheets ? (
                    <span className="text-[10px] text-orange-600 font-semibold flex items-center gap-1 animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-orange-500"></span> Conectando catálogo...
                    </span>
                  ) : ultimaSincronizacion ? (
                    <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Conectado a Hoja Drive
                    </span>
                  ) : null}
                </div>
                <select
                  value={productoSeleccionado}
                  onChange={(e) => {
                    const nuevoId = e.target.value;
                    setProductoSeleccionado(nuevoId);
                  }}
                  className="w-full min-h-[48px] bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition shadow-inner"
                >
                  {catalogo
                    .filter(p => p.activo)
                    .map((p) => {
                      const etiquetaPrecio = p.precioBase ? ` ($ ${p.precioBase.toLocaleString('es-UY')})` : '';
                      return (
                        <option key={p.id} value={p.id}>
                          {p.nombre}{etiquetaPrecio}
                        </option>
                      );
                    })}
                </select>
                {prodActual.nota && (
                  <p className="text-[11px] text-orange-700 mt-1 italic flex items-center gap-1 bg-orange-50/70 p-1.5 rounded-lg border border-orange-200">
                    <span>📌</span> {prodActual.nota}
                  </p>
                )}
              </div>

              {/* 2. LÍNEA / SERIE */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  2. Línea / Serie
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
                  {FACTORES_SERIE[config.serie]?.desc}
                </p>
              </div>

              {/* 3. TERMINACIÓN / COLOR */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  3. Color / Terminación del Aluminio
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(Object.keys(COLORES) as ColorAluminio[]).map((key) => {
                    const isSelected = config.color === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setConfig({ ...config, color: key })}
                        className={`min-h-[46px] px-3 py-2 rounded-xl border flex items-center gap-2 transition active:scale-95 text-left ${
                          isSelected
                            ? 'border-orange-500 bg-orange-50 text-slate-900 ring-2 ring-orange-500/20 font-bold'
                            : 'border-slate-300 bg-slate-50 text-slate-700 hover:border-slate-400'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-slate-400 shrink-0 shadow-sm"
                          style={{ backgroundColor: COLORES[key].hex }}
                        />
                        <span className="text-xs truncate">{COLORES[key].nombre}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-slate-500 mt-1 italic">
                  {COLORES[config.color]?.desc}
                </p>
              </div>

              {/* 4. MEDIDA LIBRE (ANCHO X ALTO) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    4. Medidas Estimadas (Ancho x Alto)
                  </label>
                  <span className="text-[11px] text-slate-500 font-medium">Opcional en cm</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Ancho (cm):
                    </label>
                    <input
                      type="number"
                      inputMode="decimal"
                      value={config.ancho}
                      onChange={(e) => setConfig({ ...config, ancho: e.target.value })}
                      placeholder="Ej: 120"
                      className="w-full min-h-[46px] bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Alto (cm):
                    </label>
                    <input
                      type="number"
                      inputMode="decimal"
                      value={config.alto}
                      onChange={(e) => setConfig({ ...config, alto: e.target.value })}
                      placeholder="Ej: 100"
                      className="w-full min-h-[46px] bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 italic">
                  {config.ancho && config.alto
                    ? `Medida configurada: ${config.ancho} cm Ancho x ${config.alto} cm Alto`
                    : 'Si aún no tenés las medidas exactas, podés dejar los campos vacíos y se coordina la rectificación en obra.'}
                </p>
              </div>

              {/* 5. TIPO DE VIDRIO / CRISTAL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  5. Tipo de Vidrio / Cristal
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
                <p className="text-[11px] text-slate-500 mt-1 italic">
                  {VIDRIOS[config.vidrio]?.desc}
                </p>
              </div>

              {/* 6. COLOCACIÓN EN OBRA */}
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
                        {config.conColocacion ? 'Con Colocación (A coordinar en obra)' : 'Sin Colocación (Retiro en Taller)'}
                      </span>
                      <span className="text-slate-500 font-medium">
                        {config.conColocacion ? 'Instalación y ajuste en obra en Montevideo' : 'Retiro por taller en Gral. Flores 2979'}
                      </span>
                    </div>
                  </div>

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

                {config.conColocacion && (
                  <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-3.5 flex items-start gap-2.5 text-amber-950 shadow-xs animate-in fade-in duration-200">
                    <span className="text-xl leading-none shrink-0">📸</span>
                    <div className="text-xs leading-snug">
                      <strong className="font-bold text-amber-900 block mb-0.5">Foto sugerida para colocación:</strong>
                      <span>Al enviar la consulta por WhatsApp, podés adjuntar una foto del vano o abertura a sustituir para validar encastre y fijaciones.</span>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* COLUMNA DERECHA: RESUMEN EJECUTIVO */}
          <div className="md:col-span-5 lg:col-span-4 space-y-4">
            
            {/* PANEL DE RESUMEN EJECUTIVO */}
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
                  <span className="font-semibold text-slate-900 text-right truncate max-w-[180px]">{prodActual.nombre}</span>
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
                  <span className="font-semibold text-slate-900">{breakdown.medidaTexto}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Vidrio:</span>
                  <span className="font-semibold text-slate-900">{breakdown.vidrioNombre}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Colocación:</span>
                  <span className={`font-semibold ${breakdown.conColocacion ? 'text-orange-600' : 'text-slate-900'}`}>
                    {breakdown.costoColocacionTexto}
                  </span>
                </div>
              </div>

              {/* CAJA DE ESTADO */}
              <div className="bg-neutral-900 text-white rounded-xl p-4 shadow-md">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                  Estado de la Estimación
                </span>
                <div className="text-xl font-black text-orange-400 leading-tight">
                  {breakdown.precioTexto}
                </div>
                <p className="text-[10px] text-neutral-400 mt-2">
                  Presupuesto referencial sujeto a validación técnica de escuadría y vano en obra.
                </p>
              </div>

              {/* BOTONES ACCIÓN */}
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

      {/* FOOTER FLOTANTE MOBILE */}
      <footer className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 safe-bottom shadow-lg px-4 py-3 flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">
            Presupuesto
          </span>
          <div className="text-sm font-bold text-orange-600 leading-tight">
            {breakdown.precioTexto}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMostrarModal(true)}
            className="min-h-[44px] px-3.5 py-2 bg-black hover:bg-neutral-800 text-white font-bold rounded-xl shadow flex items-center gap-1.5 transition active:scale-95 text-xs border border-neutral-700"
          >
            <FileText className="w-4 h-4 text-orange-500" />
            <span>Presupuesto</span>
          </button>
          <button
            type="button"
            onClick={handleWhatsApp}
            className="min-h-[44px] px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow flex items-center gap-1.5 transition active:scale-95 text-xs"
          >
            <Send className="w-4 h-4" />
            <span>WhatsApp</span>
          </button>
        </div>
      </footer>

      {/* MODAL DEL PRESUPUESTO FORMAL CON QR DINÁMICO */}
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
              <div className="text-center pb-4 border-b border-slate-200">
                <img
                  src={DATOS_EMPRESA.logoLocal}
                  alt="CD Aluminio"
                  className="w-24 h-24 mx-auto object-contain mb-2 drop-shadow-xl"
                />
                <div className="text-xs text-slate-700 font-bold uppercase tracking-wider">
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
                    <span className="font-bold text-slate-900">{prodActual.nombre}</span>
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
                    <span className="font-bold text-slate-900">{breakdown.medidaTexto}</span>
                  </div>
                  <div className="p-2.5 flex justify-between">
                    <span className="text-slate-500">Cristal:</span>
                    <span className="font-bold text-slate-900">{breakdown.vidrioNombre}</span>
                  </div>
                  <div className="p-2.5 flex justify-between bg-slate-50/50">
                    <span className="text-slate-500">Colocación:</span>
                    <span className={`font-bold ${breakdown.conColocacion ? 'text-orange-600' : 'text-slate-900'}`}>
                      {breakdown.costoColocacionTexto}
                    </span>
                  </div>
                </div>
              </div>

              {/* TOTAL */}
              <div className="bg-neutral-900 text-white p-3.5 rounded-xl flex items-center justify-between shadow-sm">
                <div>
                  <span className="font-bold text-xs tracking-wide block">ESTADO ESTIMACIÓN:</span>
                  <span className="text-[9px] text-neutral-400 block">Sujeto a validación técnica en obra</span>
                </div>
                <span className="text-sm sm:text-base font-black text-orange-400 text-right">
                  {breakdown.precioTexto}
                </span>
              </div>

              {/* QR DINÁMICO PARA CONTACTO RÁPIDO WHATSAPP */}
              {qrDataUrl && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 flex items-center gap-3">
                  <img
                    src={qrDataUrl}
                    alt="Código QR WhatsApp"
                    className="w-20 h-20 rounded-lg border border-orange-200 bg-white p-1 shrink-0 shadow-xs"
                  />
                  <div className="text-[11px] leading-tight space-y-1">
                    <strong className="text-slate-900 font-bold block text-xs">
                      Escanear para confirmar por WhatsApp
                    </strong>
                    <p className="text-slate-600 text-[10px]">
                      Apuntá la cámara de tu celular a este código QR para abrir el chat oficial de CD Aluminio con tu configuración lista para coordinar la seña.
                    </p>
                  </div>
                </div>
              )}

              {/* CONDICIONES */}
              <div className="text-[10px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1">
                <p className="font-bold text-slate-800">• Presupuesto referencial sujeto a validación técnica de escuadría y vano en obra.</p>
                <p className="font-bold text-slate-800">• Forma de Pago: {DATOS_EMPRESA.condicionesPago}.</p>
                <p>• {breakdown.conColocacion ? 'Colocación en obra sujeta a validación técnica previa con foto del vano.' : 'Retiro en taller en Gral. Flores 2979, Montevideo.'}</p>
                <p>• Validez de la estimación: {breakdown.vigenciaDias} días corridos.</p>
              </div>

            </div>

            {/* BOTONES ACCIÓN MULTI-FORMATO */}
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
