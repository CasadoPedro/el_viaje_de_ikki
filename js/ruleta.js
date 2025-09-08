const sectors = [
  { color: "#ffffff", text: "#000000", label: "1" },
  { color: "#000000", text: "#FFFFFF", label: "2" },
  { color: "#ffffff", text: "#000000", label: "3" },
  { color: "#000000", text: "#FFFFFF", label: "4" },
  { color: "#ffffff", text: "#000000", label: "5" },
  { color: "#000000", text: "#FFFFFF", label: "6" },
];

const events = {
  listeners: {},
  addListener: function (eventName, fn) {
    this.listeners[eventName] = this.listeners[eventName] || [];
    this.listeners[eventName].push(fn);
  },
  fire: function (eventName, ...args) {
    if (this.listeners[eventName]) {
      for (let fn of this.listeners[eventName]) {
        fn(...args);
      }
    }
  },
};

const rand = (m, M) => Math.random() * (M - m) + m;
const tot = sectors.length;
const spinEl = document.querySelector("#spin");
const ctx = document.querySelector("#wheel").getContext("2d");
const dia = ctx.canvas.width;
const rad = dia / 2;
const PI = Math.PI;
const TAU = 2 * PI;
const arc = TAU / sectors.length;

const friction = 0.98; // 0.995=soft, 0.99=mid, 0.98=hard
let angVel = 0; // Angular velocity
let ang = 0; // Angle in radians

let spinButtonClicked = false;

const getIndex = () => Math.floor(tot - (ang / TAU) * tot) % tot;

function drawSector(sector, i) {
  const ang = arc * i;
  ctx.save();

  // COLOR
  ctx.beginPath();
  ctx.fillStyle = sector.color;
  ctx.moveTo(rad, rad);
  ctx.arc(rad, rad, rad, ang, ang + arc);
  ctx.lineTo(rad, rad);
  ctx.fill();

  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;
  ctx.stroke();

  // TEXT
  ctx.translate(rad, rad);
  ctx.rotate(ang + arc / 2);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = sector.text;
  ctx.font = "bold 40px 'Montserrat', sans-serif";
  ctx.fillText(sector.label, rad / 1.3, 0);

  //

  ctx.restore();
}

function rotate() {
  const sector = sectors[getIndex()];
  ctx.canvas.style.transform = `rotate(${ang - PI / 2}rad)`;

  // Escribimos texto en el botón de girar
  const spinText = document.getElementById("spinText");
  spinText.textContent = !angVel ? "GIRAR" : sector.label;
}
let currentIndex = getIndex();
const wheelSound = new Audio("sounds/spinSound.mp3");
function frame() {
  // Fire an event after the wheel has stopped spinning
  if (!angVel && spinButtonClicked) {
    const finalSector = sectors[getIndex()];
    events.fire("spinEnd", finalSector);
    spinButtonClicked = false; // reset the flag
    return;
  }

  angVel *= friction; // Decrement velocity by friction
  if (angVel < 0.002) angVel = 0; // Bring to stop
  ang += angVel; // Update angle
  ang %= TAU; // Normalize angle
  rotate();
  // Detectar cambio de sector para el sonido
  const newIndex = getIndex();
  if (newIndex !== currentIndex) {
    wheelSound.currentTime = 0; // reinicia el sonido
    wheelSound.play();
    currentIndex = newIndex;
  }
}

function engine() {
  frame();
  requestAnimationFrame(engine);
}

function init() {
  sectors.forEach(drawSector);
  rotate(); // Initial rotation
  engine(); // Start engine
  spinEl.addEventListener("click", () => {
    if (!angVel) angVel = rand(0.25, 0.45);
    spinButtonClicked = true;
  });
}

init();

import Juego from "./juego.js";
// Recuperamos el juego de sessionStorage
let juegoData = JSON.parse(sessionStorage.getItem("juego"));
if (!juegoData) {
  // Si no hay juego, redirigimos al index (seguridad)
  window.location.href = "index.html";
}
let juego = Juego.fromJSON(juegoData);
console.log("Juego reconstruido:", juego);
const turnoDiv = document.getElementsByClassName("turnoActual")[0];
// Función para actualizar el indicador
import { actualizarTurno } from "./utils.js";

// Llamamos al principio después de reconstruir el juego
actualizarTurno(juego, turnoDiv);


const modal = document.getElementById("modal-avance");
const textoAvance = document.getElementById("texto-avance");
const btnContinuar = document.getElementById("btn-continuar");

events.addListener("spinEnd", (sector) => {

  // Equipo actual
  const equipo = juego.equipos[juego.turnoActual];

  // Posición final tentativa
  const resultado = parseInt(sector.label, 10);
  const nuevaPos = (equipo.posicion || 0) + resultado;

  // Bloqueamos el spin hasta continuar
  spinEl.disabled = true;

  // Mostramos modal
  textoAvance.textContent = `Avanzar al casillero ${nuevaPos}`;
  modal.style.display = "flex";

  // Guardamos en el equipo la próxima posición (sin mover todavía)
  equipo.proximaPosicion = nuevaPos;
});

