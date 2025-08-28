class Tablero {
  constructor() {
    this.zonas = this._crearZonas();
    this.casillas = this._crearCasillas();
  }

  _crearZonas() {
    return [
      { nombre: "Laberinto del miedo", emocion: "Miedo", inicio: 1, fin: 9 },
      { nombre: "Mar de la soledad", emocion:"Soledad", inicio: 10, fin: 17 },
      { nombre: "Bosque de las decisiones", emocion:"Tristeza", inicio: 18, fin: 25 },
      { nombre: "Nido de las palabras no dichas", emocion:"Enojo",inicio: 26, fin: 33 },
      { nombre: "Río de las emociones", emocion:"Ternura",inicio: 34, fin: 41 },
      { nombre: "Montaña del coraje", emocion:"Alegría", inicio: 42, fin: 50 },
      { nombre: "Puente de los vínculos", emocion:"Confianza|", inicio: 51, fin: 59 },
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
}

export default Tablero;
