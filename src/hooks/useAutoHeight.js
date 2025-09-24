import { useEffect, useRef, useState } from 'react';

// Reusable auto-height measurement for accordion-like panels
export function useAutoHeight(isOpen, { notify = true, eventName = 'cc-inner-accordion-change' } = {}) {
  const ref = useRef(null);
  const [height, setHeight] = useState(0);

  // Measure on open/close
  useEffect(() => {
    if (isOpen && ref.current) {
      setHeight(ref.current.scrollHeight);
      if (notify) window.dispatchEvent(new CustomEvent(eventName));
    } else if (!isOpen) {
      setHeight(0);
      if (notify) window.dispatchEvent(new CustomEvent(eventName));
    }
  }, [isOpen, notify, eventName]);

  // Observe internal size while open
  useEffect(() => {
    if (!isOpen || !ref.current) return;
    const el = ref.current;
    const measure = () => {
      if (!el) return;
      const h = el.scrollHeight;
      setHeight(h);
      if (notify) window.dispatchEvent(new CustomEvent(eventName));
    };
    measure();
    let ro;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(measure);
      ro.observe(el);
    } else {
      const id = setInterval(measure, 400);
      return () => clearInterval(id);
    }
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('resize', measure);
      ro && ro.disconnect();
    };
  }, [isOpen, notify, eventName]);

  return { ref, height };
}
