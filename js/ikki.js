import Juego from "./juego.js";
import { actualizarIndicadorTurno } from "./utils.js";

// Recuperamos el juego
let juegoData = JSON.parse(sessionStorage.getItem("juego"));
if (!juegoData) {
  window.location.href = "index.html"; // seguridad
}
let juego = Juego.fromJSON(juegoData);
console.log("Juego reconstruido:", juego);

// Mostramos turno
const turnoDiv = document.getElementsByClassName("turnoActual")[0];
actualizarIndicadorTurno(juego, turnoDiv);

// 👉 Lógica para salir y pasar turno
const btnSalir = document.getElementById("btn-salir-ikki");
btnSalir.addEventListener("click", () => {
  // Pasamos al siguiente equipo
  juego.turnoActual = (juego.turnoActual + 1) % juego.equipos.length;

  // Guardamos estado
  sessionStorage.setItem("juego", JSON.stringify(juego));

  // Redirigimos a ruleta
  window.location.href = "ruleta.html";
});
