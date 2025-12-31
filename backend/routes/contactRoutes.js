const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const Contact = require("../models/Contact");
const { protect, adminOnly } = require("../middlewares/authMiddleware");

// 📬 USER — Send message + auto-reply
router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    // ✅ Save message in DB
    await Contact.create({ name, email, message });

    // ✅ Setup transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.CONTACT_EMAIL,
        pass: process.env.CONTACT_PASSWORD,
      },
    });

    // ✅ Mail to admin
    const adminMail = {
      from: `"OrganicMart Contact" <${process.env.CONTACT_EMAIL}>`,
      to: process.env.CONTACT_EMAIL,
      subject: `🌱 New Message from ${name}`,
      text: `You have received a new contact message:\n\nName: ${name}\nEmail: ${email}\nMessage:\n${message}`,
    };

    // ✅ Auto reply to user
    const autoReply = {
      from: `"OrganicMart" <${process.env.CONTACT_EMAIL}>`,
      to: email,
      subject: "🌿 Thank You for Contacting OrganicMart!",
      html: `
        <div style="font-family: Arial; background: #f7fdf9; padding: 20px; border-radius: 10px;">
          <h2 style="color:#2c6e49;">Hi ${name},</h2>
          <p>Thank you for reaching out to <b>OrganicMart</b>! 🌱</p>
          <p>We’ve received your message and our team will get back to you shortly.</p>
          <blockquote style="border-left:4px solid #2c6e49; margin:1rem 0; padding-left:10px;">
            <i>${message}</i>
          </blockquote>
          <p>Warm regards,<br><b>OrganicMart Team</b></p>
        </div>
      `,
    };

    await Promise.all([
      transporter.sendMail(adminMail),
      transporter.sendMail(autoReply),
    ]);

    res.json({ success: true, message: "Message sent successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to send message" });
  }
});


// 🧾 ADMIN — Get all messages
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

// ❌ ADMIN — Delete a message
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: "Message deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete message" });
  }
});

module.exports = router;
