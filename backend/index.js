const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT || 5000;  // Ensure default port in case .env is missing

require('./db');

const allowedOrigins = [process.env.FRONTEND_URL]; // Ensure this includes the correct frontend URL

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true
    })
);

// Use express built-in json parser instead of body-parser
app.use(express.json());

// Update cookie settings for local dev (use secure: true only in production)
app.use(cookieParser({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',  // Use secure cookies in production
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 7,
    signed: true
}));


// Import routes
const authRoutes = require('./routes/authRoutes');
const classroomRoutes = require('./routes/classroomRoutes');
const quizRoutes = require('./routes/quizRoutes');


// Use routes
app.use('/auth', authRoutes);
app.use('/class', classroomRoutes);
app.use('/quiz', quizRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/getuserdata', (req, res) => {
    res.send('Harshal Jain, 45, Male');
});

// Start the server
app.listen(port, () => {
    console.log(`Noted AF backend app listening on port ${port}`);
});