import { events, initRuleta } from "./ruleta.js";
import Juego from "./juego.js";
import { actualizarIndicadorTurno } from "./utils.js";
import { updateMusicForZone } from "./musica.js";

// Inicializar la ruleta
initRuleta();

// Recuperar datos del juego desde sessionStorage
const datosJuego = JSON.parse(sessionStorage.getItem("juego"));
if (!datosJuego) {
  window.location.href = "index.html";
}

const juego = Juego.fromJSON(datosJuego);
console.log("Juego reconstruido:", juego);

// Elementos del DOM centralizados
const ELEMENTOS_DOM = {
  turnoActual: document.querySelector(".turnoActual"),
  botonRuleta: document.querySelector("#spin"),
  modalAvance: document.querySelector("#modal-avance"),
  textoAvance: document.querySelector("#texto-avance"),
  botonContinuar: document.querySelector("#btn-continuar"),
  modalRecompensa: document.querySelector("#modalRecompensa"),
  jeroglificosGanados: document.querySelector("#jeroglificosGanados"),
  fraseAnimada: document.querySelector("#fraseAnimada"),
  botonRecompensaContinuar: document.querySelector("#btnRecompensaContinuar"),
  botonAdivinar: document.querySelector("#btn-adivinar"),
  modalAdivinarFrase: document.querySelector("#modal-adivinar-frase"),
  inputFrase: document.querySelector("#input-frase"),
  botonConfirmarFrase: document.querySelector("#btn-confirmar-frase"),
  botonCancelarFrase: document.querySelector("#btn-cancelar-frase"),
  equipoNombre: document.querySelector("#equipo-nombre"),
  modalFelicidades: document.querySelector("#modal-frase-adivinada"),
  tituloFelicidades: document.querySelector("#tituloFelicidades"),
  parrafoFelicidades: document.querySelector("#parrafoFelicidades"),
  botonFelicidadesContinuar: document.querySelector("#btn-frase-adivinada-continuar"),
  modalFinalJuego: document.querySelector("#modal-final-juego"),
  botonFinalJuego: document.querySelector("#btn-final-juego"),
};

// Guardar el estado del juego en sessionStorage
function guardarEstadoJuego() {
  sessionStorage.setItem("juego", JSON.stringify(juego));
}

// Preparar el turno del equipo actual
function prepararTurno() {
  const equipoActual = juego.equipos[juego.turnoActual];
  if (equipoActual.fraseAdivinada) {
    console.log(`El equipo ${equipoActual.nombre} ya adivinó su frase. Pasando al siguiente equipo.`);
    juego.siguienteTurno();
  }
  equipoActual.intentoEnTurno = false;
  // Obtener la zona actual del equipo
  const posicion = equipoActual.posicion || 0;
  const zonaActual = juego.tablero.zonas[juego.tablero.obtenerIndiceZona(posicion)]?.nombre || "Inicio";

  // Actualizar la música para la zona actual
  updateMusicForZone(zonaActual);

  actualizarIndicadorTurno(juego, ELEMENTOS_DOM.turnoActual);
}

// Inicializar el turno al cargar la página
prepararTurno();

// Evento al finalizar de girar la ruleta
events.addListener("spinEnd", manejarFinRuleta);

function manejarFinRuleta(sector) {
  const equipo = juego.equipos[juego.turnoActual];
  const resultado = parseInt(sector.label, 10);
  const nuevaPosicion = Math.min((equipo.posicion || 0) + resultado, 60);

  ELEMENTOS_DOM.botonRuleta.disabled = true;
  ELEMENTOS_DOM.textoAvance.textContent = `Avanzar al casillero ${nuevaPosicion}`;
  ELEMENTOS_DOM.modalAvance.style.display = "flex";
  equipo.proximaPosicion = nuevaPosicion;
}

// Continuar después de girar la ruleta
ELEMENTOS_DOM.botonContinuar.addEventListener("click", manejarContinuar);

