const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'HooperFits2@gmail.com',
    pass: 'your_app_password'
  }
});

router.post('/send-contact-email', async (req, res) => {
  try {
    const { fullname, email, message, toEmail } = req.body;

    if (!fullname || !email || !message) {
      return res.status(400).json({ 
        message: 'Full name, email, and message are required.' 
      });
    }

    const mailOptions = {
      from: email,
      to: toEmail || 'HooperFits2@gmail.com',
      subject: `Contact from ${fullname}`,
      text: `
Name: ${fullname}
Email: ${email}

Message:
${message}
      `,
      replyTo: email
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ 
      message: 'Message sent successfully!' 
    });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      message: 'Failed to send message. Please try again later.' 
    });
  }
});

module.exports = router;