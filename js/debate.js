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

// 📌 Lista de derechos del niño
const derechos = [
  "Jugar y disfrutar de la infancia",
  "Recibir educación de calidad",
  "Tener acceso a la salud",
  "Vivir en un ambiente seguro y protegido",
  "Ser escuchados y expresar su opinión",
  "No sufrir discriminación",
  "Tener un nombre y una identidad",
  "Recibir cuidados y amor de su familia",
  "Acceder a una alimentación adecuada",
  "Tener derecho al descanso y al ocio"
];

// Elegir uno aleatorio
const derechoAleatorio = derechos[Math.floor(Math.random() * derechos.length)];
document.getElementById("derecho-nino").textContent = derechoAleatorio;

const btnContinuar = document.getElementById("btn-continuar");

btnContinuar.addEventListener("click", () => {
  // Pasar el turno al siguiente equipo
  juego.turnoActual = (juego.turnoActual + 1) % juego.equipos.length;

  // Guardar el juego actualizado en sessionStorage
  sessionStorage.setItem("juego", JSON.stringify(juego));

  // Volver a ruleta.html
  window.location.href = "ruleta.html";
});
