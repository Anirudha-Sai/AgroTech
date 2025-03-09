const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors middleware
const db = require('./database'); // Assuming you have a database setup
const Razorpay = require('razorpay');
const path = require('path'); // For serving static files
require('dotenv').config(); // Load environment variables

const { body, validationResult } = require('express-validator');


const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Razorpay instance configuration (ensure you have environment variables in your .env file)
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID, // Your Razorpay key_id
    key_secret: process.env.RAZORPAY_KEY_SECRET, // Your Razorpay key_secret
});

// Serve static files (home.html)
app.use(express.static(path.join(__dirname, 'public')));

// Route to create an order using Razorpay
app.post('/create-order', async (req, res) => {
    const { price } = req.body; // Make sure price is coming from the request body
    const options = {
        amount: price * 100, // Razorpay requires amount in paise (1 INR = 100 paise)
        currency: 'INR',
    };

    try {
        const order = await razorpay.orders.create(options); // Create Razorpay order
        res.status(200).json(order); // Send back the order details as JSON
    } catch (error) {
        res.status(500).json({ message: 'Error creating order', error });
    }
});

// Route to verify if payment is completed
app.post('/verify-payment', async (req, res) => {
    const { razorpay_payment_id } = req.body;

    try {
        const paymentDocument = await razorpay.payments.fetch(razorpay_payment_id);
        if (paymentDocument.status === 'captured') {
            res.status(200).send('Payment successful');
        } else {
            res.status(400).send('Payment failed or pending');
        }
    } catch (error) {
        res.status(500).json({ message: 'Error verifying payment', error });
    }
});

// Route to handle form submissions and add data to the database
app.post('/add-item', (req, res) => {
    const { itemName, itemType, price, quantity } = req.body;

    // Insert the item into the database
    db.run(
        `INSERT INTO items (name, type, price, quantity) VALUES (?, ?, ?, ?)`,
        [itemName, itemType, price, quantity],
        function (err) {
            if (err) {
                return res.status(500).send('Error inserting data');
            }
            res.status(200).send('Item added successfully');
        }
    );
});

app.post('/login', (req, res) => {
    const { phone, password } = req.body;

    // Check if the customer exists with the given phone number
    const query = `SELECT * FROM customers WHERE phone = ?`;
    db.get(query, [phone], (err, row) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal server error.');
        }

        // If customer does not exist or password is invalid, send a generic warning
        if (!row || row.password !== password) {
            return res.status(400).json({ message: 'Invalid phone number or password.' });
        }

        // Login successful
        res.redirect('http://127.0.0.1:5501/Consumer/home.html');
    });
});




// Route to add customer data to the database
app.post('/add-customer', [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('password').notEmpty().withMessage('Password is required'),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array().map(err => err.msg).join(', ') });
    }

    const { name, email, phone, password, address, city, postalCode } = req.body;

    // Check if the customer already exists
    const checkQuery = `SELECT * FROM customers WHERE email = ? OR phone = ?`;
    db.get(checkQuery, [email, phone], (err, row) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error checking for existing customer.' });
        }

        // If customer exists, send a response
        if (row) {
            return res.status(400).json({ message: 'Customer already exists with this email or phone number.' });
        }

        // Insert the new customer if not exists
        const query = `INSERT INTO customers (name, email, phone, password, address, city, postalCode) 
                       VALUES (?, ?, ?, ?, ?, ?, ?)`;
        db.run(query, [name, email, phone, password, address, city, postalCode], function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error saving customer data.' });
            }
            // Redirect to login.html from the server side
            res.status(200).json({ message: 'Customer added successfully!'});
        });
    });
});




// Route to get all items
app.get('/items', (req, res) => {
    db.all(`SELECT * FROM items`, (err, rows) => {
        if (err) {
            return res.status(500).send('Error retrieving data');
        }
        res.json(rows);
    });
});

// Route for /customers
app.get('/customers', (req, res) => {
    db.all('SELECT * FROM customers', (err, rows) => {
        if (err) {
            return res.status(500).send('Error retrieving data');
        }
        res.json(rows);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
