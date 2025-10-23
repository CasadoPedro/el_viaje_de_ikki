// Definimos los sectores de la ruleta, cada uno con un color de fondo, color de texto y etiqueta.
export const sectors = [
  { color: "#ffffff", text: "#000000", label: "1" },
  { color: "#000000", text: "#FFFFFF", label: "2" },
  { color: "#ffffff", text: "#000000", label: "3" },
  { color: "#000000", text: "#FFFFFF", label: "4" },
  { color: "#ffffff", text: "#000000", label: "5" },
  { color: "#000000", text: "#FFFFFF", label: "6" },
];

// Sistema de eventos personalizado para manejar listeners y disparar eventos.
export const events = {
  listeners: {},

  // Agrega un listener para un evento específico.
  addListener: function (eventName, fn) {
    this.listeners[eventName] = this.listeners[eventName] || [];
    this.listeners[eventName].push(fn);
  },

  // Dispara un evento y ejecuta todos los listeners asociados.
  fire: function (eventName, ...args) {
    if (this.listeners[eventName]) {
      for (let fn of this.listeners[eventName]) {
        fn(...args);
      }
    }
  },
};

// Función para generar un número aleatorio entre dos valores.
const rand = (m, M) => Math.random() * (M - m) + m;

const tot = sectors.length;

const spinEl = document.querySelector("#spin");
const ctx = document.querySelector("#wheel").getContext("2d");

// Dimensiones del canvas y constantes matemáticas.
const dia = ctx.canvas.width; // Diámetro del canvas.
const rad = dia / 2; // Radio del canvas.
const PI = Math.PI; // Valor de π.
const TAU = 2 * PI; // Valor de 2π (una vuelta completa).
const arc = TAU / sectors.length; // Ángulo de cada sector.

// Variables para manejar la física de la ruleta.
const friction = 0.98; // Fricción para reducir la velocidad angular.
let angVel = 0; // Velocidad angular inicial.
let ang = 0; // Ángulo actual de la ruleta.
let spinButtonClicked = false; // Indica si se ha hecho clic en el botón de girar.

// Calcula el índice del sector actual basado en el ángulo.
const getIndex = () => Math.floor(tot - (ang / TAU) * tot) % tot;

// Dibuja un sector de la ruleta en el canvas.
function drawSector(sector, i) {
  const ang = arc * i; // Calcula el ángulo inicial del sector.
  ctx.save();

  // Dibuja el sector como un arco.
  ctx.beginPath();
  ctx.fillStyle = sector.color;
  ctx.moveTo(rad, rad);
  ctx.arc(rad, rad, rad, ang, ang + arc);
  ctx.lineTo(rad, rad);
  ctx.fill();

  // Dibuja el borde del sector.
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;
  ctx.stroke();

  // Dibuja el texto del sector.
  ctx.translate(rad, rad);
  ctx.rotate(ang + arc / 2);
  ctx.rotate(Math.PI / 2);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = sector.text;
  ctx.font = "bold 40px 'Montserrat', sans-serif";
  ctx.fillText(sector.label, 0, -rad / 1.3); // El texto se posiciona hacia el centro del sector.
  ctx.restore();
}

// Rota la ruleta y actualiza el texto del botón.
function rotate() {
  const sector = sectors[getIndex()]; // Obtiene el sector actual.
  ctx.canvas.style.transform = `rotate(${ang - PI / 2}rad)`; // Aplica la rotación al canvas.

  const spinText = document.getElementById("spinText");
  spinText.textContent = !angVel ? "GIRAR" : sector.label; // Muestra "GIRAR" o la etiqueta del sector.
}

// Variables para manejar el índice actual y el sonido de la ruleta.
let currentIndex = getIndex();
const wheelSound = new Audio("sounds/spinSound.mp3");

// Función que maneja cada frame de la animación.
function frame() {
  // Si la velocidad angular es 0 y se hizo clic, dispara el evento de fin de giro.
  if (!angVel && spinButtonClicked) {
    const finalSector = sectors[getIndex()];
    events.fire("spinEnd", finalSector); // Dispara el evento "spinEnd".
    spinButtonClicked = false;
    return;
  }

  // Aplica fricción y actualiza el ángulo.
  angVel *= friction;
  if (angVel < 0.002) angVel = 0; // Detiene la ruleta si la velocidad es muy baja.
  ang += angVel;
  ang %= TAU; // Asegura que el ángulo esté dentro de 0 y 2π.
  rotate();

  // Reproduce el sonido si el índice cambia.
  const newIndex = getIndex();
  if (newIndex !== currentIndex) {
    wheelSound.currentTime = 0;
    wheelSound.play();
    currentIndex = newIndex;
  }
}

// Inicia el motor de animación.
function engine() {
  frame();
  requestAnimationFrame(engine); // Llama a la función en el siguiente frame.
}

// Inicializa la ruleta.
export function initRuleta() {
  sectors.forEach(drawSector); // Dibuja todos los sectores.
  rotate(); // Ajusta la posición inicial.
  engine(); // Inicia la animación.

  // Agrega el evento de clic al botón de girar.
  spinEl.addEventListener("click", () => {
    if (!angVel) angVel = rand(0.25, 0.45); // Establece una velocidad angular aleatoria.
    spinButtonClicked = true; // Marca que se hizo clic en el botón.
  });
}