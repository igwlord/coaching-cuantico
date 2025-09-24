import React, { useEffect, useMemo, useRef, useState } from 'react';
import PinGate from '../components/PinGate';
import Accordion from '../components/Accordion';
import GeometriasGallery from '../components/GeometriasGallery';
import FrecuenciasList from '../components/FrecuenciasList';
import ComandosList from '../components/ComandosList';
import CristalesList from '../components/CristalesList';
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
        <div className="mb-6 flex items-center justify-center gap-3 relative">
          <h2 className="section-title text-3xl md:text-4xl font-bold tracking-wide text-center" style={{ color: accent }}>Usuarios</h2>
          <button type="button" onClick={onLogout} className="absolute right-0 top-1/2 -translate-y-1/2 rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-xs md:text-sm text-white/80 hover:bg-white/15">Salir</button>
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
      <h3 className="mb-4 text-center text-xl font-semibold md:text-2xl" style={{ color: accent }}>Investiga tu intuición</h3>
      <p className="text-white/90 mx-auto max-w-3xl text-sm md:text-base">
        Este espacio reúne <strong style={{ color: accent }}>geometrías</strong>, <strong style={{ color: accent }}>frecuencias</strong>, <strong style={{ color: accent }}>comandos</strong> y <strong style={{ color: accent }}>cristales</strong> para que continúes tu proceso. Elegí <span className="font-semibold" style={{ color: accent, textShadow: '0 0 10px rgba(212,175,55,0.55)' }}>lo que te llame</span> —eso que te atrae es lo que tu campo de energía <span className="font-semibold" style={{ color: accent, textShadow: '0 0 10px rgba(212,175,55,0.55)' }}>necesita ahora</span>.
      </p>
      <ul className="mt-4 mx-auto grid gap-2 text-white/80 max-w-3xl text-sm md:text-base">
        <li className="flex items-start gap-2">
          <span className="mt-1 h-2.5 w-2.5 rounded-full" style={{ background: accent }} aria-hidden />
          Imprimí las imágenes y llevalas con vos: casa, trabajo, billetera, celu, bajo la almohada.
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1 h-2.5 w-2.5 rounded-full" style={{ background: accent }} aria-hidden />
          Escuchá frecuencias para dormir, meditar o acompañar momentos de calma.
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1 h-2.5 w-2.5 rounded-full" style={{ background: accent }} aria-hidden />
          Repetí los comandos en voz alta, con intención clara y respiración consciente.
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1 h-2.5 w-2.5 rounded-full" style={{ background: accent }} aria-hidden />
          Elegí un cristal de la lista y si podés conseguirlo, él te acompañará durante los siguientes días posteriores a la sesión.
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1 h-2.5 w-2.5 rounded-full" style={{ background: accent }} aria-hidden />
          Tiempo recomendado del ejercicio: +7 días después de nuestra sesión.
        </li>
      </ul>
      <p className="mt-5 text-center text-white/90 text-sm md:text-lg">
        Cerrá los ojos, respirá profundo y preguntate:
        <br />
        <span className="font-semibold" style={{ color: accent, textShadow: '0 0 10px rgba(212,175,55,0.55)' }}>¿con qué empiezo hoy?</span>
      </p>
      <QuickActions accent={accent} />
    </div>
  );
}

function AccordionsHub({ accent }) {
  const geoRef = useRef(null);
  const frecRef = useRef(null);
  const cmdRef = useRef(null);
  const cristRef = useRef(null);
  const [openGeo, setOpenGeo] = useState(false); // cerrado por defecto
  const [openFrec, setOpenFrec] = useState(false);
  const [openCmd, setOpenCmd] = useState(false);
  const [openCrist, setOpenCrist] = useState(false);

  // Expose small event bus on window to trigger from QuickActions
  useEffect(() => {
    const api = {
      openGeo: () => { setOpenGeo(true); setOpenFrec(false); setOpenCmd(false); setOpenCrist(false); geoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); },
      openFrec: () => { setOpenGeo(false); setOpenFrec(true); setOpenCmd(false); setOpenCrist(false); frecRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); },
      openCmd: () => { setOpenGeo(false); setOpenFrec(false); setOpenCmd(true); setOpenCrist(false); cmdRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); },
      openCristales: () => { setOpenGeo(false); setOpenFrec(false); setOpenCmd(false); setOpenCrist(true); cristRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); },
    };
    window.__usersQuickActions = api;
    return () => { if (window.__usersQuickActions === api) delete window.__usersQuickActions; };
  }, []);

  const handleToggle = (key) => {
    setOpenGeo(prev => key==='geo' ? !prev : false);
    setOpenFrec(prev => key==='frec' ? (key==='frec' ? !openFrec : false) : false);
    setOpenCmd(prev => key==='cmd' ? !prev : false);
    setOpenCrist(prev => key==='crist' ? !prev : false);
  };
  return (
    <div className="space-y-4">
      <div ref={geoRef}>
        <Accordion title={<span style={{ color: accent }}>Imágenes (Geometría Sagrada)</span>} accent={accent} open={openGeo} onToggle={() => handleToggle('geo')}>
          <GeometriasGallery accent={accent} />
        </Accordion>
      </div>
      <div ref={frecRef}>
        <Accordion title={<span style={{ color: accent }}>Frecuencias</span>} accent={accent} open={openFrec} onToggle={() => handleToggle('frec')}>
          <FrecuenciasList accent={accent} />
        </Accordion>
      </div>
      <div ref={cmdRef}>
        <Accordion title={<span style={{ color: accent }}>Comandos</span>} accent={accent} open={openCmd} onToggle={() => handleToggle('cmd')}>
          <ComandosList accent={accent} />
        </Accordion>
      </div>
      <div ref={cristRef}>
        <Accordion title={<span style={{ color: accent }}>Cristales</span>} accent={accent} open={openCrist} onToggle={() => handleToggle('crist')}>
          <CristalesList accent={accent} />
        </Accordion>
      </div>
    </div>
  );
}

function QuickActions({ accent }) {
  const base = 'inline-flex items-center justify-center gap-1 rounded-xl border border-white/15 bg-white/10 text-white/90 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/30 transition shadow-sm';
  return (
    <div className="mt-4 flex w-full flex-wrap gap-2 justify-center">
      {[
        ['Geometría','openGeo'],
        ['Frecuencias','openFrec'],
        ['Comandos','openCmd'],
        ['Cristales','openCristales'],
      ].map(([label, key]) => (
        <button key={key} type="button" className={`${base} px-3 py-1.5 text-[11px] sm:text-sm`} onClick={() => window.__usersQuickActions?.[key]?.()}>
          <span className="h-2 w-2 rounded-full" style={{ background: accent }} /> {label}
        </button>
      ))}
    </div>
  );
}
