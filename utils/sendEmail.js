 
// const nodemailer = require("nodemailer");

// const sendEmail = async (to, subject, htmlContent) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     const mailOptions = {
//       from: `"PingMeBaby" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       html: htmlContent,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log("✅ Email sent to:", to);
//   } catch (error) {
//     console.error("❌ Email failed to send:", error);
//   }
// };

// module.exports = sendEmail;





// const nodemailer = require("nodemailer");

// const sendEmail = async (to, subject, htmlContent) => {
//   console.log("  📧 sendEmail called for:", to);
//   console.log("  ENV check - EMAIL_USER:", process.env.EMAIL_USER ? "✓" : "✗");
//   console.log("  ENV check - EMAIL_PASS:", process.env.EMAIL_PASS ? "✓" : "✗");
  
//   try {
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     const mailOptions = {
//       from: `"PingMeBaby" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       html: htmlContent,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log("  ✅ Email sent successfully to:", to);
//   } catch (error) {
//     console.error("  ❌ Email failed to send:", error.message);
//     console.error("  Error code:", error.code);
//   }
// };

// module.exports = sendEmail;


const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, htmlContent) => {
  console.log("  📧 sendEmail called for:", to);
  console.log("  ENV check - EMAIL_USER:", process.env.EMAIL_USER ? "✓" : "✗");
  console.log("  ENV check - EMAIL_PASS:", process.env.EMAIL_PASS ? "✓" : "✗");
  
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verify connection
    console.log("  🔌 Verifying SMTP connection...");
    await transporter.verify();
    console.log("  ✓ SMTP connection verified");

    const mailOptions = {
      from: `"PingMeBaby" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
    };

    console.log("  📤 Sending email...");
    const info = await transporter.sendMail(mailOptions);
    console.log("  ✅ Email sent successfully!");
    console.log("  Message ID:", info.messageId);
    console.log("  Response:", info.response);
  } catch (error) {
    console.error("  ❌ Email failed to send!");
    console.error("  Error message:", error.message);
    console.error("  Error code:", error.code);
    console.error("  Full error:", JSON.stringify(error, null, 2));
  }
};

module.exports = sendEmail;