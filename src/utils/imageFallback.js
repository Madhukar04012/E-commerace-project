/**
 * A reusable SVG fallback image for when product images fail to load.
 * This avoids external dependencies that might cause network errors.
 */
export const DEFAULT_FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='Arial' font-size='24' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";

/**
 * A smaller fallback image for cart items and thumbnails
 */
export const SMALL_FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='Arial' font-size='12' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";

/**
 * Utility function to handle image loading errors
 * @param {Event} e - The error event from the image
 * @param {string} size - The size of the fallback image ('default' or 'small')
 */
export const handleImageError = (e, size = 'default') => {
  e.target.onerror = null; // Prevent infinite error loops
  e.target.src = size === 'small' ? SMALL_FALLBACK_IMAGE : DEFAULT_FALLBACK_IMAGE;
}; 