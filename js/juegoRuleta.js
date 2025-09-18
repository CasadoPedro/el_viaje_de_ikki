import { events, initRuleta } from "./ruleta.js";
import Juego from "./juego.js";
import { actualizarIndicadorTurno } from "./utils.js";

initRuleta();

let juegoData = JSON.parse(sessionStorage.getItem("juego"));
if (!juegoData) {
  window.location.href = "index.html";
}

let juego = Juego.fromJSON(juegoData);
console.log("Juego reconstruido:", juego);

// Elementos del DOM
const turnoDiv = document.getElementsByClassName("turnoActual")[0]; //Div donde se muestra el equipo actual

const botonRuleta = document.querySelector("#spin"); //Botón para girar la ruleta

const modalAvance = document.getElementById("modal-avance"); //Pop up del avance de la ruleta
const textoAvance = document.getElementById("texto-avance"); //Texto del pop up
const btnContinuar = document.getElementById("btn-continuar"); //Botón del pop up

const modalRecompensa = document.getElementById("modalRecompensa"); //Pop up de la recompensa
const jeroglificosGanados = document.getElementById("jeroglificosGanados"); // Lugar donde se muestran los jeroglíficos ganados
const fraseAnimadaEl = document.getElementById("fraseAnimada"); // Lugar donde se muestra la frase animada
const btnRecompensaContinuar = document.getElementById("btnRecompensaContinuar"); //Botón para continuar después de ver la recompensa

const btnAdivinar = document.getElementById("btn-adivinar"); //Botón para intentar adivinar la frase

// ----------------- Manejo de turnos -----------------

// Continua con el siguiente equipo, resetea flag intentoEnTurno y actualiza UI
function prepararTurno() {
  if (juego.equipos[juego.turnoActual].fraseAdivinada === true) {
    //Si el equipo en turno ya adivinó, pasar al siguiente
    console.log("El equipo: " + juego.equipos[juego.turnoActual].nombre +" ya adivinó su frase, pasando al siguiente equipo.");
    juego.siguienteTurno();
  }
  // Reseteamos intentoEnTurno para el equipo al inicio de su turno
  juego.equipos[juego.turnoActual].intentoEnTurno = false;
  actualizarIndicadorTurno(juego, turnoDiv);
}

// Al cargar la pantalla inicializamos el turno
prepararTurno();

// ----- Evento al finalizar de girar la ruleta -----
events.addListener("spinEnd", (sector) => {
  const equipo = juego.equipos[juego.turnoActual];
  const resultado = parseInt(sector.label, 10);
  var nuevaPos = (equipo.posicion || 0) + resultado;
  if (nuevaPos > 60) nuevaPos = 60; // seguridad
 botonRuleta.disabled = true;
  textoAvance.textContent = `Avanzar al casillero ${nuevaPos}`;
  modalAvance.style.display = "flex";
  equipo.proximaPosicion = nuevaPos;
});

// --------- Continuar después de girar ----------
btnContinuar.addEventListener("click", () => {
  modalAvance.style.display = "none";
 botonRuleta.disabled = false;

  const equipo = juego.equipos[juego.turnoActual];
  const origen = equipo.posicion || 0;
  const destino = equipo.proximaPosicion;

  // usar moverEquipo, que procesa regalos y devuelve info
  const movimiento = juego.moverEquipo(destino - origen);

  // si hubo regalos procesados, mostramos modal de recompensa con la secuencia
  if (movimiento.regalosProcesados && movimiento.regalosProcesados.length > 0) {
    // concatenar jeroglíficos obtenidos (pueden ser varios)
    const letras = movimiento.regalosProcesados.flatMap(r => r.jeroglificos);
    // frase anterior y actual son del último resultado (ya actualizado en el equipo)
    const fraseAnterior = movimiento.regalosProcesados[0]?.fraseAnterior ?? equipo.fraseDescubierta;
    const fraseNueva = movimiento.regalosProcesados[movimiento.regalosProcesados.length - 1]?.fraseActualizada ?? equipo.fraseDescubierta;

    mostrarRecompensa(fraseAnterior, fraseNueva, letras);

    btnRecompensaContinuar.onclick = () => {
      modalRecompensa.style.display = "none";
      // después de procesar recompensa, resolver casillero final
      resolverCasilleroFinal(destino, equipo);
    };
    return; // esperamos a que el jugador cierre el modal de recompensa
  }

  // si no hubo regalos, resolvemos directamente
  resolverCasilleroFinal(destino, equipo);
});

// función que resuelve el casillero (redirigir o pasar turno)
function resolverCasilleroFinal(destino, equipo) {
  if (destino >= 60) {
    adivinarFrase(); //Tiene que ser diferente a cuando se hace voluntariamente WIP
    return;
  }
  const casillaFinal = juego.tablero.getCasillero(destino);
  console.log(`El equipo ${equipo.nombre} se movió al casillero ${destino} (${casillaFinal.efecto})`);

  // Guardamos información de sesión antes de redirigir
  saveGameState(juego);

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
      window.location.href = "cuento.html";
      break;
    default:
      // Sin efecto o regalo, pasar turno
      juego.siguienteTurno();
      prepararTurno();
      saveGameState(juego);
      break;
  }
}

