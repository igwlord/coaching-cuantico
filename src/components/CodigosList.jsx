import React from 'react';
import codigos from '../content/codigos';

export default function CodigosList({ accent }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {codigos.map(c => (
        <div key={c.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
          <h4 className="font-semibold">{c.title}</h4>
          <p className="mt-1 text-sm text-white/80">{c.desc}</p>
        </div>
      ))}
    </div>
  );
}
