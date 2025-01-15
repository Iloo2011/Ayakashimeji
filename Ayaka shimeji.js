// Variables
const container = document.getElementById("shimeji-container");
const notificationBox = document.getElementById("notifications");
const canvas = document.createElement("canvas");
canvas.width = container.clientWidth;
canvas.height = container.clientHeight;
container.appendChild(canvas);

const ctx = canvas.getContext("2d");
const imageFolder = "./"; // Adjust this if the path to the images is different
let testImage;

// Helper: Load a single test image
const loadTestImage = async () => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = `${imageFolder}walk1.png`; // Replace with any valid image name
    img.onload = () => resolve(img);
    img.onerror = () => reject(`Failed to load walk1.png`);
  });
};

// Preload and Test
(async () => {
  try {
    notificationBox.textContent = "Loading test image...";
    testImage = await loadTestImage();
    notificationBox.textContent = "Test image loaded successfully!";
    setTimeout(() => notificationBox.textContent = "", 3000);
    drawTestImage();
  } catch (err) {
    notificationBox.textContent = `Error: ${err}`;
    console.error(err);
  }
})();

// Draw test image at a fixed position
const drawTestImage = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
  ctx.drawImage(testImage, 100, 100, 100, 100); // Draw test image at fixed position
};