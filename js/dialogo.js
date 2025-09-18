//import Juego from "./juego.js";
import { iniciarPagina } from "./utils.js";

let juego = iniciarPagina();

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
