import needle from "needle";

const url = 'http://localhost:3000/add-book';

const books = [
    {
        bookName: "Harry Potter and the Philosopher's Stone",
        isbn: "978-0-7475-3269-9",
        author: "J.K. Rowling",
        publishedYear: "1997"
    },
    {
        bookName: "Harry Potter and the Chamber of Secrets",
        isbn: "0-7475-3849-2", // Different ISBN
        author: "J.K. Rowling",
        publishedYear: "1998"
    },
    {
        bookName: "The Little Prince",
        isbn: "978-0156012195",
        author: "Antoine de Saint-Exupéry",
        publishedYear: "1943"
    }
];

// Function to send a POST request using Needle
function addBook(url, bookData) {
    return new Promise((resolve) => {
        needle.post(url, bookData, { json: true }, (err, resp) => {
            if (err) {
                console.error(`Error adding "${bookData.bookName}":`, err);
                resolve({ success: false });
            } else {
                console.log(resp.body); // Log response
                resolve(resp.body);
            }
        });
    });
}

// Loop through the books array and send individual POST requests
(async () => {
    for (const book of books) {
        await addBook(url, book);
    }
})();
