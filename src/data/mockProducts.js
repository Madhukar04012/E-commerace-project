const mockProducts = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    price: 249.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
    description: 'Experience crystal-clear sound and ultimate comfort with our premium wireless headphones. Features noise cancellation and 30-hour battery life.',
    inStock: true,
    rating: 4.8,
    numReviews: 124,
    features: [
      'Active Noise Cancellation',
      'Premium Sound Quality',
      '30-hour Battery Life',
      'Comfortable Fit',
      'Bluetooth 5.0'
    ],
    createdAt: new Date('2023-01-15')
  },
  {
    id: '2',
    name: 'Smart Watch Series 5',
    price: 399.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
    description: 'Stay connected and track your fitness with our latest smartwatch. Features heart rate monitoring, GPS, and water resistance up to 50 meters.',
    inStock: true,
    rating: 4.6,
    numReviews: 89,
    features: [
      'Heart Rate Monitor',
      'GPS Tracking',
      'Water Resistant (50m)',
      '48-hour Battery Life',
      'Always-on Display'
    ],
    createdAt: new Date('2023-02-20')
  },
  {
    id: '3',
    name: 'Ergonomic Office Chair',
    price: 189.99,
    category: 'Furniture',
    image: 'https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=500&h=500&fit=crop',
    description: 'Work in comfort with our ergonomic office chair. Adjustable lumbar support and breathable mesh design keep you comfortable all day long.',
    inStock: true,
    rating: 4.4,
    numReviews: 76,
    features: [
      'Adjustable Height',
      'Lumbar Support',
      'Breathable Mesh',
      '360° Swivel',
      'Durable Construction'
    ],
    createdAt: new Date('2023-03-10')
  },
  {
    id: '4',
    name: 'Stainless Steel Water Bottle',
    price: 29.99,
    category: 'Kitchen',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop',
    description: 'Stay hydrated with our vacuum-insulated stainless steel water bottle. Keeps drinks cold for 24 hours or hot for 12 hours.',
    inStock: true,
    rating: 4.7,
    numReviews: 152,
    features: [
      'Vacuum Insulated',
      'BPA-Free',
      '750ml Capacity',
      'Leak-Proof Design',
      'Eco-Friendly'
    ],
    createdAt: new Date('2023-04-05')
  },
  {
    id: '5',
    name: 'Classic Leather Wallet',
    price: 49.99,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1627123368811-8224f95affa8?w=500&h=500&fit=crop',
    description: 'Sleek and functional leather wallet with RFID protection. Features multiple card slots and a bill compartment in a slim design.',
    inStock: true,
    rating: 4.5,
    numReviews: 68,
    features: [
      'Genuine Leather',
      'RFID Protection',
      '8 Card Slots',
      'Slim Design',
      'Gift Box Included'
    ],
    createdAt: new Date('2023-05-18')
  },
  {
    id: '6',
    name: 'Organic Cotton T-Shirt',
    price: 24.99,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
    description: 'Comfortable and sustainable organic cotton t-shirt. Available in multiple colors and sizes.',
    inStock: true,
    rating: 4.3,
    numReviews: 92,
    features: [
      '100% Organic Cotton',
      'Eco-Friendly Dyes',
      'Comfortable Fit',
      'Durable Construction',
      'Multiple Colors Available'
    ],
    createdAt: new Date('2023-06-22')
  },
  {
    id: '7',
    name: 'Portable Bluetooth Speaker',
    price: 79.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop',
    description: 'Take your music anywhere with our waterproof portable Bluetooth speaker. Features 12-hour battery life and rich, clear sound.',
    inStock: true,
    rating: 4.6,
    numReviews: 104,
    features: [
      'Waterproof (IPX7)',
      '12-hour Battery Life',
      'Bluetooth 5.0',
      'Built-in Microphone',
      'Compact Design'
    ],
    createdAt: new Date('2023-07-14')
  },
  {
    id: '8',
    name: 'Glass Food Storage Containers (Set of 5)',
    price: 39.99,
    category: 'Kitchen',
    image: 'https://images.unsplash.com/photo-1594228113139-d8eb9f317506?w=500&h=500&fit=crop',
    description: 'Meal prep made easy with our glass food storage containers. Microwave, freezer, and dishwasher safe.',
    inStock: true,
    rating: 4.4,
    numReviews: 56,
    features: [
      'BPA-Free Glass',
      'Leak-Proof Lids',
      'Microwave Safe',
      'Freezer Safe',
      'Dishwasher Safe'
    ],
    createdAt: new Date('2023-08-30')
  },
  {
    id: '9',
    name: 'Yoga Mat Premium',
    price: 59.99,
    category: 'Fitness',
    image: 'https://images.unsplash.com/photo-1599447292180-45fd84092ef4?w=500&h=500&fit=crop',
    description: 'Enhance your yoga practice with our premium non-slip yoga mat. Extra thick for comfort and joint protection.',
    inStock: true,
    rating: 4.7,
    numReviews: 83,
    features: [
      'Non-Slip Surface',
      'Eco-Friendly Materials',
      '6mm Thickness',
      'Carrying Strap Included',
      'Easy to Clean'
    ],
    createdAt: new Date('2023-09-12')
  },
  {
    id: '10',
    name: 'Smart Home Security Camera',
    price: 129.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1563931146627-15dca61032a9?w=500&h=500&fit=crop',
    description: 'Keep your home secure with our 1080p HD security camera. Features motion detection, night vision, and two-way audio.',
    inStock: true,
    rating: 4.5,
    numReviews: 72,
    features: [
      '1080p HD Video',
      'Motion Detection',
      'Night Vision',
      'Two-Way Audio',
      'Cloud Storage'
    ],
    createdAt: new Date('2023-10-05')
  },
  {
    id: '11',
    name: 'Adjustable Dumbbell Set',
    price: 299.99,
    category: 'Fitness',
    image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=500&h=500&fit=crop',
    description: 'Space-saving adjustable dumbbells that replace 15 sets of weights. Adjustable from 5 to 52.5 pounds.',
    inStock: true,
    rating: 4.8,
    numReviews: 65,
    features: [
      'Adjustable from 5-52.5 lbs',
      'Space-Saving Design',
      'Durable Construction',
      'Easy Weight Selection',
      'Storage Tray Included'
    ],
    createdAt: new Date('2023-11-18')
  },
  {
    id: '12',
    name: 'Ceramic Pour-Over Coffee Maker',
    price: 42.99,
    category: 'Kitchen',
    image: 'https://images.unsplash.com/photo-1556742393-d75f468bfcb0?w=500&h=500&fit=crop',
    description: 'Brew the perfect cup of coffee with our ceramic pour-over coffee maker. Comes with a reusable stainless steel filter.',
    inStock: true,
    rating: 4.6,
    numReviews: 47,
    features: [
      'Premium Ceramic',
      'Reusable Filter',
      '500ml Capacity',
      'Heat-Resistant Handle',
      'Dishwasher Safe'
    ],
    createdAt: new Date('2023-12-03')
  }
];

export default mockProducts; 