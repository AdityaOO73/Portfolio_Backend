const nodemailer = require("nodemailer");
const Message = require("../models/Message");

exports.sendMail = async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  try {
    const savedMessage = await new Message({ name, email, phone, subject, message }).save();

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
      subject: `New message: ${subject}`,
      html: `
        <h3>New Message from Portfolio</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Message sent and saved!" });
  } catch (err) {
    console.error("🔥 Error:", err);
    res.status(500).json({ success: false, message: "Failed to send/store message." });
  }
};


