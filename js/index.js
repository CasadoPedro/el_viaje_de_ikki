// index.js
import Juego from "./juego.js";

const select = document.getElementById("equipoSelect");
const btn = document.getElementById("startBtn");

// Mostrar logo unos segundos y luego el contenido
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("splash").style.display = "none";
    document.getElementById("mainContent").style.display = "flex";
  }, 4000); // 4 segundos
});

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
