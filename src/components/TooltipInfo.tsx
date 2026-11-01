import { useState, useRef, useEffect } from 'react';
import { Info } from './Icons';

interface TooltipInfoProps {
  texto: string;
}

export function TooltipInfo({ texto }: TooltipInfoProps) {
  const [abierto, setAbierto] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Cerrar al hacer clic fuera (en celulares)
  useEffect(() => {
    function handleClickOutside(e: Event) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setAbierto(false);
      }
    }
    if (abierto) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [abierto]);

  return (
    <div
      ref={containerRef}
      className="relative inline-flex items-center"
      onMouseEnter={() => setAbierto(true)}
      onMouseLeave={() => setAbierto(false)}
    >
      <button
        type="button"
        aria-label="Más información"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setAbierto(prev => !prev);
        }}
        className="w-4 h-4 rounded-full text-slate-400 hover:text-orange-500 hover:bg-orange-50 flex items-center justify-center transition focus:outline-none focus:text-orange-500 cursor-pointer"
      >
        <Info className="w-3.5 h-3.5" />
      </button>

      {abierto && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-50 w-56 sm:w-64 p-2.5 bg-neutral-900 text-white text-[11px] leading-relaxed rounded-xl shadow-xl border border-neutral-700 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
          <p className="font-normal">{texto}</p>
          {/* Flechita inferior */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-neutral-900" />
        </div>
      )}
    </div>
  );
}
