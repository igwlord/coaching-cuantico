import React, { useEffect, useMemo, useRef, useState } from 'react';
import frecuencias from '../content/frecuencias';

// Hook reproductor simple basado en archivos locales /Frecuencias/<hz>.mp3
function useFrequencyPlayer() {
  const audioRef = useRef(null);
  const [current, setCurrent] = useState(null); // { hz,title,src }
  const [playing, setPlaying] = useState(false);

  const stop = () => {
    try {
      audioRef.current?.pause();
      audioRef.current = null;
    } catch {}
    setPlaying(false);
    setCurrent(null);
  };

  const play = (hz, title) => {
    const src = `/Frecuencias/${hz}.mp3`;
    if (playing && current?.hz === hz) {
      stop();
      return;
    }
    stop();
    const audio = new Audio(src);
    audioRef.current = audio;
    audio.play().then(() => {
      setCurrent({ hz, title, src });
      setPlaying(true);
    }).catch(() => setPlaying(false));
    audio.onended = stop;
  };

  useEffect(() => () => { stop(); }, []);
  return { current, playing, play, stop };
}

export default function FrecuenciasList({ accent }) {
  const player = useFrequencyPlayer();
  const [openId, setOpenId] = useState(null);

  const covers = useMemo(() => {
    const map = import.meta.glob('/images/Frecuencias/*', { eager: true, query: '?url', import: 'default' });
    return Object.entries(map).reduce((acc, [path, url]) => {
      const name = path.split('/').pop();
      const hz = parseInt(name, 10);
      if (!isNaN(hz)) acc[hz] = url;
      return acc;
    }, {});
  }, []);

  const togglePlay = (f) => {
    if (player.current?.hz === f.hz && player.playing) player.stop(); else player.play(f.hz, `${f.hz} Hz – ${f.title}`);
  };

  return (
    <div className="space-y-3">
      {frecuencias.map(f => {
        const isOpen = openId === f.hz;
        const panelRef = useRef(null);
        const [height, setHeight] = useState(0);
        const segments = (f.content || '').split(/\n\s*\n/);
        const visIndex = segments.findIndex(s => /^\s*Visualización:/i.test(s));
        const visRaw = visIndex >= 0 ? segments[visIndex] : null;
        const visText = visRaw ? visRaw.replace(/^\s*Visualización:\s*/i, '') : null;
        const pre = visIndex >= 0 ? segments.slice(0, visIndex) : segments;
        useEffect(() => {
          if (isOpen && panelRef.current) {
            setHeight(panelRef.current.scrollHeight);
            // Notifica al contenedor principal que cambió la altura
            window.dispatchEvent(new CustomEvent('cc-inner-accordion-change'));
          } else if (!isOpen) {
            setHeight(0);
            window.dispatchEvent(new CustomEvent('cc-inner-accordion-change'));
          }
        }, [isOpen]);
        useEffect(() => { const onResize = () => { if (isOpen && panelRef.current) setHeight(panelRef.current.scrollHeight); }; window.addEventListener('resize', onResize); return () => window.removeEventListener('resize', onResize); }, [isOpen]);
        return (
          <div key={f.hz} className="rounded-xl border border-white/10 bg-white/5">
            <div className="flex items-center gap-3 p-3">
              {covers[f.hz] ? (
                <div className="relative h-10 w-10 rounded-md ring-1 ring-white/10 overflow-hidden bg-white/5 flex items-center justify-center">
                  <img src={covers[f.hz]} alt={`${f.hz}Hz`} className="absolute inset-0 h-full w-full object-cover opacity-30" loading="lazy" />
                  <span className="text-[10px] font-semibold tracking-wide" style={{ color: accent }}>{f.hz}Hz</span>
                </div>
              ) : (
                <div className="h-10 w-10 rounded-md bg-white/10 ring-1 ring-white/10 flex items-center justify-center text-[10px] font-semibold" style={{ color: accent }}>{f.hz}Hz</div>
              )}
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : f.hz)}
                className="flex-1 text-left min-w-0"
                aria-expanded={isOpen}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="font-semibold text-[12px] sm:text-sm leading-snug break-words" style={{ color: accent }}>
                    {f.hz === 432 ? 'Armonía con la Tierra' : f.title}
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`flex-shrink-0 mt-0.5 transition-transform ${isOpen ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"/></svg>
                </div>
              </button>
              <button
                type="button"
                onClick={() => togglePlay(f)}
                className="rounded-full px-3 py-2 text-black font-semibold flex items-center gap-2"
                style={{ background: accent }}
                aria-label={player.current?.hz === f.hz && player.playing ? `Pausar ${f.hz} Hz` : `Reproducir ${f.hz} Hz`}
              >
                {player.current?.hz === f.hz && player.playing ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M6.75 5.25A.75.75 0 0 1 7.5 6v12a.75.75 0 0 1-1.5 0V6a.75.75 0 0 1 .75-.75Zm9 0A.75.75 0 0 1 16.5 6v12a.75.75 0 0 1-1.5 0V6a.75.75 0 0 1 .75-.75Z"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M6 4.5v15l12-7.5L6 4.5Z"/></svg>
                )}
                <span className="hidden sm:inline">{player.current?.hz === f.hz && player.playing ? 'Pausar' : 'Reproducir'}</span>
              </button>
            </div>
            <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: height, opacity: isOpen ? 1 : 0.6 }}>
              <div ref={panelRef} className="px-4 pb-4 pt-1 text-sm text-white/80 space-y-3 custom-scroll">
                {pre.map((seg,i)=>(<p key={i} className="whitespace-pre-line leading-relaxed">{seg}</p>))}
                {visText && (
                  <div className="pt-1">
                    <p className="font-semibold text-white/90 mb-1" style={{ color: accent }}>Visualización</p>
                    <blockquote
                      className="text-[12px] md:text-[13px] leading-relaxed font-medium italic rounded-lg bg-black/30 p-3 border border-white/10 shadow-inner"
                      style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.05), 0 0 22px -6px rgba(212,175,55,0.4)', color: accent, textShadow: '0 0 8px rgba(212,175,55,0.45)' }}
                    >{visText}</blockquote>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {player.playing && (
        <>
          {/* Player móvil */}
          <div className="fixed inset-x-3 bottom-4 z-40 rounded-xl border border-white/10 bg-white/10 backdrop-blur-md p-3 md:hidden">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-semibold">{player.current?.title}</div>
                <div className="text-xs text-white/70">Reproduciendo…</div>
              </div>
              <button
                type="button"
                onClick={() => player.stop()}
                className="rounded-full p-2 text-black font-semibold"
                style={{ background: accent }}
                aria-label="Pausar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M6.75 5.25A.75.75 0 0 1 7.5 6v12a.75.75 0 0 1-1.5 0V6a.75.75 0 0 1 .75-.75Zm9 0A.75.75 0 0 1 16.5 6v12a.75.75 0 0 1-1.5 0V6a.75.75 0 0 1 .75-.75Z"/></svg>
              </button>
            </div>
          </div>
          {/* Player desktop */}
          <div className="fixed right-6 bottom-6 z-40 hidden md:block">
            <div className="rounded-xl border border-white/10 bg-white/10 backdrop-blur-md p-3 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-semibold">{player.current?.title}</div>
                  <div className="text-xs text-white/70">Reproduciendo…</div>
                </div>
                <button
                  type="button"
                  onClick={() => player.stop()}
                  className="rounded-full p-2 text-black font-semibold"
                  style={{ background: accent }}
                  aria-label="Pausar"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M6.75 5.25A.75.75 0 0 1 7.5 6v12a.75.75 0 0 1-1.5 0V6a.75.75 0 0 1 .75-.75Zm9 0A.75.75 0 0 1 16.5 6v12a.75.75 0 0 1-1.5 0V6a.75.75 0 0 1 .75-.75Z"/></svg>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
