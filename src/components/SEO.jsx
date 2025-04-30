import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
  title = 'StyleShop - Premium Fashion & Lifestyle Products',
  description = 'Discover premium fashion, accessories, and lifestyle products with exceptional quality and style at StyleShop.',
  keywords = 'fashion, clothing, accessories, lifestyle, premium, style, online shopping',
  author = 'StyleShop',
  canonicalUrl,
  ogType = 'website',
  ogImage = '/images/og-image.jpg',
  ogTitle,
  ogDescription,
  twitterCard = 'summary_large_image',
  twitterTitle,
  twitterDescription,
  twitterImage,
  additionalMetaTags = [],
  children
}) => {
  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={twitterTitle || ogTitle || title} />
      <meta name="twitter:description" content={twitterDescription || ogDescription || description} />
      {(twitterImage || ogImage) && <meta name="twitter:image" content={twitterImage || ogImage} />}
      
      {/* Additional Meta Tags */}
      {additionalMetaTags.map((tag, index) => (
        <meta key={index} {...tag} />
      ))}
      
      {/* Additional Elements */}
      {children}
    </Helmet>
  );
};

export default SEO; 