 
// const cron = require("node-cron");
// const Reminder = require("../models/Reminder");
// const User = require("../models/User");
// const sendEmail = require("../utils/sendEmail");


// const start = () => {
//   cron.schedule("* * * * *", async () => {
//     console.log("🔍 Checking for due reminders...");

//     const now = new Date();
//     const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);

//     try {
//       const dueReminders = await Reminder.find({
//         time: { $gte: oneMinuteAgo, $lte: now },
//       });

//       for (let reminder of dueReminders) {
//         const user = await User.findById(reminder.user);

//         if (!user || !user.email) continue;

//         const domain = new URL(reminder.url).hostname.replace("www.", "");

//         const timeStr = new Date(reminder.time).toLocaleString('en-IN', {
//         hour: '2-digit',
//         minute: '2-digit',
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric',
//         hour12: true,
//         timeZoneName: 'short' 
//       });

//         // Send the email
//         const subject = `Reminder: ${reminder.title}`;
//         const html = `
//           <h2>${reminder.title}</h2>
//           <p>${reminder.note || " "}</p>
//           ${
//             reminder.url
//               ? `<p><a href="${reminder.url}">🔗 Visit ${domain}</a></p>`
//               : ""
//           }
//           <p>Scheduled for: ${timeStr}</p>
//           <hr/>
//           <p><em>From PingMeBaby</em></p>
//         `;

//         await sendEmail(user.email, subject, html);
//       }
//     } catch (err) {
//       console.error("❌ Error in cron job:", err);
//     }
//   });

//   console.log("✅ Reminder CRON started");
// };

// module.exports = { start };






const cron = require("node-cron");
const Reminder = require("../models/Reminder");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

const start = () => {
  cron.schedule("* * * * *", async () => {
    console.log("=".repeat(50));
    console.log("🔍 Checking for due reminders...");

    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);

    // LOG: Current time
    console.log("⏰ Server time (UTC):", now.toISOString());
    console.log("🔍 Looking between:", oneMinuteAgo.toISOString(), "and", now.toISOString());

    try {
      // LOG: All reminders in DB
      const allReminders = await Reminder.find();
      console.log(`📊 Total reminders in DB: ${allReminders.length}`);
      if (allReminders.length > 0) {
        allReminders.forEach((r, i) => {
          console.log(`  ${i+1}. "${r.title}" - Time: ${r.time.toISOString()} - User: ${r.user}`);
        });
      }

      const dueReminders = await Reminder.find({
        time: { $gte: oneMinuteAgo, $lte: now },
      });

      // LOG: Due reminders found
      console.log(`✅ Found ${dueReminders.length} DUE reminders`);

      for (let reminder of dueReminders) {
        console.log(`📧 Processing: "${reminder.title}"`);
        
        const user = await User.findById(reminder.user);

        if (!user || !user.email) {
          console.log(`⚠️ Skipped - user not found or no email`);
          continue;
        }

        console.log(`✓ User found: ${user.email}`);

        const domain = new URL(reminder.url).hostname.replace("www.", "");

        const timeStr = new Date(reminder.time).toLocaleString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour12: true,
          timeZoneName: 'short' 
        });

        const subject = `Reminder: ${reminder.title}`;
        const html = `
          <h2>${reminder.title}</h2>
          <p>${reminder.note || " "}</p>
          ${
            reminder.url
              ? `<p><a href="${reminder.url}">🔗 Visit ${domain}</a></p>`
              : ""
          }
          <p>Scheduled for: ${timeStr}</p>
          <hr/>
          <p><em>From PingMeBaby</em></p>
        `;

        console.log(`📤 Sending email to ${user.email}...`);
        await sendEmail(user.email, subject, html);
        
        // Delete after sending
        await Reminder.findByIdAndDelete(reminder._id);
        console.log(`🗑️ Deleted reminder: ${reminder._id}`);
      }
      
      console.log("=".repeat(50));
    } catch (err) {
      console.error("❌ Error in cron job:", err);
    }
  });

  console.log("✅ Reminder CRON started");
};

module.exports = { start };