// Arimathea Charmille H. Suarez
// CMSC 100 - U3L
// Description: Express server to add books to a file ensuring unique ISBN entries

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
    if (!fs.existsSync(FILE_PATH)) return []; // If file does not exist, return empty array

    try {
        const data = fs.readFileSync(FILE_PATH, "utf8").trim();
        if (!data) return []; // If file is empty, return empty array

        return data.split("\n").map(line => line.trim());
    } catch (err) {
        console.error(" Error reading file:", err);
        return [];
    }
};

// Function to check if ISBN is unique
const isUniqueISBN = (isbn) => {
    const books = getBooks();

    return !books.some((line) => {
        const parts = line.split(",").map(part => part.trim());
        return parts.length > 1 && parts[1] === isbn.trim(); // Check ISBN uniqueness
    });
};

// The root endpoint
app.get("/", (req, res) => {
    res.send("Hello!");
});

// The POST method to add a book
app.post("/add-book", (req, res) => {
    const { bookName, isbn, author, publishedYear } = req.body;

    // Ensure all fields exist and are not empty
    if (!bookName || !isbn || !author || !publishedYear) {
        return res.json({ success: false });
    }

    // Check if ISBN is unique
    if (!isUniqueISBN(isbn)) {
        return res.json({ success: false });
    }

    // The format of the book entry
    const bookEntry = `${bookName}, ${isbn}, ${author}, ${publishedYear}\n`;

    // Append to the file
    try {
        fs.appendFileSync(FILE_PATH, bookEntry, "utf8");
        return res.json({ success: true });
    } catch (err) {
        console.error(" File write error:", err);
        return res.json({ success: false });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(` Server running at http://localhost:${PORT}`);
});
