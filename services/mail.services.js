import nodemailer from "nodemailer";
import  dotenv from "dotenv";
dotenv.config()

// transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // 🔥 FIX: use 'service' instead of host
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});


const sendMail = async ({ userEmail, message, name }) => {
  await transporter.sendMail({
    from: process.env.EMAIL, // Your Gmail
    to: userEmail,  
    subject: `New Feedback from ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>📩 New Feedback Received</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>User Email:</strong> ${userEmail}</p>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 8px;">
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        </div>
      </div>
    `,
  });
};

export default sendMail;