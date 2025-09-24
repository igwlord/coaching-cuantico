import React, { useMemo } from 'react';
import FlipCard from './FlipCard';
import geometrias from '../content/geometrias';

// Intentamos descubrir imágenes automáticamente desde /public/images/Geometria
const geoAutoMap = import.meta.glob('/images/Geometria/*', { eager: true, query: '?url', import: 'default' });

function prettifySlug(slug) {
  return slug
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function normalize(str) {
  if (!str) return '';
  return String(str)
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function toPublicUrl(file) {
  // Encode spaces and special chars
  try {
    return `/images/Geometria/${encodeURIComponent(file)}`;
  } catch {
    return `/images/Geometria/${file}`;
  }
}

export default function GeometriasGallery({ accent }) {
  const items = useMemo(() => {
    // Denylist: archivos que NO deben mostrarse aunque existan en /public
    const excluded = new Set([normalize('vesica piscis')]);
    const files = Object.entries(geoAutoMap).map(([path, url]) => ({ file: path.split('/').pop(), url }));
    const manifest = geometrias;
    const byNorm = new Map();
    manifest.forEach(g => {
      byNorm.set(normalize(g.file.replace(/\.[^/.]+$/, '')), g);
      byNorm.set(normalize(g.slug), g);
      byNorm.set(normalize(g.name), g);
    });
    // Start with manifest order and fallback public URL
    const out = manifest
      .filter(g => !excluded.has(normalize(g.slug)) && !excluded.has(normalize(g.name)) && !excluded.has(normalize(g.file?.replace(/\.[^/.]+$/, ''))))
      .map(g => ({ ...g, src: toPublicUrl(g.file) }));
    // Overlay any discovered files with exact/normalized matches
    files.forEach(({ file, url }) => {
      const base = file.replace(/\.[^/.]+$/, '');
      const normBase = normalize(base);
      if (excluded.has(normBase)) return; // skip excluded files
      let g = manifest.find(m => m.file === file) || manifest.find(m => m.file?.toLowerCase() === file.toLowerCase());
      if (!g) g = byNorm.get(normalize(base));
      if (g) {
        const idx = out.findIndex(x => x.slug === g.slug);
        if (idx !== -1) out[idx] = { ...out[idx], src: url };
      } else {
        // Unknown file: add as extra card using prettified name
        if (!excluded.has(normBase)) {
          out.push({ slug: base, name: prettifySlug(base), file, src: url, desc: '' });
        }
      }
    });
    return out;
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {items.map((g) => {
        const imgSrc = g.src || `/images/Geometria/${g.file}`;
        return (
          <article key={g.slug} className="group">
            <FlipCard
              front={
                <div className="flex h-full flex-col">
                  <div className="relative bg-black/20 p-2 rounded-xl">
                    {/* Placeholder por si falla la imagen */}
                    <div className="absolute inset-2 rounded-lg bg-white/5 ring-1 ring-white/10 flex items-center justify-center text-white/60 text-xs z-0">
                      {/* visible sólo si la imagen no carga, la imagen se oculta en onError */}
                      Vista previa no disponible
                    </div>
                    <div className="relative aspect-square">
                      <img
                        src={imgSrc}
                        alt={g.name}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-contain object-center z-10"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    </div>
                  </div>
                </div>
              }
              back={
                <div className="h-full w-full p-4 flex flex-col min-h-0">
                  {/* Header: título + descarga (móvil: icono | desktop: botón compacto) */}
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold pr-2 truncate" style={{ color: accent }}>{g.name}</h4>
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      {/* Móvil: icono */}
                      <a
                        href={imgSrc}
                        download
                        aria-label={`Descargar ${g.name}`}
                        className="sm:hidden text-white/80 hover:text-white p-2 -m-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/40"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                          <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v8.69l2.47-2.47a.75.75 0 1 1 1.06 1.06l-3.75 3.75a.75.75 0 0 1-1.06 0L7.72 11.78a.75.75 0 1 1 1.06-1.06l2.47 2.47V4.5A.75.75 0 0 1 12 3.75ZM4.5 15.75a.75.75 0 0 1 .75-.75h13.5a.75.75 0 0 1 .75.75v3A2.25 2.25 0 0 1 17.25 21H6.75A2.25 2.25 0 0 1 4.5 18.75v-3Z" clipRule="evenodd" />
                        </svg>
                      </a>
                      {/* Desktop: botón compacto */}
                      <a
                        href={imgSrc}
                        download
                        className="hidden sm:inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-[13px] leading-none text-black font-semibold"
                        style={{ background: accent }}
                      >
                        Descargar
                      </a>
                    </div>
                  </div>
                  <div className="text-[13px] md:text-sm leading-snug text-white/80 flex-1 overflow-y-auto pr-1">
                    <p className="whitespace-pre-line">
                      {g.desc || 'Descripción disponible post-sesión.'}
                    </p>
                  </div>
                </div>
              }
            />
          </article>
        );
      })}
    </div>
  );
}
