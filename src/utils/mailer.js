// This file sets up and exports a reusable function to send emails
import nodemailer from "nodemailer";
// const nodemailer = require("nodemailer");

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: "Gmail", // You can replace this with SendGrid, Mailgun, etc.
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS, // Your Gmail App Password (not normal password)
  },
});

// Send OTP email
const sendOtpMail = async (to, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender's address
    to, // Recipient's email
    subject: "OTP for Note App Registration", // Email subject
    html: `<h2>Your OTP is ${otp}</h2><p>This OTP is valid for 5 minutes.</p>`, // Email body (HTML)
  };

  await transporter.sendMail(mailOptions); // Send the email
};

export {
     sendOtpMail 
    };
