CREATE TABLE items (
    id INTEGER PRIMARY KEY,
    session_num NOT NULL, 
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    weight REAL,
    metal_type TEXT,
    shape TEXT,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);