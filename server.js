// Arimathea Charmille H. Suarez
// CMSC 100 - U3L
//Description:


// Imports
import express from 'express';
import fs from 'fs';
import path from 'path';

// List of constants
const app = express();
const PORT = 3000;
const FILE_PATH = path.join(process.cwd(), "books.txt");


const uniqueIBSN = (isbn) => {
    if (!fs.existsSync(FILE_PATH)) return true;
    const data = fs.readFileSync(FILE_PATH, "utf8");
    return !data.split("\n").some(line => {
        if (!line.trim()) return false;
        const parts = line.split(",");

        return parts[1] && parts[1].trim() === isbn;
    });

};

app.use(express.json()); // To parse with the JSON file

// The root endpoint
app.get('/', (req, res) => {
    res.send('Hello!');
});


// The first method
app.post("/add-book", (req, res) => {
    const { bookName, isbn, author, publishedYear } = req.body;


    // Conditions 
    if (!bookName || !isbn || !author || !publishedYear) {
        return res.json({ success: false });
    }

    if (!uniqueIBSN) {
        return res.json({ success: false });
    }

    // The format of the book entry
    const bookEntry = `${bookName}, ${isbn}, ${author}, ${publishedYear} \n`;


    // This is to append the data in books.txt
    fs.appendFile(FILE_PATH, bookEntry, (err) => {
        if (err) {
            return res.json({ success: false });
        }
        res.json({ success: true });

    });

});




// This is to initialize the server
app.listen(PORT, () => {
    console.log(`Server has started at ${PORT}`);

});


