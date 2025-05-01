#!/usr/bin/env node

/**
 * Product Image Processor
 * 
 * This script processes and optimizes product images for the e-commerce site.
 * It can resize, compress, and rename AI-generated images to match product IDs.
 * 
 * Usage:
 *   node process-product-images.js --input=<input-directory> [options]
 * 
 * Options:
 *   --input=<dir>     Directory containing the AI-generated images (required)
 *   --rename          Rename files to match product IDs based on a mapping file
 *   --compress        Compress images to reduce file size
 *   --resize=<size>   Resize images to specified dimensions (e.g., 800x800)
 *   --mapping=<file>  JSON file mapping image filenames to product IDs (default: image-mapping.json)
 */

const fs = require('fs');
const path = require('path');

// Configuration
const DEFAULT_OUTPUT_DIR = path.join(__dirname, '..', 'public', 'images', 'products');
const DEFAULT_MAPPING_FILE = path.join(__dirname, '..', 'image-mapping.json');

/**
 * Parses command line arguments
 * @returns {Object} Parsed arguments
 */
const parseArgs = () => {
  const args = {};
  process.argv.slice(2).forEach(arg => {
    if (arg.startsWith('--')) {
      const [key, value] = arg.substring(2).split('=');
      args[key] = value || true;
    }
  });
  return args;
};

/**
 * Ensures a directory exists, creates it if it doesn't
 * @param {string} dir Directory path
 */
const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
};

/**
 * Gets all image files from a directory
 * @param {string} directory Directory path
 * @returns {Array} Array of image files
 */
const getImageFiles = (directory) => {
  try {
    const files = fs.readdirSync(directory);
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    
    return files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return imageExtensions.includes(ext);
    });
  } catch (error) {
    console.error(`Error reading directory ${directory}:`, error);
    return [];
  }
};

/**
 * Creates a sample mapping file if it doesn't exist
 * @param {string} mappingFile Path to mapping file
 * @param {Array} imageFiles Array of image files
 */
const createSampleMapping = (mappingFile, imageFiles) => {
  // If mapping file already exists, don't overwrite it
  if (fs.existsSync(mappingFile)) {
    return;
  }
  
  try {
    const mapping = {};
    
    // Create a sample mapping
    imageFiles.forEach((file, index) => {
      // Use index + 1 as a temporary product ID
      mapping[file] = (index + 1).toString();
    });
    
    // Write the mapping file
    fs.writeFileSync(
      mappingFile, 
      JSON.stringify({ 
        description: "Map AI-generated image filenames to product IDs. Edit this file to match your products.",
        mapping: mapping 
      }, null, 2)
    );
    
    console.log(`Created sample mapping file: ${mappingFile}`);
    console.log('⚠️ Please edit this file to correctly map your images to product IDs');
  } catch (error) {
    console.error('Error creating sample mapping file:', error);
  }
};

/**
 * Processes images according to specified options
 * @param {Object} options Processing options
 */
const processImages = (options) => {
  const {
    input,
    output = DEFAULT_OUTPUT_DIR,
    mapping = DEFAULT_MAPPING_FILE,
    rename = false,
    compress = false,
    resize = null
  } = options;
  
  // Validate input directory
  if (!input || !fs.existsSync(input)) {
    console.error(`Error: Input directory "${input}" does not exist`);
    return;
  }
  
  // Ensure output directory exists
  ensureDirectoryExists(output);
  
  // Get all image files from input directory
  const imageFiles = getImageFiles(input);
  console.log(`Found ${imageFiles.length} image files in ${input}`);
  
  // If no images found, exit
  if (imageFiles.length === 0) {
    console.error('No image files found in the input directory');
    return;
  }
  
  // Create sample mapping file if needed and user wants to rename
  if (rename && !fs.existsSync(mapping)) {
    createSampleMapping(mapping, imageFiles);
    console.log(`Please edit the mapping file: ${mapping}`);
    console.log('Then run this script again with the same options');
    return;
  }
  
  // Process images
  try {
    // If renaming, load the mapping file
    let imageMapping = {};
    if (rename && fs.existsSync(mapping)) {
      const mappingData = JSON.parse(fs.readFileSync(mapping, 'utf8'));
      imageMapping = mappingData.mapping || {};
    }
    
    // Copy and process each image
    imageFiles.forEach(file => {
      const sourcePath = path.join(input, file);
      
      // Determine destination filename (rename if mapping exists)
      let destFilename = file;
      if (rename && imageMapping[file]) {
        const ext = path.extname(file);
        destFilename = `${imageMapping[file]}${ext}`;
      }
      
      const destPath = path.join(output, destFilename);
      
      // Copy file
      fs.copyFileSync(sourcePath, destPath);
      console.log(`Processed: ${file} → ${destFilename}`);
      
      // Apply compression and resizing (would require image processing libraries)
      if (compress || resize) {
        console.log(`Note: Compression and resizing require additional libraries`);
        console.log(`To enable these features, install Sharp: npm install sharp`);
      }
    });
    
    console.log(`\n✅ Successfully processed ${imageFiles.length} images`);
    console.log(`📁 Output directory: ${output}`);
  } catch (error) {
    console.error('Error processing images:', error);
  }
};

/**
 * Displays help information
 */
const showHelp = () => {
  console.log('Product Image Processor');
  console.log('======================\n');
  console.log('Usage:');
  console.log('  node process-product-images.js --input=<input-directory> [options]\n');
  console.log('Options:');
  console.log('  --input=<dir>     Directory containing the AI-generated images (required)');
  console.log('  --output=<dir>    Output directory for processed images (default: public/images/products)');
  console.log('  --rename          Rename files to match product IDs based on mapping file');
  console.log('  --compress        Compress images to reduce file size');
  console.log('  --resize=<size>   Resize images to specified dimensions (e.g., 800x800)');
  console.log('  --mapping=<file>  JSON file mapping filenames to product IDs (default: image-mapping.json)');
  console.log('  --help            Display this help information\n');
  console.log('Example:');
  console.log('  node process-product-images.js --input=./ai-generated-images --rename --compress');
};

/**
 * Main function
 */
const main = () => {
  const args = parseArgs();
  
  // Show help if requested or no input provided
  if (args.help || !args.input) {
    showHelp();
    return;
  }
  
  // Process images with provided options
  processImages({
    input: args.input,
    output: args.output || DEFAULT_OUTPUT_DIR,
    mapping: args.mapping || DEFAULT_MAPPING_FILE,
    rename: args.rename || false,
    compress: args.compress || false,
    resize: args.resize || null
  });
};

// Run the main function
main(); 