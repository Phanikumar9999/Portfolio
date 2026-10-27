
const express = require("express");
const path = require("path");
const { Resend } = require("resend");

require("dotenv").config({
    path: path.join(__dirname, ".env")
});

const app = express();
const frontendPath = path.join(__dirname, "../frontend");

app.use(express.json());
app.use(express.static(frontendPath));

const resend = new Resend(process.env.RESEND_API_KEY);

app.get("/", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

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

        const { data, error } = await resend.emails.send({
            from: "Portfolio Contact <onboarding@resend.dev>",
            to: [process.env.EMAIL_USER],
            replyTo: email.trim(),
            subject: `Portfolio Contact: ${name.trim()}`,
            text: `Name: ${name.trim()}
Email: ${email.trim()}
Message: ${message.trim()}`
        });

        if (error) {
            console.error("Resend error:", error);
            return res.status(500).json({
                message: "Unable to send the message. Please try again."
            });
        }

        console.log("Email sent:", data.id);

        return res.json({
            message: "Your message was sent successfully!"
        });
    } catch (error) {
        console.error("Email error:", error.message);

        return res.status(500).json({
            message: "Unable to send the message. Please try again."
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Portfolio running on port ${PORT}`);
});
