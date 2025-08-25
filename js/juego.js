import Equipo from "./equipo.js"; 
import Tablero from "./tablero.js"; 
// import { girarRuleta } from "./ruleta.js"; // asumo que ruleta.js tiene esto 
const colores = ["#FF5733", "#33B5FF", "#FF33A8", "#33FF57"]; // colores para cada equipo

class Juego {
  constructor(cantidadEquipos) {
    this.equipos = this.crearEquipos(cantidadEquipos);
    this.equipos.forEach((equipo, index) => {
      equipo.color = colores[index % colores.length];
    });
    this.nivel = null;
    this.tablero = new Tablero();
    this.turnoActual = 0;
  }

  crearEquipos(cantidad) {
    const frasesDummy = [
      "El cosmos arde en mi interior",
      "Pegaso dame tu fuerza",
      "Los caballeros nunca se rinden",
      "Por Atena y la justicia"
    ];

    return Array.from({ length: cantidad }, (_, i) => {
      const nombre = `Equipo ${i + 1}`;
      const frase = frasesDummy[i % frasesDummy.length];
      return new Equipo(nombre, frase);
    });
  }

  // Método para avanzar al equipo del turno actual
  moverEquipo(pasos) {
    const equipo = this.equipos[this.turnoActual];
    const origen = equipo.posicion;
    const destino = Math.min(origen + pasos, 60); // límite del tablero
    equipo.posicion = destino;

    // Verificamos si pasó por un casillero con Regalo
    if (this.tablero.hayRegaloEntre(origen, destino)) {
      console.log(`${equipo.nombre} encontró un Regalo y gana un token!`);
    }

    // Devolvemos info del movimiento (útil para frontend)
    return {
      equipo: equipo.nombre,
      origen,
      destino,
      casillero: this.tablero.getCasillero(destino),
      tokens: equipo.tokens
    };
  }

  // Pasar al siguiente equipo
  siguienteTurno() {
    this.turnoActual = (this.turnoActual + 1) % this.equipos.length;
    return this.turnoActual;
  }

  // Para reconstrucción desde JSON
  static fromJSON(data) {
    let juego = new Juego(data.equipos.length);
    juego.equipos = data.equipos.map(e => Equipo.fromJSON(e));
    juego.nivel = data.nivel;
    juego.turnoActual = data.turnoActual;
    juego.tablero = new Tablero();
    return juego;
  }
}

export default Juego;