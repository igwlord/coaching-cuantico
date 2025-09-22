import React, { useEffect, useRef, useState } from 'react';

export default function PinGate({ accent, onSuccess, validPin = '2233' }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    try {
      inputRef.current?.focus({ preventScroll: true });
    } catch {
      // fallback
      inputRef.current?.focus?.();
    }
  }, []);

  const submit = (e) => {
    e?.preventDefault?.();
    if (pin.trim() === validPin) {
      setError('');
      onSuccess?.();
    } else {
      setError('PIN incorrecto.');
    }
  };

  return (
    <form onSubmit={submit} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
      <p className="mb-4 text-sm text-white/80">Ingresa el PIN de acceso entregado después de tu sesión.</p>
      <div className="mx-auto max-w-[360px] flex items-center justify-center gap-3">
        <input
          ref={inputRef}
          type="password"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
          className="w-28 sm:w-40 md:w-56 text-center rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 outline-none focus:ring-2 focus:ring-white/30"
          aria-label="PIN de acceso"
        />
        <button type="submit" className="rounded-xl px-4 py-2 text-sm font-semibold text-black" style={{ background: accent }}>Acceder</button>
      </div>
      {error && <p role="alert" className="mt-3 text-sm text-red-400 text-center">{error}</p>}
    </form>
  );
}
