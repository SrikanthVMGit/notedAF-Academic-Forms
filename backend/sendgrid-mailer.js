// Alternative email service using SendGrid
const sgMail = require('@sendgrid/mail');

// To use SendGrid:
// 1. npm install @sendgrid/mail
// 2. Get API key from SendGrid dashboard
// 3. Add SENDGRID_API_KEY to your .env file

const sendEmailWithSendGrid = async (to, otp) => {
    try {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        const msg = {
            to: to,
            from: process.env.COMPANY_EMAIL,
            subject: 'OTP for NotedAF - Email Verification',
            text: `Your OTP to signup for NotedAF is: ${otp}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Welcome to NotedAF!</h2>
                    <p>Your OTP for email verification is:</p>
                    <div style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 3px; margin: 20px 0;">
                        ${otp}
                    </div>
                    <p style="color: #666;">This OTP is valid for 10 minutes.</p>
                </div>
            `,
        };

        await sgMail.send(msg);
        console.log('✅ Email sent via SendGrid');
        return true;
    } catch (error) {
        console.error('❌ SendGrid error:', error);
        return false;
    }
};

module.exports = { sendEmailWithSendGrid };