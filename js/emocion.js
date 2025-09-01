import Juego from "./juego.js";
import { actualizarTurno } from "./utils.js";

let juegoData = JSON.parse(sessionStorage.getItem("juego"));
if (!juegoData) window.location.href = "index.html";
let juego = Juego.fromJSON(juegoData);

const turnoDiv = document.querySelector(".turnoActual");
actualizarTurno(juego, turnoDiv);

const equipo = juego.equipos[juego.turnoActual];
const posicion = equipo.posicion || 0;

console.log("Juego reconstruido:", juego);
console.log("Turno actual:", juego.turnoActual, "Equipo:", equipo.nombre, "Posición:", posicion);

let emocion = "Desconocida";
const zona = juego.tablero.zonas.find(z => posicion >= z.inicio && posicion <= z.fin);

console.log(`El equipo ${equipo.nombre} está en un casillero de emoción: ${zona.emocion}`); 

const nombreEmocion = document.getElementById("nombre-emocion");
nombreEmocion.textContent = zona.emocion;

const btnContinuar = document.getElementById("btn-continuar");

btnContinuar.addEventListener("click", () => {
  // Pasar el turno al siguiente equipo
  juego.turnoActual = (juego.turnoActual + 1) % juego.equipos.length;

  // Guardar el juego actualizado en sessionStorage
  sessionStorage.setItem("juego", JSON.stringify(juego));

  // Volver a ruleta.html
  window.location.href = "ruleta.html";
});
