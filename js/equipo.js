// equipo.js

class Equipo {
  constructor(nombre, frase) {
    this.nombre = nombre;              
    this.frase = frase;                         
    this.fraseDescubierta = this.inicializarFrase(frase);  // frase con letras ocultas
    this.posicion = 0; // posición en el tablero (0 = inicio)
    this.llegoAlCorazon = false;  // si ya llegó al corazón de Ikki
    this.jeroglificos = []; // jeroglificos ya revelados
    this.regalosTomados = []; // números de casilleros de regalo que ya recibió
    this.fraseAdivinada = false; // si ya adivinó su frase 
    this.intentoEnTurno = false; // controla intento de adivinar por turno                  
  }

  inicializarFrase(frase) {
    return frase.replace(/[A-Za-zÁÉÍÓÚÑ]/gi, "_");
  }

  // Obtiene una letra aún no revelada de la frase
  obtenerJeroglificoDisponible() {
    // Tomamos las letras tal cual aparecen (con tildes incluidas)
    const letrasUnicas = [
      ...new Set(this.frase.match(/[A-Za-zÁÉÍÓÚÑáéíóúñ]/g))
    ].map(l => l.toUpperCase());

    const disponibles = letrasUnicas.filter(l => !this.jeroglificos.includes(l));
    if (disponibles.length === 0) return null;

    const indice = Math.floor(Math.random() * disponibles.length);
    return disponibles[indice];
  }

  // Revela uno o más jeroglíficos según la posición
  revelarJeroglifico() {
    const cantidad = this.posicion < 30 ? 1 : 2;  // regla
    const revelados = [];

    let fraseAnterior = this.fraseDescubierta;
    let fraseActualizada = this.fraseDescubierta;

    for (let i = 0; i < cantidad; i++) {
      const jeroglifico = this.obtenerJeroglificoDisponible();
      if (!jeroglifico) break;

      this.jeroglificos.push(jeroglifico);

      let nueva = "";
      for (let j = 0; j < this.frase.length; j++) {
        const original = this.frase[j];
        const originalUpper = original.toUpperCase();

        if (
          originalUpper === jeroglifico ||
          this.jeroglificos.includes(originalUpper)
        ) {
          nueva += original;
        } else if (/[A-Za-zÁÉÍÓÚÑáéíóúñ]/.test(original)) {
          nueva += "_";
        } else {
          nueva += original;
        }
      }

      fraseActualizada = nueva;
      this.fraseDescubierta = nueva;
      revelados.push(jeroglifico);
    }

    return { fraseAnterior, fraseActualizada, jeroglificos: revelados };
  }

  static fromJSON(data) {
    let equipo = new Equipo(data.nombre, data.frase);
    equipo.posicion = data.posicion ?? 0;
    equipo.llegoAlCorazon = data.llegoAlCorazon ?? false;
    equipo.fraseDescubierta = data.fraseDescubierta ?? equipo.inicializarFrase(equipo.frase);
    equipo.color = data.color;
    equipo.jeroglificos = data.jeroglificos ?? [];
    equipo.regalosTomados = data.regalosTomados ?? [];
    equipo.fraseAdivinada = data.fraseAdivinada ?? false;
    equipo.intentoEnTurno = data.intentoEnTurno ?? false;
    return equipo;
  }
}

export default Equipo;
