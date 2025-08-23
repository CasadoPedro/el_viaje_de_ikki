// equipo.js

class Equipo {
    constructor(nombre, frase) {
      this.nombre = nombre;                       // Nombre del equipo
      this.frase = frase;                         // Frase completa asignada
      this.fraseDescubierta = this.inicializarFrase(frase); // Frase oculta al inicio
      this.posicion = 0;                          // Posición inicial en el tablero
      this.llegoAlCorazon = false;                // Estado de llegada
      this.jeroglificos = [];                     // Letras ya reveladas
    }
  
    // Por ahora un helper para crear la frase oculta
    inicializarFrase(frase) {
      return frase.replace(/[A-Za-zÁÉÍÓÚÑ]/gi, "_");
    }

    static fromJSON(data) {
      let equipo = new Equipo(data.nombre, data.frase);
      equipo.posicion = data.posicion;
      equipo.llegoAlCorazon = data.llegoCorazon;
      equipo.fraseDescubierta = data.fraseDescubierta;
      equipo.color = data.color; // Asignamos el color si está presente
      equipo.jeroglificos = data.jeroglificos;
      equipo.fraseParcial = data.fraseParcial;
      return equipo;
    }
  }
  
  export default Equipo;
  