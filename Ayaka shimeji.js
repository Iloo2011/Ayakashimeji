// Variables
const container = document.getElementById("shimeji-container");
const notificationBox = document.getElementById("notifications");
const canvas = document.createElement("canvas");
canvas.width = container.clientWidth;
canvas.height = container.clientHeight;
container.appendChild(canvas);

const ctx = canvas.getContext("2d");
const imageFolder = "./"; // Adjust this if the path to the images is different
const animations = {
  sit: ["stand1.png"], // Sitting animation
  walk: ["walk1.png", "walk2.png"], // Walking animation
};
const preloadedImages = {};
let position = { x: 100, y: canvas.height - 100 }; // Start near the bottom
let direction = 1; // 1 = right, -1 = left
let currentAnimation = animations.walk;
let currentFrame = 0;
let frameCounter = 0;
const frameDelay = 20; // Controls speed

// Helper: Load images
const loadImage = async (filename) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = `${imageFolder}${filename}`;
    img.onload = () => resolve(img);
    img.onerror = () => reject(`Failed to load ${filename}`);
  });
};

// Preload images
(async () => {
  try {
    notificationBox.textContent = "Preloading images...";
    console.log("Starting image preload...");
    for (const animation in animations) {
      for (const frame of animations[animation]) {
        preloadedImages[frame] = await loadImage(frame);
        console.log(`Loaded: ${frame}`);
        notificationBox.textContent += `\nLoaded ${frame}`;
      }
    }
    notificationBox.textContent += "\nShimeji loaded successfully!";
    setTimeout(() => (notificationBox.textContent = ""), 3000); // Hide notifications
  } catch (err) {
    console.error(err);
    notificationBox.textContent = `Error: ${err}`;
  }
})();

// Update shimeji position
const updatePosition = () => {
  position.x += direction * 2; // Adjust speed
  if (position.x < 0 || position.x > canvas.width - 100) {
    direction *= -1; // Flip direction
  }

  // Update animation frame
  frameCounter++;
  if (frameCounter >= frameDelay) {
    frameCounter = 0;
    currentFrame = (currentFrame + 1) % currentAnimation.length;
  }
};

// Draw shimeji
const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

  // Debug: Draw the canvas boundary
  ctx.strokeStyle = "blue";
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  // Draw current frame
  const frame = currentAnimation[currentFrame];
  const img = preloadedImages[frame];

  if (img) {
    console.log(`Drawing frame: ${frame} at position (${position.x}, ${position.y})`);
    ctx.save();
    ctx.translate(position.x + 50, position.y);
    ctx.scale(direction, 1); // Flip image based on direction
    ctx.drawImage(img, -50, 0, 100, 100); // Center image
    ctx.restore();
  } else {
    ctx.fillStyle = "red";
    ctx.fillText(`Missing frame: ${frame}`, position.x, position.y - 10);
  }
};

// Main loop
const mainLoop = () => {
  updatePosition();
  draw();
  requestAnimationFrame(mainLoop);
};

// Start loop after loading images
setTimeout(() => mainLoop(), 1000);