function manejarContinuar() {
  ELEMENTOS_DOM.modalAvance.style.display = "none";
  ELEMENTOS_DOM.botonRuleta.disabled = false;

  const equipo = juego.equipos[juego.turnoActual];
  const origen = equipo.posicion || 0;
  const destino = equipo.proximaPosicion;

  const movimiento = juego.moverEquipo(destino - origen);

  if (movimiento.regalosProcesados?.length > 0) {
    manejarRecompensa(movimiento, equipo, destino);
    return;
  }

  resolverCasilleroFinal(destino, equipo);
}

function manejarRecompensa(movimiento, equipo, destino) {
  const letras = movimiento.regalosProcesados.flatMap(r => r.jeroglificos);
  const fraseAnterior = movimiento.regalosProcesados[0]?.fraseAnterior ?? equipo.fraseDescubierta;
  const fraseNueva = movimiento.regalosProcesados.at(-1)?.fraseActualizada ?? equipo.fraseDescubierta;

  mostrarRecompensa(fraseAnterior, fraseNueva, letras);

  ELEMENTOS_DOM.botonRecompensaContinuar.onclick = () => {
    ELEMENTOS_DOM.modalRecompensa.style.display = "none";
    resolverCasilleroFinal(destino, equipo);
  };
}

function resolverCasilleroFinal(destino, equipo) {
  if (destino >= 60) {
    adivinarFrase();
    return;
  }

  const casillaFinal = juego.tablero.getCasillero(destino);
  console.log(`El equipo ${equipo.nombre} se movió al casillero ${destino} (${casillaFinal.efecto})`);

  guardarEstadoJuego();

  const redirecciones = {
    "Emoción": "emocion.html",
    "Dialogo": "dialogo.html",
    "Debate": "debate.html",
    "Cuento": "cuento.html",
  };

  if (redirecciones[casillaFinal.efecto]) {
    window.location.href = redirecciones[casillaFinal.efecto];
  } else {
    juego.siguienteTurno();
    prepararTurno();
    guardarEstadoJuego();
  }
}

// Mostrar recompensa visual
function mostrarRecompensa(fraseAnterior, fraseNueva, jeroglificos) {
  if (!ELEMENTOS_DOM.modalRecompensa) return;

  ELEMENTOS_DOM.jeroglificosGanados.innerHTML = jeroglificos.length
    ? jeroglificos.map(l => `<img src="visualAssets/jeroglificos/${l.toUpperCase()}.png" alt="${l}" class="jeroglifico-img">`).join("")
    : "No hay jeroglíficos nuevos.";

  ELEMENTOS_DOM.fraseAnimada.innerHTML = convertirFraseAImagenes(fraseAnterior);
  ELEMENTOS_DOM.modalRecompensa.style.display = "flex";

  animarFrase(fraseAnterior, fraseNueva);
}

function convertirFraseAImagenes(frase) {
  return frase.split("").map(letraAImagen).join("");
}

function letraAImagen(char) {
  if (/[A-Za-zÁÉÍÓÚÑáéíóúñ]/.test(char)) {
    return `<img src="visualAssets/jeroglificos/${char.toUpperCase()}.png" alt="${char}" class="jeroglifico-frase">`;
  }
  return char;
}

// Animar frase (recursiva con requestAnimationFrame)
function animarFrase(fraseAnterior, fraseNueva, i = 0) {
  if (i >= fraseNueva.length) return;

  let actual = "";
  for (let j = 0; j < fraseNueva.length; j++) {
    actual += (j <= i) ? letraAImagen(fraseNueva[j]) : letraAImagen(fraseAnterior[j] || " ");
  }
  ELEMENTOS_DOM.fraseAnimada.innerHTML = actual;

  requestAnimationFrame(() => animarFrase(fraseAnterior, fraseNueva, i + 1));
}

// Intentar adivinar la frase
ELEMENTOS_DOM.botonAdivinar.addEventListener("click", adivinarFrase);

