// ============================================
// BOOK MANAGEMENT SYSTEM - Main Server File
// ============================================

// Import required modules
const express = require("express");
const exphbs = require("express-handlebars");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const session = require("express-session");
const path = require("path");

// Initialize Express application
const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// DATABASE SETUP
// ============================================

// Create and connect to SQLite database
const db = new sqlite3.Database("./books.db", (err) => {
  if (err) {
    console.error("Error connecting to database:", err);
  } else {
    console.log("Connected to SQLite database");
    initializeDatabase();
  }
});

// Initialize database tables and insert sample data
function initializeDatabase() {
  // Create Authors table
  db.run(
    `CREATE TABLE IF NOT EXISTS authors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    birth_year INTEGER,
    country TEXT
  )`,
    (err) => {
      if (err) console.error("Error creating authors table:", err);
    }
  );

  // Create Genres table
  db.run(
    `CREATE TABLE IF NOT EXISTS genres (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT
  )`,
    (err) => {
      if (err) console.error("Error creating genres table:", err);
    }
  );

  // Create Books table with foreign keys
  db.run(
    `CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author_id INTEGER,
    genre_id INTEGER,
    publication_year INTEGER,
    isbn TEXT,
    pages INTEGER,
    FOREIGN KEY (author_id) REFERENCES authors(id),
    FOREIGN KEY (genre_id) REFERENCES genres(id)
  )`,
    (err) => {
      if (err) console.error("Error creating books table:", err);
      else insertSampleData();
    }
  );
}

// Insert sample data into database
function insertSampleData() {
  // Check if data already exists
  db.get("SELECT COUNT(*) as count FROM authors", (err, row) => {
    if (err || row.count > 0) return;

    // Insert sample authors
    const authors = [
      ["Gabriel García Márquez", 1927, "Colombia"],
      ["Jane Austen", 1775, "England"],
      ["George Orwell", 1903, "England"],
      ["Haruki Murakami", 1949, "Japan"],
      ["Chimamanda Ngozi Adichie", 1977, "Nigeria"],
      ["Paulo Coelho", 1947, "Brazil"],
    ];

    authors.forEach((author) => {
      db.run(
        "INSERT INTO authors (name, birth_year, country) VALUES (?, ?, ?)",
        author
      );
    });

    // Insert sample genres
    const genres = [
      ["Fiction", "Literary fiction and novels"],
      ["Science Fiction", "Speculative and futuristic stories"],
      ["Mystery", "Detective and crime stories"],
      ["Romance", "Love and relationship stories"],
      ["Fantasy", "Magical and imaginary worlds"],
      ["Classic", "Timeless literary works"],
    ];

    genres.forEach((genre) => {
      db.run("INSERT INTO genres (name, description) VALUES (?, ?)", genre);
    });

    // Insert sample books
    const books = [
      ["One Hundred Years of Solitude", 1, 1, 1967, "978-0060883287", 417],
      ["Pride and Prejudice", 2, 4, 1813, "978-0141439518", 432],
      ["1984", 3, 2, 1949, "978-0451524935", 328],
      ["Norwegian Wood", 4, 4, 1987, "978-0375704024", 296],
      ["Half of a Yellow Sun", 5, 1, 2006, "978-1400095209", 433],
      ["The Alchemist", 6, 1, 1988, "978-0062315007", 208],
      ["Love in the Time of Cholera", 1, 4, 1985, "978-0307389732", 348],
      ["Animal Farm", 3, 6, 1945, "978-0451526342", 141],
      ["Kafka on the Shore", 4, 5, 2002, "978-1400079278", 505],
      ["Americanah", 5, 1, 2013, "978-0307455925", 477],
    ];

    books.forEach((book) => {
      db.run(
        "INSERT INTO books (title, author_id, genre_id, publication_year, isbn, pages) VALUES (?, ?, ?, ?, ?, ?)",
        book
      );
    });

    console.log("Sample data inserted successfully");
  });
}

// ============================================
// MIDDLEWARE CONFIGURATION
// ============================================

// Configure Handlebars template engine
const hbs = exphbs.create({
  defaultLayout: "main",
  extname: ".hbs",
  // Helper functions for templates
  helpers: {
    // Check if two values are equal
    eq: function (a, b) {
      return a === b;
    },
    // Subtract two numbers (for pagination)
    subtract: function (a, b) {
      return a - b;
    },
    // Add two numbers (for pagination)
    add: function (a, b) {
      return a + b;
    },
    // Get substring (for book initials)
    substring: function (str, start, end) {
      if (str) return str.substring(start, end).toUpperCase();
      return "";
    },
  },
});

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", "./views");

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files (CSS, images, etc.)
app.use(express.static("public"));

// Session configuration for login system
app.use(
  session({
    secret: "book-management-secret-key-2025",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 }, // 1 hour session
  })
);

// Middleware to make user session available in all templates
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  res.locals.isLoggedIn = !!req.session.user;
  next();
});

// ============================================
// ROUTE HANDLERS
// ============================================

// HOME PAGE
app.get("/", (req, res) => {
  res.render("home", {
    title: "Home - Book Management System",
    page: "home",
  });
});

