const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();
const path = require("path");

const app = express();

app.use(express.json());

// Serve existing frontend files
app.use(express.static(__dirname));

// Email configuration
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Contact form API
app.post("/api/contact", async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof message !== "string" ||
            !name.trim() ||
            !email.trim() ||
            !message.trim()
        ) {
            return res.status(400).json({
                message: "Please fill in all fields."
            });
        }

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            replyTo: email.trim(),
            subject: `Portfolio Contact: ${name.trim()}`,
            text: `Name: ${name.trim()}\nEmail: ${email.trim()}\nMessage: ${message.trim()}`
        });

        res.json({
            message: "Your message was sent successfully!"
        });

    } catch (error) {
        console.error("Email error:", error.message);

        res.status(500).json({
            message: "Unable to send the message. Please try again."
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Portfolio running on port ${PORT}`);
});