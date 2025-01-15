document.addEventListener("DOMContentLoaded", () => {
  const shimeji = document.createElement("img");
  shimeji.src = "walk1.png"; // Default image
  shimeji.style.position = "absolute";
  shimeji.style.bottom = "0";
  shimeji.style.left = "50px";
  shimeji.style.width = "100px";
  shimeji.style.transition = "transform 0.2s ease"; // Smooth flipping
  document.body.appendChild(shimeji);

  let isFacingRight = true;
  let positionX = 50;
  const speed = 5; // Adjust walking speed

  function walk() {
    console.log(`Current position: ${positionX}, Facing Right: ${isFacingRight}`);

    // Move and flip sprite
    if (isFacingRight) {
      positionX += speed;
      shimeji.style.transform = "scaleX(1)";
    } else {
      positionX -= speed;
      shimeji.style.transform = "scaleX(-1)";
    }

    // Update position
    shimeji.style.left = `${positionX}px`;

    // Check boundaries
    if (positionX <= 0) {
      console.log("Hit the left boundary. Turning right.");
      isFacingRight = true;
    } else if (positionX >= window.innerWidth - 100) {
      console.log("Hit the right boundary. Turning left.");
      isFacingRight = false;
    }
  }

  setInterval(walk, 100); // Walk every 100ms
});