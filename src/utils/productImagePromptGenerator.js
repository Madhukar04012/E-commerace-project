/**
 * Product Image Prompt Generator
 * 
 * This utility generates AI image generation prompts for e-commerce products
 * based on their details (name, category, brand, etc.).
 * 
 * The prompts follow a consistent template suitable for DALL-E, Midjourney, or similar AI image generators.
 */

import mockProducts from '../data/mockProducts';
import fs from 'fs';
import path from 'path';

/**
 * Generates an AI image prompt for a product
 * @param {Object} product - The product object
 * @returns {string} The AI image generation prompt
 */
export const generatePromptForProduct = (product) => {
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
 * Generates prompts for all products and saves to a file
 */
export const generateAllProductPrompts = () => {
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
export const savePromptsToFile = (outputPath = 'product-image-prompts.json') => {
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
 * Main function to run the prompt generator
 */
const main = () => {
  // Generate and log a single product prompt example
  if (mockProducts.length > 0) {
    const sampleProduct = mockProducts[0];
    console.log('Sample prompt for:', sampleProduct.name);
    console.log(generatePromptForProduct(sampleProduct));
    console.log('\n');
  }
  
  // Save all prompts to file
  savePromptsToFile();
};

// Export default function for CLI usage
export default main;

// If this file is run directly (not imported), execute the main function
if (typeof require !== 'undefined' && require.main === module) {
  main();
} 