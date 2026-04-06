const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const {username, password} = req.body;
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  } else if (users.some(user => user.username === username)) {
    return res.status(409).json({message: "Username already exists"});
  } else {
    users.push({username, password});
    return res.status(201).json({message: "User registered successfully"});
  }
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  //Write your code here
  try {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const response = await axios.get(`${baseUrl}/books`);
    return res.send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book list" });
  }
});

// Get the book list (direct data source for async/await route)
public_users.get('/books', function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get book details by ISBN (direct data source for async/await route)
public_users.get('/books/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.send(JSON.stringify(book, null, 4));
  }
  return res.status(404).json({ message: "Book not found" });
});

// Get book details by author (direct data source for async/await route)
public_users.get('/books/author/:author', function (req, res) {
  const author = req.params.author;
  const booksByAuthor = Object.values(books).filter(
    (book) => book.author.toLocaleLowerCase() === author.toLocaleLowerCase()
  );
  if (booksByAuthor.length > 0) {
    return res.send(JSON.stringify(booksByAuthor, null, 4));
  }
  return res.status(404).json({ message: "No books found by this author" });
});

// Get book details by title (direct data source for async/await route)
public_users.get('/books/title/:title', function (req, res) {
  const title = req.params.title;
  const booksByTitle = Object.values(books).filter(
    (book) => book.title.toLocaleLowerCase() === title.toLocaleLowerCase()
  );
  if (booksByTitle.length > 0) {
    return res.send(JSON.stringify(booksByTitle, null, 4));
  }
  return res.status(404).json({ message: "No books found with this title" });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  try {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const response = await axios.get(`${baseUrl}/books/isbn/${isbn}`);
    return res.send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    return res.status(404).json({ message: "Book not found" });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  //Write your code here
  const author = req.params.author;
  try {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const response = await axios.get(`${baseUrl}/books/author/${encodeURIComponent(author)}`);
    return res.send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    return res.status(404).json({ message: "No books found by this author" });
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  //Write your code here
  const title = req.params.title;
  try {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const response = await axios.get(`${baseUrl}/books/title/${encodeURIComponent(title)}`);
    return res.send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  review = books[req.params.isbn].reviews;
  if (review) {
    res.send(JSON.stringify(review,null,4));
  } else {    
    res.status(404).json({message: "No reviews found for this book"});
  }
});

module.exports.general = public_users;