function adivinarFrase() {
  const equipo = juego.equipos[juego.turnoActual];
  if (equipo.intentoEnTurno) {
    alert("Ya intentaste adivinar en este turno.");
    return;
  }

  
  ELEMENTOS_DOM.equipoNombre.textContent = equipo.nombre;
  ELEMENTOS_DOM.modalAdivinarFrase.style.display = "flex";
  
  // Enfocar el campo de entrada al abrir el modal
  ELEMENTOS_DOM.inputFrase.focus();

  // Event listener para presionar Enter o confirmar
  ELEMENTOS_DOM.inputFrase.onkeydown = (event) => {
    if (event.key === "Enter") {
      ELEMENTOS_DOM.botonConfirmarFrase.click();
    }
  };
  ELEMENTOS_DOM.botonConfirmarFrase.onclick = () => {
    const intento = ELEMENTOS_DOM.inputFrase.value.trim();
    if (!intento) {
      ELEMENTOS_DOM.inputFrase.classList.add("input-error");
      mostrarIndicadorError("Por favor, ingresa una frase.");
      return;
    }

    // Resetea el estado de error
    ELEMENTOS_DOM.inputFrase.classList.remove("input-error");
    ocultarIndicadorError();

    ELEMENTOS_DOM.modalAdivinarFrase.style.display = "none";
    ELEMENTOS_DOM.inputFrase.value = "";

    const resultado = juego.intentarAdivinar(intento);

    if (resultado.success) {
      mostrarModalFelicidades(equipo, resultado);
    } else {
      mostrarModalError(equipo, resultado);
    }
  };

  ELEMENTOS_DOM.botonCancelarFrase.onclick = () => {
    // Resetea el estado de error
    ELEMENTOS_DOM.inputFrase.classList.remove("input-error");
    ocultarIndicadorError();
    ELEMENTOS_DOM.modalAdivinarFrase.style.display = "none";
    ELEMENTOS_DOM.inputFrase.value = "";
  };
}

function mostrarModalFelicidades(equipo, resultado) {
  ELEMENTOS_DOM.modalFelicidades.style.display = "flex";
  ELEMENTOS_DOM.tituloFelicidades.textContent = `¡Felicidades ${equipo.nombre}!!`;
  ELEMENTOS_DOM.parrafoFelicidades.textContent =
    "HAN LLEGADO AL CORAZÓN DE IKKI \n AHORA SON DEFENSORES DEL CORAZÓN VALIENTE \nTIENEN EL DEBER DE CUIDARLO Y PROTEGERLO\n CONTINÚEN AYUDANDO A SUS COMPAÑEROS A LLEGAR";

  ELEMENTOS_DOM.botonFelicidadesContinuar.onclick = () => {
    ELEMENTOS_DOM.modalFelicidades.style.display = "none";
    guardarEstadoJuego();

    if (resultado.todos) {
      mostrarModalFinDelJuego();
    } else {
      juego.siguienteTurno();
      prepararTurno();
    }
  };
}

function mostrarModalError(equipo) {
  ELEMENTOS_DOM.modalFelicidades.style.display = "flex";
  ELEMENTOS_DOM.tituloFelicidades.textContent = `Lo siento ${equipo.nombre}`;
  ELEMENTOS_DOM.parrafoFelicidades.textContent = "La frase es incorrecta.\n Retrocedes 2 casilleros.";

  ELEMENTOS_DOM.botonFelicidadesContinuar.onclick = () => {
    ELEMENTOS_DOM.modalFelicidades.style.display = "none";
    guardarEstadoJuego();
    juego.siguienteTurno();
    prepararTurno();
    window.location.href = "ruleta.html";
  };
}

function mostrarModalFinDelJuego() {
  ELEMENTOS_DOM.modalFinalJuego.style.display = "flex";
  ELEMENTOS_DOM.botonFinalJuego.onclick = () => {
    sessionStorage.removeItem("juego");
    window.location.href = "index.html";
  };
}

function mostrarIndicadorError(mensaje) {
  let errorElemento = document.querySelector("#input-error-mensaje");
  if (!errorElemento) {
    errorElemento = document.createElement("p");
    errorElemento.id = "input-error-mensaje";
    errorElemento.className = "error-mensaje";
    // Insertar el mensaje de error después del campo de entrada
    ELEMENTOS_DOM.inputFrase.insertAdjacentElement("afterend", errorElemento);
  }
  errorElemento.textContent = mensaje;
}

function ocultarIndicadorError() {
  const errorElemento = document.querySelector("#input-error-mensaje");
  if (errorElemento) {
    errorElemento.remove();
  }
}