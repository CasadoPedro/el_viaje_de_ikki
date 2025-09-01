class Tablero {
  constructor() {
    this.zonas = this._crearZonas();
    this.casillas = this._crearCasillas();
    this.preguntasPorZona = [
      [
        "¿Alguna vez sentiste que no podías más? ¿Qué te ayudó a seguir?",
        "¿Qué harías si alguien te invita a un lugar que te da miedo? ¿A quién pedirías ayuda?",
        "¿Qué significa acompañar a alguien que necesita más tiempo o cuidado?"
      ],
      [
        "¿Usás redes sociales? ¿Con quién hablarías si alguien que no conocés te invita a salir?",
        "¿Alguna vez tuviste una intuición de que algo no estaba bien? ¿La escuchaste?"
      ],
      [
        "¿Alguna vez sentiste que tenías que hacer cosas de grandes siendo niño? ¿Cómo te hizo sentir?",
        "¿Qué harías si sentís que alguien está en peligro y necesita ser rescatado?"
      ],
      [
        "¿Te pasó alguna vez que alguien creyó en un rumor sobre vos? ¿Qué se puede hacer en esos casos?",
        "¿Por qué es importante no acusar a alguien sin pruebas? ¿Qué derecho se está cuidando al esperar y observar?"
      ],
      [
        "¿Qué aprendemos cuando algo se rompe sin intención? ¿Es posible reparar sin culpar?",
        "¿Sabés decir “no” cuando algo no te gusta o te incomoda? ¿Cómo lo hacés?"
      ],
      [
        "¿Qué cosas te ayudan a reconocer si una relación es sana o peligrosa?",
        "¿Qué hacés si sentís que un amigo te trata mal o te hace dudar de vos mismo?"
      ],
      [
        "¿Alguna vez te sentiste distinto y no te animaste a decirlo? ¿Qué te hubiera ayudado a hablar?",
        "¿Cómo te sentís cuando estás en lugares donde no podés ser vos mismo/a? ¿Qué cosas te ayudan a sentirte en casa?"
      ]
    ];
  }

  _crearZonas() {
    return [
      { nombre: "Laberinto del miedo", emocion: "Miedo", inicio: 1, fin: 9 },
      { nombre: "Mar de la soledad", emocion:"Soledad", inicio: 10, fin: 17 },
      { nombre: "Bosque de las decisiones", emocion:"Tristeza", inicio: 18, fin: 25 },
      { nombre: "Nido de las palabras no dichas", emocion:"Enojo",inicio: 26, fin: 33 },
      { nombre: "Río de las emociones", emocion:"Ternura",inicio: 34, fin: 41 },
      { nombre: "Montaña del coraje", emocion:"Alegría", inicio: 42, fin: 50 },
      { nombre: "Puente de los vínculos", emocion:"Confianza", inicio: 51, fin: 59 },
      { nombre: "Corazón de Ikki", inicio: 60, fin: 60 }
    ];
  }

  _crearCasillas() {
    const efectos = {
      "Regalo": [1,12,22,28,35,57,59],
      "Cuento": [3,6,9,10,15,19,24,26,30,34,38,43,47,52,56],
      "Debate": [5,11,21,29,36,50,54],
      "Emoción": [4,13,20,31,41,42,51],
      "Dialogo": [8,16,18,33,37,45,58],
      "Corazon de Ikki": [60]
    };

    let casillas = [];

    for (let i = 1; i <= 60; i++) {
      let efecto = "Sin efecto";
      for (let key in efectos) {
        if (efectos[key].includes(i)) {
          efecto = key;
          break;
        }
      }
      casillas.push({ numero: i, efecto });
    }

    return casillas;
  }

  /** Devuelve el casillero por número */
  getCasillero(numero) {
    return this.casillas.find(c => c.numero === numero);
  }

  /** Verifica si entre origen y destino se pasó por un casillero Regalo */
  hayRegaloEntre(origen, destino) {
    // aseguramos que origen < destino
    const [inicio, fin] = origen < destino ? [origen, destino] : [destino, origen];
    for (let i = inicio + 1; i <= fin; i++) {
      const casillero = this.getCasillero(i);
      if (casillero && casillero.efecto === "Regalo") {
        return true;
      }
    }
    return false;
  }
  obtenerIndiceZona(posicion) {
    const idx = this.zonas.findIndex(z => posicion >= z.inicio && posicion <= z.fin);
    // idx === 7 sería "Corazón de Ikki", que no tiene preguntas
    if (idx === -1 || idx >= this.preguntasPorZona.length) return -1;
    return idx; // 0..6
  }

  /** Devuelve una pregunta aleatoria válida para la posición dada, o null si no corresponde. */
  obtenerPregunta(posicion) {
    const idxZona = this.obtenerIndiceZona(posicion);
    if (idxZona === -1) return null;
    const preguntas = this.preguntasPorZona[idxZona];
    return preguntas[Math.floor(Math.random() * preguntas.length)];
  }
}

export default Tablero;
