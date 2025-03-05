import needle from "needle";

const url = 'http://localhost:3000/add-book';

const books = [
    {
        bookName: "Harry Potter and the Philosopher's Stone",
        isbn: "978-0-7475-3269-9",
        author: "J.K Rowling",
        publishedYear: "1997"

    },

    {
        bookName: "Harry Potter and the Chamber of Secrets",
        isbn: "0-7475-3849-2",
        author: "J.K Rowling",
        publishedYear: "1998"

    },

    {
        bookName: "The Little Prince",
        isbn: "978-0156012195",
        author: "Antoine Saint-Exupery",
        publishedYear: "1943"
    }


];

// This sends a POST request using Needle
function addBook(url, bookData, callback) {
    needle.post(url, bookData, { json: true, rejectUnauthorized: false }, (err, resp) => {

        return callback(err, resp, resp ? resp.body : undefined);
    });

}

books.forEach(book => {
    addBook(url, book, (err, resp, body) => {
        if (err) {
            console.error("Error", err);
        }
        else {
            console.log("Response from server:", body);

        }
    });

});


