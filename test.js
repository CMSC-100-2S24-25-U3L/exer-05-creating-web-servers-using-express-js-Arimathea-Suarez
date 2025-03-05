import needle from "needle";

const baseURL = "http://localhost:3000";

// Books to add
const books = [
    {
        bookName: "Harry Potter and the Philosopher's Stone",
        isbn: "978-0-7475-3269-9",
        author: "J.K. Rowling",
        publishedYear: "1997"
    },
    {
        bookName: "Harry Potter and the Chamber of Secrets",
        isbn: "0-7475-3849-2",
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
function addBook(bookData, callback) {
    needle.post(`${baseURL}/add-book`, bookData, { json: true }, (err, resp) => {
        return callback(err, resp, resp ? resp.body : undefined);
    });
}

// Function to test GET request to find book by ISBN and Author
function findBookByISBNAndAuthor(isbn, author, callback) {
    const url = `${baseURL}/find-by-isbn-author?isbn=${encodeURIComponent(isbn)}&author=${encodeURIComponent(author)}`;
    needle.get(url, { json: true }, (err, resp) => {
        return callback(err, resp, resp ? resp.body : undefined);
    });
}

// Function to test GET request to find books by Author only
function findBooksByAuthor(author, callback) {
    const url = `${baseURL}/find-by-author?author=${encodeURIComponent(author)}`;
    needle.get(url, { json: true }, (err, resp) => {
        return callback(err, resp, resp ? resp.body : undefined);
    });
}

console.log("");
console.log("----------------------------------------");
console.log("        Adding Books to Database        ");
console.log("----------------------------------------\n");

let booksAdded = 0;

// Add books sequentially and then retrieve one
books.forEach((book, index) => {
    addBook(book, (err, resp, body) => {
        if (err) {
            console.error("[ERROR] Unable to add book:", err);
        } else {
            console.log(body && body.success ? "[SUCCESS] Book Added:" : "[FAILED] Book Not Added (Duplicate ISBN):");
            console.log("----------------------------------------");
            console.log(`Title          : ${book.bookName}`);
            console.log(`ISBN           : ${book.isbn}`);
            console.log(`Author         : ${book.author}`);
            console.log(`Published Year : ${book.publishedYear}`);
            console.log("----------------------------------------\n");
        }

        booksAdded++;

        // After all books are added, test retrieval
        if (booksAdded === books.length) {
            console.log("");
            console.log("----------------------------------------");
            console.log("    Testing GET /find-by-isbn-author    ");
            console.log("----------------------------------------\n");

            findBookByISBNAndAuthor("978-0-7475-3269-9", "J.K. Rowling", (err, resp, body) => {
                if (err) {
                    console.error("[ERROR] Unable to retrieve book:", err);
                } else if (body && body.success && body.books.length > 0) {
                    console.log("[FOUND] Book Retrieved:");
                    console.log("----------------------------------------");
                    console.log(`Title          : ${body.books[0].bookName}`);
                    console.log(`ISBN           : ${body.books[0].isbn}`);
                    console.log(`Author         : ${body.books[0].author}`);
                    console.log(`Published Year : ${body.books[0].publishedYear}`);
                    console.log("----------------------------------------\n");
                    console.log("");
                } else {
                    console.log("[NOT FOUND] No book matched the search criteria.\n");
                }

                console.log("----------------------------------------");
                console.log("       Testing GET /find-by-author      ");
                console.log("----------------------------------------\n");

                findBooksByAuthor("J.K. Rowling", (err, resp, body) => {
                    if (err) {
                        console.error("[ERROR] Unable to retrieve books:", err);
                    } else if (body && body.success && body.books.length > 0) {
                        console.log(`[FOUND] Book/s by "${body.books[0].author}":`);
                        body.books.forEach((book, idx) => {
                            console.log("----------------------------------------");
                            console.log(`Book #${idx + 1}`);
                            console.log(`Title          : ${book.bookName}`);
                            console.log(`ISBN           : ${book.isbn}`);
                            console.log(`Published Year : ${book.publishedYear}`);
                            console.log("----------------------------------------");
                        });
                        console.log("");
                    } else {
                        console.log("[NOT FOUND] No books found for this author.\n");
                    }
                });
            });
        }
    });
});