// ----------------- Recompensa visual (usa imágenes) -----------------
function mostrarRecompensa(fraseAnterior, fraseNueva, jeroglificos) {
  if (!modalRecompensa) return;
  // jeroglificos: array de letras (puede repetirse si se dieron varias)
  if (jeroglificos && jeroglificos.length > 0) {
    jeroglificos.forEach(l => {
      jeroglificosGanados.innerHTML += `<img src="visualAssets/jeroglificos/${l.toUpperCase()}.png" alt="${l}" class="jeroglifico-img">`;
    });
  } else {
    jeroglificosGanados.textContent = "No hay jeroglíficos nuevos.";
  }

  fraseAnimadaEl.innerHTML = convertirFraseAImagenes(fraseAnterior);
  modalRecompensa.style.display = "flex";

  animatePhrase(fraseAnterior, fraseNueva);
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

// ----------------- Botón 'Intentar adivinar' ---------------
btnAdivinar.addEventListener("click", () => {
  adivinarFrase();
});

function adivinarFrase() {
  const modalAdivinar = document.getElementById("modal-adivinar-frase");
  const inputFrase = document.getElementById("input-frase");
  const btnConfirmarFrase = document.getElementById("btn-confirmar-frase");
  const btnCancelarFrase = document.getElementById("btn-cancelar-frase");
  const equipoNombre = document.getElementById("equipo-nombre");

  const equipo = juego.equipos[juego.turnoActual];
  if (equipo.intentoEnTurno) {
    alert("Ya intentaste adivinar en este turno.");
    return;
  }

  // Show the modal and set the team name
  equipoNombre.textContent = equipo.nombre;
  modalAdivinar.style.display = "flex";

  // Confirm button logic
  btnConfirmarFrase.onclick = () => {
    const intento = inputFrase.value.trim();
    if (!intento) {
      alert("Por favor, ingresa una frase.");
      return;
    }

    modalAdivinar.style.display = "none";
    inputFrase.value = ""; // Clear the input field

    const resultado = juego.intentarAdivinar(intento);

    if (resultado.success) {
      mostrarFelicidadesModal(equipo, resultado);
    } else {
      mostrarErrorModal(equipo, resultado);
    }
  };

  // Cancel button logic
  btnCancelarFrase.onclick = () => {
    modalAdivinar.style.display = "none";
    inputFrase.value = ""; // Clear the input field
  };
}

function mostrarFelicidadesModal(equipo, resultado) {
  const modalFelicidades = document.getElementById("modal-frase-adivinada");
  const tituloFelicidades = document.getElementById("tituloFelicidades");
  const parrafoFelicidades = document.getElementById("parrafoFelicidades");
  const btnFraseAdivinadaContinuar = document.getElementById("btn-frase-adivinada-continuar");

  modalFelicidades.style.display = "flex";
  tituloFelicidades.textContent = `¡Felicidades ${equipo.nombre}!!`;
  parrafoFelicidades.textContent =
    "HAN LLEGADO AL CORAZÓN DE IKKI \n AHORA SON DEFENSORES DEL CORAZÓN VALIENTE \nTIENEN EL DEBER DE CUIDARLO Y PROTEGERLO\n CONTINÚEN AYUDANDO A SUS COMPAÑEROS A LLEGAR";

  btnFraseAdivinadaContinuar.onclick = () => {
    modalFelicidades.style.display = "none";
    saveGameState(juego);

    if (resultado.todos) {
      mostrarFinDelJuegoModal();
    } else {
      juego.siguienteTurno();
      prepararTurno();
    }
  };
}

function mostrarErrorModal(equipo, resultado) {
  const modalFelicidades = document.getElementById("modal-frase-adivinada");
  const tituloFelicidades = document.getElementById("tituloFelicidades");
  const parrafoFelicidades = document.getElementById("parrafoFelicidades");
  const btnFraseAdivinadaContinuar = document.getElementById("btn-frase-adivinada-continuar");

  modalFelicidades.style.display = "flex";
  tituloFelicidades.textContent = `Lo siento ${equipo.nombre}`;
  parrafoFelicidades.textContent = "La frase es incorrecta.\n Retrocedes 2 casilleros.";

  btnFraseAdivinadaContinuar.onclick = () => {
    modalFelicidades.style.display = "none";
    saveGameState(juego);
    juego.siguienteTurno();
    prepararTurno();
    window.location.href = "ruleta.html";
  };
}

function mostrarFinDelJuegoModal() {
  const modalFinal = document.getElementById("modal-final-juego");
  const btnFinalContinuar = document.getElementById("btn-final-juego");

  modalFinal.style.display = "flex";
  btnFinalContinuar.onclick = () => {
    sessionStorage.removeItem("juego");
    window.location.href = "index.html";
  };
}

// Guarda el estado del juego en sessionStorage
function saveGameState(juego) {
  sessionStorage.setItem("juego", JSON.stringify(juego));
}

// Animación de frase (recursiva con requestAnimationFrame)
function animatePhrase(fraseAnterior, fraseNueva, i = 0) {
  if (i >= fraseNueva.length) return;

  let actual = "";
  for (let j = 0; j < fraseNueva.length; j++) {
    actual += (j <= i) ? letraAImagen(fraseNueva[j]) : letraAImagen(fraseAnterior[j] || " ");
  }
  fraseAnimadaEl.innerHTML = actual;

  requestAnimationFrame(() => animatePhrase(fraseAnterior, fraseNueva, i + 1));
}