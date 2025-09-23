// Lista de cristales con información estructurada
// Estructura: { slug, nombre, descripcion, cuerpo, beneficios, mensaje }

const cristales = [
  {
    slug: 'cuarzo-cristal',
    nombre: 'Cuarzo Cristal (Transparente)',
    descripcion: 'Maestro sanador, amplificador de energía e intención.',
    cuerpo: 'Alinea todos los chakras, especialmente el coronario.',
    beneficios: 'Claridad mental, conexión espiritual, armonización general del campo energético.',
    mensaje: '“Si hoy elegiste este cristal, tu ser pide claridad y recordar que dentro de ti ya está la luz que guía tu camino.”'
  },
  {
    slug: 'cuarzo-rosa',
    nombre: 'Cuarzo Rosa',
    descripcion: 'Piedra del amor incondicional y la sanación emocional.',
    cuerpo: 'Corazón físico y chakra corazón.',
    beneficios: 'Libera bloqueos emocionales, fomenta autoestima, suaviza relaciones.',
    mensaje: '“Si conectaste con este cristal, tu alma te recuerda abrir el corazón y recibir el amor que ya te rodea.”'
  },
  {
    slug: 'cuarzo-ahumado',
    nombre: 'Cuarzo Ahumado',
    descripcion: 'Protector y transmutador de energías densas.',
    cuerpo: 'Chakra raíz, piernas, sistema nervioso.',
    beneficios: 'Enraizamiento, calma, libera tensiones y miedos.',
    mensaje: '“Si elegiste este cristal, necesitas soltar cargas y confiar en el sostén de la Tierra.”'
  },
  {
    slug: 'amatista',
    nombre: 'Amatista',
    descripcion: 'Cristal de la transmutación y la conexión espiritual.',
    cuerpo: 'Tercer ojo y coronario, sistema nervioso.',
    beneficios: 'Calma la mente, ayuda a dormir, protege el aura.',
    mensaje: '“Tu espíritu busca paz interior; permite que la intuición te guíe en este momento.”'
  },
  {
    slug: 'citrino',
    nombre: 'Citrino',
    descripcion: 'Piedra de la abundancia y la vitalidad.',
    cuerpo: 'Plexo solar, sistema digestivo.',
    beneficios: 'Activa la confianza, la creatividad y la prosperidad.',
    mensaje: '“Hoy la vida te invita a brillar, confiar en ti y expandir tu luz al mundo.”'
  },
  {
    slug: 'cuarzo-azul',
    nombre: 'Cuarzo Azul',
    descripcion: 'Cristal de serenidad y comunicación clara.',
    cuerpo: 'Garganta, sistema respiratorio.',
    beneficios: 'Facilita la expresión, calma la mente, equilibra emociones.',
    mensaje: '“Tu voz es medicina: este cristal te invita a expresarte con calma y verdad.”'
  },
  {
    slug: 'prasiolita',
    nombre: 'Prasiolita',
    descripcion: 'Energía sanadora de la naturaleza.',
    cuerpo: 'Corazón, sistema inmunológico.',
    beneficios: 'Regenera, fortalece y armoniza.',
    mensaje: '“Hoy tu cuerpo y tu corazón piden sanación, abraza la energía verde de la vida.”'
  },
  {
    slug: 'cuarzo-lemuriano',
    nombre: 'Cuarzo Lemuriano',
    descripcion: 'Guardián de sabiduría ancestral.',
    cuerpo: 'Columna vertebral y chakras superiores.',
    beneficios: 'Potencia conexión espiritual, desbloquea memorias, une cuerpo-mente-alma.',
    mensaje: '“Este cristal despierta memorias sagradas: confía en la sabiduría que habita en ti.”'
  },
  {
    slug: 'cuarzo-rutilado',
    nombre: 'Cuarzo Rutilado',
    descripcion: 'Cristal de energía y movimiento.',
    cuerpo: 'Sistema nervioso, plexo solar.',
    beneficios: 'Estimula la creatividad, rompe patrones negativos.',
    mensaje: '“Tu alma te impulsa a crear y renovarte, libera lo viejo y deja fluir la inspiración.”'
  },
  {
    slug: 'pirita',
    nombre: 'Pirita',
    descripcion: 'Piedra de prosperidad y protección.',
    cuerpo: 'Plexo solar, sistema circulatorio.',
    beneficios: 'Atrae abundancia, refuerza la voluntad, protege el campo energético.',
    mensaje: '“Tu ser busca seguridad y expansión; confía en tu poder creador para manifestar.”'
  },
  {
    slug: 'obsidiana',
    nombre: 'Obsidiana',
    descripcion: 'Cristal volcánico de protección profunda y verdad interior.',
    cuerpo: 'Raíz, sistema óseo.',
    beneficios: 'Disuelve bloqueos, ayuda a enfrentar la sombra, protege de energías externas.',
    mensaje: '“Si elegiste este cristal, es momento de mirar dentro de ti y sanar lo oculto.”'
  },
  {
    slug: 'turmalina-negra',
    nombre: 'Turmalina Negra',
    descripcion: 'Escudo protector por excelencia.',
    cuerpo: 'Base de la columna, sistema nervioso.',
    beneficios: 'Transmuta lo negativo en positivo, protege, enraíza.',
    mensaje: '“Hoy necesitas protección y firmeza; este cristal te envuelve en seguridad.”'
  },
  {
    slug: 'ojo-de-tigre',
    nombre: 'Ojo de Tigre',
    descripcion: 'Piedra de equilibrio, valor y enfoque.',
    cuerpo: 'Plexo solar, órganos digestivos.',
    beneficios: 'Refuerza confianza, equilibra emociones, protege de envidias.',
    mensaje: '“Este cristal te recuerda tu fuerza interna y te invita a avanzar con decisión.”'
  },
  {
    slug: 'shungita',
    nombre: 'Shungita (Yunguita)',
    descripcion: 'Mineral ancestral de purificación.',
    cuerpo: 'Todo el organismo, sistema inmune.',
    beneficios: 'Neutraliza radiaciones, regenera y limpia energía vital.',
    mensaje: '“Tu cuerpo y tu energía piden depuración, confía en la fuerza de la Tierra para renovarte.”'
  },
  {
    slug: 'jade',
    nombre: 'Jade',
    descripcion: 'Piedra de armonía y sanación ancestral.',
    cuerpo: 'Corazón, riñones y sistema urinario.',
    beneficios: 'Equilibra emociones, aporta paz y buena fortuna.',
    mensaje: '“Si elegiste jade, tu alma busca equilibrio y paz en cada aspecto de tu vida.”'
  },
  {
    slug: 'lapislazuli',
    nombre: 'Lapislázuli',
    descripcion: 'Piedra de sabiduría y comunicación consciente.',
    cuerpo: 'Garganta, tercer ojo, sistema nervioso.',
    beneficios: 'Estimula intuición, abre la visión espiritual, potencia creatividad.',
    mensaje: '“Hoy tu ser quiere conectar con la verdad y la sabiduría que habita en ti.”'
  }
];

export default cristales;