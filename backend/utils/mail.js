import nodemailer from 'nodemailer';

// Set up nodemailer transport for sending emails
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // SMTP host
  port: process.env.SMTP_PORT, // SMTP port
  secure: true, // Use TLS
  auth: {
    user: process.env.SMTP_USER, // SMTP username
    pass: process.env.SMTP_PASS  // SMTP password
  }
});

// Function to send email
export const sendMail = async (to, subject, text, html) => {
  const mailOptions = {
    from: process.env.SMTP_FROM, // Sender address
    to,                          // Recipient address
    subject,                     // Subject line
    text,                        // Plain text body
    html                         // HTML body (optional)
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
  } catch (error) {
    console.error(`Error sending email: ${error}`);
  }
};
