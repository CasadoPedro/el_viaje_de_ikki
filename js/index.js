import Juego from "./juego.js";

//   Elementos del DOM
const select = document.getElementById("equipoSelect");
const btn = document.getElementById("startBtn");

const splash = document.getElementById("splash");
const mainContent = document.getElementById("mainContent");

// Mostrar logo y mensaje, luego ocultar al hacer clic
splash.addEventListener("click", () => {
  splash.style.display = "none";
  mainContent.style.display = "flex";
});
// Event Listener para el select
select.addEventListener("change", () => {
  btn.disabled = select.value === "";
});

btn.addEventListener("click", () => {
  const cantidad = parseInt(select.value, 10);

  // 1. Crear objeto Juego
  const juego = new Juego(cantidad);

  // 2. Guardarlo en sessionStorage (serializado)
  sessionStorage.setItem("juego", JSON.stringify(juego));

  // 3. Ir a la siguiente pantalla
  window.location.href = "nivel.html";
});
