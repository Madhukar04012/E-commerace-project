// src/data/products.js
export const products = [
    {
      id: 1,
      name: "Wireless Headphones",
      description: "Premium wireless headphones with noise cancellation. These headphones feature Bluetooth 5.0 connectivity, 30-hour battery life, and deep bass response. Perfect for travel, work, or everyday listening.",
      price: 199.99,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
      category: "Electronics",
      stock: 15,
      ratings: {
        average: 4.7,
        count: 128
      },
      reviews: [
        {
          id: 101,
          userId: "user1",
          userName: "Sarah Johnson",
          rating: 5,
          comment: "Best headphones I've ever owned! The noise cancellation is incredible.",
          date: "2023-07-15"
        },
        {
          id: 102,
          userId: "user2",
          userName: "Michael Chen",
          rating: 4,
          comment: "Great sound quality, but the ear cups could be more comfortable for extended wear.",
          date: "2023-08-03"
        },
        {
          id: 103,
          userId: "user3",
          userName: "Jessica Williams",
          rating: 5,
          comment: "Battery life is amazing! I only need to charge them once a week.",
          date: "2023-09-12"
        }
      ]
    },
    {
      id: 2,
      name: "Smart Watch",
      description: "Feature-rich smartwatch with fitness tracking, heart rate monitor, sleep analysis, and notification support. Water-resistant design with a 5-day battery life.",
      price: 249.99,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
      category: "Electronics",
      stock: 22,
      ratings: {
        average: 4.5,
        count: 89
      },
      reviews: [
        {
          id: 201,
          userId: "user4",
          userName: "David Smith",
          rating: 5,
          comment: "This watch has transformed my fitness routine. The tracking is spot on!",
          date: "2023-06-20"
        },
        {
          id: 202,
          userId: "user5",
          userName: "Emily Parker",
          rating: 4,
          comment: "Love the features, but the screen could be brighter for outdoor use.",
          date: "2023-08-17"
        }
      ]
    },
    {
      id: 3,
      name: "Leather Wallet",
      description: "Genuine leather wallet with multiple card slots and RFID protection. Slim design fits comfortably in pocket while providing ample storage for cards and cash.",
      price: 49.99,
      image: "https://images.unsplash.com/photo-1627123424574-724758594e93",
      category: "Accessories",
      stock: 35,
      ratings: {
        average: 4.8,
        count: 156
      },
      reviews: [
        {
          id: 301,
          userId: "user6",
          userName: "Robert Johnson",
          rating: 5,
          comment: "Perfect size and excellent quality leather. Very satisfied!",
          date: "2023-07-28"
        },
        {
          id: 302,
          userId: "user7",
          userName: "Amanda Lee",
          rating: 5,
          comment: "Bought this as a gift for my husband and he loves it. Great craftsmanship!",
          date: "2023-09-05"
        },
        {
          id: 303,
          userId: "user8",
          userName: "Thomas Brown",
          rating: 4,
          comment: "Good quality and nice design. Would prefer more card slots though.",
          date: "2023-10-02"
        }
      ]
    },
    {
      id: 4,
      name: "Backpack",
      description: "Durable backpack with laptop compartment and multiple storage pockets. Water-resistant material and ergonomic design make it perfect for daily commute or travel.",
      price: 79.99,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
      category: "Accessories",
      stock: 18,
      ratings: {
        average: 4.4,
        count: 72
      },
      reviews: [
        {
          id: 401,
          userId: "user9",
          userName: "Jennifer Wilson",
          rating: 4,
          comment: "Spacious and comfortable to wear. The laptop compartment fits my 15-inch laptop perfectly.",
          date: "2023-08-12"
        },
        {
          id: 402,
          userId: "user10",
          userName: "Kevin Martinez",
          rating: 5,
          comment: "Used this for a week-long trip and it was fantastic. Very well made!",
          date: "2023-09-20"
        }
      ]
    },
    {
      id: 5,
      name: "Coffee Maker",
      description: "Programmable coffee maker with thermal carafe to keep coffee hot for hours. Features adjustable brew strength and automatic shut-off for safety.",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1621494547943-2aa9d4290d7d",
      category: "Home",
      stock: 10,
      ratings: {
        average: 4.6,
        count: 115
      },
      reviews: [
        {
          id: 501,
          userId: "user11",
          userName: "Patricia Miller",
          rating: 5,
          comment: "Makes the perfect cup of coffee every time. The thermal carafe is a game-changer!",
          date: "2023-07-05"
        },
        {
          id: 502,
          userId: "user12",
          userName: "Brian Taylor",
          rating: 4,
          comment: "Great coffee maker, though it takes up a bit of counter space.",
          date: "2023-08-30"
        },
        {
          id: 503,
          userId: "user13",
          userName: "Sarah Anderson",
          rating: 5,
          comment: "Easy to program and clean. Very happy with this purchase!",
          date: "2023-10-10"
        }
      ]
    },
    {
      id: 6,
      name: "Desk Lamp",
      description: "Adjustable LED desk lamp with multiple brightness levels and color temperatures. Energy-efficient with touch controls and flexible gooseneck design.",
      price: 39.99,
      image: "https://images.unsplash.com/photo-1614898983622-f20044c60b30",
      category: "Home",
      stock: 27,
      ratings: {
        average: 4.3,
        count: 68
      },
      reviews: [
        {
          id: 601,
          userId: "user14",
          userName: "Daniel Robinson",
          rating: 4,
          comment: "Good lamp with nice lighting options. Perfect for my home office.",
          date: "2023-08-22"
        },
        {
          id: 602,
          userId: "user15",
          userName: "Lisa Garcia",
          rating: 5,
          comment: "Love the different color temperatures! Makes reading much more comfortable.",
          date: "2023-09-15"
        }
      ]
    }
];
  