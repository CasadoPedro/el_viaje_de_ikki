// utils.js
export function actualizarTurno(juego, turnoDiv) {
    const equipo = juego.equipos[juego.turnoActual];
    const posicion = equipo.posicion || 0;
    turnoDiv.innerHTML = `
      Turno: ${equipo.nombre}<br>
      Casillero: ${posicion}
    `;
    turnoDiv.style.backgroundColor = equipo.color || "#333333"; 
  }
  