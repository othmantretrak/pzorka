# Book Management System

Academic project for web development using Node.js, Express, Handlebars, and SQLite3.

## 📋 Project Requirements Met

### Technical Requirements

- ✅ **Node.js + Express** - Server-side framework
- ✅ **Handlebars (.hbs)** - Template engine (no React)
- ✅ **SQLite3** - Relational database
- ✅ **4 Pages with Menu**: Home, List, About, Contact
- ✅ **Pagination** - 3 items per page (10 books total)
- ✅ **3 Database Tables** - Books, Authors, Genres
- ✅ **INNER JOIN** - Combines books with authors and genres
- ✅ **CRUD Operations** - Create, Read, Update, Delete
- ✅ **Login System** - Username: `admin`, Password: `wdf#2025`
- ✅ **Password Encryption** - bcrypt hashing
- ✅ **Security** - SQL injection prevention using parameterized queries
- ✅ **Flexbox & Grid** - Modern CSS layouts
- ✅ **Code Comments** - Clear documentation throughout

## 🗂️ Project Structure

```
book-management-system/
├── server.js                 # Main server file
├── package.json              # Dependencies
├── books.db                  # SQLite database (auto-created)
├── views/
│   ├── layouts/
│   │   └── main.hbs         # Main layout template
│   ├── home.hbs             # Home page
│   ├── list.hbs             # Books list with pagination
│   ├── detail.hbs           # Book detail view
│   ├── edit.hbs             # Edit book form
│   ├── add.hbs              # Add new book form
│   ├── about.hbs            # About page
│   ├── contact.hbs          # Contact page
│   └── login.hbs            # Login page
└── public/
    └── styles.css           # CSS with Flexbox and Grid
```

## 🚀 Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

### Step 1: Install Dependencies

```bash
npm install
```

This will install:

- express - Web framework
- express-handlebars - Template engine
- sqlite3 - Database
- bcrypt - Password hashing
- express-session - Session management

### Step 2: Start the Server

```bash
npm start
```

Or for development with auto-restart:

```bash
npm run dev
```

### Step 3: Access the Application

Open your browser and navigate to:

```
http://localhost:3000
```

## 🔐 Login Credentials

**Username:** `admin`  
**Password:** `wdf#2025`

The password is hashed using bcrypt:

```
$2b$12$p5.UuPb9Zh.siIc78Ie.Nu9eGx9d5OLT2pkecedig2P.6CdfL1ZUa
```

## 📊 Database Structure

### Authors Table

- `id` (INTEGER, PRIMARY KEY)
- `name` (TEXT)
- `birth_year` (INTEGER)
- `country` (TEXT)

**Sample Data:** 6 authors including Gabriel García Márquez, Jane Austen, George Orwell, etc.

### Genres Table

- `id` (INTEGER, PRIMARY KEY)
- `name` (TEXT)
- `description` (TEXT)

**Sample Data:** 6 genres including Fiction, Science Fiction, Mystery, etc.

### Books Table

- `id` (INTEGER, PRIMARY KEY)
- `title` (TEXT)
- `author_id` (INTEGER, FOREIGN KEY)
- `genre_id` (INTEGER, FOREIGN KEY)
- `publication_year` (INTEGER)
- `isbn` (TEXT)
- `pages` (INTEGER)

**Sample Data:** 10 books with proper relationships

### INNER JOIN Query Example

```sql
SELECT books.*, authors.name as author_name, genres.name as genre_name
FROM books
INNER JOIN authors ON books.author_id = authors.id
INNER JOIN genres ON books.genre_id = genres.id
```

## ✨ Features

### 1. Home Page

- Hero section with welcome message
- Feature cards showcasing system capabilities
- System information grid

### 2. Books List (Pagination)

- Displays 3 books per page
- Navigation between pages
- Click any book to view details
- Add new book button (logged-in users only)

### 3. Book Detail View

- Complete book information
- Author and genre details
- Edit and Delete buttons (logged-in users only)
- Confirmation dialog for deletion

### 4. CRUD Operations

**CREATE** - Add new book (requires login)

- Form with all book fields
- Author and genre dropdowns
- Validation

**READ** - View books

- List view with pagination
- Detailed individual view
- INNER JOIN queries

**UPDATE** - Edit existing book (requires login)

- Pre-filled form
- All fields editable

**DELETE** - Remove book (requires login)

- Confirmation required
- Redirect to list after deletion

### 5. Authentication

- Login page with credentials
- Session management
- Protected routes for modifications
- Logout functionality
- User status display in navbar

### 6. Security

- **SQL Injection Protection:** Parameterized queries
- **Password Hashing:** bcrypt encryption
- **Session Security:** express-session
- **Authorization:** Route protection

## 🎨 UI/UX Design

### CSS Layouts

- **Flexbox:** Navigation, buttons, forms, cards
- **CSS Grid:** Feature cards, book grid, info sections
- **Responsive:** Mobile-friendly with media queries

### Color Scheme

- Primary: Purple gradient (#667eea to #764ba2)
- Background: White with light gray cards
- Text: Dark gray (#333)
- Accents: Various button colors

### Design Principles

- Clean and modern interface
- Intuitive navigation
- Clear visual hierarchy
- Consistent spacing
- Smooth transitions

## 📝 Code Documentation

All code includes clear comments explaining:

- Purpose of each section
- Function descriptions
- Query explanations
- Layout techniques
- Security measures

## 🧪 Testing the Application

### Test CRUD Operations

1. **View Books** - Go to "Books List" page
2. **Add Book** - Login, click "Add New Book"
3. **Edit Book** - Login, go to any book detail, click "Edit"
4. **Delete Book** - Login, go to any book detail, click "Delete"

### Test Pagination

- Navigate through pages using Previous/Next buttons
- Verify 3 books per page
- Check page counter

### Test Authentication

- Try accessing `/add` without login (redirects to login)
- Login with correct credentials
- Try accessing edit/delete features
- Verify logout functionality

### Test Security

- Check that SQL queries use parameterized statements
- Verify password is hashed in code
- Test that modifications require authentication

## 📚 Technologies Used

- **Backend:** Node.js v14+
- **Framework:** Express v4.18
- **Template Engine:** Handlebars v7.1
- **Database:** SQLite3 v5.1
- **Authentication:** bcrypt v5.1
- **Session:** express-session v1.17
- **CSS:** Custom (Flexbox + Grid)

## 🎓 Academic Compliance

This project meets all academic requirements:

- No React or REST API (uses Handlebars templates)
- No JSON endpoints (server-side rendering)
- Proper database structure with relationships
- Full CRUD implementation
- Secure login system
- Clean, commented code
- Responsive layout using Flexbox and Grid

## 📞 Support

For questions or issues with this academic project, refer to the Contact page within the application.

## 📄 License

Academic project - for educational purposes only.

---

**Developed as an academic assignment demonstrating web development skills with Node.js, Express, Handlebars, and SQLite3.**
