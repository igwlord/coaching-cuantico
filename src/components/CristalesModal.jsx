import React, { useEffect, useRef, useState } from 'react';
import cristales from '../content/cristales';

export default function CristalesModal({ open, onClose, accent }) {
  const dialogRef = useRef(null);
  const [openSlug, setOpenSlug] = useState(null);
  useEffect(() => {
    if (open) {
      const prev = document.activeElement;
      setOpenSlug(null); // reset cada vez que abre
      setTimeout(() => dialogRef.current?.focus(), 30);
      const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
      window.addEventListener('keydown', handleKey);
      return () => { window.removeEventListener('keydown', handleKey); prev && prev.focus?.(); };
    }
  }, [open, onClose]);

  if (!open) return null;

  const copy = async (c) => {
    const text = `${c.nombre}\n${c.descripcion}\n${c.cuerpo}\n${c.beneficios}\n${c.mensaje}`;
    try { await navigator.clipboard.writeText(text); } catch {}
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Cristales"
        ref={dialogRef}
        tabIndex={-1}
        className="relative w-full max-w-4xl max-h-[90vh] rounded-2xl border border-white/10 shadow-2xl flex flex-col"
        style={{ background: 'linear-gradient(145deg,#2A114A 0%, #180926 60%)' }}
      >
        <header className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-black/30">
          <h3 className="text-lg font-semibold tracking-wide" style={{ color: accent }}>Cristales</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-white/70 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
            aria-label="Cerrar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-5 space-y-3 custom-scroll" style={{ scrollbarGutter: 'stable' }}>
          {cristales.map(c => {
            const isOpen = openSlug === c.slug;
            return (
              <div key={c.slug} className="rounded-xl border border-white/10 bg-white/5">
                <button
                  type="button"
                  onClick={() => setOpenSlug(isOpen ? null : c.slug)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-white/10 transition"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold" style={{ color: accent }}>{c.nombre}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${isOpen ? 'rotate-180' : ''} transition-transform`}><polyline points="6 9 12 15 18 9"/></svg>
                </button>
                <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: isOpen ? 500 : 0, opacity: isOpen ? 1 : 0.6 }}>
                  <div className="px-4 pb-4 pt-1 text-sm text-white/80 space-y-2">
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
      </div>
    </div>
  );
}
