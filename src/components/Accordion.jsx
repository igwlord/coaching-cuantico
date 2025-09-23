import React, { useEffect, useRef, useState } from 'react';

export default function Accordion({ title, children, accent, defaultOpen = false, open: controlledOpen, onToggle }) {
  const isControlled = controlledOpen !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const ref = useRef(null);
  const [h, setH] = useState(0);
  useEffect(() => { if (ref.current) setH(ref.current.scrollHeight); }, [children]);

  const toggle = () => {
    if (isControlled) {
      onToggle?.(!controlledOpen);
    } else {
      setUncontrolledOpen(v => !v);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5">
      <button
        type="button"
        onClick={toggle}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/10 transition"
        aria-expanded={open}
      >
        <span className="font-semibold">{title}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${open ? 'rotate-180' : ''} transition-transform`}><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: open ? h : 0, opacity: open ? 1 : 0.6 }}>
        <div ref={ref} className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
