const fs = require('fs');
const path = require('path');

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, '../public/images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Copy marker icons from node_modules to public/images
const leafletImages = [
  'marker-icon.png',
  'marker-icon-2x.png',
  'marker-shadow.png'
];

leafletImages.forEach(image => {
  const sourcePath = path.join(__dirname, '../node_modules/leaflet/dist/images', image);
  const destPath = path.join(imagesDir, image);
  fs.copyFileSync(sourcePath, destPath);
  console.log(`Copied ${image} to public/images`);
}); 