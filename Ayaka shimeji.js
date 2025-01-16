// Set up canvas
const canvas = document.getElementById('shimeji-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Helper to log errors to the screen
console.error = (msg) => {
    const log = document.createElement('div');
    log.style.position = 'fixed';
    log.style.bottom = '0';
    log.style.left = '0';
    log.style.backgroundColor = 'red';
    log.style.color = 'white';
    log.style.padding = '10px';
    log.style.zIndex = '10000';
    log.innerText = `Error: ${msg}`;
    document.body.appendChild(log);
};

// Debug logs
function loadImage(src) {
    console.log(`Loading image: ${src}`);
    const img = new Image();
    img.src = src;
    img.onload = () => console.log(`Successfully loaded: ${src}`);
    img.onerror = () => console.error(`Error loading: ${src}`);
    return img;
}

// Shimeji assets folder path
const assetsFolder = './KamisatoAyakaAssets/';

// Shimeji animations
const animations = {
    walk: [loadImage(`${assetsFolder}walk1.png`), loadImage(`${assetsFolder}walk2.png`)],
    sit: [loadImage(`${assetsFolder}sit1.png`)],
};

// Shimeji object
const shimeji = {
    x: canvas.width / 2,
    y: canvas.height - 100,
    width: 64,
    height: 64,
    speed: 2,
    frame: 0,
    direction: 1, // 1: right, -1: left
    action: 'walk',
    animationTimer: 0,
    animationSpeed: 10, // Lower value = faster animation
};

// Draw the shimeji
function drawShimeji() {
    const frames = animations[shimeji.action];
    if (!frames || frames.length === 0) {
        console.error(`Animation not found: ${shimeji.action}`);
        return;
    }
    const frame = frames[shimeji.frame];
    if (!frame) {
        console.error(`Frame not found for animation: ${shimeji.action}, frame: ${shimeji.frame}`);
        return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(shimeji.x, shimeji.y);
    ctx.scale(shimeji.direction, 1); // Flip based on direction
    ctx.drawImage(frame, -shimeji.width / 2, -shimeji.height / 2, shimeji.width, shimeji.height);
    ctx.restore();
}

// Update the shimeji's position and animation
function updateShimeji() {
    shimeji.animationTimer++;
    if (shimeji.animationTimer >= shimeji.animationSpeed) {
        shimeji.frame = (shimeji.frame + 1) % animations[shimeji.action].length;
        shimeji.animationTimer = 0;
    }

    shimeji.x += shimeji.speed * shimeji.direction;
    if (shimeji.x <= 0 || shimeji.x >= canvas.width) {
        shimeji.direction *= -1; // Flip direction at screen edges
    }
}

// Animation loop
function loop() {
    updateShimeji();
    drawShimeji();
    requestAnimationFrame(loop);
}

// Initialize
window.onload = () => {
    console.log('Initializing shimeji...');
    if (!animations.walk || animations.walk.length === 0) {
        console.error('Walk animation frames are missing!');
    } else {
        console.log('Walk animation loaded successfully.');
    }
    if (!animations.sit || animations.sit.length === 0) {
        console.error('Sit animation frames are missing!');
    } else {
        console.log('Sit animation loaded successfully.');
    }

    loop();
};