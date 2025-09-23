import React, { useEffect, useMemo, useState } from 'react';
import PinGate from '../components/PinGate';
import Accordion from '../components/Accordion';
import GeometriasGallery from '../components/GeometriasGallery';
import FrecuenciasList from '../components/FrecuenciasList';
import ComandosList from '../components/ComandosList';
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
        <p className="text-white/80 mb-8 max-w-3xl">Aquí encontrarás material de apoyo para la integración posterior a tu sesión: imágenes de geometría sagrada, frecuencias y recomendaciones.</p>
        <div className="space-y-4">
          <Accordion title={<span style={{ color: accent }}>Imágenes (Geometría Sagrada)</span>} accent={accent}>
            <GeometriasGallery accent={accent} />
          </Accordion>
          <Accordion title={<span style={{ color: accent }}>Frecuencias</span>} accent={accent}>
            <FrecuenciasList accent={accent} />
          </Accordion>
          <Accordion title={<span style={{ color: accent }}>Comandos</span>} accent={accent}>
            <ComandosList accent={accent} />
          </Accordion>
          {/* Sección Códigos de luz eliminada a pedido */}
        </div>
      </div>
    </section>
  );
}
