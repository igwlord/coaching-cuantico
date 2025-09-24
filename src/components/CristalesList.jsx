import React, { useState, useCallback, memo } from 'react';
import cristales from '../content/cristales';
import { useAutoHeight } from '../hooks/useAutoHeight';

function CristalesListComponent({ accent }) {
  const [openSlug, setOpenSlug] = useState(null);
  const copy = useCallback(async (c) => {
    const text = `${c.nombre}\n${c.descripcion}\n${c.cuerpo}\n${c.beneficios}\n${c.mensaje}`;
    try { await navigator.clipboard.writeText(text); } catch {}
  }, []);
  return (
    <div className="space-y-3">
      {cristales.map(c => {
        const isOpen = openSlug === c.slug;
        const { ref, height } = useAutoHeight(isOpen);
        return (
          <div key={c.slug} className="rounded-xl border border-white/10 bg-white/5">
            <button
              type="button"
              onClick={() => setOpenSlug(isOpen ? null : c.slug)}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-white/10 transition"
              aria-expanded={isOpen}
            >
              <span className="font-semibold" style={{ color: accent }}>{c.nombre}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: height, opacity: isOpen ? 1 : 0.6 }}>
              <div ref={ref} className="px-4 pb-4 pt-1 text-sm text-white/80 space-y-2">
                <p><span className="font-medium text-white/90">Descripción:</span> {c.descripcion}</p>
                <p className="text-xs"><span className="font-medium text-white/90">Cuerpo:</span> {c.cuerpo}</p>
                <p className="text-xs"><span className="font-medium text-white/90">Beneficios:</span> {c.beneficios}</p>
                <p className="text-sm"><span className="font-medium text-white/90">Mensaje holístico:</span></p>
                <blockquote className="text-[12px] md:text-[13px] leading-relaxed font-medium italic rounded-lg bg-black/30 p-3 border border-white/10 shadow-inner" style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.05), 0 0 22px -6px rgba(212,175,55,0.4)', color: accent, textShadow: '0 0 8px rgba(212,175,55,0.45)' }}>{c.mensaje}</blockquote>
                <div>
                  <button type="button" onClick={() => copy(c)} className="rounded-full px-3 py-1.5 text-xs font-semibold text-black" style={{ background: accent }}>Copiar</button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const CristalesList = memo(CristalesListComponent);
export default CristalesList;
