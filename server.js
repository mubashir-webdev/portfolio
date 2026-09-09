// =======================================================
// server.js - Express Backend for Muhammad Mubashir Portfolio
// =======================================================

const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// -------------------------------------------------------
// Middleware: Parse JSON and URL-encoded form data
// -------------------------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -------------------------------------------------------
// Serve static files from the "public" folder
// This serves index.html, CSS, JS, images, and the CV PDF
// -------------------------------------------------------
app.use(express.static(path.join(__dirname, "public")));

// -------------------------------------------------------
// API Route: POST /api/contact
// Receives: name, email, subject, message
// Currently logs the data. Add an email service here later.
// Example: Nodemailer, SendGrid, etc.
// -------------------------------------------------------
app.post("/api/contact", (req, res) => {
  const { name, email, subject, message } = req.body;

  // --- Basic server-side validation ---
  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: "All fields are required."
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address."
    });
  }

  // --- Log the contact submission (replace with email service later) ---
  console.log("\n📩 New Contact Form Submission:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`Name:    ${name}`);
  console.log(`Email:   ${email}`);
  console.log(`Subject: ${subject}`);
  console.log(`Message: ${message}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // TODO: Add email service here later.
  // Example with Nodemailer:
  // const transporter = nodemailer.createTransport({ ... });
  // await transporter.sendMail({ from: email, to: 'mubashir.code@gmail.com', subject, text: message });

  // --- Return success response ---
  return res.status(200).json({
    success: true,
    message: "Thank you! Your message has been received. I will get back to you shortly."
  });
});

// -------------------------------------------------------
// Fallback: Send index.html for all other GET routes
// -------------------------------------------------------
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// -------------------------------------------------------
// Start the server
// -------------------------------------------------------
app.listen(PORT, () => {
  console.log(`\n🚀 Portfolio server running at: http://localhost:${PORT}`);
  console.log(`📁 Serving static files from: ./public`);
  console.log(`📬 Contact API ready at: POST /api/contact\n`);
});
