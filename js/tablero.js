class Tablero {
    constructor() {
      this.zonas = this._crearZonas();
      this.casillas = this._crearCasillas();
    }
  
    _crearZonas() {
      return [
        { nombre: "Laberinto del miedo", inicio: 1, fin: 9 },
        { nombre: "Mar de la soledad", inicio: 10, fin: 17 },
        { nombre: "Bosque de las decisiones", inicio: 18, fin: 25 },
        { nombre: "Nido de las palabras no dichas", inicio: 26, fin: 33 },
        { nombre: "Río de las emociones", inicio: 34, fin: 41 },
        { nombre: "Montaña del coraje", inicio: 42, fin: 50 },
        { nombre: "Puente de los vínculos", inicio: 51, fin: 59 },
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
  }
  
  export default Tablero;
  