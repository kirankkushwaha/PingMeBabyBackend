 
const cron = require("node-cron");
const Reminder = require("../models/Reminder");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");


const start = () => {
  cron.schedule("* * * * *", async () => {
    console.log("🔍 Checking for due reminders...");

    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);

    try {
      const dueReminders = await Reminder.find({
        time: { $gte: oneMinuteAgo, $lte: now },
      });

      for (let reminder of dueReminders) {
        const user = await User.findById(reminder.user);

        if (!user || !user.email) continue;

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

        // Send the email
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

        await sendEmail(user.email, subject, html);
      }
    } catch (err) {
      console.error("❌ Error in cron job:", err);
    }
  });

  console.log("✅ Reminder CRON started");
};

module.exports = { start };
