// Initialize the audio object with the default music
let audio;

// Music mapping for zones
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

// Restore playback state from sessionStorage
const savedZone = sessionStorage.getItem('currentZone');
const savedTime = sessionStorage.getItem('musicTime');
const savedVolume = sessionStorage.getItem('musicVolume');
const savedMuted = sessionStorage.getItem('musicMuted');

// Determine the initial music source
let initialMusic = './sounds/musicaInicio.mp3';
if (savedZone && ZONE_MUSIC[savedZone]) {
  initialMusic = ZONE_MUSIC[savedZone];
}

// Initialize the audio object
audio = new Audio(initialMusic);
audio.loop = true;
audio.volume = savedVolume ? parseFloat(savedVolume) : 0.5;
audio.muted = savedMuted === 'true';

// Restore playback time if available
if (savedTime) {
  audio.currentTime = parseFloat(savedTime);
}

// Play the audio when the page loads
document.addEventListener('DOMContentLoaded', () => {
  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      document.addEventListener('click', () => {
        audio.play();
      }, { once: true });
    });
  }

  // Save the current playback state before the page unloads
  window.addEventListener('beforeunload', () => {
    sessionStorage.setItem('musicTime', audio.currentTime);
    sessionStorage.setItem('currentZone', sessionStorage.getItem('currentZone') || '');
    sessionStorage.setItem('musicVolume', audio.volume);
    sessionStorage.setItem('musicMuted', audio.muted);
  });
});

/**
 * Updates the music based on the current zone.
 * @param {string} zoneName - The name of the current zone.
 */
export function updateMusicForZone(zoneName) {
  const newMusic = ZONE_MUSIC[zoneName];
  const savedZone = sessionStorage.getItem('currentZone');
  const savedTime = sessionStorage.getItem('musicTime');

  // If the zone is the same, resume from the saved time
  if (savedZone === zoneName && newMusic) {
    if (savedTime) {
      audio.currentTime = parseFloat(savedTime);
    }
    if (audio.paused) {
      audio.play();
    }
    return;
  }

  // If the zone is different, switch to the new music
  if (newMusic && audio.src !== new URL(newMusic, window.location.href).href) {
    audio.src = newMusic;
    audio.currentTime = 0; // Start from the beginning of the new track
    audio.play();
  }

  // Save the current zone in sessionStorage
  sessionStorage.setItem('currentZone', zoneName);
}

// Volume and mute controls
document.addEventListener('DOMContentLoaded', () => {
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  // Create the music control container
  const musicControl = document.createElement('div');
  musicControl.id = 'music-control';
  musicControl.innerHTML = `
    <img id="volume-icon" src="./visualAssets/iconosMusica/midVolume.png" alt="Volumen" />
    ${!isMobile ? `<input id="volume-slider" type="range" min="0" max="1" step="0.01" value="${audio.volume}">` : ''}
  `;
  document.body.appendChild(musicControl);

  const icon = document.getElementById('volume-icon');
  const slider = document.getElementById('volume-slider');

  // Function to update the volume icon
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

  // Mute/unmute event
  icon.addEventListener('click', () => {
    audio.muted = !audio.muted;
    updateIcon();
  });

  // Volume slider event
  if (slider) {
    slider.addEventListener('input', () => {
      audio.volume = parseFloat(slider.value);
      if (audio.volume > 0 && audio.muted) audio.muted = false;
      updateIcon();
    });
  }

  updateIcon();
});