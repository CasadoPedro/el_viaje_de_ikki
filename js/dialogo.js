import { iniciarPagina } from "./utils.js";
import { updateMusicForZone } from "./musica.js";

let juego = iniciarPagina();
updateMusicForZone(juego.tablero.zonas.find(z => juego.equipos[juego.turnoActual].posicion >= z.inicio && juego.equipos[juego.turnoActual].posicion <= z.fin).nombre);

// Obtener la pregunta según la posición del equipo actual
const pregunta = juego.tablero.obtenerPregunta(juego.equipos[juego.turnoActual].posicion);

// Mostrar la pregunta
document.getElementById("pregunta-dialogo").innerText = pregunta ?? "No hay pregunta disponible para esta casilla.";

const btnContinuar = document.getElementById("boton-continuar");


btnContinuar.addEventListener("click", () => {
  // Pasar turno
  juego.siguienteTurno();

  // Guardar estado
  sessionStorage.setItem("juego", JSON.stringify(juego));

  // Volver a la ruleta
  window.location.href = "ruleta.html";
});
