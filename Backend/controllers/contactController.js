const nodemailer = require("nodemailer");
const Message = require("../models/Message");

exports.sendMail = async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  try {
    // ✅ Save to MongoDB
    const savedMessage = new Message({ name, email, phone, subject, message });
    await savedMessage.save();

    // ✅ Send Email
    const transporter = nodemailer.createTransport({
      service: "Yahoo",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Portfolio Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: `Portfolio Contact Form: ${subject}`,
      html: `
        <h3>New Message from Portfolio</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Email sent and message stored!" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Failed to send/store message." });
  }
};

