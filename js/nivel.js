const btns = document.getElementsByTagName('button');

// Recuperamos el juego desde sessionStorage
const juego = JSON.parse(sessionStorage.getItem("juego"));

//Agregamos un eventListener a cada botón
for (let i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", () => {

    const nivelSeleccionado = i + 1; // los botones van de 1 a 7
    juego.nivel = nivelSeleccionado;

    // Guardamos el nivel seleccionado en el objeto juego
    sessionStorage.setItem("juego", JSON.stringify(juego));

    // Redirigimos a la ruleta
    window.location.href = "ruleta.html";
  });
}
