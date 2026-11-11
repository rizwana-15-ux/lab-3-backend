
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const fs = require("fs");
const path = require("path");

async function initializeDatabase() {
    const db = await open({
        filename: path.join(__dirname, "books.db"),
        driver: sqlite3.Database
    });

    const sql = fs.readFileSync(
        path.join(__dirname, "setup.sql"),
        "utf8"
    );

    await db.exec(sql);

    console.log("Database created successfully!");
    console.log("Book table and sample records inserted.");

    await db.close();
}

initializeDatabase().catch((error) => {
    console.error("Database error:", error.message);
});
