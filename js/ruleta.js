  const sectors = [
    { color: "#A19C9C", text: "#333333", label: "1" },
    { color: "#EDEDED", text: "#333333", label: "2" },
    { color: "#A19C9C", text: "#333333", label: "3" },
    { color: "#EDEDED", text: "#333333", label: "4" },
    { color: "#A19C9C", text: "#333333", label: "5" },
    { color: "#EDEDED", text: "#333333", label: "6" },
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
  
    spinEl.textContent = !angVel ? "GIRAR" : sector.label;
    spinEl.style.background = sector.color;
    spinEl.style.color = sector.text;
  }
  
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
  const turnoDiv = document.getElementById("turnoActual");
  
  // Función para actualizar el indicador
  function actualizarTurno() {
    const equipo = juego.equipos[juego.turnoActual];
    turnoDiv.textContent = `Turno: ${equipo.nombre}`;
    // Asignamos el color del equipo al fondo
    turnoDiv.style.backgroundColor = equipo.color || "#333333"; // fallback si no tiene color
  }
  // Llamamos al principio
  actualizarTurno();
  
  events.addListener("spinEnd", (sector) => {
    console.log(`Woop! You won ${sector.label}`);
  });