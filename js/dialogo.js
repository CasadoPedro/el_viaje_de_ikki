import Juego from "./juego.js";
import { actualizarTurno } from "./utils.js";

let juegoData = JSON.parse(sessionStorage.getItem("juego"));
if (!juegoData) window.location.href = "index.html";
let juego = Juego.fromJSON(juegoData);

const turnoDiv = document.querySelector(".turnoActual");
actualizarTurno(juego, turnoDiv);

const equipo = juego.equipos[juego.turnoActual];
const posicion = equipo.posicion || 0;

juego.tablero.obtenerPregunta
const pregunta = juego.tablero.obtenerPregunta(posicion);

// Mostrar la pregunta
document.getElementById("pregunta-dialogo").innerText = pregunta ?? "No hay pregunta disponible para esta casilla.";

console.log("Juego reconstruido:", juego);
console.log("Turno actual:", juego.turnoActual, "Equipo:", equipo.nombre, "Posición:", posicion);

const btnContinuar = document.getElementById("btn-continuar");

btnContinuar.addEventListener("click", () => {
  // Pasar turno
  juego.turnoActual = (juego.turnoActual + 1) % juego.equipos.length;

  // Guardar estado
  sessionStorage.setItem("juego", JSON.stringify(juego));

  // Volver a la ruleta
  window.location.href = "ruleta.html";
});
