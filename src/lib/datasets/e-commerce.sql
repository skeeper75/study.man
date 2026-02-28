-- E-Commerce Dataset
-- Schema: products, users, orders, reviews

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  category VARCHAR(50) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id),
  product_id INT REFERENCES products(id),
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL
);

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  product_id INT REFERENCES products(id),
  rating INT CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed: Users (20)
INSERT INTO users (name, email) VALUES
  ('Kim Minjun', 'minjun@example.com'),
  ('Lee Seoyon', 'seoyon@example.com'),
  ('Park Doyun', 'doyun@example.com'),
  ('Choi Siwoo', 'siwoo@example.com'),
  ('Jung Haeun', 'haeun@example.com'),
  ('Kang Jiwon', 'jiwon@example.com'),
  ('Yoon Yejun', 'yejun@example.com'),
  ('Lim Chaewon', 'chaewon@example.com'),
  ('Shin Junwoo', 'junwoo@example.com'),
  ('Han Somin', 'somin@example.com'),
  ('Song Jiho', 'jiho@example.com'),
  ('Jang Yuna', 'yuna@example.com'),
  ('Oh Seojin', 'seojin@example.com'),
  ('Bae Hajun', 'hajun@example.com'),
  ('Kwon Yerin', 'yerin@example.com'),
  ('Seo Donghyun', 'donghyun@example.com'),
  ('Hong Minji', 'minji@example.com'),
  ('Yoo Taeyeon', 'taeyeon@example.com'),
  ('Noh Jihoon', 'jihoon@example.com'),
  ('Moon Soyeon', 'soyeon@example.com');

-- Seed: Products (25)
INSERT INTO products (name, category, price, stock) VALUES
  ('Wireless Earbuds', 'Electronics', 59.99, 150),
  ('Laptop Stand', 'Accessories', 34.99, 80),
  ('Mechanical Keyboard', 'Electronics', 129.99, 45),
  ('USB-C Hub', 'Accessories', 49.99, 120),
  ('Monitor Light Bar', 'Electronics', 79.99, 60),
  ('Ergonomic Mouse', 'Electronics', 69.99, 90),
  ('Webcam HD', 'Electronics', 89.99, 55),
  ('Desk Mat', 'Accessories', 24.99, 200),
  ('Cable Management Kit', 'Accessories', 19.99, 300),
  ('Screen Protector', 'Accessories', 14.99, 500),
  ('Bluetooth Speaker', 'Electronics', 44.99, 75),
  ('Phone Stand', 'Accessories', 12.99, 250),
  ('LED Strip Lights', 'Electronics', 22.99, 180),
  ('Portable Charger', 'Electronics', 39.99, 100),
  ('Mouse Pad XL', 'Accessories', 29.99, 160),
  ('Headphone Stand', 'Accessories', 19.99, 110),
  ('Smart Plug', 'Electronics', 15.99, 220),
  ('HDMI Cable 4K', 'Accessories', 9.99, 400),
  ('Ring Light', 'Electronics', 54.99, 65),
  ('Wrist Rest', 'Accessories', 17.99, 140),
  ('External SSD 1TB', 'Electronics', 89.99, 40),
  ('USB Microphone', 'Electronics', 74.99, 50),
  ('Laptop Bag', 'Accessories', 44.99, 95),
  ('Wireless Charger', 'Electronics', 29.99, 130),
  ('Notebook Set', 'Accessories', 8.99, 350);

