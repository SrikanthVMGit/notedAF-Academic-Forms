const express = require('express');
const User = require('../models/userModel');
const Verification = require('../models/verificationModel');
const responseFunction = require('../utils/responseFunction');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authTokenHandler = require('../middlewares/checkAuthToken');

const mailer = async (recieveremail, code) => {
    try {
        // Remove any spaces from the app password
        const appPassword = process.env.GMAIL_APP_PASSWORD.replace(/\s+/g, '');
        
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.COMPANY_EMAIL,
                pass: appPassword
            }
        });

        let info = await transporter.sendMail({
            from: `"Team NotedAF" <${process.env.COMPANY_EMAIL}>`,
            to: recieveremail,
            subject: "OTP for NotedAF - Email Verification",
            text: `Your OTP to signup for NotedAF is: ${code}\n\nThis OTP is valid for 10 minutes.`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Welcome to NotedAF!</h2>
                    <p>Your OTP for email verification is:</p>
                    <div style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 3px; margin: 20px 0;">
                        ${code}
                    </div>
                    <p style="color: #666;">This OTP is valid for 10 minutes.</p>
                    <p style="color: #666;">If you didn't request this verification, please ignore this email.</p>
                </div>
            `,
        });

        console.log("✅ Email sent successfully!");
        console.log("Message ID: %s", info.messageId);
        return !!info.messageId;
    } catch (error) {
        console.error('❌ Email sending error:', error.message);
        // For testing purposes, log the OTP to console if email fails
        console.log(`🔐 TEST MODE - OTP for ${recieveremail}: ${code}`);
        
        // Return true in development to allow testing
        return process.env.NODE_ENV !== 'production';
    }
};

router.get('/', (req, res) => {
    res.json({
        message: 'Auth route home'
    });
});

router.post('/sendotp', async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
        return responseFunction(res, 400, "Email is required", null, false);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return responseFunction(res, 400, "Invalid email format", null, false);
    }

    try {
        await Verification.deleteMany({ email: email });
        const code = Math.floor(100000 + Math.random() * 900000);
        
        const newVerification = new Verification({
            email: email,
            code: code.toString()
        });

        await newVerification.save();
        
        const isSent = await mailer(email, code);
        if (!isSent) {
            return responseFunction(res, 500, "Failed to send OTP email. Please try again.", null, false);
        }

        return responseFunction(res, 200, "OTP sent successfully", null, true);
    } catch (err) {
        console.error('Send OTP Error:', err);
        return responseFunction(res, 500, "Internal server error", err.message, false);
    }
});

router.post('/register', async (req, res) => {
    const { name, email, password, otp, role } = req.body;
    if (!name || !email || !password || !otp || !role) {
        return responseFunction(res, 400, 'All fields are required', null, false);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return responseFunction(res, 400, 'Invalid email format', null, false);
    }

    if (password.length < 6) {
        return responseFunction(res, 400, 'Password should be at least 6 characters long', null, false);
    }
    
    try {
        let user = await User.findOne({ email });
        let verificationQueue = await Verification.findOne({ email });

        if (user) {
            return responseFunction(res, 400, 'User already exists', null, false);
        }

        if (!verificationQueue) {
            return responseFunction(res, 400, 'Please send OTP first', null, false);
        }
        
        const isMatch = await bcrypt.compare(otp.toString(), verificationQueue.code);
        if (!isMatch) {
            return responseFunction(res, 400, 'Invalid OTP', null, false);
        }

        user = new User({
            name,
            email,
            password,
            role,
        });

        await user.save();
        await Verification.deleteOne({ email });

        const authToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
        const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET_KEY, { expiresIn: '10d' });

        res.cookie('authToken', authToken, { httpOnly: true, secure: true, sameSite: 'none' });
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'none' });

        user.password = undefined;
        return responseFunction(res, 200, 'Registered successfully', { user, authToken, refreshToken }, true);

    } catch (err) {
        return responseFunction(res, 500, 'Internal server error', err, false);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return responseFunction(res, 400, 'Invalid credentials', null, false);
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return responseFunction(res, 400, 'Invalid credentials', null, false);
        }
        
        const authToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
        const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET_KEY, { expiresIn: '10d' });

        user.password = undefined;

        res.cookie('authToken', authToken, { httpOnly: true, secure: true, sameSite: 'none' });
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'none' });

        return responseFunction(res, 200, 'Logged in successfully', { user, authToken, refreshToken }, true);

    } catch (err) {
        return responseFunction(res, 500, 'Internal server error', err, false);
    }
});

router.get('/checklogin', authTokenHandler, async (req, res, next) => {
    console.log('check login', req.message);
    res.json({
        ok: req.ok,
        message: req.message,
        userId: req.userId
    });
});

router.get('/getuser', authTokenHandler, async (req, res, next) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return responseFunction(res, 400, 'User not found', null, false);
        }
        return responseFunction(res, 200, 'User found', user, true);
    } catch (err) {
        return responseFunction(res, 500, 'Internal server error', err, false);
    }
});

router.get('/logout', authTokenHandler, async (req, res, next) => {
    res.clearCookie('authToken');
    res.clearCookie('refreshToken');
    res.json({
        ok: true,
        message: 'Logged out successfully'
    });
});

module.exports = router;
