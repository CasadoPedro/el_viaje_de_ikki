import {iniciarPagina } from "./utils.js";
import { updateMusicForZone } from "./musica.js";

let juego = iniciarPagina();
updateMusicForZone(juego.tablero.zonas.find(z => juego.equipos[juego.turnoActual].posicion >= z.inicio && juego.equipos[juego.turnoActual].posicion <= z.fin).nombre);


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

// Elegir un derecho aleatorio y mostrarlo
const derechoAleatorio = derechos[Math.floor(Math.random() * derechos.length)];
document.getElementById("derecho-nino").textContent = derechoAleatorio;

const btnContinuar = document.getElementById("boton-continuar");

btnContinuar.addEventListener("click", () => {
  // Pasar el turno al siguiente equipo
  juego.siguienteTurno();
  // Guardar el juego actualizado en sessionStorage
  sessionStorage.setItem("juego", JSON.stringify(juego));

  // Volver a ruleta.html
  window.location.href = "ruleta.html";
});
