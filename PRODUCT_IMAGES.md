# Product Image Generation Guide

This guide explains how to use the AI image generation tools included in this project to create professional, high-quality product images for your e-commerce website.

## Overview

The project includes several utilities for:

1. **Generating AI Image Prompts** - Creates optimized prompts for AI image generation tools like DALL-E, Midjourney, or similar platforms
2. **Creating Placeholder Images** - Generates colorful SVG placeholders with product initials
3. **Processing AI-Generated Images** - Helps you organize, rename, and optimize images once generated

## Getting Started

### Step 1: Generate Image Prompts

Run the following command to generate AI image prompts for all products in your catalog:

```bash
npm run generate-image-prompts
```

This will:
- Create prompts tailored to each product based on name, brand, features, etc.
- Save these prompts to `product-image-prompts.json` in the project root
- Show a sample prompt in the console

### Step 2: Generate AI Images

Use the prompts from Step 1 with an AI image generation tool of your choice:

1. Copy a prompt from `product-image-prompts.json`
2. Paste it into DALL-E, Midjourney, or similar
3. Download the generated image
4. Repeat for all products (or prioritize your most important products)

**Pro Tip**: Use the same prompt template for all products to maintain visual consistency.

### Step 3: Create Placeholder Images (Optional)

While waiting for AI-generated images, you can create colorful placeholders:

```bash
npm run generate-placeholders
```

This will generate SVG placeholders with product initials for each product in your catalog.

### Step 4: Process Generated Images

Once you have AI-generated images, process them with:

```bash
npm run process-images --input=./your-images-folder --rename
```

This tool will:
1. Create a mapping file that helps match images to product IDs
2. Copy and rename your images to match product IDs
3. Put them in the correct location

For more options:

```bash
npm run process-images --help
```

## Image Best Practices

For consistency across your e-commerce site, follow these best practices:

- **Dimensions**: Use square images (1:1 aspect ratio)
- **Resolution**: Aim for 800×800 pixels or higher
- **Format**: Use JPEG for photos, PNG for illustrations, WebP for best compression
- **Compression**: Compress images to reduce file size
- **Background**: Use white backgrounds for all product images
- **Lighting**: Ensure consistent lighting across all products
- **Angle**: Use front-facing angles for main product images

## Advanced: Custom Image Generation

If you want to customize the image prompt generation, edit:
- `src/utils/productImagePromptGenerator.js`

You can adjust the prompt template, add more product details, or modify the weight given to different attributes.

## Troubleshooting

**Images not appearing?**
- Check that the file names match product IDs
- Ensure images are in the correct directory (`public/images/products/`)
- Verify file permissions

**Poor quality AI-generated images?**
- Try refining the prompt with more specific details
- Include brand, color, and key features
- Specify "professional lighting" and "high resolution"

## Need Help?

If you need assistance with image generation, try:
- Refining prompts in Midjourney by adding "--v 6" for latest model
- Using DALL-E's editing features to refine specific parts of images
- Experimenting with different prompt styles for different product categories 