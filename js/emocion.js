import { iniciarPagina } from "./utils.js";
import { updateMusicForZone } from "./musica.js";

let juego = iniciarPagina();

// Determinar la zona del equipo actual
const posicion = juego.equipos[juego.turnoActual].posicion || 0;
const zona = juego.tablero.zonas.find(z => posicion >= z.inicio && posicion <= z.fin);

console.log(`El equipo actual está en un casillero de emoción: ${zona.emocion}`); 

// Mostrar la emoción en el HTML
const nombreEmocion = document.getElementById("nombre-emocion");
nombreEmocion.textContent = zona.emocion;

updateMusicForZone(zona.nombre);

const btnContinuar = document.getElementById("boton-continuar");

btnContinuar.addEventListener("click", () => {
  // Pasar el turno al siguiente equipo
  juego.siguienteTurno();

  // Guardar el juego actualizado en sessionStorage
  sessionStorage.setItem("juego", JSON.stringify(juego));

  // Volver a ruleta.html
  window.location.href = "ruleta.html";
});
