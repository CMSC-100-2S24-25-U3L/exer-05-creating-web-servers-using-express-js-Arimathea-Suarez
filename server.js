// Arimathea Charmille H. Suarez
// CMSC 100 - U3L
// Description: Express server to add books and search using ISBN and Author

// Imports
import express from "express";
import fs from "fs";
import path from "path";

// Constants
const app = express();
const PORT = 3000;
const FILE_PATH = path.join(process.cwd(), "books.txt");

app.use(express.json()); // To parse JSON request bodies

// Function to get books from the file
const getBooks = () => {
    if (!fs.existsSync(FILE_PATH)) return [];

    try {
        const data = fs.readFileSync(FILE_PATH, "utf8").trim();
        if (!data) return [];

        return data.split("\n").map(line => {
            const parts = line.split(",").map(part => part.trim());
            return {
                bookName: parts[0],
                isbn: parts[1],
                author: parts[2],
                publishedYear: parts[3],
            };
        });
    } catch (err) {
        console.error(" Error reading file:", err);
        return [];
    }
};

// Function to check if ISBN is unique
const isUniqueISBN = (isbn) => {
    const books = getBooks();
    return !books.some(book => book.isbn === isbn.trim());
};

// The root endpoint
app.get("/", (req, res) => {
    res.send("Hello!");
});

// POST method to add a book
app.post("/add-book", (req, res) => {
    const { bookName, isbn, author, publishedYear } = req.body;

    if (!bookName || !isbn || !author || !publishedYear) {
        return res.json({ success: false });
    }

    if (!isUniqueISBN(isbn)) {
        return res.json({ success: false });
    }

    const bookEntry = `${bookName}, ${isbn}, ${author}, ${publishedYear}\n`;

    try {
        fs.appendFileSync(FILE_PATH, bookEntry, "utf8");
        return res.json({ success: true });
    } catch (err) {
        console.error(" File write error:", err);
        return res.json({ success: false });
    }
});

//  GET method to find a book by ISBN and Author
app.get("/find-by-isbn-author", (req, res) => {
    const { isbn, author } = req.query;

    if (!isbn || !author) {
        return res.json({ success: false, books: [] });
    }

    const books = getBooks();
    const matchingBooks = books.filter(book => book.isbn === isbn.trim() && book.author === author.trim());

    if (matchingBooks.length > 0) {
        return res.json({ success: true, books: matchingBooks });
    } else {
        return res.json({ success: false, books: [] });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(` Server running at http://localhost:${PORT}`);
});
