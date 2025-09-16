import { iniciarPagina } from "./utils.js";

let juego = iniciarPagina();

const posicion = juego.equipos[juego.turnoActual].posicion || 0;
const zona = juego.tablero.zonas.find(z => posicion >= z.inicio && posicion <= z.fin);

console.log(`El equipo actual está en un casillero de emoción: ${zona.emocion}`); 

const nombreEmocion = document.getElementById("nombre-emocion");
nombreEmocion.textContent = zona.emocion;

const btnContinuar = document.getElementById("btn-continuar");

btnContinuar.addEventListener("click", () => {
  // Pasar el turno al siguiente equipo
  juego.siguienteTurno();

  // Guardar el juego actualizado en sessionStorage
  sessionStorage.setItem("juego", JSON.stringify(juego));

  // Volver a ruleta.html
  window.location.href = "ruleta.html";
});
