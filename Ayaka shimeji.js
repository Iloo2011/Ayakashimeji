// Variables used by Scriptable.
const imageFolder = "./"; // Adjust this to match your setup
const canvasSize = { width: 200, height: 200 }; // Adjust as needed

// Animation frames (update these with your actual PNG filenames)
const animations = {
  fall: ["fall1.png", "fall2.png", "fall3.png"], // Fall animation frames
  walk: ["walk1.png", "walk2.png"], // Walking animation frames
  sit: ["stand1.png"], // Sitting animation frames
};

// Helper to load images with improved debugging
const loadImage = async (filename) => {
  const img = new Image();
  img.src = `${imageFolder}/${filename}`;
  await img.decode();
  return img;
};

// Preload all images
const preloadedImages = {};
(async () => {
  for (const animation in animations) {
    for (const frame of animations[animation]) {
      preloadedImages[frame] = await loadImage(frame);
    }
  }
})();

// Initialize shimeji properties
let position = { x: 100, y: 300 }; // Start position
let direction = 1; // 1 = facing right, -1 = facing left
let currentAnimation = animations.walk;
let currentFrame = 0;
let frameCounter = 0;
const frameDelay = 15; // Controls animation speed

// Update shimeji position and behavior
const updatePosition = () => {
  position.x += direction * 2; // Move shimeji (adjust speed here)

  // Flip when reaching the edges of the screen
  if (position.x < 0 || position.x > window.innerWidth - canvasSize.width) {
    direction *= -1; // Reverse direction
  }

  // Update animation frame
  frameCounter++;
  if (frameCounter >= frameDelay) {
    frameCounter = 0;
    currentFrame = (currentFrame + 1) % currentAnimation.length;
  }
};

// Draw shimeji
const draw = (ctx) => {
  ctx.clearRect(0, 0, canvasSize.width, canvasSize.height); // Clear canvas
  const frame = currentAnimation[currentFrame];
  const image = preloadedImages[frame];

  ctx.save();
  ctx.translate(position.x + canvasSize.width / 2, position.y);
  ctx.scale(direction, 1); // Flip horizontally when direction is -1
  ctx.drawImage(image, -canvasSize.width / 2, 0, canvasSize.width, canvasSize.height);
  ctx.restore();
};

// Main loop
const canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

const mainLoop = () => {
  updatePosition();
  draw(ctx);
  requestAnimationFrame(mainLoop);
};

// Start the main loop
mainLoop();