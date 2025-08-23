// juego.js
import Equipo from "./equipo.js";
import Tablero from "./tablero.js";
// import { girarRuleta } from "./ruleta.js"; // asumo que ruleta.js tiene esto
const colores = ["#FF5733", "#33B5FF", "#FF33A8", "#33FF57"]; // colores para cada equipo

class Juego {
  constructor(cantidadEquipos) {
    this.equipos = this.crearEquipos(cantidadEquipos);
    // Asignamos colores a los equipos
    this.equipos.forEach((equipo, index) => {
      equipo.color = colores[index % colores.length]; // asigna un color cíclicamente
    });
    this.nivel = null; // se setea después en nivel.js
    this.tablero = new Tablero();
    this.turnoActual = 0; // índice del equipo al que le toca
  }

  crearEquipos(cantidad) {
    const frasesDummy = [
      "El cosmos arde en mi interior",
      "Pegaso dame tu fuerza",
      "Los caballeros nunca se rinden",
      "Por Atena y la justicia"
    ];

    let equipos = [];
    for (let i = 0; i < cantidad; i++) {
      const nombre = `Equipo ${i + 1}`;
      const frase = frasesDummy[i % frasesDummy.length]; // les asignamos alguna
      equipos.push(new Equipo(nombre, frase));
    }
    return equipos;
  }
  // Este es el método que permite reconstruir desde JSON
  static fromJSON(data) {
    let juego = new Juego(data.equipos.length);
    juego.equipos = data.equipos.map(e => Equipo.fromJSON(e));
    juego.nivel = data.nivel;
    juego.turnoActual = data.turnoActual;
    juego.tablero = new Tablero(); // si el tablero tiene datos guardados, reconstruirlos aquí
    return juego;
  }
}

export default Juego;
