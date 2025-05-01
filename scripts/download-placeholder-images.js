import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create products directory if it doesn't exist
const productsDir = path.join(__dirname, '../public/images/products');
if (!fs.existsSync(productsDir)) {
  fs.mkdirSync(productsDir, { recursive: true });
}

// List of placeholder images to download
const images = [
  { filename: 'headphones.jpg', url: 'https://placehold.co/400x300/3498db/ffffff.jpg?text=Headphones' },
  { filename: 'smartwatch.jpg', url: 'https://placehold.co/400x300/9b59b6/ffffff.jpg?text=Smart+Watch' },
  { filename: 'office-chair.jpg', url: 'https://placehold.co/400x300/34495e/ffffff.jpg?text=Office+Chair' },
  { filename: 'water-bottle.jpg', url: 'https://placehold.co/400x300/2ecc71/ffffff.jpg?text=Water+Bottle' },
  { filename: 'leather-wallet.jpg', url: 'https://placehold.co/400x300/e67e22/ffffff.jpg?text=Leather+Wallet' },
  { filename: 'cotton-tshirt.jpg', url: 'https://placehold.co/400x300/f1c40f/ffffff.jpg?text=Cotton+T-Shirt' },
  { filename: 'bluetooth-speaker.jpg', url: 'https://placehold.co/400x300/1abc9c/ffffff.jpg?text=Bluetooth+Speaker' },
  { filename: 'food-containers.jpg', url: 'https://placehold.co/400x300/e74c3c/ffffff.jpg?text=Food+Containers' },
  { filename: 'yoga-mat.jpg', url: 'https://placehold.co/400x300/3498db/ffffff.jpg?text=Yoga+Mat' },
  { filename: 'security-camera.jpg', url: 'https://placehold.co/400x300/9b59b6/ffffff.jpg?text=Security+Camera' },
  { filename: 'dumbbell-set.jpg', url: 'https://placehold.co/400x300/34495e/ffffff.jpg?text=Dumbbell+Set' },
  { filename: 'coffee-maker.jpg', url: 'https://placehold.co/400x300/2ecc71/ffffff.jpg?text=Coffee+Maker' },
  { filename: 'charging-pad.jpg', url: 'https://placehold.co/400x300/e67e22/ffffff.jpg?text=Charging+Pad' },
  { filename: 'backpack.jpg', url: 'https://placehold.co/400x300/f1c40f/ffffff.jpg?text=Backpack' },
  { filename: 'knife-set.jpg', url: 'https://placehold.co/400x300/1abc9c/ffffff.jpg?text=Knife+Set' },
  { filename: 'candles.jpg', url: 'https://placehold.co/400x300/e74c3c/ffffff.jpg?text=Candles' },
  // Flash sale additional images
  { filename: 'laptop.jpg', url: 'https://placehold.co/400x300/3498db/ffffff.jpg?text=MacBook+Air' },
  { filename: 'tv.jpg', url: 'https://placehold.co/400x300/2c3e50/ffffff.jpg?text=Samsung+TV' },
  { filename: 'tablet.jpg', url: 'https://placehold.co/400x300/8e44ad/ffffff.jpg?text=iPad+Pro' },
  { filename: 'earbuds.jpg', url: 'https://placehold.co/400x300/16a085/ffffff.jpg?text=Earbuds' }
];

// Download function
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(path.join(productsDir, filename));
    
    https.get(url, (response) => {
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(path.join(productsDir, filename), () => {}); // Delete the file if there's an error
      console.error(`Error downloading ${filename}: ${err.message}`);
      reject(err);
    });
  });
}

// Download all images
async function downloadAllImages() {
  console.log('Starting to download placeholder images...');
  
  for (const image of images) {
    try {
      await downloadImage(image.url, image.filename);
    } catch (err) {
      console.error(`Failed to download ${image.filename}`);
    }
  }
  
  console.log('All placeholder images downloaded!');
}

downloadAllImages(); 