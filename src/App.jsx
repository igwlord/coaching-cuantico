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
        setShowMobileCta(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
        sections.forEach((section) => {
            const el = document.getElementById(section.id);
            if (el) observer.unobserve(el);
        });
        window.removeEventListener('scroll', handleScroll);
    };
  }, [sections]);

  const handleNavClick = (e, targetId) => {

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
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const headerOffset = 70;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const processSteps = [
    {
      title: "Entrevista y Enfoque",
      description: <>Comenzamos con una <Glow>Videollamada</Glow> para definir tu intención y en que enfocarnos. Luego de conversar, cortamos la llamada y comienza la sesión.</>
    },
    {
      title: "Preparación y Conexión",
      description: <>Se recomienda estar acostado para recibir la armonizacion  aunque si no puedes, la energia trabaja igual. Yo estaré activando la <Glow>plataforma cuántica</Glow>, conectando con la energía a través de péndulo, cristales y símbolos sagrados.</>
    },
    {
      title: "Armonización Profunda",
      description: <>En esta fase, trabajo sobre tus campos energéticos para <Glow>equilibrar chakras</Glow>, limpiar densidades y restaurar la coherencia entre mente, emoción y cuerpo.</>
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
      description: <>La energía sigue actuando hasta por un mes. Estoy disponible para que compartas tus sensaciones y resolver dudas durante el <Glow>proceso de integración</Glow>.</>
    }
  ];
  
  const testimonials = [
    { name: "Sofía R.", type: "Armonización Cuántica", text: "Sentí alivio inmediato y una claridad mental que no tenía hace meses. El proceso es simple y potente." },
    { name: "Mariano L.", type: "Plataforma Tameana", text: "Dormí mejor toda la semana y pude destrabar conversaciones difíciles en el trabajo sin tensión." },
    { name: "Camila P.", type: "Cristales Sanadores", text: "Mi ansiedad bajó notablemente. Gui explica con calidez y sin tecnicismos. Muy recomendable." },
  ];

  return (
    <>
      {/* Importación de Fuentes de Google - Se añade aquí como comentario ya que no se puede editar el <head> */}
      {/* <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" /> */}
      <style>{`
        body { font-family: 'Inter', sans-serif; }
      `}</style>
      <div
        className="min-h-screen w-full text-white antialiased"
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
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
            <a href="#home" onClick={(e) => handleNavClick(e, 'home')} className="flex items-center gap-3 transition-transform hover:scale-105">
              <Logo accent={palette.accent} />
              <span className="hidden sm:inline font-semibold tracking-wide">Coaching Cuántico</span>
            </a>
            {/* Botón hamburguesa (móvil) */}
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
            <nav className="hidden md:flex gap-2">
              {sections.map((s) => (
                <a key={s.id} href={`#${s.id}`} onClick={(e) => handleNavClick(e, s.id)} 
                   className={`rounded-md px-3 py-2 text-sm transition-all duration-300 ${activeSection === s.id ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
                   aria-label={`Ir a ${s.label}`}>
                  {s.label}
                </a>
              ))}
            </nav>
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, 'contact')}
              className="rounded-xl px-4 py-2 text-xs font-semibold shadow-[0_0_20px] transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 md:text-sm"
              style={{ background: palette.accent, color: "#0c0c0c", boxShadow: `0 0 24px ${palette.glow}` }}
            >
              Agendar sesión
            </a>
          </div>
          {/* Menú lateral móvil */}
          <div className={`md:hidden ${menuOpen ? '' : 'pointer-events-none'}`}>
            {/* Scrim */}
            <div
              className={`fixed inset-0 z-40 bg-black/50 transition-opacity ${menuOpen ? 'opacity-100' : 'opacity-0'}`}
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />
            {/* Drawer */}
            <aside
              id="mobile-menu"
              className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85%] transform bg-black/90 backdrop-blur-xl border-r border-white/10 transition-transform duration-300 ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}
              role="dialog"
              aria-modal="true"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
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
              <nav className="px-2 py-2">
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    onClick={(e) => { handleNavClick(e, s.id); setMenuOpen(false); }}
                    className={`block rounded-md px-3 py-2 text-sm transition ${activeSection === s.id ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}
                  >
                    {s.label}
                  </a>
                ))}
                <div className="mt-2 border-t border-white/10 pt-2">
                  <a
                    href="#contact"
                    onClick={(e) => { handleNavClick(e, 'contact'); setMenuOpen(false); }}
                    className="block rounded-md px-3 py-2 text-sm font-semibold"
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
                  <span className="block">Coaching <Glow>Cuántico</Glow></span>
                  <span className="mt-4 block text-xl font-light text-white/80 md:text-3xl">
                    Armoniza mente, emoción y energía con un método simple y reproducible.
                  </span>
                </h1>
                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <a href="#intro" onClick={(e) => handleNavClick(e, 'intro')} className="transform rounded-xl border border-white/20 px-5 py-3 font-semibold transition hover:scale-105 hover:border-white/40 active:scale-95">Cómo funciona</a>
                  <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className="transform rounded-xl px-5 py-3 font-semibold transition hover:scale-105 active:scale-95" style={{ background: palette.accent, color: "#0c0c0c", boxShadow: `0 0 24px ${palette.glow}` }}>Iniciar ahora</a>
                </div>
              </div>
              <div className="relative flex items-center justify-center">
                <FlowerOfLife accent={palette.accent} />
              </div>
            </AnimatedSection>
            <ScrollIndicator />
          </section>

          <section id="intro" className="relative border-t border-white/10 py-20">
            <div className="mx-auto max-w-6xl px-4">
              <AnimatedSection>
                <h2 className="mb-12 text-center text-2xl font-bold md:text-4xl">
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
            <AnimatedSection className="mx-auto grid max-w-6xl items-center gap-10 px-4 md:grid-cols-5">
                <div className="md:col-span-2">
                    <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-white/10 shadow-2xl transition-transform hover:scale-105">
                        <img 
                            src="https://placehold.co/400x500/1A1040/FFFFFF?text=Guido+Di+Pietro" 
                            alt="Foto profesional de Guido Di Pietro" 
                            className="h-full w-full object-cover"
                        />
                    </div>
                </div>
                <div className="md:col-span-3">
          <h2 className="mb-4 text-2xl font-bold md:text-4xl">Soy <Glow>Guido Di Pietro</Glow></h2>
          <p className="leading-relaxed text-white/90 text-sm md:text-base">
                        Coach ontológico y terapeuta holístico con más de 10 años acompañando procesos de transformación. Integro prácticas energéticas con un enfoque claro y práctico para que puedas <span className="font-semibold">sentirte mejor y avanzar</span> en lo que te importa.
                    </p>
                    <ul className="mt-8 grid gap-4 text-sm sm:grid-cols-2">
                        <BenefitItem icon="hands" text="Acompañamiento humano, sin juicios" />
                        <BenefitItem icon="chat" text="Lenguaje simple, cero tecnicismos" />
                        <BenefitItem icon="shield" text="Ética y confidencialidad" />
                        <BenefitItem icon="screen" text="Sesiones online y presenciales" />
                    </ul>
                </div>
            </AnimatedSection>
          </section>
          
          <section id="contact" className="relative border-t border-white/10 py-20">
            <div className="mx-auto grid max-w-5xl items-start gap-10 px-4 lg:grid-cols-2">
              <AnimatedSection>
                <h2 className="mb-2 text-2xl font-bold md:text-4xl">Agendar una sesión</h2>
                <p className="text-white/90">
                  Completa tus datos y se abrirá WhatsApp con un mensaje prellenado para confirmar tu turno.
                </p>
                <ContactForm accent={palette.accent} />
              </AnimatedSection>
              <AnimatedSection>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-xl">
                  <h3 className="mb-4 text-xl font-semibold">Preguntas frecuentes</h3>
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
              </AnimatedSection>
            </div>
            
            <div className="mx-auto max-w-6xl px-4 pt-20">
              <AnimatedSection>
                <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">Lo que dicen las personas</h2>
                <Carousel items={testimonials} accent={palette.accent} />
              </AnimatedSection>
            </div>
          </section>
        </main>
        
        <footer className="border-t border-white/10 text-white/80">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row">
            <div className="flex items-center gap-2">
              <Logo accent={palette.accent} small />
              <span className="text-sm">© {new Date().getFullYear()} Coaching Cuántico — Guido Di Pietro</span>
            </div>
            <a href="#home" onClick={(e) => handleNavClick(e, 'home')} className="text-sm transition hover:text-white">Volver arriba</a>
          </div>
        </footer>

        {/* CTA Flotante para Móvil */}
        <div className={`fixed bottom-4 right-4 z-50 md:hidden transition-all duration-500 ${showMobileCta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, 'contact')}
              className="rounded-full p-4 font-semibold shadow-lg"
              style={{ background: palette.accent, color: "#0c0c0c", boxShadow: `0 0 24px ${palette.glow}` }}
              aria-label="Agendar una sesión"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
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

function FlowerOfLife({ accent }) {
  // ... (código sin cambios)
  const circles = [];
  const r = 20;
  const stepX = r * Math.sqrt(3);
  const stepY = r * 1.5;
  const cx = 100, cy = 100;

  for (let row = -3; row <= 3; row++) {
    for (let col = -3; col <= 3; col++) {
      const x = cx + col * stepX + (row % 2 ? stepX / 2 : 0);
      const y = cy + row * stepY;
      if (Math.hypot(x - cx, y - cy) < 85) circles.push(<circle key={`${row}-${col}`} cx={x} cy={y} r={r} />);
    }
  }

  return (
    <svg viewBox="0 0 200 200" className="h-72 w-72" fill="none" stroke={accent} strokeWidth="1.2" style={{ filter: "drop-shadow(0 0 12px rgba(203,161,53,0.6))" }}>
      {circles}
      <circle cx="100" cy="100" r="90" />
    </svg>
  );
}

function Carousel({ items, accent }) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % items.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [items.length]);

    return (
        <div className="relative mx-auto max-w-2xl overflow-hidden">
            <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${index * 100}%)` }}>
                {items.map((t, i) => (
                    <div key={i} className="min-w-full flex-shrink-0 px-2">
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-8 shadow-xl backdrop-blur-xl transition-all duration-500" style={{ boxShadow: `0 0 40px ${accent}1A` }}>
                            <p className="text-lg leading-relaxed text-white/90">“{t.text}”</p>
                            <div className="mt-6 flex items-center gap-4">
                                <div className="h-1 w-8 rounded-full" style={{ background: accent }}></div>
                                <div>
                                    <div className="font-semibold" style={{ color: accent }}>{t.name}</div>
                                    <div className="text-sm text-white/60">{t.type}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-6 flex justify-center gap-2">
                {items.map((_, i) => (
                    <button
                        key={i}
                        aria-label={`Ir al testimonio ${i + 1}`}
                        onClick={() => setIndex(i)}
                        className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${i === index ? 'w-6 bg-opacity-100' : 'bg-opacity-40 hover:bg-opacity-70'}`}
                        style={{ background: accent }}
                    />
                ))}
            </div>
        </div>
    );
}

function ContactForm({ accent }) {
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [errors, setErrors] = useState({});

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
        const text = encodeURIComponent(
            `Hola Guido, quiero agendar una sesión de Coaching Cuántico.\n\n` +
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
                <textarea id="message" value={form.message} onChange={handleChange} rows={3} placeholder="¿Qué te gustaría armonizar?" className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-white/30" />
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
