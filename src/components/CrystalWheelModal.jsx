import React, { useCallback, useEffect, useRef, useState } from 'react';
import cristales from '../content/cristales';

// Colores para los 16 sectores (pastel / cósmico). Ajustables.
const SECTOR_COLORS = [
  '#5D4B8A','#316B87','#7A5FA8','#2F5074',
  '#8A5675','#4A3568','#589E8A','#A870C9',
  '#D4AF37','#396982','#9A6E3A','#5F2478',
  '#2F7A55','#7C3FA2','#3E365F','#91783F'
];

export default function CrystalWheelModal({ open, onClose, accent }) {
  const wheelRef = useRef(null); // contenedor que rota
  const canvasRef = useRef(null); // canvas del wheel
  const containerRef = useRef(null); // para medir tamaño
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0); // total applied rotation
  const [resultIndex, setResultIndex] = useState(null);
  const [diameter, setDiameter] = useState(520);
  const sliceAngle = 360 / cristales.length; // 22.5° para 16

  // Resize observer para canvas responsivo
  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        // Ajuste: en mobile (<640) limitar a 360-400 para no ocupar toda la pantalla
        const isMobile = window.innerWidth < 640;
        const maxD = isMobile ? 380 : 600;
        const minD = isMobile ? 260 : 480;
        const d = Math.max(minD, Math.min(maxD, w));
        setDiameter(d);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Dibujo del wheel en canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = diameter * dpr;
    canvas.height = diameter * dpr;
    canvas.style.width = diameter + 'px';
    canvas.style.height = diameter + 'px';
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0,0,diameter,diameter);
    const center = diameter / 2;
    const radius = (diameter / 2) - 2; // padding pequeño
    const sliceRad = (Math.PI * 2) / cristales.length;
    // Fuente responsive
    const mobile = diameter < 420;
    const baseFont = mobile ? Math.max(12, Math.min(14, diameter/26)) : Math.min(18, Math.max(16, diameter/28));
    ctx.font = `${baseFont}px 'Inter', system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const textRadius = radius * 0.55; // más centrado dentro del sector

    function drawLabel(rawName, midAngle) {
      const name = rawName.replace(/\s*\(.*?\)/,'');
      // Anchura disponible: chord a esa distancia
      const chord = 2 * textRadius * Math.tan(sliceRad/2) * 0.9; // margen
      // Si excede, intentar dividir en dos líneas
      const words = name.split(/\s+/);
      let lines = [name];
      let measure = ctx.measureText(name).width;
      if (measure > chord && words.length > 1) {
        // Greedy split
        let best = [name];
        for (let split = 1; split < words.length; split++) {
          const l1 = words.slice(0, split).join(' ');
            const l2 = words.slice(split).join(' ');
            const w1 = ctx.measureText(l1).width;
            const w2 = ctx.measureText(l2).width;
            if (w1 <= chord && w2 <= chord) { best = [l1, l2]; break; }
        }
        lines = best;
      }
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(midAngle); // orientar eje Y al centro del sector
      ctx.translate(0, -textRadius);
      ctx.rotate(-midAngle); // devolver texto horizontal al usuario
      ctx.fillStyle = 'white';
      ctx.shadowColor = 'rgba(0,0,0,0.6)';
      ctx.shadowBlur = 4;
      const lineHeight = baseFont * 1.05;
      if (lines.length === 1) {
        ctx.fillText(lines[0], 0, 0);
      } else {
        const totalH = lineHeight * lines.length;
        lines.forEach((ln, idx) => {
          ctx.fillText(ln, 0, -totalH/2 + lineHeight/2 + idx*lineHeight);
        });
      }
      ctx.restore();
    }
    for (let i=0;i<cristales.length;i++) {
      const start = i * sliceRad;
      const end = start + sliceRad;
      // Sector
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, start, end);
      ctx.closePath();
      ctx.fillStyle = SECTOR_COLORS[i % SECTOR_COLORS.length];
      ctx.fill();
      const mid = start + sliceRad/2;
      drawLabel(cristales[i].nombre, mid);
    }
    // Borde exterior sutil
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI*2);
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [diameter, open]);

  const spin = useCallback(() => {
    if (spinning) return;
    setSpinning(true);
    setResultIndex(null);
    const targetIndex = Math.floor(Math.random() * cristales.length);
    const turns = 5 + Math.floor(Math.random()*3); // 5-7 vueltas
    const centerAngle = (targetIndex + 0.5) * sliceAngle; // ángulo donde está el centro del sector
    // Queremos que ese centro quede arriba (0deg). El ángulo visual final = actualRotation + delta
    // Fórmula: total = turns*360 + (360 - centerAngle)
    const finalRotation = turns * 360 + (360 - centerAngle);
    setRotation(prev => prev + finalRotation); // acumulativo para no tener que normalizar
  }, [spinning, sliceAngle]);

  useEffect(() => {
  const wheel = wheelRef.current;
    if (!wheel) return;
    const handleEnd = () => {
      setSpinning(false);
      // Normalizar rot final para hallar sector ganador
      const current = rotation % 360;
      // El sector cuyo centro queda en 0 arriba => invertimos la fórmula: centerAngle ≈ 360 - current
      let center = (360 - current);
      if (center < 0) center += 360;
      // Encontrar índice cuyo centro más cercano coincida con 'center'
      // centro teórico del sector i: (i + 0.5)*sliceAngle
      let chosen = 0;
      let minDiff = Infinity;
      for (let i=0;i<cristales.length;i++) {
        const cAng = (i + 0.5) * sliceAngle;
        const diff = Math.abs(cAng - center);
        if (diff < minDiff) { minDiff = diff; chosen = i; }
      }
      setResultIndex(chosen);
    };
    wheel.addEventListener('transitionend', handleEnd);
    return () => wheel.removeEventListener('transitionend', handleEnd);
  }, [rotation, sliceAngle]);

  useEffect(() => {
    if (open) {
      setSpinning(false);
      setResultIndex(null);
    }
  }, [open]);

  if (!open) return null;

  const result = resultIndex != null ? cristales[resultIndex] : null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 md:p-6">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-5xl mx-auto flex flex-col gap-5 items-center max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <header className="w-full flex items-center justify-between gap-4 px-1">
          <h3 className="text-lg md:text-xl font-semibold tracking-wide text-center flex-1" style={{ color: accent }}>Rueda de Cristales</h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={spinning}
              onClick={spin}
              className="rounded-xl px-5 py-2 text-sm font-semibold text-black disabled:opacity-50"
              style={{ background: accent }}
            >{spinning ? 'Girando...' : 'Girar'}</button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-white/70 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
              aria-label="Cerrar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>
        </header>
        <div ref={containerRef} className="relative select-none flex items-center justify-center" style={{ width: 'min(82vw,600px)' }}>
          {/* Flecha (invertida para que apunte hacia abajo) */}
          <div
            className="absolute left-1/2 -translate-x-1/2 -top-2 z-20 w-0 h-0"
            style={{
              borderLeft: '14px solid transparent',
              borderRight: '14px solid transparent',
              borderTop: `26px solid ${accent}`,
              filter: 'drop-shadow(0 0 6px rgba(212,175,55,0.55))'
            }}
            aria-hidden
          />
          <div
            ref={wheelRef}
            className="rounded-full relative transition-[transform] ease-out will-change-transform"
            style={{
              width: diameter + 'px',
              height: diameter + 'px',
              transform: `rotate(${rotation}deg)`,
              transitionDuration: spinning ? '4s' : '0s',
              boxShadow: '0 0 0 2px rgba(255,255,255,0.08),0 0 40px -10px rgba(212,175,55,0.4)',
              background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05), rgba(0,0,0,0.15))'
            }}
          >
            <canvas ref={canvasRef} className="rounded-full" />
          </div>
        </div>
        <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col max-w-3xl mx-auto max-h-[50vh] overflow-y-auto" style={{ backdropFilter: 'blur(4px)' }}>
          {!result && (
            <p className="text-white/70 text-sm md:text-base text-center italic">Girá la rueda para recibir el cristal que hoy acompaña tu proceso.</p>
          )}
          {result && (
            <div className="space-y-3">
              <h4 className="text-xl font-semibold leading-tight" style={{ color: accent }}>{result.nombre}</h4>
              <p className="text-white/80 text-sm md:text-base leading-snug"><span className="font-medium text-white/90">Descripción:</span> {result.descripcion}</p>
              <p className="text-white/70 text-xs md:text-sm"><span className="font-medium text-white/85">Cuerpo:</span> {result.cuerpo}</p>
              <p className="text-white/70 text-xs md:text-sm"><span className="font-medium text-white/85">Beneficios:</span> {result.beneficios}</p>
              <p className="text-white/80 text-sm md:text-base italic" style={{ textShadow: '0 0 6px rgba(212,175,55,0.4)', color: accent }}>{result.mensaje}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
