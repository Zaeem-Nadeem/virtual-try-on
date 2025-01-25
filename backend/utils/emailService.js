import nodemailer from 'nodemailer';

export const sendEmail = async (to, subject, text) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // Use your email service
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS, // Your email password or app password
    },
//     logger: true, // Enable logger
//   debug: true,
  });

  // Send the email
  await transporter.sendMail({
    from: process.env.EMAIL_USER, // Sender address
    to, // Receiver address
    subject, // Subject line
    text, // Plain text body
  });
};
