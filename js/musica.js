// Inicialización del objeto de audio
let audio;

// Mapeo de música para zonas
const ZONE_MUSIC = {
  "Laberinto del miedo": "./sounds/musicaLaberinto.mp3",
  "Mar de la soledad": "./sounds/musicaInicio.mp3",
  "Bosque de las decisiones": "../sounds/musicaInicio.mp3",
  "Nido de las palabras no dichas": "./sounds/musicaInicio.mp3",
  "Río de las emociones": "./sounds/musicaInicio.mp3",
  "Montaña del coraje": "./sounds/musicaInicio.mp3",
  "Puente de los vínculos": "./sounds/musicaInicio.mp3",
  "Corazón de Ikki": "./sounds/musicaInicio.mp3",
};

// Restaurar el estado de reproducción desde sessionStorage
const savedZone = sessionStorage.getItem('currentZone');
const savedTime = sessionStorage.getItem('musicTime');
const savedVolume = sessionStorage.getItem('musicVolume');
const savedMuted = sessionStorage.getItem('musicMuted');

// Determinar la fuente de música inicial
let initialMusic = './sounds/musicaInicio.mp3';
if (savedZone && ZONE_MUSIC[savedZone]) {
  initialMusic = ZONE_MUSIC[savedZone];
}

// Inicializar el objeto de audio
audio = new Audio(initialMusic);
audio.loop = true;
audio.volume = savedVolume ? parseFloat(savedVolume) : 0.5;
audio.muted = savedMuted === 'true';

// Restaurar el tiempo de reproducción si está disponible
if (savedTime) {
  audio.currentTime = parseFloat(savedTime);
}

// Reproducir el audio cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      document.addEventListener('click', () => {
        audio.play();
      }, { once: true });
    });
  }

  // Guardar el estado de reproducción antes de salir de la página
  window.addEventListener('beforeunload', () => {
    sessionStorage.setItem('musicTime', audio.currentTime);
    sessionStorage.setItem('currentZone', sessionStorage.getItem('currentZone') || '');
    sessionStorage.setItem('musicVolume', audio.volume);
    sessionStorage.setItem('musicMuted', audio.muted);
  });
});

/**
 * Actualiza la música según la zona actual.
 * @param {string} zoneName - El nombre de la zona actual.
 */
export function updateMusicForZone(zoneName) {
  const newMusic = ZONE_MUSIC[zoneName];
  const savedZone = sessionStorage.getItem('currentZone');
  const savedTime = sessionStorage.getItem('musicTime');

  // Si la zona es la misma, reanudar desde el tiempo guardado
  if (savedZone === zoneName && newMusic) {
    if (savedTime) {
      audio.currentTime = parseFloat(savedTime);
    }
    if (audio.paused) {
      audio.play();
    }
    return;
  }

  // Si la zona es diferente, cambiar a la nueva música
  if (newMusic && audio.src !== new URL(newMusic, window.location.href).href) {
    audio.src = newMusic;
    audio.currentTime = 0; // Comenzar desde el principio de la nueva pista
    audio.play();
  }

  // Guardar la zona actual en sessionStorage
  sessionStorage.setItem('currentZone', zoneName);
}

// Controles de volumen y silencio
document.addEventListener('DOMContentLoaded', () => {
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  // Crear el contenedor de control de música
  const musicControl = document.createElement('div');
  musicControl.id = 'music-control';
  musicControl.innerHTML = `
    <img id="volume-icon" src="./visualAssets/iconosMusica/midVolume.png" alt="Volumen" />
    ${!isMobile ? `<input id="volume-slider" type="range" min="0" max="1" step="0.01" value="${audio.volume}">` : ''}
  `;
  document.body.appendChild(musicControl);

  const icon = document.getElementById('volume-icon');
  const slider = document.getElementById('volume-slider');

  // Función para actualizar el icono según el volumen
  const updateIcon = () => {
    if (audio.muted || audio.volume === 0) {
      icon.src = './visualAssets/iconosMusica/mute.png';
    } else if (audio.volume > 0.66) {
      icon.src = './visualAssets/iconosMusica/fullVolume.png';
    } else if (audio.volume > 0.33) {
      icon.src = './visualAssets/iconosMusica/midVolume.png';
    } else {
      icon.src = './visualAssets/iconosMusica/lowVolume.png';
    }
  };

  // Evento Mute/unmute 
  icon.addEventListener('click', () => {
    audio.muted = !audio.muted;
    updateIcon();
  });

  // Evento para el control deslizante de volumen
  if (slider) {
    slider.addEventListener('input', () => {
      audio.volume = parseFloat(slider.value);
      if (audio.volume > 0 && audio.muted) audio.muted = false;
      updateIcon();
    });
  }

  updateIcon();
});