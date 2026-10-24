export const INITIAL_CATEGORIES = [
  { id: 1, name: 'Luxury Watches', description: 'Swiss timepieces, vintage chronographs, and haute horlogerie' },
  { id: 2, name: 'Vintage & Classic Cars', description: 'Iconic sports cars, restomods, and rare collector vehicles' },
  { id: 3, name: 'Modern & Fine Art', description: 'Original canvases, sculptures, and limited edition prints' },
  { id: 4, name: 'High-End Electronics', description: 'Flagship cameras, studio sound, and next-gen tech' },
  { id: 5, name: 'Rare Collectibles & Cards', description: 'Graded sports cards, rare memorabilia, and first editions' },
  { id: 6, name: 'Fine Jewelry & Gems', description: 'Natural diamonds, emeralds, and designer jewelry' }
];

// Helper to create future/past ISO timestamps
const minutesFromNow = (mins) => new Date(Date.now() + mins * 60 * 1000).toISOString();
const hoursFromNow = (hrs) => new Date(Date.now() + hrs * 3600 * 1000).toISOString();
const daysFromNow = (days) => new Date(Date.now() + days * 86400 * 1000).toISOString();

export const INITIAL_AUCTIONS = [
  {
    id: 101,
    title: '1971 Porsche 911T Coupe — Matching Numbers Ivory',
    description: 'Immaculately restored 2.2L flat-six with mechanical fuel injection. Finished in Light Ivory over black leatherette with houndstooth inserts. Complete service records dating back to 1974.',
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    condition: 'MINT_COLLECTOR',
    categoryName: 'Vintage & Classic Cars',
    categoryId: 2,
    sellerId: 2,
    sellerName: 'Marcus Heritage Motors',
    startingPrice: 45000.00,
    currentPrice: 68500.00,
    minIncrement: 500.00,
    highestBidderName: 'David H.',
    highestBidderId: 3,
    startTime: daysFromNow(-2),
    endTime: minutesFromNow(18), // Ending very soon!
    status: 'ACTIVE',
    bidCount: 24,
    createdAt: daysFromNow(-3)
  },
  {
    id: 102,
    title: 'Rolex Cosmograph Daytona 116500LN — White "Panda" Dial',
    description: 'Unworn 2023 full set Rolex Daytona with Cerachrom ceramic bezel and Oysterlock bracelet. Includes original green box, guarantee card, manual, and bezel protector.',
    imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80',
    condition: 'NEW_UNWORN',
    categoryName: 'Luxury Watches',
    categoryId: 1,
    sellerId: 4,
    sellerName: 'Geneva Vaults',
    startingPrice: 18000.00,
    currentPrice: 27400.00,
    minIncrement: 200.00,
    highestBidderName: 'Elena Rostova',
    highestBidderId: 5,
    startTime: daysFromNow(-1),
    endTime: hoursFromNow(3),
    status: 'ACTIVE',
    bidCount: 31,
    createdAt: daysFromNow(-2)
  },
  {
    id: 103,
    title: 'Leica M11 Rangefinder Digital Camera 60MP Black',
    description: 'Flagship rangefinder featuring a 60MP BSI CMOS Triple Resolution sensor. Pristine condition with Leica Summilux-M 35mm f/1.4 ASPH lens, extra battery, and artisan leather strap.',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80',
    condition: 'LIKE_NEW',
    categoryName: 'High-End Electronics',
    categoryId: 4,
    sellerId: 2,
    sellerName: 'Optic Archive',
    startingPrice: 6200.00,
    currentPrice: 7850.00,
    minIncrement: 50.00,
    highestBidderName: 'Kenji Sato',
    highestBidderId: 6,
    startTime: daysFromNow(-1),
    endTime: hoursFromNow(14),
    status: 'ACTIVE',
    bidCount: 15,
    createdAt: daysFromNow(-1)
  },
  {
    id: 104,
    title: 'Abstract Expressionist Canvas "Nebula Veil" (1988)',
    description: 'Signed large format acrylic on linen (180cm x 140cm). Exhibited at Biennale Arte with Certificate of Authenticity from the artist foundation. Museum quality framing.',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
    condition: 'ORIGINAL_ARTWORK',
    categoryName: 'Modern & Fine Art',
    categoryId: 3,
    sellerId: 7,
    sellerName: 'Sol Gallery Paris',
    startingPrice: 12000.00,
    currentPrice: 15400.00,
    minIncrement: 250.00,
    highestBidderName: 'Charlotte Sterling',
    highestBidderId: 8,
    startTime: daysFromNow(-3),
    endTime: hoursFromNow(26),
    status: 'ACTIVE',
    bidCount: 19,
    createdAt: daysFromNow(-4)
  },
  {
    id: 105,
    title: '1999 Pokémon 1st Edition Shadowless Charizard Holo PSA 9',
    description: 'Iconic Holy Grail of Pokémon trading cards. Graded Mint 9 by PSA. Flawless surface gloss, sharp corners, and pristine holographic pattern.',
    imageUrl: 'https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?auto=format&fit=crop&w=1200&q=80',
    condition: 'GRADED_PSA_9',
    categoryName: 'Rare Collectibles & Cards',
    categoryId: 5,
    sellerId: 4,
    sellerName: 'Nostalgia Vault LLC',
    startingPrice: 9500.00,
    currentPrice: 14200.00,
    minIncrement: 100.00,
    highestBidderName: 'Alex Mercer',
    highestBidderId: 9,
    startTime: daysFromNow(-1),
    endTime: minutesFromNow(4), // Anti-sniping showcase!
    status: 'ACTIVE',
    bidCount: 42,
    createdAt: daysFromNow(-2)
  },
  {
    id: 106,
    title: 'Cartier High Jewelry Panthère Diamond & Emerald Ring',
    description: '18K White Gold set with 545 brilliant-cut diamonds totaling 4.28 carats, two emerald eyes, and onyx nose. Comes with Cartier red box, travel pouch, and original certification.',
    imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80',
    condition: 'EXCELLENT',
    categoryName: 'Fine Jewelry & Gems',
    categoryId: 6,
    sellerId: 7,
    sellerName: 'Atelier Bijoux',
    startingPrice: 22000.00,
    currentPrice: 28500.00,
    minIncrement: 300.00,
    highestBidderName: 'Sophia Lorenzen',
    highestBidderId: 10,
    startTime: daysFromNow(-4),
    endTime: daysFromNow(2),
    status: 'ACTIVE',
    bidCount: 16,
    createdAt: daysFromNow(-4)
  }
];

