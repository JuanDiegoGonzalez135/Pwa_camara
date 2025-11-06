const openCameraBtn = document.getElementById('openCamera');
const takePhotoBtn = document.getElementById('takePhoto');
const video = document.getElementById('video');
const canvas = document.createElement('canvas');
const cameraContainer = document.getElementById('cameraContainer');
let photoContainer = document.getElementById('photoContainer');
if (!photoContainer) {
  photoContainer = document.createElement('div');
  photoContainer.id = 'photoContainer';
  document.body.appendChild(photoContainer);
}

let useFrontCamera = false;
let currentStream = null;

// 📸 Abrir cámara
async function openCamera() {
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

// 📸 Tomar foto
takePhotoBtn.addEventListener('click', () => {
  const context = canvas.getContext('2d');

  // Ajusta el tamaño del canvas al tamaño real del video
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  const imageData = canvas.toDataURL('image/png');

  const img = document.createElement('img');
  img.src = imageData;
  img.alt = 'Foto tomada';
  photoContainer.appendChild(img);

  // Apagar cámara después de tomar la foto
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
    currentStream = null;
  }
  cameraContainer.style.display = 'none';
});

// 🔄 Alternar entre cámaras
const switchCameraBtn = document.createElement('button');
switchCameraBtn.textContent = 'Cambiar Cámara';
switchCameraBtn.style.margin = '5px';
switchCameraBtn.addEventListener('click', () => {
  useFrontCamera = !useFrontCamera;
  openCamera();
});
cameraContainer.appendChild(switchCameraBtn);

// 🟢 Abrir cámara al presionar el botón principal
openCameraBtn.addEventListener('click', openCamera);