btnContinuar.addEventListener("click", () => {
  modal.style.display = "none";
  spinEl.disabled = false;

  // Equipo actual
  const equipo = juego.equipos[juego.turnoActual];

  const origen = equipo.posicion || 0;
  const destino = equipo.proximaPosicion;

  // Mover al equipo
  equipo.mover(destino - origen);


  // Referencias al modal
  const modalRecompensa = document.getElementById("modalRecompensa");
  const btnRecompensaContinuar = document.getElementById("btnRecompensaContinuar");

  if (juego.tablero.hayRegaloEntre(origen, destino)) {
    const { fraseAnterior, fraseActualizada, jeroglificos } = equipo.revelarJeroglifico();
  
    if (fraseAnterior === fraseActualizada) {
      alert("Pasaste por una casilla de Regalo, pero ya no quedan jeroglíficos por revelar.");
    } else {
      mostrarRecompensa(fraseAnterior, fraseActualizada, jeroglificos);
  
      btnRecompensaContinuar.onclick = () => {
        modalRecompensa.style.display = "none";
        spinEl.disabled = false;
        resolverCasillaFinal(destino, equipo);
      };
  
      return; // detenemos flujo hasta que presione continuar
    }
  }
  
  // Si no hubo regalo, resolvemos directamente
  resolverCasillaFinal(destino, equipo);


  // ----------------------
  // Función auxiliar ordenada
  // ----------------------
  function resolverCasillaFinal(destino, equipo) {
    const casillaFinal = juego.tablero.casillas[destino - 1]; // -1 porque es 0-indexed
    console.log(`El equipo ${equipo.nombre} se movió del casillero ${origen} al ${destino}`);
    console.log(`Casillero final:`, casillaFinal);
    console.log(`El equipo ${equipo.nombre} cayó en un casillero de tipo: ${casillaFinal.efecto}`);

    // Guardamos estado antes de cualquier redirección o cambio de turno
    sessionStorage.setItem("juego", JSON.stringify(juego));

    switch (casillaFinal.efecto) {
      case "Emoción":
        window.location.href = "emocion.html";
        break;
      case "Dialogo":
        window.location.href = "dialogo.html";
        break;
      case "Debate":
        window.location.href = "debate.html";
        break;
      case "Cuento":
      case "Regalo":
        juego.turnoActual = (juego.turnoActual + 1) % juego.equipos.length;
        actualizarTurno(juego, turnoDiv);
        sessionStorage.setItem("juego", JSON.stringify(juego));
        break;
      case "Sin efecto":
        juego.turnoActual = (juego.turnoActual + 1) % juego.equipos.length;
        actualizarTurno(juego, turnoDiv);
        sessionStorage.setItem("juego", JSON.stringify(juego));
        break;
    }
  }
  function mostrarRecompensa(fraseAnterior, fraseNueva, jeroglificos) {
    const jeroglificosGanados = document.getElementById("jeroglificosGanados");
    const fraseAnimada = document.getElementById("fraseAnimada");
  
    // --- Mostrar jeroglíficos ganados ---
    if (jeroglificos && jeroglificos.length > 0) {
      jeroglificosGanados.innerHTML =
        "Ganaste: " +
        jeroglificos
          .map(
            (l) =>
              `<img src="visualAssets/jeroglificos/${l.toUpperCase()}.png" alt="${l}" class="jeroglifico-img">`
          )
          .join(" ");
    } else {
      jeroglificosGanados.textContent = "No hay jeroglíficos nuevos.";
    }
  
    // --- Mostrar frase con imágenes ---
    fraseAnimada.innerHTML = convertirFraseAImagenes(fraseAnterior);
    modalRecompensa.style.display = "flex";
  
    let i = 0;
    const intervalo = setInterval(() => {
      if (i >= fraseNueva.length) {
        clearInterval(intervalo);
        return;
      }
  
      // Construir frase parcialmente descubierta
      let actual = "";
      for (let j = 0; j < fraseNueva.length; j++) {
        if (j <= i) {
          actual += letraAImagen(fraseNueva[j]);
        } else {
          actual += letraAImagen(fraseAnterior[j] || " ");
        }
      }
  
      fraseAnimada.innerHTML = actual;
      i++;
    }, 200);
  }
  
  // Convierte toda una frase a imágenes
  function convertirFraseAImagenes(frase) {
    return frase
      .split("")
      .map((c) => letraAImagen(c))
      .join("");
  }
  
  // Convierte un carácter a imagen si es letra, o lo deja como está si no
  function letraAImagen(char) {
    if (/[A-Za-zÁÉÍÓÚÑ]/.test(char)) {
      return `<img src="visualAssets/jeroglificos/${char.toUpperCase()}.png" alt="${char}" class="jeroglifico-frase">`;
    }
    return char; // espacios, signos, etc.
  }
  
  
});  

