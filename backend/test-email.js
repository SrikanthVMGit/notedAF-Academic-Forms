// Quick setup script to test email functionality
const nodemailer = require('nodemailer');

async function testEmail() {
    // Option 1: Test with Ethereal Email (for development)
    console.log('Creating test account...');
    let testAccount = await nodemailer.createTestAccount();
    
    let transporter = nodemailer.createTransporter({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass
        }
    });

    let info = await transporter.sendMail({
        from: '"Test NotedAF" <test@notedaf.com>',
        to: 'test@example.com',
        subject: 'Test OTP Email',
        text: 'Your test OTP is: 123456',
        html: '<b>Your test OTP is: 123456</b>'
    });

    console.log('✅ Test email sent!');
    console.log('Message ID:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
}

testEmail().catch(console.error);