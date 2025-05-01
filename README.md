# E-Commerce Website

A modern, responsive e-commerce website built with React, featuring dark mode, accessibility features, SEO optimization, and advanced animations.

## 🌟 Live Demo

Visit the live website: [eCommerce Website](https://ecommerce-website-00001.web.app)

## Features

- Modern, polished UI with dark/light mode toggle
- Dynamic product browsing and search
- Detailed product pages with 3D visualization
- Shopping cart functionality with animations
- User authentication with Firebase
- Admin dashboard and management
- Wishlist management
- Secure checkout process
- Order confirmation and tracking
- Flash Deals with real-time countdowns
- Categories section with hover effects
- Multi-language support (i18n)
- Fully responsive design for all devices
- Performance optimized builds
- SEO optimized with react-helmet-async
- Toast notification system
- Accessibility compliant design

## Technology Stack

- React.js 18
- Vite for fast builds
- React Router for navigation
- Context API for state management
- Tailwind CSS for styling
- Framer Motion for animations
- Three.js for 3D effects
- Firebase for backend services and hosting
- i18next for internationalization
- EmailJS for email notifications
- Stripe for payment processing
- GitHub Actions for CI/CD
- React Helmet Async for SEO

## Getting Started

### Prerequisites

- Node.js (v18 or newer)
- npm or yarn
- Git

### Installation

1. Clone the repository
   ```
   git clone https://github.com/Madhukar04012/E-commerace-project.git
   cd ecommerce-website
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173/`

### Deployment

The project is set up for continuous deployment to Firebase Hosting:

1. Build the project
   ```
   npm run build
   ```

2. Deploy to Firebase
   ```
   firebase deploy
   ```

## Project Structure

- `/src` - Source code
  - `/components` - Reusable UI components
  - `/context` - React context providers
  - `/data` - Mock data and configurations
  - `/pages` - Main application pages
  - `/hooks` - Custom React hooks
  - `/utils` - Utility functions
  - `/i18n` - Internationalization files
  - `/firebase` - Firebase configuration
  - `/assets` - Static assets and images
  - `/services` - API and service functions

## Features in Detail

### Enhanced Shopping Experience
- 3D product visualization
- Real-time Flash Deals with countdowns
- Interactive product categories
- Smooth animations and transitions
- Advanced search with Fuse.js
- Dark/light mode theme toggle

### Shopping Cart
- Add/remove items with animations
- Update quantities
- Persistent cart storage
- Real-time cart total calculation
- Cart synchronization across tabs

### User Authentication
- Firebase authentication
- Social media login options
- User profile management
- Order history tracking
- Wishlist synchronization

### Admin Features
- Admin dashboard with analytics
- Product management
- Order processing
- User management
- Access control based on roles

### Product Catalog
- Advanced filtering system
- Dynamic category navigation
- Fuzzy search functionality
- Product ratings and reviews
- Related products suggestions

### Internationalization
- Multi-language support (English, Spanish, French)
- Auto-language detection
- Localized currency display

### Accessibility Features
- Proper color contrast ratios
- ARIA attributes
- Screen reader friendly markup
- Focus management
- Keyboard navigation support

### Performance Optimizations
- Code splitting with Vite
- Lazy loading of components
- Optimized bundle size
- Efficient asset loading with WebP support
- Caching strategies

### CI/CD Pipeline
- Automated builds with GitHub Actions
- Firebase hosting deployment
- Testing integration

## Development Tools

- ESLint for code quality
- Prettier for code formatting
- Lighthouse for performance monitoring
- Bundle analyzer for optimization
- axe for accessibility testing

## Future Enhancements

- AI-powered product recommendations
- Advanced analytics dashboard
- Progressive Web App (PWA) support
- Voice search integration
- AR product visualization
- Social sharing features
- Customer support chat

## Product Image Generation and Management

The project includes tools for generating and managing product images:

- AI-powered product image generation using prompt templates
- Automatic placeholder image generation
- Image processing scripts for optimization
- Product image organization and categorization

### Image Generation Scripts

Located in the `/scripts` directory:

- `generate-product-images.cjs` - Generate AI product images using prompts
- `process-product-images.cjs` - Process and optimize product images
- `download-placeholder-images.js` - Download placeholder images for products

For more details on AI image generation, see [AI-IMAGE-GENERATION.md](AI-IMAGE-GENERATION.md).
For more details on product image management, see [PRODUCT_IMAGES.md](PRODUCT_IMAGES.md).

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- React team for the amazing framework
- Vite team for the build tool
- Firebase team for backend services
- All contributors and supporters
