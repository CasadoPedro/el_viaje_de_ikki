export const sectors = [
  { color: "#ffffff", text: "#000000", label: "1" },
  { color: "#000000", text: "#FFFFFF", label: "2" },
  { color: "#ffffff", text: "#000000", label: "3" },
  { color: "#000000", text: "#FFFFFF", label: "4" },
  { color: "#ffffff", text: "#000000", label: "5" },
  { color: "#000000", text: "#FFFFFF", label: "6" },
];

export const events = {
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

const friction = 0.98;
let angVel = 0;
let ang = 0;
let spinButtonClicked = false;

const getIndex = () => Math.floor(tot - (ang / TAU) * tot) % tot;

function drawSector(sector, i) {
  const ang = arc * i;
  ctx.save();

  ctx.beginPath();
  ctx.fillStyle = sector.color;
  ctx.moveTo(rad, rad);
  ctx.arc(rad, rad, rad, ang, ang + arc);
  ctx.lineTo(rad, rad);
  ctx.fill();

  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.translate(rad, rad);
  ctx.rotate(ang + arc / 2);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = sector.text;
  ctx.font = "bold 40px 'Montserrat', sans-serif";
  ctx.fillText(sector.label, rad / 1.3, 0);
  ctx.restore();
}

function rotate() {
  const sector = sectors[getIndex()];
  ctx.canvas.style.transform = `rotate(${ang - PI / 2}rad)`;

  const spinText = document.getElementById("spinText");
  spinText.textContent = !angVel ? "GIRAR" : sector.label;
}

let currentIndex = getIndex();
const wheelSound = new Audio("sounds/spinSound.mp3");

function frame() {
  if (!angVel && spinButtonClicked) {
    const finalSector = sectors[getIndex()];
    events.fire("spinEnd", finalSector);
    spinButtonClicked = false;
    return;
  }

  angVel *= friction;
  if (angVel < 0.002) angVel = 0;
  ang += angVel;
  ang %= TAU;
  rotate();

  const newIndex = getIndex();
  if (newIndex !== currentIndex) {
    wheelSound.currentTime = 0;
    wheelSound.play();
    currentIndex = newIndex;
  }
}

function engine() {
  frame();
  requestAnimationFrame(engine);
}

export function initRuleta() {
  sectors.forEach(drawSector);
  rotate();
  engine();
  spinEl.addEventListener("click", () => {
    if (!angVel) angVel = rand(0.25, 0.45);
    spinButtonClicked = true;
  });
}