// LIST PAGE - Display books with pagination and JOIN
app.get("/list", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 3;
  const offset = (page - 1) * limit;

  // Query with INNER JOIN to combine books, authors, and genres
  const query = `
    SELECT books.*, authors.name as author_name, genres.name as genre_name
    FROM books
    INNER JOIN authors ON books.author_id = authors.id
    INNER JOIN genres ON books.genre_id = genres.id
    LIMIT ? OFFSET ?
  `;

  // Get total count for pagination
  db.get("SELECT COUNT(*) as total FROM books", (err, countRow) => {
    if (err) {
      console.error("Error counting books:", err);
      return res.status(500).send("Database error");
    }

    const totalPages = Math.ceil(countRow.total / limit);

    // Get books for current page
    db.all(query, [limit, offset], (err, books) => {
      if (err) {
        console.error("Error fetching books:", err);
        return res.status(500).send("Database error");
      }

      res.render("list", {
        title: "Books List",
        page: "list",
        books: books,
        currentPage: page,
        totalPages: totalPages,
        hasPrev: page > 1,
        hasNext: page < totalPages,
      });
    });
  });
});

// DETAIL PAGE - Show individual book details
app.get("/book/:id", (req, res) => {
  const bookId = req.params.id;

  // Query with INNER JOIN for detailed book information
  const query = `
    SELECT books.*, authors.name as author_name, authors.country, 
           genres.name as genre_name, genres.description as genre_description
    FROM books
    INNER JOIN authors ON books.author_id = authors.id
    INNER JOIN genres ON books.genre_id = genres.id
    WHERE books.id = ?
  `;

  db.get(query, [bookId], (err, book) => {
    if (err) {
      console.error("Error fetching book:", err);
      return res.status(500).send("Database error");
    }

    if (!book) {
      return res.status(404).send("Book not found");
    }

    res.render("detail", {
      title: book.title,
      page: "detail",
      book: book,
    });
  });
});

// EDIT PAGE - Show edit form (only for logged-in users)
app.get("/book/:id/edit", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  const bookId = req.params.id;

  // Get book details
  db.get("SELECT * FROM books WHERE id = ?", [bookId], (err, book) => {
    if (err || !book) {
      return res.status(404).send("Book not found");
    }

    // Get all authors for dropdown
    db.all("SELECT * FROM authors", (err, authors) => {
      if (err) authors = [];

      // Get all genres for dropdown
      db.all("SELECT * FROM genres", (err, genres) => {
        if (err) genres = [];

        res.render("edit", {
          title: "Edit Book",
          page: "edit",
          book: book,
          authors: authors,
          genres: genres,
        });
      });
    });
  });
});

// UPDATE BOOK - Process edit form (POST)
app.post("/book/:id/edit", (req, res) => {
  if (!req.session.user) {
    return res.status(403).send("Unauthorized");
  }

  const bookId = req.params.id;
  const { title, author_id, genre_id, publication_year, isbn, pages } =
    req.body;

  // Validate and sanitize input to prevent SQL injection
  const query = `
    UPDATE books 
    SET title = ?, author_id = ?, genre_id = ?, 
        publication_year = ?, isbn = ?, pages = ?
    WHERE id = ?
  `;

  db.run(
    query,
    [title, author_id, genre_id, publication_year, isbn, pages, bookId],
    (err) => {
      if (err) {
        console.error("Error updating book:", err);
        return res.status(500).send("Error updating book");
      }

      res.redirect("/book/" + bookId);
    }
  );
});

// DELETE BOOK
app.post("/book/:id/delete", (req, res) => {
  if (!req.session.user) {
    return res.status(403).send("Unauthorized");
  }

  const bookId = req.params.id;

  db.run("DELETE FROM books WHERE id = ?", [bookId], (err) => {
    if (err) {
      console.error("Error deleting book:", err);
      return res.status(500).send("Error deleting book");
    }

    res.redirect("/list");
  });
});

// ADD NEW BOOK PAGE
app.get("/add", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  // Get authors and genres for dropdowns
  db.all("SELECT * FROM authors", (err, authors) => {
    if (err) authors = [];

    db.all("SELECT * FROM genres", (err, genres) => {
      if (err) genres = [];

      res.render("add", {
        title: "Add New Book",
        page: "add",
        authors: authors,
        genres: genres,
      });
    });
  });
});

// CREATE NEW BOOK (POST)
app.post("/add", (req, res) => {
  if (!req.session.user) {
    return res.status(403).send("Unauthorized");
  }

  const { title, author_id, genre_id, publication_year, isbn, pages } =
    req.body;

  // Validate and insert new book
  const query = `
    INSERT INTO books (title, author_id, genre_id, publication_year, isbn, pages)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [title, author_id, genre_id, publication_year, isbn, pages],
    function (err) {
      if (err) {
        console.error("Error adding book:", err);
        return res.status(500).send("Error adding book");
      }

      res.redirect("/book/" + this.lastID);
    }
  );
});

// ABOUT PAGE
app.get("/about", (req, res) => {
  res.render("about", {
    title: "About",
    page: "about",
  });
});

// CONTACT PAGE
app.get("/contact", (req, res) => {
  res.render("contact", {
    title: "Contact",
    page: "contact",
  });
});

// LOGIN PAGE
app.get("/login", (req, res) => {
  if (req.session.user) {
    return res.redirect("/");
  }

  res.render("login", {
    title: "Login",
    page: "login",
  });
});

// LOGIN PROCESS (POST)
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Hardcoded credentials as per requirements
  const validUsername = "admin";
  const hashedPassword =
    "$2b$12$p5.UuPb9Zh.siIc78Ie.Nu9eGx9d5OLT2pkecedig2P.6CdfL1ZUa";

  // Check username and verify hashed password
  if (username === validUsername) {
    const match = await bcrypt.compare(password, hashedPassword);

    if (match) {
      req.session.user = { username: validUsername };
      return res.redirect("/");
    }
  }

  res.render("login", {
    title: "Login",
    page: "login",
    error: "Invalid username or password",
  });
});

// LOGOUT
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log("Login credentials: username: admin, password: wdf#2025");
});
