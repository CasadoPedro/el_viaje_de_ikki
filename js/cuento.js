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

// Referencias DOM
const introCuento = document.getElementById("intro-cuento");
const quizCuento = document.getElementById("quiz-cuento");
const btnIntroContinuar = document.getElementById("btnIntroContinuar");
const btnVolver = document.getElementById("btnVolver");
const opciones = document.querySelectorAll(".opciones img");

// Modal incorrecto
const modalIncorrecto = document.getElementById("modalIncorrecto");
const btnIncorrectoContinuar = document.getElementById("btnIncorrectoContinuar");

// Opción correcta (por ahora fija)
const opcionCorrecta = "2";

// ---- Flujo ----
btnIntroContinuar.addEventListener("click", () => {
  introCuento.style.display = "none";
  quizCuento.style.display = "block";
});

// Cuando eligen una opción
opciones.forEach(img => {
  img.addEventListener("click", () => {
    if (img.dataset.opcion === opcionCorrecta) {
      // Guardamos estado antes de redirigir
      juego.turnoActual = (juego.turnoActual + 1) % juego.equipos.length;
      sessionStorage.setItem("juego", JSON.stringify(juego));
    
      // Redirigir a ikki.html
      window.location.href = "ikki.html";
    } else {
      // Mostrar modal incorrecto
      modalIncorrecto.style.display = "flex";
    }
  });
});

// Caso incorrecto → retrocede 2 casilleros
btnIncorrectoContinuar.addEventListener("click", () => {
  modalIncorrecto.style.display = "none";

  // Equipo actual
  const equipo = juego.equipos[juego.turnoActual];
  const posicionActual = equipo.posicion;
  const nuevaPos = posicionActual - 2;
  equipo.mover(nuevaPos - posicionActual);

  // Pasar turno
  juego.turnoActual = (juego.turnoActual + 1) % juego.equipos.length;

  // Guardar
  sessionStorage.setItem("juego", JSON.stringify(juego));

  // Volver a ruleta
  window.location.href = "ruleta.html";
});

// Caso correcto → volver normalmente
btnVolver.addEventListener("click", () => {
  juego.turnoActual = (juego.turnoActual + 1) % juego.equipos.length;
  sessionStorage.setItem("juego", JSON.stringify(juego));
  window.location.href = "ruleta.html";
});
