// Use ESM imports
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import { glob } from 'glob';

// Get current filename and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  // Directories to check for images
  directories: [
    './public/images',
    './src/assets'
  ],
  // Image extensions to check
  extensions: ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif'],
  // Maximum recommended image size in KB
  maxSizeKB: 500,
  // Optimal image formats
  recommendedFormats: ['webp', 'avif'],
  // Report file path
  reportFile: './image-optimization-report.md'
};

// Get all image files
async function getImageFiles() {
  let allFiles = [];

  for (const dir of CONFIG.directories) {
    for (const ext of CONFIG.extensions) {
      const files = await glob(`${dir}/**/*${ext}`);
      allFiles = [...allFiles, ...files];
    }
  }

  return allFiles;
}

// Check image sizes and formats
async function analyzeImages(files) {
  const results = [];

  for (const file of files) {
    try {
      const stats = fs.statSync(file);
      const sizeKB = stats.size / 1024;
      const ext = path.extname(file).toLowerCase();
      const format = ext.replace('.', '');
      const isOptimalFormat = CONFIG.recommendedFormats.includes(format);
      const isOptimalSize = sizeKB <= CONFIG.maxSizeKB;

      results.push({
        file,
        sizeKB: sizeKB.toFixed(2),
        format,
        isOptimalFormat,
        isOptimalSize,
        issues: []
      });

      // Add issues if any
      if (!isOptimalFormat) {
        results[results.length - 1].issues.push(`Consider converting to ${CONFIG.recommendedFormats.join(' or ')}`);
      }
      if (!isOptimalSize) {
        results[results.length - 1].issues.push(`Size exceeds recommended ${CONFIG.maxSizeKB}KB`);
      }

    } catch (err) {
      console.error(`Error analyzing file ${file}:`, err);
    }
  }

  return results;
}

// Generate report
function generateReport(results) {
  const lines = [
    '# Image Optimization Report',
    '',
    '## Summary',
    '',
    `- Total images: ${results.length}`,
    `- Optimized images: ${results.filter(r => r.isOptimalFormat && r.isOptimalSize).length}`,
    `- Images needing optimization: ${results.filter(r => !r.isOptimalFormat || !r.isOptimalSize).length}`,
    '',
    '## Optimization Suggestions',
    '',
  ];

  // Add files that need optimization
  const filesNeedingOptimization = results.filter(r => !r.isOptimalFormat || !r.isOptimalSize);
  
  if (filesNeedingOptimization.length === 0) {
    lines.push('All images are optimized! 🎉');
  } else {
    filesNeedingOptimization.forEach(result => {
      lines.push(`### ${result.file}`);
      lines.push(`- Size: ${result.sizeKB}KB`);
      lines.push(`- Format: ${result.format}`);
      lines.push('- Issues:');
      result.issues.forEach(issue => {
        lines.push(`  - ${issue}`);
      });
      lines.push('');
    });
  }

  return lines.join('\n');
}

// Main function
async function run() {
  console.log(chalk.blue('🔍 Scanning images for optimization opportunities...'));
  
  const files = await getImageFiles();
  console.log(chalk.green(`Found ${files.length} images to analyze.`));
  
  const results = await analyzeImages(files);
  
  // Write report to file
  const report = generateReport(results);
  fs.writeFileSync(CONFIG.reportFile, report);
  
  // Console summary
  const optimizedCount = results.filter(r => r.isOptimalFormat && r.isOptimalSize).length;
  const needsOptimizationCount = results.length - optimizedCount;
  
  console.log('\n--- Image Optimization Summary ---');
  console.log(`Total images: ${chalk.bold(results.length)}`);
  console.log(`Optimized: ${chalk.bold.green(optimizedCount)}`);
  console.log(`Needs optimization: ${chalk.bold.yellow(needsOptimizationCount)}`);
  console.log(chalk.blue(`\nDetailed report saved to: ${CONFIG.reportFile}`));
  
  if (needsOptimizationCount > 0) {
    console.log(chalk.yellow('\nOptimization Tips:'));
    console.log('1. Convert images to WebP format for better compression');
    console.log('2. Resize large images to appropriate dimensions');
    console.log('3. Consider using responsive images with srcset');
    console.log('4. Ensure all images have appropriate alt text');
    console.log('5. Use the LazyImageGallery component for better performance');
  } else {
    console.log(chalk.green('\nAll images are optimized! Great job! 🎉'));
  }
}

// Run the script
run().catch(console.error); 