-- Seed: Orders (30)
INSERT INTO orders (user_id, total_amount, status) VALUES
  (1, 94.98, 'completed'), (2, 129.99, 'completed'), (3, 59.99, 'shipped'),
  (4, 164.97, 'completed'), (5, 34.99, 'pending'), (6, 79.99, 'completed'),
  (7, 89.99, 'shipped'), (8, 44.98, 'completed'), (9, 49.99, 'completed'),
  (10, 199.97, 'completed'), (1, 69.99, 'shipped'), (2, 24.99, 'completed'),
  (3, 129.99, 'pending'), (4, 54.99, 'completed'), (5, 89.99, 'shipped'),
  (6, 39.99, 'completed'), (7, 74.99, 'completed'), (8, 119.98, 'shipped'),
  (9, 29.99, 'completed'), (10, 44.99, 'pending'), (11, 159.98, 'completed'),
  (12, 34.99, 'completed'), (13, 69.99, 'shipped'), (14, 49.99, 'completed'),
  (15, 89.99, 'completed'), (16, 24.99, 'pending'), (17, 79.99, 'completed'),
  (18, 129.99, 'shipped'), (19, 44.99, 'completed'), (20, 59.99, 'completed');

-- Seed: Order Items (40)
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
  (1, 1, 1, 59.99), (1, 2, 1, 34.99), (2, 3, 1, 129.99),
  (3, 1, 1, 59.99), (4, 3, 1, 129.99), (4, 2, 1, 34.99),
  (5, 2, 1, 34.99), (6, 5, 1, 79.99), (7, 7, 1, 89.99),
  (8, 8, 1, 24.99), (8, 9, 1, 19.99), (9, 4, 1, 49.99),
  (10, 3, 1, 129.99), (10, 6, 1, 69.99), (11, 6, 1, 69.99),
  (12, 8, 1, 24.99), (13, 3, 1, 129.99), (14, 19, 1, 54.99),
  (15, 21, 1, 89.99), (16, 14, 1, 39.99), (17, 22, 1, 74.99),
  (18, 1, 1, 59.99), (18, 1, 1, 59.99), (19, 24, 1, 29.99),
  (20, 23, 1, 44.99), (21, 3, 1, 129.99), (21, 15, 1, 29.99),
  (22, 2, 1, 34.99), (23, 6, 1, 69.99), (24, 4, 1, 49.99),
  (25, 21, 1, 89.99), (26, 8, 1, 24.99), (27, 5, 1, 79.99),
  (28, 3, 1, 129.99), (29, 11, 1, 44.99), (30, 1, 1, 59.99),
  (10, 15, 1, 29.99), (4, 9, 1, 19.99), (21, 20, 1, 17.99),
  (18, 10, 1, 14.99);

-- Seed: Reviews (25)
INSERT INTO reviews (user_id, product_id, rating, comment) VALUES
  (1, 1, 5, 'Excellent sound quality!'),
  (2, 3, 4, 'Great keyboard, a bit loud though'),
  (3, 1, 4, 'Good value for money'),
  (4, 5, 5, 'Perfect for late night work'),
  (5, 2, 3, 'Decent stand but wobbles slightly'),
  (6, 7, 4, 'Clear image quality'),
  (7, 6, 5, 'Very comfortable for long sessions'),
  (8, 8, 4, 'Nice desk mat, good size'),
  (9, 4, 5, 'Essential for my setup'),
  (10, 3, 5, 'Best keyboard I have owned'),
  (1, 6, 4, 'Smooth scrolling'),
  (2, 5, 5, 'Reduced eye strain significantly'),
  (3, 7, 3, 'Average webcam for the price'),
  (4, 11, 4, 'Good sound for portable speaker'),
  (5, 14, 5, 'Charges quickly'),
  (6, 21, 5, 'Fast transfer speeds'),
  (7, 22, 4, 'Clear audio recording'),
  (8, 19, 3, 'Ring light is okay'),
  (9, 24, 4, 'Convenient wireless charging'),
  (10, 13, 5, 'Love the LED effects'),
  (11, 1, 4, 'Battery life could be better'),
  (12, 3, 5, 'Perfect mechanical keyboard'),
  (13, 6, 4, 'Ergonomic and comfortable'),
  (14, 5, 4, 'Good monitor light'),
  (15, 2, 5, 'Sturdy laptop stand');
