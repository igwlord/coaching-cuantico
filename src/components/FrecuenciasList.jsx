import React, { useEffect, useMemo, useRef, useState } from 'react';
import frecuencias from '../content/frecuencias';

// Reproductor basado en archivos MP3 desde /Frecuencias/<hz>.mp3
function useFrequencyPlayer() {
  const audioRef = useRef(null); // HTMLAudioElement
  const [current, setCurrent] = useState(null); // { hz, title, src }
  const [playing, setPlaying] = useState(false);

  const stop = () => {
    if (!audioRef.current) { setPlaying(false); setCurrent(null); return; }
    try {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    } catch {}
    setPlaying(false);
    setCurrent(null);
  };

  const play = (hz, title) => {
    const src = `/Frecuencias/${hz}.mp3`;
    // Si ya está sonando la misma, pausar
    if (playing && current?.hz === hz) {
      stop();
      return;
    }
    // Parar cualquier audio anterior
    stop();
    const audio = new Audio(src);
    audioRef.current = audio;
    audio.play().then(() => {
      setCurrent({ hz, title, src });
      setPlaying(true);
    }).catch(() => {
      setPlaying(false);
    });
    audio.onended = () => {
      setPlaying(false);
      setCurrent(null);
      audioRef.current = null;
    };
  };

  useEffect(() => {
    return () => { try { stop(); } catch {} };
  }, []);

  return { current, playing, play, stop };
}

function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm p-4 flex items-center justify-center" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="max-w-2xl w-full rounded-2xl border border-white/10 bg-white/5 p-5" onClick={(e)=>e.stopPropagation()}>
        <div className="flex items-center justify-between gap-3 mb-3">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button type="button" onClick={onClose} className="rounded-md bg-white/10 px-2 py-1 text-sm">Cerrar</button>
        </div>
        <div className="prose prose-invert max-w-none text-white/90 text-sm">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function FrecuenciasList({ accent }) {
  const player = useFrequencyPlayer();
  const [openId, setOpenId] = useState(null);
  const covers = useMemo(() => {
    // Busca imágenes en /images/Frecuencias con nombre que incluya el Hz (ej: 432.jpg)
    const map = import.meta.glob('/images/Frecuencias/*', { eager: true, query: '?url', import: 'default' });
    return Object.entries(map).reduce((acc, [path, url]) => {
      const name = path.split('/').pop();
      const hz = parseInt(name, 10);
      if (!isNaN(hz)) acc[hz] = url;
      return acc;
    }, {});
  }, []);

  const onToggle = (f) => {
    if (player.current?.hz === f.hz && player.playing) {
      player.stop();
    } else {
      player.play(f.hz, `${f.hz} Hz – ${f.title}`);
    }
  };

  return (
    <div className="space-y-3">
      {frecuencias.map((f) => (
        <div key={f.hz} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center gap-3 min-w-0">
            {covers[f.hz] ? (
              <img src={covers[f.hz]} alt={`${f.hz} Hz`} className="h-10 w-10 rounded-md object-cover ring-1 ring-white/10" loading="lazy" />
            ) : (
              <div className="h-10 w-10 rounded-md bg-white/10 ring-1 ring-white/10 flex items-center justify-center text-xs text-white/70">{f.hz}</div>
            )}
            <div className="min-w-0">
              <div className="font-semibold truncate" style={{ color: accent }}>{f.hz} Hz — {f.title}</div>
              <button type="button" className="text-sm text-white/80 underline" onClick={() => setOpenId(f.hz)}>Más info</button>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onToggle(f)}
            className="rounded-full px-3 py-2 text-black font-semibold flex items-center gap-2"
            style={{ background: accent }}
            aria-label={player.current?.hz === f.hz && player.playing ? `Pausar ${f.hz} Hz` : `Reproducir ${f.hz} Hz`}
          >
            {/* Íconos universales; en móviles el texto puede omitirse con hidden */}
            {player.current?.hz === f.hz && player.playing ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M6.75 5.25A.75.75 0 0 1 7.5 6v12a.75.75 0 0 1-1.5 0V6a.75.75 0 0 1 .75-.75Zm9 0A.75.75 0 0 1 16.5 6v12a.75.75 0 0 1-1.5 0V6a.75.75 0 0 1 .75-.75Z"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M6 4.5v15l12-7.5L6 4.5Z"/></svg>
            )}
            <span className="hidden sm:inline">{player.current?.hz === f.hz && player.playing ? 'Pausar' : 'Reproducir'}</span>
          </button>
          <Modal open={openId === f.hz} onClose={() => setOpenId(null)} title={`${f.hz} Hz — ${f.title}`}>
            {f.content?.split('\n').map((p, i) => <p key={i} className="mb-3">{p}</p>)}
          </Modal>
        </div>
      ))}

      {/* Mini player (móvil y desktop) */}
      {player.playing && (
        <>
        {/* Móvil */}
        <div className="fixed inset-x-3 bottom-4 z-40 rounded-xl border border-white/10 bg-white/10 backdrop-blur-md p-3 md:hidden">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm font-semibold">{player.current?.title}</div>
              <div className="text-xs text-white/70">Reproduciendo…</div>
            </div>
            <div className="flex items-center gap-2">
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
        {/* Desktop */}
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
