// Variables
const container = document.getElementById("shimeji-container");
const notificationBox = document.getElementById("notifications");
const canvas = document.createElement("canvas");
canvas.width = container.clientWidth;
canvas.height = container.clientHeight;
container.appendChild(canvas);

const ctx = canvas.getContext("2d");
const imageFolder = "./"; // Ensure images are in the same folder as index.html
let walkImages = [];
let currentFrame = 0;
let direction = 1; // 1 for right, -1 for left
let xPosition = 100; // Starting X position
let yPosition = 200; // Fixed Y position
const frameInterval = 200; // Time per frame in ms
let lastFrameTime = 0;

// Helper: Load walk images
const loadWalkImages = async () => {
  const frameNames = ["walk1.png", "walk2.png"]; // Make sure these filenames match your assets
  const promises = frameNames.map(
    (frame) =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.src = `${imageFolder}${frame}`;
        img.onload = () => resolve(img);
        img.onerror = () => reject(`Failed to load ${frame}`);
      })
  );
  return Promise.all(promises);
};

// Preload and Start Animation
(async () => {
  try {
    notificationBox.textContent = "Loading walk animation frames...";
    walkImages = await loadWalkImages();
    notificationBox.textContent = "Shimeji loaded successfully!";
    setTimeout(() => (notificationBox.textContent = ""), 3000);
    requestAnimationFrame(animate);
  } catch (err) {
    notificationBox.textContent = `Error: ${err}`;
    console.error(err);
  }
})();

// Animation Logic
const animate = (timestamp) => {
  if (!lastFrameTime) lastFrameTime = timestamp;

  // Update frame if enough time has passed
  if (timestamp - lastFrameTime > frameInterval) {
    currentFrame = (currentFrame + 1) % walkImages.length;
    lastFrameTime = timestamp;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

  // Flip the context if walking left
  ctx.save();
  if (direction === -1) {
    ctx.translate(canvas.width, 0); // Translate to canvas width
    ctx.scale(-1, 1); // Flip horizontally
    ctx.drawImage(
      walkImages[currentFrame],
      canvas.width - xPosition - 100,
      yPosition,
      100,
      100
    );
  } else {
    ctx.drawImage(walkImages[currentFrame], xPosition, yPosition, 100, 100);
  }
  ctx.restore();

  // Update position
  xPosition += direction * 2; // Adjust speed (currently 2px per frame)

  // Reverse direction if hitting edges
  if (xPosition <= 0 || xPosition >= canvas.width - 100) {
    direction *= -1;
  }

  // Request next animation frame
  requestAnimationFrame(animate);
};