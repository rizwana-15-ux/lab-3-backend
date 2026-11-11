
const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "books.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    console.log("Database connected successfully!");

    app.listen(3000, () => {
      console.log("Server running at http://localhost:3000/");
    });
  } catch (error) {
    console.log(`Database Error: ${error.message}`);
    process.exit(1);
  }
};

// Home route
app.get("/", (request, response) => {
  response.send("Book Management API is running");
});

// GET all books with search, sorting, pagination and price filter
app.get("/books/", async (request, response) => {
  try {
    const {
      search_q = "",
      order_by = "id",
      order = "ASC",
      limit = "10",
      offset = "0",
      min_price,
      max_price,
    } = request.query;

    const allowedColumns = ["id", "title", "author", "price", "pages"];
    const sortOrder = order.toUpperCase();

    if (!allowedColumns.includes(order_by)) {
      return response.status(400).send({
        message: "Invalid order_by column",
      });
    }

    if (!["ASC", "DESC"].includes(sortOrder)) {
      return response.status(400).send({
        message: "Order must be ASC or DESC",
      });
    }

    const pageLimit = Number(limit);
    const pageOffset = Number(offset);

    if (
      !Number.isInteger(pageLimit) ||
      pageLimit <= 0 ||
      !Number.isInteger(pageOffset) ||
      pageOffset < 0
    ) {
      return response.status(400).send({
        message: "Limit must be positive and offset must be zero or greater",
      });
    }

    if (
      (min_price !== undefined && !Number.isFinite(Number(min_price))) ||
      (max_price !== undefined && !Number.isFinite(Number(max_price)))
    ) {
      return response.status(400).send({
        message: "Price filters must be valid numbers",
      });
    }

    if (
      min_price !== undefined &&
      max_price !== undefined &&
      Number(min_price) > Number(max_price)
    ) {
      return response.status(400).send({
        message: "Minimum price cannot be greater than maximum price",
      });
    }

    let query = "SELECT * FROM book WHERE title LIKE ?";
    const params = [`%${search_q}%`];

    if (min_price !== undefined) {
      query += " AND price >= ?";
      params.push(Number(min_price));
    }

    if (max_price !== undefined) {
      query += " AND price <= ?";
      params.push(Number(max_price));
    }

    query += ` ORDER BY ${order_by} ${sortOrder} LIMIT ? OFFSET ?`;
    params.push(pageLimit, pageOffset);

    const books = await db.all(query, params);

    response.status(200).send(books);
  } catch (error) {
    response.status(500).send({
      message: "Unable to get books",
    });
  }
});

// GET book by ID
app.get("/books/:bookId/", async (request, response) => {
  try {
    const { bookId } = request.params;

    const book = await db.get(
      "SELECT * FROM book WHERE id = ?",
      [bookId]
    );

    if (book === undefined) {
      return response.status(404).send({
        message: "Book not found",
      });
    }

    response.status(200).send(book);
  } catch (error) {
    response.status(500).send({
      message: "Unable to get book",
    });
  }
});

// POST - Add a new book
app.post("/books/", async (request, response) => {
  try {
    const { title, author, price, pages } = request.body;

    if (
      typeof title !== "string" ||
      title.trim() === "" ||
      typeof author !== "string" ||
      author.trim() === "" ||
      price === undefined ||
      price === null ||
      price === "" ||
      !Number.isFinite(Number(price))
    ) {
      return response.status(400).send({
        message: "Title, author and a valid numeric price are required",
      });
    }

    if (
      pages !== undefined &&
      (pages === "" || !Number.isFinite(Number(pages)))
    ) {
      return response.status(400).send({
        message: "Pages must be a valid number",
      });
    }

    const insertBookQuery = `
      INSERT INTO book (title, author, price, pages)
      VALUES (?, ?, ?, ?)
    `;

    await db.run(insertBookQuery, [
      title.trim(),
      author.trim(),
      Number(price),
      pages === undefined ? 0 : Number(pages),
    ]);

    response.status(201).send({
      message: "Book added successfully",
    });
  } catch (error) {
    response.status(500).send({
      message: "Unable to add book",
    });
  }
});

// PUT - Update a book
app.put("/books/:bookId/", async (request, response) => {
  try {
    const { bookId } = request.params;
    const { title, author, price, pages } = request.body;

    if (
      typeof title !== "string" ||
      title.trim() === "" ||
      typeof author !== "string" ||
      author.trim() === "" ||
      price === undefined ||
      price === null ||
      price === "" ||
      !Number.isFinite(Number(price))
    ) {
      return response.status(400).send({
        message: "Title, author and a valid numeric price are required",
      });
    }

    if (
      pages !== undefined &&
      (pages === "" || !Number.isFinite(Number(pages)))
    ) {
      return response.status(400).send({
        message: "Pages must be a valid number",
      });
    }

    const existingBook = await db.get(
      "SELECT * FROM book WHERE id = ?",
      [bookId]
    );

    if (existingBook === undefined) {
      return response.status(404).send({
        message: "Book not found",
      });
    }

    const updateBookQuery = `
      UPDATE book
      SET title = ?, author = ?, price = ?, pages = ?
      WHERE id = ?
    `;

    await db.run(updateBookQuery, [
      title.trim(),
      author.trim(),
      Number(price),
      pages === undefined ? existingBook.pages : Number(pages),
      bookId,
    ]);

    response.status(200).send({
      message: "Book updated successfully",
    });
  } catch (error) {
    response.status(500).send({
      message: "Unable to update book",
    });
  }
});

// DELETE - Delete a book
app.delete("/books/:bookId/", async (request, response) => {
  try {
    const { bookId } = request.params;

    const existingBook = await db.get(
      "SELECT * FROM book WHERE id = ?",
      [bookId]
    );

    if (existingBook === undefined) {
      return response.status(404).send({
        message: "Book not found",
      });
    }

    await db.run(
      "DELETE FROM book WHERE id = ?",
      [bookId]
    );

    response.status(200).send({
      message: "Book deleted successfully",
    });
  } catch (error) {
    response.status(500).send({
      message: "Unable to delete book",
    });
  }
});

initializeDBAndServer();
