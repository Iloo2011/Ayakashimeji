// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: star;
// Kamisato Ayaka Shimeji Animation Script for Scriptable

const imageFolder = FileManager.iCloud().documentsDirectory() + "/KamisatoAyakaAssets"; // iCloud folder path
const canvasSize = { width: 200, height: 200 }; // Adjust as needed

// Animation frames (update these with your actual PNG filenames)
const animations = {
  fall: ["fall1.png", "fall2.png", "fall3.png"], // Fall animation frames
  walk: ["walk1.png", "walk2.png"], // Walking animation frames (only 2 frames)
  fanwalk: ["fanwalk1.png", "fanwalk2.png", "fanwalk3.png", "fanwalk4.png", "fanwalk5.png"], // Fanwalk animation
  jump: ["jump1.png"], // Jump animation frame
  stand: ["stand1.png"], // Stand animation frame
  climb: ["climb1.png", "climb2.png", "climb3.png"], // Climbing animation frames
  climbontop: ["climbontop1.png", "climbontop2.png", "climbontop3.png"], // Climb on top animation frames
};

// Helper to load images with improved debugging
const loadImage = async (filename) => {
  const fm = FileManager.iCloud();
  const filePath = fm.joinPath(imageFolder, filename);

  // Debug: Log all files in the folder
  try {
    const allFiles = fm.listContents(imageFolder);
    console.log(`Files in folder: ${JSON.stringify(allFiles)}`);
  } catch (err) {
    console.error("Error reading folder contents:", err);
  }

  console.log(`Trying to load file from: ${filePath}`); // Log the file path
  
  if (fm.fileExists(filePath)) {
    console.log(`File exists: ${filePath}`);
    await fm.downloadFileFromiCloud(filePath);
    if (fm.isFileDownloaded(filePath)) {
      console.log(`File downloaded: ${filePath}`);
      return Image.fromFile(filePath);
    } else {
      console.error(`File exists but is not downloaded: ${filePath}`);
    }
  } else {
    console.error(`File not found: ${filePath}`);
  }

  // Return placeholder image if file not found
  const placeholder = new DrawContext();
  placeholder.size = new Size(200, 200);
  placeholder.setFillColor(Color.red());
  placeholder.fillRect(new Rect(0, 0, 200, 200));
  return placeholder.getImage();
};

// Function to animate frames
const animate = async (ctx, frames, x, y) => {
  for (const frame of frames) {
    const img = await loadImage(frame);
    if (img) {
      ctx.drawImageAtPoint(img, new Point(x, y));
      await new Promise((resolve) => setTimeout(resolve, 200)); // Adjust speed
    }
  }
};

// Main script
(async () => {
  const canvas = new DrawContext();
  canvas.size = new Size(canvasSize.width, canvasSize.height);
  canvas.opaque = false;

  let x = 0; // Initial X position
  let y = 0; // Initial Y position

  while (true) {
    await animate(canvas, animations.walk, x, y); // Walk animation
    x = (x + 10) % canvasSize.width; // Move character horizontally
    await animate(canvas, animations.fanwalk, x, y); // Fanwalk animation
    await animate(canvas, animations.stand, x, y); // Stand animation
    await animate(canvas, animations.climb, x, y); // Climb animation
    await animate(canvas, animations.climbontop, x, y); // Climb on top animation
    await animate(canvas, animations.jump, x, y); // Jump animation
    await animate(canvas, animations.fall, x, y); // Fall animation
  }
})();