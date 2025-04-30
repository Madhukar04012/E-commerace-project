import React, { useState } from 'react';

// Default fallback SVG placeholder
const defaultFallbackSrc = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNFNUU3RUIiLz48cGF0aCBkPSJNMTc5LjE2IDIwMC43NzVDMTc5LjE2IDIyNi41ODkgMTU4LjE5NSAyNDcuNTU0IDEzMi4zODIgMjQ3LjU1NEMxMDYuNTY4IDI0Ny41NTQgODUuNjAzNCAyMjYuNTg5IDg1LjYwMzQgMjAwLjc3NUM4NS42MDM0IDE3NC45NjIgMTA2LjU2OCAxNTMuOTk3IDEzMi4zODIgMTUzLjk5N0MxNTguMTk1IDE1My45OTcgMTc5LjE2IDE3NC45NjIgMTc5LjE2IDIwMC43NzVaIiBmaWxsPSIjOTRBM0IzIi8+PHBhdGggZD0iTTI0OS4xMjEgOTUuNzExTDMwNi44MTMgMjAzLjQ0TDMzOC40MjMgMjAzLjQ0TDI0OS4xMjEgNjVMMTU5LjgxOSAyMDMuNDRIMTkxLjQyOUwyNDkuMTIxIDk1LjcxMVoiIGZpbGw9IiM5NEEzQjMiLz48cGF0aCBkPSJNMzUwLjc4OCAyMDMuNDRIMzgyLjM5OEwyOTMuMDk2IDY1TDI2MC4wMjIgMTE4LjcyNEwzMDYuODEzIDIwMy40NEgzNTAuNzg4WiIgZmlsbD0iIzk0QTNCMyIvPjwvc3ZnPg==';

/**
 * Enhanced image component with:
 * - WebP support with fallbacks
 * - Lazy loading
 * - Error handling with fallback
 * - Responsive sizing
 */
const ImageWithFallback = ({ 
  src, 
  webpSrc, // WebP version of the image
  alt, 
  fallbackSrc = defaultFallbackSrc, 
  className = "", 
  width,
  height,
  eager = false, // Set to true for above-the-fold content
  sizes = "", // Responsive size hints
  ...rest 
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setImgSrc(fallbackSrc);
      setHasError(true);
    }
  };

  // If webpSrc is provided, use picture element for better browser support
  if (webpSrc) {
    return (
      <picture>
        <source srcSet={webpSrc} type="image/webp" />
        <source srcSet={src} type={`image/${src.split('.').pop()}`} />
        <img
          src={imgSrc}
          alt={alt}
          onError={handleError}
          className={`transition-opacity duration-300 ${className}`}
          width={width}
          height={height}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          sizes={sizes}
          {...rest}
          style={{
            objectFit: "cover",
            ...rest.style,
          }}
        />
      </picture>
    );
  }

  // Regular image fallback
  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={handleError}
      className={`transition-opacity duration-300 ${className}`}
      width={width}
      height={height}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      sizes={sizes}
      {...rest}
      style={{
        objectFit: "cover",
        ...rest.style,
      }}
    />
  );
};

/**
 * Responsive image gallery with lazy loading
 */
export const LazyImageGallery = ({ 
  images, 
  containerClassName = "", 
  imageClassName = "",
  columns = { default: 1, sm: 2, md: 3, lg: 4 }
}) => {
  // Generate responsive grid classes
  const gridClass = `grid grid-cols-${columns.default} sm:grid-cols-${columns.sm} md:grid-cols-${columns.md} lg:grid-cols-${columns.lg} gap-4`;
  
  return (
    <div className={`${gridClass} ${containerClassName}`}>
      {images.map((image, index) => (
        <div key={index} className="overflow-hidden rounded-lg">
          <ImageWithFallback
            src={image.src}
            webpSrc={image.webpSrc}
            alt={image.alt || `Image ${index + 1}`}
            width={image.width || 400}
            height={image.height || 400}
            className={`w-full h-auto hover:scale-105 transition-transform duration-300 ${imageClassName}`}
            sizes={image.sizes || "(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"}
          />
        </div>
      ))}
    </div>
  );
};

export default ImageWithFallback; 