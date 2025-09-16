// utils.js
import Juego from "./juego.js";
export function actualizarIndicadorTurno(juego, turnoDiv) {
    const equipo = juego.equipos[juego.turnoActual];
    const posicion = equipo.posicion || 0;
    turnoDiv.innerHTML = `
      Turno: ${equipo.nombre}<br>
      Casillero: ${posicion} <br>
      Zona: ${juego.tablero.zonas[juego.tablero.obtenerIndiceZona(posicion)]?.nombre || "Inicio"}
    `;
    // Cambiamos color de fondo dependiendo de la zona
    const body = document.body;
    body.style.backgroundColor = juego.tablero.zonas[juego.tablero.obtenerIndiceZona(posicion)]?.color || "#F2D8D8";
    turnoDiv.style.backgroundColor = equipo.color || "#333333"; 
  }
  
export function iniciarPagina() {
  let juegoData = JSON.parse(sessionStorage.getItem("juego"));
  let juego = Juego.fromJSON(juegoData);
    if (!juego) {
      window.location.href = "index.html"; // Seguridad
    }
    console.log("Juego reconstruido:", juego);
    const turnoDiv = document.getElementsByClassName("turnoActual")[0];
    actualizarIndicadorTurno(juego, turnoDiv);
    return juego;
  }