// Alternative email configuration for testing
const nodemailer = require('nodemailer');

// For development/testing - creates a test account
const createTestMailer = async () => {
    // Create a test account
    let testAccount = await nodemailer.createTestAccount();
    
    return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass
        }
    });
};

// For production - Gmail configuration
const createGmailMailer = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.COMPANY_EMAIL,
            pass: process.env.GMAIL_APP_PASSWORD.replace(/\s+/g, '')
        }
    });
};

module.exports = {
    createTestMailer,
    createGmailMailer
};