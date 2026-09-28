const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

/**
 * Send email
 * @param {Object} options - { to, subject, html }
 */
async function sendEmail({ to, subject, html }) {
    try {
        const info = await transporter.sendMail({
            from: `"عطور أم القرى" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html
        });
        console.log('Email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Email error:', error);
        return { success: false, error: error.message };
    }
}

module.exports = { sendEmail };
