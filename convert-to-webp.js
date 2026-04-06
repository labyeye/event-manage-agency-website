const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'assets', 'images');

/**
 * Recursively find and convert JPG images to WebP.
 * @param {string} directory 
 */
async function processDirectory(directory) {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      await processDirectory(fullPath);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (ext === '.jpg' || ext === '.jpeg') {
        const outputPath = fullPath.replace(new RegExp(`${ext}$`, 'i'), '.webp');
        
        try {
          await sharp(fullPath)
            .webp({ quality: 80 })
            .toFile(outputPath);
          console.log(`Converted: ${fullPath} -> ${outputPath}`);
        } catch (error) {
          console.error(`Error converting ${fullPath}:`, error.message);
        }
      }
    }
  }
}

console.log(`Starting WebP conversion in: ${targetDir}...`);
if (fs.existsSync(targetDir)) {
  processDirectory(targetDir)
    .then(() => console.log('✅ Conversion complete!'))
    .catch((err) => console.error('❌ Conversion failed:', err));
} else {
  console.error(`❌ Directory not found: ${targetDir}`);
}
