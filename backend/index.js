const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
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

// Use cookie parser middleware
app.use(cookieParser());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import routes
const authRoutes = require('./routes/authRoutes');
const classroomRoutes = require('./routes/classroomRoutes');
const quizRoutes = require('./routes/quizRoutes');
const profileRoutes = require('./routes/profileRoutes');


// Use routes
app.use('/auth', authRoutes);
app.use('/class', classroomRoutes);
app.use('/quiz', quizRoutes);
app.use('/profile', profileRoutes);

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