const nodemailer = require("nodemailer");

// Configure Email Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL || "kritimakhatri123@gmail.com",
    pass: process.env.SMTP_PASSWORD || "kajg edhy dlei qxfv",
  },
});

// Send OTP Function
const sendEmail = async (options) => {
  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: options.email,
    subject: options.subject || "OTP Verification",
    text: options.message || "Your OTP is " + options.otp,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending OTP email:", error);
    return false;
  }
};

module.exports = sendEmail;
