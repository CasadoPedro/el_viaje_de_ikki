// nivel.js
const btns = document.getElementsByTagName('button');

// Recuperamos el juego desde sessionStorage
const juego = JSON.parse(sessionStorage.getItem("juego"));

for (let i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", () => {
    // Guardamos el nivel seleccionado en el objeto juego
    const nivelSeleccionado = i + 1; // los botones van de 1 a 7
    juego.nivel = nivelSeleccionado;

    // Volvemos a guardar el objeto actualizado
    sessionStorage.setItem("juego", JSON.stringify(juego));

    // Redirigimos a la ruleta
    window.location.href = "ruleta.html";
  });
}
