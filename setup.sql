
CREATE TABLE IF NOT EXISTS book (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    price INTEGER NOT NULL,
    pages INTEGER NOT NULL
);

INSERT INTO book (title, author, price, pages)
SELECT 'The Kite Runner', 'Khaled Hosseini', 299, 371
WHERE NOT EXISTS (SELECT 1 FROM book);

INSERT INTO book (title, author, price, pages)
SELECT 'A Thousand Splendid Suns', 'Khaled Hosseini', 350, 432
WHERE NOT EXISTS (SELECT 1 FROM book WHERE title = 'A Thousand Splendid Suns');

INSERT INTO book (title, author, price, pages)
SELECT 'Wings of Fire', 'A.P.J. Abdul Kalam', 250, 180
WHERE NOT EXISTS (SELECT 1 FROM book WHERE title = 'Wings of Fire');

INSERT INTO book (title, author, price, pages)
SELECT 'The Alchemist', 'Paulo Coelho', 200, 208
WHERE NOT EXISTS (SELECT 1 FROM book WHERE title = 'The Alchemist');

INSERT INTO book (title, author, price, pages)
SELECT 'Atomic Habits', 'James Clear', 399, 320
WHERE NOT EXISTS (SELECT 1 FROM book WHERE title = 'Atomic Habits');

INSERT INTO book (title, author, price, pages)
SELECT 'Ikigai', 'Hector Garcia', 275, 194
WHERE NOT EXISTS (SELECT 1 FROM book WHERE title = 'Ikigai');

INSERT INTO book (title, author, price, pages)
SELECT 'Rich Dad Poor Dad', 'Robert Kiyosaki', 300, 336
WHERE NOT EXISTS (SELECT 1 FROM book WHERE title = 'Rich Dad Poor Dad');

INSERT INTO book (title, author, price, pages)
SELECT 'The Power of Your Subconscious Mind', 'Joseph Murphy', 220, 256
WHERE NOT EXISTS (SELECT 1 FROM book WHERE title = 'The Power of Your Subconscious Mind');

INSERT INTO book (title, author, price, pages)
SELECT 'Deep Work', 'Cal Newport', 320, 296
WHERE NOT EXISTS (SELECT 1 FROM book WHERE title = 'Deep Work');

INSERT INTO book (title, author, price, pages)
SELECT 'Think and Grow Rich', 'Napoleon Hill', 280, 238
WHERE NOT EXISTS (SELECT 1 FROM book WHERE title = 'Think and Grow Rich');
