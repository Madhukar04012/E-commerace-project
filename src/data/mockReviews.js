const mockReviews = {
  '1': [
    {
      id: '101',
      userId: 'user123',
      username: 'AudioEnthusiast',
      rating: 5,
      title: 'Best headphones I've ever owned',
      comment: 'The sound quality is incredible and the noise cancellation works perfectly even in noisy environments. Battery life exceeds expectations!',
      date: new Date('2023-02-15')
    },
    {
      id: '102',
      userId: 'user456',
      username: 'MusicLover99',
      rating: 4,
      title: 'Great sound, slightly tight fit',
      comment: 'Sound quality and battery life are excellent. The only downside is they get a bit uncomfortable after wearing them for several hours.',
      date: new Date('2023-03-10')
    },
    {
      id: '103',
      userId: 'user789',
      username: 'TechReviewer',
      rating: 5,
      title: 'Worth every penny',
      comment: 'These headphones have transformed my listening experience. The noise cancellation is so good I can finally focus in my open office.',
      date: new Date('2023-04-05')
    }
  ],
  '2': [
    {
      id: '201',
      userId: 'user234',
      username: 'FitnessTracker',
      rating: 5,
      title: 'Perfect fitness companion',
      comment: 'Tracks all my workouts accurately and the battery lasts much longer than advertised. The sleep tracking feature has been eye-opening!',
      date: new Date('2023-03-12')
    },
    {
      id: '202',
      userId: 'user567',
      username: 'TechGadgetFan',
      rating: 4,
      title: 'Almost perfect',
      comment: 'Great smartwatch with tons of features. The only reason for 4 stars is that the screen could be a bit brighter for outdoor use.',
      date: new Date('2023-04-18')
    }
  ],
  '3': [
    {
      id: '301',
      userId: 'user345',
      username: 'RemoteWorker',
      rating: 5,
      title: 'Saved my back during WFH',
      comment: 'After months of back pain using a regular chair, this ergonomic chair has made a world of difference. Assembly was straightforward too.',
      date: new Date('2023-05-02')
    },
    {
      id: '302',
      userId: 'user678',
      username: 'OfficePro',
      rating: 4,
      title: 'Good quality, minor adjustability issues',
      comment: 'The chair is well-built and comfortable. I wish the armrests had more adjustment options, but overall a great purchase for the price.',
      date: new Date('2023-06-10')
    }
  ],
  '4': [
    {
      id: '401',
      userId: 'user890',
      username: 'HydrationHero',
      rating: 5,
      title: 'Keeps water cold all day!',
      comment: 'I fill this in the morning with ice water and it's still cold when I leave work. No leaks and the design looks great too.',
      date: new Date('2023-05-22')
    },
    {
      id: '402',
      userId: 'user123',
      username: 'OutdoorEnthusiast',
      rating: 5,
      title: 'Perfect for hiking',
      comment: 'Took this on a 10-mile hike in hot weather and my water stayed cold the whole time. The bottle is durable and didn't dent when I accidentally dropped it.',
      date: new Date('2023-06-30')
    }
  ],
  '5': [
    {
      id: '501',
      userId: 'user456',
      username: 'MinimalistStyle',
      rating: 5,
      title: 'Sleek, functional, and high quality',
      comment: 'This wallet is perfect if you're looking to downsize from a bulky wallet. The leather is high quality and the RFID protection gives peace of mind.',
      date: new Date('2023-07-14')
    }
  ],
  '6': [
    {
      id: '601',
      userId: 'user789',
      username: 'SustainableShopper',
      rating: 5,
      title: 'Soft, comfortable, and eco-friendly',
      comment: 'Love that this shirt is made from organic cotton. It's super soft and hasn't shrunk after multiple washes. Will definitely buy more colors!',
      date: new Date('2023-08-05')
    },
    {
      id: '602',
      userId: 'user234',
      username: 'CasualFashion',
      rating: 4,
      title: 'Great quality but runs small',
      comment: 'The material and construction are excellent, but I recommend sizing up as it runs a bit smaller than expected.',
      date: new Date('2023-09-12')
    }
  ],
  '7': [
    {
      id: '701',
      userId: 'user567',
      username: 'MusicOnTheGo',
      rating: 5,
      title: 'Impressive sound for the size',
      comment: 'I'm amazed at how much sound comes out of this compact speaker. The bass is surprisingly good and it's perfect for pool parties with the waterproof feature.',
      date: new Date('2023-08-18')
    },
    {
      id: '702',
      userId: 'user890',
      username: 'BeachGoer',
      rating: 4,
      title: 'Great outdoor companion',
      comment: 'Used this at the beach several times now. The sound is clear even with background noise, and the sand just wipes right off.',
      date: new Date('2023-09-30')
    }
  ],
  '8': [
    {
      id: '801',
      userId: 'user123',
      username: 'MealPrepPro',
      rating: 5,
      title: 'Perfect for meal prep',
      comment: 'These containers are sturdy and perfectly sized for meal prepping. No plastic taste and they clean up well in the dishwasher.',
      date: new Date('2023-10-05')
    }
  ],
  '9': [
    {
      id: '901',
      userId: 'user456',
      username: 'YogaDaily',
      rating: 5,
      title: 'Best yoga mat I've owned',
      comment: 'The thickness is perfect for protecting my joints without compromising stability. The non-slip surface works even during hot yoga sessions.',
      date: new Date('2023-10-22')
    },
    {
      id: '902',
      userId: 'user789',
      username: 'FlexibilitySeeker',
      rating: 4,
      title: 'Great quality but heavy to carry',
      comment: 'The mat itself is excellent quality with great grip. My only complaint is that it's a bit heavy to carry to class, but the included strap helps.',
      date: new Date('2023-11-15')
    }
  ],
  '10': [
    {
      id: '1001',
      userId: 'user234',
      username: 'SecurityMinded',
      rating: 5,
      title: 'Peace of mind when away from home',
      comment: 'Setup was easy and the app is intuitive. The motion alerts work well without too many false alarms, and the night vision is clear.',
      date: new Date('2023-11-22')
    }
  ],
  '11': [
    {
      id: '1101',
      userId: 'user567',
      username: 'HomeGymEnthusiast',
      rating: 5,
      title: 'Space-saving solution for home gym',
      comment: 'These adjustable dumbbells have completely transformed my home workouts. The adjustment mechanism is quick and secure.',
      date: new Date('2023-12-10')
    },
    {
      id: '1102',
      userId: 'user890',
      username: 'FitnessFanatic',
      rating: 4,
      title: 'Great concept with minor design flaw',
      comment: 'These dumbbells are fantastic for saving space. The only issue is that the selector sometimes sticks when changing weights, but overall still worth it.',
      date: new Date('2023-12-28')
    }
  ],
  '12': [
    {
      id: '1201',
      userId: 'user123',
      username: 'CoffeeConnoisseur',
      rating: 5,
      title: 'Elevates my morning coffee ritual',
      comment: 'The pour over method makes such a difference in taste compared to my old drip machine. This ceramic version retains heat well and looks beautiful on my counter.',
      date: new Date('2024-01-05')
    }
  ]
};

export default mockReviews; 