// Definición de las zonas del tablero del juego
const ZONAS = [
  { nombre: "Laberinto del miedo", emocion: "Miedo", color: "#828380", inicio: 0, fin: 9 },
  { nombre: "Mar de la soledad", emocion: "Soledad", color: "#0085CC", inicio: 10, fin: 17 },
  { nombre: "Bosque de las decisiones", emocion: "Tristeza", color: "#283583", inicio: 18, fin: 25 },
  { nombre: "Nido de las palabras no dichas", emocion: "Enojo", color: "#AF0D1E", inicio: 26, fin: 33 },
  { nombre: "Río de las emociones", emocion: "Ternura", color: "#EF80B1", inicio: 34, fin: 41 },
  { nombre: "Montaña del coraje", emocion: "Alegría", color: "#FAB858", inicio: 42, fin: 50 },
  { nombre: "Puente de los vínculos", emocion: "Confianza", color: "#283583", inicio: 51, fin: 59 },
  { nombre: "Corazón de Ikki", inicio: 60, fin: 60 } // Casilla final del juego
];

// Mapeo de efectos especiales por número de casilla
const EFECTOS = {
  "Regalo": [1, 12, 22, 28, 35, 57, 59],
  "Cuento": [3, 6, 9, 10, 15, 19, 24, 26, 30, 34, 38, 43, 47, 52, 56],
  "Debate": [5, 11, 21, 29, 36, 50, 54],
  "Emoción": [4, 13, 20, 31, 41, 42, 51],
  "Dialogo": [8, 16, 18, 33, 37, 45, 58],
  "Corazon de Ikki": [60]
};

// Preguntas reflexivas organizadas por zona emocional
// Cada array corresponde a una zona específica 
const PREGUNTAS_POR_ZONA = [
  // Zona 0: Laberinto del miedo (casillas 0-9)
  [
    "¿Alguna vez sentiste que no podías más? ¿Qué te ayudó a seguir?",
    "¿Qué harías si alguien te invita a un lugar que te da miedo? ¿A quién pedirías ayuda?",
    "¿Qué significa acompañar a alguien que necesita más tiempo o cuidado?"
  ],
  // Zona 1: Mar de la soledad (casillas 10-17)
  [
    "¿Usás redes sociales? ¿Con quién hablarías si alguien que no conocés te invita a salir?",
    "¿Alguna vez tuviste una intuición de que algo no estaba bien? ¿La escuchaste?"
  ],
  // Zona 2: Bosque de las decisiones (casillas 18-25)
  [
    "¿Alguna vez sentiste que tenías que hacer cosas de grandes siendo niño? ¿Cómo te hizo sentir?",
    "¿Qué harías si sentís que alguien está en peligro y necesita ser rescatado?"
  ],
  // Zona 3: Nido de las palabras no dichas (casillas 26-33)
  [
    "¿Te pasó alguna vez que alguien creyó en un rumor sobre vos? ¿Qué se puede hacer en esos casos?",
    "¿Por qué es importante no acusar a alguien sin pruebas? ¿Qué derecho se está cuidando al esperar y observar?"
  ],
  // Zona 4: Río de las emociones (casillas 34-41)
  [
    "¿Qué aprendemos cuando algo se rompe sin intención? ¿Es posible reparar sin culpar?",
    "¿Sabés decir “no” cuando algo no te gusta o te incomoda? ¿Cómo lo hacés?"
  ],
  // Zona 5: Montaña del coraje (casillas 42-50)
  [
    "¿Qué cosas te ayudan a reconocer si una relación es sana o peligrosa?",
    "¿Qué hacés si sentís que un amigo te trata mal o te hace dudar de vos mismo?"
  ],
  // Zona 6: Puente de los vínculos (casillas 51-59)
  [
    "¿Alguna vez te sentiste distinto y no te animaste a decirlo? ¿Qué te hubiera ayudado a hablar?",
    "¿Cómo te sentís cuando estás en lugares donde no podés ser vos mismo/a? ¿Qué cosas te ayudan a sentirte en casa?"
  ]
];

/**
 * Clase que representa el tablero del juego
 * Maneja las zonas emocionales, casillas, efectos y preguntas reflexivas
 */
class Tablero {
  constructor() {
    this.zonas = ZONAS;
    this.casillas = this._crearCasillas(); // Array de todas las casillas con sus efectos
    this.casilleroCache = new Map(this.casillas.map(c => [c.numero, c])); // Cache para acceso rápido
    this.preguntasPorZona = PREGUNTAS_POR_ZONA;
  }

  // Crear las casillas del tablero con sus efectos correspondientes
  _crearCasillas() {
    return Array.from({ length: 60 }, (_, i) => {
      const numero = i + 1;
      const efecto = Object.entries(EFECTOS).find(([_, numeros]) => numeros.includes(numero))?.[0] || "Sin efecto";
      return { numero, efecto };
    });
  }

  // Obtener información de una casilla por su número
  getCasillero(numero) {
    return this.casilleroCache.get(numero) || null;
  }

  // Buscar casillas con efecto "Regalo" entre dos posiciones
  obtenerRegalosEntre(origen, destino) {
    const [inicio, fin] = origen < destino ? [origen, destino] : [destino, origen];
    return this.casillas
      .filter(c => c.numero > inicio && c.numero <= fin && c.efecto === "Regalo")
      .map(c => c.numero);
  }

  // Obtener el índice de la zona según la posición actual
  obtenerIndiceZona(posicion) {
    return this.zonas.findIndex(z => posicion >= z.inicio && posicion <= z.fin && z.nombre !== "Corazón de Ikki");
  }

  // Obtener una pregunta aleatoria para la zona correspondiente a la posición actual
  obtenerPregunta(posicion) {
    const preguntas = this.preguntasPorZona[this.obtenerIndiceZona(posicion)];
    return preguntas?.[Math.floor(Math.random() * preguntas.length)] || null;
  }
}

export default Tablero;