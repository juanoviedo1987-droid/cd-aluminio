import type React from 'react';

interface WindowPreviewProps {
  productoId: string;
  nombre: string;
  anchoStr?: string;
  altoStr?: string;
  colorHex: string;
  colorNombre: string;
  serieNombre: string;
  vidrioNombre: string;
}

export const WindowPreview2D: React.FC<WindowPreviewProps> = ({
  productoId,
  anchoStr,
  altoStr,
  colorHex,
  colorNombre,
  serieNombre,
  vidrioNombre,
}) => {
  // Convertir medidas ingresadas o usar proporción estándar
  const ancho = Number.parseFloat(anchoStr || '') || 120;
  const alto = Number.parseFloat(altoStr || '') || 100;

  // Proporción SVG fija dentro de caja
  const maxW = 260;
  const maxH = 170;
  const ratio = ancho / alto;

  let svgW = maxW;
  let svgH = maxH;

  if (ratio > maxW / maxH) {
    svgW = maxW;
    svgH = Math.max(70, Math.round(maxW / ratio));
  } else {
    svgH = maxH;
    svgW = Math.max(70, Math.round(maxH * ratio));
  }

  const frameThickness = 8;
  const innerW = svgW - frameThickness * 2;
  const innerH = svgH - frameThickness * 2;

  // Color del perfil
  const frameColor = colorHex || '#475569';
  const isDarkFrame = colorHex === '#1E293B' || colorHex === '#451a03';
  const glassColor = vidrioNombre.toLowerCase().includes('dvh') 
    ? 'rgba(186, 230, 253, 0.55)' 
    : 'rgba(224, 242, 254, 0.45)';

  // Determinación de cantidad de hojas según el producto
  let hojas = 2;
  if (productoId.includes('3h') || productoId.includes('3-hojas')) hojas = 3;
  if (productoId.includes('4h') || productoId.includes('4-hojas')) hojas = 4;
  if (productoId.includes('pano-fijo') || productoId.includes('ciega') || productoId.includes('cristal') || productoId.includes('batiente')) {
    hojas = 1;
  }

  const hojaW = innerW / hojas;

  return (
    <div className="bg-slate-900 rounded-2xl p-4 text-white shadow-inner border border-slate-800 space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Plano Técnico 2D en Escala
          </span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">
          {ancho} cm x {alto} cm
        </span>
      </div>

      {/* ÁREA DE VISUALIZACIÓN TÉCNICA */}
      <div className="h-[190px] w-full flex items-center justify-center bg-slate-950/60 rounded-xl border border-slate-800/80 p-2 relative overflow-hidden">
        {/* Grilla técnica de fondo */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
            backgroundSize: '16px 16px',
          }}
        />

        {/* SVG PARAMÉTRICO DE LA ABERTURA */}
        <svg
          width={svgW}
          height={svgH}
          viewBox={`0 0 ${svgW} ${svgH}`}
          className="relative drop-shadow-xl transition-all duration-300"
        >
          {/* Marco exterior */}
          <rect
            x="0"
            y="0"
            width={svgW}
            height={svgH}
            rx="3"
            fill={frameColor}
            stroke="#000000"
            strokeWidth="1.5"
          />

          {/* Hojas y Cristales */}
          {Array.from({ length: hojas }).map((_, i) => {
            const hx = frameThickness + i * hojaW;
            const hy = frameThickness;
            const hw = hojaW;
            const hh = innerH;
            const subFrame = 4;

            return (
              <g key={i}>
                {/* Perfil de la hoja */}
                <rect
                  x={hx}
                  y={hy}
                  width={hw}
                  height={hh}
                  fill={frameColor}
                  stroke={isDarkFrame ? '#52525b' : '#334155'}
                  strokeWidth="1"
                />
                {/* Paño de Vidrio */}
                <rect
                  x={hx + subFrame}
                  y={hy + subFrame}
                  width={hw - subFrame * 2}
                  height={hh - subFrame * 2}
                  fill={glassColor}
                  stroke="#38bdf8"
                  strokeWidth="0.5"
                  strokeOpacity="0.4"
                />

                {/* Brillo de reflejo arquitectónico */}
                <line
                  x1={hx + subFrame + 6}
                  y1={hy + subFrame + 6}
                  x2={hx + hw - subFrame - 6}
                  y2={hy + hh - subFrame - 6}
                  stroke="rgba(255, 255, 255, 0.25)"
                  strokeWidth="1"
                  strokeDasharray="12 18"
                />

                {/* Flecha o sentido de apertura si es corrediza */}
                {hojas > 1 && (
                  <path
                    d={
                      i % 2 === 0
                        ? `M ${hx + hw / 2 - 8} ${hy + hh / 2} L ${hx + hw / 2 + 8} ${hy + hh / 2} M ${hx + hw / 2 + 4} ${hy + hh / 2 - 4} L ${hx + hw / 2 + 8} ${hy + hh / 2} L ${hx + hw / 2 + 4} ${hy + hh / 2 + 4}`
                        : `M ${hx + hw / 2 + 8} ${hy + hh / 2} L ${hx + hw / 2 - 8} ${hy + hh / 2} M ${hx + hw / 2 - 4} ${hy + hh / 2 - 4} L ${hx + hw / 2 - 8} ${hy + hh / 2} L ${hx + hw / 2 - 4} ${hy + hh / 2 + 4}`
                    }
                    stroke="rgba(255, 255, 255, 0.6)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Cotas en pantalla */}
        <div className="absolute bottom-1 right-2 text-[9px] text-slate-400 font-mono bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-800">
          Ancho: {ancho} cm | Alto: {alto} cm
        </div>
      </div>

      {/* PIE TÉCNICO INFORMATIVO */}
      <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-300 pt-1">
        <div>
          <span className="text-slate-500 block">Línea:</span>
          <span className="font-bold text-white truncate block">{serieNombre}</span>
        </div>
        <div>
          <span className="text-slate-500 block">Terminación:</span>
          <span className="font-bold text-white truncate block">{colorNombre}</span>
        </div>
        <div>
          <span className="text-slate-500 block">Configuración:</span>
          <span className="font-bold text-orange-400 truncate block">
            {hojas === 1 ? '1 Hoja / Paño' : `${hojas} Hojas Corredizas`}
          </span>
        </div>
      </div>
    </div>
  );
};
