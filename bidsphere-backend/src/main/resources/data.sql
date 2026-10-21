-- Seed default categories
INSERT IGNORE INTO categories (name, description) VALUES
('Electronics', 'Gadgets, devices, and electronic accessories'),
('Art & Collectibles', 'Paintings, sculptures, antiques, and rare collectibles'),
('Fashion', 'Clothing, shoes, bags, and accessories'),
('Jewelry & Watches', 'Rings, necklaces, luxury watches'),
('Vehicles', 'Cars, motorcycles, and other vehicles'),
('Home & Garden', 'Furniture, decor, and garden supplies'),
('Sports', 'Sports equipment and memorabilia'),
('Books & Media', 'Rare books, vinyl records, and media'),
('Toys & Games', 'Vintage toys, board games, and puzzles'),
('Others', 'Miscellaneous items');

-- Seed admin user (password: admin123)
INSERT IGNORE INTO users (name, email, password, role, enabled, created_at)
VALUES ('Admin', 'admin@bidsphere.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ROLE_ADMIN', true, NOW());
