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
    const frasesDerechos = ["IGUALDAD SIN DISCRIMINACION", "NOMBRE Y NACIONALIDAD", "DERECHO A UNA FAMILIA", "JUGAR Y TENER ACTIVIDAD RECREATIVA", "ALIMENTACION Y VIVIENDA", "DERECHO A SER ESCUCHADOS", "PROTECCION CONTRA EL ABUSO, MALTRATO Y LA TRATA", "SALUD Y CUIDADO PARA NIÑOS CON IMPEDIMENTOS" ,"NO AL TRABAJO Y LA EXPLOTACION"
    ];
    return [...Array(cantidad)].map((_, i) => {
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
  
    const regalosProcesados = this.tablero
      .obtenerRegalosEntre(origen, destino)
      .filter(num => !equipo.regalosTomados.includes(num))
      .map(num => {
        equipo.regalosTomados.push(num);
        return { casillero: num, ...equipo.revelarJeroglifico() };
      });
  
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
    if (this.equipos.every(e => e.fraseAdivinada)) return -1;
  
    const n = this.equipos.length;
    const nextIndex = this.equipos
      .slice(this.turnoActual + 1)
      .concat(this.equipos.slice(0, this.turnoActual))
      .findIndex(e => !e.fraseAdivinada);
  
    this.turnoActual = (this.turnoActual + nextIndex + 1) % n;
    return this.turnoActual;
  }
  /** Intento de adivinar (por el equipo actual). Devuelve objeto con resultado y acciones realizadas. */
  intentarAdivinar(textoIntento) {
    const equipo = this.equipos[this.turnoActual];
    if (equipo.fraseAdivinada || equipo.intentoEnTurno) {
      return { success: false, reason: equipo.fraseAdivinada ? "Equipo ya finalizado" : "Ya intentó adivinar este turno" };
    }
  
    equipo.intentoEnTurno = true;
    const correcto = textoIntento.trim().toUpperCase() === equipo.frase.toUpperCase();
  
    if (correcto) {
      equipo.fraseAdivinada = true;
      return { success: true, todos: this.equipos.every(e => e.fraseAdivinada) };
    }
  
    equipo.posicion = Math.max(0, equipo.posicion - 2);
    return { success: false, retrocedido: true, origen: equipo.posicion + 2, destino: equipo.posicion };
  }

  // Para reconstrucción desde JSON
  static fromJSON(data) {
    const juego = new Juego(data.equipos.length || 0);
    Object.assign(juego, {
      equipos: data.equipos.map(Equipo.fromJSON),
      nivel: data.nivel,
      turnoActual: data.turnoActual ?? 0,
      tablero: new Tablero()
    });
    return juego;
  }
}

export default Juego;