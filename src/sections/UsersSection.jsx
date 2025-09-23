import React, { useEffect, useMemo, useRef, useState } from 'react';
import PinGate from '../components/PinGate';
import Accordion from '../components/Accordion';
import GeometriasGallery from '../components/GeometriasGallery';
import FrecuenciasList from '../components/FrecuenciasList';
import ComandosList from '../components/ComandosList';
import CristalesModal from '../components/CristalesModal';
// import CodigosList from '../components/CodigosList';

const STORAGE_KEY = 'usersAccessGranted';
const VALID_PIN = '2233';

export default function UsersSection({ accent }) {
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const pin = params.get('pin');
      const has = localStorage.getItem(STORAGE_KEY) === 'true';
      if (pin && pin === VALID_PIN) {
        localStorage.setItem(STORAGE_KEY, 'true');
        setGranted(true);
      } else {
        setGranted(has);
      }
    } catch {
      // noop
    }
  }, []);

  const onGranted = () => {
    try { localStorage.setItem(STORAGE_KEY, 'true'); } catch {}
    setGranted(true);
  };

  const onLogout = () => {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    setGranted(false);
  };

  if (!granted) {
    return (
      <section id="usuarios" className="relative border-t border-white/10 py-20">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="section-title mb-4 text-2xl font-bold md:text-4xl">
            <span style={{ color: accent }}>Sección de Usuarios</span>
          </h2>
          <p className="text-white/80 mb-6">
            Acceso exclusivo para consultantes. Ingresá con el PIN que te compartí al finalizar tu sesión.
            <br />
            Aquí encontrarás ejercicios, ayudas y frecuencias para tu integración.
          </p>
          <PinGate accent={accent} onSuccess={onGranted} validPin={VALID_PIN} />
        </div>
      </section>
    );
  }

  return (
    <section id="usuarios" className="relative border-t border-white/10 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-6 flex items-center justify-between gap-3">
          <h2 className="section-title text-2xl font-bold md:text-4xl" style={{ color: accent }}>Usuarios</h2>
          <button type="button" onClick={onLogout} className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/80 hover:bg-white/15">Salir</button>
        </div>
        {/* Consigna destacada */}
        <Consigna accent={accent} />
        <AccordionsHub accent={accent} />
      </div>
    </section>
  );
}

