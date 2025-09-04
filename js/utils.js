// utils.js
export function actualizarTurno(juego, turnoDiv) {
    const equipo = juego.equipos[juego.turnoActual];
    const posicion = equipo.posicion || 0;
    turnoDiv.innerHTML = `
      Turno: ${equipo.nombre}<br>
      Casillero: ${posicion} <br>
      Zona: ${juego.tablero.zonas[juego.tablero.obtenerIndiceZona(posicion)]?.nombre}
    `;
    // Cambiamos color de fondo dependiendo de la zona
    const body = document.body;
    body.style.backgroundColor = juego.tablero.zonas[juego.tablero.obtenerIndiceZona(posicion)]?.color;
    turnoDiv.style.backgroundColor = equipo.color || "#333333"; 
  }
  