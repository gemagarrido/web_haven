// Obtener referencias a elementos del DOM
const progress = document.getElementById('progress'); // Barra de progreso
const song = document.getElementById('song'); // Elemento de audio
const controlIcon = document.getElementById('controlIcon'); // Icono de play/pause
const playPauseButton = document.querySelector('.play-pause-btn'); // Botón de play/pause
const forwardButton = document.querySelector('.controls button.forward'); // Botón siguiente
const backwardButton = document.querySelector('.controls button.backward'); // Botón anterior
const rotatingImage = document.getElementById('rotatingImage'); // Imagen de la carátula
const songName = document.querySelector('.music-player h2'); // Título de la canción
const artistName = document.querySelector('.music-player p'); // Nombre del artista

// Variables de control
let rotating = false; // Controla si la imagen está rotando
let currentRotation = 0; // Grados actuales de rotación
let rotationInterval; // Intervalo para la animación de rotación
let songs = []; // Array para almacenar las canciones
let currentSongIndex = 0; // Índice de la canción actual

// Cargar canciones desde la base de datos
fetch('get_songs.php')
  .then(response => response.json())
  .then(data => {
    songs = data;
    updateSongInfo(); // Actualizar información inicial
  })
  .catch(error => console.error('Error:', error));

// Funciones para la rotación de la carátula
function startRotation() {
  if (!rotating) {
    rotating = true;
    rotationInterval = setInterval(rotateImage, 50); // Actualizar rotación cada 50ms
  }
}

function pauseRotation() {
  clearInterval(rotationInterval);
  rotating = false;
}

function rotateImage() {
  currentRotation += 1; // Incrementar rotación en 1 grado
  rotatingImage.style.transform = `rotate(${currentRotation}deg)`;
}

// Actualizar información de la canción en la interfaz
function updateSongInfo() {
  songName.textContent = songs[currentSongIndex].title; // Actualizar título
  artistName.textContent = songs[currentSongIndex].name; // Actualizar artista
  song.src = songs[currentSongIndex].source; // Actualizar fuente de audio
  rotatingImage.src = songs[currentSongIndex].cover; // Actualizar carátula
}

// Event Listeners para el elemento de audio
song.addEventListener('loadedmetadata', () => {
  // Cuando se carga la canción, establecer la duración máxima
  progress.max = song.duration;
  progress.value = song.currentTime;
});

song.addEventListener('ended', () => {
  // Cuando termina la canción, reproducir la siguiente
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  updateSongInfo();
  playPause();
});

song.addEventListener('timeupdate', () => {
  // Actualizar la barra de progreso durante la reproducción
  if (!song.paused) {
    progress.value = song.currentTime;
  }
});

// Función principal de reproducción/pausa
function playPause() {
  if (song.paused) {
    // Si está pausado, reproducir
    song.play();
    controlIcon.classList.add('fa-pause');
    controlIcon.classList.remove('fa-play');
    startRotation();
  } else {
    // Si está reproduciendo, pausar
    song.pause();
    controlIcon.classList.remove('fa-pause');
    controlIcon.classList.add('fa-play');
    pauseRotation();
  }
}

// Event Listeners para los controles
playPauseButton.addEventListener('click', playPause);

// Control de la barra de progreso
progress.addEventListener('input', () => (song.currentTime = progress.value));
progress.addEventListener('change', () => {
  song.play();
  controlIcon.classList.add('fa-pause');
  controlIcon.classList.remove('fa-play');
  startRotation();
});

// Botón siguiente canción
forwardButton.addEventListener('click', () => {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  updateSongInfo();
  playPause();
});

// Botón canción anterior
backwardButton.addEventListener('click', () => {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  updateSongInfo();
  playPause();
});

// Inicializar la información de la primera canción
updateSongInfo();
