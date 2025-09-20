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
    return frase.replace(/\p{L}/gu, "_");
  }

  // Obtiene una letra aún no revelada de la frase
  obtenerJeroglificoDisponible() {
    // Obtener todas las letras únicas de la frase
    const letrasUnicas = [...new Set(this.frase.match(/\p{L}/gu))].map(l => l.toUpperCase());
    // Filtrar las letras que aún no han sido reveladas
    const disponibles = letrasUnicas.filter(l => !this.jeroglificos.includes(l));
  
    if (disponibles.length === 0) return null;
  
    // Mezcla las letras disponibles y devuelve la primera
    const randomIndex = Math.floor(Math.random() * disponibles.length);
    return disponibles[randomIndex];
  }

  // Revela uno o más jeroglíficos según la posición
  revelarJeroglifico() {
    const cantidad = this.posicion < 30 ? 1 : 2; // Revela 1 si está antes del 30, sino 2
    const revelados = [];
    const fraseAnterior = this.fraseDescubierta;
  
    for (let i = 0; i < cantidad; i++) {
      const jeroglifico = this.obtenerJeroglificoDisponible();
      if (!jeroglifico) break;
  
      this.jeroglificos.push(jeroglifico);
      this.fraseDescubierta = this.frase
        .split("")
        .map(char => {
          const upperChar = char.toUpperCase();
          return this.jeroglificos.includes(upperChar) ? char : (/\p{L}/u.test(char) ? "_" : char);
        })
        .join("");
  
      revelados.push(jeroglifico);
    }
  
    return { fraseAnterior, fraseActualizada: this.fraseDescubierta, jeroglificos: revelados };
  }

  static fromJSON(data) {
  const equipo = new Equipo(data.nombre, data.frase);
  Object.assign(equipo, {
    posicion: data.posicion ?? 0,
    llegoAlCorazon: data.llegoAlCorazon ?? false,
    fraseDescubierta: data.fraseDescubierta ?? equipo.inicializarFrase(data.frase),
    color: data.color,
    jeroglificos: data.jeroglificos ?? [],
    regalosTomados: data.regalosTomados ?? [],
    fraseAdivinada: data.fraseAdivinada ?? false,
    intentoEnTurno: data.intentoEnTurno ?? false,
  });
  return equipo;
}
}

export default Equipo;
