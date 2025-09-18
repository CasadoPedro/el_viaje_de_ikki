import Equipo from "./equipo.js"; 
import Tablero from "./tablero.js"; 

const colores = ["#CB7C06", "#283583", "#AF0D1E", "#EF80B1", "#27AA5E"]; // colores para cada equipo

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
    const frasesDerechos = [
      "TENEMOS DERECHO A SER ESCUCHADOS"
    ];

    return Array.from({ length: cantidad }, (_, i) => {
      const nombre = `Equipo ${i + 1}`;
      const frase = frasesDerechos[i % frasesDerechos.length];
      return new Equipo(nombre, frase);
    });
  }

  /** Mueve al equipo actual 'pasos' casilleros. Devuelve info del movimiento y regalos procesados. */
  moverEquipo(pasos) {
    const equipo = this.equipos[this.turnoActual];
    const origen = equipo.posicion;
    const destino = Math.min(origen + pasos, 60);
    equipo.posicion = destino;

    // Obtener todos los regalos entre origen y destino
    const regalos = this.tablero.obtenerRegalosEntre(origen, destino);

    // Para cada regalo, si el equipo no lo recibió antes, aplicarlo (revelar jeroglifico)
    const regalosProcesados = [];
    for (let num of regalos) {
      if (!equipo.regalosTomados.includes(num)) {
        const resultado = equipo.revelarJeroglifico();
        equipo.regalosTomados.push(num);
        regalosProcesados.push({ casillero: num, ...resultado });
      }
    }

    return {
      equipo: equipo.nombre,
      origen,
      destino,
      casillero: this.tablero.getCasillero(destino),
      regalosProcesados
    };
  }
  
  /** Retrocede al equipo actual 'pasos' casilleros. No dispara efectos. */
  retrocederEquipo(pasos) {
    const equipo = this.equipos[this.turnoActual];
    const origen = equipo.posicion;
    const destino = Math.max(0, origen - pasos);
    equipo.posicion = destino;
    return { equipo: equipo.nombre, origen, destino, casillero: this.tablero.getCasillero(destino) };
  }

  /** Mueve turno al siguiente equipo que NO haya adivinado su frase */
  siguienteTurno() {
    if (this.equipos.every(e => e.fraseAdivinada)) {
      return -1; // señal que no quedan equipos activos
    }
    let idx = this.turnoActual;
    const n = this.equipos.length;
    for (let i = 1; i <= n; i++) {
      const candidate = (idx + i) % n;
      if (!this.equipos[candidate].fraseAdivinada) {
        this.turnoActual = candidate;
        return this.turnoActual;
      }
    }
    return this.turnoActual;
  }
  /** Intento de adivinar (por el equipo actual). Devuelve objeto con resultado y acciones realizadas. */
  intentarAdivinar(textoIntento) {
    const equipo = this.equipos[this.turnoActual];
    if (equipo.fraseAdivinada) {
      return { success: false, reason: "Equipo ya finalizado" };
    }
    if (equipo.intentoEnTurno) {
      return { success: false, reason: "Ya intentó adivinar este turno" };
    }

    equipo.intentoEnTurno = true;

    const dado = (textoIntento || "").trim().toUpperCase();
    const correcto = dado === (equipo.frase || "").toUpperCase();

    if (correcto) {
      equipo.fraseAdivinada = true;
      // marcar como terminado
      // reset intentoEnTurno no relevante ahora
      // chequear fin de juego
      const todos = this.equipos.every(e => e.fraseAdivinada);
      return { success: true, todos };
    } else {
      // si falla, retroceder 2 casilleros y terminar turno
      const origen = equipo.posicion;
      const destino = Math.max(0, origen - 2);
      equipo.posicion = destino;
      return { success: false, retrocedido: true, origen, destino };
    }
  }

  // Para reconstrucción desde JSON
  static fromJSON(data) {
    let juego = new Juego(data.equipos.length || (data.equipos ? data.equipos.length : 0));
    juego.equipos = data.equipos.map(e => Equipo.fromJSON(e));
    juego.nivel = data.nivel;
    juego.turnoActual = data.turnoActual ?? 0;
    juego.tablero = new Tablero();
    return juego;
  }
}

export default Juego;