export const INITIAL_BIDS = {
  101: [
    { id: 501, auctionId: 101, bidderId: 3, bidderName: 'David H.', amount: 68500.00, bidTime: minutesFromNow(-3) },
    { id: 502, auctionId: 101, bidderId: 12, bidderName: 'Arthur Morgan', amount: 67500.00, bidTime: minutesFromNow(-8) },
    { id: 503, auctionId: 101, bidderId: 15, bidderName: 'John Marston', amount: 66000.00, bidTime: minutesFromNow(-15) },
    { id: 504, auctionId: 101, bidderId: 3, bidderName: 'David H.', amount: 64500.00, bidTime: minutesFromNow(-25) }
  ],
  105: [
    { id: 601, auctionId: 105, bidderId: 9, bidderName: 'Alex Mercer', amount: 14200.00, bidTime: minutesFromNow(-1) },
    { id: 602, auctionId: 105, bidderId: 8, bidderName: 'Charlotte Sterling', amount: 14000.00, bidTime: minutesFromNow(-2) },
    { id: 603, auctionId: 105, bidderId: 11, bidderName: 'Gary Oak', amount: 13700.00, bidTime: minutesFromNow(-5) }
  ]
};

export const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: 'Outbid Alert',
    message: 'You have been outbid on "1971 Porsche 911T Coupe". The new current bid is $68,500.',
    read: false,
    type: 'OUTBID',
    auctionId: 101,
    createdAt: minutesFromNow(-3)
  },
  {
    id: 2,
    title: 'Auction Won! 🎉',
    message: 'Congratulations! You won "Audemars Piguet Royal Oak Jumbo". Please proceed to checkout.',
    read: false,
    type: 'AUCTION_WON',
    auctionId: 99,
    createdAt: hoursFromNow(-2)
  },
  {
    id: 3,
    title: 'Anti-Sniping Extension Activated',
    message: 'A bid was placed in the last 2 minutes for "1st Edition Charizard". End time extended by 2 minutes!',
    read: true,
    type: 'ANTI_SNIPE',
    auctionId: 105,
    createdAt: minutesFromNow(-1)
  }
];
