import React from 'react';
import comandos from '../content/comandos';

export default function ComandosList({ accent }) {
  const copy = async (text) => {
    try { await navigator.clipboard.writeText(text); } catch {}
  };
  return (
    <div className="space-y-3">
      {comandos.map(c => (
        <div key={c.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between gap-3">
            <h4 className="font-semibold" style={{ color: accent }}>{c.title}</h4>
            <button type="button" onClick={() => copy(c.text)} className="rounded-full px-3 py-1.5 text-xs font-semibold text-black" style={{ background: accent }}>Copiar</button>
          </div>
          <p className="mt-2 text-sm text-white/80 whitespace-pre-line">{c.text}</p>
        </div>
      ))}
    </div>
  );
}
