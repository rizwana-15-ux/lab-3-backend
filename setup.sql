
DROP TABLE IF EXISTS book;

CREATE TABLE book (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    price INTEGER NOT NULL,
    pages INTEGER NOT NULL
);

INSERT INTO book (title, author, price, pages)
VALUES
('The Kite Runner', 'Khaled Hosseini', 299, 371),
('A Thousand Splendid Suns', 'Khaled Hosseini', 350, 432),
('Wings of Fire', 'A.P.J. Abdul Kalam', 250, 180),
('The Alchemist', 'Paulo Coelho', 200, 208),
('Atomic Habits', 'James Clear', 399, 320),
('Ikigai', 'Hector Garcia', 275, 194),
('Rich Dad Poor Dad', 'Robert Kiyosaki', 300, 336),
('The Power of Your Subconscious Mind', 'Joseph Murphy', 220, 256),
('Deep Work', 'Cal Newport', 320, 296),
('Think and Grow Rich', 'Napoleon Hill', 280, 238);
