import React, { useState, useCallback, memo } from 'react';
import comandos from '../content/comandos';
import { useAutoHeight } from '../hooks/useAutoHeight';

function ComandosListComponent({ accent }) {
  const [openId, setOpenId] = useState(null);
  const copy = useCallback(async (text) => { try { await navigator.clipboard.writeText(text); } catch {} }, []);
  return (
    <div className="space-y-3">
      {comandos.map(c => {
        const isOpen = openId === c.id;
        const { ref, height } = useAutoHeight(isOpen);
        return (
          <div key={c.id} className="rounded-xl border border-white/10 bg-white/5">
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : c.id)}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-white/10 transition"
              aria-expanded={isOpen}
            >
              <span className="font-semibold" style={{ color: accent }}>{c.title}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: height, opacity: isOpen ? 1 : 0.6 }}>
              <div ref={ref} className="px-4 pb-4 pt-1 text-sm text-white/80 space-y-3">
                <p className="whitespace-pre-line leading-relaxed">{c.text}</p>
                <div>
                  <button
                    type="button"
                    onClick={() => copy(c.text)}
                    className="rounded-full px-3 py-1.5 text-xs font-semibold text-black"
                    style={{ background: accent }}
                  >Copiar</button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const ComandosList = memo(ComandosListComponent);
export default ComandosList;
