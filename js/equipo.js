// equipo.js

class Equipo {
  constructor(nombre, frase) {
    this.nombre = nombre;                       
    this.frase = frase;                         
    this.fraseDescubierta = this.inicializarFrase(frase); 
    this.posicion = 0;                          
    this.llegoAlCorazon = false;                
    this.jeroglificos = [];                     
  }

  inicializarFrase(frase) {
    return frase.replace(/[A-Za-zÁÉÍÓÚÑ]/gi, "_");
  }

  mover(pasos) {
    const origen = this.posicion;
    this.posicion += pasos;
    return { origen, destino: this.posicion }; 
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
    equipo.posicion = data.posicion;
    equipo.llegoAlCorazon = data.llegoCorazon;
    equipo.fraseDescubierta = data.fraseDescubierta;
    equipo.color = data.color;
    equipo.jeroglificos = data.jeroglificos;
    return equipo;
  }
}

export default Equipo;