function Consigna({ accent }) {
  return (
    <div className="mb-8 rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-5 shadow-[0_0_40px_-10px_rgba(212,175,55,0.35)]">
      <div className="flex items-start gap-3">
        <div
          className="mt-1 hidden sm:inline-flex h-8 w-8 items-center justify-center rounded-full text-black shadow"
          style={{ background: accent }}
          aria-hidden
        >
          {/* Sparkles icon */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path d="M11.48 3.499a.75.75 0 0 1 1.04 0l1.69 1.69a2.25 2.25 0 0 0 1.591.659l2.39.023a.75.75 0 0 1 .53 1.28l-1.7 1.7a2.25 2.25 0 0 0-.657 1.588l.023 2.391a.75.75 0 0 1-1.28.531l-1.7-1.7a2.25 2.25 0 0 0-1.589-.657l-2.39.023a.75.75 0 0 1-.531-1.281l1.7-1.699a2.25 2.25 0 0 0 .657-1.59l-.023-2.39a.75.75 0 0 1 .24-.54Z"/>
          </svg>
        </div>
        <div>
          <h3 className="mb-2 text-xl font-semibold" style={{ color: accent }}>Investiga tu intuición</h3>
          <p className="text-white/90 max-w-3xl text-base md:text-lg">
            Este espacio reúne <strong style={{ color: accent }}>geometrías</strong>, <strong style={{ color: accent }}>frecuencias</strong>, <strong style={{ color: accent }}>comandos</strong> y <strong style={{ color: accent }}>cristales</strong> para que continúes tu proceso. Elegí <span className="font-semibold" style={{ color: accent, textShadow: '0 0 10px rgba(212,175,55,0.55)' }}>lo que te llame</span> —eso que te atrae es lo que tu campo de energía <span className="font-semibold" style={{ color: accent, textShadow: '0 0 10px rgba(212,175,55,0.55)' }}>necesita ahora</span>.
          </p>
          <ul className="mt-3 grid gap-2 text-white/80 max-w-3xl">
            <li className="flex items-start gap-2">
              <svg className="mt-1 h-3.5 w-3.5 shrink-0 animate-pulse" viewBox="0 0 24 24" fill="currentColor" style={{ color: accent, filter: 'drop-shadow(0 0 6px rgba(212,175,55,0.5))' }} aria-hidden>
                <path d="M12 2l2.6 6.9L22 10l-5.5 4.2L18.2 22 12 18.2 5.8 22l1.7-7.8L2 10l7.4-1.1L12 2z"/>
              </svg>
              Imprimí las imágenes y llevalas con vos: casa, trabajo, billetera, celu, bajo la almohada.
            </li>
            <li className="flex items-start gap-2">
              <svg className="mt-1 h-3.5 w-3.5 shrink-0 animate-pulse" viewBox="0 0 24 24" fill="currentColor" style={{ color: accent, filter: 'drop-shadow(0 0 6px rgba(212,175,55,0.5))' }} aria-hidden>
                <path d="M12 2l2.6 6.9L22 10l-5.5 4.2L18.2 22 12 18.2 5.8 22l1.7-7.8L2 10l7.4-1.1L12 2z"/>
              </svg>
              Escuchá frecuencias para dormir, meditar o acompañar momentos de calma.
            </li>
            <li className="flex items-start gap-2">
              <svg className="mt-1 h-3.5 w-3.5 shrink-0 animate-pulse" viewBox="0 0 24 24" fill="currentColor" style={{ color: accent, filter: 'drop-shadow(0 0 6px rgba(212,175,55,0.5))' }} aria-hidden>
                <path d="M12 2l2.6 6.9L22 10l-5.5 4.2L18.2 22 12 18.2 5.8 22l1.7-7.8L2 10l7.4-1.1L12 2z"/>
              </svg>
              Repetí los comandos en voz alta, con intención clara y respiración consciente.
            </li>
            <li className="flex items-start gap-2">
              <svg className="mt-1 h-3.5 w-3.5 shrink-0 animate-pulse" viewBox="0 0 24 24" fill="currentColor" style={{ color: accent, filter: 'drop-shadow(0 0 6px rgba(212,175,55,0.5))' }} aria-hidden>
                <path d="M12 2l2.6 6.9L22 10l-5.5 4.2L18.2 22 12 18.2 5.8 22l1.7-7.8L2 10l7.4-1.1L12 2z"/>
              </svg>
              Elegí un cristal y, si podés conseguirlo, que te acompañe durante este período.
            </li>
          </ul>
          <p className="mt-4 text-center text-white/90 text-base md:text-lg">
            Cerrá los ojos, respirá profundo y preguntate:
            <br />
            <span className="font-semibold" style={{ color: accent, textShadow: '0 0 10px rgba(212,175,55,0.55)' }}>¿con qué empiezo hoy?</span>
          </p>
          <QuickActions accent={accent} />
        </div>
      </div>
    </div>
  );
}

function AccordionsHub({ accent }) {
  const geoRef = useRef(null);
  const frecRef = useRef(null);
  const cmdRef = useRef(null);
  const [openGeo, setOpenGeo] = useState(false); // cerrado por defecto
  const [openFrec, setOpenFrec] = useState(false);
  const [openCmd, setOpenCmd] = useState(false);
  const [cristalesOpen, setCristalesOpen] = useState(false);

  // Expose small event bus on window to trigger from QuickActions
  useEffect(() => {
    const api = {
      openGeo: () => { setOpenGeo(true); setOpenFrec(false); setOpenCmd(false); geoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); },
      openFrec: () => { setOpenGeo(false); setOpenFrec(true); setOpenCmd(false); frecRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); },
      openCmd: () => { setOpenGeo(false); setOpenFrec(false); setOpenCmd(true); cmdRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); },
      openCristales: () => { setCristalesOpen(true); },
    };
    window.__usersQuickActions = api;
    return () => { if (window.__usersQuickActions === api) delete window.__usersQuickActions; };
  }, []);

  return (
    <div className="space-y-4">
      <div ref={geoRef}>
        <Accordion title={<span style={{ color: accent }}>Imágenes (Geometría Sagrada)</span>} accent={accent} open={openGeo} onToggle={setOpenGeo}>
          <GeometriasGallery accent={accent} />
        </Accordion>
      </div>
      <div ref={frecRef}>
        <Accordion title={<span style={{ color: accent }}>Frecuencias</span>} accent={accent} open={openFrec} onToggle={setOpenFrec}>
          <FrecuenciasList accent={accent} />
        </Accordion>
      </div>
      <div ref={cmdRef}>
        <Accordion title={<span style={{ color: accent }}>Comandos</span>} accent={accent} open={openCmd} onToggle={setOpenCmd}>
          <ComandosList accent={accent} />
        </Accordion>
      </div>
      {/* Botón para abrir Cristales */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => setCristalesOpen(true)}
          className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-left hover:bg-white/10 transition"
        >
          <span className="font-semibold" style={{ color: accent }}>Cristales</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
      </div>
      <CristalesModal open={cristalesOpen} onClose={() => setCristalesOpen(false)} accent={accent} />
      {/* Sección Códigos de luz eliminada a pedido */}
    </div>
  );
}

function QuickActions({ accent }) {
  const base = 'inline-flex items-center justify-center gap-1 rounded-xl border border-white/15 bg-white/10 text-white/90 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/30 transition';
  return (
    <div className="mt-4 flex w-full flex-nowrap gap-2 overflow-x-auto pb-1 sm:overflow-visible sm:flex-wrap">
      <button type="button" className={`${base} px-2 py-1.5 text-[11px] sm:text-sm sm:px-3`} onClick={() => window.__usersQuickActions?.openGeo?.()}>
        <span className="h-2 w-2 rounded-full" style={{ background: accent }} /> Geometría
      </button>
      <button type="button" className={`${base} px-2 py-1.5 text-[11px] sm:text-sm sm:px-3`} onClick={() => window.__usersQuickActions?.openFrec?.()}>
        <span className="h-2 w-2 rounded-full" style={{ background: accent }} /> Frecuencias
      </button>
      <button type="button" className={`${base} px-2 py-1.5 text-[11px] sm:text-sm sm:px-3`} onClick={() => window.__usersQuickActions?.openCmd?.()}>
        <span className="h-2 w-2 rounded-full" style={{ background: accent }} /> Comandos
      </button>
      <button type="button" className={`${base} px-2 py-1.5 text-[11px] sm:text-sm sm:px-3`} onClick={() => window.__usersQuickActions?.openCristales?.()}>
        <span className="h-2 w-2 rounded-full" style={{ background: accent }} /> Cristales
      </button>
    </div>
  );
}
