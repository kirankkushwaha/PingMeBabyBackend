 
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





const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, htmlContent) => {
  console.log("  📧 sendEmail called for:", to);
  console.log("  ENV check - EMAIL_USER:", process.env.EMAIL_USER ? "✓" : "✗");
  console.log("  ENV check - EMAIL_PASS:", process.env.EMAIL_PASS ? "✓" : "✗");
  
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"PingMeBaby" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log("  ✅ Email sent successfully to:", to);
  } catch (error) {
    console.error("  ❌ Email failed to send:", error.message);
    console.error("  Error code:", error.code);
  }
};

module.exports = sendEmail;