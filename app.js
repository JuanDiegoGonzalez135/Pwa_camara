const openCameraBtn = document.getElementById('openCamera');
const takePhotoBtn = document.getElementById('takePhoto');
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const cameraContainer = document.getElementById('cameraContainer');

// Verificamos o creamos el contenedor de fotos
let photoContainer = document.getElementById('photoContainer');
if (!photoContainer) {
  photoContainer = document.createElement('div');
  photoContainer.id = 'photoContainer';
  document.body.appendChild(photoContainer);
}

// Nueva variable para controlar qué cámara usar
let useFrontCamera = false;
let currentStream = null;

// 🔹 Función para abrir cámara (frontal o trasera)
async function openCamera() {
  // Detenemos cualquier stream anterior
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
  }

  const constraints = {
    video: { facingMode: useFrontCamera ? "user" : "environment" }
  };

  try {
    currentStream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = currentStream;
    cameraContainer.style.display = 'block';
  } catch (error) {
    alert('No se pudo acceder a la cámara: ' + error);
  }
}

// 🔹 Botón para abrir cámara
openCameraBtn.addEventListener('click', openCamera);

// 🔹 Botón para tomar foto
takePhotoBtn.addEventListener('click', () => {
  const context = canvas.getContext('2d');
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  const imageData = canvas.toDataURL('image/png');

  // En lugar de reemplazar, agregamos la imagen a la galería
  const img = document.createElement('img');
  img.src = imageData;
  img.width = 320;
  img.style.margin = '10px';
  img.style.borderRadius = '10px';
  img.style.border = '2px solid #ccc';
  photoContainer.appendChild(img);
});

// 🔹 Crear botón para cambiar cámara
const switchCameraBtn = document.createElement('button');
switchCameraBtn.textContent = 'Cambiar Cámara';
switchCameraBtn.style.margin = '5px';
switchCameraBtn.addEventListener('click', () => {
  useFrontCamera = !useFrontCamera;
  openCamera();
});

// Lo agregamos al DOM
cameraContainer.appendChild(switchCameraBtn);
