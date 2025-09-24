// Manifest con nombres y descripciones exactas; ajusta los nombres de archivo a los que tengas en public/images/Geometria
const geometrias = [
  {
    slug: 'dodecaedro',
    name: 'Dodecaedro (Elemento Éter)',
    file: 'dodecaedro.webp',
    desc: `Significado: Geometría de 12 caras pentagonales. Representa lo sutil, lo invisible, la conexión con el campo espiritual.

Uso: Meditaciones de conexión con planos superiores y estados de expansión de conciencia.

Visualización: Imagina un dodecaedro dorado girando suavemente sobre tu coronilla. Cada giro abre tu percepción hacia lo infinito, como una antena de luz.`
  },
  {
    slug: 'flor-de-la-vida',
    name: 'Flor de la Vida',
    file: 'Flor de la vida.webp',
    desc: `Significado: Patrón universal de creación, matriz geométrica que contiene toda la información de la vida.

Uso: Activar memorias, armonizar espacios, reconectar con la perfección del universo.

Visualización: Visualiza una Flor de la Vida luminosa envolviendo tu cuerpo como una esfera de protección y recordatorio de tu perfección interior.`
  },
  {
    slug: 'icosaedro',
    name: 'Icosaedro (Elemento Agua)',
    file: 'Icosaedro.webp',
    desc: `Significado: Geometría de 20 caras triangulares. Representa el fluir, las emociones, la sanación.

Uso: Trabajo con agua, emociones y desbloqueo de estancamientos.

Visualización: Siente un icosaedro azul cristal girando en tu plexo solar. Cada movimiento libera tus emociones y las transforma en serenidad.`
  },
  {
    slug: 'loto',
    name: 'Loto',
    file: 'Loto.webp',
    desc: `Significado: Símbolo de pureza, iluminación y despertar espiritual que surge del barro hacia la luz.

Uso: Sanación del corazón, elevar vibraciones, recordar la capacidad de florecer en cualquier circunstancia.

Visualización: Imagina un loto blanco y dorado abriéndose en tu corazón, pétalo a pétalo, irradiando amor compasivo.`
  },
  {
    slug: 'merkaba',
    name: 'Merkaba',
    file: 'Merkaba.webp',
    desc: `Significado: “Carro de luz”. Dos tetraedros entrelazados que giran. Vehículo de ascensión y protección multidimensional.

Uso: Activación energética, viajes internos, expansión de conciencia.

Visualización: Visualiza tu cuerpo dentro de una Merkaba de luz azul y dorada girando en sentidos opuestos. Siente cómo te protege y eleva tu frecuencia.`
  },
  {
    slug: 'metatron',
    name: 'Cubo de Metatrón',
    file: 'Metatron.webp',
    desc: `Significado: Geometría que contiene todos los sólidos platónicos, mapa de la creación.

Uso: Armonización completa, limpieza energética, conexión con la inteligencia divina.

Visualización: Imagina un Cubo de Metatrón luminoso descendiendo sobre ti. Siente que alinea cada célula y campo energético en perfecta simetría.`
  },
  {
    slug: 'vector-equilibrio',
    name: 'Vector de Equilibrio',
    file: 'vector equilibrio.webp',
    desc: `Significado: Representa el balance perfecto entre fuerzas opuestas. Es el patrón base de energía del universo.

Uso: Encontrar armonía interna, equilibrio entre polaridades, centrarse en la neutralidad.

Visualización: Visualiza un vector equilibrio transparente con luz plateada en tu plexo. Respira y siente cómo todas las tensiones se disuelven en balance.`
  },
  {
    slug: 'octaedro',
    name: 'Octaedro (Elemento Aire)',
    file: 'octaedro.webp',
    desc: `Significado: Representa el equilibrio entre dar y recibir. Asociado al aire y al corazón.

Uso: Armonizar emociones, abrirse al amor incondicional y liberar tensiones internas.

Visualización: Visualiza un octaedro verde esmeralda flotando en tu pecho. Con cada inhalación, se expande llenando de paz tu corazón.`
  },
  {
    slug: 'hexaedro',
    name: 'Hexaedro / Cubo (Elemento Tierra)',
    file: 'hexaedro.webp',
    desc: `Significado: Simboliza la estabilidad, la estructura y el sostén. Relacionado con el elemento tierra y el chakra raíz.

Uso: Conexión con la tierra, enraizamiento, seguridad y concreción de proyectos.

Visualización: Imagina un cubo de luz roja bajo tus pies, sólido y estable. Con cada exhalación, siente cómo tus raíces se extienden hacia el centro de la Tierra.`
  },
  {
    slug: 'tetraedro',
    name: 'Tetraedro (Elemento Fuego)',
    file: 'tetraedro.webp',
    desc: `Significado: Representa la energía del fuego, la voluntad y la transformación.

Uso: Activar la fuerza vital, purificar lo viejo y potenciar la acción consciente.

Visualización: Visualiza un tetraedro de luz dorada en tu plexo solar. Al inhalar, percibe cómo enciende tu energía interior y te llena de confianza.`
  },
  // Vesica Piscis: pedido de remover esta tarjeta por ahora
];

export default geometrias;
