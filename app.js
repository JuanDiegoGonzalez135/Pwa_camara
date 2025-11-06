// Referencias a elementos del DOM
const openCameraBtn = document.getElementById('openCamera');
const cameraContainer = document.getElementById('cameraContainer');
const video = document.getElementById('video');
const takePhotoBtn = document.getElementById('takePhoto');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Aquí agregaremos un contenedor para mostrar la foto
let photoContainer = document.getElementById('photoContainer');
if (!photoContainer) {
  photoContainer = document.createElement('div');
  photoContainer.id = 'photoContainer';
  document.body.appendChild(photoContainer);
}

let stream = null;

// Función para abrir la cámara
async function openCamera() {
  try {
    const constraints = {
      video: {
        facingMode: { ideal: 'environment' },
        width: { ideal: 320 },
        height: { ideal: 240 }
      }
    };

    stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream;
    cameraContainer.style.display = 'block';
    openCameraBtn.textContent = 'Cámara Abierta';
    openCameraBtn.disabled = true;
    console.log('Cámara abierta exitosamente');
  } catch (error) {
    console.error('Error al acceder a la cámara:', error);
    alert('No se pudo acceder a la cámara. Asegúrate de dar permisos.');
  }
}

// Función para tomar la foto y mostrarla en el HTML
function takePhoto() {
  if (!stream) {
    alert('Primero debes abrir la cámara');
    return;
  }

  // Dibujar el frame actual del video en el canvas
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Convertir el contenido del canvas en una imagen Base64
  const imageDataURL = canvas.toDataURL('image/png');

  // Crear (o reemplazar) la imagen mostrada en el HTML
  let img = document.getElementById('capturedPhoto');
  if (!img) {
    img = document.createElement('img');
    img.id = 'capturedPhoto';
    img.alt = 'Foto tomada';
    img.style.display = 'block';
    img.style.marginTop = '10px';
    img.style.maxWidth = '100%';
    photoContainer.appendChild(img);
  }

  // Asignar la nueva imagen (reemplazando la anterior)
  img.src = imageDataURL;

  // Opcional: cerrar la cámara después de tomar la foto
  closeCamera();
}

// Función para cerrar la cámara
function closeCamera() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
    video.srcObject = null;
    cameraContainer.style.display = 'none';
    openCameraBtn.textContent = 'Abrir Cámara';
    openCameraBtn.disabled = false;
    console.log('Cámara cerrada');
  }
}

// Eventos
openCameraBtn.addEventListener('click', openCamera);
takePhotoBtn.addEventListener('click', takePhoto);

// Cerrar cámara al salir de la página
window.addEventListener('beforeunload', closeCamera);
