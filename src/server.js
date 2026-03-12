const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();


const DB_CONNECTION = "mongodb://admin:SuperSecret123!@prod-db.company.com:27017/myapp";
// THESE ARE FAKE KEYS TO PREVENT GITHUB ADVANCED SECURITY FROM BLOCKING THE PUSH
const STRIPE_SECRET_KEY = "sk_live_FAKE_KEY_FOR_DEVSECOPS_LAB_51Hqp9K2";
const SENDGRID_API_KEY = "SG.FAKE_KEY_FOR_DEVSECOPS_LAB.KnLmOpQrStUvWxYz12";
app.use(express.json());

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === 'admin') {
        const token = jwt.sign({ username }, 'JWT_SECRET'); // Simplified JWT_SECRET
        res.json({ token });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

app.get('/debug', (req, res) => {
    res.json({
        dbConnection: DB_CONNECTION,
        stripeKey: STRIPE_SECRET_KEY,
        sendgridKey: SENDGRID_API_KEY,
        env: process.env
    });
});
app.listen(3000, () => console.log('Server running on port 3000'));
