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

  // Obtiene un jeroglifico (letra) que no se haya revelado todavía
  obtenerJeroglificoDisponible() {
    // todas las letras únicas de la frase
    const letrasUnicas = [...new Set(this.frase.toUpperCase().match(/[A-ZÁÉÍÓÚÑ]/gi))];
    // filtramos las que ya se dieron
    const disponibles = letrasUnicas.filter(l => !this.jeroglificos.includes(l));
    if (disponibles.length === 0) return null; // ya no quedan
    // elegimos una al azar
    const indice = Math.floor(Math.random() * disponibles.length);
    return disponibles[indice];
  }

  // Revela un jeroglifico en la frase y devuelve previo/actualizado
  revelarJeroglifico() {
    const fraseAnterior = this.fraseDescubierta;
    const jeroglifico = this.obtenerJeroglificoDisponible();
    if (!jeroglifico) {
      return { fraseAnterior, fraseActualizada: this.fraseDescubierta, jeroglifico: null };
    }

    this.jeroglificos.push(jeroglifico);

    // Construimos nueva frase revelando las ocurrencias
    let nueva = "";
    for (let i = 0; i < this.frase.length; i++) {
      const original = this.frase[i];
      if (
        original.toUpperCase() === jeroglifico ||
        this.jeroglificos.includes(original.toUpperCase())
      ) {
        nueva += original; // mostramos la letra original (con acentos si los tenía)
      } else if (/[A-Za-zÁÉÍÓÚÑ]/.test(original)) {
        nueva += "_";
      } else {
        nueva += original; // espacios, comas, etc.
      }
    }

    this.fraseDescubierta = nueva;

    return { fraseAnterior, fraseActualizada: nueva, jeroglifico };
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
