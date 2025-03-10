const sqlite3 = require('sqlite3').verbose();

// Specify the path for the new database file
const dbPath = './database.db'; // Change the name if needed

// Initialize the database connection
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log(`Connected to the SQLite database at ${dbPath}.`);
    }
});

// Create tables if they don't exist
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        type TEXT,
        price REAL,
        quantity INTEGER
    )`, (err) => {
        if (err) {
            console.error('Error creating items table:', err.message);
        } else {
            console.log('Items table created or already exists.');
        }
    });

    db.run(`CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        phone TEXT
        address TEXT,
        city TEXT,
        postalCode TEXT,
        password TEXT
    )`, (err) => {
        if (err) {
            console.error('Error creating customers table:', err.message);
        } else {
            console.log('Customers table created or already exists.');
        }
    });
});

// Export the database connection
module.exports = db;
