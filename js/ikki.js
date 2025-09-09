import Juego from "./juego.js";
import { actualizarTurno } from "./utils.js";

// Recuperamos el juego
let juegoData = JSON.parse(sessionStorage.getItem("juego"));
if (!juegoData) {
  window.location.href = "index.html"; // seguridad
}
let juego = Juego.fromJSON(juegoData);
console.log("Juego reconstruido:", juego);

// Mostramos turno
const turnoDiv = document.getElementsByClassName("turnoActual")[0];
actualizarTurno(juego, turnoDiv);

// Por ahora no hay lógica extra.
// Aquí luego integramos MindAR.
