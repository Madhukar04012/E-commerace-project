#!/usr/bin/env node

/**
 * Product Image Prompt Generator Script
 * 
 * This script generates AI image prompts for all products in the catalog
 * and optionally creates placeholder images.
 * 
 * Usage:
 *   node generate-product-images.cjs [--placeholders]
 *   
 *   Options:
 *     --placeholders  Create placeholder images for products
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Define mock products directly in the script
const mockProducts = [
  {
    "id": "1",
    "name": "Premium Wireless Headphones",
    "price": 249.99,
    "category": "Electronics",
    "brand": "SoundMax",
    "description": "High-quality wireless headphones with noise cancellation",
    "features": ["Noise Cancellation", "30-hour Battery"]
  },
  {
    "id": "2",
    "name": "Smart Watch Series 5",
    "price": 399.99,
    "category": "Electronics",
    "brand": "TechFit",
    "description": "Feature-rich smartwatch with health monitoring",
    "features": ["Heart Rate Monitor", "GPS Tracking"]
  },
  {
    "id": "3",
    "name": "Ergonomic Office Chair",
    "price": 189.99,
    "category": "Furniture",
    "brand": "ComfortPlus",
    "description": "Comfortable office chair with lumbar support",
    "features": ["Lumbar Support", "Adjustable Height"]
  }
];

// Configuration
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'images', 'products');
const PLACEHOLDERS_DIR = path.join(OUTPUT_DIR, 'placeholders');
const PROMPT_FILE = path.join(__dirname, '..', 'product-image-prompts.json');

// Ensure directories exist
const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
};

/**
 * Generates an AI image prompt for a product
 * @param {Object} product - The product object
 * @returns {string} The AI image generation prompt
 */
const generatePromptForProduct = (product) => {
  // Extract key product information
  const { name, category, brand, description } = product;
  
  // Extract key features if available
  let features = [];
  if (product.features && product.features.length > 0) {
    // Only use first 2 features to keep prompt concise
    features = product.features.slice(0, 2);
  }
  
  // Extract color information if it exists in the name or description
  let colorInfo = "";
  const colorKeywords = ["black", "white", "red", "blue", "green", "silver", "gold", "gray", "brown", "pink", "purple"];
  
  for (const color of colorKeywords) {
    if (name.toLowerCase().includes(color) || 
        (description && description.toLowerCase().includes(color))) {
      colorInfo = `, ${color} color`;
      break;
    }
  }
  
  // Generate the base prompt
  let prompt = `High-resolution studio photo of a ${name}`;
  
  // Add brand if available
  if (brand) {
    prompt += ` by ${brand}`;
  }
  
  // Add key features if available
  if (features.length > 0) {
    prompt += ` with ${features.join(' and ')}`;
  }
  
  // Add color information if found
  prompt += colorInfo;
  
  // Complete the prompt with standard formatting requirements
  prompt += `, isolated on a clean white background, centered, soft shadows, professional lighting, ecommerce-ready, crisp focus, no background elements, front-facing angle`;
  
  return prompt;
};

/**
 * Generates prompts for all products
 */
const generateAllProductPrompts = () => {
  try {
    const prompts = mockProducts.map(product => {
      return {
        id: product.id,
        name: product.name,
        prompt: generatePromptForProduct(product)
      };
    });
    
    return prompts;
  } catch (error) {
    console.error('Error generating product prompts:', error);
    return [];
  }
};

/**
 * Saves all product prompts to a JSON file
 */
const savePromptsToFile = (outputPath = PROMPT_FILE) => {
  try {
    const prompts = generateAllProductPrompts();
    
    // Create JSON with prompts
    const promptData = {
      generated: new Date().toISOString(),
      prompts: prompts
    };
    
    // Convert to JSON string with formatted spacing
    const jsonContent = JSON.stringify(promptData, null, 2);
    
    // Save to file
    fs.writeFileSync(outputPath, jsonContent);
    
    console.log(`Successfully saved ${prompts.length} product image prompts to ${outputPath}`);
    return true;
  } catch (error) {
    console.error('Error saving prompts to file:', error);
    return false;
  }
};

/**
 * Creates colorful SVG placeholders for products without images
 */
const createPlaceholders = () => {
  ensureDirectoryExists(PLACEHOLDERS_DIR);
  
  console.log('🖼️ Generating placeholder images...');
  let count = 0;
  
  // Process each product
  for (const product of mockProducts) {
    const placeholderPath = path.join(PLACEHOLDERS_DIR, `${product.id}.svg`);
    
    // Skip if placeholder already exists
    if (fs.existsSync(placeholderPath)) {
      continue;
    }
    
    try {
      // Create a placeholder with product initials and a unique color
      const initials = getInitials(product.name);
      const color = generateUniqueColor(product.id);
      
      // Generate SVG placeholder
      const svgContent = generatePlaceholderSVG(initials, color);
      
      // Save SVG placeholder
      fs.writeFileSync(placeholderPath, svgContent);
      console.log(`Created placeholder for: ${product.name}`);
      count++;
    } catch (error) {
      console.error(`Error creating placeholder for ${product.name}:`, error);
    }
  }
  
  console.log(`✅ Created ${count} placeholder images in ${PLACEHOLDERS_DIR}`);
};

/**
 * Get initials from a product name
 */
const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .substring(0, 2)
    .toUpperCase();
};

/**
 * Generate a unique color based on the product ID
 */
const generateUniqueColor = (id) => {
  // Generate a color based on the product ID
  const hue = parseInt(id, 10) % 360;
  return `hsl(${hue}, 70%, 65%)`;
};

/**
 * Generate SVG content for a placeholder
 */
const generatePlaceholderSVG = (initials, backgroundColor) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <rect width="400" height="400" fill="${backgroundColor}"/>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="120" font-weight="bold" 
          fill="white" text-anchor="middle" dominant-baseline="middle">${initials}</text>
    <text x="50%" y="85%" font-family="Arial, sans-serif" font-size="24" 
          fill="rgba(255,255,255,0.8)" text-anchor="middle">Placeholder</text>
  </svg>`;
};

/**
 * Main function
 */
const main = () => {
  console.log('🚀 E-commerce Product Image Generator');
  console.log('==================================\n');
  
  // Generate prompts for all products
  const success = savePromptsToFile();
  
  if (success) {
    console.log('✅ All prompts generated successfully');
    console.log(`📄 Saved to: ${PROMPT_FILE}`);
    
    // Display a sample prompt
    const prompts = generateAllProductPrompts();
    if (prompts.length > 0) {
      console.log('\n📝 Sample prompt:');
      console.log(`🔹 Product: ${prompts[0].name}`);
      console.log(`🔹 Prompt: ${prompts[0].prompt}`);
    }
  } else {
    console.error('❌ Failed to generate prompts');
  }
  
  // Check if we should generate placeholder images
  if (process.argv.includes('--placeholders')) {
    console.log('\n🖼️ Creating placeholder images...');
    createPlaceholders();
  }
  
  console.log('\n✨ Done! Use the generated prompts with DALL-E, Midjourney, or similar AI tools to create product images.');
  console.log('💡 TIP: To generate placeholder images, run: node scripts/generate-product-images.js --placeholders');
};

// Run the main function
main(); 