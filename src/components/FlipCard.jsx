import React, { useState } from 'react';

export default function FlipCard({ front, back }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="[perspective:1000px]" onClick={() => setFlipped(v => !v)}>
      <div className={`relative h-64 w-full transition-transform duration-500 [transform-style:preserve-3d] ${flipped ? '[transform:rotateY(180deg)]' : ''}`}>
        <div className={`absolute inset-0 rounded-xl border border-white/10 bg-white/5 overflow-hidden [backface-visibility:hidden] transition-opacity duration-300 ${flipped ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          {front}
        </div>
        <div className={`absolute inset-0 rounded-xl border border-white/10 bg-[#0c0824] overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)] transition-opacity duration-300 ${flipped ? 'opacity-100' : 'opacity-100'}`}>
          {back}
        </div>
      </div>
    </div>
  );
}
