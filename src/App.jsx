import React, { useEffect, useMemo, useRef, useState } from "react";

// Hook personalizado para detectar si un elemento está en pantalla
function useOnScreen(options) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      // Solo se activa una vez
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, options]);

  return [ref, isVisible];
}

// Detecta preferencia de reducir animaciones
function usePrefersReducedMotion() {
  const [prefers, setPrefers] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e) => setPrefers(e.matches);
    setPrefers(media.matches);
    if (media.addEventListener) media.addEventListener('change', onChange);
    else media.addListener(onChange);
    return () => {
      if (media.removeEventListener) media.removeEventListener('change', onChange);
      else media.removeListener(onChange);
    };
  }, []);
  return prefers;
}

// Ancho del viewport para ajustar densidad visual
function useViewportWidth() {
  const [w, setW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  useEffect(() => {
    const onResize = () => setW(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return w;
}

// Componente para animar la entrada de elementos
const AnimatedSection = ({ children, className }) => {
  const [ref, isVisible] = useOnScreen({ threshold: 0.1, triggerOnce: true });
  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-1000 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {children}
    </div>
  );
};

/* ============================ COMPONENTES AUXILIARES (Primero para que estén definidos) ============================ */
function Glow({ children }) {
  return (
    <span className="relative inline-block align-middle">
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 -z-0 blur-md opacity-50" style={{ background: "linear-gradient(90deg, rgba(203,161,53,0), rgba(203,161,53,0.6), rgba(203,161,53,0))" }} />
    </span>
  );
}


// Componente principal de la página de aterrizaje para Coaching Cuántico
export default function App() {
  const sections = [
    { id: "home", label: "Inicio" },
    { id: "intro", label: "El Proceso" },
    { id: "about", label: "Quién soy" },
    { id: "certs", label: "Certificaciones" },
    { id: "pricing", label: "Paquetes" },
    { id: "contact", label: "Contacto" },
  ];

  const palette = {
    bgStart: "#120B33", // Darker Indigo
    bgMid: "#2A114A", // Darker Violet
    bgEnd: "#06112C", // Darker Night Blue
    accent: "#CBA135",
    glow: "rgba(203, 161, 53, 0.7)",
  };

  const [activeSection, setActiveSection] = useState("home");
  const [showMobileCta, setShowMobileCta] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactPrefill, setContactPrefill] = useState({ mode: null, message: '' });
  // Acordeón Certificaciones + Lightbox de diplomas
  const [certsOpen, setCertsOpen] = useState(false);
  const certsContentRef = useRef(null);
  const [certsHeight, setCertsHeight] = useState(0);
  const [lightbox, setLightbox] = useState({ open: false, src: '', alt: '' });
  const scrollYRef = useRef(0);
  const lastFocusRef = useRef(null);
  const closeBtnRef = useRef(null);
  const openLightbox = (src, alt) => setLightbox({ open: true, src, alt });
  const closeLightbox = () => setLightbox({ open: false, src: '', alt: '' });

  // Ancho de viewport para comportamientos responsivos simples
  const vw = useViewportWidth();

  // "Leer más" en móviles para la sección "Quién soy"
  const [aboutOpen, setAboutOpen] = useState(false);
  const aboutContentRef = useRef(null);
  const [aboutHeight, setAboutHeight] = useState(0);
  useEffect(() => {
    const updateAbout = () => {
      if (aboutContentRef.current) {
        setAboutHeight(aboutContentRef.current.scrollHeight);
      }
    };
    updateAbout();
    window.addEventListener('resize', updateAbout);
    return () => window.removeEventListener('resize', updateAbout);
  }, []);

  // Medir el alto del contenido del acordeón (para animar max-height)
  useEffect(() => {
    const update = () => {
      if (certsContentRef.current) {
        setCertsHeight(certsContentRef.current.scrollHeight);
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Cerrar lightbox con Escape y bloquear scroll de fondo
  useEffect(() => {
    if (!lightbox.open) return;
    const onKey = (e) => { if (e.key === 'Escape') closeLightbox(); };
    window.addEventListener('keydown', onKey);

    // Fijar la pantalla en la posición actual (mejor que overflow hidden en móviles)
    const body = document.body;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      overflow: body.style.overflow,
    };
    scrollYRef.current = window.scrollY || window.pageYOffset;
    body.style.position = 'fixed';
    body.style.top = `-${scrollYRef.current}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.overflow = 'hidden';

    // Focus trap: mover foco al botón cerrar y mantener dentro
    lastFocusRef.current = document.activeElement;
    setTimeout(() => closeBtnRef.current?.focus(), 0);
    const onTrap = (e) => {
      if (e.key !== 'Tab') return;
      const focusables = Array.from(document.querySelectorAll('[data-lightbox-focus]'));
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && active === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener('keydown', onTrap);

    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keydown', onTrap);
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.left = prev.left;
      body.style.right = prev.right;
      body.style.overflow = prev.overflow;
      window.scrollTo(0, scrollYRef.current);
      // Devolver foco al elemento que abrió el lightbox
      lastFocusRef.current?.focus?.();
    };
  }, [lightbox.open]);

  // Observer para la navegación activa
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-30% 0px -70% 0px", threshold: 0 }
    );

    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });
    
    // Listener para el CTA móvil
  const handleScroll = () => {
    const scrolledEnough = window.scrollY > window.innerHeight * 0.8;
    const contactEl = document.getElementById('contact');
    const nearBottom = window.innerHeight + window.scrollY >= (document.body.scrollHeight - 200);
    let inContact = false;
    if (contactEl) {
      const rect = contactEl.getBoundingClientRect();
      // si la sección contacto se acerca al viewport
      inContact = rect.top < window.innerHeight * 0.6;
    }
    setShowMobileCta(scrolledEnough && !inContact && !nearBottom && !menuOpen);
  };
    window.addEventListener('scroll', handleScroll);

    return () => {
        sections.forEach((section) => {
            const el = document.getElementById(section.id);
            if (el) observer.unobserve(el);
        });
        window.removeEventListener('scroll', handleScroll);
    };
  }, [sections, menuOpen]);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    const doScroll = () => {
      if (!targetElement) return;
      // Usamos scrollIntoView + CSS scroll-margin para compensar el header
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    if (menuOpen) {
      setMenuOpen(false);
      // Pequeño delay para evitar jank mientras cierra el drawer en móviles
      setTimeout(doScroll, 220);
    } else {
      doScroll();
    }
  };

  // Prefill desde URL (?mode=consulta|sesion&msg=...)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const mode = params.get('mode');
      const msg = params.get('msg');
      if ((mode === 'consulta' || mode === 'sesion') || msg) {
        setContactPrefill({ mode: mode || null, message: msg || '' });
      }
    } catch {}
  }, []);

  // Bloquea scroll cuando el menú móvil está abierto y cierra con Escape
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const processSteps = [
    {
      title: "Entrevista y Enfoque",
      description: <>Comenzamos con una <Glow>Videollamada</Glow> para definir tu intención y en que enfocarnos. Luego de conversar, cortamos la llamada y comienza la sesión.</>
    },
    {
      title: "Preparación y Conexión",
      description: <>Se recomienda estar presente para recibir la armonización aunque si no puedes, la energía trabaja igual. Yo estaré activando la <Glow>plataforma cuántica</Glow>, conectando con vos o el espacio a través de las herramientas con la que trabajaré: <Glow>Cristales</Glow>, <Glow>geometría sagrada</Glow> y <Glow>símbolos de luz</Glow>.</>
    },
    {
      title: "Armonización Profunda",
      description: <>En esta fase, trabajo sobre tus campos energéticos para equilibrar tus cuerpos, limpiar densidades y restaurar la coherencia entre mente, emoción y cuerpo. Si son espacios, trabajo sobre todo el terreno el tiempo que sea necesario.</>
    },
    {
      title: "Cierre y Protección",
      description: <>Una vez completada la armonización, sello el trabajo realizado y aplico una <Glow>protección energética</Glow> para resguardar tu nuevo estado de equilibrio.</>
    },
    {
      title: "Integración con Audio",
      description: <>Recibirás un <Glow>audio personalizado</Glow> con un resumen de lo trabajado y recomendaciones para que puedas integrar la experiencia en los días siguientes.</>
    },
    {
      title: "Soporte Posterior",
      description: <>La energía sigue actuando hasta por un mes. Estaré disponible para que compartas tus sensaciones y resolver dudas durante el <Glow>proceso de integración</Glow>.</>
    }
  ];
  
  const testimonials = [
    {
      name: "Claudia S.",
      type: "Armonización Cuántica",
      text: "Me sentía agotada y sin motivación. Después de la sesión recuperé energía y vitalidad, como si hubiera vuelto a conectar con mi fuerza interior.",
      avatar: null,
    },
    {
      name: "Fernando T.",
      type: "Armonización Cuántica",
      text: "Lo que más me sorprendió fue la sensación de liviandad. Entré con mucha tensión y salí con el cuerpo suelto, respirando con más libertad.",
      avatar: null,
    },
    {
      name: "Julia M.",
      type: "Armonización Cuántica",
      text: "Fue un momento de conexión muy especial. Sentí que podía soltar cargas emocionales que llevaba guardadas hace años.",
      avatar: null,
    },
    {
      name: "Alejandro P.",
      type: "Armonización Cuántica",
      text: "La armonización me ayudó a enfocar mi mente. Ahora puedo trabajar con más concentración y sin tanto estrés.",
      avatar: null,
    },
    {
      name: "Mariana R.",
      type: "Armonización Cuántica",
      text: "Llegué con mucha ansiedad y pensamientos repetitivos. Después de la armonización, sentí una calma profunda, como si mi mente se hubiera ordenado. Ahora puedo tomar decisiones con más claridad.",
      avatar: null,
    },
    {
      name: "Esteban L.",
      type: "Armonización Cuántica",
      text: "Tenía dolores de espalda constantes. La sesión me relajó de una forma inesperada. A los pocos días noté que la tensión disminuyó y hoy puedo dormir mejor.",
      avatar: null,
    },
    {
      name: "Natalia G.",
      type: "Armonización Cuántica",
      text: "Salí de la sesión con una ligereza increíble, como si hubiera soltado una mochila muy pesada. Mi energía vital volvió y me siento más presente en mi día a día.",
      avatar: null,
    },
    {
      name: "Carolina M.",
      type: "Armonización Cuántica",
      text: "Me encontraba en un momento de duelo y con mucho dolor en el pecho. La armonización me dio contención, alivio y un espacio seguro para sanar.",
      avatar: null,
    },
  ];

  // Datos mínimos para Certificaciones: título, descripción breve, imagen y alt
  const certifications = [
    {
      title: 'Coach Ontológico Profesional',
      desc: 'Formación en herramientas de coaching para acompañamiento y desarrollo personal.',
      image: null,
      alt: 'Certificado de Coach Ontológico Profesional',
    },
    {
      title: 'Operador de Mesa Cuántica',
      desc: 'Trabajo con plataforma cuántica para armonización energética a distancia.',
      image: '/Certificados/operador mesa cuantica.png',
      alt: 'Certificado Operador de Mesa Cuántica',
    },
    {
      title: 'Radiestesia Hebrea',
      desc: 'Uso de péndulo y herramientas hebreas para diagnóstico y armonización.',
      image: '/Certificados/Radiestesia hebrea.png',
      alt: 'Certificado Radiestesia Hebrea',
    },
    {
      title: 'Radiestesia Cuántica con Cristales',
      desc: 'Aplicación de radiestesia y cristales para limpieza y equilibrio de campos energéticos.',
      image: '/Certificados/Radiestecia cuantica con cristales.png',
      alt: 'Certificado Radiestesia Cuántica con Cristales',
    },
    {
      title: 'Operador de Tableros y Símbolos Pleyadianos',
      desc: 'Protocolos con tableros y símbolos pleyadianos para armonización profunda.',
      image: '/Certificados/Operador de tableros y simbolos pleyadianos.png',
      alt: 'Certificado Operador de Tableros y Símbolos Pleyadianos',
    },
    {
      title: 'Reiki Instructor Nivel 3',
      desc: 'Maestría en Reiki: canalización, enseñanza y guía en la práctica.',
      image: '/Certificados/Reiki instructor nivel 3.png',
      alt: 'Certificado Reiki Instructor Nivel 3',
    },
    {
      title: 'Diksha Giver Facilitador',
      desc: 'Facilitación de Diksha para transmisión de energía de conciencia.',
      image: '/Certificados/Diksha Giver facilitador.png',
      alt: 'Certificado Diksha Giver Facilitador',
    },
    {
      title: 'Operador de Cristales y Tameana',
      desc: 'Técnicas con cristales y Tameana para elevar la vibración y armonizar.',
      image: '/Certificados/Operador de Cristales y Tameana.png',
      alt: 'Certificado Operador de Cristales y Tameana',
    },
  ];

  return (
    <>
      {/* Importación de Fuentes de Google - Se añade aquí como comentario ya que no se puede editar el <head> */}
      {/* <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" /> */}
      <style>{`
        body { font-family: 'Inter', sans-serif; }
      `}</style>
      <div
        className="min-h-screen w-full text-white antialiased overflow-x-hidden"
      >
        {/* Background Layer */}
        <div 
          className="fixed inset-0 -z-30"
          style={{
            background: `linear-gradient(135deg, ${palette.bgStart}, ${palette.bgMid} 50%, ${palette.bgEnd})`,
          }}
        />
        <Starfield accentColor={palette.accent} />
        <SacredGeometryOverlay accent={palette.accent} />
        
        <header className="sticky top-0 z-40 border-b border-white/10 bg-black/20 backdrop-blur-md">
          <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_auto] items-center gap-3 px-4 py-3">
            <a href="#home" onClick={(e) => handleNavClick(e, 'home')} className="flex items-center gap-3 transition-transform hover:scale-105">
              <Logo accent={palette.accent} />
              <span className="hidden sm:inline font-semibold tracking-wide">Coaching Cuántico</span>
            </a>
            {/* Navegación desktop */}
            <nav className="hidden md:flex gap-2">
              {sections.map((s) => (
                <a key={s.id} href={`#${s.id}`} onClick={(e) => handleNavClick(e, s.id)} 
                   className={`rounded-md px-3 py-2 text-sm transition-all duration-300 ${activeSection === s.id ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
                   aria-label={`Ir a ${s.label}`}>
                  {s.label}
                </a>
              ))}
            </nav>
            {/* Botón hamburguesa (móvil) a la derecha */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-white/80 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40"
              aria-label="Abrir menú"
              aria-controls="mobile-menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <a
              href="#contact"
              onClick={(e) => { setContactPrefill({ mode: 'sesion', message: 'Quiero agendar una sesión de Coaching Cuántico.' }); handleNavClick(e, 'contact'); }}
              className="hidden md:inline-flex rounded-xl px-4 py-2 text-xs font-semibold shadow-[0_0_20px] transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 md:text-sm"
              style={{ background: palette.accent, color: "#0c0c0c", boxShadow: `0 0 24px ${palette.glow}` }}
            >
              Agendar sesión
            </a>
          </div>
          {/* Menú lateral móvil */}
          <div className={`md:hidden ${menuOpen ? '' : 'pointer-events-none'}`}>
            {/* Scrim */}
            <div
              className={`fixed inset-0 z-40 bg-black/75 backdrop-blur-md transition-opacity ${menuOpen ? 'opacity-100' : 'opacity-0'}`}
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />
            {/* Drawer */}
            <aside
              id="mobile-menu"
              className={`fixed inset-y-0 right-0 z-50 w-72 max-w-[85%] transform shadow-2xl border-l border-white/10 transition-transform duration-300 ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
              style={{ backgroundColor: '#2A114A', backgroundImage: 'none', willChange: 'transform' }}
              role="dialog"
              aria-modal="true"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10" style={{ backgroundColor: '#2A114A' }}>
                <div className="flex items-center gap-2">
                  <Logo accent={palette.accent} small />
                  <span className="text-sm font-semibold">Coaching Cuántico</span>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md p-2 text-white/80 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40"
                  aria-label="Cerrar menú"
                  onClick={() => setMenuOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <nav className="px-2 py-2" style={{ backgroundColor: '#2A114A' }}>
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    onClick={(e) => { handleNavClick(e, s.id); setMenuOpen(false); }}
                    className={`block rounded-lg px-3 py-2 text-sm transition ring-1 ring-inset ring-white/10 ${activeSection === s.id ? 'bg-white/20 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                  >
                    {s.label}
                  </a>
                ))}
                <div className="mt-2 border-t border-white/10 pt-2">
                  <a
                    href="#contact"
                    onClick={(e) => { handleNavClick(e, 'contact'); setMenuOpen(false); }}
                    className="block rounded-lg px-3 py-2 text-sm font-semibold shadow-md"
                    style={{ background: palette.accent, color: '#0c0c0c', boxShadow: `0 0 18px ${palette.glow}` }}
                  >
                    Agendar sesión
                  </a>
                </div>
              </nav>
            </aside>
          </div>
        </header>

        <main>
          <section id="home" className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
            <AnimatedSection className="mx-auto grid max-w-7xl items-center gap-10 px-4 md:grid-cols-2">
              <div>
                <h1 className="text-3xl font-extrabold leading-tight md:text-6xl">
                  <span className="block">
                    <span className="relative inline-block align-middle" style={{ textShadow: `0 0 18px ${palette.glow}` }}>
                      Coaching <Glow>Cuántico</Glow>
                    </span>
                  </span>
                  <span className="mt-4 block text-xl font-light text-white/80 md:text-3xl">
                    Armoniza tu mente, emociones y energía con un método simple y efectivo.
                  </span>
                </h1>
                {/* CTAs: en móvil mostramos solo 2 inline para armonía; en desktop mantenemos los 3 */}
                <div className="mt-10 flex flex-wrap items-center gap-3">
                  {/* Mobile-only pair */}
                  <div className="flex w-full items-center gap-3 sm:gap-4 md:hidden">
                    <a href="#intro" onClick={(e) => handleNavClick(e, 'intro')} className="flex-1 text-center transform rounded-xl border border-white/20 px-4 py-2.5 font-semibold transition hover:scale-105 hover:border-white/40 active:scale-95">Cómo funciona</a>
                    <a href="#pricing" onClick={(e) => handleNavClick(e, 'pricing')} className="flex-1 text-center transform rounded-xl border border-white/20 px-4 py-2.5 font-semibold transition hover:scale-105 hover:border-white/40 active:scale-95">Ver paquetes</a>
                  </div>
                  {/* Desktop (md+) full set */}
                  <div className="hidden md:flex items-center gap-4">
                    <a href="#intro" onClick={(e) => handleNavClick(e, 'intro')} className="transform rounded-xl border border-white/20 px-5 py-3 font-semibold transition hover:scale-105 hover:border-white/40 active:scale-95">Cómo funciona</a>
                    <a
                      href="#contact"
                      onClick={(e) => { setContactPrefill({ mode: 'consulta', message: 'Quiero una consulta de diagnóstico de 15 minutos (gratuita).' }); handleNavClick(e, 'contact'); }}
                      className="transform rounded-xl px-5 py-3 font-semibold transition hover:scale-105 active:scale-95"
                      style={{ background: palette.accent, color: "#0c0c0c", boxShadow: `0 0 24px ${palette.glow}` }}
                    >
                      Reserva consulta gratis 15′
                    </a>
                    <a href="#pricing" onClick={(e) => handleNavClick(e, 'pricing')} className="transform rounded-xl border border-white/20 px-5 py-3 font-semibold transition hover:scale-105 hover:border-white/40 active:scale-95">Ver paquetes</a>
                  </div>
                </div>
                {/* Nota de cupos eliminada a pedido */}
              </div>
              <div className="relative flex items-center justify-center">
                <FlowerOfLife accent={palette.accent} duration={36} />
              </div>
            </AnimatedSection>
            <ScrollIndicator />
          </section>

          <section id="intro" className="relative border-t border-white/10 py-20">
            <div className="mx-auto max-w-6xl px-4">
              <AnimatedSection>
                <h2 className="section-title mb-12 text-2xl font-bold md:text-4xl">
                  <span className="inline-block">El Proceso de <Glow>Armonización</Glow></span>
                </h2>
              </AnimatedSection>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {processSteps.map((step, index) => (
                  <AnimatedSection key={index}>
                    <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all duration-300 hover:scale-[1.03] hover:border-white/20 hover:bg-white/10">
                      <div className="flex items-center gap-4">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-lg font-bold" style={{ background: palette.accent, color: palette.bgStart }}>
                          {index + 1}
                        </div>
                        <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                      </div>
                      <p className="mt-4 flex-grow text-white/80 text-sm md:text-base">{step.description}</p>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </section>
          
          <section id="about" className="relative border-t border-white/10 py-20">
            <AnimatedSection className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 md:grid-cols-5">
        {/* Fondo sutil con acento para mayor impacto visual */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-20">
          <div
            className="absolute left-1/2 -translate-x-[60%] md:left-[8%] md:translate-x-0 top-1/2 -translate-y-1/2 h-72 w-72 md:h-[28rem] md:w-[28rem] rounded-full"
            style={{ background: `radial-gradient(closest-side, ${palette.accent}33, transparent 70%)` }}
          />
        </div>
        <div className="md:col-span-2">
          <div className="group relative mx-auto max-w-[240px] sm:max-w-[300px] md:max-w-none">
            {/* halo de luz */}
            <div
              aria-hidden
              className="absolute -inset-4 -z-10 rounded-[22px] opacity-70 blur-2xl transition duration-700 group-hover:opacity-90"
              style={{ background: `linear-gradient(135deg, ${palette.accent}33, transparent 60%)` }}
            />
            {/* marco con borde degradado */}
            <div
              className="relative rounded-[18px] p-[2px] shadow-2xl transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:scale-[1.02] md:group-hover:rotate-[0.5deg]"
              style={{ background: `linear-gradient(135deg, ${palette.accent}99, rgba(255,255,255,0.08))` }}
            >
              <div className="rounded-[16px] overflow-hidden bg-black/40 ring-1 ring-white/10">
                <div className="aspect-[4/5]">
                  <img
                    src="/gdp.webp"
                    alt="Foto profesional de Guido Di Pietro"
                    width="400"
                    height="500"
                    loading="lazy"
                    decoding="async"
                    fetchpriority="low"
                    sizes="(max-width: 768px) 260px, 420px"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
            {/* brillo inferior sutil */}
            <div aria-hidden className="pointer-events-none absolute -bottom-2 left-1/2 -translate-x-1/2 h-1 w-2/3 bg-gradient-to-r from-transparent via-white/25 to-transparent blur-md opacity-60" />
          </div>
        </div>
        <div className="md:col-span-3">
          <h2 className="section-title mb-4 text-2xl font-bold md:text-4xl">Soy <Glow>Guido Di Pietro</Glow></h2>
          <div className="relative">
            <div
              id="about"
              ref={aboutContentRef}
              className="leading-relaxed text-white/90 text-sm md:text-base space-y-4 overflow-hidden transition-all duration-300 pb-2"
              style={{
                maxHeight: vw < 768 ? (aboutOpen ? aboutHeight : 240) : 'none',
                WebkitMaskImage: vw < 768 && !aboutOpen ? 'linear-gradient(to bottom, black 78%, transparent)' : undefined,
                maskImage: vw < 768 && !aboutOpen ? 'linear-gradient(to bottom, black 78%, transparent)' : undefined,
              }}
            >
              <p>Soy Guido Di Pietro, Terapeuta holístico y Coach Ontológico, con más de 10 años acompañando a personas en procesos de transformación profunda.</p>
              <p>Creo en la fuerza del encuentro humano, en el poder de la palabra, la energía y la intención para abrir caminos hacia una vida más plena y consciente.</p>
              <p>Desde mi infancia, mis padres, grandes maestros, me enseñaron el amor por lo sutil y lo invisible, guiándome en prácticas como Reiki, Registros Akáshicos y diversos talleres de técnicas de armonización. Esa semilla despertó en mí la vocación de servicio que hoy me mueve.</p>
              <p>En paralelo, desarrollé mi carrera en diseño gráfico, programación y tecnología, integrando creatividad y visión moderna con canales ancestrales como la gemoterapia, la radiestesia y la geometría sagrada. Considero que la verdadera sanación surge cuando logramos unir lo antiguo con lo nuevo, lo espiritual con lo cotidiano, lo personal con lo universal para sortear esos obstáculos que nos impiden conectarnos.</p>
              <p>Mi propósito es ser puente y acompaño a quienes buscan claridad, alivio y expansión, brindando un espacio seguro, amoroso y transformador.</p>
            </div>
            {/* El degradado ahora se logra con mask-image en el contenedor cuando está contraído */}
          </div>
          {vw < 768 && (
            <button
              type="button"
              onClick={() => setAboutOpen((v) => !v)}
              className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
              aria-expanded={aboutOpen}
              aria-controls="about"
            >
              {aboutOpen ? 'Leer menos' : 'Leer más'}
            </button>
          )}
        </div>
            </AnimatedSection>
          </section>

          {/* Certificaciones (movido justo debajo de "Quién soy") */}
          <section id="certs" className="relative border-t border-white/10 pt-12 pb-16">
            <div className="mx-auto max-w-6xl px-4">
              <AnimatedSection>
                <h2 className="section-title mb-4 text-2xl font-bold md:text-3xl">
                  <button
                    type="button"
                    onClick={() => setCertsOpen((v) => !v)}
                    aria-expanded={certsOpen}
                    aria-controls="certs-panel"
                    className="w-full flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left hover:bg-white/10 transition"
                  >
                    <span className="mx-auto">Certificaciones y Formación</span>
                    <span
                      className={`shrink-0 transition-transform duration-300 ${certsOpen ? 'rotate-180' : ''}`}
                      aria-hidden
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                    </span>
                  </button>
                </h2>
                <div
                  id="certs-panel"
                  ref={certsContentRef}
                  className="overflow-hidden transition-all duration-300"
                  style={{ maxHeight: certsOpen ? certsHeight : 0, opacity: certsOpen ? 1 : 0.5 }}
                >
                  <div className="mx-auto mb-6 grid max-w-5xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-white/90 mt-6">
                    {certifications.map((c, i) => (
                      <article key={i} className="group rounded-xl border border-white/10 bg-white/5 overflow-hidden transition hover:bg-white/10 focus-within:ring-2 focus-within:ring-white/20">
                        <div className="relative aspect-[4/3] bg-black/20">
                          {c.image ? (
                            <button
                              type="button"
                              onClick={() => openLightbox(c.image, c.alt || `Certificado ${c.title}`)}
                              className="absolute inset-0 w-full h-full focus:outline-none"
                              aria-label={`Ampliar ${c.title}`}
                            >
                              <img
                                src={c.image}
                                alt={c.alt || c.title}
                                className="h-full w-full object-cover"
                                loading="lazy"
                                decoding="async"
                              />
                            </button>
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center ring-1 ring-white/10" style={{ background: `${palette.accent}14` }}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={palette.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="14" rx="2"/><path d="M3 17l4-4 3 3 5-5 3 3"/></svg>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="text-base md:text-lg font-semibold text-white">{c.title}</h3>
                          <p className="mt-1 text-sm text-white/80">{c.desc}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                  {/* Badges movidos debajo de Preguntas frecuentes */}
                </div>
              </AnimatedSection>
            </div>
          </section>
          
          {/* Paquetes / Pricing */}
          <section id="pricing" className="relative border-t border-white/10 py-20">
            <div className="mx-auto max-w-6xl px-4">
              <AnimatedSection>
                <h2 className="section-title mb-8 text-2xl font-bold md:text-4xl">Paquetes y Honorarios</h2>
                <p className="mx-auto max-w-2xl text-center text-white/80 mb-10 text-sm md:text-base">Elige el formato que mejor se adapte a tu proceso. Puedes empezar con una consulta breve para alinear expectativas y objetivos.</p>
              </AnimatedSection>
              {/* Mobile: horizontal scroll with snap; Desktop: 3-column grid */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:overflow-visible md:snap-none overflow-x-auto snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [-webkit-overflow-scrolling:touch]">
                <style>{`.no-scrollbar::-webkit-scrollbar{display:none}`}</style>
                {/* Plan 1 */}
                <AnimatedSection>
                  <article className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md h-full flex flex-col md:mx-0 mx-2 min-w-[86%] xs:min-w-[80%] sm:min-w-[70%] snap-start leading-relaxed text-[13.5px] sm:text-sm md:text-base">
                    <h3 className="text-xl font-semibold">Sesión única</h3>
                    <div className="mt-2 flex-1">
                      <p className="text-white/80">Armonización cuántica 1:1. Ideal para una necesidad puntual o primer acercamiento.</p>
                      <ul className="mt-4 space-y-2 text-white/80">
                        <li>· 60 a 90 minutos.</li>
                        <li>· Audio personalizado post-sesión.</li>
                        <li>· Soporte de integración 7 días.</li>
                      </ul>
                    </div>
                    <div className="mt-6">
                      <button
                        type="button"
                        onClick={(e) => { setContactPrefill({ mode: 'sesion', message: 'Quiero agendar una sesión única.' }); handleNavClick(e, 'contact'); }}
                        className="w-full rounded-xl px-4 py-2 font-semibold text-black text-sm md:text-base"
                        style={{ background: palette.accent }}
                      >Agendar sesión</button>
                    </div>
                  </article>
                </AnimatedSection>
                {/* Plan 2 - Destacado */}
                <AnimatedSection>
                  <article className="relative rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-md h-full flex flex-col ring-1 ring-white/10 md:mx-0 mx-2 min-w-[86%] xs:min-w-[80%] sm:min-w-[70%] snap-center leading-relaxed text-[13.5px] sm:text-sm md:text-base">
                    <div className="absolute -top-3 right-4 rounded-full px-3 py-1 text-xs font-semibold text-black" style={{ background: palette.accent }}>Recomendado</div>
                    <h3 className="text-xl font-semibold">Pack 3 sesiones</h3>
                    <div className="mt-2 flex-1">
                      <p className="text-white/80">Proceso de transformación con seguimiento para resultados sostenibles.</p>
                      <ul className="mt-4 space-y-2 text-white/80">
                        <li>· 3 sesiones cada 30 días.</li>
                        <li>· Plan de objetivos y metas personalizado.</li>
                        <li>· Soporte terapéutico durante todo el proceso.</li>
                      </ul>
                    </div>
                    <div className="mt-6">
                      <button
                        type="button"
                        onClick={(e) => { setContactPrefill({ mode: 'sesion', message: 'Quiero reservar el Pack de 3 sesiones.' }); handleNavClick(e, 'contact'); }}
                        className="w-full rounded-xl px-4 py-2 font-semibold text-black text-sm md:text-base"
                        style={{ background: palette.accent }}
                      >Reservar pack</button>
                    </div>
                  </article>
                </AnimatedSection>
                {/* Plan 3 (reemplazo) */}
                <AnimatedSection>
                  <article className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md h-full flex flex-col md:mx-0 mx-2 min-w-[86%] xs:min-w-[80%] sm:min-w-[70%] snap-end leading-relaxed text-[13.5px] sm:text-sm md:text-base">
                    <h3 className="text-xl font-semibold">Limpieza de espacios/negocios</h3>
                    <div className="mt-2 flex-1">
                      <p className="text-white/80">Armonización Cuántica para casas, negocios y terrenos. 100% online.</p>
                      <ul className="mt-4 space-y-2 text-white/80">
                        <li>· Sesión de 120 minutos.</li>
                        <li>· Audio personalizado post-sesión.</li>
                        <li>· Seguimiento energético del espacio.</li>
                      </ul>
                    </div>
                    <div className="mt-6">
                      <button
                        type="button"
                        onClick={(e) => { setContactPrefill({ mode: 'sesion', message: 'Quiero agendar una sesión de Limpieza de espacios/negocios.' }); handleNavClick(e, 'contact'); }}
                        className="w-full rounded-xl px-4 py-2 font-semibold text-black text-sm md:text-base"
                        style={{ background: palette.accent }}
                      >Agendar sesión</button>
                    </div>
                  </article>
                </AnimatedSection>
              </div>
              <p className="mt-6 text-center text-white/70 text-sm">¿Tenés dudas? <button type="button" className="underline" onClick={(e)=>{ setContactPrefill({ mode: 'consulta', message: 'Quiero una consulta breve para elegir el mejor paquete.' }); handleNavClick(e,'contact'); }}>Agenda una consulta breve</button>.</p>
            </div>
          </section>

          <section id="contact" className="relative border-t border-white/10 py-20">
            <div className="mx-auto grid max-w-5xl items-start gap-10 px-4 lg:grid-cols-2">
              <AnimatedSection>
                <h2 className="section-title mb-2 text-2xl font-bold md:text-4xl">Contacto</h2>
                <p className="text-white/90 mb-4">¿Tenés preguntas o querés agendar? Envíame un WhatsApp. Si vienes desde un paquete, el mensaje estará prellenado.</p>
                <ContactForm accent={palette.accent} prefill={contactPrefill} />
              </AnimatedSection>
              <AnimatedSection>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-xl">
                  <h3 className="section-title mb-4 text-xl font-semibold">Preguntas frecuentes</h3>
                  <dl className="space-y-4 text-sm text-white/90">
                    <div>
                      <dt className="font-semibold">¿Necesito creer en algo?</dt>
                      <dd className="mt-1 text-white/80">No. Ni necesitas experiencia previa. Solo tu intención y regalarte un rato para vos.</dd>
                    </div>
                    <div>
                      <dt className="font-semibold">¿Cuánto dura la sesión?</dt>
                      <dd className="mt-1 text-white/80">Entre 60 a 120 minutos. Los días siguientes te acompaño en tu proceso.</dd>
                    </div>
                    <div>
                      <dt className="font-semibold">¿Las sesiones son online?</dt>
                      <dd className="mt-1 text-white/80">Sí, por videollamada. La energía actúa igual de efectiva a distancia.</dd>
                    </div>
                  </dl>
                </div>
                <div className="mt-4 flex items-center justify-center gap-2 flex-nowrap text-white/70 sm:gap-3">
                  <Badge accent={palette.accent}>10+ años de experiencia</Badge>
                  <Badge accent={palette.accent}>Sesiones 100% online</Badge>
                </div>
              </AnimatedSection>
            </div>
            
            <div className="mx-auto max-w-6xl px-4 pt-20">
              <AnimatedSection>
                <h2 className="section-title mb-8 text-2xl font-bold md:text-3xl">Lo que dicen las personas</h2>
                <Carousel items={testimonials} accent={palette.accent} />
              </AnimatedSection>
            </div>
          </section>
          {lightbox.open && (
            <div
              className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
              role="dialog"
              aria-modal="true"
              onClick={closeLightbox}
            >
              <img
                src={lightbox.src}
                alt={lightbox.alt}
                className="max-w-[96vw] max-h-[92vh] sm:max-w-[90vw] sm:max-h-[88vh] w-auto h-auto object-contain rounded-xl ring-1 ring-white/10 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
                decoding="async"
                loading="eager"
                data-lightbox-focus
              />
              <button
                type="button"
                onClick={closeLightbox}
                aria-label="Cerrar"
                className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
                ref={closeBtnRef}
                data-lightbox-focus
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
          )}
        </main>
        
        <footer className="border-t border-white/10 text-white/80">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-6 overflow-hidden">
            <div className="flex min-w-0 items-center gap-2">
              <Logo accent={palette.accent} small />
              <span className="text-xs whitespace-nowrap truncate">
                <span className="hidden sm:inline">© {new Date().getFullYear()} Coaching Cuántico — Guido Di Pietro</span>
                <span className="sm:hidden">© {new Date().getFullYear()} Coaching Cuántico — G. Di Pietro</span>
              </span>
            </div>
            {/* Botón de volver arriba removido a pedido */}
          </div>
        </footer>

        {/* CTA Flotante para Móvil (más discreto y seguro) */}
        <div
          className={`fixed right-4 z-50 md:hidden transition-all duration-500 pointer-events-none ${showMobileCta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 18px)' }}
        >
            <a
              href="#contact"
              onClick={(e) => { setContactPrefill({ mode: 'sesion', message: 'Quiero agendar una sesión.' }); handleNavClick(e, 'contact'); }}
              className="pointer-events-auto rounded-full p-2.5 text-black shadow-lg shadow-black/40 ring-1 ring-black/10"
              style={{ background: palette.accent }}
              aria-label="Agendar una sesión"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
            </a>
        </div>
      </div>
    </>
  );
}

function Logo({ accent, small = false }) {
  const size = small ? 18 : 26;
  return (
    <div className="flex items-center gap-2 select-none">
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden>
        <circle cx="32" cy="32" r="30" stroke={accent} strokeWidth="2" opacity="0.8" />
        {[0, 60, 120].map((r) => (
          <g key={r} transform={`rotate(${r} 32 32)`}>
            <circle cx="32" cy="18" r="10" stroke={accent} strokeWidth="1.5" opacity="0.7" />
            <circle cx="32" cy="46" r="10" stroke={accent} strokeWidth="1.5" opacity="0.7" />
          </g>
        ))}
      </svg>
      <span className={small ? "text-sm font-semibold" : "text-lg font-semibold"}>CC</span>
    </div>
  );
}

function Starfield({ accentColor }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const vw = useViewportWidth();
  const [offsetY, setOffsetY] = useState(0);
  const handleScroll = () => setOffsetY(window.pageYOffset);

  useEffect(() => {
    if (prefersReducedMotion) return; // evita parallax si el usuario prefiere reducir animación
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prefersReducedMotion]);

  const stars = useMemo(() => {
    const starColors = [accentColor, '#FFFFFF', '#A855F7']; // Gold, White, Violet
    const count = prefersReducedMotion ? 60 : vw < 640 ? 80 : vw < 1024 ? 120 : 150;
    return Array.from({ length: count }, () => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: Math.random() * 5 + 5, // pulso más lento y variado
      color: starColors[Math.floor(Math.random() * starColors.length)]
    }))
  }, [accentColor, vw, prefersReducedMotion]);

    return (
        <>
            <style>{`
                @keyframes softPulse {
                    0% { opacity: 0.1; }
                    100% { opacity: 0.7; }
                }
            `}</style>
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10" style={{ transform: prefersReducedMotion ? undefined : `translateY(${offsetY * 0.2}px)` }}>
                {stars.map((s, i) => (
                    <span
                        key={i}
                        className="absolute rounded-full"
                        style={{
                            top: `${s.top}%`,
                            left: `${s.left}%`,
                            width: '1px',
                            height: '1px',
              backgroundColor: s.color,
              animation: prefersReducedMotion ? undefined : `softPulse ${s.duration}s infinite alternate`,
              animationDelay: prefersReducedMotion ? undefined : `${s.delay}s`,
                        }}
                    />
                ))}
            </div>
        </>
    );
}

function SacredGeometryOverlay({ accent }) {
  return (
    <div aria-hidden className="fixed inset-0 -z-20 opacity-[0.04]">
      <svg width="100%" height="100%">
        <defs>
          <pattern id="fov-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <circle cx="40" cy="40" r="24" stroke={accent} strokeWidth="0.5" fill="none" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#fov-pattern)" />
      </svg>
    </div>
  );
}

// Flor de la Vida simplificada para el hero
function FlowerOfLife({ accent, size = 200, spin = true, duration = 24 }) {
  // Flower of Life exact 19 circles (hex radius = 2), outer ring encloses (radius = 3R)
  const prefersReducedMotion = usePrefersReducedMotion();
  const R = size / 6 - 2; // circle radius derived from size so that outer ring fits viewBox
  const cx = size / 2;
  const cy = size / 2;

  // Generate axial hex coords within radius 2, then map to triangular lattice
  const centers = [];
  for (let u = -2; u <= 2; u++) {
    const vmin = Math.max(-2, -u - 2);
    const vmax = Math.min(2, -u + 2);
    for (let v = vmin; v <= vmax; v++) {
      const x = cx + u * R + v * (R / 2);
      const y = cy + v * (R * Math.sqrt(3) / 2);
      centers.push({ x, y });
    }
  }

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="h-72 w-72"
      fill="none"
      style={{ filter: "drop-shadow(0 0 12px rgba(203,161,53,0.6))" }}
    >
      <g stroke={accent} strokeWidth="1.2">
        <g transform={`rotate(0 ${cx} ${cy})`}>
          {(!prefersReducedMotion && spin) && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from={`0 ${cx} ${cy}`}
              to={`360 ${cx} ${cy}`}
              dur={`${duration}s`}
              repeatCount="indefinite"
            />
          )}
          {centers.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={R} />
          ))}
          {/* Outer ring */}
          <circle cx={cx} cy={cy} r={3 * R} />
        </g>
      </g>
    </svg>
  );
}

function Carousel({ items, accent }) {
  const [index, setIndex] = useState(0);
  const containerRef = useRef(null);
  const touch = useRef({ x: 0, y: 0, active: false });
  const paused = useRef(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    timerRef.current = setInterval(() => {
      if (!paused.current) setIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, [items.length]);

  const go = (dir) => setIndex((prev) => (prev + dir + items.length) % items.length);

  const onTouchStart = (e) => {
    const t = e.touches[0];
    touch.current = { x: t.clientX, y: t.clientY, active: true };
    // Pausa el autoplay durante el touch
    paused.current = true;
  };
  const onTouchMove = (e) => {
    if (!touch.current.active) return;
    e.preventDefault(); // Previene scroll vertical accidental
    const t = e.touches[0];
    const dx = t.clientX - touch.current.x;
    if (Math.abs(dx) > 30) { // Reducido umbral para mejor responsividad
      go(dx < 0 ? 1 : -1);
      touch.current.active = false;
    }
  };
  const onTouchEnd = () => { 
    touch.current.active = false; 
    // Reanuda autoplay después de un breve delay
    setTimeout(() => { paused.current = false; }, 1000);
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') go(-1);
    if (e.key === 'ArrowRight') go(1);
  };

  return (
    <div
      className="relative mx-auto w-full px-2 sm:px-4 md:px-0 max-w-5xl overflow-hidden"
      ref={containerRef}
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onKeyDown={onKeyDown}
      tabIndex={0}
      aria-live="polite"
    >
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {items.map((t, i) => (
          <div key={i} className="min-w-full flex-shrink-0 flex justify-center px-1">
            <article
              className="w-full max-w-[82vw] xs:max-w-[340px] sm:max-w-[400px] md:max-w-[520px] rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-black/30 p-3 sm:p-4 md:p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:shadow-2xl min-h-[140px] sm:min-h-[160px] flex flex-col justify-between"
              style={{ boxShadow: `0 10px 40px ${accent}20` }}
            >
              <div>
                <p className="text-[14px] sm:text-[15px] md:text-[17px] leading-relaxed text-white/90 mb-2 sm:mb-3">{t.text}</p>
              </div>
              <div className="flex items-center gap-2.5 mt-auto">
                {t.avatar ? (
                  <img src={t.avatar} alt={t.name} className="h-7 w-7 sm:h-8 sm:w-8 rounded-full object-cover ring-1 ring-white/10" loading="lazy" />
                ) : (
                  <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-white/10 ring-1 ring-white/10" />
                )}
                <div>
                  <div className="font-semibold text-[13px] sm:text-sm md:text-base" style={{ color: accent }}>{t.name}</div>
                  <div className="text-[11px] sm:text-xs text-white/60">{t.type}{t.city ? ` · ${t.city}` : ''}</div>
                </div>
              </div>
            </article>
          </div>
        ))}
      </div>
      {/* Arrows */}
      <button
        aria-label="Anterior"
        onClick={() => go(-1)}
        className="absolute left-1 sm:-left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white/40"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <button
        aria-label="Siguiente"
        onClick={() => go(1)}
        className="absolute right-1 sm:-right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white/40"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
      {/* Dots */}
      <div className="mt-5 flex justify-center gap-2.5">
        {items.map((_, i) => (
          <button
            key={i}
            aria-label={`Ir al testimonio ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-2.5 w-2.5 rounded-full transition-colors ${i === index ? 'bg-white shadow-[0_0_0_2px_rgba(255,255,255,0.25)]' : 'bg-white/40 hover:bg-white/70'}`}
          />
        ))}
      </div>
    </div>
  );
}

function Badge({ accent, children }) {
  return (
  <span className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full px-2 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-medium text-white/90 ring-1 ring-white/10 bg-white/5 whitespace-nowrap">
    <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
    {children}
  </span>
  );
}

function ContactForm({ accent, prefill }) {
  const [form, setForm] = useState({ name: '', email: '', message: '', mode: 'consulta' });
  const [errors, setErrors] = useState({});

  // Apply prefill when provided
  useEffect(() => {
    if (!prefill) return;
    setForm((prev) => ({
      ...prev,
      mode: prefill.mode ? prefill.mode : prev.mode,
      message: prefill.message ? prefill.message : prev.message,
    }));
  }, [prefill?.mode, prefill?.message]);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'El nombre es requerido.';
    if (!form.email) {
      newErrors.email = 'El correo es requerido.';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'El formato del correo es inválido.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
    if (errors[id]) {
       validate();
    }
  };
  
  const handleBlur = (e) => {
    validate();
  };

  const whatsappLink = useMemo(() => {
    const base = "https://wa.me/5491125124207";
    const encabezado = form.mode === 'sesion'
      ? 'Hola Guido, quiero agendar una sesión de Coaching Cuántico.'
      : 'Hola Guido, tengo una consulta sobre este proceso.';
    const text = encodeURIComponent(
      `${encabezado}\n\n` +
      `Nombre completo: ${form.name}\n` +
      `Correo: ${form.email}\n` +
      `Mensaje: ${form.message}\n` +
      `\nEnviado desde la web.`
    );
    return `${base}?text=${text}`;
  }, [form]);

  const isFormValid = Object.keys(errors).length === 0 && form.name && form.email;

  return (
    <form className="mt-6 grid gap-4" onSubmit={(e) => e.preventDefault()}>
      <div className="grid gap-1">
        <label htmlFor="mode" className="text-sm text-white/80">¿Qué querés hacer?</label>
        <select id="mode" value={form.mode} onChange={handleChange} className="rounded-xl border px-4 py-3 outline-none transition-all focus:ring-2 focus:ring-white/30 border-white/15 text-white" style={{ background: '#2A114A' }}>
          <option value="consulta">Hacer una consulta</option>
          <option value="sesion">Agendar una sesión</option>
        </select>
      </div>
      <div className="grid gap-1">
        <label htmlFor="name" className="text-sm text-white/80">Nombre completo</label>
        <input id="name" value={form.name} onChange={handleChange} onBlur={handleBlur} required placeholder="Tu nombre y apellido" className={`rounded-xl border bg-white/10 px-4 py-3 outline-none transition-all focus:ring-2 focus:ring-white/30 ${errors.name ? 'border-red-500/50' : 'border-white/15'}`} />
        {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
      </div>
      <div className="grid gap-1">
        <label htmlFor="email" className="text-sm text-white/80">Correo electrónico</label>
        <input type="email" id="email" value={form.email} onChange={handleChange} onBlur={handleBlur} required placeholder="tu.correo@email.com" className={`rounded-xl border bg-white/10 px-4 py-3 outline-none transition-all focus:ring-2 focus:ring-white/30 ${errors.email ? 'border-red-500/50' : 'border-white/15'}`} />
        {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
      </div>
      <div className="grid gap-1">
        <label htmlFor="message" className="text-sm text-white/80">Mensaje (opcional)</label>
        <textarea id="message" value={form.message} onChange={handleChange} rows={3} placeholder="Escribe aquí tu mensaje" title="Escribe aquí tu mensaje" className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-white/30" />
      </div>
      <div className="flex gap-4">
        <a 
          href={isFormValid ? whatsappLink : '#'}
          onClick={(e) => !isFormValid && e.preventDefault()}
          target="_blank" 
          rel="noreferrer" 
          className={`rounded-xl px-5 py-3 font-semibold text-black transition-all duration-300 ${isFormValid ? 'opacity-100 cursor-pointer hover:scale-105 active:scale-95' : 'opacity-50 cursor-not-allowed'}`} 
          style={{ background: accent, boxShadow: `0 0 18px rgba(203,161,53,0.6)` }}>
          Enviar por WhatsApp
        </a>
      </div>
    </form>
  );
}

function ScrollIndicator() {
    return (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
            <a href="#intro" aria-label="Desplazarse hacia abajo" className="animate-bounce">
                <svg className="h-6 w-6 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </a>
        </div>
    );
}

function BenefitItem({ icon, text }) {
    const icons = {
        hands: <path d="M16 17l-4-4-4 4m8-6l-4-4-4 4" />, // Placeholder
        chat: <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />,
        shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
        screen: <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
    };
    return (
        <li className="flex items-start gap-3">
            <svg className="h-5 w-5 flex-shrink-0 text-yellow-300/80 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                {icons[icon] || <path d="M5 13l4 4L19 7" />}
            </svg>
            <span>{text}</span>
        </li>
    );
}
