CREATE TABLE products (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    weight REAL NOT NULL,
    price REAL NOT NULL,
    metal_type TEXT NOT NULL,
    image_filename TEXT
);

INSERT INTO products (name, weight, price, metal_type, image_filename) VALUES
('Smycken 1 - Namn medali i guld', 1.5, 999, 'guld', 'bild1.jpg'),
('Smycken 2 - Namn medali i silver', 3.2, 499, 'silver', 'bild2.jpg'),
('Smycken 3 - Namn medali i guld', 2.8, 299, 'guld', 'bild3.jpg'),
('Smycken 4 - Bild medali i guld', 3.7, 1200, 'guld', 'bild4.jpg'),
('Smycken 5 - Bild medali i silver', 2.4, 999, 'silver', 'bild5.jpg'),
('Smycken 6 - Bild medali i silver', 2.1, 999, 'silver', 'bild6.jpg');
